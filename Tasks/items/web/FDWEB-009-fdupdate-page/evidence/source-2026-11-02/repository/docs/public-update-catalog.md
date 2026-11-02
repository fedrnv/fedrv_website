# Public update catalog

`fdupdate-web` serves an anonymous catalog from the canonical repository registry and publisher provenance journal. Its configuration supplies a bare HTTPS `public_origin`, private bind address, repository/publisher state files and immutable artifact store. The process binds only to loopback or a private edge address; the deployment edge owns public TLS.

The index and repository pages include only repositories marked `public`. Each version shows release ID, publication time, publisher, GitHub repository, exact source commit and escaped publication comment. Every artifact has a direct link, a read-only link field and a copy button. The link remains a normal anchor when scripting is unavailable.

Private and unknown project keys use the same `404 Not found` response for repository and download routes. A download succeeds only when the project is currently public, its provenance record names the exact release and digest, every store path component is a real directory, the artifact is a bounded regular non-symlink file, and its bytes hash to the requested SHA-256. The already-open verified file is streamed with `application/octet-stream` and `nosniff`. Catalog, manifest and artifact responses use `Cache-Control: no-store` because repository visibility can change; previously distributed bytes and legacy cache entries cannot be recalled.

Artifact responses advertise `Accept-Ranges: bytes`. A single bounded byte range
returns `206 Partial Content` only after the complete stored file has passed its
provenance, size and SHA-256 checks. Open-ended and suffix ranges support restart
and resume; malformed, multiple or unsatisfiable ranges return `416` with the
verified complete size. The same behavior applies to authenticated private and
temporary-link downloads without weakening their authorization or cache policy.

Public repositories also expose `/latest-manifests/PROJECT_KEY` for polling clients. It resolves the newest accepted publication on every request, reopens the provenance-bound signed manifest and uses `no-store`; signature verification and the FDUpdater sequence cursor reject forged or replayed releases. Exact `/manifests/PROJECT_KEY/RELEASE_ID` URLs remain immutable.

An administrator may separately issue a secret temporary bearer URL for one exact artifact in a private repository. Its selected lifetime is 1 through 30 days and defaults to 10 days. This does not make the repository or its manifest public: the `/share/<token>` route knows only the persisted exact target, revalidates current private visibility and returns verified immutable bytes on repeated requests until expiry. Unknown, expired and no-longer-private targets use the same not-found response. The edge does not write share-token paths to its access log. Legacy single-use grant records remain readable and retain consume-before-stream behavior.

Local verification:

```text
cargo test -p fdupdate-web --all-targets --locked
cargo clippy -p fdupdate-web --all-targets --locked -- -D warnings
```
