import assert from 'node:assert/strict';
import { withBrowser } from './browser.mjs';
const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
const expected = ['cot', 'update', 'files', 'tasks', 'fdos'].map(name => `https://${name}.fedrv.de/`);
await withBrowser(async ({ send, navigate, evaluate, screenshot }) => {
  for (const language of ['en', 'de', 'ru']) {
    const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(navigator,'language',{get:()=> '${language}'});Object.defineProperty(navigator,'languages',{get:()=> ['${language}']});` });
    for (const width of [360, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await navigate(base + '/');
      assert.equal(await evaluate('document.documentElement.lang'), language);
      assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".project-launchers a"), a=>a.href)'), expected);
      assert(await evaluate('Array.from(document.querySelectorAll(".project-launchers a"), a=>a.textContent.trim()).every(Boolean)'));
      assert(await evaluate('Array.from(document.querySelectorAll(".project-launchers a")).every(a=>{const r=a.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=document.documentElement.clientWidth;})'));
      assert(await evaluate(`Array.from(document.querySelectorAll('.project-launchers a')).every(a=>a.getAttribute('aria-label')===JSON.parse(document.querySelector('#language-messages').textContent).${language}[a.getAttribute('data-i18n-aria-label')])`));
      assert(await evaluate('Array.from(document.querySelectorAll(".project-launchers img")).every(i=>i.complete&&i.naturalWidth>0&&i.alt==="")'));
      assert.equal(await evaluate(`document.querySelector('.project-launchers a[href="https://update.fedrv.de/"] img').getAttribute('src')`), '/icons/fd-update.svg');
      assert.equal(await evaluate(`document.querySelector('.project-launchers a[href="https://files.fedrv.de/"] img').getAttribute('src')`), '/icons/fd-storage.svg');
      assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'));
      const reached = new Set();
      for (let tab = 0; tab < 12; tab++) {
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        const href = await evaluate('document.activeElement.closest(".project-launchers") ? document.activeElement.href : null');
        if (href) {
          reached.add(href);
          assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
        }
      }
      assert.equal(reached.size, 5, 'All five project shortcuts reachable with Tab');
      await screenshot(`.local/screenshots/portal/${language}-${width}.png`);
    }
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  }
});
console.log('PASS: exact five subdomains, matching icons, localized accessible names, keyboard access and 360/1440px layout in all languages');
