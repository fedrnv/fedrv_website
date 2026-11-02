import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowser } from './browser.mjs';
const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
const routes = ['/', '/cot', '/update', '/storage', '/404'];
await withBrowser(async ({ send, navigate, evaluate, screenshot }) => {
  for (const [primary, secondary, expected] of [
    ['en-US', 'ru', 'en'], ['de-DE', 'en', 'de'], ['ru-RU', 'en', 'ru'],
    ['DE-at', 'en', 'de'], ['fr-FR', 'ru', 'en'], ['es', 'de', 'en'], ['', '', 'en'],
  ]) {
    const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source:
      `Object.defineProperty(navigator,'language',{get:()=>${JSON.stringify(primary)}});Object.defineProperty(navigator,'languages',{get:()=>${JSON.stringify([primary, secondary])}});sessionStorage.clear();` });
    for (const route of (['en-US', 'de-DE', 'ru-RU'].includes(primary) ? routes : ['/'])) {
      await navigate(base + route);
      assert.equal(await evaluate('document.documentElement.lang'), expected, `${primary}: ${route}`);
      assert.equal(await evaluate('document.documentElement.dataset.languageReady'), 'true');
      assert.equal(await evaluate('document.querySelector("#language").value'), expected);
      assert(await evaluate(`(() => { const m=JSON.parse(document.querySelector('#language-messages').textContent)[${JSON.stringify(expected)}]; return [...document.querySelectorAll('[data-i18n]')].every(e=>m[e.dataset.i18n]===e.textContent); })()`), `${route}: untranslated text`);
      assert(await evaluate(`(() => { const m=JSON.parse(document.querySelector('#language-messages').textContent)[${JSON.stringify(expected)}]; return ['aria-label','content','alt','title'].every(a=>[...document.querySelectorAll('[data-i18n-'+a+']')].every(e=>m[e.getAttribute('data-i18n-'+a)]===e.getAttribute(a))); })()`), `${route}: untranslated attribute`);
      assert.equal(await evaluate('document.title'), await evaluate(`JSON.parse(document.querySelector('#language-messages').textContent).${expected}['page.title']`));
      if (expected !== 'ru') assert(!await evaluate('/[А-Яа-яЁё]/.test(document.body.innerText)'), `${route}: Cyrillic leaked into ${expected}`);
      for (const width of [360, 1440]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
        assert(await evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), `${expected} ${route} overflow ${width}`);
        if (route === '/' && ['en-US', 'de-DE', 'ru-RU'].includes(primary)) await screenshot(`.local/screenshots/languages/${expected}-${width}.png`);
      }
    }
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  }
  await navigate(base + '/');
  await evaluate("document.querySelector('#language').value='de';document.querySelector('#language').dispatchEvent(new Event('change',{bubbles:true}))");
  assert.equal(await evaluate('document.documentElement.lang'), 'de');
  await navigate(base + '/update');
  assert.equal(await evaluate('document.documentElement.lang'), 'de', 'Manual selection survives navigation');
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await navigate(base + '/');
  assert.equal(await evaluate('document.documentElement.lang'), 'en');
  assert((await evaluate('document.body.innerText')).includes('From an idea'));
  await send('Emulation.setScriptExecutionDisabled', { value: false });
});
assert(readFileSync('dist/index.html', 'utf8').includes('lang="en"'));
console.log('PASS: EN/DE/RU pages and metadata, regional browser languages, unsupported/missing fallback, primary precedence, manual choice, no-JS English and mobile/desktop layout');
