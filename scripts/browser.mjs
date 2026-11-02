import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { once } from 'node:events';

// Drive an installed Chromium browser through its loopback DevTools interface.
// Tests use an isolated profile and never touch the user's browser session.
export async function withBrowser(run) {
  const executable = process.env.FDWEB_BROWSER || (process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : 'chromium');
  const profile = mkdtempSync(join(tmpdir(), 'fdweb-browser-'));
  const child = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  let terminated = false;
  child.once('error', () => { terminated = true; });
  child.once('exit', () => { terminated = true; });
  const alive = () => {
    if (terminated || !child.pid || child.exitCode !== null || child.signalCode !== null) return false;
    try { process.kill(child.pid, 0); return true; }
    catch (error) { if (error.code === 'ESRCH') return false; throw error; }
  };
  let socket;
  let closeBrowser;
  let originalError;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('Browser startup timed out')), 20000);
      let log = '';
      child.once('error', error => { clearTimeout(timer); reject(error); });
      child.once('exit', (code, signal) => { clearTimeout(timer); reject(Error(`Browser exited before debugger startup: code=${code}, signal=${signal}; ${log.slice(-1500)}`)); });
      child.stderr.on('data', chunk => {
        log += chunk;
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
    });
    const origin = new URL(endpoint).origin.replace('ws:', 'http:');
    const response = await fetch(`${origin}/json/new?about:blank`, { method: 'PUT' });
    const target = await response.json();
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await once(socket, 'open');
    let sequence = 0;
    const pending = new Map();
    socket.addEventListener('message', event => {
      const value = JSON.parse(event.data);
      if (!value.id) return;
      const entry = pending.get(value.id);
      if (!entry) return;
      clearTimeout(entry.timer);
      pending.delete(value.id);
      value.error ? entry.reject(Error(JSON.stringify(value.error))) : entry.resolve(value.result);
    });
    socket.addEventListener('close', () => {
      for (const entry of pending.values()) { clearTimeout(entry.timer); entry.reject(Error('Browser debugger connection closed')); }
      pending.clear();
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      if (socket.readyState !== WebSocket.OPEN) { reject(Error('Browser debugger is not connected')); return; }
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
    closeBrowser = () => send('Browser.close');
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const navigate = async url => {
      const response = await send('Page.navigate', { url });
      if (response.errorText) throw Error(response.errorText);
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw Error(`Navigation timed out: ${url}`);
    };
    const screenshot = async path => {
      const metrics = await send('Page.getLayoutMetrics');
      const viewportWidth = await evaluate('innerWidth');
      const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: Math.max(viewportWidth, metrics.cssContentSize.width), height: metrics.cssContentSize.height, scale: 1 } });
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, Buffer.from(result.data, 'base64'));
    };
    await send('Page.enable');
    await run({ send, evaluate, navigate, screenshot });
  } catch (error) {
    originalError = error;
    throw error;
  } finally {
    try {
      if (closeBrowser && alive()) await closeBrowser().catch(() => {});
      socket?.close();
      if (alive()) await Promise.race([once(child, 'exit'), new Promise(resolve => setTimeout(resolve, 5000))]);
      if (alive()) {
        if (process.platform === 'win32') {
          try { execFileSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); }
          catch (error) { if (alive()) throw error; }
        } else child.kill();
      }
      // profile is the exact absolute path returned by mkdtempSync above.
      rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    } catch (cleanupError) {
      if (originalError) throw new AggregateError([originalError, cleanupError], `Browser failed: ${originalError.message}; cleanup failed: ${cleanupError.message}`);
      throw cleanupError;
    }
  }
}
