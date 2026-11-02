# Unified release protocol

FDUpdater, embedded application integrations and FDUpdate Server use one signed
release format. The normative wire documents are
`fdupdate/release/v1` and `fdupdate/signed-release/v1`; their JSON Schemas live in
`crates/fdupdate-contract/schemas`.

## Signed authority

The signed manifest binds its monotonically ordered sequence, validity window,
pause state and complete artifact list. Each artifact binds:

- product and component;
- operating-system platform and exact architecture/ABI classifier;
- canonical SemVer version;
- credential-free HTTPS URL, byte size and SHA-256;
- minimum updater and installed/component compatibility;
- rollout cohort and exact-version rollback authorization;
- Ed25519 algorithm, domain, product-scoped key ID and signature.

The manifest signature covers the exact canonical payload bytes. The artifact
signature covers the complete artifact metadata. A transport record, server
release ID, hawkBit action, repository visibility or download credential cannot
replace either signature.

## Platform and ABI

`platform` is `linux` or `windows`. `architecture` is an exact bounded canonical
classifier shared by publisher and client. Existing CPU-only values such as
`x86_64` remain valid. Use a stable target classifier such as
`x86_64-pc-windows-msvc` when ABI differences matter. Matching is exact; there is
no alias, normalization or fallback.

## Channels

The locally configured channel applies the same rule in every client and server
resolver:

| Channel | Admitted canonical SemVer |
| --- | --- |
| `release` | Stable versions only; the prerelease component is empty. |
| `prerelease` | Stable and prerelease versions. |

The `prerelease` channel is an opt-in superset so a later stable release remains
eligible. Remote metadata cannot change a target's channel. SemVer build metadata
is rejected because it would permit multiple byte identities behind equal version
precedence.

## Client processing

For every offer, a client:

1. rejects oversized, unknown or noncanonical documents;
2. verifies manifest and artifact signatures using locally trusted product keys;
3. rejects revoked keys, expired releases and replayed sequence/digest pairs;
4. matches exact product, component, platform, architecture/ABI and local channel;
5. checks updater, installed-version and component compatibility, rollout and
   downgrade or rollback authority;
6. downloads within the signed bound and verifies exact size and SHA-256;
7. stages and activates through the local application policy.

Failure before activation preserves the installed application. An executable,
server bundle, SDK archive and application-owned self-update all use this flow.
A statically linked library is replaced only through an update of its owning
application.

## Distribution boundary

FDUpdate Server is the artifact registry. GitHub stores source and may retain
short-lived output from a manually dispatched build, but GitHub Releases are not
used. A manual publication transfers verified bytes to FDUpdate Server, where
public/private discovery and authorized download remain separate from signed
release authority.

The v1 schemas are immutable. A future incompatible field or behavior requires a
new schema identifier, new signature domain where applicable, explicit migration
and compatibility evidence. See [security and trust](security-and-trust.md) and
[software integration](software-integration.md).
