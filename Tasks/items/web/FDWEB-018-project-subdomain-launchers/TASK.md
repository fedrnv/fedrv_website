---
schema: fdtasks-spec/v4
id: FDWEB-018
title: "Add five project shortcuts to the site header"
type: Task
area: web
component: portal-navigation
epic_id: FDWEB-EPIC-D003
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Let visitors open the five owner-specified project subdomains from recognizable header shortcuts."],"packets":["One cohesive implementation and local verification packet"],"independent_acceptance":false,"boundary_reason":"Let visitors open the five owner-specified project subdomains from recognizable header shortcuts."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-003","FDWEB-016","FDWEB-017"]
created_at: 2026-11-02T18:28:59.499Z
created_by: "Owner request and Codex"
---

# FDWEB-018 ? Add five project shortcuts to the site header

## Goal

Let visitors open the five owner-specified project subdomains from recognizable header shortcuts.

## Inputs and source baseline

Owner request of 2026-11-02 for EN/DE/RU, browser selection with English default, four colors, FD favicon and the five exact subdomains. Source base: 4b279027e60adb7f4669e28ad299f5c6ba8fb0d0 plus the working candidate. Policy: FDTasks 5.6, SHA-256 ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403. Readiness events bind current inputs and dependencies.

## Scope

Add COT, FDUpdate, FDFiles, FDTasks and FDOS shortcuts targeting https://cot.fedrv.de/, https://update.fedrv.de/, https://files.fedrv.de/, https://tasks.fedrv.de/ and https://fdos.fedrv.de/. Reuse existing matching product icons, use labelled monograms where no matching asset exists, and preserve local project-description links. Keep the header usable by keyboard and on narrow screens.

Allowed paths: src/components/ProjectLaunchers.astro, src/layouts/SiteLayout.astro, src/styles/global.css, translations and focused browser checks.

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
| AC-01 | All five named header links point exactly to the owner-specified HTTPS subdomains and retain accessible names in all three languages. | Local direct verification | npm run verify:portal | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |
| AC-02 | Matching existing icons are reused without modification; monograms identify projects without supplied icons; header has no overflow at 360/1440px. | Local direct verification | npm run verify:portal; npm run verify:accessibility; npm run verify:browser | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |

## Completion evidence and cleanup

Record source/policy hashes, exact commands and outcomes, inspected visual evidence, limitations and cleanup. Keep prior accepted records immutable.
