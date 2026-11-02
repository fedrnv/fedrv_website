# FEDRV.DE

Static Russian-language website for FEDRV projects, built with Astro and TypeScript. Product pages and the final home page are tracked in the canonical [Tasks ledger](Tasks/README.md).

## CLI quick start

Use Node.js **24.19.0** (24.x, at least 24.19.0) and **npm 11.17.0**. The npm version is pinned by `packageManager`; engine checks reject incompatible installations. Install this npm version with `npm install --global npm@11.17.0` if needed. With nvm, run `nvm install` and `nvm use` where supported, or select the version in `.nvmrc` explicitly.

```sh
npm ci
npm run dev
```

The dev server listens on localhost; use its printed URL. In Windows PowerShell, `npm.cmd` can be used instead of `npm` if script execution policy prevents `npm.ps1`.

```sh
npm run check
npm run build
npm run verify:bootstrap
npm run preview
```

`check` validates Astro/TypeScript and content. `build` produces static files in `dist/`; it does not run tests or publish. `verify:bootstrap` inspects the built shell, 404 and icons locally. `preview` serves the build on localhost. A clean checkout needs only `npm ci` before these commands. Failed builds must be corrected before using the output; no server or IDE is required to build.

With preview running on `http://127.0.0.1:4321`, run `npm run verify:browser` in another terminal. It checks desktop/mobile layout and keyboard navigation using installed Chrome on Windows or `chromium` elsewhere. Set `FDWEB_BROWSER` to another Chromium executable, `FDWEB_PREVIEW` to another preview URL, or `FDWEB_SCREENSHOTS` to an evidence directory when needed. The isolated temporary profile is removed after each run; screenshots default to `.local/screenshots/bootstrap/` and must be inspected before UI acceptance.

## Content and source

Project entries live in `src/content/projects/*.md`, validated by `src/content.config.ts`. `foundation-fixture.md` is a draft schema fixture and is not a product or published route. Shared markup lives in `src/layouts/`; static routes are under `src/pages/`. Existing product SVGs in `public/icons/` are preserved. Site URL: `https://fedrv.de`.

Task acceptance runs locally. Deployment is manual and belongs to FDWEB-012; a successful local build does not mean the site is live.

The current home page uses three project records and the shared project template. Run `npm run verify:home` against preview to follow all three cards. See [content authoring](docs/content.md), [source baseline](docs/content-sources.md) and [design verification](docs/design.md). FDStorage remains explicitly limited pending current project evidence.

See [local verification](docs/verification.md) for metadata/link checks (`npm run verify:site`), accessibility checks (`npm run verify:accessibility`) and the keyboard/visual checklist. Pages include canonical and Open Graph metadata, local sharing artwork and favicon; sitemap/robots are generated from the collection. The 404 page is excluded from indexing.
