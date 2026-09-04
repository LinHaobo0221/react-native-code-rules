# 4. Rules for Pages, UI, reuse, Controllers, and styling

### 4.1 Page responsibilities

A Page is responsible for:

- Composing page structure and sections
- Calling a page or flow Controller hook
- Passing state and actions that express user intent to UI components
- Rendering page-level loading, error, empty, and content states
- Connecting the state and actions exposed by the Controller; the Page itself does not interpret low-level Use Case results

Recommended page structure:

```ts
const { state, actions } = useProfileEditorController();

return (
  <ProfileEditorView
    value={state.form}
    status={state.status}
    onChange={actions.changeField}
    onSubmit={actions.submit}
  />
);
```

A Page should not handle these responsibilities long-term:

- Large amounts of input state and handlers that call one another
- Complex API, cache, and storage orchestration
- Low-level SVG, gradient, and decorative details
- Full JSX for multiple unrelated sections
- Large amounts of hardcoded data

A simple page with local behavior and no need for reuse may use a few `useState` calls and one clear handler directly. Do not require a Controller or Use Case just for the sake of structure.

### 4.2 Feature UI responsibilities

Feature UI handles presentation and user input within the current feature, receiving state and callbacks through props.

By default, it is not responsible for:

- Navigation decisions
- API requests
- Authentication or storage access
- Authoritative business data shared across pages
- Side effects tightly coupled to the page lifecycle
- Calling Use Cases or taking over orchestration of multiple business actions

UI callbacks express user intent, such as `onSubmit`, `onRetry`, or `onSelectPlan`, rather than exposing low-level implementation details such as `onCallUpdateEndpoint`.

### 4.3 When UI belongs in shared code

A component must meet at least one of these conditions before moving to `shared/ui`:

- Two or more features have established, stable use of it with the same semantics and interaction contract; or
- The project explicitly designates it as an app-wide UI primitive / design-system pattern.

It should also meet all of the following:

- A neutral UI name describes it without referring to a feature.
- Consumers share requirements for state, accessibility, platform differences, and error behavior.
- Its consumers are expected to need changes for the same reason; similar JSX today is not enough.
- It does not depend on `features/*`, routes, APIs, authentication, storage, or business stores.
- It contains no specific business copy, page state machine, or consumer-specific cases.
- It supports accessibility and testing for key interactions.

The following do not establish that a component belongs in `shared`:

- Both code blocks use rounded white cards.
- Two Figma frames currently look identical.
- Code has been copied twice, but future changes will differ.
- Sharing requires continually adding `isProfilePage`, `isCompactHome`, or `hideXxx`.

Primitives that clearly belong to the project's design system, such as Button, Text, Surface, and IconButton, may go into `shared` as soon as they have a first consumer. Project rules must explicitly identify them as design-system components.

### 4.4 Reuse review before adding code

Before adding or rewriting a component, hook, utility, or Use Case, complete this minimum reuse review:

1. Search the current feature by semantic name, user intent, main JSX structure, and key styles.
2. Search `shared/ui`, `shared/hooks`, `shared/utils`, tokens, and public exports.
3. Inspect candidates' props, state, accessibility, platform behavior, and direct consumers—not only file names.
4. Choose “reuse directly,” “extend,” “extract lower-level functionality,” or “keep separate,” and record the reason.
5. Extend an existing shared component only when the extended API remains natural for all consumers.

Before implementation, include at least:

```text
Reuse candidates: existing Button, SettingsRow, useDisclosure
Decision: reuse Button; SettingsRow has different semantics, so keep it feature-local;
          extract a shared RowSurface primitive instead of merging two business components.
```

If you find no reuse candidates, state: “Searched; no existing implementation matches the required semantics.” Do not add a similar component without searching existing code.

### 4.5 Classifying duplicate code

Classify duplication before choosing an abstraction:

| Duplication type | Preferred location | Explanation |
| --- | --- | --- |
| Design values such as colors, spacing, corner radii, and typography | Design token | Keep one visual source of truth; do not create business components just to eliminate repeated values. |
| Same visual structure and interaction semantics | Feature UI or shared UI | Keep feature-local first; promote when the contract stabilizes. |
| Same behavior, different visual structure | Headless Hook / Controller helper | Reuse state and behavior without forcing identical UI. |
| Same business rules, validation, or transformation | `model/` or pure `utils/` | Must have no React dependencies or side effects. |
| Same multistep business operation | `use-cases/` | Share the operation that fulfills user intent and its invariants, not page-level feedback. |
| Same third-party, platform, or DTO differences | Adapter | Isolate external differences. |
| Similar appearance today, but different state and expected future changes | Keep separate | Lower-level primitives or tokens may be reused. |

The key question is not “does the code look the same?” but:

> When requirements change, should these implementations change together for the same reason?

When the answer is unclear, prefer keeping the code within the feature and extracting only the smallest lower-level parts whose stability is clear.

### 4.6 Abstraction levels and appropriate reuse

Look for the lowest stable abstraction in this order:

1. **Token**: colors, spacing, corner radii, typography, motion.
2. **Primitive**: Text, Button, Surface, Divider, IconButton, Field shells.
3. **Behavior**: pure functions, selectors, validation, Headless Hooks.
4. **Feature Pattern**: rows, cards, sections, and form blocks serving only one feature.
5. **Shared Pattern**: cross-feature, semantically neutral compositions with stable contracts.
6. **Page / Flow**: not shared by default; composes shared functionality only.

Use the heuristic “evaluate on the second occurrence; usually extract on the third stable use”:

- First occurrence: prioritize a clear feature-local implementation.
- Second occurrence: compare semantics, reasons to change, and state contracts; extract only lower-level parts if appropriate.
- Third stable occurrence: if the implementations still change for the same reasons, usually extract shared code and migrate the existing implementations to it.

Do not apply this rule by counting occurrences alone. Security invariants, project-level primitives, and established design-system patterns may be extracted earlier. Even identical code should stay separate when its two consumers are expected to change in different ways.

### 4.7 Moving components into and out of shared code

When promoting a component from a feature to `shared`, you must:

- Identify existing consumers and expected new consumers.
- Define minimal props, default behavior, state contracts, accessibility, and platform differences.
- Update all direct consumers and remove the old duplicate versions.
- Add tests or component examples for stable variants and key interactions.
- Record the public entry point in the project component catalog or `app-specific.md`.

You should split the component, move it back into a feature, or extract lower-level primitives again when:

- Shared component props contain page names, routes, feature enums, or several consumer-specific booleans.
- Internal branching depends on the calling page.
- Consumers pass extensive styles for internal elements, render overrides, or `mode="custom"`.
- Changing one consumer frequently raises concern about breaking unrelated consumers.
- The name becomes increasingly abstract while the component takes on increasingly unrelated responsibilities.

Moving code into a shared layer is not a one-way decision. Poor abstractions should be split promptly instead of extended with special cases to preserve a “reuse rate.”

### 4.8 Prefer composition over all-purpose configuration

Choose APIs according to the type of difference:

- Same structure with a closed set of visual differences: use finite enums such as `variant`, `size`, or `tone`.
- Genuine structural differences: use children, slots, or composition of small components instead of continually adding boolean props.
- Same behavior with different visuals: reuse a Headless Hook or pure state model.
- Same visuals with different business state: use controlled presentation components with externally supplied state and callbacks.
- Expose a limited `style` override only when the root layout needs it; do not expose unrestricted style escape hatches for every internal node.

Do not turn a component into an interpreter for an entire page's configuration—for example, an oversized config that controls the header, form, list, footer, routes, and business actions. Configuration-driven rendering is appropriate only for structures with a clearly defined set of fields, consistent semantics, and a need to render repeated items in bulk.

### 4.9 Props rules

Prefer props with these meanings for reusable components:

```ts
label
value
selected
disabled
loading
variant
size
tone
layout
onPress
onChange
onChangeText
onClose
```

Rules:

- Name callbacks consistently with `onXxx`, expressing user intent rather than implementation steps.
- Selection state used by business logic, input values, switch states, and flow steps are externally controlled by default.
- Use finite enums for stable visual branches; do not keep accumulating booleans such as `isPrimary`, `isLarge`, or `isForXxxPage`.
- Every optional prop must have clear default behavior.
- Mark an input as required only when it genuinely determines whether the component can function.
- Shared components expose only the minimum necessary styling options and native accessibility APIs.
- Do not put feature names, flow steps, backend DTOs, or business enums in shared component props.
- Do not put navigation, APIs, toasts, or state machines inside components just to save callers a few lines.

### 4.10 One component, one responsibility

- Each UI file defines only one exported component by default.
- Short, stateless rendering helpers used only by the current file may remain.
- Split pages, sections, and complex controls by responsibility, not arbitrary visual fragments.
- Simply moving JSX or methods into another file is not an effective split.
- The resulting modules must establish clear semantics, change boundaries, or test boundaries.

The following usually signal a need to split:

- One file contains a header, form, preview, status messages, and action area.
- Extensive conditional rendering, switches, or platform branches.
- Complex SVGs, gradients, or masks mixed with business structure.
- Handlers, effects, and JSX interwoven with one another.
- A change for one reason frequently affects multiple unrelated areas.

Stop splitting when:

- The new file only forwards a single function call.
- Reading one action requires jumping among multiple one-line files.
- The split adds imports and names without reducing cognitive load.

### 4.11 When to use design patterns

Use design patterns to clarify state, points of variation, and dependencies—not to add layers. Prefer functions, composition, and types over class inheritance by default.

| Scenario | Recommended pattern | When not to use it |
| --- | --- | --- |
| A little local state, a single synchronous operation | Direct handler / local hook | Do not create a Use Case, Repository, or Factory. |
| One user action involves validation, multiple side effects, cache rules, or concurrency rules | Controller + Use Case | Only a single API call with no business rules. |
| Mutually exclusive states, illegal combinations, transitions depending on prior state | Reducer / explicit state machine | Two independent booleans. |
| The same algorithm changes by mode, permission, or product strategy | Strategy | Only one stable implementation. |
| Isolating iOS/Android, native modules, third-party SDKs, or DTOs | Adapter | Only renaming a function. |
| The same domain data comes from APIs, a cache, and offline storage and needs a consistent policy | Repository | A single endpoint without cache/offline rules. |
| The same behavior needs different UIs | Headless Hook | Both the UI and behavior differ. |

Before introducing a pattern, be able to answer: which conditional branches, duplicate rules, external coupling, illegal states, or testing difficulties does it eliminate? If you cannot answer, keep the implementation simple.

### 4.12 Explicit control flow and call chains

Major user actions follow this traceable path:

```text
UI event
  -> Controller action
      -> optional Use Case
          -> API / storage / cache adapter
      <- typed result
  -> Controller updates UI state / navigation / feedback
```

Rules:

- Each major action has a single orchestration function, such as `submitProfile`, `publishPost`, or `retryLoad`.
- Validation, locks, duplicate prevention, call order, error mapping, and post-success state handling should be readable in sequence within clear boundaries.
- Every function should add at least one of the following: a meaningful name, input transformation, an invariant, branching decisions, a side-effect boundary, error mapping, cancellation/locks, an interchangeable implementation, or necessary instrumentation.
- Remove wrappers that add no value and only call the next function with the same arguments.
- Two or more consecutive forwarding layers with no business meaning are prohibited, such as `handleSave -> submit -> executeSave -> service.save`.
- Controller actions should not use an EventBus to indirectly trigger a flow that can be called directly on the same page.
- Use Cases return typed results; Controllers decide toast, dialog, and navigation behavior.
- Do not split a core flow into several one-line private methods; keep key steps in an orchestration function that can be read sequentially.

Not recommended:

```ts
const handleSave = () => submit();
const submit = () => executeSave();
const executeSave = () => profileService.save(form);
```

Express simple flows directly:

```ts
const save = async () => {
  if (state.status === 'submitting') return;

  const parsed = validateProfile(state.form);
  if (!parsed.ok) {
    dispatch({ type: 'validationFailed', errors: parsed.errors });
    return;
  }

  dispatch({ type: 'submitStarted' });
  const result = await profileApi.update(parsed.value);
  dispatch(mapUpdateResultToEvent(result));
};
```

For a complex flow, express the sequence of business steps in one Use Case instead of adding layers of aliases:

```ts
export async function updateProfile(
  input: UpdateProfileInput,
  deps: UpdateProfileDependencies,
): Promise<UpdateProfileResult> {
  const parsed = validateProfile(input);
  if (!parsed.ok) {
    return { type: 'validation-error', errors: parsed.errors };
  }

  const profile = await deps.profileRepository.update(parsed.value);
  await deps.profileCache.replace(profile);

  return { type: 'success', profile };
}
```

### 4.13 Hook and Controller rules

Organize the code inside a hook in this order:

1. Context, dependencies, and external hooks
2. `useState` / `useReducer` / `useRef`
3. Derived variables and selectors
4. Actions exposed to the page
5. Effects
6. Return value

Hooks should:

- Use `useSomething` for local generic behavior and `useSomethingController` for page or flow orchestration.
- Expose only the state and actions the page genuinely needs, preferably as `{ state, actions }` or another stable, readable structure.
- Have public actions lead directly to the single point of orchestration, without calling handlers that are just aliases.
- Handle React lifecycle, focus, subscriptions, request cancellation, and navigation-result mapping.
- Clean up timers, subscriptions, and animations, and guard against async races during cleanup.
- Move pure calculations, validation, selectors, and state transitions into `model/` or pure `utils/`.
- Move business operations into `use-cases/` when they can be tested independently of React and involve multistep rules.
- Avoid returning dozens of interrelated booleans; use discriminated unions, Reducers, or explicit view models.

Evaluate splitting into Controllers, Use Cases, or Reducers when any of these applies:

- One hook orchestrates two or more independent user flows.
- Multiple async operations have ordering, mutual-exclusion, retry, cancellation, or stale-response rules.
- The same business rule is repeated in effects, handlers, and render branches.
- State combinations can express impossible UI states.
- Core business rules cannot be tested without mounting React components.

### 4.14 Use Case rules

Introduce a Use Case only when fulfilling a user intent requires meaningful business orchestration, such as:

- Calling one or more external dependencies after validation
- Applying rules for permissions, sessions, idempotency, transaction order, or cache consistency
- The same operation being triggered from multiple entry points
- Needing pure TypeScript tests for success, failure, and concurrency branches

Use Cases must:

- Be named with a verb and business object, such as `publishPost` or `deleteAccount`.
- Not import React, React Native UI, Expo Router, toasts, or page components.
- Receive explicit input and return a discriminated union or explicit result type.
- Show key business steps and their order in one place.
- Use dependency injection only for dependencies that actually need to be interchangeable, test isolation, or multiple implementations; do not create empty interfaces for every function.
- Not wrap a one-line API call with no variation points in a class, Factory, or Repository.

### 4.15 Reducer and state machine rules

Prefer a Reducer or explicit state machine when:

- States such as `idle`, `loading`, `success`, and `error` are mutually exclusive.
- Multiple booleans create illegal combinations, such as being both `loading` and `submitted`.
- Transitions depend on the current state and involve retries, cancellation, optimistic updates, or rollback.
- The same event behaves differently in different states.

Rules:

- Prefer TypeScript discriminated unions to express state.
- Reducers perform only pure state transitions; no requests, navigation, or storage reads/writes.
- Controllers or Use Cases execute side effects, then dispatch result events to Reducers.
- Do not require a third-party library just because the design uses a state machine; keep it simple when `useReducer` and explicit transitions suffice.
- Tests cover valid transitions, rejected transitions, and key invariants.

### 4.16 Lists and repeated structures

- Use data-driven rendering for repeated cards, menus, options, and rows.
- Use data-driven rendering only for repeated structures that truly have the same shape; do not force different business semantics into an all-purpose renderer with many `type` branches.
- Choose `FlatList`, `SectionList`, or a simple `map` according to data volume, virtualization needs, and nesting.
- Sibling items must have consistent heights, padding, dividers, and spacing.
- Express visual differences for first, last, and selected items explicitly.
- For data that may later support pagination or dynamic additions and removals, use stable keys and clear list boundaries from the first version.
- Do not use array indexes, display text, or transient timestamps as long-term stable IDs.

### 4.17 Styling, design tokens, and typography

Organize styles for readability:

- A small, private `StyleSheet.create` serving only one component may remain at the bottom of the same file to reduce unnecessary navigation.
- Move styles into an adjacent `ComponentName.styles.ts` when they are extensive, have distinct visual sections or platform branches, are shared by multiple files, or make the component body harder to read.
- Do not split mechanically by line count or put dynamic business logic into style files.
- When the project mandates a styling system, use it throughout; do not introduce a second system locally.
- Keep only minimal styles that genuinely depend on runtime state in JSX.

Token rules:

- Prefer the current app's color, font, spacing, radius, shadow, and motion tokens.
- Repeated design values must not remain scattered as literals.
- Do not copy a token into the current app just because another app uses it.
- If a Figma value is close to but not identical to a code token, first decide whether to use the existing token, then explain the deviation.
- Adding or changing a global token is a design-system change and requires explicit confirmation.
- One-off local dimensions may remain, but their names and purposes must be clear.

For text, confirm at least:

- `fontFamily`
- `fontSize`
- `fontWeight` or a specific font mapping
- `lineHeight`
- `letterSpacing`
- Text language and glyph fallback

Do not copy font names from Figma Dev Mode without checking which fonts the app actually loads and whether they support the target languages.

### 4.18 Imports, public entry points, and discoverability

- Prefer project-configured path aliases; avoid deep `../../` paths.
- Each workspace may import only external packages declared in its own `package.json`.
- Consumers must not bypass public package `exports` through deep paths.
- Feature public entry points export only modules explicitly permitted across boundaries; do not expose all internals through unbounded `export *`.
- Avoid creating a barrel file in every directory; too many barrels hide real dependencies, increase circular references, and make code harder to find and follow.
- Type-only imports follow project TypeScript conventions to avoid unnecessary runtime code.
- Shared components should have descriptive, searchable names, public entry points, and minimal usage examples; do not require a new third-party documentation dependency for this.

### 4.19 Questions a code review must answer

When reviewing a target page or flow, it should be easy to answer:

1. Were existing primitives / patterns searched for and reused for this UI? Why was another similar component not merged?
2. Do consumers of the shared abstraction have the same semantics, state contracts, and reasons to change?
3. Is the abstraction at the lowest stable layer, rather than a one-size-fits-all component?
4. Where is state maintained, and which states are mutually exclusive?
5. Which UI callback starts the user action, and where is its single orchestration function?
6. At which boundaries do API, storage, cache, and navigation operations occur?
7. Are there methods that only forward the same arguments, or chains of handlers that are just aliases?
8. What real problem does the Reducer, Use Case, Strategy, Adapter, or Repository solve?
9. Where do design values come from, and where are cross-platform differences handled?
10. Were all direct consumers checked when this shared component was changed?

---
