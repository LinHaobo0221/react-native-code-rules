# 6. Interaction, keyboards, modals, platforms, and accessibility

### 6.1 Controls must work

Controls that appear interactive must provide feedback consistent with the task scope:

- Inputs accept text and can gain and lose focus.
- Buttons / Pressables provide feedback when pressed.
- Tabs / segments allow the selection to change.
- Checkboxes / radio buttons / switches can change state.
- Modals / sheets can open and close.
- Disabled / loading states prevent repeated actions and are visually clear.
- Users can perceive when list items are selected, highlighted, or expanded.

### 6.2 Native semantics

By default, use semantically appropriate React Native components or project-approved wrappers:

- Text input: `TextInput`
- Tap actions: `Pressable`
- Images: the project's chosen image component
- Long lists: `FlatList` / `SectionList`
- Scrolling short content: `ScrollView`
- Text: `Text`

Do not disguise ordinary `Text` or static `View` elements as interactive controls.

### 6.3 State ownership

- Components may own transient visual state, such as internal values for press animations.
- Input values, selected items, switch states, and flow steps are controlled by page hooks by default.
- UI communicates with its consumers through props and callbacks.
- Lightweight cross-page notifications use project-approved scoped events or state mechanisms.
- An EventBus sends notifications only; it does not store authoritative business data, API responses, or persistent state.
- State that must survive authentication changes, app lifecycles, or offline recovery requires an explicit data and storage design; do not patch it together with module singletons.

### 6.4 Inputs and forms

Evaluate the following for every input control:

- Whether the input is controlled, using `value` / `defaultValue`
- Placeholder
- Focus / blur
- Disabled / readonly
- Error and help text
- Keyboard type
- Return-key behavior
- Autofill and content type
- iOS / Android properties
- Accessibility label

Do not implement password, email, verification-code, numeric, or search inputs using only iOS properties. You must also check the Android and cross-platform properties.

Form submission must:

- Prevent repeated triggers while loading
- Make it clear which input or operation each error belongs to
- Not orchestrate APIs, tokens, or navigation in presentation components
- Keep the current input and primary action visible when the keyboard appears

### 6.5 Keeping content clear of the keyboard

Before implementing UI with `TextInput`, a composer, chat or comment input, bottom input bar, or long form, you must inspect the project's keyboard infrastructure.

- Keep headers and fixed navigation outside the input scrolling area.
- Use the shared keyboard-aware scrolling container for long forms.
- Use the shared sticky footer or keyboard controller for fixed bottom composers.
- Include the composer's actual height and a safe margin in the list's bottom padding.
- Configure appropriate keyboard dismissal and tap handling on scrolling containers with inputs.
- Do not work around obscured content with an arbitrarily large `marginBottom`, a simulated keyboard height, or absolute positioning.
- Do not combine multiple keyboard-handling systems in the same input area.
- Do not register duplicate `keyboardDidShow` / `keyboardDidHide` listeners on every page.

For UI that starts as a single-line entry point and expands into a full editor on focus:

- Use a `Pressable` with display text for the initial entry point.
- Render the real multiline `TextInput` only after expansion.
- The wrapper only switches state; keep the collapsed and expanded components' responsibilities separate.
- Distinguish “requesting focus” from “already focused” to avoid focus loops.

At a minimum, verify keyboard opening and interactive dismissal on iOS, keyboard behavior and system-back dismissal on Android, gesture and three-button navigation, focus cleanup when leaving the page, and layout restoration after the keyboard closes.

### 6.6 Modals, sheets, and dialogs

Before implementation, identify the type:

1. Route-level full-screen modal
2. In-page bottom sheet / picker
3. Lightweight dialog / alert / toast

Route-level modal:

- Used for multistep flows, independent history, or flows covering Tabs.
- Navigate to the next step within the modal using its internal Stack.
- The close button exits the entire modal flow.
- Handle StatusBar, top safe area, and system back correctly.

Bottom sheet / picker:

- Keep the backdrop's responsibilities separate from the sheet content's.
- Whether tapping the backdrop closes it is determined by the design.
- The sheet content prevents events from passing through to elements behind it.
- When content is too tall, its internal list scrolls independently.
- Execute `scrollToIndex` only immediately after opening or on an explicit reset.
- Opening, closing, and backdrop animations use the project's shared motion definitions as their source of truth.

Lightweight feedback:

- Do not turn short confirmations or notifications into complex route flows.
- Do not use a toast for high-risk operations that require explicit user confirmation.
- Pages must not independently hardcode different animation durations or easing.

### 6.7 Safe areas, system UI, and cross-platform behavior

- Handle top, bottom, left, and right insets according to the navigation shell.
- Verify modals, immersive pages, and edge-to-edge layouts separately on iOS / Android.
- Do not fix layouts with artificial blank space, fake status bars, or fake home indicators.
- Do not allow headers, inputs, or primary actions into the system status-bar area without justification.
- Choose Android system-bar backgrounds and light or dark icons that remain readable together.
- All implementations cover iOS and Android by default unless the task explicitly restricts scope to one platform.

Evaluate differences in:

- Shadows and elevation
- StatusBar and system navigation bars
- Safe areas and edge-to-edge
- Keyboards, autofill, and back buttons
- Permissions and system pickers
- Modal presentation
- Back gestures
- Files, images, and sharing
- Font rendering and text truncation
- Haptics, animation, and reduced motion

Keep platform-specific branches to a minimum and explain why a single implementation will not work. Web is only a debugging aid; when web and native behavior differ, use iOS / Android as the reference.

### 6.8 Scrolling and fixed areas

Before implementing a Figma page, you should identify:

- Whether the header is fixed
- Whether the middle content scrolls
- Whether the footer / CTA is fixed
- Boundaries between lists, forms, and the keyboard
- Whether content remains accessible on small screens, with dynamic type, and with long copy

When an action area is fixed to the bottom, the scrollable content must reserve enough bottom space for it. Do not pin a button to the bottom if it should follow the content.

Do not wrap a virtualized list in a `ScrollView` that scrolls in the same direction unless the project already has a verified approach for that case.

### 6.9 Accessibility

Key interactive elements should provide:

- Correct `accessibilityRole`
- Clear `accessibilityLabel`
- Necessary `accessibilityHint`
- States such as selected / checked / disabled / expanded
- Stable `testID` only for key automation entry points

You must also ensure:

- Small controls meet touch-target standards through their hit areas or `hitSlop`.
- Reading order matches visual order.
- Important states do not rely only on color; also use symbols, copy, or structural cues.
- Primary content and actions remain accessible after text scaling.
- Buttons, inputs, and error text have sufficient contrast.
- Animations follow the reduced-motion policy.

### 6.10 Async states

Pages that use real data should clearly distinguish:

- Initial loading
- Refreshing
- Pagination loading
- Empty
- Recoverable error
- Terminal error
- Stale content with refresh failure

The UI must not show the same blank page for every failure. Use minimal local data for static prototypes, with a structure as close as practical to the future API's semantics; do not build an unnecessary mock system.

---
