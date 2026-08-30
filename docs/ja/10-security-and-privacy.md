# 10 セキュリティとプライバシー

> 本文書は React Native / Expo App の共通 security / privacy 最低基準を定義します。リスクベースの規約であり、プロジェクトの threat model、backend authorization、法令遵守、正式な security assessment を代替しません。

## Security の責務境界

- Mobile client はユーザーが制御できる device 上で動作し、本当に非公開であるべき server-side secret を保持できません。
- backend は identity、permission、resource ownership、transaction、business fact の最終決定者です。
- Button を隠す、local state を変更する、route を確認する処理は backend authorization を代替しません。
- TypeScript type は実際の network JSON を検証しません。sensitive contract は使用・永続化前に runtime validation が必要です。
- Security control は App、backend、third-party SDK、storage、network、release configuration 全体を対象にし、UI code だけを確認しません。
- high-risk App は business、data type、threat model に基づいて要件を引き上げ、OWASP MASVS control の適用性を記録します。

## 各プロジェクトが定義する security 事実

各 App は `app-specific.md` に次を記録します。

- data classification と sensitive field 一覧
- Auth type、token / session lifecycle、backend contract
- protected storage、通常 KV、database、file cache の選択
- API origin、許可する external origin、development HTTP 例外
- deep link / universal link / app link allowlist
- WebView の許可と制限
- permission 一覧と request timing
- analytics、crash report、logging、third-party SDK の data scope
- logout、account switch、account closure、data deletion 方針
- backup、device migration、biometric 方針
- security test baseline と owner process

これらが決定するまで、実 Auth、永続化、sensitive logging、任意 external URL、third-party data upload を独自に実装しません。

## データ分類と最小化

最低限次へ分類します。

- Public：公開表示 content
- Internal：公開すべきでないが sensitivity が低い runtime 情報
- Personal Data：個人を識別または関連付けできる data
- Sensitive Personal Data：health、financial、precise location、identity document など高感度 data
- Secret：password、token、verification code、private key、credential

必須ルール：

- 機能に本当に必要な data だけを collect、request、store、transmit します。
- 各 field は owner、purpose、storage location、retention period、deletion condition を持ちます。
- 「将来使うかもしれない」という理由で早期に permission を要求したり data を収集したりしません。
- upload 不要で device 内処理が可能なら、local processing の方が privacy goal に適するか評価します。
- third-party SDK に渡す data も本 App の責任範囲です。

## App bundle と設定

- App bundle、JavaScript bundle、`app.json`、asset file、`EXPO_PUBLIC_*` value は読み取り可能とみなします。
- server private key、database credential、long-lived signing secret、administrator token を client に hard-code しません。
- API base URL、public project ID は public configuration にできますが、本当の secret は server または controlled build service に残します。
- `.env` は configuration management であり、client bundle に入った value を secret にはしません。
- source map、debug symbol、build log、CI artifact への access は release process で管理します。

## ローカルストレージ

### 選択原則

- persistence 不要の data は memory だけに保持します。
- 小さい token、key、secret は project-approved platform protected storage を使います。
- access が容易という理由で secret を通常 KV、SQLite、FileSystem に保存しません。
- protected storage は小さい value 向けです。large object、list、file は dedicated storage を使い、sensitivity に応じて encrypt または disk 保存を避けます。
- screen component は secure storage を直接呼ばず、controlled adapter または coordinator を使います。

### Protected storage

Expo SecureStore または別 platform store の利用時に評価します。

- iOS Keychain accessibility level
- Android backup / restore behavior
- device-only と device migration requirement
- uninstall、reinstall、system restore の差異
- biometric / `requireAuthentication` が transparent read の UX に与える影響
- config plugin、native configuration、EAS build
- native read / write / delete failure
- value size limit

protected storage を失敗しないもの、または business source of truth とみなしません。backend は session が有効かを引き続き検証します。

### ファイルと Cache

- ユーザーが明示的に export しない限り、sensitive file を public Downloads、photo library、他 App が access できる directory へ書きません。
- temporary image、attachment、crop result は cleanup strategy を持ちます。
- logout、account switch、user deletion 後に、project policy に従って user-scoped cache を clear / invalidate します。
- file name、metadata、thumbnail、log も sensitive information を漏らす可能性があります。
- backup policy は data classification に従い、secret または sensitive cache を意図せず cloud backup に含めません。

## Token Auth の共通 invariant

App が access / refresh token を使用する場合、最低限次を満たします。具体的 token type、storage、expiration は project architecture が決定します。

### 単一の事実源

- runtime session は 1 つの coordinator / store を事実源にします。
- Provider、screen、API module が個別に変化する token または sign-in state を持ちません。
- public React state は最小限の user / status summary だけを公開し、token または Authorization header を公開しません。

### Persist before publish

session の確立または refresh：

~~~text
response を validate
-> 必要な protected-storage write / delete を完了
-> runtime token を update
-> authenticated snapshot を publish
~~~

persistence が失敗した場合、安定して restore できない authenticated session を UI に publish しません。

### Local-first logout

logout または確定 invalidation：

~~~text
old session version を直ちに invalidate
-> runtime token を clear
-> unauthenticated を publish
-> local storage を非同期 cleanup
-> best-effort で backend revoke を通知
~~~

network または local delete failure によって UI を authenticated に戻しません。

### Stale-result fencing

- Auth request、restore、refresh、authenticated API は current session lease / version を capture します。
- response は state、cache、storage、error の commit 前に lease を再 validate します。
- User A の late response を User B の screen / cache に入れません。
- stale result は internal cancellation として扱い、通常 failure toast を表示せず、新 session を変更しません。

### Refresh

- 1 session 内の concurrent `401` は 1 つの version-scoped refresh flight を共有します。
- refresh flight を session 間で共有しません。
- old access token に対する late `401` は current token と比較し、不要な連続 rotation を避けます。
- 各 business request は明示的 retry budget を持ち、refresh を recursive にしません。
- 通常の business `403` では auto refresh しません。
- network、timeout、不確実な mutation failure で write operation を自動 replay しません。

### Token type の分離

- setup、password reset、email verification など one-time token を通常 session token から分離します。
- one-time token を route params、URL、public Context、analytics、通常 persistent cache へ入れません。
- 通常 API caller が任意 header で current Authorization を override できないようにします。

### Runtime validation

Auth response の persist 前に最低限検証します。

- discriminator / required action
- token が non-empty string
- expiry が valid positive value
- user ID と status が allowed value
- response variant の field combination が mutually exclusive
- refresh rotation result が project contract を満たす
- current principal が予期せず置き換わらない

invalid `2xx` response を success として commit しません。

## ネットワークセキュリティ

- Production / preview は既定で HTTPS だけを使います。
- 明示された local development address は HTTP を許可できますが、unexpected origin へ暗黙 fallback しません。
- API client は fixed / validated base URL を使います。
- authenticated client は feature screen から任意 absolute URL を受けず、relative internal path を優先します。
- token は approved API / Auth origin だけへ送ります。
- object storage upload、external link open、third-party preview request へ App Authorization header を付けません。
- redirect、proxy、cross-origin request で sensitive header leak を防ぎます。
- Production TLS verification を debug configuration または custom client で無効にしません。
- certificate pinning は threat model から判断し、certificate rotation、old App version、incident recovery も同時設計します。operation plan なしに pinning を追加しません。

Request layer が提供するもの：

- timeout
- cancellation
- stable error envelope
- request ID
- controlled header
- response size または file download boundary

safe retry は idempotent read と、server にすでに write 済みかもしれない mutation を区別します。

## External URL、Deep Link、WebView

### External URL

- untrusted string は standard URL parser で parse します。
- allowed scheme を明示し、通常 Web entry は既定で `https` だけを受け、`http` は project decision とします。
- `javascript:`、`data:`、`file:`、unapproved custom scheme を reject します。
- token、personal data、internal ID を third-party URL query に入れません。
- open failure は controlled state を返し、raw exception または sensitive URL を user log に書きません。

### Deep Link

- scheme / host / path / params を validate します。
- stable ID を使い、format / length limit を設けます。
- deep link は Auth route guard、user confirmation、one-time flow token を bypass できません。
- sensitive action を deep-link params だけから直接実行しません。
- after-login destination は allowlist を通し、open redirect を防ぎます。

### WebView

WebView を許可する場合、個別に定義します。

- origin allowlist
- JavaScript enabled
- navigation interception
- file / camera / location permission
- cookie と session boundary
- injected JavaScript と message schema
- download、upload、external navigation

「Web に既存機能がある」という理由だけで任意 URL を WebView に入れません。

## ファイル、画像、アップロード

- system picker が返す MIME、extension、file name は untrusted metadata です。
- upload 前に allowed file type、size、必要な magic bytes を検証します。
- large file 全体を JavaScript memory に読み込まず、判断に必要な最小 header だけを読みます。
- server は MIME、size、signature、ownership、upload status を再検証します。client validation は UX 改善だけです。
- presigned URL または third-party upload origin に App bearer token を送りません。contract が明示し origin が controlled な場合だけ例外です。
- success、failure、cancellation すべてで file handle を close します。
- upload cancel、App background、URI permission expiry の failure behavior を定義します。

## Logging、Analytics、Error reporting

記録できる最小 diagnostic information：

- event name
- stable error code
- HTTP status
- request ID
- platform / App version
- personal data を含まない state transition reason

記録禁止：

- password、verification code
- access / refresh / setup / reset token
- Authorization、Cookie、protected storage value
- complete request / response body
- raw identity document、precise location、contacts、health data
- unredacted email、phone、IP、external URL query

third-party SDK へ入る前に transport または logging adapter で redact します。各 screen developer が手動で覚えることに依存しません。

user-facing error は stack trace、SQL、internal path、token state、backend implementation を表示しません。authentication error は account enumeration を避け、rate limit は安定した一般的な「後で再試行」の意味を使います。

## Permission と platform capability

- permission は機能が本当に必要とする時点で request し、startup 時にまとめて要求しません。
- request 前に実際の用途と一致する説明を提供します。
- denied、restricted、limited、後から revoked の場合に分かりやすい fallback を用意します。
- 拒否したユーザーへ繰り返し要求しません。
- camera、photo library、microphone、location、notification、Bluetooth は最小 scope だけを request します。
- iOS usage description と Android permission は実際の用途を正確に示します。
- separate runtime を持つ background task、extension、share sheet、widget は独立した session / data access design が必要で、main App memory state を利用できると仮定しません。

## プライバシー

privacy design は最低限次を満たします。

- Data minimization：必要な data / resource だけへ access。
- Transparency：collection、storage、sharing、background processing を user が理解できる。
- Consent：consent が必要な processing は同意後に開始し、third-party SDK が先に collect しない。
- User control：user が data を manage、delete、correct し、関連 setting を revoke できる。
- Retention：data を無期限保持せず、deletion / account closure に明確な結果がある。

analytics、advertising、attribution、push、monitoring SDK の追加前に確認します。

- collected field
- default-enabled behavior
- consent signal
- data transfer region と third-party chain
- device identifier
- deletion と opt-out capability
- native permission と package supply-chain risk

## Clipboard、Screenshot、Share

- token、verification code、sensitive field を自動で Clipboard へ copy しません。
- Clipboard content は system または別 App が読めるため、content と retention を制限します。
- sensitive screen で screenshot / recording を禁止するかは、platform limit、usability、support flow を考慮する project risk decision です。
- system Share Sheet には user が明示選択した最小 content だけを渡します。
- file share 前に metadata と cache location が追加情報を漏らさないか確認します。

## 依存関係と supply chain

- dependency を明示宣言し、review 可能な version に固定します。
- new dependency の native permission、network behavior、maintenance status、transitive dependency を確認します。
- lockfile を commit します。
- security update は test / release workflow を通し、review なしで major version を business branch から直接 upgrade しません。
- untrusted source の install script、binary、copied code を実行しません。
- unmaintained SDK、known vulnerability、excessive permission には replacement plan を作ります。

## セキュリティテスト

機能範囲に応じて扱います。

- protected storage read / write / delete failure
- persist-before-publish
- local-first logout
- refresh singleflight と retry limit
- concurrent logout / refresh / login
- stale response が new account を汚染しない
- invalid Auth / API response を reject
- token が Context、route、log、analytics payload に入らない
- URL scheme、host、redirect validation
- deep-link route guard
- file MIME、size、magic bytes、URI expiry
- permission denied / limited / revoked
- logout / account switch 後の cache cleanup
- production configuration が unexpected HTTP を reject

Node test は Keychain、Keystore、TLS、backup、permission、real deep-link configuration の正しさを証明できません。iOS / Android release build で検証し、必要に応じて正式な mobile security assessment を行います。

## Security review checklist

- [ ] data を分類し、minimization に従っている。
- [ ] client bundle に本当の secret がない。
- [ ] secret は controlled adapter だけを通して protected storage に入る。
- [ ] token が public React state、route、URL、log、analytics に入らない。
- [ ] backend が identity、account status、permission、resource ownership を引き続き検証する。
- [ ] production network が controlled HTTPS origin を使う。
- [ ] Auth header を external link または object storage へ送らない。
- [ ] async Auth / API response に stale-result fencing がある。
- [ ] external URL、deep link、file、network response を untrusted input として扱う。
- [ ] permission を必要時に request し、denial fallback がある。
- [ ] third-party SDK の data / consent behavior を review した。
- [ ] logout、account switch、data deletion に明示 cleanup がある。
- [ ] iOS / Android release build で security acceptance を完了した。

## 参照基準

- [OWASP Mobile Application Security Verification Standard](https://mas.owasp.org/MASVS/)
- [OWASP MASVS Storage](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/)
- [OWASP MASVS Network](https://mas.owasp.org/MASVS/08-MASVS-NETWORK/)
- [OWASP MASVS Privacy](https://mas.owasp.org/checklists/MASVS-PRIVACY/)
- [Expo Store data](https://docs.expo.dev/develop/user-interface/store-data/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
