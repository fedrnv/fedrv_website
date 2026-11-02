import { writeFileSync } from 'node:fs';
import { withBrowser } from './browser.mjs';
await withBrowser(async ({ evaluate }) => {
  const data = await evaluate(`(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7f8fa'; ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#2456b7'; ctx.fillRect(80, 90, 64, 8);
    ctx.fillStyle = '#182333'; ctx.font = 'bold 100px system-ui'; ctx.fillText('FEDRV.DE', 80, 245);
    ctx.fillStyle = '#2456b7'; ctx.font = '36px system-ui'; ctx.fillText('Forschung, Entwicklung, DRIVE.', 84, 325);
    ctx.fillStyle = '#526174'; ctx.font = '32px system-ui'; ctx.fillText('Программные инструменты', 84, 460);
    ctx.fillText('и инженерные решения.', 84, 508);
    return canvas.toDataURL('image/png').split(',')[1];
  })()`);
  writeFileSync('public/social-card.png', Buffer.from(data, 'base64'));
});
console.log('Generated public/social-card.png (1200×630); inspect before accepting');
