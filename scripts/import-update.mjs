import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { updateRows } from '../src/i18n/update.ts';
const pointer = JSON.parse(readFileSync('src/data/fdupdate-source.json', 'utf8'));
const snapshot = process.argv[2] || pointer.snapshot;
const bytes = readFileSync(`${snapshot}/manifest.json`);
const hash = value => createHash('sha256').update(value).digest('hex');
if (hash(bytes) !== pointer.manifest_sha256) throw Error('Immutable source manifest changed');
const manifest = JSON.parse(bytes);
const decode = text => text.replace(/&(amp|quot|lt|gt|#39);/g, (_, entity) => ({ amp: '&', quot: '"', lt: '<', gt: '>', '#39': "'" })[entity]);
const originals = new Map(Object.entries(updateRows).map(([key, values]) => [values[0], key]));
function verified(file, expected) {
  const bytes = readFileSync(`${snapshot}/${file}`);
  if (hash(bytes) !== expected) throw Error('Source hash mismatch: ' + file);
  return bytes.toString('utf8');
}
function remap(html, sourceUrl) {
  if (/<(?:script|style|iframe|object|form|input|button)\b|\bon\w+\s*=|\bstyle\s*=|javascript:/i.test(html)) throw Error('Unexpected active content in ' + sourceUrl);
  return html.replace(/<pre>/g, '<pre tabindex="0">').replace(/href="([^"]+)"/g, (_, href) => {
    const url = new URL(decode(href), sourceUrl);
    if (url.origin !== manifest.origin) {
      if (url.protocol !== 'https:' && url.protocol !== 'mailto:') throw Error('Unexpected link protocol: ' + href);
      return `href="${href}"`;
    }
    if (url.pathname === '/' || url.pathname.startsWith('/docs/')) return `href="/update${url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')}${url.search}${url.hash}"`;
    return `href="${url.href}"`;
  });
}
function annotate(html) {
  let pre = false;
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith('<pre')) pre = true;
    if (part.startsWith('</pre')) pre = false;
    if (part.startsWith('<') || pre || !part.trim() || /^FDUpdate \d/.test(part.trim())) return part;
    const key = originals.get(decode(part.trim()));
    if (!key) throw Error('Unmapped landing text: ' + part.trim());
    return part.replace(/\S[\s\S]*\S|\S/, text => `<span data-i18n="update.${key}">${text}</span>`);
  }).join('').replace('aria-label="FDUpdater command example"', 'aria-label="FDUpdater command example" data-i18n-aria-label="update.commandLabel"');
}
const docs = manifest.pages.filter(page => page.path.startsWith('/docs/')).map(page => {
  const html = page.recovery ? verified(page.recovery.html_file, page.recovery.html_sha256) : verified(page.file, page.sha256);
  const article = html.match(/<article class="prose">([\s\S]*?)<\/article>/)?.[1];
  if (!article) throw Error('Missing source article: ' + page.path);
  let h1 = 0;
  let content = remap(article, page.url).replace(/<(\/?)(h1)\b[^>]*>/g, (_tag, closing) => {
    if (!closing) h1++;
    return `<${closing}${h1 === 1 ? 'h1' : 'h2'}>`;
  });
  if (page.path === '/docs/') content = content.replace(/<(\/?)h3>/g, '<$1h2>');
  // The source generator closes a list item before its continuation paragraph.
  // Move that paragraph inside the same item without changing any text/code.
  while (/<\/li>\s*<p>/.test(content)) content = content.replace(/<\/li>(\s*<p>[\s\S]*?<\/p>)/g, '$1</li>');
  return { slug: page.path.replace(/^\/docs\//, '').replace(/\/$/, ''), title: decode(html.match(/<title>([^<]+)<\/title>/)[1].replace(/ · FDUpdate$/, '')),
    path: '/update' + page.path.replace(/\/$/, ''), source_url: page.url, source_file: page.recovery?.html_file || page.file,
    source_kind: page.recovery ? 'repository' : 'website', description: decode(html.match(/<meta name="description" content="([^"]+)"/)[1]),
    html: content, footer: decode(html.match(/<footer><span>([^<]+)<\/span>/)?.[1] || '') };
});
const landingPage = manifest.pages.find(page => page.path === '/');
const landing = verified(landingPage.file, landingPage.sha256);
const main = landing.match(/<main>([\s\S]*?)<\/main>/)[1];
const nav = landing.match(/<header><nav[^>]*>([\s\S]*?)<\/nav><\/header>/)[1].replace(/<a class="brand"[\s\S]*?<\/a>/, '');
const footer = landing.match(/<footer>([\s\S]*?)<\/footer>/)[1];
const data = { captured_at: manifest.captured_at, origin: manifest.origin, snapshot,
  landing_html: annotate(remap(main, manifest.origin + '/').replace(/<(\/?)h1>/g, '<$1h2>')),
  landing_nav: annotate(remap(nav, manifest.origin + '/')),
  landing_footer: annotate(footer), docs };
writeFileSync('src/data/fdupdate-site.json', JSON.stringify(data, null, 2) + '\n');
console.log(`Imported landing and ${docs.length} documentation pages from the verified immutable snapshot`);
