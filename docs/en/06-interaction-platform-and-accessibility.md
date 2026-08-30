# 06 Interaction, Platforms, and Accessibility

> This document defines a shared quality baseline for interaction, keyboard handling, Modal behavior, safe area, iOS / Android, and accessibility in React Native screens.

## Interactions must work

Controls that look interactive must provide feedback appropriate to task scope:

- Inputs accept text, focus, and blur
- Button / Pressable provides press feedback
- Tab / Segment changes selection
- Checkbox / Radio / Switch changes state
- Modal / Sheet opens and closes
- disabled / loading prevents duplicate actions and has a clear visual state
- List-item selection, highlighting, and expansion can be perceived

For a static design implementation, local state may demonstrate interactions. Do not add real networking, persistence, or business rules as a side effect.

## Use correct native semantics

Use semantically appropriate React Native components or the project's approved base wrappers:

- Text input: `TextInput`
- Press action: `Pressable`
- Image: the project's chosen Image implementation
- Long list: `FlatList` / `SectionList`
- Short scrollable content: `ScrollView`
- Text: `Text`

When the project already has unified Button, Input, Switch, Image, StatusBar, or Sheet components, feature screens reuse them instead of creating parallel versions.

Do not disguise a plain `Text` or static `View` as an interactive control.

## Interaction-state ownership

- A component may own transient visual state such as an internal press-animation value.
- A screen Hook controls input values, selected items, switch state, and flow steps by default.
- UI components communicate through props and callbacks.
- Cross-screen lightweight notifications use a project-approved scoped event or state mechanism.
- EventBus sends notifications only; it does not store business facts, API responses, or persistent state.
- State that crosses authentication, App lifecycle, or offline restoration requires an explicit data and storage design; do not assemble it from module singletons.

## Inputs and forms

Evaluate for each input:

- Controlled strategy for `value` / `defaultValue`
- placeholder
- focus / blur
- disabled / readonly
- error and helper text
- Keyboard type
- Return-key behavior
- Autofill and content type
- Corresponding iOS / Android properties
- accessibility label

Password, email, verification-code, number, and search inputs must not implement only iOS properties. Confirm Android and cross-platform attributes as well.

Form submission must:

- Prevent duplicate triggers while loading
- Keep error ownership clear
- Keep API, token, and navigation orchestration out of presentational components
- Keep the current input and primary action visible when the keyboard is open

## Keyboard avoidance

For screens with `TextInput`, composer, chat field, comment field, bottom input bar, or long form, inspect the project's keyboard infrastructure and project-specific rules first.

General principles:

- Keep Header and fixed navigation outside the input scroll area.
- Use the project's unified keyboard-aware scroll container for long forms.
- Use the project's unified sticky-footer or keyboard-controller solution for a fixed bottom composer.
- List bottom padding includes the composer's actual height and safe spacing.
- Input scroll containers set platform-appropriate keyboard dismissal and tap behavior.
- Do not fix obstruction with an arbitrary large `marginBottom`, simulated keyboard height, or absolute-position displacement.
- Do not stack multiple keyboard mechanisms around the same input area.
- Do not register `keyboardDidShow` / `keyboardDidHide` listeners independently on every screen.

For a comment or chat UI that is “one-line entry by default, expanded editor on focus”:

- The collapsed entry uses `Pressable` and display text.
- Only the expanded state renders a real multiline `TextInput`.
- The wrapper manages state transitions; collapsed and expanded components keep separate responsibilities.
- Distinguish “focus requested” from “already focused” to avoid a focus loop.

A normal single-line form does not need two input components when its semantics do not change on focus.

Verify at minimum:

- iOS keyboard open and interactive dismissal
- Android keyboard open and system-back dismissal
- Android gesture navigation and three-button navigation
- Focus and keyboard cleanup when leaving the screen
- Layout restoration after the keyboard closes

## Modal, Sheet, and Dialog

Classify before implementation:

1. Route-level full-screen modal
2. In-screen bottom sheet / picker
3. Lightweight dialog / alert / toast

Do not mix implementation structures across categories.

### Route-level Modal

- Used for multi-step flows, independent history, or content covering Tabs.
- The next step uses an internal Stack; close exits the whole modal flow.
- Handles StatusBar, top safe area, and system back correctly.

### Bottom Sheet / Picker

- Overlay and sheet body have separate responsibilities.
- The overlay may close the sheet when designed to do so; the body blocks event propagation.
- When content may exceed the screen, an internal list scrolls independently.
- Initial `scrollToIndex` runs only when first opened or explicitly reset; it must not pull back repeatedly whenever selection changes.
- Open, close, and overlay animations use the current App's shared motion source of truth.

### Lightweight feedback

- A short confirmation or message does not become a complex route flow.
- Toast does not carry a high-risk action that requires explicit user confirmation.

Do not hard-code different animation durations or easing on each screen.

## Safe Area and system UI

- A screen handles top, bottom, left, and right insets according to its navigation shell.
- Verify Modal, immersive screens, and edge-to-edge configuration separately on iOS and Android.
- Do not use fake whitespace, fake status bars, or fake Home Indicators to repair layout.
- Do not move the header, input, or primary action into the system status-bar area without design justification.
- Android system-bar background and icon brightness remain readable against the screen.

## iOS and Android

Unless a task explicitly targets one platform, every implementation covers both.

Evaluate differences in:

- Shadow and elevation
- StatusBar and system navigation bar
- safe area and edge-to-edge
- Keyboard, autofill, and back button
- Permissions and system pickers
- Modal presentation
- Back gestures
- Files, images, and sharing
- Font rendering and text truncation
- Haptics, animation, and reduce motion

Minimize platform branches and state why a unified implementation is not possible.

Web is an auxiliary debugging environment only. When native and Web behavior conflict, iOS / Android define acceptance.

## Scrolling and fixed regions

Before implementing a Figma screen, establish:

- Whether Header is fixed
- Whether middle content scrolls
- Whether Footer / CTA is fixed
- Boundaries among list, form, and keyboard
- Whether content and primary actions remain reachable on a small screen, with dynamic type, and with long copy

When the bottom action area is fixed, scroll content reserves matching bottom space. If a button belongs in the content flow, do not force it to the bottom.

Do not wrap a same-direction virtualized list in an outer `ScrollView` to avoid layout design, unless the project already has a validated special solution.

## Accessibility

Key interactive elements provide:

- Correct `accessibilityRole`
- Clear `accessibilityLabel`
- `accessibilityHint` where necessary
- selected / checked / disabled / expanded state
- Stable `testID` only for important automation entry points

Also ensure:

- Visually small controls meet project and platform target-size standards through hit area or `hitSlop`.
- Reading order follows visual order.
- Important state is not expressed by color alone; include a symbol, copy, or structural cue.
- Primary content and actions remain reachable under text scaling.
- Button, Input, and error text have adequate contrast according to the project design system and target standard.
- Motion respects the project's reduce-motion strategy.

## Asynchronous states

A real-data screen distinguishes:

- initial loading
- refreshing
- pagination loading
- empty
- recoverable error
- terminal error
- stale content with refresh failure

The state source of truth and cache strategy belong in the project data architecture, but the UI must not render every failure as the same blank screen.

For a static prototype, use minimal local data whose shape approximates the future API semantics; do not create an unnecessary mock system.
