---
schema: fdtasks-spec/v4
id: FDWEB-020
title: "Independently review the multilingual portal candidate"
type: Task
area: quality
component: epic-d003-review
epic_id: FDWEB-EPIC-D003
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Obtain an independent acceptance review of the frozen multilingual portal and its gate evidence."],"packets":["One cohesive implementation and local verification packet"],"independent_acceptance":false,"boundary_reason":"Obtain an independent acceptance review of the frozen multilingual portal and its gate evidence."}
initial_priority: P1
initial_status: Planned
initial_dependencies: ["FDWEB-019"]
created_at: 2026-11-02T18:28:59.499Z
created_by: "Owner request and Codex"
---

# FDWEB-020 ? Independently review the multilingual portal candidate

## Goal

Obtain an independent acceptance review of the frozen multilingual portal and its gate evidence.

## Inputs and source baseline

Owner request of 2026-11-02 for EN/DE/RU, browser selection with English default, four colors, FD favicon and the five exact subdomains. Source base: 4b279027e60adb7f4669e28ad299f5c6ba8fb0d0 plus the working candidate. Policy: FDTasks 5.6, SHA-256 ddb4f644496956b9fd2ba45752a62e3fd6800412ef477aeb882f4214c46a8403. Readiness events bind current inputs and dependencies.

## Scope

A different person or a fresh independent model session reviews D003 source, translations, browser fallback behavior, palette/favicon, shortcuts, responsive evidence and gate. Write immutable request/result records. The author does not self-accept this review.

Allowed paths: D003 review request/result artifacts and review task events.

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
| AC-01 | Request and result identify the exact candidate, gate and reviewer independence boundary. | Local direct verification | Inspect immutable REQUEST.md and RESULT.md | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |
| AC-02 | Blocking findings are resolved or the result remains explicitly not Accepted. | Local direct verification | Independent read-only source and evidence review | Static build / local Chromium; no hosted acceptance | Current PASS or explicit blocker |

## Completion evidence and cleanup

Record source/policy hashes, exact commands and outcomes, inspected visual evidence, limitations and cleanup. Keep prior accepted records immutable.
