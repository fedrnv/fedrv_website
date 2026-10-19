# FDTasks File Structure v5.6

Version: 5.6

## Authority and compatibility

This document is the normative cross-repository FDTasks lifecycle. The immutable
v3 envelope and append-only storage format remain valid historical input.
Accepted v4.3, v5.0, v5.1, v5.2, v5.3, v5.4 and v5.5 records also remain valid historical input. This successor
requires no in-place rewrite of accepted records or events. Nonterminal work may
be adopted unchanged when compliant or replaced through the append-only migration
procedure below.
Repository `DEVELOPMENT.md` files may add product-specific local suites,
environments and safety boundaries, but may not move acceptance tests into hosted
workflows or weaken this lifecycle. Consuming repositories may set stricter local
checks and use build/package workflows within the boundary below. Conflicts are
resolved in favour of this document unless an explicit owner-authorized successor
says otherwise.

Lifecycle changes are recorded in
[`LIFECYCLE_VERSION_HISTORY.md`](LIFECYCLE_VERSION_HISTORY.md).

## Work hierarchy

### Typed Epic identities from 5.3

New development Epics use `<PROJECT>-EPIC-D001`, `D002`, and successive
three-digit development numbers. The `D` category is explicit so a development
sequence cannot collide with a reserved special Epic. New special Epics use a
category letter and three-digit number: `<PROJECT>-EPIC-S001` is the permanent
repository task/development/process/orchestration rule Correction container;
`<PROJECT>-EPIC-S002` is the permanent isolated small bug, correction and
maintenance container. The prefix category is intentionally extensible; a new
category or special number requires a later normative successor before use.
Allocation is per project and category; take the first unused `D` number, never
reuse an identity, and validate the exact `PROJECT-EPIC-[DS][0-9]{3}` shape and
the category's defined semantics. A typed identifier does not by itself authorize
a new special category. `D000` is invalid; after `D999`, publish a successor
before extending the width.

Numeric development Epic identities accepted before 5.3, including
`<PROJECT>-EPIC-001` and `002`, remain valid immutable historical containers.
They may continue receiving necessary members and append-only events for their
accepted development objective, including correction findings and gate/review
work. After all members pass the historical lifecycle gate and independent
review, each may close once with its normal Epic closure event and version
request. Closure ends membership; do not reopen it. No new numeric Epic identity
may be created after adoption. The exception applies only to development Epic
identities listed in the consuming repository's accepted pre-5.3 inventory.

The reserved numeric `<PROJECT>-EPIC-990` and `999` remain valid, permanently
open historical containers. Their accepted members may finish under their
accepted parent and receive the normal first item-closure request, but 990/999
receive no new members, Epic closure event or Epic version request after adoption.
Do not rename an Epic, edit an accepted task's `epic_id`, duplicate a task, or
silently move membership to a typed Epic. All newly created development Epic
identities use D001 onward. New process Corrections go to S001, and new isolated
maintenance items go to S002. Bugs within an open development Epic, typed or
accepted numeric, stay with that Epic when needed for its accepted objective.

S001 and S002 remain Active permanently, are excluded from the one-active-
development-Epic allowance, and never receive a development integration gate,
independent Epic review mandate, Epic closure event or `epic_closed` version
request. Their member tasks retain focused verification and one item version
request on first verified closure. An explicit S002 task may request broader
testing or independent review for its bounded candidate.

Consuming repositories adopt 5.3 through an explicit local Correction: inventory
accepted numeric Epics, task parents, memberships and pending closure requests;
preserve their bytes and record the policy baseline; create immutable S001 and
S002 records if absent; change authoring templates, allocator and admission
validators together; publish the local adoption event and rule-source identity;
then route new process and isolated maintenance items to typed special Epics and
allocate all new development Epic identities in the D series. The inventoried
open numeric development Epics may continue necessary members/events and close
under their historical lifecycle. Revalidate queued work under the new rules.
If accepted nonterminal work needs splitting, publish and link all new records
before an append-only supersession event. Never reparent existing tasks or
synthesize membership solely to populate the new Epics. Pending closure of an
inventoried numeric development Epic remains valid through adoption when its
gate/review and first-closure identity are verified.
Rollback of an incomplete adoption removes only unaccepted candidate files;
an accepted adoption is changed by a later explicit successor, never by editing
history.

- A **development Epic** is a non-executable workstream containing a related
  series of tasks delivering one integrated outcome; this does not require a Git
  branch. Bugs belonging to development within an open typed or inventoried
  numeric development Epic are added to that Epic when necessary to finish its
  accepted objective.
- **`<PROJECT>-EPIC-S002`** is the reserved, permanently open maintenance container
  for isolated bugs and minor improvements outside a related development series.
- **`<PROJECT>-EPIC-S001`** is the reserved, permanently open process-improvement
  container for rule, task-lifecycle, development-process and orchestration-process
  defects or improvements. It is distinct from product maintenance in EPIC-S002.
- An executable **Task**, **Bug** or **Correction** is medium-sized: one
  independently verifiable outcome that an authorized executor can complete
  without inventing product, architecture or acceptance decisions.
- A **Microtask** is temporary runtime work produced from one medium item.
- Every executable item has exactly one `epic_id` and `size: medium`.
- Oversized accepted items are superseded through append-only events and replaced
  by an ordered series of medium items. Accepted records are never rewritten.
- A ready item is the smallest independently implementable, reviewable and
  verifiable complete result. The medium label never justifies multiple
  independently acceptable outcomes. Default to exactly one cohesive packet.
  Two or three packets are allowed only when accepting or publishing them
  independently would leave unsafe or incomplete behavior; record one short
  inseparability reason in the existing TASK/readiness brief. Split independent
  outcomes before creation acceptance, publication and dispatch.
- At most one development Epic is active unless the owner explicitly authorizes
  another scheduling policy. EPIC-S001 and EPIC-S002 are excluded from this limit; their tasks may
  run while a development Epic is active, subject to task dependencies.

## Permanent process Epic S001 and rule corrections

Each project creates one immutable `<PROJECT>-EPIC-S001` record and adds members by
append-only events. EPIC-S001 remains open permanently, never receives a development
gate, independent Epic review, Epic closure event or `epic_closed` version request,
and never consumes the one-active-development-Epic allowance. Its medium items
receive ordinary focused verification and one item version request on first
verified closure. EPIC-S002 remains exclusively for product maintenance.

Route only defects and improvements in normative rules, task lifecycle,
development process or orchestration process to EPIC-S001. Every discovered
material normative rule defect or improvement is its own medium Correction,
even when discovered during another task. Never edit a normative rule silently
inside another task's implementation or evidence. A Correction identifies the
affected rule layer and document, current and proposed successor versions,
concrete defect evidence, expected reliability, performance or correctness
effect, migration and compatibility plan, focused validator or test, and the
lifecycle history entry. A rule change remains a proposal until the Correction
is accepted. Product defects continue to follow development-Epic or EPIC-S002
routing.

A normative policy change publishes a new immutable successor document and
increments the lifecycle version: a compatible extension uses a minor increment;
an incompatible change uses a major increment with the lower component reset.
Update `LIFECYCLE_VERSION_HISTORY.md` in the same candidate. The current-policy
identity binds the successor version, exact document content, governing
Correction and history entry. Validators reject an altered current normative
document unless a new successor version, separate Correction and history entry
are supplied. Historical documents and accepted records stay byte-stable.
Consuming repositories adopt a successor through their own explicit task,
readiness and compatibility procedure; publication here does not mutate them.

An EPIC-S001 item may interrupt the current development Epic only when evidence
demonstrates a blocking defect, a correctness or safety defect, or repeated
material execution cost. A speculative improvement enters the normal queue.
Before interruption, durably checkpoint the exact development Epic and task,
accepted state, evidence hashes, next action, resources and authority. Bound the
process Correction and its verification; on completion or bounded stop,
automatically resume that exact interrupted Epic and task after revalidating
readiness. Repeated process arrivals cannot starve the interrupted work: only
one preemption is allowed before a successful resume or an explicit owner
rescheduling decision. The checkpoint remains valid until resumed or explicitly
superseded; selecting another convenient item is not resumption.

## Admission and rule-source closure

Every production entry point that may claim, dispatch, resume, execute or close
the same item uses the same admission decision. Admission resolves the root and
all applicable path-scoped `AGENTS.md` plus root and applicable
`DEVELOPMENT.md` files for the selected paths, and fails closed when any
required source is missing or unreadable. It records the source and policy
identity, task and dependency revisions, Epic status, and ready matrix. A
task, dependency, source or governing-rule change invalidates that readiness.
Queued work revalidates at dispatch and again after any dependency or source
change; a prior ready decision is never a permanent authorization. A missing
rule-source closure, stale revision or changed rule version blocks admission
until a fresh readiness decision is recorded. Tests must exercise actual
production entry points and every equivalent bypass path, including queued
resume and direct closure, against the same gate.

## Permanent maintenance Epic S002

Each project may create one `<PROJECT>-EPIC-S002` with a normal immutable EPIC.md
and append-only records. It remains open permanently and is never marked Done
merely because all its current tasks are Done. It is not a development milestone.
Do not generate an Epic closure event or `epic_closed` version request for it.

Route work as follows:

- A bug belonging to development within an open development Epic is added to that
  Epic and participates in its full-test and review closure cycle.
- If the related development Epic is already closed, create the bug in EPIC-S002
  and link the original Epic for traceability. Do not reopen the closed Epic
  because of that later bug.
- Isolated minor improvements, bugs without a clear development-Epic relationship,
  and bugs unrelated to an open development Epic belong to EPIC-S002.

All these items retain the ordinary medium-item contract, one `epic_id`,
acceptance criteria and immutable verification evidence. Do not move an ongoing
development series or detach existing open-Epic members into EPIC-S002 merely to
avoid its gates. Amend accepted classification only through append-only events.

Closing an ordinary EPIC-S002 item requires focused testing of its diff and direct
testing of any interface, data, compatibility or security boundary changed by the
candidate. It does not require full project testing, an
independent review, or a review request. The author's normal inspection of the
implementation diff is not an independent review.

EPIC-S002 has no automatically required full-gate or review task. To run full
testing and/or independent review, create an explicit verification Task inside
EPIC-S002. One task may request both: run the full gate first, then independently
review the same frozen candidate. Define source scope, commands, acceptance
criteria and evidence in that task. It depends on the selected work, not every
historical or future task in EPIC-S002. No blanket risk rule automatically starts
full testing or review for maintenance items; if impact cannot be bounded, record
the uncertainty and create the explicit task before running those broader checks.

Review rounds use the existing Epic review path with `epic_id: <PROJECT>-EPIC-S002`
and the explicit verification task as `review_task_id`. An Accepted result closes
only that verification task, never EPIC-S002. Findings become maintenance
corrections or members of the relevant development Epic. Repeat requested broad
checks and review through the explicit verification task if its candidate changes;
an unrelated new EPIC-S002 item does not reopen previous verification tasks.

Ordinary maintenance and verification tasks create the normal one-time item
version requests on first verified closure. ITEM increments; EPIC does not.
The full-test and independent-review requirements below remain mandatory for
development Epics; the explicit EPIC-S002 exception takes precedence.

## Atomic task admission from 5.6

Author the smallest independently implementable, reviewable and verifiable
complete result. Do not conceal multiple independently acceptable outcomes
behind vague goal wording or a medium label. Split independently deliverable
product behavior, infrastructure, final acceptance, distinct contracts or
recovery ownership before creation acceptance, publication or dispatch. A shared
producer and its direct consumers plus necessary negative/compatibility checks
may remain one atomic result when they implement one contract.

Default to exactly ONE cohesive implementation packet. Allow at most two or
three only when independently accepting or publishing those packets would leave
unsafe or incomplete behavior. Record ONE short inseparability reason in the
existing TASK or accepted readiness; convenience, shared files, or a common Epic
alone are not reasons. Keep edits, tests and microsteps on the internal checklist.
Do not impose arbitrary LOC/file/day limits or create tiny tasks per edit/test.
Reuse the existing brief and AC matrix: size review adds no approval, task event,
provider call or automatic reviewer per step. Existing authorization and review
requirements remain unchanged.

The generic authoring and admission paths require an `atomicity` mapping in the
TASK front matter (or, for legacy future dispatch, current accepted readiness):

- `outcomes`: exactly one nonempty description of the complete acceptable result;
- `packets`: one to three nonempty descriptions, default one;
- `independent_acceptance: false`: the author/reviewer declares no independently
  acceptable outcomes are bundled;
- `boundary_reason`: one nonempty short explanation of the cohesive boundary;
- `inseparability_reason`: one nonempty short explanation, required for two or
  three packets, of the unsafe/incomplete intermediate behavior.

These declarations are required evidence, not a semantic proof. Counters alone
cannot establish atomicity; the existing author/reviewer must compare the goal,
paths, contracts, failure/recovery ownership and AC matrix. A misleading single
string does not make independent outcomes atomic. Missing, malformed or declared
independent evidence is rejected by shared generic validation before new task
acceptance/publication and by all equivalent admission actions.

Compatibility: accepted 5.5 and older TASKs/events/evidence remain byte-stable
and readable. The hash-bound accepted-task inventory identifies legacy records;
new records require evidence immediately, including the governing Correction.
Legacy future admission requires an append-only `readiness-accepted` event with
`policy_sha256`, `task_sha256` and `atomicity` for the current policy and exact
TASK bytes, plus the existing brief/AC matrix. Do not rewrite old TASKs. Changed
policy/task/dependencies/rules invalidate queued readiness as before. A later
scope/dependency/readiness change requires renewed accepted readiness. Admission
may validate the existing matrix in that event for a legacy TASK that lacks it.
The readiness declaration does not itself authorize scope expansion or rewrite
accepted dependencies; ambiguous changed dependencies still stop for resolution.

Adopt 5.6 in each consuming repository through its own S001 Correction, recording
the upstream document hash, governing Correction and source commit. Inventory
accepted tasks before enforcement; update authoring and equivalent admission
paths together, then revalidate queued work. Noncompliant accepted work uses the
existing replacement-first append-only supersession procedure. Product-specific
orchestration of an oversize discovery is a separate consuming-layer concern;
this generic contract does not define provider routing or runtime scheduling.

## Required medium-item contract

A ready medium item freezes one observable objective, source baseline, inputs,
dependencies, bounded allowed paths, exclusions/non-goals, security and
compatibility boundaries, failure/recovery behaviour, one cohesive implementation
packet (two or three only with the inseparability reason below), risk and impact assessment, observable acceptance
criteria, local verification identities and cleanup.

Acceptance criteria use stable IDs (`AC-01`, `AC-02`, ...). A readiness matrix maps
each criterion to the scenario, test level, exact trusted command or manual steps,
fixture/environment, expected result and tolerance. Existing immutable tasks that
lack this information receive an append-only readiness event before dispatch.

Keep the execution brief compact. Reference standing repository policy, schemas
and architecture by stable path/version instead of copying them into every task.
Include only facts needed to implement or accept this outcome. Raw discovery logs,
conversation history, alternative designs already rejected and unrelated project
background belong in evidence or linked decisions, not in the executor brief.

Microtasks are a temporary checklist inside one executor turn/session. Do not
create a separate FDTasks item or model call for each microtask. If a packet needs
an independent result, different acceptance boundary or a new executor to recover
missing context, it is a task split rather than a microtask.

## Proportional development control

The objective of the lifecycle is verified completed work. Control, review and
evidence must be proportional to the risk and must not consume more of the normal
development cycle than implementation and validation. Append-only history protects
material project state; it does not require a Git event, approval or commit for
every internal command, model turn, preflight observation or test phase.

An accepted ready item, together with the repository's standing authorization,
creates one task-scoped execution envelope. Within that envelope an agent may
inspect the repository, edit the accepted file scope, run declared focused and
impact-selected checks, diagnose and correct in-scope failures, clean proven-owned
disposable artifacts, record evidence, and commit or publish under repository
policy without intermediate approval cycles. Fresh authorization is required only
when scope or architecture changes materially, an action is destructive or
privilege-expanding, an external/production/account/billing effect is introduced,
credentials or authority are missing, or a policy explicitly defines a one-shot
boundary.

Use this control granularity:

- Keep one primary closure target per workspace or agent. Plan its bounded
  microtasks together and continue through them without opening control-only work
  items. Parallel work requires isolated ownership, a resource budget and a stated
  integration order.
- Create immutable events for material scope or architecture decisions, status
  transitions, externally relevant failures or blockers, verification outcomes and
  closure. Keep routine reads, command invocations, provider turns, preflight data,
  hashes and resource samples in the bounded local journal/CAS/ledger and summarize
  them in the next material event.
- The default publication unit combines implementation, tests and its task record
  in one coherent commit. A separate result/closure commit is appropriate when the
  result can exist only after testing a published candidate. Additional
  control-only commits require a hard concurrency handoff, a durable blocker, or
  authorization that must precede an irreversible external effect.
- Run focused checks during implementation. Once the candidate is stable, run its
  declared diff-local set once. Correct a candidate-caused failure and rerun the
  failed and directly affected checks; do not repeat unchanged accepted checks.
  Reuse a content-addressed
  PASS when source, policy, toolchain, command, environment and inputs are identical.
  Evidence formatting, projection or publication repair alone does not invalidate
  technical evidence.
- Store detailed streams, manifests, provider material and resource samples in the
  bounded local evidence store. Git records compact hash-bound summaries, exact
  commands and outcomes needed for audit and portability. Commit raw logs or large
  evidence only when an acceptance criterion or recovery requirement needs them.
- Use the existing clean workspace before creating another. The default limit is
  two active worktrees per repository: one implementation workspace and one
  independent verification workspace. More require an explicit parallel-work plan,
  ownership boundaries, resource limits and cleanup. Reuse safe content-addressed
  build caches and remove a stale owned worktree only after proving it contains no
  unique changes.

Before widening a gate or adding a control step, state the risk it mitigates and
why an existing check cannot cover it. If process-only work repeatedly dominates a
cycle or prevents a medium item from closing, batch or remove redundant controls
and create one bounded process correction. This rule never weakens security,
required independent review, immutable material history or explicit authorization
for external effects.

## AI-agent continuation and turn boundaries

The lifecycle above defines actor-neutral task identity, dependencies, acceptance,
evidence, events, status, version requests and closure. A human executor follows
that same contract and may complete work without an AI role, model turn or
automatic dispatch. The following continuation and turn rules apply only when an
AI agent accepts an Epic objective.

After accepting an Epic objective, one AI agent continues dependency-ready items
through the requested authorized boundary. After an item is successfully
verified and closed, it selects the next dependency-ready item in that objective
without requiring another user action. A successful item does not itself end the
Epic objective and does not expand the accepted authorization boundary.

One IDE/agent turn owns at most one task identity. A later turn may resume that
same task identity. Moving to another task requires a fresh IDE/agent turn and a
bounded durable checkpoint containing all of: task identity; accepted state;
evidence hashes; exact next action; and resource/authority status. The checkpoint
is a concise handoff, never an unbounded chat transcript, polling loop or claim
that hidden conversational context persists.

The AI continuation loop stops only for one of these objective conditions. For
each stop, record the exact reason and the predicate that permits restart:

1. **Requested success boundary reached.** Record the completed boundary; restart
   only on a newly accepted objective or explicit authorized continuation.
2. **Explicit user stop or pause.** Record the user instruction; restart only
   when the user explicitly resumes or replaces it.
3. **Required input unanswered.** Record the specific decision or information
   needed; restart when that answer is available.
4. **Authority or credential missing.** Record the missing authority or
   credential; restart when it is supplied or granted.
5. **Safety or policy conflict.** Record the conflicting rule and affected
   action; restart when the conflict is resolved or an authorized safe path is
   established.
6. **Bounded recovery exhausted.** Record the attempted recovery bounds and
   outcome; restart only after a changed candidate, condition or authorized
   recovery plan is available.
7. **External effect uncertain and reconciliation required.** Record the
   uncertain effect and reconciliation needed; restart after its outcome is
   reconciled.

Ordinary task success, context pressure, or an available dependency-ready item
is not a reason to silently stop the accepted Epic objective. Functional
failures are never retried unchanged, and external effects still require the
explicit authorization defined by this lifecycle.

## Verification levels

1. **Microtask:** run the focused checks assigned to that bounded change before
   advancing.
2. **Medium item:** before its source commit, run short focused checks for the changed behavior and direct tests
   for every interface, persistence, compatibility or security boundary changed
   by the diff; review the actual diff, clean owned disposable artifacts and
   record exact evidence. Do not automatically add dependent, invariant,
   canonical or whole-project suites.
3. **Development Epic gate:** once all implementation/correction items are ready
   for Epic closure, run one targeted local integration gate on a frozen candidate.
   Cover the areas
   changed by the Epic and their direct interaction boundary. Do not expand the
   gate to unrelated project areas merely because a canonical suite exists.
4. **Development Epic review:** after a successful current gate, perform an independent
   Level-0 review through a separate medium review task and immutable review
   request/result artifacts.
5. **Release:** run release build, signing, install/update/rollback acceptance and
   publication checks under separate authorization.

Test selection follows behavioural impact, not filenames alone. A changed shared
API, schema, workflow, persistence or security boundary requires its direct
contract/negative tests. It does not automatically select every dependent caller.
If impact cannot be bounded, the item is not ready: split it or create a separate
explicit verification task rather than using a project-wide suite as discovery.
EPIC-S001 and EPIC-S002 items follow the same local rule.
Functional failures are never retried unchanged. A project may permit one
host-controlled infrastructure retry after cleanup; PASS after FAIL is FLAKY and
does not by itself accept the candidate.

Evidence identifies the source SHA, policy SHA, commands/manual scenarios,
environment, fixtures/seeds, outcomes including fail/skip/timeout, limitations,
reviewer and cleanup. Textual model claims and unavailable checks are not passing
evidence. UI changes require interaction tests and inspected visual evidence on
the supported sizes, DPI/themes and packaged/native targets.

### Local verification and hosted workflow boundary

Task acceptance and Epic-gate tests run in the owning local development or
verification turn before the applicable source or closure commit. A medium item
uses its declared short diff-focused checks and direct changed-boundary tests;
the development Epic runs its targeted changed-area and direct-interaction gate
once on the closure candidate. Candidate-caused changes invalidate only affected
evidence. Record exact commands, results and source/policy identities in the
immutable closure evidence. Committed evidence is consumed, not regenerated, by
hosted publication.

GitHub Actions and other hosted CI workflows may compile, build, package and
publish artifacts. They may perform only narrow deterministic input/schema
checks necessary to safely carry out that build or publication and narrow
integrity checks of the resulting package. Such checks must not exercise task
acceptance, product behaviour or an Epic gate. Hosted workflows must not run
focused task tests, integration or project-wide test suites, load/soak tests,
refactoring verification, or an automatic broad quality gate. This applies to
every manually dispatched hosted workflow, including release and deployment.
Separate tasks may authorize broader tests locally; they do not grant a hosted
workflow an implicit test exception. A deliberate exception requires a later
explicit lifecycle successor.

The restriction follows the complete reachable command graph, not just the YAML
step name or first command. A workflow step called `build` violates it if an npm,
Cargo, shell or program wrapper invoked by that step runs a test stage. A package
integrity check is allowed only when it validates artifact structure or metadata
without invoking a product/task test suite. Before publishing a workflow change,
inspect the workflow and every local build/publication entrypoint it invokes,
including nested scripts and task runners; document their reachable stages and
run a local policy check. An opaque, changed or unreviewed wrapper fails closed
until its command graph is inspected. Do not treat a successful hosted build as
task or Epic acceptance evidence.

Consuming repositories adopt 5.5 by an explicit local S001 Correction: inventory
all hosted workflow triggers and transitive entrypoints, remove automatic
triggers and test stages, move version allocation into local closure publication,
add manual artifact cleanup when build artifacts are retained, update local
workflow-policy checks, then revalidate queued work. Preserve accepted 5.4
records and evidence byte-for-byte; no historical rewrite is required.

## Mandatory Epic gate and review tasks

Every newly created development Epic (excluding EPIC-S001 and EPIC-S002) delivers one integrated
behavior area and normally contains no more than six functionality items, exactly
one targeted integration-gate task and one separate independent review task.
Larger outcomes are split into dependency-ordered Epics before dispatch. The gate
depends on the implementation/correction set;
the review depends on the gate. The gate never depends on the review. Membership
is resolved from the Epic specification plus all append-only membership events.

For an already accepted open development Epic that lacks this topology, add the two medium
items and membership/dependency events before closure; do not rewrite its original
records. A historically closed Epic is not rewritten retroactively.

The review task owns immutable rounds under
`Tasks/epics/<epic>/reviews/<review-id>/REQUEST.md` and `RESULT.md`. The reviewer
must be a different person or a fresh independent model session and must disclose
the independence boundary. A request is not approval. Only an `Accepted` result
for the current tested source can close the review task.

Findings become medium correction items in the same Epic. Adding a correction or
changing the candidate immediately reopens a Done gate and any Done review task by
new events. After corrections, repeat the targeted gate and create a new review
round. Keep all prior rounds. Epic closure requires every member Done, the latest
gate passed, the latest review Accepted, all blocking findings resolved and a
separate Epic closure event/evidence.

An Epic normally admits no more than four correction items between clean gate
attempts. A fifth correction freezes new functionality and requires a split or an
explicit owner-authorized exception. Security, data-loss, compatibility or
regulatory corrections may exceed the normal bound by at most two when the event
records why a split would be less safe.

Project-wide regression, load/performance testing, broad security audit and
cross-cutting refactoring are separate explicit Tasks or Epics. Their specifications
name the source candidate, environments, resource budget, affected project areas,
stop conditions and acceptance evidence. They are never hidden prerequisites of
an ordinary item or a targeted Epic gate.

## Adoption and nonterminal-task migration

Adoption never edits an accepted specification. Audit only nonterminal items
against the 5.2 readiness and split rules. Completed, cancelled and already
superseded items remain untouched historical input.

For each audited nonterminal item:

1. If it is compliant, append a readiness/adoption event identifying the 5.2
   policy revision and selected local checks; keep its identity and dependencies.
2. If it is not compliant, prepare every replacement item with a new identity,
   bounded scope, stable acceptance criteria, dependencies and Epic membership.
3. Validate that the replacement graph covers the old accepted outcome without
   gaps or dependency cycles. Publish and link all replacements first. Re-link
   every nonterminal downstream dependency from the old identity to the terminal
   replacement item or items that preserve its prerequisite.
4. Only then append a `superseded` event to the old item naming every replacement
   identity and the reason. Do not execute the old scope and replacement scopes
   concurrently.

Migration is atomic per old item. If any required replacement or link cannot be
accepted, leave the old item nonterminal and record the blocker; a partial set of
replacement drafts does not authorize supersession. Process dependency-ready
items in bounded batches so that failures do not invalidate unrelated migrations.

## Canonical version and allocation

The canonical version is four non-negative integers:
`MAJOR.RELEASE.EPIC.ITEM`.

- `MAJOR`: explicit owner-authorized fundamental transition; lower fields reset.
- `RELEASE`: published release; EPIC and ITEM reset.
- `EPIC`: first verified closure of a development Epic; ITEM resets. The
  permanently open EPIC-S001 and EPIC-S002 never produce this transition.
- `ITEM`: first verified closure of each medium Task, Bug or Correction.

The closing agent never assigns a version or edits allocated state/history. It
adds exactly one immutable `fdtasks-version-request/v1` JSON file on first closure.
Reopening and reclosing the same gate/review/item adds events and evidence but no
second request. The allocator permanently deduplicates both `request_id` and the
closed work-item/Epic identity across version epochs.

The local closure/publication command is the sole automatic allocator. Run it
after verified closure in a clean disposable checkout. It fetches current
`main`, replays and validates the immutable ledger, assigns each pending
request once, writes immutable events, updates `Tasks/version.json`, regenerates
`Tasks/VERSION_HISTORY.md`, commits and fast-forward pushes. On a concurrent
push, retry from newly fetched `main`; never force-push or hand-edit the ledger.
Replaying the same requests is idempotent. The command is started locally by the
authorized closure process and is never triggered by GitHub Actions.

Every hosted repository workflow has exactly one trigger: explicit
`workflow_dispatch`. Push, pull request, schedule, repository dispatch,
workflow chaining and all other automatic triggers are forbidden, including
for version allocation, build, release and cleanup. A manual run is not task
or Epic acceptance evidence. The 5.4 prohibition on reachable hosted test
stages remains in force.

Repositories retaining build artifacts provide a separate manually dispatched
cleanup workflow. It lists all artifact pages before deletion, compares each
valid UTC `created_at` against one cutoff captured at run start, and deletes
only artifacts with `created_at < now - 10 * 24 hours`; artifacts at exactly
ten days or newer remain. An artifact already deleted (HTTP 404) is harmless;
other API errors fail the run. Use the narrow `actions: write` token permission
required for artifact deletion, plus `contents: read` only if source checkout
is needed, without broad repository write access. The
cleanup command runs no task, Epic or project tests.

## Request contract

```json
{
  "schema": "fdtasks-version-request/v1",
  "request_id": "globally-unique-id",
  "type": "task_closed",
  "epic_id": "EPIC-ID",
  "work_item_id": "TASK-ID",
  "summary": "Completed outcome",
  "verification": ["Tasks/items/.../evidence/... or exact durable reference"]
}
```

Allowed types are `task_closed`, `bug_closed`, `correction_closed`,
`epic_closed`, `release_published` and `major_changed`. `major_changed` also
requires the new integer `major` and explicit owner authorization evidence.
Invalid, duplicate, unknown-member or evidence-free requests fail closed.

SemVer surfaces represent the tuple as `MAJOR.RELEASE.EPIC+item.ITEM`; Windows
file versions may use all four integers. Update comparison uses the integer tuple.

## Immutable records

Accepted TASK.md, EPIC.md, ADRs, events, evidence, review request/results and
version requests/events are never edited, moved, renamed or deleted. Current
status is derived from ordered events, not `initial_status`. Mutable aggregate
task lists, Kanban and version history are generated projections, not hand-edited
authority.
