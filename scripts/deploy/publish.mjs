import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, lstatSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function configuration(env) {
  const required = name => { if (!env[name]?.trim()) throw Error(`Configure ${name} in the production GitHub environment`); return env[name].trim(); };
  const host = required('DEPLOY_HOST'), user = required('DEPLOY_USER'), root = required('DEPLOY_ROOT');
  const port = env.DEPLOY_PORT || '22';
  if (!/^[A-Za-z0-9][A-Za-z0-9.-]*$/.test(host)) throw Error('DEPLOY_HOST must be a DNS name or IPv4 address');
  if (!/^[a-z_][a-z0-9_-]*$/i.test(user)) throw Error('Invalid DEPLOY_USER');
  if (!/^(\/[A-Za-z0-9._-]+){2,}$/.test(root) || root.split('/').some(s => s === '.' || s === '..')) throw Error('DEPLOY_ROOT must be an absolute path with at least two safe segments');
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw Error('Invalid DEPLOY_PORT');
  const url = new URL(required('DEPLOY_URL'));
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('DEPLOY_URL must be an HTTPS origin');
  const commit = required('GITHUB_SHA'), run = required('GITHUB_RUN_ID'), attempt = required('GITHUB_RUN_ATTEMPT');
  if (!/^[a-f0-9]{40}$/.test(commit) || !/^\d+$/.test(run) || !/^\d+$/.test(attempt)) throw Error('Invalid GitHub release identity');
  const key = required('DEPLOY_SSH_KEY'), knownHosts = required('DEPLOY_KNOWN_HOSTS');
  if (!key.includes('PRIVATE KEY-----') || /\n\s*\n/.test(knownHosts)) throw Error('Invalid SSH key or known-hosts configuration');
  return { host, user, root, port, url, commit, release: `${commit}-${run}-${attempt}`, key, knownHosts };
}

export function validateStaticDirectory(directory) {
  for (const name of ['index.html', '404.html']) if (!lstatSync(join(directory, name)).isFile()) throw Error(`Missing ${name}`);
  function visit(path) {
    for (const entry of readdirSync(path)) {
      if (!/^[A-Za-z0-9_.-]+$/.test(entry) || entry === '.' || entry === '..') throw Error('Unsupported static filename');
      const full = join(path, entry), stat = lstatSync(full);
      if (stat.isSymbolicLink()) throw Error('Static output must not contain symlinks');
      if (stat.isDirectory()) visit(full);
      else if (!stat.isFile()) throw Error('Only static regular files may be published');
    }
  }
  visit(directory);
  if (readdirSync(directory).includes('deployment.json')) throw Error('deployment.json is reserved for the release marker');
}

export async function publish(env = process.env, { execute, request = fetch, pause = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  const config = configuration(env);
  const directory = resolve('dist');
  validateStaticDirectory(directory);
  const scratch = mkdtempSync(join(tmpdir(), 'fedrv-publish-'));
  const run = (program, args, input) => {
    if (execute) return execute(program, args, input);
    const result = spawnSync(program, args, { input, encoding: 'utf8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe'] });
    if (result.status !== 0) throw Error(`${program} failed (${result.status ?? result.error?.code}): ${result.stderr || ''}`);
    return result.stdout;
  };
  let activationAttempted = false;
  try {
    mkdirSync(join(scratch, 'ssh'), { mode: 0o700 });
    const keyFile = join(scratch, 'ssh', 'key'), hostsFile = join(scratch, 'ssh', 'known_hosts');
    writeFileSync(keyFile, config.key + '\n', { mode: 0o600 });
    writeFileSync(hostsFile, config.knownHosts + '\n', { mode: 0o600 });
    writeFileSync(join(scratch, 'deployment.json'), JSON.stringify({ commit: config.commit, release: config.release }) + '\n');
    const archive = join(scratch, 'site.tar.gz');
    run('tar', ['-czf', archive, '-C', directory, '.', '-C', scratch, 'deployment.json']);
    const checksum = createHash('sha256').update(readFileSync(archive)).digest('hex');
    const options = ['-i', keyFile, '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${hostsFile}`, '-o', 'ConnectTimeout=15'];
    const remoteScript = readFileSync('scripts/deploy/remote.sh', 'utf8');
    const remote = mode => run('ssh', [...options, '-p', config.port, `${config.user}@${config.host}`,
      `bash -s -- ${mode} ${config.root} ${config.release}${mode === 'activate' ? ' ' + checksum : ''}`], remoteScript);
    remote('prepare');
    run('scp', [...options, '-P', config.port, archive, `${config.user}@${config.host}:${config.root}/incoming/${config.release}/site.tar.gz`]);
    activationAttempted = true;
    remote('activate');
    let verified = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const response = await request(new URL(`/deployment.json?release=${config.release}`, config.url), { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000) });
        if (response.ok) { const marker = await response.json(); verified = marker.commit === config.commit && marker.release === config.release; }
      } catch { /* Bounded package-marker retry; no product acceptance suites in Actions. */ }
      if (verified) break;
      if (attempt < 7) await pause(2000);
    }
    if (!verified) throw Error('The public release marker did not match; restoring the previous release');
    console.log(`Published ${config.commit} to ${config.url.origin}`);
  } catch (error) {
    if (activationAttempted) {
      try {
        const keyFile = join(scratch, 'ssh', 'key'), hostsFile = join(scratch, 'ssh', 'known_hosts');
        run('ssh', ['-i', keyFile, '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${hostsFile}`, '-o', 'ConnectTimeout=15', '-p', config.port,
          `${config.user}@${config.host}`, `bash -s -- rollback ${config.root} ${config.release}`], readFileSync('scripts/deploy/remote.sh', 'utf8'));
      } catch (recovery) { throw new AggregateError([error, recovery], 'Publication failed and automatic recovery could not be confirmed; inspect the target before retrying'); }
    }
    throw error;
  } finally {
    // Remove only this invocation's exact mkdtemp directory, including its private key.
    rmSync(scratch, { recursive: true, force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await publish().catch(error => {
    console.error(error.message);
    if (error instanceof AggregateError) for (const cause of error.errors) console.error(cause.message);
    process.exitCode = 1;
  });
}
