# FDTasks 5.7 developer-policy adoption

Version: 5.7
Governing Correction: FDWEB-022

## Current authority and precedence

Read the complete [FDTasks 5.7 lifecycle](tasks_file_structure_v5_7.md).
It is the current rule source for human and owner-authorized manual AI
development. This explicit owner-requested adoption supersedes older generic
developer-rule references in AGENTS.md, DEVELOPMENT.md and FORMAT.md.
Product-specific safety boundaries and explicit owner exceptions remain binding.
The source is pinned in [developer-policy.json](developer-policy.json):
`fedrnv/FDOS@cd07d0d0f4bf0644321fd09a1375b0fd87d0bc1c`, blob
`269124fdc48926c0c5fb1a53b0ffa47f78699aed`, SHA-256 `b7c6929e7bbf540ec19cf23beeca24d47030c7654ba5501e019ce5938b137dd8`.

## Shared development and status mapping

Several developers may work on different tasks of one Epic. Each executable
task has exactly one published owner. The project's one-active-development-Epic
policy remains separate from contributor concurrency.

| FDTasks 5.7 meaning | Existing local label |
| --- | --- |
| Planned, available after dependency/rule revalidation | Planned |
| In Progress, exclusively owned after successful publication | In Progress |
| Done, verified and published | Done |

1. Fetch current authoritative GitHub main and reconstruct task state before
   selecting a dependency-ready Planned task. Do not claim another owner's work.
2. Append the supported status-change event with the actual stable owner and
   exact published base/task revision. Commit and immediately push with normal
   fast-forward/expected-revision protection. Begin implementation only after
   the claim's successful publication is confirmed.
3. After a competing claim wins, preserve the rejected local attempt, refresh
   and select another Planned task. Never rebase, merge or replay a lost claim
   over the winner. With only unrelated remote updates, construct a fresh claim
   against the new validated base. Reconcile unknown push outcomes by exact
   event/commit identity before retrying or selecting work.
4. Run the selected focused checks, make a coherent task-scoped commit and
   immediately push it. Resolve a failed or uncertain push before another
   commit or task. Revalidate ownership, scope and affected checks on ordinary
   source conflicts; unchanged accepted functional inputs need no test rerun.
5. Verify all ACs, append closure evidence and Done, commit and immediately
   push. Refresh published project state before selecting and publishing the
   next Planned task's claim. Local Done is not published closure.

Resume only your own published current claim after revalidation. Unresolved
ownership is not free work. No automatic lease, expiry or silent takeover is
introduced. Existing accepted claims, statuses and event schemas remain valid.

## Compatibility and supported entry points

The supported entry points qualified by this document are developer reading of
root/path instructions and ordinary protected Git publication on main. This is
the same separation used by FDOS's 5.7 developer supplement: publishing rules
does not prove that an automatic scheduler, native admission engine or legacy
validator implements those semantics. Existing runtime/lifecycle/profile pins,
validators and their previously accepted evidence remain at their actual
supported versions until separately qualified. They must not be relabelled 5.7
or bypassed to execute a task. Use the manual workflow only within existing
authority and supported record formats; an unsupported automated route stays
blocked and reports its actual limitation.

Accepted task/Epic/ADR/event/evidence/version records and older policy files
remain byte-identical. Keep every existing task identity, parent, owner,
dependency, evidence and spent authority. Nonterminal work revalidates its
current policy/dependency boundary before the next claim or resume. Adoption
does not close, reopen, reparent, supersede or steal any existing product task.
Use S001 for this process Correction; never close or version the special Epic.
No product or hosted-workflow change is included in rule distribution.
