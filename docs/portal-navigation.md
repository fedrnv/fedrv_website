# Header project shortcuts

The owner supplied these five HTTPS destinations on 2026-11-02: `cot.fedrv.de`, `update.fedrv.de`, `files.fedrv.de`, `tasks.fedrv.de` and `fdos.fedrv.de`. The shared header opens them directly in the current tab; the home-page cards still open local descriptive pages. A shortcut does not assert public signup or service availability.

FDUpdate reuses `public/icons/fd-update.svg`. FDFiles reuses the matching `public/icons/fd-storage.svg`: its SVG geometry/colors were compared with the actual FDFiles `assets/icons/fdfiles.svg` and `src/fdfiles/static/logo.svg` in the adjacent repository. This asset match does not rename the still-qualified FDStorage description or infer product architecture. No icon bytes are modified. COT uses the same COT monogram as its project card; FDTasks and FDOS have labelled T/OS monograms where no matching local product image was supplied.

The native links have translated accessible names, visible project names, decorative icons, ordinary keyboard focus and at least 44px target dimensions. The mobile header keeps all five shortcuts visible. Run `npm run verify:portal` against preview for exact destinations, local icon loads, 360/1440px geometry and Tab navigation in all three languages. No external deployment or authenticated service action is performed by these checks.
