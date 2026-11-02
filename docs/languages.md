# Interface languages

The static HTML is English. A bundled local module selects the primary browser language: `en`, `de` or `ru`, including regional variants such as `de-AT` and `ru-RU`. An unsupported or missing primary language falls back to English even when a secondary preference is supported. No language service or external request is used.

The native EN/DE/RU selector updates interface text, accessible names, page title/description, Open Graph metadata and the document language. A manual choice is kept in session storage for navigation within the current tab. If storage is unavailable, automatic selection and switching still work. With JavaScript disabled, the server-rendered English page remains available.

Shared interface strings are in `src/i18n/messages.ts`; behavior is in `src/i18n/client.ts`. Existing project entries keep their Russian source copy and provide `translations.en` and `translations.de` for summaries/purposes/portal labels. Published product details added later must supply their own translated content; this task does not fabricate missing product claims. JSON dictionaries are escaped for inline embedding and values are applied with textContent/attribute setters, never interpreted as HTML.

Run `npm run check`, `npm run build`, `npm run verify:site` and `npm run verify:languages` with static preview running. The language check exercises all current routes, primary/secondary preference precedence, regional and absent languages, manual selection, no-JavaScript English and desktop/mobile layouts. Screenshots are written to `.local/screenshots/languages/` for inspection.
