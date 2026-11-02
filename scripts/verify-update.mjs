import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowser } from './browser.mjs';
const pointer = JSON.parse(readFileSync('src/data/fdupdate-source.json', 'utf8'));
const site = JSON.parse(readFileSync('src/data/fdupdate-site.json', 'utf8'));
const manifestBytes = readFileSync(pointer.snapshot + '/manifest.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(manifestBytes), pointer.manifest_sha256);
const manifest = JSON.parse(manifestBytes);
for (const file of [...manifest.pages, ...manifest.assets]) assert.equal(hash(readFileSync(pointer.snapshot + '/' + file.file)), file.sha256, file.file);
for (const page of manifest.pages.filter(page => page.recovery)) {
  assert.equal(hash(readFileSync(pointer.snapshot + '/' + page.recovery.html_file)), page.recovery.html_sha256);
  assert.equal(hash(readFileSync(pointer.snapshot + '/' + page.recovery.markdown_file)), page.recovery.markdown_sha256);
}
assert.equal(site.docs.length, manifest.pages.filter(page => page.path.startsWith('/docs/')).length);
for (const page of site.docs) assert(existsSync('dist' + page.path + '/index.html'), `Missing local document ${page.path}`);
const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
await withBrowser(async ({ send, navigate, evaluate, screenshot }) => {
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "Object.defineProperty(navigator,'language',{get:()=> 'en'});Object.defineProperty(navigator,'languages',{get:()=> ['en']});" });
  await navigate(base + '/update');
  const original = readFileSync(pointer.snapshot + '/index.html', 'utf8');
  const expected = await evaluate(`(() => {const d=new DOMParser().parseFromString(${JSON.stringify(original)},'text/html');d.querySelector('.brand').remove();return {main:d.querySelector('main').textContent.replace(/\\s+/g,' ').trim(),nav:d.querySelector('header nav').textContent.replace(/\\s+/g,' ').trim(),footer:d.querySelector('footer').textContent.replace(/\\s+/g,' ').trim(),code:[...d.querySelectorAll('pre')].map(p=>p.textContent)};})()`);
  const actual = await evaluate(`({main:document.querySelector('.update-landing-content').textContent.replace(/\\s+/g,' ').trim(),nav:document.querySelector('.update-resources').textContent.replace(/\\s+/g,' ').trim(),footer:document.querySelector('.update-license').textContent.replace(/\\s+/g,' ').trim(),code:[...document.querySelectorAll('.update-overview pre')].map(p=>p.textContent)})`);
  assert.deepEqual(actual, expected, 'Every original landing text and command example must survive the redesign');
  for (const width of [360, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'));
    await screenshot(`.local/screenshots/update/update-${width}.png`);
  }
  for (const page of site.docs) {
    await navigate(base + page.path);
    await evaluate(axe);
    const source = readFileSync(pointer.snapshot + '/' + page.source_file, 'utf8');
    const expected = await evaluate(`(() => {const d=new DOMParser().parseFromString(${JSON.stringify(source)},'text/html');return {text:d.querySelector('article.prose').textContent.replace(/\\s+/g,' ').trim(),code:[...d.querySelectorAll('article.prose pre')].map(p=>p.textContent)};})()`);
    const actual = await evaluate(`({text:document.querySelector('article.update-document').textContent.replace(/\\s+/g,' ').trim(),code:[...document.querySelectorAll('article.update-document pre')].map(p=>p.textContent)})`);
    assert.deepEqual(actual, expected, `Documentation content loss: ${page.path}`);
    for (const width of [360, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'), `${page.path}: overflow ${width}`);
      const issues = await evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}}).then(r=>r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))`);
      assert.deepEqual(issues, [], `${page.path}: accessibility at ${width}px`);
    }
    if (['', 'client-integration', 'enrollment-code-panel'].includes(page.slug)) await screenshot(`.local/screenshots/update/docs-${page.slug || 'index'}-1440.png`);
  }
  for (const language of ['de', 'ru']) {
    await navigate(base + '/update');
    await evaluate(`document.querySelector('#language').value='${language}';document.querySelector('#language').dispatchEvent(new Event('change',{bubbles:true}));`);
    assert.equal(await evaluate('document.documentElement.lang'), language);
    assert(await evaluate(`(() => {const m=JSON.parse(document.querySelector('#language-messages').textContent).${language};return [...document.querySelectorAll('.update-overview [data-i18n]')].every(e=>m[e.dataset.i18n]===e.textContent);})()`));
    await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 1000, deviceScaleFactor: 1, mobile: false });
    assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'));
    await screenshot(`.local/screenshots/update/update-${language}-360.png`);
  }
});
console.log(`PASS: immutable source hashes; complete landing/nav/footer/code equality; ${site.docs.length} document texts/code blocks preserved; local routes; all documents at 360/1440px; EN/DE/RU overview`);
