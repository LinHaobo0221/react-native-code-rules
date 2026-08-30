# 10 安全与隐私

> 本文件定义 React Native / Expo App 的共通安全与隐私下限。它以风险为基础，不替代项目 threat model、后端授权、法律合规或正式安全评估。

## 安全责任边界

- Mobile 客户端运行在用户可控制的设备上，不能保存真正不可公开的服务端秘密。
- 后端是身份、权限、资源归属、交易和业务事实的最终裁决者。
- 隐藏 Button、修改本地 state 或检查 route 不能替代服务端授权。
- TypeScript 类型不能验证真实网络 JSON；敏感 contract 在使用和持久化前需要运行时验证。
- 安全控制必须覆盖 App、后端、第三方 SDK、存储、网络和发布配置，不能只检查 UI 代码。
- 高风险 App 应基于业务、数据类型和威胁模型提高要求，并记录对 OWASP MASVS 控制的适用性。

## 项目必须定义的安全事实

每个 App 应在 `app-specific.md` 中记录：

- 数据分类和敏感字段清单
- Auth 类型、token / session 生命周期和后端 contract
- protected storage、普通 KV、数据库和文件缓存选择
- API origin、允许的外部 origin 和开发 HTTP 例外
- deep link / universal link / app link allowlist
- WebView 是否允许及限制
- 权限清单和申请时机
- analytics、crash、logging 和第三方 SDK 数据范围
- logout、账号切换、注销和数据删除策略
- backup、device migration 与 biometric 策略
- 安全测试基线和负责流程

未完成这些决策前，不能自行实现真实 Auth、持久化、敏感日志、任意外部 URL 或第三方数据上传。

## 数据分类与最小化

至少区分：

- Public：公开展示内容
- Internal：不应公开但敏感度较低的运行信息
- Personal Data：可识别或关联个人的数据
- Sensitive Personal Data：健康、财务、精确位置、身份材料等高敏感数据
- Secret：password、token、verification code、private key、credential

必须遵守：

- 只收集、请求、存储和传输功能真正需要的数据。
- 数据字段必须有 owner、用途、保存位置、保留期限和删除条件。
- 不因“以后可能使用”提前申请权限或采集数据。
- 能在设备本地完成且无需上传的处理，应评估本地处理是否更符合隐私目标。
- 分享给第三方 SDK 的数据也属于本 App 的责任范围。

## App Bundle 与配置

- App bundle、JavaScript bundle、`app.json`、资源文件和 `EXPO_PUBLIC_*` 值都应视为可被读取。
- 不在客户端硬编码服务端 private key、数据库 credential、长期签名 secret 或管理员 token。
- API base URL、公开项目 ID 等可以进入公开配置；真正秘密必须留在服务端或受控构建服务中。
- `.env` 只解决配置管理，不会让打包进客户端的值变成秘密。
- Source map、debug symbol、构建日志和 CI artifact 的访问权限必须由发布流程管理。

## 本地存储

### 选择原则

- 不需要持久化的数据只保留在内存。
- 少量 token、key 或 secret 使用项目批准的平台 protected storage。
- 普通 KV、SQLite 和 FileSystem 不能因使用方便而保存 secret。
- Protected storage 适合小值；大对象、列表和文件使用专用存储，并根据数据敏感度加密或避免落盘。
- 页面组件不能直接调用底层安全存储；通过受控 adapter 或 coordinator。

### Protected Storage

采用 Expo SecureStore 或其他平台存储时，项目必须评估：

- iOS Keychain accessibility level
- Android backup / restore 行为
- device-only 与设备迁移要求
- 卸载、重装和系统恢复差异
- biometric / `requireAuthentication` 对无感读取的 UX 影响
- config plugin、原生配置和 EAS build
- native read / write / delete 失败
- value 大小限制

不能将安全存储视为永不失败或业务事实源。服务端必须验证 session 是否仍有效。

### 文件与 Cache

- 敏感文件不写入公共 Downloads、相册或其他 App 可访问目录，除非用户明确发起导出。
- 临时图片、附件和裁切结果必须有清理策略。
- logout、账号切换和用户删除后，user-scoped cache 按项目策略清理或失效。
- 文件名、metadata、thumbnail 和日志也可能泄露敏感信息。
- Backup policy 必须与数据分类一致，不能无意将 secret 或敏感 cache 纳入云备份。

## Token Auth 的共通 Invariants

若 App 使用 access / refresh token，至少满足以下原则。具体 token 类型、存储位置和过期策略由项目级架构确定。

### 单一事实源

- 运行时 session 只有一个 coordinator / store 事实源。
- Provider、页面和 API module 不各自维护可独立变化的 token 或登录态。
- 公开 React state 只暴露最小用户和状态摘要，不暴露 token 或 Authorization header。

### Persist Before Publish

建立或刷新 session 时：

```text
验证 response
-> 完成必要 protected storage 写入或删除
-> 更新 runtime token
-> 发布 authenticated snapshot
```

持久化失败时，不能向 UI 发布一个无法稳定恢复的 authenticated session。

### Local-First Logout

logout 或确定失效时：

```text
立即使旧 session version 失效
-> 清空 runtime token
-> 发布 unauthenticated
-> 异步清理本地存储
-> best-effort 通知后端 revoke
```

网络或本地 delete 失败不能让 UI 回滚为已登录。

### Stale Result Fencing

- Auth request、restore、refresh 和 authenticated API 捕获当前 session lease / version。
- response 在提交 state、cache、storage 或错误前再次验证 lease。
- User A 的迟到 response 不能进入 User B 的页面或 cache。
- stale result 作为内部 cancellation，不显示普通失败 toast，也不改变新 session。

### Refresh

- 同一 session 的并发 `401` 共享一个 version-scoped refresh flight。
- refresh flight 不能跨 session 复用。
- 旧 access token 的延迟 `401` 先与 current token 比较，避免连续无意义 rotation。
- 每个业务请求有明确 retry budget；不能递归 refresh。
- 普通业务 `403` 不自动 refresh。
- network、timeout 和不确定的 mutation 失败不自动重放写操作。

### Token 类型隔离

- setup、password reset、email verification 等一次性 token 与正式 session token 分离。
- 一次性 token 不放 route params、URL、公开 Context、analytics 或普通持久 cache。
- 不允许普通 API 调用方通过任意 header 覆盖当前 Authorization。

### Runtime Validation

Auth response 保存前至少验证：

- discriminator / required action
- token 为非空 string
- expiry 为有效正数
- user ID 和状态属于允许值
- 不同 response variant 的字段组合互斥
- refresh rotation 结果满足项目 contract
- current principal 未被意外替换

无效 `2xx` response 不能作为成功提交。

## 网络安全

- Production 和 preview 默认只使用 HTTPS。
- 明确本地开发地址可允许 HTTP，但不能静默回退到非预期 origin。
- API client 使用固定、可验证的 base URL。
- Authenticated client 优先接受相对内部 path，不接受业务页面传入任意 absolute URL。
- Token 只发送给项目批准的 API / Auth origin。
- 上传到对象存储、打开外部链接或请求第三方 preview 时，不附带 App Authorization header。
- Redirect、代理和跨 origin 请求必须防止敏感 header 泄露。
- TLS 校验不能在 production 被 debug 配置或自定义 client 关闭。
- Certificate pinning 是否需要应基于 threat model 决定，并同时设计证书轮换、App 版本滞后和故障恢复；不能无运维方案地临时加入。

Request 层应提供：

- timeout
- cancellation
- stable error envelope
- request ID
- 受控 header
- response size 或文件下载边界

安全 retry 规则必须区分幂等读取和可能已在服务端写入的 mutation。

## 外部 URL、Deep Link 与 WebView

### 外部 URL

- 对不可信字符串使用标准 URL parser。
- 明确允许的 scheme，普通网页入口默认只接受 `https`，是否允许 `http` 由项目决定。
- 拒绝 `javascript:`、`data:`、`file:` 和未批准自定义 scheme。
- 不把 token、个人数据或内部 ID 拼进第三方 URL query。
- 打开失败返回受控状态，不把原始异常或敏感 URL 写入用户日志。

### Deep Link

- 验证 scheme / host / path / params。
- 使用稳定 ID 并做格式和长度限制。
- Deep link 不能绕过 Auth route guard、用户确认或一次性 flow token。
- 敏感操作不能仅凭 deep link 参数直接执行。
- 登录后跳转目标必须经过 allowlist，避免 open redirect。

### WebView

若项目允许 WebView，必须单独定义：

- origin allowlist
- JavaScript 是否启用
- navigation interception
- file / camera / location 权限
- cookie 与 session 边界
- injected JavaScript 和 message schema
- 下载、上传和外部跳转

不因“网页已经有功能”就默认把任意 URL 放入 WebView。

## 文件、图片与上传

- 系统 picker 返回的 MIME、扩展名和文件名属于不可信 metadata。
- 上传前验证允许的文件类型、大小和必要的 magic bytes。
- 只读取完成判断所需的最小文件头，避免把大文件整体读入 JS 内存。
- 服务端必须再次验证 MIME、大小、签名、归属和上传状态；客户端验证只改善 UX。
- Presigned URL 或第三方上传 origin 不接收 App bearer token，除非 contract 明确要求且 origin 受控。
- File handle 在成功、失败和取消路径都要关闭。
- 上传取消、App background 和 URI 权限失效需要明确失败处理。

## 日志、Analytics 与错误上报

可以记录最小诊断信息，例如：

- event name
- stable error code
- HTTP status
- request ID
- platform / app version
- 不含个人数据的状态迁移原因

禁止记录：

- password、verification code
- access / refresh / setup / reset token
- Authorization、Cookie 和 protected storage value
- 完整 request / response body
- 原始身份证件、精确位置、通讯录或健康数据
- 未脱敏 email、phone、IP 或外部 URL query

必须在 transport 或 logging adapter 进入第三方 SDK 前完成 redaction。不能依赖每个页面开发者手动记住脱敏。

用户可见错误不显示 stack trace、SQL、内部 path、token 状态或后端实现。认证失败文案应避免账号枚举；rate limit 使用稳定、通用的稍后重试语义。

## 权限与平台能力

- 权限在功能真正需要时请求，不在启动时批量申请。
- 申请前提供与用途一致的说明。
- 用户拒绝、限制、仅部分授权和从设置撤回后，App 有可理解 fallback。
- 不反复骚扰已拒绝用户。
- 相机、相册、麦克风、位置、通知和蓝牙只请求最小范围。
- iOS usage description 与 Android permission 必须准确反映真实用途。
- Background task、extension、share sheet 或 widget 若使用独立 runtime，需要单独设计 session 与数据访问，不假设主 App 内存状态可用。

## 隐私

隐私设计至少满足：

- Data minimization：只访问必要数据和资源。
- Transparency：用户能理解收集、存储、共享和后台处理行为。
- Consent：需要同意的处理在同意后开始，第三方 SDK 不应提前采集。
- User control：用户可以管理、删除、修改数据或撤回相关设置。
- Retention：数据不无限期保留，删除和注销流程有明确结果。

新增 analytics、广告、归因、推送或监控 SDK 前，必须审查：

- 收集字段
- 默认启用行为
- consent 信号
- 数据发送地区和第三方链路
- device identifier
- 删除和 opt-out 能力
- 原生权限与 package supply-chain 风险

## Clipboard、Screenshot 与分享

- 不自动把 token、验证码或敏感字段复制到 Clipboard。
- Clipboard 内容可能被系统或其他 App 读取，应限制内容和保留时间。
- 敏感页面是否禁止 screenshot / screen recording 是项目风险决策，必须评估平台限制、可用性和客服场景。
- 系统 Share Sheet 只接收用户明确选择的最小内容。
- 分享文件前确认其 metadata 和缓存位置不会暴露额外信息。

## 依赖与供应链

- 依赖必须显式声明并固定可审查版本。
- 新依赖审查 native 权限、网络行为、维护状态和传递依赖。
- Lockfile 进入版本控制。
- 安全更新应经过测试和发布流程，不直接在业务分支无审查升级 major version。
- 不从不可信来源执行安装脚本、二进制或复制未知代码。
- 停止维护、存在已知漏洞或权限过大的 SDK 应制定替换计划。

## 安全测试

根据功能至少覆盖：

- protected storage read / write / delete 失败
- persist-before-publish
- local-first logout
- refresh singleflight 和 retry 上限
- logout / refresh / login 并发
- stale response 不污染新账号
- 无效 Auth / API response 被拒绝
- token 不进入 Context、route、log 和 analytics payload
- URL scheme、host 和 redirect 验证
- deep link route guard
- file MIME、size、magic bytes 和 URI 失效
- permission denied / limited / revoked
- logout 与账号切换后的 cache 清理
- production 配置不允许非预期 HTTP

Node test 不能证明 Keychain、Keystore、TLS、backup、permission 和真实 deep link 配置正确；这些项目需要 iOS / Android release 构建验证，必要时进行正式移动端安全测试。

## 安全 Review 清单

- [ ] 数据已分类，并遵守最小化原则。
- [ ] 客户端 bundle 中没有真正秘密。
- [ ] Secret 只通过受控 adapter 进入 protected storage。
- [ ] Token 不进入公开 React state、route、URL、日志或 analytics。
- [ ] 后端仍执行身份、账号状态、权限和资源归属校验。
- [ ] Production 网络使用受控 HTTPS origin。
- [ ] Auth header 不会被发送到外部链接或对象存储。
- [ ] Async Auth / API response 具备 stale-result fencing。
- [ ] 外部 URL、deep link、文件和网络 response 被视为不可信输入。
- [ ] 权限按需申请，拒绝后有 fallback。
- [ ] 第三方 SDK 的数据与 consent 行为已审查。
- [ ] Logout、账号切换和数据删除有明确清理策略。
- [ ] iOS / Android release 构建完成安全相关验收。

## 参考基线

- [OWASP Mobile Application Security Verification Standard](https://mas.owasp.org/MASVS/)
- [OWASP MASVS Storage](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/)
- [OWASP MASVS Network](https://mas.owasp.org/MASVS/08-MASVS-NETWORK/)
- [OWASP MASVS Privacy](https://mas.owasp.org/checklists/MASVS-PRIVACY/)
- [Expo Store data](https://docs.expo.dev/develop/user-interface/store-data/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
