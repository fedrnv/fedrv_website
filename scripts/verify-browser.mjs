import assert from 'node:assert/strict';
import { withBrowser } from './browser.mjs';

const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
const output = process.env.FDWEB_SCREENSHOTS || '.local/screenshots/bootstrap';
const routes = process.env.FDWEB_ROUTES?.split(',') || ['/', '/404'];
await withBrowser(async ({ send, evaluate, navigate, screenshot }) => {
  for (const width of [360, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await navigate(base + route);
      assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1);
      assert(await evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), `${route} overflows at ${width}`);
      await screenshot(`${output}/${route === '/' ? 'home' : route.replaceAll('/', '')}-${width}.png`);
    }
    await navigate(base + '/');
    if (await evaluate('Boolean(document.querySelector("#sample"))')) {
      assert.equal(await evaluate('document.querySelectorAll("#sample .product-card").length'), 3);
      assert.equal(await evaluate('document.querySelectorAll("#sample .external-links").length'), 0);
      assert(await evaluate('Boolean(document.querySelector("#sample [data-i18n=mediaFallback]"))'));
    }
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    assert.equal(await evaluate('document.activeElement.dataset.i18n'), 'skip');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    assert.equal(await evaluate('document.activeElement.id'), 'main');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    if (await evaluate('document.activeElement.tagName === "A"')) {
      assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
      assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineWidth'), '3px');
    }
  }
});
console.log('PASS: 360/1440px home and 404, no overflow, keyboard skip link; screenshots in ' + output);
