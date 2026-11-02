import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const colors = new Set(['#242424', '#60d7f7', '#ffffff', '#000000']);
function files(path) { return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(`${path}/${entry.name}`) : [`${path}/${entry.name}`]); }
for (const path of [...files('src').filter(path => /\.(css|astro)$/.test(path)), 'scripts/generate-social.mjs', 'public/favicon.svg']) {
  const content = readFileSync(path, 'utf8');
  for (const match of content.matchAll(/#[0-9a-f]{3,8}\b/gi)) assert(colors.has(match[0].toLowerCase()), `${path}: unexpected color ${match[0]}`);
}
const favicon = readFileSync('public/favicon.svg', 'utf8');
assert(favicon.includes('<title>FD</title>') && favicon.includes('aria-label="FD"'));
const git = process.env.FDWEB_GIT || 'git';
const baseline = JSON.parse(readFileSync('Tasks/items/quality/FDWEB-007-foundation-integration-gate/evidence/2026-11-02-frozen-candidate.json', 'utf8'));
for (const name of readdirSync('public/icons')) {
  const path = `public/icons/${name}`;
  const bytes = readFileSync(path);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), baseline.files[path], `Working icon bytes changed: ${name}`);
  // Git for Windows may check the original tracked SVGs out with CRLF.
  assert.equal(bytes.toString('utf8').replace(/\r\n/g, '\n'), execFileSync(git, ['show', `HEAD:${path}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n'), `Original Git icon changed: ${name}`);
}
console.log('PASS: four website color literals, FD favicon and byte-identical original product icons');
