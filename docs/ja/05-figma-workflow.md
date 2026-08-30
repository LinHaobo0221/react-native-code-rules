# 05 Figma ワークフロー

> 本文書は Figma から React Native / Expo への読み取り、分析、実装、受け入れ確認フローを定義します。具体的な Figma ファイル、Library、Token、フォントはプロジェクト固有規約で定義します。

## 適用条件

ユーザーが Figma URL、node、スクリーンショットを提供した場合、またはデザインから画面を作成・変更するよう明示した場合、本書を適用します。

Figma が対象外のタスクでは、node 読み取りと視覚 mapping の手順は適用しませんが、アセット、コンポーネント責務、native 品質ルールは引き続き参考にします。

## 開始前

次を確認します。

1. 共通規約とプロジェクト固有規約をすべて読み終えている
2. 現在の Expo / React Native 設定と許可された依存関係
3. 現在の App の Token、フォント、icon、既存コンポーネント入口
4. 画面が属する feature と route 階層
5. 要求された画面状態、操作範囲、データ境界

確認が終わる前に画面コードの生成を開始しません。

## Figma の必須読み取り順序

### 1. 入口 node を読む

提供された screen、frame、section 全体を入口として扱い、最上位スクリーンショットだけで実装に十分だと判断しません。

最初に確認するもの：

- metadata / node tree
- frame size と Auto Layout
- direct child
- component instance
- hidden layer
- variable / style reference
- asset と vector group

### 2. 責務別に分類する

重要 node を次へ分類します。

- 画面 shell と背景
- safe area / header / navigation
- tab / segment
- section header
- card / list row
- button / input / picker
- modal / sheet / dialog
- icon / SVG group
- image / illustration / background asset
- chart / visualization
- system UI

### 3. 重要な子 node を詳しく読む

実装へ影響する node は、次の事実を確認できるまで読み込みます。

- size と constraint
- padding、gap、alignment
- typography と line height
- fill、stroke、radius、shadow
- variant / component property
- clipping、mask、z-index、overflow
- asset type と export boundary
- default、selected、disabled、loading、error などの状態

次の複合 control は内部要素を個別に確認します。

- TextField / SearchField
- Select / Dropdown
- Date / Time picker row
- Tab / Segment
- Card action
- Chart tooltip / legend

外枠だけを読み、近似 icon や推測した内部 spacing を使いません。

### 4. Node 読み取り一覧を作成する

コード変更前に、最低限次を含む「Figma 子 node 読み取り一覧」を出力または記録します。

- 入口 node ID と name
- 読み取った主要 child node の ID と name
- 各 node に対応するコード配置先
- export 予定の SVG / PNG
- 意図的に省略した node と理由

tool から node へアクセスできない、または権限がない場合、fallback の根拠、使用したスクリーンショット、未確認の事実を説明します。

## デザインからコードへの mapping

### Auto Layout

- Auto Layout は原則として flex の関係へ mapping します。
- hug、fill、fixed、min/max constraint から width / height の挙動を判断します。
- 通常 layout で表現できる構造を大量の absolute positioning で再現しません。
- absolute は明示的な重なり、badge、装飾、overlay だけに使用します。

### Component と Variant

- 現在の App の既存コンポーネントを先に検索し、構造と意味が一致するか確認します。
- Figma component property を有限で type-safe な props へ mapping します。
- Variant は `variant`、`size`、`tone`、`state` などの enum を優先します。
- 構造が明らかに異なる既存コンポーネントを、再利用のために無理に使いません。
- 新規コンポーネントは原則として現在の feature に置き、feature 間で安定した再利用が確認できてから shared へ移します。

### Variables と Token

- Figma variables は本共通 package の固定値ではなく、現在の App の Token へ mapping します。
- Figma が alias を使用する場合、コードも raw color より semantic Token を優先します。
- Figma と code Token に drift がある場合、どちらかを黙って選ばず、差異を報告してプロジェクトの事実源に従います。

### Typography

- テキスト言語、font coverage、Figma fallback を確認します。
- 現在の App が読み込んだ実際の `fontFamily` を選びます。
- font size、line height、letter spacing、weight をまとめて mapping します。
- 承認なしに font package または asset を追加しません。

### Layout 値

Figma の値は、既定では同じ数値の React Native logical pixel に mapping します。font rendering、native control、platform behavior により根拠のある差異が生じる場合だけ platform 調整し、理由を記録します。

## 画像と SVG

- 機能 icon、小さな状態 graphics、拡大可能な vector は local SVG を優先します。
- 写真、複雑な illustration、banner、bitmap texture は適切な倍率の local bitmap を使用します。
- Figma で完成している複雑な vector group は、コードで path を推測せず、全体 export を優先します。
- runtime で形状や色を動的に変更する必要があり、かつ構造が単純な場合だけ SVG を手書きします。
- プロジェクトが明示的に許可しない限り、正式な local asset を network URL、base64、近似した third-party icon で置き換えません。
- 低解像度スクリーンショットを production asset にしません。
- 元のデザインが分離不能な bitmap でない限り、accessibility text を画像へ焼き込みません。

アセットは用途が分かる名前にします。例：

~~~text
icon-arrow-left.svg
profile-avatar-placeholder.png
empty-history-illustration.svg
~~~

hash、random string、export tool の一時名、用途不明の `image-1.png` を残しません。tool が生成した一時 asset は同じタスク内で rename し、未使用 asset は削除します。

## System UI

Figma 内の次の要素は、既定では業務 UI ではなく端末環境です。

- iOS Home Indicator
- status bar の時刻、battery、signal、Wi-Fi
- Android system navigation bar
- device frame と画面角 mask

偽の system element を描画せず、safe area、StatusBar、system background を正しく処理します。ユーザーが marketing mockup または device presentation を明示的に求めた場合だけ例外です。

## 操作意図

デザインと prototype から次を判断します。

- tap target と hit area
- Tab / Segment 切り替え
- input focus、placeholder、validation 状態
- sheet / modal の open と close
- loading / empty / error / disabled 状態
- scroll 領域と fixed 領域の境界
- navigation forward、back、close の違い

Figma が静的状態だけを示す場合、実際の業務ルールを独自に作りません。タスクが許可する最小限の local demonstration state を実装し、placeholder 挙動を明記します。

## 実装前の出力

コードを書く前に、簡潔なディレクトリ mapping を示します。

1. 適用する主要プロジェクト規約
2. 作成または変更するファイルの full path
3. 各ファイルの責務
4. Figma 子 node 読み取り一覧
5. 再利用予定の既存コンポーネント、Token、asset
6. 既知の不確実性と保守的な仮定

実際のファイルはこの mapping に従います。実装中に計画を変更した場合は mapping も更新します。

## 視覚的な受け入れ確認

実装後、最低限次を確認します。

- 構造と階層
- padding、gap、alignment
- font size、line height、weight、letter spacing
- color、stroke、radius、shadow
- 画像 crop と SVG size
- scroll、fixed footer、safe area
- press、focus、selected、disabled などの状態
- 小さい画面と長文
- iOS / Android の native 表現

Web は route 到達と基本 rendering の迅速な確認に使えますが、視覚、keyboard、safe area、Modal、transition の native 受け入れ確認を代替しません。

## デリバリー説明

デリバリー時に次を説明します。

- 再現した内容
- Figma との残存差異
- asset 不足、platform behavior、dependency 制約、design 不足など差異の理由
- 検証した platform と state
- ユーザー判断が必要な Token、font、motion、業務 behavior
