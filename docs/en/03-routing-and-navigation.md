# 03 Routing and Navigation

> This document defines general Expo Router organization. Concrete route groups, paths, tab names, and transition values belong in project-specific rules.

## Core rules

- `mobile/app/` contains only route declarations, layouts, and very thin bridges.
- Real screen implementations live in `features/<feature>/pages/`.
- Route files should contain only re-exports whenever possible; do not accumulate Hooks, static data, and styles there.
- `app/_layout.tsx` handles root navigation, Providers, and global system configuration; it does not contain screen business content.
- Route strings must be centralized in the project's route constants or type-safe entry point.
- Hard-coded strings for `router.push`, `replace`, `pathname`, `Stack.Screen name`, `Tabs.Screen name`, and `initialRouteName` must not be scattered across files.

The project-specific rules must state whether `index.tsx` is permitted, which route-group names are fixed, and what path-alias form is used. When a project already has a consistent convention, new screens follow it instead of creating a second path style.

## Route groups

A project should divide route groups around stable shells such as startup, unauthenticated, authenticated, Modal, or other navigation boundaries. Shared rules require only that:

- A group expresses a navigation boundary, not a temporary screen category.
- Screens in one flow should be managed by the same Stack where practical.
- Whether a screen displays a tab bar, header, or modal shell follows naturally from the correct navigation hierarchy.
- Do not simulate navigation hierarchy through page styles or conditional unmounting of a navigator.

Record concrete group names in `app-specific.md`.

## Tabs and Stack

Tabs represent only primary destinations. Secondary and deeper screens inside one tab are managed by that tab's own Stack.

Standard relationship:

~~~text
Root Stack
└── App Route Group
    └── Tabs
        ├── Tab A Stack
        │   ├── Main
        │   └── Detail / Edit / Filter
        └── Tab B Stack
            └── Main
~~~

Required rules:

- Define Bottom Tab Bar once in the Tabs layout.
- Do not redraw a tab bar on multiple screens.
- Do not make detail, edit, or nested settings screens into fake tabs.
- Do not hide a tab bar by returning `null`, setting height to zero, moving it off-screen, or conditionally unmounting Tabs.
- A full-screen route that covers all tabs belongs in a Stack outside Tabs.
- A nested flow owned by one tab remains in that tab's Stack.

## Navigation semantics

- Use the project's push semantics to open details, edit screens, or the next step.
- Prefer the native back semantics for returning so the back gesture remains available.
- Use replace only when a flow node truly replaces history.
- A tab change retains tab semantics and must not imitate a Stack push.
- Closing an entire modal flow and returning one step inside that modal are separate actions and must not share incorrect semantics.

Concrete transition animation, gesture settings, and duration come from project motion rules. Shared rules require consistency among similar navigation and respect for native iOS / Android behavior.

## Screen classification

Before adding a screen, determine whether it is:

1. A root screen of a tab
2. A nested flow within one tab
3. A cross-tab full-screen route
4. A route-level modal flow
5. A sheet / dialog inside a screen rather than an independent route

This classification determines its Stack, whether the tab bar is naturally visible, its close semantics, and its back behavior. Do not place a screen arbitrarily at the `app/` root and compensate for an incorrect hierarchy with styles.

## Route-level Modal versus in-screen overlay

A route-level modal is usually appropriate when:

- It contains internal multi-step navigation
- It needs independent history and system-back behavior
- It must cover the current Tabs
- Closing means exiting the entire flow

An in-screen Modal / Sheet is usually appropriate for:

- A short option list
- A one-time confirmation
- A date or filter picker
- A lightweight interaction without independent route history

Reuse the project's stable implementation and animation patterns. Do not create a new overlay structure on every screen.

## Route constants

The project should centralize:

- path
- route name
- route group name
- common pathname parameter types

Route constants must have clear business semantics, and the same path must not be repeated across files. Use stable IDs for route parameters instead of display text or array indexes.

## Navigation acceptance

Before delivery, verify at minimum:

- The screen is reachable from the correct entry
- Back returns to the correct destination
- Replace does not leave history that should not be revisited
- The tab bar does not jump, appear late, or render twice during transitions
- Modal close semantics are correct
- iOS back gestures and Android system back work
- safe area and StatusBar do not flicker or become obscured when hierarchy changes
