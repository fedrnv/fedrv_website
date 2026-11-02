---
schema: fdtasks-spec/v4
id: FDWEB-019
title: "Verify the multilingual portal interface as an integrated static candidate"
type: Task
area: quality
component: epic-d003-gate
epic_id: FDWEB-EPIC-D003
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Verify language selection, four-color identity and project entry shortcuts together on one frozen candidate."],"packets":["One cohesive implementation and local verification packet"],"independent_acceptance":false,"boundary_reason":"Verify language selection, four-color identity and project entry shortcuts together on one frozen candidate."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-016","FDWEB-017","FDWEB-018"]
created_at: 2026-11-02T18:28:59.499Z
created_by: "Owner request and Codex"
---

# FDWEB-019 ? Verify the multilingual portal interface as an integrated static candidate

## Goal

Verify language selection, four-color identity and project entry shortcuts together on one frozen candidate.

## Inputs and source baseline

Owner request of 2026-11-02 for EN/DE/RU, browser selection with English default, four colors, FD favicon and the five exact subdomains. Source base: 4b279027e60adb7f4669e28ad299f5c6ba8fb0d0 plus the working candidate. Policy: FDTasks 5.6, SHA-256 ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403. Readiness events bind current inputs and dependencies.

## Scope

Run member-declared type/build, language, brand, header, metadata and accessibility checks; inspect desktop/mobile screenshots; bind the results to an exact source manifest. Do not deploy or substitute this gate for independent review.

Allowed paths: D003 evidence and direct local integration checks.

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
| AC-01 | Each D003 member criterion maps to current passing local evidence for the same source candidate. | Local direct verification | npm run check; npm run build; npm run verify:languages; npm run verify:brand; npm run verify:portal; npm run verify:site | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |
| AC-02 | All languages, keyboard navigation, page routes and project shortcuts work together at desktop/mobile sizes without critical accessibility defects. | Local direct verification | npm run verify:accessibility; npm run verify:browser | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |

## Completion evidence and cleanup

Record source/policy hashes, exact commands and outcomes, inspected visual evidence, limitations and cleanup. Keep prior accepted records immutable.
