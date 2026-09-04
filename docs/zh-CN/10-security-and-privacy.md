# 10. 安全与隐私规则

本节是安全与隐私的完整规则。

### 10.1 责任边界

- Mobile 客户端运行在用户可控制的设备上，不能保存真正不可公开的服务端秘密。
- 后端是身份、权限、资源归属、交易和业务事实的最终裁决者。
- 隐藏 Button、修改本地 state 或检查 route 不能替代服务端授权。
- TypeScript 类型不能验证真实网络 JSON；敏感 contract 在使用和持久化前需要运行时验证。
- 安全控制必须覆盖 App、后端、第三方 SDK、存储、网络和发布配置。

### 10.2 数据分类和最小化

至少区分：

- Public：公开展示内容
- Internal：不应公开但敏感度较低的信息
- Personal Data：可识别或关联个人的数据
- Sensitive Personal Data：健康、财务、精确位置、身份材料等高敏感数据
- Secret：password、token、verification code、private key、credential

必须：

- 只收集、请求、存储和传输功能真正需要的数据。
- 每个数据字段有 owner、用途、保存位置、保留期限和删除条件。
- 不因“以后可能使用”提前申请权限或采集数据。
- 评估能否在本地完成而无需上传。
- 将第三方 SDK 接收的数据视为 App 自身责任。

### 10.3 Bundle、配置和本地存储

- App bundle、JavaScript bundle、`app.json`、资源文件和 `EXPO_PUBLIC_*` 都视为可读取。
- 不能硬编码 private key、数据库 credential、长期签名 secret 或管理员 token。
- API base URL、公开项目 ID 可以进入公开配置，真正秘密必须留在服务端或受控构建服务。
- `.env` 只解决配置管理，不会把打包进客户端的值变成秘密。
- Source map、debug symbol、构建日志和 CI artifact 的权限由发布流程管理。
- 不需要持久化的数据只保留在内存。
- 少量 token、key 或 secret 使用项目批准的 protected storage。
- 普通 KV、SQLite 和 FileSystem 不能因为方便而保存 secret。
- 页面不能直接调用底层安全存储，必须通过受控 adapter 或 coordinator。
- 敏感文件不写入公共 Downloads、相册或其他 App 可访问目录，除非用户明确发起导出。
- 临时图片、附件和裁切结果必须有清理策略。
- logout、账号切换和删除后，user-scoped cache 按项目策略清理或失效。
- 文件名、metadata、thumbnail 和日志也可能泄露敏感信息。

### 10.4 Auth Token Invariants

#### 单一事实源

- 运行时 session 只有一个 coordinator / store 事实源。
- Provider、页面和 API module 不各自维护可独立变化的 token 或登录态。
- 公开 React state 只暴露最小用户和状态摘要，不暴露 token 或 Authorization header。

#### Persist Before Publish

```text
验证 response
-> 完成必要 protected storage 写入或删除
-> 更新 runtime token
-> 发布 authenticated snapshot
```

持久化失败时，不能向 UI 发布无法稳定恢复的 authenticated session。

#### Local-First Logout

```text
立即使旧 session version 失效
-> 清空 runtime token
-> 发布 unauthenticated
-> 异步清理本地存储
-> best-effort 通知后端 revoke
```

网络或本地 delete 失败不能让 UI 回滚为已登录。

#### Stale Result Fencing

- Auth request、restore、refresh 和 authenticated API 捕获当前 session lease / version。
- response 提交 state、cache、storage 或错误前再次验证 lease。
- User A 的迟到 response 不能进入 User B 的页面或 cache。
- stale result 作为内部 cancellation，不显示普通失败 toast，也不改变新 session。

#### Refresh

- 同一 session 的并发 `401` 共享一个 version-scoped refresh flight。
- refresh flight 不能跨 session 复用。
- 旧 access token 的延迟 `401` 先与 current token 比较，避免无意义 rotation。
- 每个业务请求有明确 retry budget，不能递归 refresh。
- 普通业务 `403` 不自动 refresh。
- network、timeout 和不确定的 mutation 失败不自动重放写操作。

#### Token 类型和运行时验证

- setup、password reset、email verification 等一次性 token 与正式 session token 分离。
- 一次性 token 不放 route params、URL、公开 Context、analytics 或普通持久 cache。
- 普通 API 调用方不能任意覆盖当前 Authorization header。
- Auth response 保存前验证 discriminator、required action、token 非空、expiry 有效、user ID、状态、response variant 互斥字段、refresh rotation 和 current principal。
- 无效的 `2xx` response 不能作为成功提交。

### 10.5 网络、URL、Deep Link 和 WebView

- Production 和 preview 默认只使用 HTTPS。
- 本地开发 HTTP 例外必须明确，不能静默回退到非预期 origin。
- API client 使用固定、可验证的 base URL。
- Authenticated client 优先接受相对内部 path，不接受页面传入任意 absolute URL。
- Token 只发送到项目批准的 API / Auth origin。
- 上传对象存储、打开外部链接或请求第三方 preview 时不附带 App Authorization header。
- TLS 校验不能在 production 被关闭。
- Request 层提供 timeout、cancellation、稳定错误 envelope、request ID、受控 header 和 response size / 文件下载边界。
- 外部 URL 使用标准 parser，明确允许的 scheme。
- 拒绝 `javascript:`、`data:`、`file:` 和未批准自定义 scheme。
- 不把 token、个人数据或内部 ID 拼进第三方 URL query。
- Deep Link 验证 scheme、host、path 和 params，使用稳定 ID 并限制格式和长度。
- Deep Link 不能绕过 Auth route guard、用户确认或一次性 flow token。
- 登录后跳转目标必须 allowlist，避免 open redirect。
- 如果允许 WebView，必须定义 origin allowlist、JavaScript、navigation interception、文件/相机/位置权限、cookie、injected JavaScript、message schema、下载、上传和外部跳转策略。

### 10.6 文件、图片、上传和日志

- 系统 picker 返回的 MIME、扩展名和文件名是不可信 metadata。
- 上传前验证允许的文件类型、大小和必要 magic bytes。
- 服务端必须再次验证 MIME、大小、签名、归属和上传状态。
- Presigned URL 或第三方上传 origin 不接收 App bearer token，除非 contract 明确要求且 origin 受控。
- File handle 在成功、失败和取消路径都要关闭。
- 上传取消、App background 和 URI 权限失效有明确失败处理。

可以记录的最小诊断信息：

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

必须在 transport 或 logging adapter 进入第三方 SDK 前完成 redaction。用户可见错误不显示 stack trace、SQL、内部 path、token 状态或后端实现。

### 10.7 权限、隐私、剪贴板和分享

- 权限在功能真正需要时请求，不在启动时批量申请。
- 申请前提供用途说明。
- 用户拒绝、限制、部分授权和从设置撤回后提供可理解 fallback。
- 不反复骚扰已拒绝用户。
- 相机、相册、麦克风、位置、通知和蓝牙只请求最小范围。
- iOS usage description 和 Android permission 准确反映真实用途。
- Background task、extension、share sheet、widget 等独立 runtime 单独设计 session 和数据访问。
- 只访问必要数据和资源。
- 需要同意的处理必须在同意后开始，第三方 SDK 不应提前采集。
- 用户应能管理、删除、修改数据或撤回设置。
- 数据不无限期保留，删除和注销有明确结果。
- 不自动把 token、验证码或敏感字段复制到 Clipboard。
- 敏感页面是否禁止截图或录屏属于项目风险决策。
- Share Sheet 只接收用户明确选择的最小内容。
- 分享文件前检查 metadata 和缓存位置不会泄露额外信息。

### 10.8 依赖与安全测试

- 依赖显式声明并固定可审查版本。
- 新依赖审查 native 权限、网络行为、维护状态和传递依赖。
- Lockfile 进入版本控制。
- 安全更新经过测试和发布流程，不能未经审查直接升级 major。
- 不从不可信来源执行安装脚本、二进制或未知代码。
- 停止维护、有已知漏洞或权限过大的 SDK 要制定替换计划。

至少测试：

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
- 文件 MIME、size、magic bytes 和 URI 失效
- permission denied / limited / revoked
- logout 与账号切换后的 cache 清理
- Production 不允许非预期 HTTP

Node test 不能证明 Keychain、Keystore、TLS、backup、permission 和真实 deep link 配置正确，这些必须通过 iOS / Android release 构建验证，必要时进行正式移动端安全测试。

---
