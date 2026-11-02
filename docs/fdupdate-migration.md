# FDUpdate information preservation

The owner requested preservation of `https://update.fedrv.de/` before redesigning that source. FDWEB-009 owns this migration; its additional source-preservation criteria are recorded in an append-only scope event.

The exact source snapshot is in `Tasks/items/web/FDWEB-009-fdupdate-page/evidence/source-2026-11-02/`. Its manifest records source URLs, fetch status, time, size and SHA-256 for each HTML page and asset. The captured landing page identifies version 0.0.13.0. Original CSS/JavaScript/favicon, search data, sitemap and robots are archived as well; the original scripts/styles are not executed by the new site.

Of 46 reachable information routes, 23 returned HTML successfully (the landing and 22 documentation pages); 23 documentation URLs returned HTTP 503. Those failed responses are retained as evidence. Their information was recovered from the canonical `fedrnv/FDUpdate` source at commit `b9aaed996f80b311330bb21301184e69ae8f6897`, with both the original Markdown and generated HTML archived. Of the 21 available document articles compared with that source, 19 matched exactly; the two differing live articles were preserved as served rather than overwritten by newer repository text. Every rendered document records whether it came from the website or repository.

`/update` uses the shared FEDRV header, palette, typography, cards, buttons and footer. It retains all original landing text, code example, navigation destinations and license/service-boundary text, with English/German/Russian presentation. The 45 documentation pages are served locally under `/update/docs`; technical document content remains in its original English, labelled accordingly. Links among copied documents are remapped locally, so redesigning the external landing page does not remove the preserved information. Binaries, authenticated operations and service APIs are not mirrored. External GitHub links remain external.

## Reproduce and verify locally

```sh
npm run import:update
npm run check
npm run build
npm run preview
```

With preview running in another terminal:

```sh
npm run verify:update
npm run verify:site
npm run verify:languages
npm run verify:accessibility
```

The importer works entirely from the recorded snapshot and fails on changed hashes or unexpected active content. It writes `src/data/fdupdate-site.json` deterministically; no live website or IDE is needed. The browser check compares every landing/document text and code block with the archived source, checks all documentation routes at 360/1440px and runs axe on the imported documents. Screenshots are saved to `.local/screenshots/update/` for inspection. Local checks are task acceptance evidence, not proof of a production deployment.
