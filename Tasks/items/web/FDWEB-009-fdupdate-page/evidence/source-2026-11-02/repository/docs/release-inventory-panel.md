# Release inventory panel

The authenticated `/admin/releases` route renders the live repository registry and retention catalog through `fdupdate-server-panel`. The page includes active and revoked repositories without copying workflow identity, credentials, signing keys or artifact content into the response. The main `/admin` dashboard links to this page.

The standalone panel API retains its scoped `OperatorService` authorization contract. The production HTTP route requires the administrator session on every read and requires the matching session CSRF token for mutations. A valid change is written atomically with actor, request, time, previous values and new values in the retention catalog. Invalid, sessionless and CSRF-invalid requests preserve the prior settings.

The page reports each version's target, channel, status, manifest digest, artifact bytes, publication and cleanup time and protection reason. Repository and server totals distinguish retained, pinned, reclaimable and cleaned data. Empty repositories remain visible. A stale snapshot carries its capture time and reason. An unavailable snapshot suppresses all partial inventory and totals and displays the failure explicitly.

The HTML includes a viewport declaration, horizontally scrollable wide inventory tables and a compact layout below 600 CSS pixels. The web runtime reads the catalog for every request. A missing or invalid catalog produces an explicit unavailable page without partial totals; an old catalog modification time produces a stale banner with its timestamp.
