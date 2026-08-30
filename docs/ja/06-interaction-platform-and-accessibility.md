# 06 インタラクション、プラットフォーム、アクセシビリティ

> 本文書は React Native 画面におけるインタラクション、キーボード、Modal、safe area、iOS / Android、アクセシビリティの共通品質最低基準を定義します。

## 操作は実際に機能すること

操作できるように見える control は、タスク範囲に対応した feedback を提供します。

- input は入力、focus、blur ができる
- Button / Pressable に press feedback がある
- Tab / Segment で選択状態を切り替えられる
- Checkbox / Radio / Switch で状態を変更できる
- Modal / Sheet を開閉できる
- disabled / loading 状態は重複 action を防ぎ、明確な視覚状態を持つ
- list item の選択、highlight、展開状態を認識できる

静的デザイン実装では local state で操作を示せますが、付随して実 network、永続化、業務ルールを追加しません。

## 正しい native semantics を使う

意味に適した React Native component またはプロジェクトで承認された基礎 wrapper を使います。

- テキスト入力：`TextInput`
- click action：`Pressable`
- 画像：プロジェクトが選択した Image 実装
- 長いリスト：`FlatList` / `SectionList`
- 短い scroll content：`ScrollView`
- テキスト：`Text`

プロジェクトに統一 Button、Input、Switch、Image、StatusBar、Sheet component がある場合、業務画面はそれを優先して再利用し、並行する別 version を作りません。

通常の `Text` や静的 `View` を interactive control に見せかけません。

## 操作状態の owner

- 内部 press animation 値など、一時的な視覚状態は component 内で管理できます。
- input value、selected item、switch state、flow step は原則として画面 Hook が管理します。
- UI component は props と callback で外部と通信します。
- 画面をまたぐ軽量通知は、プロジェクトで承認された scoped event または state mechanism を使います。
- EventBus は通知だけを送り、業務事実、API response、永続 state を保存しません。
- Auth、App lifecycle、offline restore をまたぐ state には明確な data / storage design が必要であり、module singleton で仮組みしません。

## 入力とフォーム

各 input について次を評価します。

- `value` / `defaultValue` の controlled 方針
- placeholder
- focus / blur
- disabled / readonly
- error と helper text
- keyboard type
- return key behavior
- autofill と content type
- 対応する iOS / Android property
- accessibility label

password、email、verification code、number、search input を iOS property だけで実装せず、Android と共通 property も確認します。

フォーム送信は次を満たします。

- loading 中の重複 trigger を防ぐ
- error の owner を明確に保つ
- API、token、navigation 編成を表示コンポーネントの外へ置く
- keyboard 表示中も現在の input と主要 action を隠さない

## キーボード回避

`TextInput`、composer、chat field、comment field、bottom input bar、長い form を含む場合、最初に現在のプロジェクトの keyboard infrastructure と固有規約を確認します。

一般原則：

- Header と固定 navigation を入力 scroll 領域の外に置く。
- 長い form はプロジェクト統一の keyboard-aware scroll container を使う。
- 固定 bottom composer は統一された sticky footer または keyboard controller solution を使う。
- list bottom padding に composer の実 height と safe spacing を含める。
- input scroll container に platform に適した keyboard dismiss と tap behavior を設定する。
- 任意に大きな `marginBottom`、仮想 keyboard height、absolute position の移動で遮蔽を修正しない。
- 同じ input 領域へ複数の keyboard mechanism を重ねない。
- 各画面で `keyboardDidShow` / `keyboardDidHide` listener を個別に登録しない。

「既定は 1 行入口、focus 後に完全な editor へ展開する」comment または chat UI：

- collapsed entry は `Pressable` と表示 text を使います。
- expanded state だけが実 multiline `TextInput` を render します。
- wrapper は state transition だけを担当し、collapsed と expanded component の責務を分けます。
- focus loop を避けるため「focus request」と「すでに focus 済み」を区別します。

focus 前後で意味が変わらない通常の single-line form を、無理に 2 つの input component へ分割しません。

最低限確認します。

- iOS keyboard open と interactive dismiss
- Android keyboard open と system back dismiss
- Android gesture navigation と three-button navigation
- 画面退出時の focus と keyboard state cleanup
- keyboard close 後の layout 復元

## Modal、Sheet、Dialog

実装前に分類します。

1. route-level full-screen modal
2. 画面内 bottom sheet / picker
3. 軽量 dialog / alert / toast

種類の異なる実装構造を混在させません。

### Route-level Modal

- multi-step flow、独立した履歴、Tabs を覆う内容に使います。
- modal 内の次 step は内部 Stack を使い、close は modal flow 全体を終了します。
- StatusBar、top safe area、system back を正しく扱います。

### Bottom Sheet / Picker

- overlay と sheet 本体の責務を分けます。
- design に従い overlay tap で閉じ、本体は event propagation を止めます。
- content が画面を超える場合、内部 list を独立 scroll させます。
- 初期 `scrollToIndex` は最初の open または明示 reset 時だけ実行し、selection 変更のたびに戻しません。
- open、close、overlay animation は現在の App の共通 motion fact を使います。

### 軽量 feedback

- 短い確認または message を複雑な route flow にしません。
- Toast に明示確認が必要な high-risk action を載せません。

各画面で異なる animation duration や easing を hard-code しません。

## Safe Area と system UI

- navigation shell に合わせて top、bottom、left、right inset を処理します。
- Modal、immersive screen、edge-to-edge 設定を iOS / Android で個別に確認します。
- 偽の空白、status bar、Home Indicator で layout を修正しません。
- 根拠なく header、input、主要 action を system status bar 領域へ入れません。
- Android system bar の背景と icon 明暗を画面背景に対して読みやすく保ちます。

## iOS と Android

タスクが 1 platform に限定されない限り、すべての実装は両方に対応します。

次の platform 差異を評価します。

- shadow と elevation
- StatusBar と system navigation bar
- safe area と edge-to-edge
- keyboard、autofill、back button
- permission と system picker
- Modal presentation
- back gesture
- file、image、share
- font rendering と text truncation
- haptic、animation、reduce motion

platform branch は最小化し、統一実装が不可能な理由を説明します。

Web は補助的な debug 環境です。native と Web の挙動が競合する場合、iOS / Android を受け入れ基準にします。

## Scroll と固定領域

Figma 画面の実装前に次を明確にします。

- Header が fixed か
- 中間 content が scroll するか
- Footer / CTA が fixed か
- list、form、keyboard の境界
- 小画面、dynamic type、長文でも content と主要 action へ到達できるか

bottom action area が fixed なら scroll content に対応する bottom space を確保します。button が content flow に属するなら bottom へ強制固定しません。

プロジェクトに検証済みの特殊 solution がない限り、layout 設計を回避する目的で同方向 virtualized list を外側 `ScrollView` で包みません。

## アクセシビリティ

主要 interactive element に次を提供します。

- 正しい `accessibilityRole`
- 明確な `accessibilityLabel`
- 必要な `accessibilityHint`
- selected / checked / disabled / expanded state
- 主要 automation 入口だけに stable `testID`

さらに次を保証します。

- 見た目が小さい control は hit area または `hitSlop` でプロジェクトと platform の target-size 基準を満たす。
- 読み上げ順序と視覚順序を一致させる。
- 重要 state を color だけで表さず、symbol、copy、structure cue も使う。
- text scaling 後も主要 content と action に到達できる。
- Button、Input、error text が project design system と対象標準に沿った contrast を持つ。
- motion がプロジェクトの reduce-motion 方針を尊重する。

## 非同期状態

実 data 画面は次を区別します。

- initial loading
- refreshing
- pagination loading
- empty
- recoverable error
- terminal error
- stale content with refresh failure

state の事実源と cache 方針はプロジェクトの data architecture に属しますが、UI はすべての failure を同一の blank screen で表現しません。

静的 prototype では、将来の API semantics に近い shape の最小 local data を使い、不要な mock system を作りません。
