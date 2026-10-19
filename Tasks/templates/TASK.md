---
schema: fdtasks-spec/v4
id: <PROJECT>-<ID>
title: "Observable medium outcome"
type: Task
area: <area>
component: <component>
epic_id: <PROJECT>-EPIC-D001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["One smallest complete result"],"packets":["One cohesive implementation and verification packet"],"independent_acceptance":false,"boundary_reason":"Explain why this is one independently acceptable result"}
initial_priority: P1
initial_status: Planned
initial_dependencies: []
created_at: YYYY-MM-DDTHH:MM:SSZ
created_by: "actor"
---

# <PROJECT>-<ID> — Outcome

## Classification

Use the relevant open development Epic for bugs belonging to its development.
If the related Epic is closed, or the relationship is unclear, use EPIC-S002 and
do not reopen the closed Epic; link it for traceability when known.
For isolated bugs and minor improvements, use
`epic_id: <PROJECT>-EPIC-S002`. Such items require testing changed functionality and
directly affected behaviour; full testing and independent review require an
explicit verification task within EPIC-S002. One task may request both. Define
the selected scope and dependencies; do not depend on every EPIC-S002 item.
New process/rule Corrections use `epic_id: <PROJECT>-EPIC-S001`. An accepted
numeric development Epic may keep necessary members without changing identity.

## Goal

One independently verifiable outcome.

## Inputs and source baseline

Exact source revision, specifications, contracts and prior evidence.

## Scope

Included behaviour only.

## Boundaries and compatibility

Explicit exclusions, security, data and compatibility boundaries.

## Failure and recovery

Error, cancellation, retry and preservation behaviour.

## Ordered implementation

Use one task-scoped execution envelope: batch Model 1 decomposition, complete
sequential microtasks with focused checks, stabilize the candidate, run the
diff-local checks and direct changed-boundary tests once, review the diff, clean owned artifacts,
summarize bounded local evidence in material events, and publish according to
repository policy. Do not create an approval, event or commit per internal command.

## Readiness, impact and acceptance matrix

Risk: <low/medium/high + reason>.
Affected components and dependent callers: <paths/scenarios>.
UI/data/concurrency/compatibility/security impact: <assessment>.

| AC ID | Observable criterion/tolerance | Test level and scenario | Trusted command or manual steps | Fixture/environment | Expected result |
| --- | --- | --- | --- | --- | --- |
| AC-01 | <criterion> | <unit/integration/UI/etc.> | <command/steps> | <fixture> | <result> |

## Completion evidence and cleanup

Record exact source, environment, outcomes, limitations, review and inspected
visual evidence when applicable. Never leave placeholders in a ready task.
This specification is immutable after acceptance; later changes are events.

Default one packet. Two or three require an explicit short
`atomicity.inseparability_reason` explaining unsafe/incomplete intermediate
behavior. Existing semantic review must reject misleading declarations.
