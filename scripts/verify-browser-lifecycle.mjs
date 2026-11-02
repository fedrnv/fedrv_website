import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { withBrowser } from './browser.mjs';

const previous = process.env.FDWEB_BROWSER;
try {
  process.env.FDWEB_BROWSER = resolve('.local/deliberately-missing-browser.exe');
  await assert.rejects(withBrowser(async () => assert.fail('Missing browser must not invoke callback')), error => error.code === 'ENOENT');
} finally {
  if (previous === undefined) delete process.env.FDWEB_BROWSER;
  else process.env.FDWEB_BROWSER = previous;
}
await assert.rejects(withBrowser(async () => { throw new Error('Original callback failure'); }), /Original callback failure/);
await withBrowser(async ({ evaluate }) => assert.equal(await evaluate('1+1'), 2));
console.log('PASS: missing executable preserves ENOENT, callback error is preserved, normal browser lifecycle succeeds');
