# 09 テスト戦略

> 本文書は React Native / Expo App の共通 test 原則、layer、非同期 race、デリバリー要件を定義します。具体的な runner、component testing library、E2E tool、CI command はプロジェクト固有規約で定義します。

## テストの目的

Test の目的は、変更、refactoring、upgrade、異常条件でも user behavior と system invariant が維持されることを証明することです。coverage 数値を上げることだけが目的ではありません。

優先して保護するもの：

- 主要 user path
- data conversion と business calculation
- navigation と state boundary
- API contract と error mapping
- concurrency、cancellation、stale response
- Auth、storage、account switch
- 主要 interaction と accessibility
- 修正済み bug の根本原因
- iOS / Android の native 差異

## 各プロジェクトが定義するテスト事実

各 App は `app-specific.md` に次を記録します。

- test runner と version
- test environment と path alias
- unit / Hook / component / integration / E2E tool
- native module mock entry
- global setup と cleanup
- CI required check
- coverage strategy
- iOS / Android manual / automated acceptance matrix
- flaky test の処理フロー

共通規約は Jest、Vitest、特定 E2E package を強制しません。

## テストレイヤー

### 1. Static analysis

最低 layer：

- formatter / format check
- lint
- TypeScript typecheck
- Expo config、asset、bundle check

Static analysis は runtime test を代替しませんが、すべての変更に対する基本 feedback です。

### 2. Pure unit test

適した対象：

- formatter と parser
- view model conversion
- reducer
- selection / sorting / pagination merge
- date、number、unit conversion
- validation と error mapping
- stable ID と route mapping

pure function test は高速で、network、React、native environment を使わず、boundary input と invalid input を扱います。

### 3. Hook / state test

適した対象：

- input と derived state
- loading / success / error / retry
- refresh と load-more
- debounce / countdown / timer
- effect cleanup
- event subscription
- request race と stale response
- optimistic update と rollback

Hook test は project-approved React test environment を使い、update を正しい `act` boundary で包みます。各 test 後に unmount し、subscription、timer、mock、pending work を cleanup します。

### 4. Component interaction test

ユーザーが認識できる behavior をテストします。

- 文言と control が表示されるか
- user input 後に何が表示されるか
- press / toggle / select が正しい callback を呼ぶか
- loading / disabled が重複 action を防ぐか
- error / empty / selected state
- accessibility role、label、state

text、role、label、user action を使った query を優先します。`testID` は stable accessible entry がない場合、または E2E locator に必要な場合だけ使います。

次への assertion は避けます。

- component internal state
- private Hook implementation
- user に意味のない props structure
- refactoring で容易に変わる large component tree

React Native 公式 documentation は現在 React Test Renderer を deprecated としています。そのため：

- 共通規約は `test-renderer` を新規プロジェクトの標準にしません。
- 既存プロジェクトは dependency 変更が承認されるまで現在の test を維持できますが、migration plan と native acceptance gap を記録します。
- 新規プロジェクトは現在 support され、user behavior を対象とする component testing solution を選び、プロジェクト固有規約に記録します。

### 5. Integration test

Integration test は、複数の実 module 間の協調を検証します。例：

- Page Hook + API adapter + error mapping
- Provider + route guard + navigation intent
- Auth coordinator + storage adapter + API client
- list cache + feature event + pagination
- form + validation + mutation + completion state

network、system storage、time、file、photo library、navigation host など本当の boundary だけを mock します。internal pure function と business module は可能な限り実実装を使います。

### 6. Native / end-to-end test

E2E または native manual acceptance は JavaScript test では証明できないものを扱います。

- native navigation と back gesture
- keyboard、autofill、system back
- safe area、StatusBar、edge-to-edge
- permission、photo library、camera、file、share
- deep link と cold start
- foreground / background transition
- EAS / release build behavior
- iOS / Android native component と animation

E2E は startup、sign-in、core feature、payment、account operation など少数の high-value path を優先します。すべての unit case を slow E2E で重複させません。

## テストファイル構成

- test は既定で対象 module の隣に置き、`name.test.ts` または project-defined form で命名します。
- cross-feature test helper は各 feature にコピーせず `mobile/test/` に配置します。
- fixture builder と deferred helper は意味のある名前を使い、不透明な general-purpose test framework にしません。
- test ID は stable domain prefix を使用でき、requirement、defect、security review を追跡可能にします。
- test description は Given / When / Then または Arrange / Act / Assert を明確に表します。

1 test は主に 1 behavior または invariant を証明します。複数 assertion は同じ結論を支える場合だけ含めます。

## Deterministic test

Test は独立して反復可能に実行でき、execution order に依存しません。

次を control します。

- current time と time zone
- timer、animation frame、idle callback
- UUID / random
- network response
- AppState
- platform
- permission
- file metadata
- storage state
- global singleton と module cache

real `sleep` または長い timeout で async state が「おそらく完了する」ことを待ちません。

time logic は fake timer または injectable clock を使います。非同期順序は deferred Promise または controlled mock で正確に進めます。

## 非同期と race condition のテスト

高度な mobile test は通常の成功以外の timeline も扱います。

deferred Promise を推奨します。

~~~ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};
~~~

重要 scenario：

- request A が先に開始して後に完了し、B が後に開始して先に完了
- screen unmount 時に request pending
- filter、route parameter、account が変わった後に old response が到着
- refresh と load-more が同時発火
- mutation を短時間で複数回 press
- storage write pending 中に logout
- refresh pending 中に account switch
- listener cleanup 後に old event が到着
- picker / permission flow が戻った時点で AppState がまだ不安定

test comment で timeline を説明し、次を同時に assert します。

- どの result が commit できるか
- どの result を cancel / discard すべきか
- loading lock が最終的に release されるか
- cache、storage、public state、user-facing error が一貫するか

real network latency に依存して race を作りません。

## Mock 原則

- real pure module と small fake を優先し、internal implementation を過剰に mock しません。
- Network、Secure Storage、FileSystem、Image Picker、Linking、native module は Node test で明示的な adapter mock を使います。
- Mock value は failure、cancellation、invalid response を含む real contract に従います。
- 各 test で call history、implementation、module-level state を reset します。
- mock、timer、mounted root、listener を次 test へ leak させません。
- test 対象の core behavior 自体を mock しません。そうすると mock の正しさしか証明できません。

## API とデータのテスト

API layer は最低限次を扱います。

- method、path、query、body、header
- success envelope と runtime validation
- stable error code mapping
- timeout、network、`4xx`、`5xx`
- pagination cursor と deduplication
- cancellation / stale response
- mutation が retry 可能か
- 任意の sensitive header override を防ぐ

unit test から real production endpoint へ接続しません。

backend と contract を共有する場合、frontend / backend がそれぞれ自分の boundary を検証し、contract test または shared schema で drift を防ぎます。

## ナビゲーションテスト

最低限次を扱います。

- 正しい entry と route parameter
- push / replace / back semantics
- modal 内で戻る操作と flow 全体を閉じる操作の違い
- tab child screen が 2 つ目の tab bar を作らない
- logout、invalid account、deep link の route guard
- 通常 state change で Root が予期せず remount しない
- back gesture で invalidated protected screen へ入れない

Node integration test が証明できるのは state と navigation intent だけです。native animation、gesture、system back は両 platform での受け入れ確認が必要です。

## Component と accessibility のテスト

主要 interactive component で最低限確認します。

- role と label
- selected / checked / disabled / expanded state
- visual disabled と実際の event blocking が一致
- hit target 拡張が visual layout を変えない
- loading 中に callback が繰り返し発火しない
- error text と input の関係が理解可能
- dynamic type または長文で主要 action が隠れない

color、pixel、詳細 layout は、大量の壊れやすい style object assertion ではなく、Figma visual QA または approved visual-regression tool で検証します。

## Snapshot test

- 小さく stable で明確な review value がある output だけに snapshot を使います。
- 複雑な画面全体の巨大 snapshot を作りません。
- snapshot update は人が review し、failure を消すためだけに batch update しません。
- business calculation、interaction、security invariant は explicit assertion が必要で、snapshot だけに依存しません。

## Bug fix

推奨フロー：

1. 根本原因を安定して再現する failing test を追加。
2. 最小 fix を実装。
3. regression test の成功を証明。
4. 同 flow または shared component の direct consumer を確認。
5. 必要な native acceptance を完了。

real device、system picker、特定 navigation state だけで再現する bug は、詳細な manual reproduction step を残し、分離可能な state machine を可能な限り自動化します。

## Coverage

- Coverage は blind spot を見つける signal であり、品質目標そのものではありません。
- line coverage のためだけに意味のない getter または implementation detail をテストしません。
- Auth、payment、permission、data deletion、race など high-risk module は invariant / branch-driven coverage を使います。
- 新しい critical branch を自動化できない場合、理由と対応する manual acceptance を記録します。

## CI レイヤー

推奨 feedback 順序：

1. format / lint / typecheck
2. fast unit test
3. Hook / component / integration test
4. build / bundle / Expo config check
5. critical E2E と release smoke test

fast check は明白な defect を block します。slow native test は Pull Request、release candidate、nightly job で実行できます。具体的 strategy は project-specific rule が定義します。

## Review checklist

- [ ] test が implementation detail ではなく user behavior または system invariant を保護する。
- [ ] test が独立かつ deterministic に動く。
- [ ] mounted root、timer、listener、mock をすべて cleanup する。
- [ ] async race に controlled Promise を使い、real sleep を使わない。
- [ ] risk に応じて success、failure、cancellation、stale path を扱う。
- [ ] Component test は role、label、user action を優先する。
- [ ] Node mock だけで native capability の完成を宣言しない。
- [ ] Bug fix に root-cause regression test または明示的 manual acceptance がある。
- [ ] CI command と既存 failure を明確に記録する。

## 参照基準

- [React Native Testing Overview](https://reactnative.dev/docs/testing-overview)
