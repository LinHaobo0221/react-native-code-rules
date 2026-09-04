# 9. 测试规则

本节是测试策略的完整规则。

### 9.1 测试目标

测试证明的是用户行为、公开合同和系统 invariant 在修改、共通化、重构、升级和异常条件下仍成立，而不是单纯提高覆盖率数字或证明 private method 被调用。

优先保护：

- 核心用户路径和权威动作流程
- 共通组件的公开 props、variant、可访问性和全部直接消费者
- 数据转换、validation、Use Case 和业务计算
- Reducer 状态转换和非法状态防护
- 导航与状态边界
- API contract 和错误映射
- 并发、取消和 stale response
- Auth、存储和账号切换
- 关键交互与可访问性
- 已修复 Bug 的根因
- iOS / Android 原生差异

### 9.2 测试层次

1. **Static Analysis**：formatter、lint、TypeScript typecheck、Expo config、asset、bundle、依赖边界和循环引用检查。
2. **Pure Model / Use Case Test**：formatter、parser、validation、selector、Reducer、Strategy、Use Case、排序、分页合并、日期数字转换、error mapping 和 route mapping。
3. **Hook / Controller Test**：输入、派生 view model、loading、success、error、retry、refresh、load-more、debounce、timer、cleanup、subscription、竞态、optimistic update，以及 Use Case 结果到 UI/导航的映射。
4. **Component Interaction Test**：从用户行为验证文案、输入、press、toggle、select、loading、disabled、error、empty、selected、variant 和 accessibility。
5. **Integration Test**：验证 Page、Controller、Use Case、API adapter、Provider、route guard、Auth coordinator、storage adapter、cache、event 和 pagination 的真实协作。
6. **Native / E2E Test**：验证原生导航、返回手势、键盘、自动填充、safe area、权限、文件、分享、deep link、前后台、EAS / release 构建和原生动画。

共通规约不强制某个 test runner。React Test Renderer 已被 React Native 官方标记为 deprecated，新项目应使用受支持、面向用户行为的 Component Testing 方案；既有项目可以继续维护，但要记录迁移计划和原生验收缺口。

### 9.3 测试文件组织

- 测试默认与被测模块相邻，命名为 `name.test.ts` 或 `name.test.tsx`。
- 共通组件测试覆盖其公开合同；消费者特有业务行为留在各 feature 测试中。
- Use Case 和 Reducer 测试不需要挂载 React 组件。
- 跨 feature helper 放 `mobile/test/`，不要复制到每个 feature。
- Fixture builder 和 deferred helper 使用语义命名。
- 测试 ID 可以使用稳定域前缀，方便需求、缺陷和安全审查追踪。
- 测试描述清楚表达 Given / When / Then 或 Arrange / Act / Assert。
- 一个测试主要证明一个行为或 invariant。
- 不通过测试固定内部文件拆分、private helper 数量或无价值的转发调用。

### 9.4 共通化与控制流测试

共通化或流程重构时，至少验证：

- 新共通组件在所有迁移消费者中保持原行为。
- variant、slot 和默认 props 不产生消费者间状态泄漏。
- Feature-local 组件提升到 `shared` 后不依赖 route、API、Auth 或 feature store。
- 被删除的重复业务规则只剩一个事实源。
- Controller 对每个公开 action 只触发一次权威 Use Case 或直接流程。
- Use Case 的关键步骤顺序、失败短路、幂等/锁和 typed result 正确。
- Reducer 不产生非法状态组合，副作用不在 Reducer 内发生。
- Adapter / Strategy 的多个实现满足同一合同。

测试不要断言 `handleSave` 调用了 `submit`、`submit` 又调用了 `executeSave`。应断言用户提交后产生的结果、外部副作用次数、状态转换和错误反馈。

### 9.5 Deterministic Test

测试必须独立、可重复、与执行顺序无关。需要控制：

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

禁止用真实 `sleep` 或长 timeout 等待异步状态。时间使用 fake timer 或可注入 clock，异步顺序使用 deferred Promise 或受控 mock。

### 9.6 异步和竞态

推荐使用：

```ts
type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};
```

至少覆盖：

- 请求 A 先发后到、请求 B 后发先到
- 页面卸载时 request pending
- 筛选、route param 或账号变化后旧 response 才返回
- refresh 与 load-more 同时触发
- mutation 快速重复点击
- storage write pending 时 logout
- refresh pending 时切换账号
- listener cleanup 后旧事件到达
- picker / permission flow 返回时 AppState 尚未稳定

测试同时断言：

- 哪个结果可以提交
- 哪个结果必须取消或丢弃
- loading lock 是否最终释放
- cache、storage、公开 state 和用户错误是否一致
- 同一用户动作是否因转发、effect 或 listener 被重复执行

不能使用真实网络延迟制造 race。

### 9.7 Mock、API、导航和可访问性

- 优先使用真实纯模块和小型 fake。
- Network、Secure Storage、FileSystem、Image Picker、Linking 和原生模块通过明确 adapter mock。
- Mock 返回值符合真实 contract，包括失败、取消和无效 response。
- 每个 test 重置 call history、implementation 和 module-level 状态。
- 不让 mock、timer、mounted root 或 listener 泄漏到下一个 test。
- 不 mock 被测试的核心行为本身。
- Use Case 依赖使用最小 fake，不为测试复制一套生产业务逻辑。
- API 测试覆盖 method、path、query、body、header、success envelope、runtime validation、错误、timeout、网络、`4xx`、`5xx`、分页、取消、stale response、retry 和敏感 header。
- Unit test 不连接真实 production endpoint。
- 导航测试覆盖入口、参数、push、replace、back、Modal 内返回、关闭整个 flow、Tab、route guard、logout 和 deep link。
- Component test 覆盖 role、label、selected、checked、disabled、expanded、hit target、loading 防重复和错误文本关系。

### 9.8 Snapshot、Bug、Coverage 和 CI

- Snapshot 只用于小型、稳定且有明确审查价值的输出。
- 不为复杂页面或通用 config renderer 生成巨大 snapshot。
- Snapshot 更新必须人工审查。
- 业务计算、交互、状态转换和安全 invariant 使用明确断言。
- Bug 修复优先：写失败测试、最小修复、验证回归、检查同 flow 和共通消费者、完成原生验收。
- Coverage 是发现盲区的信号，不是质量目标本身。
- Auth、支付、权限、数据删除、Use Case 分支和竞态使用 invariant / branch 驱动覆盖。
- 未覆盖关键分支时说明无法自动化的原因和手工验收方式。

推荐 CI 顺序：

1. format / lint / typecheck / dependency boundary
2. 快速 model / use-case unit test
3. Hook / Component / Integration test
4. build / bundle / Expo config 检查
5. 关键 E2E 和 release smoke test

---
