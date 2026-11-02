# FEDRV visual system

The shared system uses neutral white/light gray surfaces, dark ink, muted gray text and a blue accent. Tokens live in `src/styles/global.css`. Typography uses local system fonts, with no third-party requests. Cards, breadcrumbs, buttons, status badges and optional image/link blocks are shared Astro components.

Preserve all original SVG geometry and colors. COT has no confirmed dedicated icon in this repository: use its text monogram instead of borrowing another product's icon. Unavailable screenshots use a plain explanatory block. Empty optional link lists render nothing. Status labels explicitly distinguish planned, in-development, available and insufficiently documented projects.

## Local visual verification

To inspect component edge cases without publishing a sample route, set `FDWEB_COMPONENT_FIXTURE=1` for a local `npm run build`, then run preview and `npm run verify:browser`. In PowerShell:

```powershell
$env:FDWEB_COMPONENT_FIXTURE = '1'
npm.cmd run build
Remove-Item Env:FDWEB_COMPONENT_FIXTURE
npm.cmd run preview
```

Inspect 360px and 1440px screenshots, long titles, planned badges, empty link lists, image fallback, and Tab/Enter navigation. Focus outlines must be visible. Run a normal `npm run build` before publication so the fixture is absent. No demo product is a real availability claim.
