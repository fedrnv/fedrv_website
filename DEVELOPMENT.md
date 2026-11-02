# FEDRV.DE development guide

## Current project state
The application uses Astro + TypeScript with static output and validated Markdown content collections. The foundation is tracked in [FDWEB-002](Tasks/items/web/FDWEB-002-bootstrap-astro-site/TASK.md); later tasks add the design system, shared project template and product content.

## Intended structure
- Product descriptions are authored as content entries and rendered through a shared project-page template.
- Public images and site assets belong under `public/`; product app icons are currently in `public/icons/`.
- Routes include the home page and project pages such as `/cot`, `/update`, and `/storage`.
- Separate portals remain on their own subdomains, such as `update.fedrv.de`.

## Local development and verification
Use Node.js 24.19.0 (24.x, at least 24.19.0), npm 11.17.0 and the committed lockfile. From a clean checkout run `npm ci`, then `npm run check`, `npm run build` and `npm run verify:bootstrap`. Use `npm run dev` for development and `npm run preview` to inspect static output. PowerShell can use `npm.cmd` when required. Exact setup and content locations are in [README.md](README.md). Run task-specific checks locally before task closure; `build` itself contains no test or acceptance stage.

## Publication
The site is intended for a VPS. FDWEB-012 owns the deployment design and acceptance. Publish only through an explicit manual GitHub Actions run; no push, pull-request, schedule, release or chained workflow may deploy. A failed build must not replace the current site. Do not store SSH keys, tokens or passwords in the repository.

DNS changes and publication to the public domain are external effects. They require the exact production host, credentials and owner authorization at execution time. Document a rollback path before the first live deployment.
