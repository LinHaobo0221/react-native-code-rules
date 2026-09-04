# 2. Standard `mobile/` directory structure

Use the following standard structure:

```text
mobile/
├── app/
├── features/
│   └── <feature>/
│       ├── pages/
│       ├── ui/
│       ├── hooks/
│       ├── model/
│       ├── use-cases/
│       ├── events/
│       ├── data/
│       ├── constants/
│       ├── api/
│       ├── context/
│       ├── types/
│       └── utils/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── events/
│   ├── api/
│   ├── auth/
│   ├── constants/
│   ├── types/
│   └── utils/
├── assets/
├── types/
├── plugins/
├── test/
├── docs/
│   └── agents/
├── app.json
├── metro.config.js
├── tsconfig.json
└── package.json
```

Create directories as needed; do not commit empty directories just to fill out the structure. Add directories such as `model`, `use-cases`, `api`, `auth`, `context`, `events`, and `plugins` only when the project needs them. Do not add Controllers, Reducers, Use Cases, or Repositories to simple pages just to match this structure.

### 2.1 Top-level directory responsibilities

| Directory | Rules |
| --- | --- |
| `app/` | Only Expo Router route entry points, route-group `_layout` files, and minimal glue code; no full-page JSX, business state, static business data, or large style blocks. |
| `features/` | Organized around stable product features or user flows; feature names describe a business domain, not just where a page appears visually. |
| `shared/` | Only code with established, stable reuse across features, or code the project explicitly designates as infrastructure or part of its design system; not a holding area for code with no clear home. |
| `assets/` | Local images, SVGs, fonts, and other static assets; file names must describe their purpose. |
| `types/` | App-wide environment declarations, resource module declarations, and genuinely cross-layer public types. |
| `plugins/` | Expo config plugins or build-time extensions; no runtime business logic. |
| `test/` | Cross-feature test utilities, fixture builders, and test-environment helpers. |
| `docs/agents/` | Project-level rules, component catalogs, and approved architectural exceptions. |

### 2.2 Feature subdirectory responsibilities

| Directory | What belongs here | Constraints |
| --- | --- | --- |
| `pages/` | Page-level components that compose sections, call page Controller hooks, and pass state and actions. | Use `PascalCase` file names by default; do not leave complex state machines, large numbers of handlers, low-level visual details, or extensive hardcoded data here long-term. |
| `ui/` | Presentation components and structural blocks for the current feature, such as cards, list items, form sections, complex decorations, and SVG groups. | May reflect the feature's semantics, but must not call APIs directly, read or write authentication data or storage, or make routing decisions. |
| `hooks/` | React bindings, local UI state, page/flow Controllers, lifecycle handling, and side-effect integration. | Do not reimplement underlying clients, bury independently testable business rules in React hooks, or create chains of pass-through handlers. |
| `model/` | Pure state models, Reducers, selectors, validation, state transitions, and business invariants. | Do not import React, Expo Router, API clients, or mutable global state; Reducers and selectors must remain pure functions. |
| `use-cases/` | Multistep business operations named after user intent, such as submitting a profile, publishing a post, or switching accounts. | Use TypeScript functions without React dependencies by default; no UI, toast, or navigation operations; do not create a Use Case just to forward a single API call. |
| `events/` | Typed event names, payloads, and Provider-scoped entry points. | Only for lightweight notifications; not a business source of truth, persistent cache, or replacement for direct call chains. |
| `data/` | Static presentation data, local prototype data, option configuration, and minimal offline fallbacks. | No requests, side effects, or long-lived authoritative business data. |
| `constants/` | Stable feature-private constants, enum mappings, and constants with design meaning. | Prefer values from project tokens; do not duplicate them in features. |
| `api/` | Feature-specific endpoint adapters, DTO transformations, runtime validation, and API methods with clear business meaning. | General request handling, authentication refresh, error envelopes, and other infrastructure belong in `shared`; no page state or navigation. |
| `context/` | Providers scoped to the current feature or an explicit route boundary. | Do not use as an unbounded global store or for large objects that change frequently. |
| `types/` | Feature-specific UI models, Use Case inputs/results, event payloads, and domain types. | Expose backend contracts through approved public packages; do not reference backend-internal files directly. |
| `utils/` | Feature-specific pure functions. | No React hooks, routing, APIs, or mutable global state. |

### 2.3 Shared subdirectory responsibilities

- `shared/ui`: Project-level UI primitives and stable, business-neutral UI patterns. Documentation may distinguish `primitive` from `pattern`, but additional directories are not mandatory.
- `shared/hooks`: Generic React behavior without business-specific names, such as controlled disclosure or a stable keyboard adapter; hooks for business flows do not belong here.
- `shared/events`: Typed event infrastructure without business semantics.
- `shared/api`: Request clients, error handling, and cross-feature transport infrastructure.
- `shared/auth`: Centralized authentication; pages must not manipulate tokens directly.
- `shared/constants`: Stable cross-feature constants and project-level token entry points.
- `shared/types`: Genuinely cross-feature types.
- `shared/utils`: Pure utilities without side effects.

Every public module in `shared` should have a clear purpose, consumers, and API boundary. “We may use it later” or “two pages look similar” is not sufficient reason to move code into `shared`.

### 2.4 Dependency direction

```text
app
└── feature pages
    ├── feature ui ───────────────> shared/ui
    └── feature hooks/controllers
        ├── feature use-cases ────> feature model / feature api / shared
        ├── feature model ────────> feature types / pure shared utilities
        └── feature api ──────────> shared/api
```

The following rules are mandatory:

- `shared` must not import `features`.
- UI components do not depend directly on routing, API clients, authentication, storage, Use Cases, or business stores.
- Pages compose UI and Controllers; do not scatter multistep API orchestration throughout a page.
- Controller hooks may use React lifecycle and navigation; Use Cases and Models must not access React, React Native UI, or Expo Router.
- `model`, `data`, `constants`, `types`, and pure `utils` do not depend on higher-level pages, UI, Controllers, or APIs.
- `api` must not depend on Page/UI; transform DTOs into domain or UI models at explicit boundaries, not separately on multiple pages.
- A feature must not import another feature's pages, private hooks, private UI, or private data. When cross-feature use is necessary, use an approved public entry point or move business-neutral functionality into `shared`.
- Shared code across workspaces must use public package `exports`; do not import internal paths directly.
- Do not use an EventBus, Context, or module singleton to bypass the defined dependency direction.
- Do not use `shared` as a catch-all to avoid making architectural decisions.

### 2.5 File naming

- Components and pages: `PascalCase.tsx`
- Page Controller hooks: `useSomethingController.ts`
- Local behavior hooks: `useSomething.ts`
- Use Cases: `verbNoun.ts`, such as `submitProfile.ts` or `publishPost.ts`
- Reducers / state models: `somethingReducer.ts`, `somethingModel.ts`
- Pure utilities: `camelCase.ts`
- Tests: `name.test.ts` or `name.test.tsx`
- Types: use descriptive file names; do not let a generic `types.ts` grow indefinitely.
- Constants: use descriptive file names; do not let a generic `constants.ts` grow indefinitely.
- Route files: follow Expo Router and the project's existing lowercase path rules.

Avoid vague names such as `helpers.ts`, `manager.ts`, `common.ts`, and `service.ts`. If the code genuinely serves as a Service, Manager, or Facade, its name must identify what it manages or the boundary it represents, as in `AuthSessionCoordinator`. Document that responsibility in the project rules.

Each file should have one primary responsibility. Decide whether to split it based on how the code is read, why it changes, and where it is tested—not simply on line count. Do not create pass-through files just to add layers.

### 2.6 Where to put new files

1. Only an Expo Router entry point: place in `app/`.
2. Serves only one feature: place in that feature's most specific directory.
3. Handles React lifecycle or provides a page-action entry point: place in `hooks/`, naming it a Controller when complex.
4. Implements a multistep user intent independently of React: place in `use-cases/` when its complexity warrants it.
5. A pure state transition, rule, or selector: place in `model/` or `utils/`.
6. Has established, stable reuse across features, or is explicitly designated by the project as a base primitive, and has no business semantics: consider `shared/`.
7. An asset, declaration, build plugin, or test infrastructure: place in the corresponding top-level directory.
8. Still unclear: keep it within the narrowest feature scope and record your assumption; do not create a custom top-level directory.

Do not change the top-level `mobile/` structure or establish a parallel architecture without explicit project approval.

---
