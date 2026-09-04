# 10. Security and privacy rules

This section contains the complete security and privacy rules.

### 10.1 Responsibility boundaries

- Mobile clients run on user-controlled devices and cannot keep server secrets confidential.
- The backend is the final authority for identity, permissions, resource ownership, transactions, and business facts.
- Hiding a button, changing local state, or checking a route cannot replace server-side authorization.
- TypeScript types do not validate JSON received over the network; data governed by sensitive contracts needs runtime validation before use or persistence.
- Security controls must cover the app, backend, third-party SDKs, storage, networking, and release configuration.

### 10.2 Data classification and minimization

Distinguish at least:

- Public: publicly displayed content
- Internal: information that should not be public but has relatively low sensitivity
- Personal Data: data that identifies or can be linked to a person
- Sensitive Personal Data: highly sensitive data such as health data, financial information, precise location, or identity documents
- Secret: passwords, tokens, verification codes, private keys, credentials

Mandatory requirements:

- Collect, request, store, and transmit only the data a feature actually needs.
- Every data field has an owner, purpose, storage location, retention period, and deletion conditions.
- Do not request permissions or collect data early because “we might use it later.”
- Evaluate whether the work can be done locally without uploading data.
- Treat data sent to third-party SDKs as the app's responsibility.

### 10.3 Bundles, configuration, and local storage

- Assume app bundles, JavaScript bundles, `app.json`, asset files, and `EXPO_PUBLIC_*` can be read.
- Do not hardcode private keys, database credentials, long-lived signing secrets, or administrator tokens.
- API base URLs and public project IDs may be included in public configuration; actual secrets must stay on the server or in controlled build services.
- `.env` manages configuration; it does not make client-bundled values secret.
- The release process manages permissions for source maps, debug symbols, build logs, and CI artifacts.
- If data does not need to persist, keep it only in memory.
- Use project-approved protected storage for small quantities of tokens, keys, or secrets.
- Do not put secrets in ordinary KV, SQLite, or FileSystem storage for convenience.
- Pages must not call underlying secure storage directly; use controlled adapters or coordinators.
- Do not write sensitive files to public Downloads, photo libraries, or directories accessible to other apps unless the user explicitly initiates an export.
- Temporary images, attachments, and cropped images must have cleanup policies.
- Clear or invalidate user-scoped caches according to project policy after logout, account switching, and deletion.
- File names, metadata, thumbnails, and logs may also leak sensitive information.

### 10.4 Authentication token invariants

#### Single source of truth

- The runtime session has a single coordinator / store as its source of truth.
- Providers, pages, and API modules must not each maintain tokens or authentication state that can change independently.
- Public React state exposes only minimal user and status summaries, not tokens or Authorization headers.

#### Persist before publish

```text
Validate the response
-> Complete required protected storage writes or deletions
-> Update the runtime token
-> Publish the authenticated snapshot
```

If persistence fails, do not expose a session as authenticated in the UI when it cannot be reliably restored.

#### Local-first logout

```text
Invalidate the old session version immediately
-> Clear the runtime token
-> Publish the unauthenticated state
-> Clean up local storage asynchronously
-> Request backend revocation on a best-effort basis
```

Network or local deletion failures must not roll the UI back into an authenticated state.

#### Stale-result fencing

- Authentication requests, session restoration, token refresh, and authenticated API calls capture the current session lease / version.
- Revalidate the lease before applying a response to state, cache, storage, or error state.
- A late response for User A must not reach User B's pages or cache.
- Treat stale results as internal cancellation; do not display an ordinary failure toast or change the new session.

#### Refresh

- Concurrent `401` responses in the same session share one in-flight refresh scoped to that session version.
- Do not share an in-flight refresh across sessions.
- For a delayed `401` response, compare the access token used by that request with the current token before refreshing, to avoid unnecessary rotation.
- Each business request has an explicit retry budget; do not refresh recursively.
- Ordinary `403` responses from business operations do not trigger automatic refresh.
- Do not automatically replay writes after network, timeout, or uncertain mutation failures.

#### Token types and runtime validation

- Separate one-time tokens for setup, password reset, email verification, and similar operations from full session tokens.
- Do not put one-time tokens in route params, URLs, public Context, analytics, or ordinary persistent caches.
- Ordinary API callers must not arbitrarily override the current Authorization header.
- Before saving authentication responses, validate the discriminator, required action, non-empty tokens, valid expiration, user ID, status, mutually exclusive fields in response variants, refresh rotation, and current principal.
- Invalid `2xx` responses must not be treated as successful results.

### 10.5 Networking, URLs, deep links, and WebViews

- Production and preview environments use only HTTPS by default.
- Local-development HTTP exceptions must be explicit; do not silently fall back to unexpected origins.
- API clients use fixed, verifiable base URLs.
- Authenticated clients should prefer relative internal paths; they must not accept arbitrary absolute URLs from pages.
- Send tokens only to project-approved API / authentication origins.
- Do not attach app Authorization headers when uploading to object storage, opening external links, or requesting third-party previews.
- TLS validation must not be disabled in production.
- The request layer provides timeouts, cancellation, consistent error envelopes, request IDs, controlled headers, and limits on response sizes and file downloads.
- Use standard parsers for external URLs and explicitly define allowed schemes.
- Reject `javascript:`, `data:`, `file:`, and unapproved custom schemes.
- Do not put tokens, personal data, or internal IDs into third-party URL queries.
- Validate deep-link schemes, hosts, paths, and parameters; use stable IDs with constrained formats and lengths.
- Deep links must not bypass authentication route guards, user confirmations, or one-time flow tokens.
- Restrict post-login redirect destinations to an allowlist to prevent open redirects.
- If WebViews are allowed, define policies for origin allowlists, JavaScript, navigation interception, file/camera/location permissions, cookies, injected JavaScript, message schemas, downloads, uploads, and external navigation.

### 10.6 Files, images, uploads, and logs

- MIME types, extensions, and file names returned by system pickers are untrusted metadata.
- Validate allowed file types, sizes, and necessary magic bytes before upload.
- The server must revalidate MIME, size, signatures, ownership, and upload status.
- Presigned URLs or third-party upload origins must not receive the app bearer token unless the contract explicitly requires it and the origin is controlled.
- Close file handles on success, failure, and cancellation paths.
- Define failure handling for upload cancellation, the app moving to the background, and URI permissions expiring.

Minimal diagnostic information you may log:

- Event name
- Stable error code
- HTTP status
- Request ID
- Platform / app version
- Reasons for state transitions that contain no personal data

Do not log:

- Passwords or verification codes
- Access / refresh / setup / reset tokens
- Authorization, Cookie, or protected-storage values
- Full request / response bodies
- Raw identity documents, precise locations, contacts, or health data
- Unredacted emails, phone numbers, IP addresses, or external URL queries

You must redact data in the transport or logging adapter before it reaches third-party SDKs. User-facing errors must not expose stack traces, SQL, internal paths, token status, or backend implementation details.

### 10.7 Permissions, privacy, clipboard, and sharing

- Request permissions when a feature actually needs them, not all at once at startup.
- Explain the purpose before requesting permission.
- Provide clear fallback behavior when permission is denied, restricted, partially granted, or revoked in settings.
- Do not repeatedly prompt users who have denied permission.
- Request the minimum scope for cameras, photos, microphones, location, notifications, and Bluetooth.
- iOS usage descriptions and Android permissions accurately reflect actual purposes.
- Design session handling and data access separately for independent runtimes such as background tasks, extensions, share sheets, and widgets.
- Access only necessary data and resources.
- Processing that requires consent must not begin until consent is given; third-party SDKs should not collect data beforehand.
- Users should be able to manage, delete, or modify their data, or reverse their choices in settings.
- Do not retain data indefinitely; deletion and account closure have explicit outcomes.
- Do not automatically copy tokens, verification codes, or sensitive fields to the clipboard.
- Whether to block screenshots or screen recording on sensitive pages is a project-specific risk decision.
- Share sheets receive only the minimum content the user explicitly selects.
- Before sharing files, check that metadata and cache locations do not leak additional information.

### 10.8 Dependencies and security tests

- Declare dependencies explicitly and pin them to versions that can be reviewed.
- Review native permissions, network behavior, maintenance status, and transitive dependencies for new dependencies.
- Keep lockfiles in version control.
- Security updates follow the testing and release process; do not upgrade to a new major version without review.
- Do not execute installation scripts, binaries, or unknown code from untrusted sources.
- Plan replacements for SDKs that are unmaintained, have known vulnerabilities, or require excessive permissions.

Test at least:

- Protected-storage read / write / delete failures
- Persist-before-publish
- Local-first logout
- Refresh singleflight and retry limits
- Concurrent logout / refresh / login
- Stale responses do not affect a newly active account
- Invalid authentication / API responses are rejected
- Tokens do not enter Context, routes, logs, or analytics payloads
- URL scheme, host, and redirect validation
- Deep-link route guards
- File MIME types, sizes, magic bytes, and URI expiration
- Permission denied / limited / revoked
- Cache cleanup after logout and account switching
- Unexpected HTTP is not allowed in production

Node tests cannot verify the actual configuration of Keychain, Keystore, TLS, backups, permissions, or deep links. You must verify these in iOS / Android release builds and conduct formal mobile security testing when necessary.

---
