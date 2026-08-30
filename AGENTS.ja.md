# React Native / Expo 共通コード生成規約（索引）

本 package は、React Native / Expo モバイルプロジェクト向け共通規約の入口です。複数の App で再利用できるディレクトリ構成、コード責務、Figma ワークフロー、品質基準のみを定義します。具体的なデザイン値、業務ルール、プロジェクト依存関係は、利用側リポジトリのプロジェクト固有ドキュメントで定義しなければなりません。

## 必須の読み込み順序

React Native / Expo コードを生成または変更する前に、次のファイルをすべて最後まで読みます。

1. [docs/ja/01-core-principles.md](docs/ja/01-core-principles.md)
2. [docs/ja/02-project-structure.md](docs/ja/02-project-structure.md)
3. [docs/ja/03-routing-and-navigation.md](docs/ja/03-routing-and-navigation.md)
4. [docs/ja/04-component-and-styling.md](docs/ja/04-component-and-styling.md)
5. [docs/ja/05-figma-workflow.md](docs/ja/05-figma-workflow.md)
6. [docs/ja/06-interaction-platform-and-accessibility.md](docs/ja/06-interaction-platform-and-accessibility.md)
7. [docs/ja/07-delivery-and-constraints.md](docs/ja/07-delivery-and-constraints.md)
8. [docs/ja/08-performance-and-rendering.md](docs/ja/08-performance-and-rendering.md)
9. [docs/ja/09-testing-strategy.md](docs/ja/09-testing-strategy.md)
10. [docs/ja/10-security-and-privacy.md](docs/ja/10-security-and-privacy.md)
11. 利用側プロジェクトの `mobile/docs/agents/app-specific.md`、または同等のプロジェクト固有規約

原則としてすべてのファイルを読み、過去の要約を原文の代わりに使用してはいけません。タスクが Figma に一切関係しない場合、`05-figma-workflow.md` の Figma ノード読み取り手順は適用されませんが、アセット、構造、品質に関するルールは引き続き有効です。

## 規約の境界

- 共通規約は、標準ディレクトリ、ファイル責務、コードのレイヤー、操作品質、性能診断、テスト、セキュリティとプライバシー、デリバリーフローを定義します。
- プロジェクト固有規約は、route 名、Token、フォント、モーション、アセット、依存関係、API、Auth、ストレージ、業務制約を定義します。
- Figma は現在のデザインタスクにおける視覚的な事実源であり、コード構成とエンジニアリング制約は本規約が決定します。
- 既存 App の画面名、業務コンポーネント、ブランドカラー、一時的な技術判断を、すべての App の共通ルールへ昇格させてはいけません。
- プロジェクト固有情報が不足している場合は、最も保守的な実装を採用し、Design Token、モーションシステム、依存関係、業務ロジックを独自に作成してはいけません。

## 利用側プロジェクトの接続要件

各利用側リポジトリは、リポジトリ内で直接検出できる `AGENTS.md` を保持しなければなりません。その入口で `rules_language: ja` を宣言し、本ファイルとプロジェクト固有の補足文書を明示的に参照します。npm package をインストールするだけでは、コード生成ツールが `node_modules` 内の規約を自動検出するとは限りません。

プロジェクト固有規約は [templates/ja/app-specific.md](templates/ja/app-specific.md) から作成します。

## メンテナンス要件

- 共通原則は本リポジトリだけで管理し、各 App にコピーされた規約が個別に進化する状態を避けます。
- 利用側 App はプロジェクト差分だけを管理し、共通規約全体を複製しません。
- 新しい共通ルールを追加する前に、少なくとも 2 つの App に適用できること、または本質的にプラットフォーム品質要件であることを確認します。
- 具体的なコンポーネント実装、Token 値、モーションパラメータを本リポジトリへ追加してはいけません。
