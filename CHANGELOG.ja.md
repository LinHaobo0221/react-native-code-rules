# 変更履歴

[简体中文](CHANGELOG.zh-CN.md) · **日本語** · [English](CHANGELOG.md)

## 0.1.0

- package identity を repository owner と一致する `@linhaobo0221/react-native-code-rules` に決定。
- immutable な GitHub Tag archive の install 方法と、将来の public npm package 名を追記。
- npm account の所有権と公開フローが明示的に確定するまで `private: true` を維持。
- React Native / Expo 共通規約の入口と必須読み取り順序を定義。
- 標準 `mobile/` directory、責務境界、routing 原則を定義。
- component、styling、Figma、cross-platform interaction、accessibility、delivery 規約を定義。
- React rendering、virtualized list、image、非同期処理、profiling の性能規約を定義。
- unit、Hook、component、integration、race condition、native test 戦略を定義。
- data classification、protected storage、token Auth、network、permission、privacy 規約を定義。
- project-specific `app-specific.md` template を追加。
- 簡体字中国語（`zh-CN`）、日本語（`ja`）、英語（`en`）の完全な規約と project template を追加。
- device locale または code から言語を推測せず、英語 fallback を持つ明示的 `rules_language` 選択を追加。
- `LinHaobo0221` を copyright holder とする MIT License を採用。
- UI、Token、motion、business implementation を含まない documentation-only package を維持。
