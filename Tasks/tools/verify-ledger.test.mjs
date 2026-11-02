import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, readdirSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const git = process.env.FDWEB_GIT || 'git';
function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'fdweb-ledger-'));
  try {
    for (const path of ['Tasks', 'AGENTS.md', 'DEVELOPMENT.md']) cpSync(join(root, path), join(directory, path), { recursive: true });
    const command = (...args) => execFileSync(git, args, { cwd: directory, stdio: 'pipe' });
    command('init');
    command('add', 'Tasks/tasks_file_structure_v5_6.md');
    command('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Local disposable policy fixture');
    const replace = (path, from, to) => {
      const target = join(directory, path);
      const text = readFileSync(target, 'utf8');
      assert(text.includes(from));
      writeFileSync(target, text.replace(from, to));
    };
    run({ directory, replace, verify: () => spawnSync(process.execPath, ['Tasks/tools/verify-ledger.mjs'], {
      cwd: directory, encoding: 'utf8', env: { ...process.env, FDWEB_GIT: git },
    }) });
  } finally {
    // Only the exact directory created by mkdtempSync is removed.
    rmSync(directory, { recursive: true, force: true });
  }
}
test('adoption baseline passes in a disposable Git checkout', () => fixture(({ verify }) => {
  const result = verify();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mapped_issues, 9);
}));
test('modified policy fails closed', () => fixture(({ replace, verify }) => {
  replace('Tasks/tasks_file_structure_v5_6.md', 'Version: 5.6', 'Version: altered');
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Working policy matches/);
}));
test('unknown dependency is rejected', () => fixture(({ replace, verify }) => {
  replace('Tasks/items/web/FDWEB-002-bootstrap-astro-site/TASK.md', 'initial_dependencies: []', 'initial_dependencies: ["FDWEB-999"]');
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unresolved dependency FDWEB-999/);
}));
test('duplicate discussion mirror is rejected', () => fixture(({ replace, verify }) => {
  replace('Tasks/items/web/FDWEB-002-bootstrap-astro-site/TASK.md', '/issues/2', '/issues/3');
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Duplicate issue #3/);
}));
test('append-only dependency overrides are checked', () => fixture(({ directory, verify }) => {
  const events = join(directory, 'Tasks/items/web/FDWEB-002-bootstrap-astro-site/events');
  mkdirSync(events, { recursive: true });
  writeFileSync(join(events, 'negative-dependency.json'), JSON.stringify({ subject_id: 'FDWEB-002',
    created_at: '2099-01-01T00:00:00Z', event_type: 'dependencies_changed', payload: { dependencies: ['FDWEB-999'] } }));
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unresolved dependency FDWEB-999/);
}));
test('missing correction membership is rejected', () => fixture(({ directory, verify }) => {
  const events = join(directory, 'Tasks/epics/FDWEB-EPIC-D001-site-foundation/events');
  for (const name of readdirSync(events)) {
    const path = join(events, name);
    const entry = JSON.parse(readFileSync(path, 'utf8'));
    if (entry.event_type === 'membership_added' && entry.payload.member_id === 'FDWEB-015') {
      entry.payload.member_id = 'FDWEB-999';
      writeFileSync(path, JSON.stringify(entry));
    }
  }
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing membership for FDWEB-015/);
}));
