# 3. Routing and navigation rules

### 3.1 Router entry points

- `mobile/app/` contains only route declarations, layouts, and minimal glue code.
- Actual page implementations belong in `features/<feature>/pages/`.
- Prefer keeping route files to re-exports only.
- `app/_layout.tsx` is responsible only for root navigation, Providers, and global system configuration.
- Do not accumulate hooks, static data, or styles in route files.
- Maintain route strings centrally in project route constants or type-safe entry points.
- Do not scatter hardcoded values for `router.push`, `replace`, `pathname`, `Stack.Screen name`, `Tabs.Screen name`, or `initialRouteName`.
- Project rules determine whether `index.tsx` is allowed, which route-group names are required, and which path-alias conventions to use.

### 3.2 Route groups

Route groups express stable navigation boundaries, such as:

- Startup flows
- Unauthenticated flows
- Authenticated flows
- Modal flows
- Other stable shells

Rules:

- Groups express navigation boundaries, not temporary page categories.
- Pages in the same flow should, where possible, be managed by the same Stack.
- Headers, tab bars, and modal shells should follow naturally from the correct navigation hierarchy.
- Do not simulate route hierarchy with page styles or by dynamically unmounting navigation containers.

### 3.3 Tabs and Stacks

```text
Root Stack
└── App Route Group
    └── Tabs
        ├── Tab A Stack
        │   ├── Main
        │   └── Detail / Edit / Filter
        └── Tab B Stack
            └── Main
```

The following rules are mandatory:

- Tabs are responsible only for switching between top-level destinations.
- Second- and third-level pages within a tab are managed by that tab's own Stack.
- Define the bottom tab bar only once, in the Tabs layout.
- Do not render the tab bar separately on multiple pages.
- Do not treat detail pages, edit pages, or settings subpages as fake tabs.
- Do not hide the tab bar through `return null`, zero height, off-screen positioning, or conditional unmounting of Tabs.
- Full-screen pages covering all Tabs belong in a Stack outside Tabs.
- Subflows belonging to a particular tab remain in that tab's Stack.

### 3.4 Navigation semantics

- Moving forward to a detail page, edit page, or next step: use the project's push semantics.
- Going back: prefer native back semantics and preserve back gestures.
- Use replace only for steps that genuinely replace navigation history.
- Switching tabs must retain tab semantics; do not implement it as a Stack push.
- Closing an entire modal flow and going back one level within it are different actions; use the correct semantics for each.
- Project motion rules define transitions, gesture settings, and durations; keep the same types of navigation consistent.

### 3.5 Page classification

Before adding a page, identify whether it is:

1. A tab's root page
2. A subflow within a tab
3. A full-screen page spanning tabs
4. A route-level modal flow
5. An in-page sheet / dialog

This classification determines which Stack owns the page, whether the tab bar appears, what closing means, and how back navigation works.

### 3.6 Modal classification

Use a route-level modal when:

- It contains multistep navigation
- It needs independent history and system back behavior
- It must cover the current Tabs
- Closing means exiting the entire flow

Use an in-page modal / sheet for:

- Short option lists
- One-time confirmations
- Date or filter pickers
- Lightweight interactions that do not need independent route history

### 3.7 Navigation acceptance checks

Before delivery, check:

- The page is reachable from the correct entry point.
- The back destination is correct.
- Replace leaves the expected navigation history.
- The tab bar does not jump, lag, or render twice during transitions.
- Closing a modal performs the correct action.
- iOS back gestures and Android system back work.
- Changes in navigation hierarchy do not cause safe-area or StatusBar flicker or obscure content.

---
