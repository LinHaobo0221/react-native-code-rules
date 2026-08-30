# 08 性能とレンダリング

> 本文書は React Native / Expo App の共通性能規約を定義します。診断方法、コード境界、受け入れ方法を定義し、個別 App の性能予算、list parameter、image library、animation 実装は定義しません。

## 基本原則

- 最初に測定し、その後 optimize します。直感だけで `memo`、`useMemo`、list parameter を追加しません。
- 性能の受け入れ確認には release または release に近い build を使い、development mode の結果で最終結論を出しません。
- JavaScript thread、UI thread、network、image decode、native module の cost を区別します。
- optimization は correctness、accessibility、readability を維持します。
- 1 device の偶然の結果をプロジェクト全体の結論にせず、再現可能な操作、固定データ量、定義済み device tier を使います。
- 測定根拠がなければ、単純で正しい実装を優先します。

## 各プロジェクトが定義する性能事実

各 App は `app-specific.md` に次を記録します。

- 対象 device と最低 support device tier
- cold start / warm start で注目する metric
- 主要画面と user path
- 大規模 list の通常および最大 data volume
- image size、cache、upload strategy
- 許可された animation / list package
- profiling tool と acceptance build の方法
- 既知の性能 budget または monitoring metric

共通規約は、すべての App に同じ FPS、startup time、memory、list parameter を固定しません。

## React rendering の境界

### State の owner

- State は、それを必要とする最小で安定した owner に置きます。
- 1 画面だけの input state を global Context へ上げません。
- props または既存 state から直接導出できる 2 つ目の state を保存しません。
- collection update 時に変更のない item の reference を保ち、list 全体の不要な再構築を避けます。
- 以前の値に依存する concurrent update は functional state update を使用します。

### Context

- Context を意味と update frequency で分割し、1 つの大きな Context で無関係な画面を再 render しません。
- Provider value の action / object は、render 間の reference stability に実際の価値がある場合だけ memoize します。
- 特に `useSyncExternalStore` の external store では、公開 snapshot が変わらないとき reference を安定させます。
- Context に token、大きな list cache、高頻度 animation value を持たせません。

### `memo`、`useMemo`、`useCallback`

これらは性能 tool であり、code format 要件ではありません。

使用が適切な場合：

- profiling で value 計算が高コストだと確認できた
- reference stability が `memo` child、Context value、effect、native subscription の実際の contract である
- `FlatList` の `renderItem`、footer、empty component が reference 変更により明確な追加処理を起こす
- data conversion が多数 item に新 object を作り、frame time に実際に影響する

使用すべきでない場合：

- 計算が単純な property read または短い array operation
- memo boundary がなく、reference stability が処理を削減しない
- dependency がほぼ毎 render 変わる
- lint を消す、または「optimize されて見える」ためだけ
- custom comparator が再 render より複雑、または誤った結果を返しやすい

`React.memo` は pure component だけに使用します。custom comparison は rendering / interaction に影響するすべての props を扱い、性能根拠と test を持たせます。callback または object 変更を無視して stale UI を作りません。

## 大規模リストと virtualization

### Component の選択

- 短く、増えないことが確実な content は `ScrollView` または `map` を使えます。
- 長い list、paginated list、dynamic data は `FlatList` / `SectionList` または project-approved virtual list を使います。
- `ScrollView` で大量 item を一度に render しません。
- layout 作業を避けるために同方向 `ScrollView` 内へ virtual list を nest しません。

### Key と item reference

- `keyExtractor` は backend または local model の stable ID を使います。
- array index、display copy、毎 render 新規生成する value を key にしません。
- pagination append は stable ID で deduplicate し、変更のない item reference を維持します。
- delete、block、like などの local patch は対象 item だけを update し、無関係な page cache を再構築しません。

### `renderItem` と `extraData`

- `renderItem` の責務を集中させ、API、expensive parse、unbounded data transformation を中で行いません。
- item に渡す object と handler の不要な再生成を避けますが、reference stability のためだけに明確性を犠牲にしません。
- `extraData` は item に本当に影響する最小 state だけを含み、毎 render 変わる大 object を渡しません。
- 高コストな item view-model conversion を data adapter、selector、または根拠ある memoization boundary へ移します。

### `getItemLayout`

- item size が固定または正確に計算できる場合だけ使用します。
- offset に separator size を含めます。
- dynamic-height list に不正確な `getItemLayout` を設定して optimize したように見せません。
- fixed-size carousel、picker、規則的 row list では優先的に検討します。

### Window parameter

`initialNumToRender`、`maxToRenderPerBatch`、`updateCellsBatchingPeriod`、`windowSize`、`removeClippedSubviews` は次に基づいて profiling で調整します。

- first viewport height
- item cost
- target device
- fast scroll 中の blank-window risk
- memory pressure
- platform difference

別 App の「汎用最適値」をコピーしません。

### Pagination と Refresh

- `onEndReached` は idempotent にし、複数回呼ばれて duplicate request を開始しません。
- request 前に loading lock を同期的に設定し、次の React render を待って concurrency を防ごうとしません。
- refresh、initial load、load-more の相互排他ルールを定義します。
- stale closure ではなく最新 cache から cursor を読みます。
- late response は state 書き込み前に request version、query key、cancellation signal を検証します。
- unmount、filter change、account switch 後に old response が新画面へ書き込みません。
- 最終 item 削除後に next page から補充するかを定義し、request loop を作りません。

## 非同期処理と main thread

- 高コストな同期計算を render、scroll handler、press feedback と同じ frame に置きません。
- precompute、pagination、pure data layer への移動が可能な処理を item ごとに繰り返しません。
- scroll event で頻繁に `setState` せず、stable threshold、native/UI-thread animation、throttling strategy を優先します。
- unmount または条件変更で timeout、request、subscription、animation を cleanup します。
- `AbortController`、request version、session lease で無効な非同期 commit を防ぎます。mounted の確認だけでは query / account をまたぐ stale data を防げません。
- 独立した initialization task は並行できますが、順序または security dependency がある task は明示的に serial 実行します。

## 画像とファイル

- list thumbnail は表示 size に合う resource を使い、original large image を download して scale だけに依存しません。
- project-approved image cache、placeholder、error fallback を使います。
- remote image に `resizeMode`、width / height、aspect ratio を定義し、layout shift を減らします。
- scroll 中に base64、大 object、synchronous image processing を繰り返し作りません。
- image preprocessing、crop、compression は submit 前または background stage で行い、press feedback を block しません。
- file type 判定では必要最小限の header だけを読み、大 file 全体を JavaScript memory に読み込みません。
- lifecycle に従い file handle、temporary file、object URL を release / cleanup します。
- large image の animation は、毎 frame source width / height を変えて再 crop せず transform を優先します。

## Animation と Gesture

- project unified animation infrastructure と motion Token を再利用します。
- UI / native thread で実行可能な continuous animation を、毎 frame の React state update に依存させません。
- animation start、cancel、rapid repeated press、component unmount の挙動を定義します。
- transition 中に large-data conversion、bulk log write、large component tree rebuild を同期実行しません。
- Gesture callback で unbounded object、timer、request を作りません。
- reduce-motion mode では project-approved fallback を使います。

## Startup と Navigation

- startup では first screen の正しさに必要な task だけを block します。
- font、Auth restore、required configuration などの dependency order を明確にし、無関係な task は defer または parallelize します。
- Native Splash は App が valid first frame を render できない間だけ保持し、個別 screen から制御しません。
- Root Provider 数と value update を制御し、root で全 feature data を subscribe しません。
- 大きな非 first-screen module の lazy load は bundle と first-screen measurement から決定します。
- incorrect key、conditional Root rebuild、duplicate Provider により画面切り替えで tree 全体を remount しません。

## Cache と Memory

- Cache は owner、key、capacity または cleanup condition を持ちます。
- user-scoped cache を user ごとに隔離し、logout / account switch 時に clear または invalidate します。
- module-level Map または Context に API response を無制限に蓄積しません。
- list pagination は retained page、refresh replacement、deletion behavior を定義します。
- blob、base64、image、file handle、large log を React state に長期保持しません。
- AppState transition または memory warning で resource を release するかは project-specific strategy が決定します。

## Log と debug code

- render、scroll、animation frame、高頻度 listener から console log を出しません。
- Production build に明確な性能コストまたは data leak のある debug log を残しません。
- project-approved performance instrumentation を使い、無効化しても business behavior を変えないようにします。

## Profiling フロー

jank、slow startup、memory growth、list blank window がある場合：

1. 再現 step、data size、device、build type を定義。
2. JS frame、UI frame、network、image、native module、memory のどれが原因か判断。
3. React Native DevTools、platform profiler、project monitoring で根拠を取得。
4. 変更前 baseline を記録。
5. 1 回に 1 つの主要変数だけを変更。
6. 同じ scenario で再測定し、correctness と low-end device regression を確認。
7. 必要な budget と acceptance method を project-specific rule に記録。

性能結論は release または near-release build から得ます。Development mode は診断用であり、最終 metric 用ではありません。

## 性能テストと受け入れ確認

automated test が保護するもの：

- pagination lock と deduplication
- stale response の reject
- Context snapshot reference-stability contract
- cleanup と resource release
- large-data selector / view model の correctness

automated test は real-device profiling を代替しません。最終確認には最低限次を含めます。

- first-screen entry
- fast forward / reverse scroll
- refresh と load-more の concurrency
- image-dense screen
- keyboard open 中の input と list scroll
- Modal / navigation transition
- background restoration
- prolonged use 中の memory trend

## Review checklist

- [ ] optimization 前に再現可能な問題または明示的 budget がある。
- [ ] release または near-release build で性能を検証した。
- [ ] State が最小で適切な owner にある。
- [ ] Context が無関係な高頻度 update を起こさない。
- [ ] memoization に実際の boundary と正しい dependency がある。
- [ ] list key が stable で、pagination / refresh に synchronous lock がある。
- [ ] stale response が新 query、新 screen、新 account を上書きしない。
- [ ] large image、file handle、timer、listener、animation を cleanup する。
- [ ] high-frequency path に log または高コスト同期処理がない。
- [ ] iOS、Android、対象 low-end device tier を検証した。

## 参照基準

- [React Native Performance Overview](https://reactnative.dev/docs/performance)
- [React Native Profiling](https://reactnative.dev/docs/profiling)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [React Native ScrollView](https://reactnative.dev/docs/scrollview)
