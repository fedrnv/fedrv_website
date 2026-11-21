---
schema: fdtasks-spec/v4
id: FDWEB-022
title: "Adopt FDTasks 5.7 developer rules from FDOS"
type: Correction
area: governance
component: developer-policy
epic_id: FDWEB-EPIC-S001
size: medium
outcomes: 1
implementation_packets: 1
atomicity: {"outcomes":["Publish the exact FDTasks 5.7 developer policy with local compatibility"],"packets":["Policy, entry points, source identity and adoption evidence"],"independent_acceptance":false,"boundary_reason":"The policy requires its source binding and local precedence to be usable"}
initial_priority: P1
initial_status: Planned
initial_dependencies: []
created_at: 2026-11-21T21:09:50Z
created_by: "Codex FDTasks 5.7 repository rollout"
---

# FDWEB-022 — Adopt FDTasks 5.7 developer rules

## Goal and authority

The owner explicitly requested distribution of FDOS's FDTasks 5.7 rules to all
repositories containing older rules. Publish the exact source document and make
human and owner-authorized manual AI development use it prospectively.

## Inputs and source baseline

Repository base: `b77b95e8da2d9282005b70edd92c3bea508b062f`. Source: `fedrnv/FDOS` commit
`cd07d0d0f4bf0644321fd09a1375b0fd87d0bc1c`, `Tasks/tasks_file_structure_v5_7.md`,
Git blob `269124fdc48926c0c5fb1a53b0ffa47f78699aed`, SHA-256 `b7c6929e7bbf540ec19cf23beeca24d47030c7654ba5501e019ce5938b137dd8`.
Read root/path AGENTS.md and DEVELOPMENT.md, the current Tasks entry points and
this Correction. Expected effect: published exclusive task ownership prevents
competing developers from implementing the same unclaimed task.

## Scope, compatibility and failure handling

Own the new versioned policy, `Tasks/FDTasks_5_7_ADOPTION.md`,
`Tasks/developer-policy.json`, current AGENTS/DEVELOPMENT/FORMAT entry points,
the appended lifecycle-history entry and this task's immutable records.
Preserve accepted specifications, events, older policies, native/runtime
manifests, validators, workflows and product source. This is developer-rule
publication, not implementation or qualification of automatic remote claiming.
On a rejected ref update, refresh and revalidate ownership and changed paths;
never overwrite another writer or replay a losing task claim. Missing or
uncertain publication blocks implementation. Preserve existing owner exceptions.

## Acceptance and focused verification

| AC | Observable result | Local check and expected result |
| --- | --- | --- |
| AC-01 | The local 5.7 source is byte-identical to FDOS. | SHA-256 and Git-blob identity match the pinned source. |
| AC-02 | Developer entry points resolve 5.7, exact source, local status mapping and precedence. | Inspect the candidate documents and validate their local links and manifest hashes. |
| AC-03 | Claims publish before implementation; stale claim losers reselect; every commit and verified closure publish immediately. | Inspect all five upstream workflow steps and exercise winner/loser/unrelated-update cases with normal Git fast-forward pushes. |
| AC-04 | Historical/product/native bytes stay intact. | Candidate changes are limited to the explicit document/record allowlist; compare every replaced file to the fetched base and verify preservation of old body/history bytes. |

Risk is low: documentation and new governance records only. There is no runtime,
GUI, persistence schema, deployment, account or billing change. Focused checks
run on Linux with Python and Git; no product suite or Epic gate is selected.
Record exact hashes, outcomes and limitations in this task's evidence. First
verified closure creates one immutable version request; allocation remains
owned by the existing publisher and is not hand-edited here.
