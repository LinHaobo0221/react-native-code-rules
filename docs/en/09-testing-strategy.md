# 09 Testing Strategy

> This document defines shared testing principles, layers, asynchronous-race coverage, and delivery requirements for React Native / Expo Apps. Concrete runners, component-testing libraries, E2E tools, and CI commands belong in project-specific rules.

## Test goals

Tests prove that user behavior and system invariants remain valid through modification, refactoring, upgrade, and failure conditions. They do not exist only to increase a coverage percentage.

Prioritize protection of:

- Critical user paths
- Data conversion and business calculations
- Navigation and state boundaries
- API contracts and error mapping
- Concurrency, cancellation, and stale responses
- Auth, storage, and account switching
- Key interactions and accessibility
- Root causes of fixed bugs
- Native differences between iOS and Android

## Testing facts each project defines

Each App records in `app-specific.md`:

- Test runner and version
- Test environment and path aliases
- Unit / Hook / component / integration / E2E tools
- Native-module mock entry points
- Global setup and cleanup
- Required CI checks
- Coverage strategy
- iOS / Android manual or automated acceptance matrix
- Flaky-test handling process

Shared rules do not mandate Jest, Vitest, or a specific E2E package.

## Test layers

### 1. Static analysis

The base layer includes:

- formatter / format check
- lint
- TypeScript typecheck
- Expo config, asset, or bundle checks

Static analysis does not replace runtime tests, but it provides baseline feedback for every change.

### 2. Pure unit test

Appropriate subjects:

- Formatters and parsers
- View-model conversion
- Reducers
- Selection / sorting / pagination merge
- Date, number, and unit conversion
- Validation and error mapping
- Stable IDs and route mapping

Pure-function tests are fast and use no network, React, or native environment. They cover boundary and invalid inputs.

### 3. Hook / state test

Appropriate subjects:

- Input and derived state
- loading / success / error / retry
- refresh and load-more
- debounce / countdown / timers
- Effect cleanup
- Event subscription
- Request races and stale responses
- Optimistic update and rollback

Hook tests use the project's approved React test environment and wrap updates in the correct `act` boundary. After each test, unmount and clean up subscriptions, timers, mocks, and pending work.

### 4. Component interaction test

Test user-perceivable behavior:

- Whether copy and controls appear
- What is displayed after user input
- Whether press / toggle / select invokes the correct callback
- Whether loading / disabled blocks a duplicate action
- error / empty / selected states
- Accessibility role, label, and state

Prefer queries based on text, role, label, and user actions. Use `testID` only when no stable accessible entry exists or E2E requires a locator.

Avoid assertions on:

- Internal component state
- Private Hook implementation
- Props structure with no user meaning
- Large component trees that change easily during refactoring

React Native documentation currently marks React Test Renderer as deprecated. Therefore:

- Shared rules do not make `test-renderer` the standard for new projects.
- An existing project may maintain current tests until a dependency change is approved, but it records a migration plan and native-acceptance gaps.
- A new project chooses a currently supported, user-behavior-oriented component-testing solution and records it in project-specific rules.

### 5. Integration test

Integration tests verify collaboration among real modules, for example:

- Page Hook + API adapter + error mapping
- Provider + route guard + navigation intent
- Auth coordinator + storage adapter + API client
- List cache + feature event + pagination
- Form + validation + mutation + completion state

Mock only true boundaries such as network, system storage, time, files, photo library, and navigation host. Use real internal pure functions and business modules whenever practical.

### 6. Native / end-to-end test

E2E or native manual acceptance covers what JavaScript tests cannot prove:

- Native navigation and back gestures
- Keyboard, autofill, and system back
- safe area, StatusBar, and edge-to-edge
- Permissions, photo library, camera, files, and sharing
- Deep links and cold start
- Foreground / background transitions
- EAS / release-build behavior
- Native components and animations on iOS / Android

E2E prioritizes a small number of high-value paths such as startup, sign-in, the core feature, payment, or account operations. Do not duplicate every unit case in slow E2E tests.

## Test-file organization

- Tests live next to the tested module by default, named `name.test.ts` or the project-defined form.
- Cross-feature test helpers live in `mobile/test/` rather than being copied into each feature.
- Fixture builders and deferred helpers use semantic names and do not become an opaque general-purpose test framework.
- Test IDs may use stable domain prefixes to trace requirements, defects, and security reviews.
- Test descriptions clearly express Given / When / Then or Arrange / Act / Assert.

One test primarily proves one behavior or invariant. Multiple assertions may exist only when they support the same conclusion.

## Deterministic tests

Tests run independently, repeatably, and without dependence on execution order.

Control:

- Current time and time zone
- Timers, animation frames, and idle callbacks
- UUID / random
- Network responses
- AppState
- Platform
- Permissions
- File metadata
- Storage state
- Global singletons and module cache

Do not use a real `sleep` or long timeout to wait for asynchronous state to “probably finish.”

Use fake timers or an injectable clock for time logic. Use deferred Promises or controlled mocks to advance asynchronous order precisely.

## Asynchronous and race-condition tests

Advanced mobile tests cover timelines beyond normal success.

A deferred Promise is recommended:

~~~ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};
~~~

Important scenarios:

- Request A starts first and resolves last; request B starts later and resolves first
- A request is pending when the screen unmounts
- A filter, route parameter, or account changes before an old response arrives
- refresh and load-more start concurrently
- A mutation is pressed rapidly multiple times
- logout occurs while a storage write is pending
- An account changes while refresh is pending
- An old event arrives after listener cleanup
- A picker / permission flow returns while AppState is not yet stable

Test comments explain the timeline and assert:

- Which result may commit
- Which result must be cancelled or discarded
- Whether the loading lock is eventually released
- Whether cache, storage, public state, and user-facing errors remain consistent

Do not depend on real network latency to create a race.

## Mock principles

- Prefer real pure modules and small fakes; avoid over-mocking internal implementation.
- Network, Secure Storage, FileSystem, Image Picker, Linking, and native modules use explicit adapter mocks in Node tests.
- Mock values conform to the real contract, including failure, cancellation, and invalid responses.
- Reset call history, implementations, and module-level state for every test.
- Do not leak a mock, timer, mounted root, or listener from one test into the next.
- Do not mock the core behavior under test, or the test proves only that the mock works.

## API and data tests

The API layer covers at least:

- method, path, query, body, and headers
- Success envelope and runtime validation
- Stable error-code mapping
- Timeout, network, `4xx`, and `5xx`
- Pagination cursor and deduplication
- Cancellation / stale response
- Whether a mutation may retry
- Prevention of arbitrary sensitive-header overrides

Do not connect a unit test to a real production endpoint.

When backend contracts are shared, frontend and backend each validate their boundary, using contract tests or a shared schema to prevent drift.

## Navigation tests

Cover at least:

- Correct entry and route parameters
- push / replace / back semantics
- Difference between returning inside a modal and closing the whole flow
- A tab child screen does not create a second tab bar
- Route guards for logout, invalid accounts, and deep links
- Root does not remount unexpectedly on normal state changes
- A back gesture cannot enter an invalidated protected screen

A Node integration test proves only state and navigation intent. Native animation, gestures, and system back still require acceptance on both platforms.

## Component and accessibility tests

For key interactive components, verify at least:

- Role and label
- selected / checked / disabled / expanded state
- Visual disabled state matches actual event blocking
- Hit-target expansion does not change visual layout
- A callback does not fire repeatedly while loading
- Error text has an understandable relationship to its input
- Dynamic type or long copy does not hide the primary action

Verify color, pixels, and detailed layout through Figma visual QA or an approved visual-regression tool rather than replacing them with many brittle style-object assertions.

## Snapshot tests

- Use snapshots only for small, stable output with clear review value.
- Do not create a huge snapshot for an entire complex screen.
- Review snapshot updates manually; do not batch-update merely to remove failures.
- Business calculations, interactions, and security invariants require explicit assertions and cannot rely on snapshots alone.

## Bug fixes

Preferred bug-fix sequence:

1. Add a failing test that reliably reproduces the root cause.
2. Implement the smallest fix.
3. Prove the regression test passes.
4. Inspect direct consumers in the same flow or shared component.
5. Complete necessary native acceptance.

When a bug reproduces only on a device, in a system picker, or in a particular navigation state, preserve detailed manual reproduction steps and automate the separable state machine where possible.

## Coverage

- Coverage is a signal for blind spots, not the quality goal itself.
- Do not test meaningless getters or implementation details solely for line coverage.
- High-risk modules such as Auth, payment, permissions, data deletion, and races use invariant- or branch-driven coverage.
- When a new critical branch cannot be automated, state why and record the corresponding manual acceptance.

## CI layering

Recommended feedback order:

1. format / lint / typecheck
2. Fast unit tests
3. Hook / component / integration tests
4. Build / bundle / Expo config checks
5. Critical E2E and release smoke tests

Fast checks block obvious defects. Slow native tests may run on Pull Requests, release candidates, or nightly jobs. Project-specific rules define the exact strategy.

## Review checklist

- [ ] Tests protect user behavior or system invariants rather than implementation details.
- [ ] Tests run independently and deterministically.
- [ ] Every mounted root, timer, listener, and mock is cleaned up.
- [ ] Async races use controlled Promises rather than real sleep.
- [ ] Success, failure, cancellation, and stale paths are covered according to risk.
- [ ] Component tests prefer roles, labels, and user actions.
- [ ] Native capabilities are not declared complete from Node mocks alone.
- [ ] A bug fix includes a root-cause regression test or explicit manual acceptance.
- [ ] CI commands and pre-existing failures are recorded clearly.

## Reference baseline

- [React Native Testing Overview](https://reactnative.dev/docs/testing-overview)
