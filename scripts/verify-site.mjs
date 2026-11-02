import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve('dist');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const htmlFiles = files(root).filter(path => path.endsWith('.html'));
const titles = new Set(), descriptions = new Set(), canonicals = new Set();
const targets = new Map();
for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const route = path.slice(root.length).replaceAll('\\', '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const canonical = `https://fedrv.de${route === '/' ? '/' : route.replace(/\/$/, '')}`;
  const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/);
  assert(title && description, `${path}: missing metadata`);
  assert(!titles.has(title), `Duplicate title ${title}`); titles.add(title);
  assert(!descriptions.has(description[1]), 'Duplicate description'); descriptions.add(description[1]);
  assert(html.includes(`rel="canonical" href="${canonical}"`), `${path}: incorrect canonical`);
  assert(!canonicals.has(canonical)); canonicals.add(canonical);
  for (const field of ['type', 'title', 'description', 'url', 'image', 'image:alt']) assert(html.includes(`property="og:${field}"`), `${path}: missing og:${field}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: single H1`);
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (script[1].includes('type="application/json"') && script[1].includes('id="language-messages"')) {
      const translations = JSON.parse(script[2]);
      assert.deepEqual(Object.keys(translations).sort(), ['de', 'en', 'ru']);
      assert(Object.values(translations).every(values => typeof values['page.title'] === 'string' && typeof values['page.description'] === 'string'));
    } else assert(/type="module"/.test(script[1]) && /src="\/_astro\/[^"/]+\.js"/.test(script[1]) && !script[2].trim(), `${path}: only the bundled local language module is allowed`);
  }
  for (const match of html.matchAll(/<(a|img|link|script)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[2].replaceAll('&amp;', '&'), canonical);
    if (url.origin !== 'https://fedrv.de') {
      assert.equal(url.protocol, 'https:', `Unexpected external protocol ${url.protocol}`);
      continue;
    }
    let target = resolve(root, '.' + decodeURIComponent(url.pathname));
    assert(target.startsWith(root));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target) && existsSync(target+'.html')) target += '.html';
    assert(existsSync(target), `${path}: broken local ${match[2]}`);
    if (url.hash && target.endsWith('.html')) {
      if (!targets.has(target)) targets.set(target, readFileSync(target, 'utf8'));
      assert(targets.get(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing fragment ${match[2]}`);
    }
  }
}
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
for (const canonical of canonicals) {
  if (!canonical.endsWith('/404')) assert(sitemap.includes(`<loc>${canonical}</loc>`), `Missing sitemap ${canonical}`);
}
assert(!sitemap.includes('/404'));
assert(readFileSync(join(root, '404.html'), 'utf8').includes('noindex, follow'));
assert(readFileSync(join(root, 'robots.txt'), 'utf8').includes('Sitemap: https://fedrv.de/sitemap.xml'));
const image = readFileSync(join(root, 'social-card.png'));
assert.equal(image.readUInt32BE(16), 1200); assert.equal(image.readUInt32BE(20), 630);
console.log(`PASS: ${htmlFiles.length} unique page heads, sitemap/robots/social image, single H1, internal routes/fragments/assets and bounded local language script`);
