// Local FDWEB-001 adoption checks. No dependencies or hosted test entry point.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const git = process.env.FDWEB_GIT || 'git';
const read = path => readFileSync(resolve(root, path), 'utf8');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runGit = (...args) => execFileSync(git, args, { cwd: root });
function files(path) {
  return readdirSync(resolve(root, path), { withFileTypes: true }).flatMap(entry => {
    const name = `${path}/${entry.name}`;
    return entry.isDirectory() ? files(name) : [name];
  });
}
function field(text, key) {
  const match = text.match(new RegExp(`^${key}: (.+)$`, 'm'));
  assert(match, `Missing ${key}`);
  return match[1].trim();
}
const lifecycle = JSON.parse(read('Tasks/lifecycle.json'));
const profile = JSON.parse(read('Tasks/project-profile.json'));
const policy = runGit('show', `HEAD:${lifecycle.policy_path}`);
assert.equal(hash(policy), lifecycle.policy_sha256, 'Committed policy provenance');
// Git for Windows may check text out with CRLF; do not rewrite immutable records.
assert.equal(hash(read(lifecycle.policy_path).replace(/\r\n/g, '\n')), lifecycle.policy_sha256,
  'Working policy matches the pinned LF source');
assert.equal(profile.lifecycle_version, lifecycle.version);
for (const path of ['AGENTS.md', 'DEVELOPMENT.md', 'Tasks/AGENTS.md', 'Tasks/FORMAT.md',
  lifecycle.history_path, lifecycle.project_profile_path, lifecycle.compatibility.baseline_path,
  'Tasks/templates/TASK.md', 'Tasks/templates/EPIC.md', 'Tasks/templates/EVENT.json']) {
  assert(read(path).trim(), `Missing/empty ${path}`);
}
assert(read(lifecycle.history_path).includes(lifecycle.policy_sha256));
const jsonFiles = files('Tasks').filter(path => path.endsWith('.json'));
for (const path of jsonFiles) JSON.parse(read(path));

const records = new Map();
const paths = files('Tasks').filter(path => /\/(TASK|EPIC)\.md$/.test(path) && !path.includes('/templates/'));
const issueOwners = new Map();
for (const path of paths) {
  const text = read(path);
  const id = field(text, 'id');
  assert(!records.has(id), `Duplicate ${id}`);
  assert(path.includes(`${id}-`), `Path/ID mismatch: ${path}`);
  assert.match(id, /^FDWEB-(?:\d{3}|EPIC-[DS]\d{3})$/);
  let dependencies = JSON.parse(field(text, 'initial_dependencies'));
  const eventDirectory = `${dirname(path)}/events`;
  const material = existsSync(resolve(root, eventDirectory))
    ? files(eventDirectory).filter(name => name.endsWith('.json')).map(name => JSON.parse(read(name)))
      .sort((a, b) => a.created_at.localeCompare(b.created_at)) : [];
  for (const event of material) {
    assert.equal(event.subject_id, id, `${path}: event subject mismatch`);
    if (event.event_type === 'dependencies_changed') dependencies = event.payload.dependencies;
  }
  assert(Array.isArray(dependencies));
  const record = { path, text, dependencies, material };
  if (path.endsWith('/TASK.md')) {
    assert.equal(field(text, 'schema'), 'fdtasks-spec/v4');
    assert.equal(field(text, 'size'), 'medium');
    assert.equal(field(text, 'outcomes'), '1');
    assert(profile.areas.includes(field(text, 'area')));
    record.epic = field(text, 'epic_id');
    const atomicity = JSON.parse(field(text, 'atomicity'));
    assert.equal(atomicity.outcomes.length, 1);
    assert.equal(atomicity.independent_acceptance, false);
    assert(atomicity.boundary_reason.trim());
    assert(atomicity.packets.length >= 1 && atomicity.packets.length <= 3);
    assert.equal(Number(field(text, 'implementation_packets')), atomicity.packets.length);
    assert([...atomicity.outcomes, ...atomicity.packets].every(value => typeof value === 'string' && value.trim()));
    if (atomicity.packets.length > 1) assert(atomicity.inseparability_reason?.trim());
    const criteria = [...text.matchAll(/^\| (AC-\d{2}) \|/gm)].map(match => match[1]);
    assert(criteria.length > 0, `${id}: missing acceptance matrix`);
    assert.equal(new Set(criteria).size, criteria.length, `${id}: duplicate AC IDs`);
    for (const match of text.matchAll(/https:\/\/github\.com\/fedrnv\/fedrv_website\/issues\/(\d+)/g)) {
      const issue = Number(match[1]);
      assert(!issueOwners.has(issue), `Duplicate issue #${issue}`);
      issueOwners.set(issue, id);
    }
  } else assert.equal(field(text, 'schema'), 'fdtasks-epic/v4');
  // Validate local Markdown links without following external discussion mirrors.
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    const target = resolve(root, dirname(path), match[1].split('#')[0]);
    assert(existsSync(target), `Broken link ${path}: ${relative(root, target)}`);
  }
  records.set(id, record);
}
for (let issue = 2; issue <= 10; issue++) assert(issueOwners.has(issue), `Missing issue #${issue}`);
assert.equal(issueOwners.size, 9);
const visited = new Set();
function visit(id, chain = []) {
  assert(!chain.includes(id), `Dependency cycle: ${[...chain, id].join(' -> ')}`);
  if (visited.has(id)) return;
  const record = records.get(id);
  assert(record, `Unresolved dependency ${id}`);
  for (const dependency of record.dependencies) visit(dependency, [...chain, id]);
  visited.add(id);
}
for (const [id, record] of records) {
  visit(id);
  if (record.epic) {
    const epic = records.get(record.epic);
    assert(epic, `Missing parent for ${id}`);
    assert(epic.text.includes(`[${id}]`) || epic.material.some(event => event.event_type === 'membership_added' && event.payload.member_id === id), `Missing membership for ${id}`);
  }
}
for (const [epicId, gateId, reviewId] of [
  ['FDWEB-EPIC-D001', 'FDWEB-007', 'FDWEB-008'],
  ['FDWEB-EPIC-D002', 'FDWEB-013', 'FDWEB-014'],
]) {
  const epic = records.get(epicId);
  const members = [...records].filter(([, record]) => record.epic === epicId).map(([id]) => id);
  const linkedMembers = [...epic.text.matchAll(/\[(FDWEB-\d{3})\]/g)].map(match => match[1]);
  linkedMembers.push(...epic.material.filter(event => event.event_type === 'membership_added').map(event => event.payload.member_id));
  assert.deepEqual([...new Set(linkedMembers)].sort(), members.sort());
  const functionality = members.filter(id => id !== gateId && id !== reviewId);
  assert(functionality.length <= 6);
  assert.deepEqual([...records.get(gateId).dependencies].sort(), functionality.sort());
  assert.deepEqual(records.get(reviewId).dependencies, [gateId]);
  assert.match(epic.text, /Targeted integration gate:\s*\n- \[FDWEB-\d{3}\]/);
  assert.match(epic.text, /Independent review:\s*\n- \[FDWEB-\d{3}\]/);
}
console.log(JSON.stringify({ result: 'PASS', source: runGit('rev-parse', 'HEAD').toString().trim(),
  policy_sha256: lifecycle.policy_sha256, records: records.size,
  json_files: jsonFiles.length, mapped_issues: issueOwners.size,
  checks: ['policy provenance (Git blob and LF worktree)', 'required rule sources and JSON',
    'IDs, atomicity and acceptance matrices', 'local links and Epic membership',
    'dependency resolution and cycles', 'gate/review topology', 'issues #2–#10 mapping'] }, null, 2));
