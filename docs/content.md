# Project content

Add a Markdown file under `src/content/projects/`. Its front matter is the single source for the project route and home-page card. The required fields are `name`, unique `slug`, `summary` (up to 240 characters), `purpose` and `status`. Status is `planned`, `development`, `available` or `information` (the latter means documentation is still being clarified). Use `draft: true` to validate without publishing.

Optional fields are `order`, an existing `icon` path, `capabilities`, `benefits`, `plannedCapabilities`, `documentation` (a list of `{ label, url }`), `portal` (`{ label, url }`), and `image` (`{ src, alt }`). Links must use verified HTTPS URLs. Images must exist below `public/images/` and need nonempty alternative text. Existing icons are decorative alongside product names. Absent links/lists render no section; absent images use an intentional text fallback.

Markdown body headings start at `##`: the shared template owns the single page H1. Do not add invented capabilities, public-service availability, screenshots or unverified URLs. Planned capabilities have a separate visible section. Product-specific tasks own source verification and detailed copy.

Run `npm run check` and `npm run build`, then `npm run verify:content`. The content test runs the real Astro CLI against disposable fixture directories and fails if invalid input is accepted. Fixtures cover minimal optional content, missing required metadata, unsafe links and duplicate routes. Fixture/cache/output directories are removed afterward. `FDWEB_CONTENT_DIR` and `FDWEB_CACHE_DIR` are local test overrides; normal builds use the source collection and `.astro/` cache.
