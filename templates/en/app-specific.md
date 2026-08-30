# App-Specific Mobile Rules

> Copy this template to `mobile/docs/agents/app-specific.md` in the consuming project. Remove example prompts and fill in the current App's real configuration. Write “undecided” for facts that are not yet established; never substitute another App's configuration.

## 1. Project identity

- Rules language: `en`
- App name:
- Mobile workspace path: `mobile/`
- Package name:
- Expo SDK:
- React Native:
- React:
- Package manager:
- Native workflow: managed / prebuild / bare

## 2. Required project documents

List project documents that must also be read before generating mobile code:

- Architecture:
- API contract:
- Data and storage strategy:
- Keyboard-layout guide:
- Testing:
- Release:

## 3. Directories and path aliases

- Fully adopts the shared `mobile/` structure:
- Approved additional directories:
- Path aliases:
- Route files permit `index.tsx`:
- Page export convention:

For each deviation, record the reason and scope.

## 4. Routing and navigation

- Expo Router route groups:
- Root Stack:
- Tabs:
- Stack for each tab:
- Cross-tab full-screen screens:
- Route-level Modals:
- Route-constant file:
- Default push / replace / modal animation:
- Gesture and system-back requirements:

## 5. Design Tokens

- Token code source of truth:
- Figma Variables / Library:
- Colors:
- Spacing:
- Radius:
- Shadow / elevation:
- Typography:
- z-index / layer:
- Light / dark / brand modes:

Record sources and naming systems rather than copying every Token value.

## 6. Fonts and languages

- Supported languages:
- Loaded fonts:
- Default font by language:
- English / numeric display font:
- Weight mapping:
- Fallback strategy:
- Dynamic type and maximum-scale strategy:

## 7. Motion

- Motion-Token source of truth:
- Navigation transitions:
- Modal / Sheet:
- Press feedback:
- Loading / skeleton:
- Reduce motion:
- Prohibited implementations:

## 8. Styling and base components

- Default styling system:
- Global theme entry:
- Existing common Button:
- Existing common Input:
- Existing Switch / Checkbox / Radio:
- Existing Image / Avatar:
- Existing Modal / Sheet:
- Existing keyboard-aware component:
- Existing loading / empty / error component:

Feature screens must reuse these entry points instead of creating parallel versions.

## 9. Images, SVG, and icons

- Asset directory:
- SVG integration:
- Approved icon sources:
- Multi-density bitmap rules:
- Placeholder / fallback:
- Additional file-naming rules:

## 10. Data, API, and state

- API client:
- Response envelope:
- Query / mutation Hook convention:
- Auth strategy:
- Token storage:
- Key-value storage:
- Structured offline data:
- File cache:
- Scoped event / state mechanism:
- Prohibited state or storage mechanisms:

Confirm every unapproved data strategy separately before implementation.

## 11. Platform configuration

- Minimum iOS version:
- Minimum Android version / API level:
- Edge-to-edge:
- StatusBar / system navigation:
- Safe-area base shell:
- Permission handling:
- Known platform differences and fallbacks:

## 12. Performance and rendering

- Target devices and minimum device tier:
- Critical performance paths:
- Release profiling build method:
- Profiling tools:
- Startup, frame-rate, memory, or interaction budgets:
- Typical and maximum large-list data volume:
- Virtual-list implementation:
- Image loading, cache, and thumbnail strategy:
- Cache owners, capacity, and cleanup:
- Known performance risks and acceptance scenarios:

## 13. Testing strategy

- Test runner:
- Unit / Hook tests:
- Component tests:
- Integration tests:
- E2E tool:
- Native-module mocks:
- Global setup / cleanup:
- Test-file include rules:
- Test-ID naming:
- Coverage strategy:
- Flaky-test handling:
- iOS / Android acceptance matrix:
- Required CI checks:

## 14. Security and privacy

- Data classification and sensitive-field inventory:
- Auth / session contract:
- Protected storage:
- Regular KV / database / file cache:
- API base URL and approved origins:
- Development HTTP exceptions:
- Deep link / universal link allowlist:
- WebView strategy:
- Permission inventory and request timing:
- Logging / analytics / crash redaction:
- Third-party SDK data scope and consent:
- Logout / account-switch / deletion cleanup:
- Backup / device migration / biometrics:
- Applicable OWASP MASVS scope or other security baseline:

## 15. Dependency constraints

- Approved UI / animation / gesture packages:
- Approved native modules:
- New-dependency approval:
- Workspace-dependency rules:
- Expo config-plugin rules:

## 16. Figma workflow

- Figma team / project:
- Design Library:
- Screen files:
- Dev Mode / Code Connect:
- Asset-export permission and directory:
- Token-alignment owner or process:
- Visual-acceptance devices:

## 17. Validation and delivery commands

~~~bash
# format

# lint

# typecheck

# test

# iOS

# Android
~~~

- Minimum delivery checks:
- Required CI checks:
- Location of known pre-existing issues:

## 18. Project-specific prohibitions

- Add project-specific prohibitions.

## 19. Approved exceptions

For each exception, record:

- Shared rule:
- Reason:
- Scope:
- Alternative mitigation:
- Acceptance method:
- Expiration or review condition:
