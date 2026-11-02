import assert from 'node:assert/strict';
import { withBrowser } from './browser.mjs';
const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
await withBrowser(async ({ navigate, evaluate }) => {
  await navigate(base + '/');
  assert.equal(await evaluate('document.querySelectorAll("#projects .product-card").length'), 3);
  for (const [slug, name] of [['update', 'FDUpdate'], ['cot', 'COT'], ['storage', 'FDStorage']]) {
    await navigate(base + '/');
    const link = await evaluate(`document.querySelector('#projects a[href="/${slug}"]').textContent`);
    assert(link.includes(name));
    await evaluate(`document.querySelector('#projects a[href="/${slug}"]').click()`);
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline && !(await evaluate(`location.pathname === '/${slug}' && document.querySelector('h1')?.textContent === '${name}'`))) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(await evaluate('document.querySelector("h1").textContent'), name);
  }
  await navigate(base + '/');
  assert(await evaluate(`Boolean(document.querySelector('#approach [data-i18n="approach.p2"]'))`));
  assert.equal(await evaluate('document.querySelector(".portal-note a").href'), 'https://update.fedrv.de/');
});
console.log('PASS: three content-driven cards navigate to matching project pages; human-led approach and verified portal link');
