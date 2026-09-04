# 8. Performance and rendering rules

This section contains the complete performance and rendering rules.

### 8.1 Core principles

- Measure before optimizing.
- Do not add `memo`, `useMemo`, `useCallback`, or list tuning parameters based on intuition alone.
- Use release or near-release builds for performance acceptance checks; do not base final conclusions on development mode.
- Separate the costs of the JavaScript thread, UI thread, network, image decoding, and native modules.
- Optimizations must preserve correctness, accessibility, and readability.
- Use reproducible interactions, a fixed amount of data, and the target device classes.
- Without evidence, prefer a simple, correct implementation.

### 8.2 State, Context, and memoization

- Keep state with the smallest stable owner that needs it.
- Do not move a single page's input state into global Context.
- Do not store a second copy of state that can be derived from props or existing state.
- Preserve references for unchanged items when updating collections.
- Use functional state updates for concurrent updates that depend on prior values.
- Split Context by update frequency and semantics.
- Do not put tokens, large list caches, or high-frequency animation values in Context.
- Use `memo`, `useMemo`, and `useCallback` only when justified by computational cost, a stable-reference requirement, or profiling evidence.
- Use `React.memo` only for pure components.
- Custom comparators must cover all props affecting rendering and interaction and must not create stale UI.

### 8.3 Large lists and virtualization

- You may use `ScrollView` or `map` for short content that is known not to grow.
- Long lists, paginated lists, and dynamic data use `FlatList` / `SectionList` or a project-approved virtualized list.
- Do not render large numbers of items all at once in `ScrollView`.
- Do not nest virtualized lists in `ScrollView` containers that scroll in the same direction.
- `keyExtractor` uses stable IDs from the backend or local model.
- When appending pages, deduplicate items by stable ID and preserve references for unchanged items.
- Do not call APIs, perform expensive parsing, or run unbounded data transformations in `renderItem`.
- Pass only the minimum state genuinely affecting list items through `extraData`.
- Use `getItemLayout` only when dimensions are fixed or can be calculated reliably; include separators in the offsets.
- Do not supply inaccurate layout values for dynamic heights in the name of optimization.
- You must tune windowing parameters such as `initialNumToRender` and `windowSize` through profiling, accounting for first-screen height, rendering cost per item, target devices, the risk of blank areas, memory, and platform differences.

### 8.4 Pagination, refresh, and async work

- `onEndReached` must be idempotent.
- Set the loading lock synchronously before requesting data; do not just wait for the next render.
- Explicitly define which initial-load, refresh, and load-more operations may not run together.
- Read cursors from the latest cache, not stale closures.
- Validate the request version, query key, or cancellation signal before committing a late response.
- After a page unmounts, filters change, or accounts switch, old responses must not update the new page.
- Define whether deleting items at the end automatically fetches more items to fill the page; do not create request loops.
- Do not run expensive synchronous calculations during render, in scroll handlers, or in the same frame as press feedback.
- Do not frequently call `setState` in scroll events.
- Clean up timeouts, requests, subscriptions, and animations on unmount or condition changes.
- Checking only whether the component is mounted does not prevent stale data across queries or accounts; use `AbortController`, request versions, or session leases.
- Initialization tasks with ordering or security dependencies must be explicitly sequential; independent tasks may run in parallel.

### 8.5 Images, files, animation, and caches

- List thumbnails use assets matching their display sizes.
- For remote images, specify `resizeMode`, dimensions, or aspect ratios explicitly.
- Do not repeatedly generate base64 data or large objects, or process images synchronously, during scrolling.
- Image preprocessing, cropping, and compression must not block press feedback.
- Read only the minimum header needed when determining file type.
- You must release file handles, remove temporary files, and revoke object URLs at the appropriate lifecycle boundaries.
- Prefer transforms when animating the scale of large images.
- Prefer running continuous animations on the UI / native thread without updating React state on every frame.
- Define predictable behavior for animation starts, cancellation, rapid repeated taps, and unmounting.
- Gesture callbacks must not create unlimited objects, timers, or requests.
- Use the project-approved fallback for reduced motion.
- Every cache must have an owner, a key, and a capacity limit or cleanup conditions.
- User-scoped caches are isolated by user and cleared or invalidated on logout / account switch.
- Do not accumulate API responses indefinitely in module-level Maps or Context.
- Do not retain blobs, base64, images, file handles, or large logs in React state long-term.

### 8.6 Startup, navigation, and profiling

- At startup, block only on tasks needed to display the first screen correctly.
- Make dependencies between font loading, authentication restoration, and required configuration explicit.
- Keep the native splash screen visible only until the app can display its first frame.
- Control the number of root Providers and how often their values update; do not subscribe to every feature's data at the root.
- Use bundle and first-screen measurements to decide whether to lazy-load large modules that are not needed on the first screen.
- Page navigation must not remount the entire tree because of incorrect keys, conditional rebuilding of the root, or duplicate Providers.
- Do not write console logs during render, scrolling, animation frames, or high-frequency listener callbacks.
- Do not keep costly debug logging or logs that could expose data in production.

Profiling workflow:

1. Define reproducible steps, dataset size, devices, and build type.
2. Identify whether the problem concerns JS frames, UI frames, networking, images, native modules, or memory.
3. Gather evidence using DevTools, platform profilers, or project monitoring.
4. Record the pre-change baseline.
5. Change only one major variable at a time.
6. Measure again in the same scenario; check correctness and regressions on low-end devices.
7. Record the required budgets and acceptance methods in project rules.

Before completion, verify at least the first screen, fast scrolling and changes in scroll direction, concurrent refresh/load-more operations, image-heavy pages, scrolling with the keyboard open, modal/navigation transitions, returning from the background, and memory usage over extended sessions.

---
