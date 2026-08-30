# 09 测试策略

> 本文件定义 React Native / Expo App 的共通测试原则、层次、异步竞态和交付要求。具体 runner、component testing library、E2E 工具和 CI 命令由项目级规约决定。

## 测试目标

测试的目标是证明用户行为和系统 invariants 在修改、重构、升级和异常条件下仍然成立，而不是单纯提高覆盖率数字。

测试应优先保护：

- 核心用户路径
- 数据转换和业务计算
- 导航与状态边界
- API contract 和错误映射
- 并发、取消和 stale response
- Auth、存储和账号切换
- 关键交互与可访问性
- 已修复 bug 的根因
- iOS / Android 原生差异

## 项目必须定义的测试事实

每个 App 应在 `app-specific.md` 中记录：

- test runner 与版本
- 测试环境和路径 alias
- unit / hook / component / integration / E2E 工具
- native module mock 入口
- 全局 setup 与 cleanup
- CI required checks
- 覆盖率策略
- iOS / Android 手工或自动验收矩阵
- flaky test 处理流程

共通规约不强制 Jest、Vitest 或某个 E2E package。

## 测试层次

### 1. Static Analysis

最低层包括：

- formatter / format check
- lint
- TypeScript typecheck
- Expo config、asset 或 bundle 检查

Static analysis 不能替代运行时测试，但应作为每次变更的基础反馈。

### 2. Pure Unit Test

适合测试：

- formatter 与 parser
- view model 转换
- reducer
- selection / sorting / pagination merge
- date、number、unit 转换
- validation 与 error mapping
- stable ID 和 route mapping

纯函数测试应快速、无网络、无 React、无原生环境，并覆盖边界输入和无效输入。

### 3. Hook / State Test

适合测试：

- 输入和派生状态
- loading / success / error / retry
- refresh 与 load-more
- debounce / countdown / timer
- effect cleanup
- event subscription
- request race 与 stale response
- optimistic update 和 rollback

Hook 测试必须用项目批准的 React 测试环境，并将 update 包在正确的 `act` 边界内。每个测试结束后必须 unmount 和清理 subscription、timer、mock 与 pending work。

### 4. Component Interaction Test

从用户可感知行为测试：

- 文案和控件是否出现
- 用户输入后显示什么
- press / toggle / select 是否触发正确回调
- loading / disabled 是否阻止重复动作
- error / empty / selected 状态
- accessibility role、label 和 state

优先通过文本、role、label 和用户动作查询。`testID` 只用于没有稳定可访问入口或 E2E 必须定位的节点。

避免断言：

- 组件内部 state
- 私有 Hook 实现
- 无用户意义的 props 结构
- 因重构很容易变化的大型组件树

React Native 官方当前将 React Test Renderer 标记为 deprecated。因此：

- 共通规约不把 `test-renderer` 设为新项目标准。
- 既有项目可在未批准新增依赖前继续维护现有测试，但应记录迁移计划和原生验收缺口。
- 新项目应选择当前受支持、面向用户行为的 component testing 方案，并写入项目级规约。

### 5. Integration Test

Integration test 验证多个真实模块之间的协作，例如：

- Page Hook + API adapter + error mapping
- Provider + route guard + navigation intent
- Auth coordinator + storage adapter + API client
- list cache + feature event + pagination
- form + validation + mutation + completion state

只 mock 真正的边界，例如网络、系统存储、时间、文件、相册和导航宿主；内部纯函数和业务模块尽量使用真实实现。

### 6. Native / End-to-End Test

E2E 或原生手工验收覆盖 JavaScript 测试无法证明的内容：

- 原生导航和返回手势
- 键盘、自动填充和系统返回
- safe area、StatusBar 和 edge-to-edge
- 权限、相册、相机、文件和分享
- deep link 与冷启动
- App 前后台切换
- EAS / release 构建行为
- iOS / Android 原生组件和动画

E2E 优先覆盖少量高价值路径，例如启动、登录、核心功能、支付或账号操作；不把所有 unit case 重复搬到慢速 E2E。

## 测试文件组织

- 测试默认与被测模块相邻，命名为 `name.test.ts` 或项目规定形式。
- 跨 feature test helper 放 `mobile/test/`，不复制到每个 feature。
- Fixture builder 和 deferred helper 使用语义命名，不形成难以理解的通用测试框架。
- 测试 ID 可以采用稳定域前缀，便于需求、缺陷和安全审查追踪。
- 测试描述应清楚表达 Given / When / Then，或 Arrange / Act / Assert。

一个测试应主要证明一个行为或 invariant。多个断言可以存在，但必须共同支持同一个结论。

## Deterministic Test

测试必须可独立运行、可重复、与执行顺序无关。

必须控制：

- 当前时间和时区
- timer、animation frame 和 idle callback
- UUID / random
- network response
- AppState
- platform
- permissions
- file metadata
- storage state
- global singleton 与 module cache

禁止用真实 `sleep` 或长 timeout 等待异步状态“碰巧完成”。

时间逻辑使用 fake timer 或可注入 clock。异步顺序使用 deferred Promise 或受控 mock 精确推进。

## 异步与竞态测试

高级移动端测试必须覆盖正常成功之外的时间线。

推荐使用 deferred Promise：

```ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};
```

重点场景：

- 请求 A 先发后到，请求 B 后发先到
- 页面卸载时 request pending
- 筛选、route param 或账号已变化，旧 response 才返回
- refresh 与 load-more 同时触发
- mutation 快速重复点击
- storage write pending 时 logout
- refresh pending 时切换账号
- listener cleanup 后旧事件到达
- picker / permission flow 返回时 AppState 尚未稳定

测试注释应写清时间线，并同时断言：

- 哪个结果可以提交
- 哪个结果必须取消或丢弃
- loading lock 最终是否释放
- cache、storage、公开 state 和用户错误是否一致

测试不能依赖真实网络延迟制造 race。

## Mock 原则

- 优先使用真实纯模块和小型 fake，避免过度 mock 内部实现。
- Network、Secure Storage、FileSystem、Image Picker、Linking 和原生模块在 Node 测试中通过明确 adapter mock。
- Mock 返回值必须符合真实 contract，包括失败、取消和无效 response。
- 每个 test 重置 call history、implementation 和 module-level 状态。
- 不让一个 test 的 mock、timer、mounted root 或 listener 泄漏到下一个 test。
- 不 mock 被测试的核心行为本身，否则测试只会证明 mock 正确。

## API 与数据测试

API 层至少覆盖：

- method、path、query、body 和 header
- success envelope 与 runtime validation
- stable error code 映射
- timeout、network、`4xx` 和 `5xx`
- pagination cursor 与去重
- cancellation / stale response
- mutation 是否允许 retry
- 敏感 header 不被任意调用方覆盖

不要在 unit test 连接真实 production endpoint。

若 contract 与 backend 共享，前后端应分别验证自己的边界，并通过 contract test 或 shared schema 防止漂移。

## 导航测试

至少覆盖：

- 正确入口和 route 参数
- push / replace / back 语义
- modal 内返回与关闭整个 flow 的差别
- tab 子页面不会生成第二份 tab bar
- logout、账号失效和 deep link 的 route guard
- Root 不因普通状态变化意外 remount
- 返回手势不能进入已失效的受保护页面

Node integration test 只能验证状态与导航意图；原生动画、手势和系统返回仍需双端验证。

## 组件与可访问性测试

关键交互组件至少验证：

- role 与 label
- selected / checked / disabled / expanded state
- visual disabled 与实际事件阻止一致
- hit target 扩展不改变视觉布局
- loading 时 callback 不重复触发
- 错误文本与输入之间有可理解关系
- 动态字体或长文案不会让主要操作消失

颜色、像素和布局细节优先通过 Figma 视觉 QA 或视觉回归工具验证，不使用大量脆弱 style object 断言代替。

## Snapshot Test

- Snapshot 只用于小型、稳定且有明确审查价值的输出。
- 不为整个复杂页面生成巨大 snapshot。
- Snapshot 更新必须人工审查，不以批量更新消除失败。
- 业务计算、交互和安全 invariant 必须使用明确断言，不能只依赖 snapshot。

## Bug 修复

修复 bug 时优先流程：

1. 写出能稳定复现根因的失败测试。
2. 实施最小修复。
3. 证明回归测试通过。
4. 检查同 flow 或共享组件的直接使用方。
5. 完成必要原生验收。

如果 bug 只能在真机、系统 picker 或特定导航状态复现，保留详细手工复现步骤，并尽可能为可分离的状态机补自动测试。

## Coverage

- Coverage 是发现盲区的信号，不是质量目标本身。
- 不能为追求行覆盖率测试无意义 getter 或实现细节。
- Auth、支付、权限、数据删除和竞态等高风险模块应采用 invariant / branch 驱动的覆盖要求。
- 新增未覆盖关键分支时，应说明为什么无法自动化以及对应手工验收。

## CI 分层

推荐反馈顺序：

1. format / lint / typecheck
2. 快速 unit test
3. hook / component / integration test
4. build / bundle / Expo config 检查
5. 关键 E2E 与 release smoke test

快速检查应阻止明显错误；慢速原生测试可以按 Pull Request、release candidate 或夜间任务运行。具体策略由项目级规约决定。

## Review 清单

- [ ] 测试保护用户行为或系统 invariant，而不是实现细节。
- [ ] 测试可独立、确定性运行。
- [ ] 所有 mounted root、timer、listener 和 mock 会清理。
- [ ] 异步 race 使用受控 Promise，不使用真实 sleep。
- [ ] 成功、失败、取消和 stale 路径均按风险覆盖。
- [ ] Component test 优先使用 role、label 和用户动作。
- [ ] 原生能力没有仅靠 Node mock 宣称完成。
- [ ] Bug 修复包含根因回归测试或明确手工验收。
- [ ] CI 命令和存量失败已清楚记录。

## 参考基线

- [React Native Testing Overview](https://reactnative.dev/docs/testing-overview)
