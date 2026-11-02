import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

for (const path of ['dist/index.html', 'dist/404.html']) {
  assert(existsSync(path), `Missing static route: ${path}`);
  const html = readFileSync(path, 'utf8');
  for (const expected of ['lang="en"', '<header', '<nav', '<main', '<footer', '<h1']) {
    assert(html.includes(expected), `${path}: missing ${expected}`);
  }
}
assert(!existsSync('dist/foundation-fixture'), 'Draft fixture must not be published');
for (const icon of ['fd-agent', 'fd-remote-desktop', 'fd-storage', 'fd-update', 'fd-vpn']) {
  assert.equal(readFileSync(`dist/icons/${icon}.svg`, 'utf8'), readFileSync(`public/icons/${icon}.svg`, 'utf8'));
}
console.log('PASS: static home, 404, shared shell, unpublished fixture and preserved icons');
