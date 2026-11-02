# GitHub Actions publication

An administrator first creates the update repository in the FDUpdate administrator panel. Creation fixes a stable project key, public/private visibility, product/component scope and one exact GitHub repository, workflow reference, protected environment and allowed ref. This repository record is the publisher authority; no second deployment registration is required. The panel displays the generated publishing secret once; the server stores only its repository- and generation-bound verifier. Rotation immediately invalidates the old secret and revocation denies publication until a new generation is issued.

The publishing job requests a short-lived GitHub Actions OIDC token. FDUpdate selects the token's current key ID from GitHub's HTTPS JWKS and accepts only an RS256 signature plus exact claims for issuer `https://token.actions.githubusercontent.com`, audience, repository, `workflow_ref`, environment, ref, commit `sha` and `event_name=workflow_dispatch`. The token lifetime is at most ten minutes. The token and its `jti` are never written to audit; only a SHA-256 token identifier is held for request processing.

The HTTPS request must contain `x-fdupdate-project-key`, `x-fdupdate-publishing-secret`, `x-fdupdate-source-revision` and `x-fdupdate-publication-comment` together with `x-fdupdate-request-id` and the OIDC bearer token. The source revision must equal the signed OIDC `sha` claim. The publishing secret belongs in a protected GitHub environment secret and must never be printed; project key and comment may be workflow inputs. The gateway validates the JWT header, current repository credential and exact signed GitHub identity before consuming multipart fields. The bounded canonical plan must be the first field and pass repository scope validation before the artifact field is opened. Missing, unknown, mismatched, rotated or revoked values therefore create no artifact staging.

After dual authorization, the versioned ingestion request supplies a canonical publication plan and one bounded artifact stream. The gateway permits one artifact stream at a time, bounding concurrent staging to one maximum-size artifact and releasing capacity on every response. The artifact must match the server repository and registered product, component, platform and architecture. When provenance is required, the gateway verifies its attestation before the isolated signer verifies the digest and signs the release. The publication backend prepares hawkBit state before the immutable store becomes visible. Commit failure invokes abort and removes staged and final output. The gateway journals request fingerprints, receipts and a queryable provenance record containing project, publisher, GitHub repository, exact source SHA, time, bounded comment, release and artifact hashes. An exact request-ID retry after process restart returns the original receipt; changed SHA, comment, project or plan conflicts. Corrupt state prevents startup.

Application workflows may build, package and publish only when manually started with `workflow_dispatch`. They do not execute FDUpdate acceptance tests. Installation enrollment credentials, hawkBit Management credentials and signing private keys never enter GitHub Actions.

## Build provenance admission

Build provenance is opt-in per publisher. With no provenance configuration, or for an absent publisher entry, publication keeps the existing flow and records `provenance_not_required`. A required entry never downgrades: a missing, empty, malformed, untrusted or larger-than-2-MiB bundle is rejected before release signing. Supplying an attestation when policy is disabled is also rejected, so producer and server policy changes are deliberate.

The policy file has schema `fdupdate/publisher-provenance-policy/v1`. A required policy pins the stable numeric GitHub repository ID, the approved builder ID and the feature availability decision:

```json
{
  "schema": "fdupdate/publisher-provenance-policy/v1",
  "policies": {
    "example-publisher": {
      "mode": "required",
      "version": "github-private-v1",
      "repository_id": 123456789,
      "builder_id": "https://github.com/actions/runner/github-hosted",
      "availability": "private_enterprise_cloud"
    }
  }
}
```

Allowed availability values are `public_repository`, `private_enterprise_cloud` and `private_unsupported`. GitHub supports attestations for public repositories on current plans, but private or internal repositories require GitHub Enterprise Cloud. `private_unsupported` is an explicit fail-closed decision, not a disabled policy. Obtain and review the numeric ID independently (for example, `gh api repos/OWNER/REPOSITORY --jq .id`); repository names alone do not survive rename and name reuse safely.

The server provenance configuration points to that policy and, when at least one supported entry is required, to a verifier configuration. FDUpdate currently accepts GitHub CLI `2.101.0` under the MIT license. Operators pin the executable path, its SHA-256, exact version, trusted-root JSONL path and SHA-256, root generation time, maximum root age and verifier timeout. The configured maximum root age cannot exceed 30 days. Startup fails if the executable/version/hash or root/hash is wrong. Every admission rechecks the root age and the pinned files' size and modification identity.

Verification is offline and fail-closed. The server invokes the pinned CLI with the supplied bundle and custom root while network proxy variables point to a closed local endpoint and credential variables are removed. It enforces the exact artifact SHA-256, SLSA provenance v1 predicate, numeric repository ID, GitHub-hosted builder, exact workflow certificate identity, source commit and ref. This supplements the product-scoped release signature; it does not prove source correctness or claim a SLSA level.

Generate a fresh combined public/private root snapshot on an online administrative machine with `gh attestation trusted-root > trusted_root.jsonl`, record its digest and generation time, then transfer it through the deployment's trusted configuration channel. GitHub's root metadata has no built-in expiry. Offline verification cannot know about revocations after the snapshot, and material signed after the snapshot may stop verifying after key rotation; rotate the configured snapshot deliberately and keep policy/version changes auditable.

For a required policy, multipart fields are strictly ordered: `plan`, `artifact`, `attestation`, with no trailing field. The attestation is the JSONL emitted by `gh attestation download ARTIFACT -R OWNER/REPOSITORY`. Disabled policy continues to accept exactly `plan`, `artifact`. A successful required admission stores an immutable compact receipt and retains the bundle by SHA-256 under the publication store. Exact replay, including after restart, reuses that receipt without rerunning the verifier or signer; changed artifact, bundle, root or policy conflicts. Failed signing/publication removes a newly retained bundle.

An application repository may add the following step to its existing manual-only build job. Keep the workflow trigger as `workflow_dispatch`, grant `id-token: write`, `contents: read` and `attestations: write`, and pin the action by full commit rather than a floating tag:

```yaml
- name: Attest release artifact
  uses: actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6 # v4.2.2
  with:
    subject-path: dist/fdos-update.zip

- name: Download bundle for FDUpdate upload
  env:
    GH_TOKEN: ${{ github.token }}
  run: gh attestation download dist/fdos-update.zip -R "$GITHUB_REPOSITORY"
```

Pass the generated `sha256:*.jsonl` file as the `attestation` multipart field in the same authenticated FDUpdate request as the exact artifact. Attestation generation and bundle download occur only inside that explicitly dispatched producer workflow; FDUpdate's verifier performs no public-network lookup.
