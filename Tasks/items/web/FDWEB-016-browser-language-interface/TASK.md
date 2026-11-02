---
schema: fdtasks-spec/v4
id: FDWEB-016
title: "Localize the static interface in English, German and Russian"
type: Task
area: web
component: localization
epic_id: FDWEB-EPIC-D003
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Deliver the complete existing interface in the browser language, with English fallback, without a server requirement."],"packets":["One cohesive implementation and local verification packet"],"independent_acceptance":false,"boundary_reason":"Deliver the complete existing interface in the browser language, with English fallback, without a server requirement."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-004","FDWEB-005","FDWEB-006"]
created_at: 2026-11-02T18:28:59.499Z
created_by: "Owner request and Codex"
---

# FDWEB-016 ? Localize the static interface in English, German and Russian

## Goal

Deliver the complete existing interface in the browser language, with English fallback, without a server requirement.

## Inputs and source baseline

Owner request of 2026-11-02 for EN/DE/RU, browser selection with English default, four colors, FD favicon and the five exact subdomains. Source base: 4b279027e60adb7f4669e28ad299f5c6ba8fb0d0 plus the working candidate. Policy: FDTasks 5.6, SHA-256 ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403. Readiness events bind current inputs and dependencies.

## Scope

Add local translations for the shared shell, home, project summaries, 404, accessible names and metadata; select the primary browser language including regional variants; unsupported or absent language uses English. Provide a keyboard-accessible manual selector. Preserve routes and English content without JavaScript. Update direct verification contracts to allow the bounded local language script.

Allowed paths: src/i18n/**, src/components/**, src/layouts/**, src/pages/**, src/lib/project-schema.ts, src/content/projects/**, scripts/verify-*.mjs, package.json and docs.

## Boundaries and compatibility

Keep static output, existing routes and accepted records. No backend, tracking, production deployment or fabricated product capability. Original public/icons files remain byte-identical. Subdomain links are owner-provided destinations, not claims of public availability. Prior gate/review evidence remains historical and is invalidated by append-only records when source changes.

## Failure and recovery

Unsupported browser language falls back to English. Local failures block acceptance; repair in scope before closure. Empty optional content remains omitted. Preserve English HTML when scripts cannot run. Independent review failures require bounded corrections; unavailable review is not Accepted.

## Ordered implementation

1. Bind task readiness to current source/rules and dependencies.
2. Implement only this outcome and its direct verification boundaries.
3. Run declared CLI checks, inspect relevant visuals, record immutable evidence and a durable handoff.

## Readiness, impact and acceptance matrix

Risk: medium; affects the visitor-facing static interface and its direct checks. UI/accessibility and content presentation may change; no credentials, user data or production state. One implementation workspace, sequential tasks under the owner's continuous-development instruction.

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | Browser primary en/de/ru and regional variants select the matching complete translation; unsupported/absent primary selects English, including unsupported primary plus supported secondary. | Local direct verification | npm run verify:languages | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |
| AC-02 | Home, three existing project pages, 404, metadata and accessible names translate; manual choice works; no-JavaScript output remains readable English. | Local direct verification | npm run check; npm run build; npm run verify:languages; npm run verify:site | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |

## Completion evidence and cleanup

Record source/policy hashes, exact commands and outcomes, inspected visual evidence, limitations and cleanup. Keep prior accepted records immutable.
