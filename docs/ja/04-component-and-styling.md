# 04 コンポーネント、Hook、スタイル

> 本文書は Page、UI コンポーネント、Shared コンポーネント、Hook、スタイルの共通コード基準を定義します。具体的な Design Token と styling technology はプロジェクト固有規約で定義します。

## コンポーネントの責務

### Page

Page の責務：

- 画面構造と section を組み立てる
- 画面または flow の Hook を呼び出す
- 状態と callback を UI コンポーネントへ渡す
- 画面レベルの loading / error / empty / content 分岐を表現する

Page が長期的に持つべきでないもの：

- 大量の入力状態と handler
- 複雑な API 編成
- 低レベルの SVG、gradient、装飾詳細
- 複数の無関係な section の完全な JSX
- 大量の hard-code データ

### Feature UI

Feature UI は現在の feature 内で表示とユーザー入力を担当します。feature の意味を持つ名前を使用できますが、状態と callback は props で受け取ります。

Feature UI が既定で担当しないもの：

- ナビゲーション判断
- API request
- Auth または storage access
- 画面をまたぐ業務事実
- 画面 lifecycle と強く結合した副作用

### Shared UI

コンポーネントは、次のいずれかを満たす場合だけ `shared/ui` に配置します。

- 2 つ以上の feature で安定して再利用されている
- 本質的に App 全体の基礎 UI pattern である

Shared UI の要件：

- 中立的な UI 意味を使う
- `features/*` に依存しない
- route、API、Auth、業務 store を直接参照しない
- 具体的な業務文言や画面 state machine を含まない
- 主要操作に accessibility と test の入口を提供する

複数画面へ適応するために特例、業務 boolean、無制限な style escape hatch が増え続ける場合、shared abstraction を拡大せず、分割するか feature へ戻します。

## 1 コンポーネント 1 主要責務

- 各 UI コンポーネントファイルは、既定で 1 つの public component を定義します。
- 短く stateless で、そのファイルだけが使う render helper は残せますが、隠れたコンポーネント体系にしません。
- Page、section、複雑な control は、任意の視覚断片ではなく責務で分割します。
- 分割によって読み取り経路、変更境界、テスト境界が改善されなければなりません。JSX を別ファイルへ移動しただけでは有効な分割ではありません。

分割が必要な兆候：

- 1 ファイルに header、form、preview、status message、action area が同居する
- 条件 render、switch、platform branch が多い
- 複雑な SVG / gradient / mask と業務構造が混在する
- handler、effect、JSX が交錯して責務をすぐ特定できない
- 1 つの変更理由がファイル内の無関係な複数領域へ頻繁に影響する

## 重複コードと共通化

同一または非常に似た実装が 2 箇所以上に現れたら、次を評価します。

1. 1 つの feature だけで使う：その feature の UI、Hook、constants、utils へ抽出。
2. feature 間で安定して再利用：shared へ抽出。
3. 見た目は似ているが業務状態が異なる：独立を維持し、低レベル primitive または Token を共有。
4. 要件がまだ不安定：抽象化せず、再検討の条件を記録。

共通化後は古い重複実装を削除し、同一 pattern に複数の事実源を残しません。

## Props 設計

Shared および再利用可能な Feature UI の props は、次の名前を優先します。

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

必須ルール：

- callback は統一された `onXxx` 命名を使います。
- 業務選択状態、入力値、flow 状態は原則として外部 control にします。
- 安定した視覚分岐には有限 enum を使い、`isPrimary`、`isLarge` などの boolean を増やし続けません。
- optional prop は明確な既定挙動を持ちます。
- コンポーネント動作に本当に必須な入力だけを required にします。
- Shared コンポーネントは最小限の style 拡張だけを公開し、無制限な内部 style slot を公開しません。
- feature 名、flow step、業務 enum を Shared props に埋め込みません。

## 表示とロジックの分離

- UI ファイルは表示、局所的な視覚状態、callback 発火だけを扱います。
- Page または flow Hook は副作用、状態編成、ナビゲーション意図、業務分岐を扱います。
- API query / mutation は専用 Hook または service 境界に配置します。
- UI コンポーネントから request を組み立て、token を保存し、次の route を直接決定しません。
- 静的 data、constants、types は React Page または Hook へ逆依存しません。

## Hook 構成

Hook 内は次の安定した読み取り順序を維持します。

1. Context と外部 Hook
2. `useState` / `useRef`
3. 派生変数と memoized value
4. method / handler
5. effect
6. 戻り値

関連変数を group 化し、state と method の間に明確な空行を置きます。すべての state、callback、effect を混在させません。

Hook の要件：

- `useProfileForm`、`usePickerSheet` のような意味のある名前を使う
- 画面が本当に必要とする状態と action だけを公開する
- 不安定で大きな object や内部実装詳細を返さない
- timer、subscription、animation、非同期 race を cleanup する
- pure function にできる計算は `utils` へ移す

## スタイルファイル

既定ルール：

- コンポーネントのスタイルは隣接する `ComponentName.styles.ts` に配置します。
- React Native native style は `StyleSheet.create` を優先します。
- プロジェクト固有規約が別の styling system を選択している場合、全体で統一し、局所的に 2 つ目の方式を混在させません。
- JSX には runtime state に本当に依存する最小限の dynamic style だけを残します。
- 大きな styles ファイルは任意の行数ではなく、コンポーネントまたは視覚責務で分割します。

## Design Token

本共通 package は Token 名や値を定義しません。各 App はプロジェクト固有規約で Token のコード上の事実源を示します。

実装時の要件：

- 現在の App ですでに定義された color、typography、spacing、radius、shadow、motion Token を優先します。
- 1 つまたは複数ファイルで繰り返すデザイン値を、literal のまま長期的に散在させません。
- 別 App が使っているという理由だけで Token を現在の App へコピーしません。
- Figma 値が既存 Token に近いが一致しない場合、まずデザインが既存 Token に bind すべきかを判断し、その後差異を報告します。
- global Token の追加または変更は design system の変更であり、タスク範囲内で明示的な承認が必要です。

本当に一度しか使わない局所寸法は画面に残せますが、名前と用途を明確にします。

## Typography

Figma とプロジェクトの font 設定から、次を完全に評価します。

- `fontFamily`
- `fontSize`
- `fontWeight` または対応する具体的 font family
- `lineHeight`
- `letterSpacing`
- テキスト言語と glyph fallback

Figma Dev Mode に表示された font 名を機械的にコピーしません。design tool は glyph 不足により fallback する場合があるため、App が実際に読み込む font と対象言語の対応を確認します。

多言語混在、数値強調、単位テキストを nested `Text` に分けるかは、デザイン結果、可読性、font coverage で決定します。

## リストと繰り返し構造

- 繰り返す card、menu、option、row はデータ駆動で render します。
- データ量、virtualization 要件、nesting に応じて `FlatList`、`SectionList`、単純な `map` を選びます。
- 同階層 item の height、padding、divider、spacing に統一ルールを持たせます。
- 最初、最後、selected item の視覚差異を明示します。
- 将来 pagination または動的変更の可能性があるデータは、最初から stable key と list boundary を持たせます。
- 配列 index、表示文言、一時的 timestamp を長期的な stable ID にしません。

## Import と公開入口

- 深い `../../` より、プロジェクトで設定済みの path alias を優先します。
- 各 workspace は自分の package file に宣言された外部 package だけを import します。
- 利用側は package private file を deep import して公開 `exports` を迂回しません。
- type-only import はプロジェクトの TypeScript 規約に従い、不要な runtime code を導入しません。

## レビュー可能性

デリバリーされたコンポーネントから、reviewer が次をすぐ判断できる必要があります。

- 状態はどこで管理されているか
- ユーザー操作はどの callback に入るか
- API とナビゲーション意図はどこで処理されるか
- デザイン値はどこから来るか
- iOS / Android 差異はどこで処理されるか
- 何が shared で、なぜ shared にできるか

これらに答えるために 1 つの非常に長いファイルを最初から最後まで読む必要があるなら、コンポーネント境界をさらに改善します。
