import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fedrv.de',
  output: 'static',
  cacheDir: process.env.FDWEB_CACHE_DIR || './.astro',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
});
