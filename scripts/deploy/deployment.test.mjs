import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, existsSync, rmSync, rmdirSync, symlinkSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { configuration, validateStaticDirectory, publish } from './publish.mjs';
import { validateWorkflow, validatePublicationGraph } from './policy.mjs';

const source = readFileSync('.github/workflows/update-site.yml', 'utf8');
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const bash = process.env.FDWEB_BASH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
const unix = value => process.platform === 'win32' && /^[A-Za-z]:/.test(value) ? '/' + value[0].toLowerCase() + value.slice(2).replaceAll('\\', '/') : value;
const env = {
  DEPLOY_HOST: 'example.invalid', DEPLOY_USER: 'deploy', DEPLOY_ROOT: '/srv/fedrv', DEPLOY_URL: 'https://example.invalid',
  DEPLOY_SSH_KEY: '-----BEGIN PRIVATE KEY-----\nnot-a-real-key\n-----END PRIVATE KEY-----',
  DEPLOY_KNOWN_HOSTS: 'example.invalid ssh-ed25519 not-a-real-public-key',
  GITHUB_SHA: 'a'.repeat(40), GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '1',
};
const b = { ...env, GITHUB_SHA: 'b'.repeat(40), GITHUB_RUN_ATTEMPT: '2' };

test('workflow permits only the reviewed manual build/publication graph', () => {
  validateWorkflow(source, manifest);
  assert.equal(validatePublicationGraph().length, 7);
  for (const event of ['push', 'pull_request', 'schedule', 'workflow_run', 'repository_dispatch']) {
    assert.throws(() => validateWorkflow(source.replace('  workflow_dispatch:', `  ${event}:`), manifest));
  }
  assert.throws(() => validateWorkflow(source.replace('npm run build', 'npm run verify:site'), manifest));
  assert.throws(() => validateWorkflow(source.replace('contents: read', 'contents: write'), manifest));
  assert.throws(() => validateWorkflow(source, { ...manifest, scripts: { ...manifest.scripts, prebuild: 'npm test' } }));
});

test('target and release identity reject missing/unsafe values before SSH', () => {
  assert.equal(configuration(env).release, 'a'.repeat(40) + '-123-1');
  for (const [name, value] of [['DEPLOY_HOST', '-oProxyCommand=bad'], ['DEPLOY_USER', 'user;touch bad'],
    ['DEPLOY_ROOT', '/srv/../etc'], ['DEPLOY_ROOT', '/'], ['DEPLOY_PORT', '65536'],
    ['DEPLOY_URL', 'http://example.invalid'], ['DEPLOY_URL', 'https://user:password@example.invalid'],
    ['GITHUB_SHA', 'main;command'], ['DEPLOY_SSH_KEY', ''], ['DEPLOY_KNOWN_HOSTS', '']]) {
    assert.throws(() => configuration({ ...env, [name]: value }), name);
  }
});

test('real package/remote-script activation and negative paths preserve the previous release', async () => {
  mkdirSync('.local', { recursive: true });
  const fixture = mkdtempSync(resolve('.local/publication-'));
  const target = join(fixture, 'target'); mkdirSync(target);
  const remoteSource = readFileSync('scripts/deploy/remote.sh', 'utf8');
  const remoteFile = join(fixture, 'remote.sh'); writeFileSync(remoteFile, remoteSource);
  const incomplete = join(fixture, 'incomplete'); mkdirSync(incomplete); writeFileSync(join(incomplete, 'index.html'), 'Incomplete');
  const linked = join(fixture, 'linked'); mkdirSync(linked);
  for (const name of ['index.html', '404.html']) writeFileSync(join(linked, name), 'Fixture');
  symlinkSync('index.html', join(linked, 'linked.html'), 'file');
  let fault = '', temporaryKey, markerRelease;
  const execute = (program, args, input) => {
    if (program === 'tar') {
      let archiveArgs = [...args];
      if (fault === 'incomplete' || fault === 'symlink') archiveArgs[archiveArgs.indexOf('-C') + 1] = fault === 'incomplete' ? incomplete : linked;
      if (fault === 'unsafe') archiveArgs.unshift('--transform=s,^\\./,../,');
      const result = spawnSync(bash, ['-c', 'tar "$@"', 'fdweb-tar', ...archiveArgs.map(unix)], { encoding: 'utf8', env: { ...process.env, MSYS: 'winsymlinks:nativestrict' } });
      assert.equal(result.status, 0, result.stderr); return result.stdout;
    }
    assert(args.includes('StrictHostKeyChecking=yes'));
    temporaryKey = args[args.indexOf('-i') + 1];
    assert(existsSync(temporaryKey));
    if (program === 'scp') {
      if (fault === 'upload') throw Error('Simulated upload failure');
      const remotePath = args.at(-1).split(':')[1];
      assert(remotePath.startsWith(env.DEPLOY_ROOT + '/incoming/'));
      const destination = join(target, remotePath.slice(env.DEPLOY_ROOT.length));
      assert(destination.startsWith(target + sep));
      copyFileSync(args.at(-2), destination);
      if (fault === 'checksum') writeFileSync(destination, 'corrupted transfer');
      return '';
    }
    assert.equal(program, 'ssh'); assert.equal(input, remoteSource);
    const [, , , mode, root, release, checksum] = args.at(-1).split(' ');
    assert.equal(root, env.DEPLOY_ROOT);
    const result = spawnSync(bash, [unix(remoteFile), mode, unix(target), release, ...(checksum ? [checksum] : [])], {
      encoding: 'utf8', env: { ...process.env, MSYS: 'winsymlinks:nativestrict' },
    });
    if (result.status !== 0) throw Error(result.stderr || 'Remote failure');
    if (mode === 'activate' && fault === 'lost-ack') throw Error('Simulated connection loss after activation');
    return result.stdout;
  };
  const options = {
    execute, pause: async () => {},
    request: async () => ({ ok: true, json: async () => fault === 'marker' ? {} : markerRelease }),
  };
  const current = () => JSON.parse(readFileSync(join(target, 'current', 'deployment.json'), 'utf8')).release;
  try {
    // Run the actual production publisher with only its network boundary replaced.
    validateStaticDirectory(resolve('dist'));
    fault = 'marker';
    await assert.rejects(publish({ ...env, GITHUB_RUN_ATTEMPT: '3' }, options));
    assert(!existsSync(join(target, 'current')), 'Failed first publication removes only its own pointer');
    assert(!existsSync(temporaryKey));
    fault = '';
    markerRelease = { commit: env.GITHUB_SHA, release: configuration(env).release };
    await publish(env, options);
    const previous = current();
    assert(!existsSync(temporaryKey), 'Private key removed after success');
    for (const [index, scenario] of ['upload', 'checksum', 'incomplete', 'symlink', 'unsafe', 'marker', 'lost-ack'].entries()) {
      fault = scenario;
      await assert.rejects(publish({ ...b, GITHUB_RUN_ATTEMPT: String(index + 10) }, options));
      assert.equal(current(), previous, `${scenario} must preserve/restore the old site`);
      assert(!existsSync(temporaryKey), 'Private key removed after failure');
    }
    fault = '';
    markerRelease = { commit: b.GITHUB_SHA, release: configuration(b).release };
    await publish(b, options);
    assert.equal(current(), configuration(b).release);
    assert(existsSync(join(target, 'releases', previous, 'index.html')), 'Previous release retained');
    const stale = spawnSync(bash, [unix(remoteFile), 'rollback', unix(target), previous], { encoding: 'utf8', env: { ...process.env, MSYS: 'winsymlinks:nativestrict' } });
    assert.notEqual(stale.status, 0); assert.equal(current(), configuration(b).release, 'An old run cannot overwrite a newer release');
    mkdirSync(join(target, '.publish-lock'));
    const locked = spawnSync(bash, [unix(remoteFile), 'rollback', unix(target), configuration(b).release], { encoding: 'utf8', env: { ...process.env, MSYS: 'winsymlinks:nativestrict' } });
    assert.notEqual(locked.status, 0); assert.equal(current(), configuration(b).release);
    rmdirSync(join(target, '.publish-lock'));
    const rollback = spawnSync(bash, [unix(remoteFile), 'rollback', unix(target), configuration(b).release], { encoding: 'utf8', env: { ...process.env, MSYS: 'winsymlinks:nativestrict' } });
    assert.equal(rollback.status, 0, rollback.stderr); assert.equal(current(), previous);
  } finally {
    assert(fixture.startsWith(resolve('.local') + sep));
    rmSync(fixture, { recursive: true, force: true });
  }
});
