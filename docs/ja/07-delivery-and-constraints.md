# 07 デリバリーと制約

> 本文書は依存関係、変更範囲、check、test、native 受け入れ確認、最終デリバリー要件を定義します。

## 依存関係の制約

- 明示的な承認なしに third-party dependency を追加しません。
- dependency が必要なら、install 前に選定理由を提示します。
- 各 workspace は自分の `package.json` に宣言された package だけを import します。
- root または別 workspace の hoisted `node_modules` に package が存在するだけで直接依存しません。
- React、React Native、Expo、native module の重複または競合 version を避けます。
- UI package、config plugin、native module は現在の Expo workflow に従い、managed / prebuild / bare strategy を独自に切り替えません。

dependency の提案には最低限次を含めます。

- 現在の Expo / React Native との互換性
- iOS / Android support
- native code または config plugin を含むか
- 性能と bundle size への影響
- maintenance activity と upgrade risk
- 既存 dependency または native API で満たせるか
- install、configuration、EAS、rollback cost

承認前は提案だけを行い、実際に install しません。

## プロジェクト境界

- `mobile/` は mobile の事実範囲であり、backend の Node-only internal file を直接 import しません。
- cross-workspace 共有は public package exports を使用します。
- 1 画面のために monorepo workspace 境界を変更しません。
- build、EAS、native project、signing configuration を独自に変更しません。
- `.expo`、build output、一時 export asset、local credential を commit しません。
- token、password、key、personal data、environment variable value を code、log、documentation に書きません。

## 変更範囲

- リポジトリ内のタスクと無関係な既存変更を保持します。
- 他者の作業を整理するために destructive Git operation を実行しません。
- 局所タスクのために無関係なファイルを大規模 format しません。
- 同じ根本原因が 1 flow の複数画面へ影響する場合、明示した境界内で同時に修正し、デリバリー時に範囲を列挙します。
- 完了に API、data structure、dependency、project architecture の変更が必要なら、実装前に承認を得ます。

## コード生成フロー

### 1. 読み取りと分析

- 共通規約、プロジェクト固有規約、関連既存コードを読みます。
- package、path alias、test、build configuration を確認します。
- Figma タスクでは完全な node 読み取りフローを実行します。
- working tree の既存変更を確認し、上書きを避けます。

### 2. ディレクトリ mapping

変更開始前に次を明確にします。

- 作成・変更するファイル
- 各ファイルの責務
- feature / shared / route への配置理由
- 再利用予定の component、Hook、Token、asset
- 不明点と仮定

### 3. 実装

- 最小限必要な変更で要件を満たします。
- 既存の format、type、test、comment style に従います。
- 未承認 dependency と業務拡張を追加しません。
- 同じタスク内で asset に意味のある名前を付け、参照を完成させます。

### 4. 検証

リスクに応じてプロジェクト既存の command を実行します。

- formatter / format check
- lint
- TypeScript typecheck
- unit / integration tests
- Expo config または bundle check
- iOS / Android native run check

具体的な command はプロジェクト固有規約に記録し、すべてのプロジェクトが同じ tool を使うと仮定しません。

既存 failure がある場合、次を区別します。

- 今回の変更で追加された問題
- 今回と無関係な既存問題

「プロジェクトは以前から失敗していた」という理由で新しい regression を隠しません。

## テスト要件

変更リスクに test 強度を合わせます。

- pure style：lint、typecheck、対象画面の native visual acceptance
- interactive component：state、callback、disabled、accessibility、platform branch
- Hook：derived state、race、cleanup、success / failure branch
- navigation：entry、back、replace、modal close、system back
- API：request contract、loading、error、Auth invalidation、concurrency
- shared component 変更：すべての direct consumer を確認

happy path だけを検証しません。bug fix では可能な限り根本原因を保護する regression test を追加します。

## Figma デリバリー要件

Figma 画面タスク後に次を説明します。

- 完成した node と state
- 再利用または追加した component
- 新しい local asset
- Figma との差異と理由
- iOS / Android 検証
- 同 flow の sibling screen を確認したか

正式 Figma node を利用できなかった場合、screenshot または description に基づく fallback であることを示し、正式な alignment が必要な内容を特定します。

## 完了の定義

次をすべて満たした場合だけタスク完了です。

- file が正しい directory にある
- route と navigation hierarchy が正しい
- component responsibility と state owner が明確
- 未承認 dependency を追加していない
- 重複 Token または business source of truth を散在させていない
- 主要 interaction が実際に機能する
- iOS / Android risk を処理または明記している
- accessibility と test entry が主要 control を覆う
- 関連 check が成功、または既存 failure が分離・説明されている
- 最終回答に主要 file、検証結果、残存差異がある

## 禁止事項

禁止：

- project rule を読まずにコードを生成する
- `app/` route entry に完全な画面実装を置く
- style または conditional unmount hack で tab bar を隠す
- 画面 business logic を Shared UI に置く
- 別 App の Token、font、motion を default としてコピーする
- 正式 Figma asset を online の近似 icon で置き換える
- device system UI を手動描画する
- Web screenshot を native 最終受け入れ確認にする
- 1 platform だけ対応して範囲を説明しない
- 現在の project 能力で解決できる問題を dependency 追加で回避する
- 未確認の実 API、storage、permission、analytics、business flow を作る
- 複雑性が明確に増えたとき適切な分割を拒む
