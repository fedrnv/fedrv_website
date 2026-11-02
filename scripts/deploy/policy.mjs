import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export function validateWorkflow(source, manifest) {
  const workflow = parse(source, { uniqueKeys: true });
  assert.deepEqual(Object.keys(workflow.on || {}), ['workflow_dispatch'], 'Only workflow_dispatch is allowed');
  assert.deepEqual(workflow.permissions, { contents: 'read' }, 'Use only contents: read');
  assert.equal(workflow.concurrency?.['cancel-in-progress'], false, 'Never cancel a publication mid-activation');
  assert.deepEqual(Object.keys(workflow.jobs || {}), ['publish']);
  const job = workflow.jobs.publish;
  assert.equal(job.if, "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main'");
  assert.equal(job.environment, 'production');
  assert(!job.permissions, 'Do not widen job permissions');
  const commands = [];
  const actions = [];
  for (const step of job.steps) {
    if (step.uses) {
      assert.match(step.uses, /^actions\/(checkout|setup-node)@[a-f0-9]{40}$/, 'Use pinned official build actions');
      actions.push(step.uses.split('@')[0]);
      if (step.uses.startsWith('actions/checkout@')) assert.equal(step.with?.['persist-credentials'], false);
    }
    if (step.run) commands.push(step.run.trim());
  }
  assert.deepEqual(actions, ['actions/checkout', 'actions/setup-node']);
  assert.deepEqual(commands, [
    'npm install --global npm@11.17.0 --ignore-scripts --no-audit --no-fund',
    'npm ci --no-audit --no-fund', 'npm run build', 'node scripts/deploy/publish.mjs',
  ], 'Hosted stages are only toolchain install, build and publication');
  assert.equal(manifest.scripts.build, 'astro build', 'Build may not hide acceptance tests');
  for (const hook of ['prebuild', 'postbuild', 'preinstall', 'install', 'postinstall', 'prepare', 'prepublish']) {
    assert(!manifest.scripts[hook], `Unreviewed lifecycle hook: ${hook}`);
  }
  const publication = job.steps.at(-1);
  assert.equal(publication.env.DEPLOY_SSH_KEY, '${{ secrets.DEPLOY_SSH_KEY }}');
  assert.equal(publication.env.DEPLOY_KNOWN_HOSTS, '${{ secrets.DEPLOY_KNOWN_HOSTS }}');
  for (const name of ['HOST', 'USER', 'PORT', 'ROOT', 'URL']) assert.equal(publication.env['DEPLOY_' + name], '${{ vars.DEPLOY_' + name + ' }}');
  for (const step of job.steps.slice(0, -1)) assert(!JSON.stringify(step).includes('secrets.'), 'Build stages must not receive SSH secrets');
  return workflow;
}

export function validatePublicationGraph() {
  const source = readFileSync('scripts/deploy/publish.mjs', 'utf8');
  const imports = [...source.matchAll(/from ['"]([^'"]+)['"]/g)].map(match => match[1]);
  assert(imports.every(name => name.startsWith('node:')), 'Publisher imports only reviewed Node builtins');
  assert(!/npm\s+(?:run\s+(?:verify|test)|test)|node:test/.test(source), 'No task/product tests in the publisher');
  const config = readFileSync('astro.config.mjs', 'utf8');
  assert.equal([...config.matchAll(/from ['"]([^'"]+)['"]/g)].map(match => match[1]).join(','), 'astro/config');
  const remote = readFileSync('scripts/deploy/remote.sh', 'utf8');
  assert(!/npm|cargo|node:test|verify:/.test(remote), 'Remote stage only installs static files');
  return ['checkout', 'setup-node', 'pinned npm install', 'npm ci (dependency installation)', 'astro build (static compilation)', 'publish.mjs (package/SSH/marker)', 'remote.sh (checksum/extraction/atomic link/recovery)'];
}
