# App 固有モバイル規約

> 本テンプレートを利用側プロジェクトの `mobile/docs/agents/app-specific.md` へコピーします。例示用の説明を削除し、現在の App の実設定を記入してください。未決定の項目は「未決定」と記載し、別 App の設定で代用しません。

## 1. プロジェクト情報

- 規約言語：`ja`
- App 名：
- mobile workspace path：`mobile/`
- package 名：
- Expo SDK：
- React Native：
- React：
- package manager：
- native workflow：managed / prebuild / bare

## 2. 必読プロジェクト文書

mobile code 生成前に追加で読むべき project document：

- Architecture：
- API contract：
- Data / storage strategy：
- Keyboard layout guide：
- Testing：
- Release：

## 3. ディレクトリと path alias

- 共通 `mobile/` 標準構成を完全採用するか：
- 承認済み追加 directory：
- path alias：
- route file で `index.tsx` を許可するか：
- Page export 規約：

差異がある場合、理由と適用範囲を記録します。

## 4. Routing と navigation

- Expo Router route groups：
- Root Stack：
- Tabs：
- 各 tab の Stack：
- cross-tab full-screen screen：
- route-level Modal：
- route constant file：
- default push / replace / modal animation：
- gesture と system-back 要件：

## 5. Design Token

- Token code source of truth：
- Figma Variables / Library：
- color：
- spacing：
- radius：
- shadow / elevation：
- typography：
- z-index / layer：
- light / dark / brand mode：

すべての Token 値を複製せず、事実源と命名体系を記録します。

## 6. フォントと言語

- support language：
- loaded font：
- 各言語の default font：
- English / numeric display font：
- weight mapping：
- fallback strategy：
- dynamic type / maximum scale strategy：

## 7. モーション

- motion Token の事実源：
- navigation transition：
- Modal / Sheet：
- press feedback：
- loading / skeleton：
- reduce motion：
- prohibited implementation：

## 8. Styling と基礎コンポーネント

- default styling system：
- global theme entry：
- 既存 common Button：
- 既存 common Input：
- 既存 Switch / Checkbox / Radio：
- 既存 Image / Avatar：
- 既存 Modal / Sheet：
- 既存 keyboard-aware component：
- 既存 loading / empty / error component：

feature screen は上記 entry を優先して再利用し、並行する別 version を作りません。

## 9. 画像、SVG、icon

- asset directory：
- SVG integration：
- allowed icon source：
- multi-density bitmap rule：
- placeholder / fallback：
- 追加 file naming rule：

## 10. Data、API、state

- API client：
- response envelope：
- query / mutation Hook 規約：
- Auth strategy：
- token storage：
- key-value storage：
- structured offline data：
- file cache：
- scoped event / state mechanism：
- prohibited state / storage mechanism：

未承認の data strategy は実装前に個別確認します。

## 11. Platform 設定

- minimum iOS version：
- minimum Android version / API level：
- edge-to-edge：
- StatusBar / system navigation：
- safe-area base shell：
- permission handling：
- known platform difference / fallback：

## 12. 性能とレンダリング

- target device と minimum device tier：
- critical performance path：
- release profiling build method：
- profiling tool：
- startup、frame-rate、memory、interaction budget：
- large-list の typical / maximum data volume：
- virtual-list implementation：
- image loading、cache、thumbnail strategy：
- cache owner、capacity、cleanup：
- known performance risk / acceptance scenario：

## 13. テスト戦略

- test runner：
- unit / Hook test：
- component test：
- integration test：
- E2E tool：
- native module mock：
- global setup / cleanup：
- test file include rule：
- test ID naming：
- coverage strategy：
- flaky test handling：
- iOS / Android acceptance matrix：
- CI required check：

## 14. セキュリティとプライバシー

- data classification / sensitive field 一覧：
- Auth / session contract：
- protected storage：
- regular KV / database / file cache：
- API base URL / approved origin：
- development HTTP exception：
- deep link / universal link allowlist：
- WebView strategy：
- permission 一覧と request timing：
- logging / analytics / crash redaction：
- third-party SDK data scope / consent：
- logout / account switch / deletion cleanup：
- backup / device migration / biometric：
- OWASP MASVS 適用範囲または他 security baseline：

## 15. 依存関係の制約

- approved UI / animation / gesture package：
- approved native module：
- new dependency approval：
- workspace dependency rule：
- Expo config plugin rule：

## 16. Figma ワークフロー

- Figma team / project：
- Design Library：
- screen file：
- Dev Mode / Code Connect：
- asset export permission / directory：
- Token alignment owner / process：
- visual acceptance device：

## 17. 検証とデリバリー command

~~~bash
# format

# lint

# typecheck

# test

# iOS

# Android
~~~

- minimum delivery check：
- CI required check：
- known pre-existing issue の記録場所：

## 18. プロジェクト固有の禁止事項

- プロジェクト固有の禁止事項を記入します。

## 19. 承認済み例外

各例外について記録します。

- 共通規約：
- 理由：
- 適用範囲：
- 代替策：
- 受け入れ確認方法：
- 期限または再確認条件：
