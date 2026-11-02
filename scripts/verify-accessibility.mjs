import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowser } from './browser.mjs';

const base = process.env.FDWEB_PREVIEW || 'http://127.0.0.1:4321';
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
await withBrowser(async ({ send, navigate, evaluate }) => {
  for (const width of [360, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const route of ['/', '/cot', '/update', '/storage', '/404']) {
      await navigate(base + route);
      await evaluate(axe);
      const report = await evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } }).then(result => ({ violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) }))`);
      assert.deepEqual(report.violations, [], `${route} at ${width}px: ${JSON.stringify(report.violations)}`);
      const headings = await evaluate('Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"), h => Number(h.tagName[1]))');
      for (let i=1;i<headings.length;i++) assert(headings[i] <= headings[i-1]+1, `${route}: heading level jump`);
      for (let i=0;i<3;i++) {
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
      }
    }
  }
});
console.log('PASS: axe WCAG A/AA + best-practice checks, heading sequence and visible keyboard focus on 5 routes at 360/1440px (not a certification)');
