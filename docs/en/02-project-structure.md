# 02 Project and Directory Structure

> This document defines the standard `mobile/` directories, responsibility boundaries, dependency direction, and file-placement rules.

## Standard structure

A React Native / Expo App uses this structure by default:

~~~text
mobile/
├── app/
├── features/
│   └── <feature>/
│       ├── pages/
│       ├── ui/
│       ├── hooks/
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
~~~

Create directories only when needed. Do not commit empty directories merely to make the structure appear complete. `api`, `auth`, `context`, `events`, and `plugins` exist only when the project actually needs them.

## Top-level responsibilities

### `app/`

- Contains only Expo Router entries, route-group `_layout` files, and very thin route bridges.
- Does not contain full-screen JSX, business state, static business data, or large style blocks.
- Route files should re-export screens from `features/<feature>/pages` whenever possible.

### `features/`

- Divided by stable product capability or user flow.
- A feature name expresses a business domain, not a visual position on a screen.
- Each feature owns its pages, private components, Hooks, data, and events.
- A feature must not read another feature's pages or internal state directly.

### `shared/`

- Contains capabilities that are already reused consistently across features and do not carry one screen's business meaning.
- Shared code must not depend on `features/*`.
- Do not move private feature implementations into shared merely because they might be reused in the future.

### `assets/`

- Contains local images, SVGs, fonts, and other static resources.
- The project rules decide asset categories, but file names must describe their purpose.

### `types/`

- Contains App-wide environment declarations, resource module declarations, and types that are truly shared across layers.
- Feature-specific types remain inside the corresponding feature.

### `plugins/`

- Contains Expo config plugins or build-time extensions.
- Does not contain runtime business logic.

### `test/`

- Contains cross-feature test utilities, fixture builders, and test-environment helpers.
- Unit tests for a screen or module should remain next to the tested file.

## Feature subdirectory responsibilities

### `pages/`

- Screen-level components, using `PascalCase` file names by default.
- A page composes sections and UI components and passes Hook results.
- A page must not permanently own complex state machines, many handlers, or low-level visual details.
- Pages re-exported by Expo Router use the project's stable export convention; if no convention exists, use `default export`.

### `ui/`

- Presentational components and structural sections used only by the current feature.
- May use feature-specific semantic names, but receives state and callbacks through props.
- Does not directly make API requests or navigation decisions.
- Complex decoration, SVG groups, form sections, cards, and list items belong here.

### `hooks/`

- Contains local feature state, derived state, handlers, effects, and flow orchestration.
- UI wrappers for API mutation/query state may live here, but the low-level client must not be reimplemented.

### `events/`

- Contains feature-local typed event names, payloads, and Provider-scoped entry points.
- Events are only for lightweight notification; they are not a source of business truth or persistent cache.

### `data/`

- Contains static display data, local prototype data, option configuration, and minimal offline fallback data.
- Does not contain requests, side effects, or long-lived business facts.

### `constants/`

- Contains stable feature-private constants, enum mappings, and design-semantic constants.
- Concrete Token values should come from project Design Tokens instead of being copied into a feature.

### `api/`

- Contains feature-specific endpoint adapters, DTO conversion, or semantic API methods.
- Shared request, Auth refresh, and error-envelope infrastructure belongs in shared.

### `context/`

- Contains Providers scoped to the feature or an explicit route boundary.
- Context is not an unbounded global store and must not carry large, frequently changing objects that rerender the entire subtree.

### `types/`

- Contains feature-specific UI models, event payloads, and domain types.
- Backend-shared contracts must be exposed through a project-approved cross-workspace package; do not import backend internal files directly.

### `utils/`

- Contains feature-specific pure functions.
- Does not access React Hooks, navigation, or mutable global state.

## Shared subdirectory responsibilities

- `shared/ui`: base UI patterns reused across features.
- `shared/hooks`: cross-feature Hooks without concrete business names.
- `shared/events`: typed event-bus infrastructure without business semantics.
- `shared/api`: request client, error handling, and cross-feature transport infrastructure.
- `shared/auth`: used only when the project has unified Auth; screens must not manipulate tokens directly.
- `shared/constants`: stable cross-feature constants and the project Design Token entry point.
- `shared/types`: types that are genuinely shared across features.
- `shared/utils`: side-effect-free utilities.

## Dependency direction

The default dependency direction is:

~~~text
app -> feature pages -> feature ui/hooks -> shared
~~~

Required rules:

- `shared` must not import `features`.
- A feature must not import another feature's pages, private Hooks, or private data.
- `data`, `constants`, `types`, and pure `utils` must not depend back on pages or UI.
- UI components must not depend directly on navigation, API clients, Auth, or business stores.
- Cross-workspace code must use the provider package's public `exports` and must not import internal paths.

If two features need the same capability, first decide whether the abstraction is already stable and business-neutral before moving it into shared. Do not treat shared as a miscellaneous directory that avoids architecture decisions.

## Naming and file rules

- Components and pages: `PascalCase.tsx`
- Component styles: `ComponentName.styles.ts`
- Hooks: `useSomething.ts`
- Pure utilities: `camelCase.ts`
- Tests: `name.test.ts` or `name.test.tsx`
- Types: use semantic file names; do not let a generic `types.ts` grow indefinitely
- Constants: use semantic file names; do not let a generic `constants.ts` grow indefinitely
- Route files follow Expo Router and the current project's lowercase path convention

Each file has one primary responsibility. Split a file based on its reading path, reasons to change, and test boundaries—not a mechanical line count alone.

## File-placement decision order

Before adding code, decide in this order:

1. Is it only an Expo Router entry? Place it in `app/`.
2. Does it serve only one feature? Place it in the most specific directory within that feature.
3. Is it already stably reused by multiple features without business semantics? Consider shared.
4. Is it an asset, declaration, build plugin, or test infrastructure? Use the corresponding top-level directory.
5. If still uncertain, do not add a custom top-level directory. Start with the smallest feature boundary and record the assumption.

Do not change the `mobile/` top-level structure or introduce a parallel architecture without explicit project approval.
