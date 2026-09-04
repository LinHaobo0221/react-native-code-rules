# 9. Testing rules

This section contains the full testing strategy requirements.

### 9.1 Testing goals

Tests verify that user behavior, public contracts, and system invariants hold after changes, shared-code extraction, refactoring, and upgrades, and under exceptional conditions. Their purpose is not just to increase coverage numbers or prove that private methods were called.

Prioritize protecting:

- Core user paths and the flows that own action orchestration
- Public props, variants, accessibility, and all direct consumers of shared components
- Data transformations, validation, Use Cases, and business calculations
- Reducer state transitions and illegal-state prevention
- Navigation and state boundaries
- API contracts and error mapping
- Concurrency, cancellation, and stale responses
- Authentication, storage, and account switching
- Key interactions and accessibility
- Regression coverage for the root causes of fixed bugs
- Native iOS / Android differences

### 9.2 Test layers

1. **Static analysis**: formatting, lint, TypeScript typechecking, Expo config, assets, bundles, dependency boundaries, and circular-reference checks.
2. **Pure Model / Use Case tests**: formatters, parsers, validation, selectors, Reducers, Strategies, Use Cases, sorting, merging paginated results, date/number conversions, error mapping, and route mapping.
3. **Hook / Controller tests**: inputs, derived view models, loading, success, error, retry, refresh, load-more, debounce, timers, cleanup, subscriptions, races, optimistic updates, and mapping Use Case results to UI/navigation.
4. **Component interaction tests**: verify text, input, press, toggle, select, loading, disabled, error, empty, selected, variants, and accessibility through user interactions.
5. **Integration tests**: verify how Pages, Controllers, Use Cases, API adapters, Providers, route guards, authentication coordinators, storage adapters, caches, events, and pagination actually work together.
6. **Native / E2E tests**: native navigation, back gestures, keyboards, autofill, safe areas, permissions, files, sharing, deep links, foreground/background transitions, EAS / release builds, and native animation.

These shared standards do not require a particular test runner. React Native's official documentation marks React Test Renderer as deprecated; new projects should use a supported component testing approach focused on user behavior. Existing projects may continue maintaining tests that use it, but must document a migration plan and gaps in native acceptance testing.

### 9.3 Test file organization

- By default, place tests adjacent to their modules and name them `name.test.ts` or `name.test.tsx`.
- Shared-component tests cover public contracts; consumer-specific business behavior remains in feature tests.
- Use Case and Reducer tests do not require mounting React components.
- Place cross-feature helpers in `mobile/test/`, not duplicated in each feature.
- Give fixture builders and deferred helpers descriptive names.
- Test IDs may use stable domain prefixes to help trace requirements, defects, and security reviews.
- Test descriptions clearly express Given / When / Then or Arrange / Act / Assert.
- Each test primarily proves one behavior or invariant.
- Do not write tests that lock in internal file boundaries, private-helper counts, or pass-through calls that add no value.

### 9.4 Shared-code and control-flow tests

When extracting shared code or refactoring flows, verify at least:

- New shared components preserve original behavior in all migrated consumers.
- Variants, slots, and default props do not leak state between consumers.
- Feature-local components moved into `shared` do not depend on routes, APIs, authentication, or feature stores.
- After duplicate business rules are removed, only one source of truth remains.
- For each public action, a Controller triggers the Use Case or direct flow that owns the operation exactly once.
- Use Cases run key steps in the correct order, stop when a step fails, enforce idempotency/locks, and return correct typed results.
- Reducers do not produce illegal state combinations, and side effects do not occur inside them.
- Multiple Adapter / Strategy implementations satisfy the same contract.

Do not assert that `handleSave` calls `submit` and that `submit` then calls `executeSave`. Assert the result of the user's submission, how many times external side effects occur, state transitions, and error feedback.

### 9.5 Deterministic tests

Tests must be independent and repeatable, regardless of execution order. Control:

- Current time and time zone
- Timers, animation frames, and idle callbacks
- UUID / randomness
- Network responses
- AppState
- Platform
- Permissions
- File metadata
- Storage state
- Global singletons and module caches

Do not use real `sleep` or long timeouts to wait for asynchronous state. Use fake timers or injectable clocks for time, and deferred Promises or controlled mocks for asynchronous ordering.

### 9.6 Async behavior and race conditions

Recommended:

```ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};
```

Cover at least:

- Request A starts first but finishes last; request B starts later but finishes first
- A request remains pending when the page unmounts
- An old response returns after filters, route parameters, or accounts change
- Refresh and load-more trigger together
- Rapid repeated taps that trigger a mutation
- Logout while a storage write is pending
- Account switching while refresh is pending
- Old events arrive after listener cleanup
- A picker / permission flow returns before AppState has stabilized

Tests also assert:

- Which result may be committed
- Which result must be canceled or discarded
- Whether the loading lock is eventually released
- Whether cache, storage, public state, and user-facing errors are consistent
- Whether forwarding, effects, or listeners execute the same user action more than once

Do not create races using real network delays.

### 9.7 Mocks, APIs, navigation, and accessibility

- Prefer real pure modules and small fakes.
- Mock networking, secure storage, FileSystem, image pickers, Linking, and native modules through explicit adapters.
- Mock return values conform to real contracts, including failures, cancellation, and invalid responses.
- Reset call history, implementations, and module-level state for every test.
- Do not leak mocks, timers, mounted roots, or listeners into subsequent tests.
- Do not mock the core behavior being tested.
- Use minimal fakes for Use Case dependencies; do not duplicate production business logic for tests.
- API tests cover method, path, query, body, header, success envelope, runtime validation, errors, timeout, networking, `4xx`, `5xx`, pagination, cancellation, stale responses, retries, and sensitive headers.
- Unit tests do not connect to real production endpoints.
- Navigation tests cover entry points, parameters, push, replace, back, back within modals, closing an entire flow, tabs, route guards, logout, and deep links.
- Component tests cover role, label, selected, checked, disabled, expanded, hit targets, duplicate prevention while loading, and relationships between inputs and error text.

### 9.8 Snapshots, bug fixes, coverage, and CI

- Use snapshots only for small, stable outputs with clear review value.
- Do not generate giant snapshots for complex pages or generic config renderers.
- Snapshot updates require human review.
- Use explicit assertions for business calculations, interactions, state transitions, and security invariants.
- For bug fixes, prioritize writing a failing test, making the smallest fix, checking for regressions, reviewing the same flow and shared consumers, and completing native acceptance checks.
- Coverage signals blind spots; it is not a quality goal in itself.
- Drive coverage by invariants and branches for authentication, payments, permissions, data deletion, Use Case branches, and races.
- If key branches are not covered, explain why they cannot be automated and how to verify them manually.

Recommended CI order:

1. Format / lint / typecheck / dependency boundary
2. Fast model / use-case unit tests
3. Hook / component / integration tests
4. Build / bundle / Expo config checks
5. Critical E2E and release smoke tests

---
