# 2. 標準の `mobile/` ディレクトリ構造

標準構造は次のとおりとする。

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

ディレクトリは必要に応じて作成し、構造を揃えるためだけに空のディレクトリをコミットしない。`model`、`use-cases`、`api`、`auth`、`context`、`events`、`plugins` などは、プロジェクトで実際に必要になった場合だけ設ける。単純なページに、ディレクトリ構造に合わせるためだけの Controller、Reducer、Use Case、Repository を無理に作る必要はない。

### 2.1 トップレベルディレクトリの責務

| ディレクトリ | ルール |
| --- | --- |
| `app/` | Expo Router のルートのエントリーポイント、ルートグループの `_layout`、最小限の橋渡しコードだけを置く。ページ全体の JSX、業務状態、静的な業務データ、大量のスタイルを置かない。 |
| `features/` | 安定した製品機能またはユーザーフローごとに分ける。feature 名は業務領域を表すものとし、画面上の位置だけを表す名前にしてはならない。 |
| `shared/` | feature をまたいで安定して再利用されている機能、またはプロジェクトで基盤／デザインシステムの一部と明確に位置づけられた機能だけを置く。置き場所が決まらないコードの仮置き場にしてはならない。 |
| `assets/` | ローカルの画像、SVG、フォント、その他の静的アセットを置く。ファイル名は内容が明確に伝わるものにしなければならない。 |
| `types/` | アプリ全体に適用される環境宣言、アセットのモジュール宣言、実際に層をまたいで使う共通型を置く。 |
| `plugins/` | Expo config plugin またはビルド時の拡張を置き、実行時の業務ロジックを置かない。 |
| `test/` | feature をまたいで使うテストツール、フィクスチャ生成ツール、テスト環境の補助機能を置く。 |
| `docs/agents/` | プロジェクト固有のルール文書、コンポーネントカタログ、承認済みのアーキテクチャ上の例外を置く。 |

### 2.2 Feature サブディレクトリの責務

| ディレクトリ | 置くべき内容 | 制約 |
| --- | --- | --- |
| `pages/` | ページ単位のコンポーネント。セクションの組み立て、ページの Controller Hook の呼び出し、状態とアクションの受け渡しを担う。 | 原則として `PascalCase` のファイル名を使用する。複雑な状態機械、大量のハンドラー、描画の細かな実装、大量のハードコードされたデータを抱えたままにしてはならない。 |
| `ui/` | 現在の feature の表示コンポーネントや構成要素。カード、リスト項目、フォームのセクション、複雑な装飾、SVG グループなど。 | feature 固有の意味を持ってよいが、API リクエスト、認証／ストレージの読み書き、ルーティングの判断を直接行ってはならない。 |
| `hooks/` | React との接続、局所的な UI 状態、ページ／フローの Controller、ライフサイクル、副作用の呼び出し。 | 下位のクライアントを重複実装せず、単独でテストできる業務ルールを React Hook 内に埋め込まず、ハンドラーで処理を渡すだけの呼び出しチェーンを作らない。 |
| `model/` | 純粋な状態モデル、Reducer、セレクター、バリデーション、状態遷移、業務上の不変条件。 | React、Expo Router、API クライアント、可変のグローバル状態を import しない。Reducer とセレクターは純粋関数でなければならない。 |
| `use-cases/` | ユーザーの意図に沿って命名する多段階の業務処理。プロフィール送信、投稿公開、アカウント切り替えなど。 | 原則として React に依存しない TypeScript 関数とする。UI、Toast、ナビゲーションを操作しない。API を 1 回呼び出すだけなら作成しない。 |
| `events/` | 型を持つイベント名、ペイロード、Provider のスコープ内に限定したエントリーポイント。 | 軽量な通知にのみ使用する。業務データの基準、永続キャッシュ、直接の呼び出しチェーンの代替にしてはならない。 |
| `data/` | 静的な表示データ、ローカルのプロトタイプ用データ、選択肢の設定、オフライン時の最小限の代替データ。 | リクエスト、副作用、継続的に管理する業務の正規データを置かない。 |
| `constants/` | feature 専用で安定した定数、列挙型のマッピング、デザイン上の意味を持つ定数。 | 具体的なトークン値はプロジェクトのトークンを優先し、feature に複製しない。 |
| `api/` | feature 専用のエンドポイントを扱う Adapter、DTO 変換、実行時のバリデーション、操作の意味を表す API メソッド。 | 汎用リクエスト処理、認証の更新、エラーレスポンスの共通構造などの基盤機能は `shared` に置く。ページの状態とナビゲーションを含めてはならない。 |
| `context/` | 現在の feature または明確に定めたルートの範囲内で使う Provider。 | 範囲を限定しないグローバルストアにせず、頻繁に変わる大きなオブジェクトを持たせない。 |
| `types/` | feature 専用の UI モデル、Use Case の入力／結果、イベントのペイロード、ドメイン型。 | バックエンドの契約は、承認されたパッケージの公開 API を通して提供する。バックエンドの内部ファイルを直接参照してはならない。 |
| `utils/` | feature 専用の純粋関数。 | React Hook、ルート、API、可変のグローバル状態にアクセスしない。 |

### 2.3 Shared サブディレクトリの責務

- `shared/ui`：プロジェクト共通の UI primitive と、安定していて特定の業務に偏らない UI pattern。文書で `primitive` と `pattern` を区別してよいが、そのための追加ディレクトリは必須ではない。
- `shared/hooks`：外部から制御する開閉処理や、安定したキーボード用 Adapter など、特定の業務名を含まない汎用的な React の動作。業務フローの Hook はここに置かない。
- `shared/events`：業務固有の意味を持たない、型付きイベントの基盤。
- `shared/api`：リクエストクライアント、エラー処理、feature をまたいで使う通信基盤。
- `shared/auth`：統一された認証機能。ページがトークンを直接操作してはならない。
- `shared/constants`：feature をまたいで安定して使う定数と、プロジェクト共通のトークンのエントリーポイント。
- `shared/types`：実際に feature をまたいで使う型。
- `shared/utils`：副作用のない純粋なユーティリティ。

`shared` の公開モジュールは、それぞれの用途、利用側、API の責任範囲を明確にすべきである。「将来使うかもしれない」「2 つのページの見た目が似ている」という理由だけで `shared` に置いてはならない。

### 2.4 依存関係の方向

```text
app
└── feature pages
    ├── feature ui ───────────────> shared/ui
    └── feature hooks/controllers
        ├── feature use-cases ────> feature model / feature api / shared
        ├── feature model ────────> feature types / pure shared utilities
        └── feature api ──────────> shared/api
```

必ず守る事項：

- `shared` は `features` を import してはならない。
- UI コンポーネントは、ルート、API クライアント、認証、ストレージ、Use Case、業務ストアに直接依存しない。
- Page は UI と Controller の組み立てを担う。複数段階の API 処理を統括するロジックを、Page 内の各所に直接記述しない。
- Controller Hook は React のライフサイクルとナビゲーションにアクセスしてよい。Use Case と Model は React、React Native UI、Expo Router にアクセスしてはならない。
- `model`、`data`、`constants`、`types`、純粋な `utils` は、ページ、UI、Controller、API に逆方向で依存しない。
- `api` は Page/UI に依存してはならない。DTO からドメイン／UI モデルへの変換は、責任範囲を明確にした箇所で行い、複数のページに同じ処理を複製しない。
- feature は別の feature のページ、非公開の Hook、UI、データを import してはならない。feature 間での利用が本当に必要な場合は、承認された公開エントリーポイントを経由するか、特定の業務に偏らない機能を `shared` に移す。
- ワークスペース間でコードを共有する場合は、パッケージの公開 `exports` を経由しなければならない。内部パスを直接 import してはならない。
- EventBus、Context、モジュール単位のシングルトンを使って、明確に定めた依存関係の方向を迂回してはならない。
- アーキテクチャ上の判断を避け、何でも `shared` に置いてはならない。

### 2.5 ファイルの命名

- コンポーネントとページ：`PascalCase.tsx`
- ページ Controller Hook：`useSomethingController.ts`
- 局所的な動作を扱う Hook：`useSomething.ts`
- Use Case：`verbNoun.ts`。例：`submitProfile.ts`、`publishPost.ts`
- Reducer / State Model：`somethingReducer.ts`、`somethingModel.ts`
- 純粋なユーティリティ：`camelCase.ts`
- テスト：`name.test.ts` または `name.test.tsx`
- 型：内容が伝わるファイル名を使い、何でも `types.ts` に追加して肥大化させない。
- 定数：内容が伝わるファイル名を使い、何でも `constants.ts` に追加して肥大化させない。
- ルートファイル：Expo Router と、プロジェクト既存の小文字パスのルールに従う。

責務が伝わらない `helpers.ts`、`manager.ts`、`common.ts`、`service.ts` といった名前を避ける。実際に Service、Manager、Facade としての役割がある場合は、`AuthSessionCoordinator` のように管理対象や責任範囲を名前に表し、プロジェクト規約で責務を説明しなければならない。

各ファイルの主な責務は 1 つにすべきである。分割するかどうかは、コードを読み進める流れ、変更理由、テストの単位に基づいて決める。コード行数だけで機械的に分割してはならず、層を作ること自体を目的に、処理を渡すだけのファイルを作ってもならない。

### 2.6 新しいファイルの配置を決める手順

1. Expo Router のエントリーポイントだけを担う場合：`app/` に置く。
2. 1 つの feature でしか使わない場合：その feature 内で責務に最も合うディレクトリに置く。
3. React のライフサイクル、またはページのアクションの受付を担う場合：`hooks/` に置く。複雑な場合は Controller と命名する。
4. React に依存せず、ユーザーの意図を複数の手順で実行する場合：複雑さが導入条件を満たすなら `use-cases/` に置く。
5. 純粋な状態遷移、ルール、セレクターの場合：`model/` または `utils/` に置く。
6. 複数の feature で安定して再利用されているか、プロジェクトで基本 primitive と明確に位置づけられており、かつ業務固有の意味を持たない場合：`shared/` への配置を検討する。
7. アセット、宣言、ビルドプラグイン、テスト基盤の場合：対応するトップレベルディレクトリに置く。
8. それでも判断できない場合：feature 内の最小範囲にとどめ、置いた仮定を記録する。独自のトップレベルディレクトリを追加しない。

プロジェクトで明示的に承認されない限り、`mobile/` のトップレベル構造を変更せず、既存の構成と並立する別のアーキテクチャを作らない。

---
