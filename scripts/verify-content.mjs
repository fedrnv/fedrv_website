import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

mkdirSync('.local', { recursive: true });
const fixture = mkdtempSync(resolve('.local/content-'));
const minimal = `---\nname: Fixture Project\nslug: fixture-project\nsummary: One validated entry powers card and page.\npurpose: Verify the shared content contract.\nstatus: planned\n---\n`;
let builds = 0;
function build(content) {
  const run = join(fixture, String(++builds));
  mkdirSync(join(run, 'entries'), { recursive: true });
  for (const [name, text] of Object.entries(content)) writeFileSync(join(run, 'entries', name+'.md'), text);
  const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', join(run, 'dist')], {
    encoding: 'utf8', timeout: 60000,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', FDWEB_COMPONENT_FIXTURE: '',
      FDWEB_CONTENT_DIR: join(run, 'entries'), FDWEB_CACHE_DIR: './' + relative(process.cwd(), join(run, 'cache')).replaceAll('\\', '/') },
  });
  return { ...result, output: result.stdout + result.stderr, directory: join(run, 'dist') };
}
try {
  const valid = build({ minimal });
  assert.equal(valid.status, 0, valid.output);
  const home = readFileSync(join(valid.directory, 'index.html'), 'utf8');
  const page = readFileSync(join(valid.directory, 'fixture-project/index.html'), 'utf8');
  assert(home.includes('Fixture Project') && home.includes('href="/fixture-project"'));
  assert.match(page, /<h1\b[^>]*>Fixture Project<\/h1>/);
  for (const hidden of ['<h2 data-i18n="capabilities"', '<h2 data-i18n="benefits"', '<h2 data-i18n="materials"', '<h2 data-i18n="plans"']) assert(!page.includes(hidden));
  assert(page.includes('data-i18n="mediaFallback"'));
  const invalid = build({ invalid: minimal.replace('name: Fixture Project\n', '') });
  assert.notEqual(invalid.status, 0, 'Missing name must fail a real build');
  assert.match(invalid.output, /name/);
  const unsafe = build({ unsafe: minimal.replace('status: planned', 'status: planned\nportal:\n  label: Unsafe\n  url: javascript:alert(1)') });
  assert.notEqual(unsafe.status, 0, 'Non-HTTPS link must fail');
  assert.match(unsafe.output, /portal|HTTPS/);
  const duplicate = build({ first: minimal, second: minimal });
  assert.notEqual(duplicate.status, 0, 'Duplicate route must fail');
  assert.match(duplicate.output, /Duplicate project slug/);
  console.log('PASS: real Astro builds validate page/card projection, optional omissions, required name, unsafe URL and duplicate slug');
} finally {
  // Exact absolute directory created under this repository by mkdtempSync.
  rmSync(fixture, { recursive: true, force: true });
}
