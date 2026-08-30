# 10 Security and Privacy

> This document defines a shared security and privacy baseline for React Native / Expo Apps. It is risk-based and does not replace a project threat model, backend authorization, legal compliance, or a formal security assessment.

## Security responsibility boundary

- A mobile client runs on a user-controlled device and cannot hold a true server-side secret.
- The backend is the final authority for identity, permission, resource ownership, transactions, and business facts.
- Hiding a Button, changing local state, or checking a route does not replace backend authorization.
- TypeScript types do not validate real network JSON; sensitive contracts require runtime validation before use or persistence.
- Security controls cover the App, backend, third-party SDKs, storage, network, and release configuration—not UI code alone.
- A high-risk App raises requirements based on business domain, data types, and threat model and records applicability of OWASP MASVS controls.

## Security facts each project defines

Each App records in `app-specific.md`:

- Data classification and sensitive-field inventory
- Auth type, token / session lifecycle, and backend contract
- Protected storage, regular KV, database, and file-cache choices
- API origin, approved external origins, and development HTTP exceptions
- Deep link / universal link / app link allowlist
- Whether WebView is allowed and under what restrictions
- Permission inventory and request timing
- Data scope for analytics, crash reporting, logging, and third-party SDKs
- Logout, account switching, account closure, and data-deletion behavior
- Backup, device migration, and biometric strategy
- Security-test baseline and ownership process

Until these decisions exist, do not independently implement real Auth, persistence, sensitive logging, arbitrary external URLs, or third-party data uploads.

## Data classification and minimization

Classify at least:

- Public: publicly displayed content
- Internal: runtime information that should not be public but has low sensitivity
- Personal Data: data that identifies or can be linked to a person
- Sensitive Personal Data: health, financial, precise-location, identity-document, and similar high-sensitivity data
- Secret: password, token, verification code, private key, credential

Required rules:

- Collect, request, store, and transmit only data required by the feature.
- Every field has an owner, purpose, storage location, retention period, and deletion condition.
- Do not request permissions or collect data early because it “might be useful later.”
- When work can remain on-device without upload, evaluate whether local processing better serves privacy.
- Data passed to a third-party SDK remains the App's responsibility.

## App bundle and configuration

- Treat the App bundle, JavaScript bundle, `app.json`, asset files, and `EXPO_PUBLIC_*` values as readable.
- Do not hard-code server private keys, database credentials, long-lived signing secrets, or administrator tokens in the client.
- API base URLs and public project IDs may be public configuration; true secrets remain on the server or in a controlled build service.
- `.env` manages configuration but does not make a value secret after it is bundled into the client.
- The release process manages access to source maps, debug symbols, build logs, and CI artifacts.

## Local storage

### Selection

- Keep data in memory when it does not need persistence.
- Use project-approved platform protected storage for small tokens, keys, or secrets.
- Do not store secrets in regular KV, SQLite, or FileSystem merely because access is convenient.
- Protected storage is for small values. Large objects, lists, and files use dedicated storage and are encrypted or kept off disk according to sensitivity.
- Screen components do not call secure storage directly; use a controlled adapter or coordinator.

### Protected storage

When using Expo SecureStore or another platform store, evaluate:

- iOS Keychain accessibility level
- Android backup / restore behavior
- Device-only versus device-migration requirements
- Uninstall, reinstall, and system-restore differences
- UX impact of biometrics / `requireAuthentication` on transparent reads
- Config plugin, native configuration, and EAS build
- Native read / write / delete failures
- Value-size limits

Do not treat protected storage as infallible or as the source of business truth. The backend still validates whether a session remains valid.

### Files and cache

- Do not write sensitive files to public Downloads, the photo library, or directories accessible to other Apps unless the user explicitly exports them.
- Temporary images, attachments, and crop results have a cleanup strategy.
- Clear or invalidate user-scoped cache according to project policy after logout, account switching, and user deletion.
- File names, metadata, thumbnails, and logs may also reveal sensitive information.
- Backup policy follows data classification and must not unintentionally include secrets or sensitive cache in cloud backup.

## Shared token-auth invariants

When an App uses access / refresh tokens, it satisfies at least the following. Concrete token types, storage, and expiration belong to the project architecture.

### Single source of truth

- Runtime session has one coordinator / store as its source of truth.
- Providers, screens, and API modules do not maintain independently changing tokens or sign-in states.
- Public React state exposes only the minimum user and status summary, never tokens or Authorization headers.

### Persist before publish

When establishing or refreshing a session:

~~~text
validate response
-> complete required protected-storage writes or deletes
-> update runtime token
-> publish authenticated snapshot
~~~

If persistence fails, do not publish an authenticated session that cannot be restored reliably.

### Local-first logout

On logout or confirmed invalidation:

~~~text
invalidate the old session version immediately
-> clear runtime tokens
-> publish unauthenticated
-> clean local storage asynchronously
-> notify backend revocation on a best-effort basis
~~~

Network or local-delete failure must not return the UI to authenticated.

### Stale-result fencing

- Auth requests, restore, refresh, and authenticated APIs capture the current session lease / version.
- Before committing state, cache, storage, or errors, a response revalidates the lease.
- A late response from User A must not enter User B's screen or cache.
- Treat a stale result as internal cancellation: do not show a normal failure toast or modify the new session.

### Refresh

- Concurrent `401` responses in one session share one version-scoped refresh flight.
- A refresh flight is never shared across sessions.
- Compare a late `401` for an old access token with the current token before rotating again.
- Each business request has an explicit retry budget; refresh must not recurse.
- A normal business `403` does not trigger automatic refresh.
- Network, timeout, and uncertain mutation failures do not automatically replay writes.

### Token-type isolation

- Separate setup, password-reset, email-verification, and other one-time tokens from normal session tokens.
- Do not put a one-time token in route params, URLs, public Context, analytics, or regular persistent cache.
- Normal API callers must not override current Authorization through arbitrary headers.

### Runtime validation

Before persisting an Auth response, validate at least:

- Discriminator / required action
- Token is a non-empty string
- Expiry is a valid positive value
- User ID and status are approved values
- Field combinations for response variants are mutually exclusive
- Refresh rotation satisfies the project contract
- Current principal is not replaced unexpectedly

An invalid `2xx` response must not commit as success.

## Network security

- Production and preview use HTTPS by default.
- Explicit local development addresses may allow HTTP, but never silently fall back to an unexpected origin.
- API clients use a fixed, validated base URL.
- An authenticated client should accept relative internal paths rather than arbitrary absolute URLs from feature screens.
- Send tokens only to approved API / Auth origins.
- Do not attach the App Authorization header when uploading to object storage, opening an external link, or requesting a third-party preview.
- Redirects, proxies, and cross-origin requests prevent sensitive-header disclosure.
- Production TLS verification must not be disabled by debug configuration or a custom client.
- Decide certificate pinning from a threat model and design certificate rotation, delayed App versions, and incident recovery at the same time. Do not add pinning without an operations plan.

The request layer provides:

- timeout
- cancellation
- Stable error envelope
- Request ID
- Controlled headers
- Response-size or file-download boundaries

Safe retries distinguish idempotent reads from mutations that might already have written on the server.

## External URLs, deep links, and WebView

### External URLs

- Parse untrusted strings with a standard URL parser.
- Declare approved schemes; normal Web entry accepts `https` by default, while `http` is a project decision.
- Reject `javascript:`, `data:`, `file:`, and unapproved custom schemes.
- Do not put tokens, personal data, or internal IDs into third-party URL queries.
- Opening failure returns a controlled state; do not write raw exceptions or sensitive URLs into user logs.

### Deep links

- Validate scheme / host / path / params.
- Use stable IDs with format and length limits.
- A deep link cannot bypass an Auth route guard, user confirmation, or a one-time flow token.
- Do not execute a sensitive action directly from deep-link parameters alone.
- An after-login destination passes an allowlist to prevent open redirects.

### WebView

If WebView is approved, define separately:

- Origin allowlist
- Whether JavaScript is enabled
- Navigation interception
- File / camera / location permissions
- Cookie and session boundary
- Injected JavaScript and message schema
- Download, upload, and external navigation

Do not put an arbitrary URL in WebView merely because “the feature already exists on the Web.”

## Files, images, and uploads

- MIME, extension, and file name returned by a system picker are untrusted metadata.
- Before upload, validate approved file types, size, and necessary magic bytes.
- Read only the minimum header needed instead of loading a large file into JavaScript memory.
- The server revalidates MIME, size, signature, ownership, and upload status; client validation improves UX only.
- A presigned URL or third-party upload origin does not receive the App bearer token unless the contract explicitly requires it and the origin is controlled.
- Close file handles on success, failure, and cancellation.
- Define failure behavior for upload cancellation, App backgrounding, and URI-permission expiry.

## Logging, analytics, and error reporting

Minimal diagnostic information may include:

- Event name
- Stable error code
- HTTP status
- Request ID
- Platform / App version
- State-transition reason without personal data

Never log:

- Password or verification code
- Access / refresh / setup / reset token
- Authorization, Cookie, or protected-storage value
- Complete request / response body
- Raw identity documents, precise location, contacts, or health data
- Unredacted email, phone, IP, or external-URL query

Redact at the transport or logging adapter before data enters a third-party SDK. Do not depend on every screen developer remembering to redact manually.

A user-facing error does not expose a stack trace, SQL, internal path, token state, or backend implementation. Authentication errors avoid account enumeration; rate limits use stable, general “try again later” semantics.

## Permissions and platform capabilities

- Request a permission when the feature actually needs it, not in bulk at startup.
- Before requesting, explain a purpose consistent with actual use.
- Provide an understandable fallback for denied, restricted, limited, or later-revoked permission.
- Do not repeatedly pressure a user who declined.
- Request only the minimum camera, photo-library, microphone, location, notification, or Bluetooth scope.
- iOS usage descriptions and Android permissions accurately describe actual behavior.
- Background tasks, extensions, share sheets, and widgets with separate runtimes require independent session and data-access design; do not assume the main App's in-memory state is available.

## Privacy

Privacy design satisfies at least:

- Data minimization: access only required data and resources.
- Transparency: users can understand collection, storage, sharing, and background processing.
- Consent: processing that requires consent begins only after consent; third-party SDKs do not collect early.
- User control: users can manage, delete, or correct data and revoke relevant settings.
- Retention: data is not retained indefinitely; deletion and account closure have defined outcomes.

Before adding analytics, advertising, attribution, push, or monitoring SDKs, review:

- Collected fields
- Default-enabled behavior
- Consent signal
- Data-transfer regions and third-party chain
- Device identifiers
- Deletion and opt-out capability
- Native permissions and package supply-chain risk

## Clipboard, screenshots, and sharing

- Do not automatically copy tokens, verification codes, or sensitive fields to Clipboard.
- Clipboard data may be read by the system or another App; limit content and retention.
- Whether a sensitive screen blocks screenshots / recording is a project risk decision that considers platform limits, usability, and support workflows.
- System Share Sheet receives only the minimum content explicitly selected by the user.
- Before sharing a file, confirm its metadata and cache location do not expose additional information.

## Dependencies and supply chain

- Declare dependencies explicitly and pin auditable versions.
- Review native permissions, network behavior, maintenance status, and transitive dependencies for a new dependency.
- Commit the lockfile.
- Security updates pass tests and release workflow; do not upgrade a major version without review directly on a feature branch.
- Do not execute install scripts, binaries, or copied code from untrusted sources.
- Create a replacement plan for an unmaintained SDK, a known vulnerability, or excessive permissions.

## Security tests

Cover according to feature scope:

- Protected-storage read / write / delete failure
- Persist-before-publish
- Local-first logout
- Refresh singleflight and retry limit
- Concurrent logout / refresh / login
- Stale response cannot contaminate a new account
- Invalid Auth / API response is rejected
- Tokens do not enter Context, routes, logs, or analytics payloads
- URL scheme, host, and redirect validation
- Deep-link route guard
- File MIME, size, magic bytes, and URI expiry
- Permission denied / limited / revoked
- Cache cleanup after logout and account switch
- Production configuration rejects unexpected HTTP

A Node test cannot prove Keychain, Keystore, TLS, backup, permission, or real deep-link configuration. Verify them in iOS / Android release builds and perform a formal mobile security assessment when needed.

## Security review checklist

- [ ] Data is classified and minimized.
- [ ] No true secret exists in the client bundle.
- [ ] Secrets enter protected storage only through a controlled adapter.
- [ ] Tokens do not enter public React state, routes, URLs, logs, or analytics.
- [ ] Backend still validates identity, account status, permission, and resource ownership.
- [ ] Production networking uses controlled HTTPS origins.
- [ ] Auth headers are not sent to external links or object storage.
- [ ] Async Auth / API responses have stale-result fencing.
- [ ] External URLs, deep links, files, and network responses are treated as untrusted input.
- [ ] Permissions are requested just in time and have denial fallbacks.
- [ ] Third-party SDK data and consent behavior have been reviewed.
- [ ] Logout, account switching, and data deletion have explicit cleanup.
- [ ] Security acceptance is complete in iOS / Android release builds.

## Reference baseline

- [OWASP Mobile Application Security Verification Standard](https://mas.owasp.org/MASVS/)
- [OWASP MASVS Storage](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/)
- [OWASP MASVS Network](https://mas.owasp.org/MASVS/08-MASVS-NETWORK/)
- [OWASP MASVS Privacy](https://mas.owasp.org/checklists/MASVS-PRIVACY/)
- [Expo Store data](https://docs.expo.dev/develop/user-interface/store-data/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
