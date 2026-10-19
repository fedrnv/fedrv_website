# FEDRV.DE development guide

## Current project state
The repository contains planning records and product SVG assets. The site application has not yet been bootstrapped. The accepted stack decision is tracked in [FDWEB-002](Tasks/items/web/FDWEB-002-bootstrap-astro-site/TASK.md): Astro + TypeScript, static output, and Markdown/MDX project content.

## Intended structure
- Product descriptions are authored as content entries and rendered through a shared project-page template.
- Public images and site assets belong under `public/`; product app icons are currently in `public/icons/`.
- Routes include the home page and project pages such as `/cot`, `/update`, and `/storage`.
- Separate portals remain on their own subdomains, such as `update.fedrv.de`.

## Local development and verification
FDWEB-002 must initialize the package manager, Node version policy, scripts and exact commands. Once established, document and use those commands for local development, type/content validation and static builds. Run task-specific checks locally before task closure.

## Publication
The site is intended for a VPS. FDWEB-012 owns the deployment design and acceptance. Publish only through an explicit manual GitHub Actions run; no push, pull-request, schedule, release or chained workflow may deploy. A failed build must not replace the current site. Do not store SSH keys, tokens or passwords in the repository.

DNS changes and publication to the public domain are external effects. They require the exact production host, credentials and owner authorization at execution time. Document a rollback path before the first live deployment.
