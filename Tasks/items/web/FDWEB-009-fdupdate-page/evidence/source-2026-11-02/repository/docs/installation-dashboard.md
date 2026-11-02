# Installation dashboard

Authenticated owners, fleet operators and security administrators open `/admin/installations` from the administration page. The dashboard only requests products backed by repositories visible to the signed-in account. Application rows carrying repository provenance are filtered again against those repository scopes.

Each installation has one card keyed by its unique instance ID. The card shows enrollment state, fingerprint, source installation-key ID, repository grants and the last server contact. Contact within 15 minutes is labelled online; older contact is labelled offline/stale; an absent timestamp is labelled never seen. These labels describe any authenticated device contact rather than device attestation.

The separate managed-updater status comes from its heartbeat. The panel displays updater version plus client-reported and server-received heartbeat times. A heartbeat received within 15 minutes is online, an older heartbeat is offline/stale, no heartbeat is never reported, and a non-approved enrollment is inactive. Liveness uses the server-received time, so a client cannot keep itself online by supplying a future clock value. A stale updater does not by itself mean that an application update failed.

Each configured application binding is visible before its first application report. Its row identifies the target, repository, platform, architecture, channel, check permission, update permission and binding revision. The last-check column keeps the client-reported and server-received check times distinct. A binding without a report shows `never reported`, an unknown health and no assignment.

Reported rows show the client-reported installed version, assigned version and assignment ID, local Release/Prerelease channel, last update health/error, last check and last successful update. Publication or assignment never fills the installed-version column. Historical reported state without a current binding is retained as `not currently managed` rather than being presented as active authority.

Changing a binding's repository, platform, architecture or channel starts a new current outcome epoch. The first report still shows its installed version and check times, but it remains `unknown` until that exact provenance reports an outcome; health, last-success time and diagnostics from the previous provenance stay only in bounded history and are never relabelled into another repository scope.

The `q` filter matches installation ID, fingerprint, enrollment state, installation key, repository, product/component, installed and updater versions, platform, architecture, channel, managed permissions, health, errors and heartbeat/check times. Results can be sorted by last contact, installation ID or enrollment state and are paged at 25 installations. Approval, revocation and grant management links return to the existing CSRF-protected controls.

The layout uses a full table at desktop width and labelled stacked cells below 600 px. All client strings are escaped before rendering, responses use `Cache-Control: no-store`, query input is bounded to 128 bytes and page numbers are bounded.
