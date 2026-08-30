# React Native Code Rules

[简体中文](README.zh-CN.md) · **日本語** · [English](README.md)

React Native / Expo プロジェクト向けの、バージョン管理された多言語コード生成規約です。本リポジトリは構造、責務、実装フロー、品質基準のみを管理し、具体的な UI、Design Token、モーション値、ブランドアセット、業務実装は提供しません。

現在のバージョン：`0.1.0`

## 対象範囲

本規約は React Native と Expo を採用するモバイルプロジェクトを対象とします。特に、Figma を起点に画面を実装し、Expo Router でルートを構成し、複数の App で同じコード構造を維持したいチームに適しています。

共通 package が定義する内容：

- `mobile/` の標準ディレクトリ構成
- Page / UI / Hook / Data / Shared の責務境界
- コンポーネント、ファイル、Props、スタイルの規約
- Expo Router の一般的な構成原則
- Figma の読み取り、ノード分析、アセット書き出し、デリバリーフロー
- iOS / Android 両対応、キーボード、Modal、safe area、アクセシビリティ
- 性能、レンダリング、リスト、画像、リソースライフサイクル
- レイヤー別テスト、競合状態テスト、ネイティブ受け入れ確認
- セキュアストレージ、Auth、ネットワーク、権限、プライバシーの最低基準
- 依存関係、検証、デリバリー制約

各 App が定義する内容：

- 色、フォント、spacing、radius、shadow などの Design Token
- モーション時間、easing、画面遷移パラメータ
- ブランドコンポーネント、画像、SVG、フォントアセット
- route group、path、tab 名
- API、Auth、ローカルストレージ、業務状態の方針
- 性能予算、対象端末、profiling ツール
- test runner、component / E2E ツール、CI gate
- データ分類、権限、サードパーティ SDK、セキュリティリスクレベル
- Expo / React Native バージョンと許可された依存関係
- プロジェクト固有の Figma Library、ファイル、ページ

## 対応言語

- 簡体字中国語：`zh-CN`
- 日本語：`ja`
- 英語：`en`

利用側リポジトリは `rules_language` を明示し、対応する `AGENTS` 入口を参照しなければなりません。端末 locale やソースコードから言語を推測しません。対応言語が未指定の場合は英語へフォールバックします。

## リポジトリ構成

~~~text
react-native-code-rules/
├── AGENTS.md
├── AGENTS.zh-CN.md
├── AGENTS.ja.md
├── AGENTS.en.md
├── README.md
├── README.zh-CN.md
├── README.ja.md
├── CHANGELOG.md
├── CHANGELOG.zh-CN.md
├── CHANGELOG.ja.md
├── docs/
│   ├── zh-CN/
│   ├── ja/
│   └── en/
└── templates/
    ├── zh-CN/
    ├── ja/
    └── en/
~~~

各 locale には同じ番号の規約文書 10 件と、プロジェクト固有テンプレート 1 件が含まれます。

## App での利用

`0.1.0` は、npm account の所有権と公開フローが確定する前の registry への誤公開を防ぐため、現時点では `private` のままです。まずはローカルパスで試せます。

~~~bash
npm install --save-dev ../react-native-code-rules
~~~

修正版 `v0.1.0` GitHub Release の再公開後は、immutable な HTTPS tag archive から固定バージョンをインストールできます。

~~~bash
npm install --save-dev https://github.com/LinHaobo0221/react-native-code-rules/archive/refs/tags/v0.1.0.tar.gz
~~~

public npm registry で公開した後は、小文字の scoped package をインストールします。

~~~bash
npm install --save-dev @linhaobo0221/react-native-code-rules@0.1.0
~~~

package をインストールするだけでは規約は有効になりません。利用側の `AGENTS.md` から、正しい言語の入口を明示的に参照します。

日本語プロジェクトの例：

~~~md
# Mobile 規約入口

rules_language: ja

`mobile/` を変更する前に、次のファイルを順番にすべて読みます。

1. `node_modules/@linhaobo0221/react-native-code-rules/AGENTS.ja.md`
2. `mobile/docs/agents/app-specific.md`
~~~

中国語では `rules_language: zh-CN` と `AGENTS.zh-CN.md`、英語では `rules_language: en` と `AGENTS.en.md` を使用します。

対応するテンプレートを利用側プロジェクトへコピーします。

- [中国語テンプレート](templates/zh-CN/app-specific.md)
- [日本語テンプレート](templates/ja/app-specific.md)
- [英語テンプレート](templates/en/app-specific.md)

## 規約の優先順位

1. 現在のユーザータスクで明示された要件と制約
2. 利用側リポジトリの、より具体的な `AGENTS.md` と `app-specific.md`
3. 本 package の共通規約
4. 上記で扱われていない内容に対する保守的なエンジニアリング判断

プロジェクト固有規約は Token、モーション、技術選定を決定できますが、保守性、アクセシビリティ、両 OS 品質の共通最低基準を暗黙的に下げてはいけません。例外が必要な場合は、理由、範囲、受け入れ確認方法を記録します。

## License

本プロジェクトは [MIT License](LICENSE) で公開します。copyright と license notice を保持する限り、商用・非商用での利用、変更、再配布、sublicense、販売が可能です。

## バージョン方針

- Patch：既存の構造要件を変えない文言明確化、競合修正
- Minor：互換性のあるルール、任意ディレクトリ、新しい実装チェックの追加
- Major：標準ディレクトリ、責務境界、必須読み込み順序など破壊的要件の変更

各 App は規約バージョンを固定し、無制御な浮動バージョンを使わず、Pull Request で差分を確認してアップグレードします。
