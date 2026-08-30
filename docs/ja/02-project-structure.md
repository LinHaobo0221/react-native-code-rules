# 02 プロジェクトとディレクトリ構成

> 本文書は、`mobile/` の標準ディレクトリ、責務境界、依存方向、ファイル配置ルールを定義します。

## 標準構成

React Native / Expo App は、既定で次の構成を使用します。

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

ディレクトリは必要になった時点で作成し、構成を完全に見せるためだけに空ディレクトリをコミットしません。`api`、`auth`、`context`、`events`、`plugins` などは、プロジェクトが実際に必要とする場合だけ作成します。

## トップレベルの責務

### `app/`

- Expo Router のルート入口、route group の `_layout`、極めて薄いルート bridge だけを配置します。
- 完全な画面 JSX、業務状態、静的業務データ、大量のスタイルを配置しません。
- route ファイルは、可能な限り `features/<feature>/pages` の画面を re-export します。

### `features/`

- 安定した製品機能またはユーザー flow 単位で分割します。
- feature 名は画面上の位置ではなく、業務領域を表します。
- 各 feature は自分のページ、private コンポーネント、Hook、データ、イベントをまとめます。
- feature から別 feature のページや内部状態を直接読み取ってはいけません。

### `shared/`

- 複数 feature で安定して再利用され、単一画面の業務意味を持たない機能だけを配置します。
- shared は `features/*` に依存してはいけません。
- 「将来再利用するかもしれない」という理由だけで feature 固有実装を shared へ移しません。

### `assets/`

- ローカル画像、SVG、フォント、その他の静的リソースを配置します。
- アセット分類はプロジェクト固有規約が決定しますが、ファイル名は用途を明確に表します。

### `types/`

- App 全体に適用される環境宣言、resource module declaration、レイヤーをまたいで本当に共有する型を配置します。
- feature 固有型は対応する feature 内に残します。

### `plugins/`

- Expo config plugin またはビルド時拡張を配置します。
- runtime の業務ロジックを配置しません。

### `test/`

- feature をまたぐテスト utility、fixture builder、テスト環境 helper を配置します。
- 画面または module の unit test は、原則として対象ファイルの隣に配置します。

## Feature サブディレクトリの責務

### `pages/`

- 画面レベルのコンポーネントで、既定では `PascalCase` のファイル名を使用します。
- Page は section / UI コンポーネントを組み立て、Hook の結果を渡します。
- Page に複雑な状態機械、多数の handler、低レベルの視覚詳細を長期的に持たせません。
- Expo Router から re-export する Page は、プロジェクトの安定した export 規約を使用します。未指定なら `default export` を既定とします。

### `ui/`

- 現在の feature だけで使用する表示コンポーネントと構造 section を配置します。
- feature 固有の意味を持つ名前を使用できますが、状態と callback は props で受け取ります。
- API request やナビゲーション判断を直接行いません。
- 複雑な装飾、SVG group、フォーム section、カード、リスト item はここへ配置します。

### `hooks/`

- feature のローカル状態、派生状態、handler、副作用、flow 編成を配置します。
- API mutation/query の UI 状態 wrapper も配置できますが、低レベル client を再実装しません。

### `events/`

- feature 固有の typed event 名、payload、Provider-scoped 入口を配置します。
- Event は軽量通知だけに使い、業務の事実源や永続 cache として使用しません。

### `data/`

- 静的表示データ、ローカル prototype データ、選択肢設定、最小限の offline fallback データを配置します。
- request、副作用、長期的な業務事実を配置しません。

### `constants/`

- feature 固有で安定した定数、enum mapping、デザイン意味定数を配置します。
- 具体的な Token 値は feature に複製せず、プロジェクトの Design Token から取得します。

### `api/`

- feature 固有の endpoint adapter、DTO 変換、意味のある API method を配置します。
- 共通 request、Auth refresh、error envelope などの基盤は shared に配置します。

### `context/`

- 現在の feature または明示的な route 範囲の Provider だけを配置します。
- Context を無境界な global store として使わず、頻繁に変わる大きな object によって subtree 全体を再レンダリングさせません。

### `types/`

- feature 固有の UI model、event payload、domain type を配置します。
- backend と共有する contract は、プロジェクトで承認された cross-workspace package から公開し、backend の内部ファイルを直接参照しません。

### `utils/`

- feature 固有の pure function を配置します。
- React Hook、ナビゲーション、可変 global state にアクセスしません。

## Shared サブディレクトリの責務

- `shared/ui`：feature 間で再利用する基礎 UI pattern。
- `shared/hooks`：具体的な業務名を持たない cross-feature Hook。
- `shared/events`：業務意味を持たない typed event bus 基盤。
- `shared/api`：request client、error handling、feature 間 transport 基盤。
- `shared/auth`：統一 Auth が存在するプロジェクトだけで使用し、画面から token を直接操作しません。
- `shared/constants`：feature 間で安定した定数とプロジェクト Design Token の入口。
- `shared/types`：feature 間で本当に共有する型。
- `shared/utils`：副作用のない utility。

## 依存方向

既定の依存方向：

~~~text
app -> feature pages -> feature ui/hooks -> shared
~~~

必須ルール：

- `shared` は `features` を import しません。
- feature は別 feature の page、private Hook、private data を import しません。
- `data`、`constants`、`types`、pure `utils` は page または UI へ逆依存しません。
- UI コンポーネントはナビゲーション、API client、Auth、業務 store へ直接依存しません。
- cross-workspace の共有コードは提供 package の公開 `exports` を使用し、内部 path を直接 import しません。

2 つの feature が同じ機能を必要とする場合、抽象がすでに安定し業務に偏っていないかを確認してから shared へ移します。アーキテクチャ判断を避けるための雑多な置き場として shared を使用しません。

## 命名とファイルルール

- コンポーネントと Page：`PascalCase.tsx`
- コンポーネントスタイル：`ComponentName.styles.ts`
- Hook：`useSomething.ts`
- pure utility：`camelCase.ts`
- テスト：`name.test.ts` または `name.test.tsx`
- 型：意味のあるファイル名を使い、汎用的な `types.ts` を無制限に増やしません
- 定数：意味のあるファイル名を使い、汎用的な `constants.ts` を無制限に増やしません
- route ファイルは Expo Router と現在のプロジェクトの小文字 path 命名に従います

各ファイルは 1 つの主要責務を持ちます。分割は機械的な行数だけでなく、読み取り経路、変更理由、テスト境界で判断します。

## ファイル配置の判断順序

コード追加前に次の順序で判断します。

1. Expo Router の入口だけか。該当するなら `app/`。
2. 1 つの feature だけで使用するか。該当するなら、その feature 内の最も具体的なディレクトリ。
3. 複数 feature で安定して再利用され、業務意味を持たないか。該当するなら shared を検討。
4. アセット、宣言、build plugin、test 基盤か。対応する top-level ディレクトリ。
5. それでも判断できない場合、独自 top-level ディレクトリを追加せず、最小の feature 境界から始めて仮定を記録。

プロジェクトの明示的な承認なしに `mobile/` の top-level 構成を変更したり、並行する別アーキテクチャを導入したりしません。
