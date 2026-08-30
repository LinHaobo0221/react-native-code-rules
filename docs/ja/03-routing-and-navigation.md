# 03 ルーティングとナビゲーション

> 本文書は Expo Router の一般的な構成原則を定義します。具体的な route group、path、tab 名、画面遷移値はプロジェクト固有規約で定義します。

## 基本ルール

- `mobile/app/` は route 宣言、layout、極めて薄い bridge だけを担当します。
- 実際の画面実装は `features/<feature>/pages/` に配置します。
- route ファイルは可能な限り re-export だけにし、Hook、静的データ、スタイルを蓄積しません。
- `app/_layout.tsx` は root navigation、Provider、global system 設定だけを担当し、画面の業務内容を配置しません。
- route 文字列はプロジェクトの route 定数または type-safe な入口で集中管理します。
- `router.push`、`replace`、`pathname`、`Stack.Screen name`、`Tabs.Screen name`、`initialRouteName` の文字列を各所に hard-code しません。

`index.tsx` を許可するか、route group 名を固定するか、path alias をどの形式にするかは、プロジェクト固有規約で明示します。すでに統一された慣習がある場合、新しい画面もそれに従い、2 つ目の path 慣習を作りません。

## Route group

プロジェクトは起動、未認証、認証済み、Modal、その他の安定 shell を基準に route group を分けます。共通規約が要求する内容：

- group は一時的な画面分類ではなく、ナビゲーション境界を表します。
- 同一 flow の画面は、可能な限り同じ Stack で管理します。
- tab bar、header、modal shell の表示は、正しいナビゲーション階層から自然に決定されます。
- ページスタイルや navigator の条件付き unmount でルート階層を疑似的に再現しません。

具体的な group 名は `app-specific.md` に記録します。

## Tabs と Stack

Tabs は第一階層の目的地切り替えだけを担当します。1 つの tab 内の第二、第三階層画面は、その tab 自身の Stack で管理します。

標準的な関係：

~~~text
Root Stack
└── App Route Group
    └── Tabs
        ├── Tab A Stack
        │   ├── Main
        │   └── Detail / Edit / Filter
        └── Tab B Stack
            └── Main
~~~

必須ルール：

- Bottom Tab Bar は Tabs layout で一度だけ定義します。
- 複数画面で tab bar を繰り返し描画しません。
- 詳細、編集、設定の下位画面を疑似 tab にしません。
- tab bar を隠すために `null` を返す、高さを 0 にする、画面外へ移動する、Tabs を条件付きで unmount する方法を使いません。
- すべての tabs を覆う全画面 route は Tabs 外側の Stack に配置します。
- 1 つの tab に属する下位 flow は、その tab の Stack 内に残します。

## ナビゲーションの意味

- 詳細、編集、次の step へ進む場合は、プロジェクトで定めた push の意味を使用します。
- 戻る操作は native stack の back を優先し、back gesture を保持します。
- 履歴を本当に置き換える flow node だけで replace を使用します。
- Tab 切り替えは tab の意味を維持し、Stack push のように見せません。
- modal flow 全体を閉じる操作と、modal 内で 1 step 戻る操作は別であり、誤った同一の意味を共有しません。

具体的な画面遷移 animation、gesture 設定、duration はプロジェクト固有のモーション規約が決定します。共通規約は同種ナビゲーションの一貫性と iOS / Android のネイティブ挙動の尊重を要求します。

## 画面分類

画面追加前に、次のどれに属するかを決定します。

1. ある tab の root 画面
2. ある tab 内の下位 flow
3. tabs をまたぐ全画面 route
4. route-level modal flow
5. 独立 route ではなく、画面内部の sheet / dialog

この分類によって、配置する Stack、tab bar が自然に表示されるか、閉じる操作の意味、back の挙動が決まります。画面を `app/` root に任意に置いてから、スタイルで誤ったナビゲーションを補正しません。

## Route-level Modal と画面内 overlay

通常、次の場合は route-level modal が適切です。

- 内部に multi-step navigation がある
- 独立した履歴と system back の挙動が必要
- 現在の Tabs 全体を覆う必要がある
- 閉じる操作が flow 全体の終了を意味する

通常、次の場合は画面内 Modal / Sheet が適切です。

- 短い選択肢リスト
- 一度だけの確認
- 日付または filter picker
- 独立した route 履歴を必要としない軽量操作

プロジェクトにある安定した実装と animation pattern を再利用し、画面ごとに新しい overlay 構造を作りません。

## Route 定数

プロジェクトで次を集中管理します。

- path
- route name
- route group name
- 共通 pathname parameter type

Route 定数は明確な業務意味を持ち、同じ path を複数ファイルで繰り返しません。path parameter には表示文言や配列 index ではなく、安定した ID を使用します。

## ナビゲーションの受け入れ確認

デリバリー前に最低限確認します。

- 正しい入口から画面へ到達できる
- back の戻り先が正しい
- replace 後に戻るべきでない履歴が残らない
- 画面遷移中に tab bar が跳ねる、遅れて表示される、二重描画されることがない
- modal の閉じる意味が正しい
- iOS の back gesture と Android の system back が機能する
- 階層切り替えで safe area と StatusBar が点滅または隠れない
