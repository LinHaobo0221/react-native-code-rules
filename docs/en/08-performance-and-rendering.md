# 08 Performance and Rendering

> This document defines shared performance rules for React Native / Expo Apps. It defines diagnostic methods, code boundaries, and acceptance—not one App's performance budget, list parameters, image library, or animation implementation.

## Core principles

- Measure before optimizing; do not stack `memo`, `useMemo`, and list parameters based on intuition.
- Use release or near-release builds for performance acceptance; do not draw final conclusions from development mode.
- Distinguish JavaScript thread, UI thread, network, image decoding, and native-module costs.
- Optimization must preserve correctness, accessibility, and readability.
- Do not turn one device's incidental result into a project-wide conclusion; use a reproducible action, fixed data volume, and defined device tier.
- Without measurement evidence, prefer a simple and correct implementation.

## Performance facts each project defines

Each App records in `app-specific.md`:

- Target devices and minimum supported device tier
- Cold-start and warm-start metrics of interest
- Critical screens and user paths
- Typical and maximum large-list data volume
- Image sizing, caching, and upload strategy
- Approved animation and list packages
- Profiling tools and acceptance-build method
- Known performance budgets or monitoring metrics

Shared rules cannot fix one FPS, startup time, memory, or list-parameter value for every App.

## React rendering boundaries

### State ownership

- Place state in the smallest stable owner that needs it.
- Do not lift one screen's input state into global Context.
- Do not store a second state value that can be derived directly from props or existing state.
- Preserve references for unchanged items when updating a collection to avoid rebuilding an entire list.
- Use functional state updates for concurrent updates that depend on the prior value.

### Context

- Split Context by semantics and update frequency so one large Context does not rerender unrelated screens.
- Memoize actions and objects in a Provider value only when cross-render reference stability has real value.
- Keep a public snapshot reference stable when its value has not changed, especially for an external store using `useSyncExternalStore`.
- Context does not carry tokens, large list caches, or high-frequency animation values.

### `memo`, `useMemo`, and `useCallback`

These are performance tools, not code-format requirements.

Appropriate cases:

- Profiling shows that a value is expensive to compute
- Reference stability is a real contract for a `memo` child, Context value, effect, or native subscription
- `FlatList` `renderItem`, footer, or empty component causes measurable extra work due to reference changes
- Data conversion creates new objects for many items and materially affects frame time

Inappropriate cases:

- The computation is a property read or short array operation
- No memo boundary exists, so stable references reduce no work
- Dependencies change almost every render
- It is added only to remove lint output or make code “look optimized”
- A custom comparator is more complex than rerendering or likely to produce an incorrect result

`React.memo` applies only to pure components. A custom comparison must cover every prop that affects rendering and interaction and must have performance evidence and tests. Never create stale UI by ignoring callback or object changes.

## Large lists and virtualization

### Component choice

- Short content that is known not to grow may use `ScrollView` or `map`.
- Long, paginated, and dynamic lists use `FlatList` / `SectionList` or a project-approved virtual list.
- Do not render a large number of items at once in `ScrollView`.
- Do not nest a virtual list in a same-direction `ScrollView` to avoid layout work.

### Keys and item references

- `keyExtractor` uses a stable backend or local-model ID.
- Do not use array index, display copy, or a value generated on every render as a key.
- Deduplicate page appends by stable ID and preserve unchanged item references.
- A local patch such as delete, block, or like updates only the affected item; it does not rebuild unrelated page cache.

### `renderItem` and `extraData`

- Keep `renderItem` focused; do not perform API calls, expensive parsing, or unbounded data transformations inside it.
- Avoid meaninglessly rebuilding objects and handlers passed to items, without sacrificing clarity only for reference stability.
- `extraData` contains only the minimum state that truly affects items; do not pass a large object that changes every render.
- Move expensive item view-model conversion into a data adapter, selector, or justified memoization boundary.

### `getItemLayout`

- Use it only when item dimensions are fixed or can be calculated reliably.
- Include separator size in the offset.
- Do not provide inaccurate `getItemLayout` to a dynamic-height list for the appearance of optimization.
- Prefer it for fixed-size carousels, pickers, or regular row lists.

### Window parameters

Tune `initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `windowSize`, and `removeClippedSubviews` from profiling based on:

- First viewport height
- Item cost
- Target device
- Blank-window risk during fast scrolling
- Memory pressure
- Platform differences

Do not copy a set of “universal best values” from another App.

### Pagination and refresh

- `onEndReached` is idempotent and must not start duplicate requests when called repeatedly.
- Set the loading lock synchronously before the request; do not wait for the next React render to prevent concurrency.
- Define mutual-exclusion rules among refresh, initial load, and load-more.
- Read cursor from the latest cache instead of paginating from a stale closure.
- Before writing state, a late response validates request version, query key, or cancellation signal.
- After unmount, filter change, or account switch, an old response must not write into the new screen.
- Define whether deleting the last item should fill from a next page; do not create a request loop.

## Asynchronous work and the main thread

- Do not put expensive synchronous computation in render, a scroll handler, or the same frame as press feedback.
- Precompute, paginate, or move work into the pure data layer instead of repeating it per item.
- Avoid frequent `setState` in scroll events; prefer stable thresholds, native/UI-thread animation, or a throttled strategy.
- Clean up timeouts, requests, subscriptions, and animations on unmount or dependency change.
- Use `AbortController`, request versions, or a session lease to prevent invalid asynchronous commits. A mounted-only check cannot prevent stale data across queries or accounts.
- Independent initialization work may run concurrently; explicitly serialize work with ordering or security dependencies.

## Images and files

- A list thumbnail uses a resource appropriate to display size instead of downloading the original image and relying on scaling.
- Use the project's approved image caching, placeholder, and error fallback.
- Define `resizeMode`, dimensions, or aspect ratio for remote images to reduce layout shifts.
- Do not repeatedly create base64 values, large objects, or synchronous image work during scrolling.
- Perform image preprocessing, cropping, and compression before submission or in a background stage so press feedback is not blocked.
- To identify a file type, read only the minimum header needed instead of loading a large file into JavaScript memory.
- Release or clean up file handles, temporary files, and object URLs according to lifecycle.
- Animate a large image with transforms rather than changing source width and height every frame and retriggering crop.

## Animation and gestures

- Reuse the project's unified animation infrastructure and motion Tokens.
- Continuous animation that can run on the UI / native thread must not depend on a React state update every frame.
- Define behavior for animation start, cancellation, rapid repeated presses, and component unmount.
- Avoid synchronous large-data conversion, bulk log writes, or large component-tree reconstruction during transitions.
- Gesture callbacks do not create unbounded objects, timers, or requests.
- Use the project-approved fallback in reduce-motion mode.

## Startup and navigation

- Block startup only for work required to make the first screen correct.
- Establish dependency order among fonts, Auth restore, required configuration, and similar work; defer or parallelize unrelated tasks.
- Keep Native Splash only while the App cannot render a valid first frame; individual screens must not control it.
- Control the number of Root Providers and their value updates; do not subscribe to every feature's data at the root.
- Decide whether to lazy-load large non-initial modules based on bundle and first-screen measurements.
- Screen changes must not remount the whole tree due to incorrect keys, conditional Root reconstruction, or duplicate Providers.

## Cache and memory

- Every cache has an owner, key, capacity, or cleanup condition.
- Isolate user-scoped cache by user and clear or invalidate it on logout / account switch.
- Do not accumulate API responses indefinitely in a module-level Map or Context.
- List pagination defines retained pages, refresh replacement, and deletion behavior.
- Do not retain blobs, base64, images, file handles, or large logs in React state.
- Project-specific strategy decides whether to release resources on AppState transitions or memory warnings.

## Logging and debug code

- Do not write console logs from render, scroll, animation frames, or high-frequency listeners.
- Production builds must not retain debug logs that cause meaningful performance cost or disclose data.
- Use project-approved performance instrumentation that can be disabled without changing business behavior.

## Profiling workflow

For jank, slow startup, memory growth, or blank list windows:

1. Define reproducible steps, data size, device, and build type.
2. Determine whether the cause is JS frame, UI frame, network, image, native module, or memory.
3. Collect evidence with React Native DevTools, a platform profiler, or project monitoring.
4. Record the baseline before changing code.
5. Change one major variable at a time.
6. Repeat the same scenario and check correctness and low-end-device regression.
7. Record necessary budgets and acceptance methods in project-specific rules.

Performance conclusions come from release or near-release builds. Development mode is for diagnosis, not final metrics.

## Performance tests and acceptance

Automated tests protect:

- Pagination lock and deduplication
- Rejection of stale responses
- Context snapshot reference-stability contract
- Cleanup and resource release
- Correctness of large-data selectors / view models

Automated tests do not replace real-device profiling. Final verification includes at least:

- First-screen entry
- Fast forward and reverse scrolling
- Concurrent refresh and load-more
- Image-dense screens
- Input and list scrolling while the keyboard is open
- Modal / navigation transitions
- Background restoration
- Memory trend during prolonged use

## Review checklist

- [ ] A reproducible issue or explicit budget exists before optimization.
- [ ] Performance was verified in a release or near-release build.
- [ ] State lives in the smallest appropriate owner.
- [ ] Context does not trigger unrelated high-frequency updates.
- [ ] Memoization has a real boundary and correct dependencies.
- [ ] List keys are stable; pagination and refresh use synchronous locks.
- [ ] A stale response cannot overwrite a new query, screen, or account.
- [ ] Large images, file handles, timers, listeners, and animations are cleaned up.
- [ ] High-frequency paths contain no logs or expensive synchronous work.
- [ ] iOS, Android, and the target low-end device tier were verified.

## Reference baseline

- [React Native Performance Overview](https://reactnative.dev/docs/performance)
- [React Native Profiling](https://reactnative.dev/docs/profiling)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [React Native ScrollView](https://reactnative.dev/docs/scrollview)
