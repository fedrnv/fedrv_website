import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

assert(process.env.npm_execpath, 'Use npm run verify:clean');
const root = process.cwd();
const local = resolve('.local');
mkdirSync(local, { recursive: true });
const fixture = mkdtempSync(join(local, 'clean-checkout-'));
const roots = ['src', 'public', 'scripts', 'docs', 'package.json', 'package-lock.json', '.npmrc', '.nvmrc', 'astro.config.mjs', 'tsconfig.json', 'README.md', 'DEVELOPMENT.md'];
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
function paths(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? paths(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const manifest = {};
const results = [];
try {
  for (const path of roots) cpSync(resolve(path), join(fixture, path), { recursive: true });
  for (const path of paths(fixture)) {
    const name = relative(fixture, path).replaceAll('\\', '/');
    manifest[name] = digest(path);
    assert.equal(manifest[name], digest(resolve(name)), `Snapshot mismatch: ${name}`);
  }
  for (const args of [['ci', '--no-audit', '--no-fund'], ['run', 'check'], ['run', 'build'], ['run', 'verify:bootstrap'], ['run', 'verify:site']]) {
    console.log('Clean snapshot: npm ' + args.join(' '));
    const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
      cwd: fixture, encoding: 'utf8', timeout: 180000,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', FDWEB_CONTENT_DIR: '', FDWEB_CACHE_DIR: '', FDWEB_COMPONENT_FIXTURE: '' },
    });
    results.push({ command: 'npm ' + args.join(' '), status: result.status, output: result.stdout + result.stderr });
    assert.equal(result.status, 0, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  }
  for (const [path, hash] of Object.entries(manifest)) assert.equal(digest(resolve(root, path)), hash, `Candidate changed during gate: ${path}`);
  writeFileSync(resolve('.local/clean-verification.json'), JSON.stringify({ result: 'PASS', created_at: new Date().toISOString(), files: manifest,
    commands: results.map(({ command, status }) => ({ command, exit_code: status })), fixture: 'Disposable byte-matched source snapshot, no node_modules/cache copied' }, null, 2)+'\n');
  console.log('PASS: clean install/typecheck/build/route checks in a byte-matched disposable snapshot; .local/clean-verification.json');
} finally {
  assert(fixture.startsWith(local + sep), 'Cleanup must stay below the owned local workspace');
  rmSync(fixture, { recursive: true, force: true, maxRetries: 3, retryDelay: 500 });
}
