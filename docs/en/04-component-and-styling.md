# 04 Components, Hooks, and Styling

> This document defines shared code standards for pages, UI components, Shared components, Hooks, and styles. Concrete Design Tokens and styling technology belong in project-specific rules.

## Component responsibilities

### Page

A Page:

- Composes screen structure and sections
- Calls the screen or flow Hook
- Passes state and callbacks into UI components
- Expresses screen-level loading / error / empty / content branches

A Page should not permanently own:

- Large amounts of input state and handlers
- Complex API orchestration
- Low-level SVG, gradient, and decoration details
- Complete JSX for many unrelated sections
- Large hard-coded datasets

### Feature UI

Feature UI handles presentation and user input within the current feature. It may use feature-semantic names, but receives state and callbacks through props.

Feature UI does not handle by default:

- Navigation decisions
- API requests
- Auth or storage access
- Cross-screen business facts
- Side effects tightly coupled to screen lifecycle

### Shared UI

A component enters `shared/ui` only when at least one condition is true:

- It is already reused consistently by two or more features
- It is inherently an App-wide base UI pattern

Shared UI must:

- Use neutral UI semantics
- Not depend on `features/*`
- Not read routes, APIs, Auth, or business stores directly
- Not contain concrete business copy or a screen state machine
- Provide accessibility and test entry points for key interactions

If adapting a component across screens continually adds special cases, business booleans, and styling escape hatches, split it or move it back to a feature instead of expanding the shared abstraction.

## One primary responsibility per component

- Each UI component file defines one public component by default.
- A short stateless render helper used only in that file may remain, but must not become a hidden component system.
- Split pages, sections, and complex controls by responsibility rather than arbitrary visual fragments.
- A split must improve the reading path, change boundary, or test boundary. Merely moving JSX into another file is not a meaningful split.

Signals that a file needs splitting:

- Header, form, preview, status message, and action area coexist in one file
- Many conditional renders, switches, or platform branches
- Complex SVG / gradient / mask mixed with business structure
- Handlers, effects, and JSX are interleaved and responsibilities are hard to locate
- One change frequently affects multiple unrelated areas in the file

## Duplication and sharing

When the same or highly similar implementation appears twice or more, evaluate:

1. It serves one feature: extract into that feature's UI, Hook, constants, or utils.
2. It is stably reused across features: extract into shared.
3. It looks similar but carries different business state: keep it separate and share a lower-level primitive or Token.
4. The requirement is unstable: do not abstract yet; record the trigger for reconsideration.

After extracting a shared implementation, remove the obsolete duplicates so one pattern does not retain multiple sources of truth.

## Props design

Shared and reusable Feature UI props should prefer names such as:

- `label`
- `value`
- `selected`
- `disabled`
- `loading`
- `variant`
- `size`
- `tone`
- `layout`
- `onPress`
- `onChange`
- `onChangeText`
- `onClose`

Required rules:

- Callbacks use consistent `onXxx` naming.
- Business selection, input values, and flow state are externally controlled by default.
- Use a finite enum for stable visual variants instead of accumulating `isPrimary`, `isLarge`, and similar booleans.
- An optional prop has clear default behavior.
- Only inputs required for the component to work are mandatory.
- Shared components expose only the minimum necessary style extension and do not expose unrestricted internal style slots.
- Do not encode feature names, flow steps, or business enums in Shared props.

## Separate presentation and logic

- UI files handle presentation, local visual state, and callback dispatch.
- A Page or flow Hook handles effects, state orchestration, navigation intent, and business branches.
- API query / mutation belongs behind a dedicated Hook or service boundary.
- A UI component must not assemble requests, save tokens, or choose the next route directly.
- Static data, constants, and types do not depend back on React pages or Hooks.

## Hook structure

Keep this stable reading order inside a Hook:

1. Context and external Hooks
2. `useState` / `useRef`
3. Derived variables and memoized values
4. Methods / handlers
5. Effects
6. Return value

Group related variables and leave clear separation between state and methods. Do not mix all state, callbacks, and effects together.

A Hook should:

- Use a semantic name such as `useProfileForm` or `usePickerSheet`
- Expose only the state and actions the screen actually needs
- Avoid returning unstable large objects or internal implementation details
- Clean up timers, subscriptions, animations, and asynchronous races
- Move pure computations into `utils`

## Style files

Default rules:

- Component styles live in adjacent `ComponentName.styles.ts`.
- Native React Native styles prefer `StyleSheet.create`.
- If project-specific rules choose another styling system, use it consistently across the project and do not mix a second system locally.
- JSX keeps only the smallest dynamic style that truly depends on runtime state.
- Split a large styles file by component or visual responsibility, not an arbitrary line count.

## Design Tokens

This shared package defines no Token names or values. Each App must identify the code source of truth for Tokens in its project-specific rules.

During implementation:

- Prefer the current App's existing color, typography, spacing, radius, shadow, and motion Tokens.
- Do not leave design values repeated across one or more files as literals indefinitely.
- Do not copy a Token from another App merely because that App uses it.
- When a Figma value is close to but not exactly an existing Token, first decide whether the design should bind to that Token, then report any deviation.
- Adding or changing a global Token is a design-system change and requires explicit approval within task scope.

A screen may retain a genuinely one-off local dimension, but its name and purpose must be clear.

## Typography

Evaluate text styles from Figma and project font configuration in full:

- `fontFamily`
- `fontSize`
- `fontWeight` or the corresponding concrete font family
- `lineHeight`
- `letterSpacing`
- Text language and glyph fallback

Do not mechanically copy a font name shown in Figma Dev Mode. Design tools may fall back because glyphs are missing; confirm the fonts actually loaded by the App and their target-language coverage.

Whether mixed-language text, emphasized numbers, and units use nested `Text` depends on the design result, readability, and font coverage.

## Lists and repeated structures

- Render repeated cards, menus, options, and rows from data.
- Choose `FlatList`, `SectionList`, or a simple `map` based on data volume, virtualization needs, and nesting.
- Sibling items follow consistent height, padding, divider, and spacing rules.
- Visual differences for first, last, or selected items are explicit.
- Data that may paginate or change dynamically starts with stable keys and a clear list boundary.
- Do not use an array index, display copy, or temporary timestamp as a long-term stable ID.

## Imports and public entry points

- Prefer project-configured path aliases over deep `../../` paths.
- A workspace imports only external packages declared in its own package file.
- Consumers must not bypass public `exports` by deep-importing package-private files.
- Follow the project's TypeScript convention for type-only imports and avoid unnecessary runtime code.

## Reviewability

A delivered component should let a reviewer quickly answer:

- Where is state maintained?
- Which callback receives a user action?
- Where are API and navigation intents handled?
- Where do design values come from?
- Where are iOS / Android differences handled?
- Which parts are shared, and why are they eligible?

If answering requires reading one very long file end to end, the component boundary still needs improvement.
