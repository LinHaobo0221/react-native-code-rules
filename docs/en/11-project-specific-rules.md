# 11. Required content in the project's `app-specific.md`

Each project must maintain its own `mobile/docs/agents/app-specific.md` or equivalent project documentation. Mark undecided items as “Not yet decided”; do not fill them in with another app's configuration.

1. **Project identity**: rules language, app name, `mobile/` path, package name, Expo SDK, React Native, React, package manager, native workflow.
2. **Required reading**: architecture, API contracts, data and storage, keyboard layout, testing, and release standards.
3. **Directories and path aliases**: whether the project follows the standard structure, approved additional directories, when to use `model` / `use-cases`, aliases, `index.tsx`, and page export conventions.
4. **Routing and navigation**: route groups, root Stack, Tabs, per-tab Stacks, pages spanning tabs, modals, route constants, animations, and back-navigation requirements.
5. **Design tokens**: source of truth in code, Figma variables / library, colors, spacing, corner radii, shadows, typography, z-index, and theme modes.
6. **Fonts and languages**: supported languages, fonts, fallbacks, weight mappings, dynamic type, and maximum scaling.
7. **Motion**: motion tokens, navigation, modals / sheets, press feedback, loading, reduced motion, and prohibited implementations.
8. **Styling and base components**: styling system, when to colocate or separate styles, theme, and entry points for Button, Input, Switch, Checkbox, Radio, Image, Avatar, Modal, Sheet, keyboard-aware layouts, and loading, empty, and error states.
9. **Shared component catalog**: public primitives / patterns, entry points, direct consumers, variants, deprecated components, where to find component examples, and the policy for style overrides.
10. **Images, SVGs, and icons**: asset directories, SVG integration, icon sources, multi-resolution bitmaps, placeholders, fallbacks, and naming rules.
11. **Data, APIs, and state**: API client, response envelope, when to use Controllers, Use Cases, Reducers, Strategies, Adapters, and Repositories; authentication, tokens, KV storage, offline data, file caches, scoped events/state, and prohibited approaches.
12. **Control-flow conventions**: main action paths, Controller return structure, Use Case result conventions, error mapping, navigation ownership, submission locks, cancellation, and stale-result rules.
13. **Reuse strategy**: where to search for reusable code, Feature First, when to move code into shared, how to migrate it or move it back into a feature, permitted slots/variants, and when to revisit duplicate code.
14. **Platform configuration**: minimum iOS / Android versions, edge-to-edge, StatusBar, system navigation, safe areas, permissions, and platform differences.
15. **Performance and rendering**: target devices, critical performance paths, release profiling, tools, budgets, list sizes, virtualized lists, image caches, cache ownership, and cleanup policies.
16. **Testing strategy**: test runner, tools for each layer, Use Case/Reducer/Controller tests, native mocks, setup/cleanup, test inclusion rules, test IDs, coverage, flaky tests, a cross-platform acceptance matrix, and CI checks.
17. **Security and privacy**: data classification, authentication contracts, protected storage, KV/database/cache, API origins, HTTP exceptions, deep links, WebViews, permissions, log redaction, SDK consent, and cleanup after logout or deletion.
18. **Dependency constraints**: permitted UI, animation, gesture, and native modules; new-dependency approval, workspace dependencies, and Expo config plugin rules.
19. **Figma workflow**: team/project, design library, page files, Dev Mode / Code Connect, asset export permissions, the process for aligning tokens and shared components, and devices used for visual acceptance checks.
20. **Validation and delivery commands**: format, lint, typecheck, test, dependency boundaries, iOS, Android, minimum delivery checks, CI checks, and where pre-existing issues are recorded.
21. **Project-specific prohibitions**.
22. **Approved exceptions**: the shared rule involved, reason for the exception, affected areas, alternative safeguards, acceptance method, and conditions for expiration or review.

---
