# 4. Page、UI、复用、Controller 和样式规则

### 4.1 Page 职责

Page 负责：

- 组合页面结构和 section
- 调用页面或 flow Controller Hook
- 将状态和意图级动作传递给 UI 组件
- 表达页面级 loading、error、empty、content 分支
- 连接 Controller 暴露的状态与动作；页面本身不拆解 Use Case 的底层结果

推荐页面读取形态：

```ts
const { state, actions } = useProfileEditorController();

return (
  <ProfileEditorView
    value={state.form}
    status={state.status}
    onChange={actions.changeField}
    onSubmit={actions.submit}
  />
);
```

Page 不应长期承担：

- 大量输入状态和互相调用的 handler
- 复杂 API、缓存、存储编排
- 底层 SVG、渐变和装饰细节
- 多个无关 section 的完整 JSX
- 大量硬编码数据

简单、局部且没有共享价值的页面可以直接使用少量 `useState` 和一个清楚的 handler，不要求为了形式创建 Controller 或 Use Case。

### 4.2 Feature UI 职责

Feature UI 负责当前功能内的展示和用户输入，通过 props 接收状态和回调。

默认不负责：

- 导航决策
- API 请求
- Auth 或存储访问
- 跨页面业务事实
- 与页面生命周期强耦合的副作用
- 调用 Use Case 或把多个业务动作重新编排

UI 回调表达用户意图，例如 `onSubmit`、`onRetry`、`onSelectPlan`，而不是暴露底层实现，例如 `onCallUpdateEndpoint`。

### 4.3 Shared UI 准入条件

组件进入 `shared/ui`，必须满足以下任一条件：

- 被两个及以上 feature 以相同语义、相同交互契约稳定使用；或
- 被项目明确认定为全 App 基础 UI primitive / design-system pattern。

同时应满足：

- 可以用中立 UI 名称描述，不需要 feature 名才能解释。
- 消费者对状态、可访问性、平台差异和错误行为的要求一致。
- 预计会因同一个原因一起变化，而不只是当前 JSX 相似。
- 不依赖 `features/*`、route、API、Auth、存储或业务 store。
- 不包含具体业务文案、页面状态机或消费者特判。
- 为关键交互提供可访问性和测试入口。

以下情况不足以证明应该进入 `shared`：

- 两段代码都使用了圆角白色卡片。
- 两个 Figma frame 当前看起来一致。
- 复制次数达到两次，但未来变化方向不同。
- 通过不断增加 `isProfilePage`、`isCompactHome`、`hideXxx` 才能共用。

明显属于项目设计系统的 Button、Text、Surface、IconButton 等 primitive，可以在第一个消费者出现时进入 `shared`，但必须由项目级规约明确其设计系统身份。

### 4.4 新增前的复用审查

新增或重写组件、Hook、工具、Use Case 前，必须先完成最小复用审查：

1. 按语义名称、用户意图、主要 JSX 结构和关键样式搜索当前 feature。
2. 搜索 `shared/ui`、`shared/hooks`、`shared/utils`、Token 和公共出口。
3. 检查候选实现的 props、状态、可访问性、平台行为和直接使用方，不能只看文件名。
4. 选择“直接复用、扩展、抽取更低层能力、保持独立”之一，并记录理由。
5. 只有当扩展后的 API 对所有消费者仍然自然时才扩展现有共通组件。

实现前的输出至少列出：

```text
复用候选：现有 Button、SettingsRow、useDisclosure
决定：复用 Button；SettingsRow 语义不同，保持 feature-local；
      抽取共同的 RowSurface primitive，而不是合并两个业务组件。
```

没有找到候选也应明确写“已搜索，未发现语义匹配实现”。禁止在未搜索现有代码的情况下直接新增近似组件。

### 4.5 重复代码的分类

重复代码先分类，再决定抽象方式：

| 重复类型 | 优先落点 | 说明 |
| --- | --- | --- |
| 颜色、间距、圆角、字体等设计值 | Token | 统一视觉事实源，不创建业务组件解决数值重复。 |
| 相同视觉结构与相同交互语义 | feature UI 或 shared UI | 先 feature-local，合同稳定后再提升。 |
| 相同行为但视觉结构不同 | Headless Hook / Controller 辅助 | 复用状态与行为，不强迫 UI 一样。 |
| 相同业务规则、validation、转换 | `model/` 或纯 `utils/` | 必须无 React 和副作用。 |
| 相同多步骤业务操作 | `use-cases/` | 复用用户意图和 invariant，不复用页面反馈。 |
| 相同第三方、平台或 DTO 差异 | Adapter | 隔离外部差异。 |
| 仅当前外观相似、状态和变化方向不同 | 保持独立 | 可以复用更低层 primitive 或 Token。 |

判断核心不是“代码是否长得一样”，而是：

> 当需求变化时，这几处代码是否应该因为同一个原因一起修改？

答案不明确时，优先保留在 feature，并抽取最小、稳定、无争议的低层部分。

### 4.6 抽象层级与适度共通

优先按以下层级寻找最低稳定抽象：

1. **Token**：颜色、spacing、radius、typography、motion。
2. **Primitive**：Text、Button、Surface、Divider、IconButton、Field 壳层。
3. **行为能力**：纯函数、selector、validation、Headless Hook。
4. **Feature Pattern**：只服务一个 feature 的 Row、Card、Section、表单区块。
5. **Shared Pattern**：跨 feature、语义中立、合同稳定的组合模式。
6. **Page / Flow**：默认不共通；只组合共享能力。

采用“第二次评估、第三次稳定使用通常抽取”的经验规则：

- 第一次出现：优先完成清楚的 feature-local 实现。
- 第二次出现：比较语义、变化原因和状态合同，必要时只抽取低层部分。
- 第三次稳定出现：如果仍然同因变化，通常应抽取并迁移旧实现。

这不是机械次数规则。安全 invariant、项目级 primitive 或已明确的设计系统模式可以更早抽取；两个消费者即使代码相同，只要变化方向不同，也不应合并。

### 4.7 共通组件的提升、迁移与降级

从 feature 提升到 `shared` 时必须：

- 明确现有消费者和预期新增消费者。
- 定义最小 props、默认行为、状态合同、可访问性和平台差异。
- 更新所有直接使用方并删除旧重复版本。
- 为稳定 variant 和关键交互增加测试或组件示例。
- 在项目组件目录或 `app-specific.md` 中记录公开入口。

出现以下信号时，应拆分、降级回 feature 或重新抽取低层 primitive：

- Shared props 出现页面名、route、feature 枚举或多个消费者专属布尔值。
- 内部根据调用页面做条件分支。
- 消费者大量传入内部元素 style、render override 或 `mode="custom"`。
- 修改一个消费者时经常担心破坏无关消费者。
- 组件名称越来越抽象，但职责越来越混杂。

共通化不是单向升级。错误抽象应及时拆开，不能为了维持“复用率”继续增加特判。

### 4.8 组合优先于万能配置

根据差异类型选择 API：

- 结构一致、视觉差异是封闭集合：使用 `variant`、`size`、`tone` 等有限枚举。
- 结构存在真实差异：使用 children、slot 或小组件组合，而不是持续增加布尔 props。
- 行为一致、视觉不同：复用 Headless Hook 或纯状态模型。
- 视觉一致、业务状态不同：使用受控展示组件，由外部传入状态和回调。
- 只有根布局确实需要时才开放有限 `style`；不开放内部每个节点的任意 style escape hatch。

禁止把组件设计成页面配置解释器，例如用一个庞大 config 同时决定 header、表单、列表、footer、路由和业务动作。配置驱动只适合字段集合明确、语义一致且需要批量渲染的结构。

### 4.9 Props 规则

可复用组件优先使用以下语义：

```ts
label
value
selected
disabled
loading
variant
size
tone
layout
onPress
onChange
onChangeText
onClose
```

规则：

- 回调统一使用 `onXxx` 命名，表达用户意图而不是实现步骤。
- 业务选中态、输入值、开关状态和流程步骤默认由外部控制。
- 稳定的视觉分支使用有限枚举，不持续堆叠 `isPrimary`、`isLarge`、`isForXxxPage` 等布尔值。
- optional prop 必须有清晰默认行为。
- 只有真正决定组件能否工作的输入才设为 required。
- Shared 组件只开放最小必要的样式扩展和原生可访问性入口。
- 不把 feature 名、流程步骤、后端 DTO 或业务枚举写进 Shared props。
- 不为了减少调用方几行代码，将导航、API、Toast 和状态机塞进组件。

### 4.10 单组件单职责

- 每个 UI 文件默认只定义一个对外组件。
- 简短、无状态且只服务当前文件的渲染 helper 可以保留。
- 页面、section 和复杂控件按职责拆分，不能按任意视觉碎片拆分。
- 仅把 JSX 或方法平移到另一个文件，不算有效拆分。
- 拆分后的模块必须形成清楚的语义、变化边界或测试边界。

以下信号通常表示需要拆分：

- 同一文件同时存在 Header、表单、预览、状态提示和操作区。
- 大量条件渲染、switch 或平台分支。
- 复杂 SVG、gradient、mask 与业务结构混在一起。
- handler、effect 和 JSX 互相穿插。
- 一个修改原因经常影响多个无关区域。

以下信号表示不应继续拆分：

- 新文件只包含一次函数转发。
- 阅读一个动作需要在多个一行文件之间跳转。
- 拆分没有减少认知负担，只增加 import 和命名。

### 4.11 设计模式的选择条件

设计模式用于让状态、变化点和依赖更清楚，不用于增加层数。默认优先选择函数、组合和类型，而不是类继承。

| 场景 | 推荐模式 | 不应使用的情况 |
| --- | --- | --- |
| 少量局部状态、单次同步操作 | 直接 handler / 局部 Hook | 不要创建 Use Case、Repository、Factory。 |
| 一个用户动作包含 validation、多个副作用、缓存或并发规则 | Controller + Use Case | 只有一次无规则的 API 调用。 |
| 状态互斥、存在非法组合、转换依赖前一状态 | Reducer / 显式状态机 | 两个互不影响的 boolean。 |
| 同一算法按模式、权限或产品策略切换 | Strategy | 只有一个稳定实现。 |
| 隔离 iOS/Android、原生模块、第三方 SDK、DTO | Adapter | 只是改一个函数名。 |
| 同一领域数据来自 API、cache、离线存储并需要统一策略 | Repository | 单一 endpoint 且没有缓存/离线规则。 |
| 相同行为需要不同 UI | Headless Hook | UI 与行为都不相同。 |

引入模式前必须能回答：它消除了哪种条件分支、重复规则、外部耦合、非法状态或测试困难？回答不出来时保持简单实现。

### 4.12 显式控制流与调用链

主要用户动作遵循以下可追踪路径：

```text
UI event
  -> Controller action
      -> 可选 Use Case
          -> API / storage / cache adapter
      <- typed result
  -> Controller 更新 UI state / 导航 /反馈
```

规则：

- 每个主要动作只有一个权威编排函数，例如 `submitProfile`、`publishPost`、`retryLoad`。
- Validation、锁、防重复、调用顺序、错误映射和成功后的状态处理应在明确边界中按顺序可读。
- 一个函数至少应增加以下一种价值：语义命名、输入转换、invariant、分支决策、副作用边界、错误映射、取消/锁、可替换实现或必要 instrumentation。
- 不增加任何价值、仅以相同参数调用下一个函数的包装应删除。
- 不允许连续出现两层以上无业务含义的转发，例如 `handleSave -> submit -> executeSave -> service.save`。
- Controller action 不应通过 EventBus 间接触发同页面内可以直接调用的流程。
- Use Case 返回类型化结果；由 Controller 决定 Toast、Dialog 和导航。
- 核心流程不要拆成多个只有一行的 private method；把关键步骤留在一个可顺序阅读的编排函数中。

不推荐：

```ts
const handleSave = () => submit();
const submit = () => executeSave();
const executeSave = () => profileService.save(form);
```

简单流程直接表达：

```ts
const save = async () => {
  if (state.status === 'submitting') return;

  const parsed = validateProfile(state.form);
  if (!parsed.ok) {
    dispatch({ type: 'validationFailed', errors: parsed.errors });
    return;
  }

  dispatch({ type: 'submitStarted' });
  const result = await profileApi.update(parsed.value);
  dispatch(mapUpdateResultToEvent(result));
};
```

复杂流程通过一个 Use Case 表达业务顺序，而不是增加别名层：

```ts
export async function updateProfile(
  input: UpdateProfileInput,
  deps: UpdateProfileDependencies,
): Promise<UpdateProfileResult> {
  const parsed = validateProfile(input);
  if (!parsed.ok) {
    return { type: 'validation-error', errors: parsed.errors };
  }

  const profile = await deps.profileRepository.update(parsed.value);
  await deps.profileCache.replace(profile);

  return { type: 'success', profile };
}
```

### 4.13 Hook 与 Controller 规则

Hook 内部保持以下阅读顺序：

1. Context、依赖和外部 Hook
2. `useState` / `useReducer` / `useRef`
3. 派生变量与 selector
4. 对页面公开的 actions
5. effects
6. 返回值

Hook 应：

- 局部通用行为使用 `useSomething`；页面或 flow 编排使用 `useSomethingController`。
- 只暴露页面真正需要的 state 和 actions，推荐 `{ state, actions }` 或其他稳定、可读结构。
- 对外 action 直接进入权威编排点，不再调用同义别名 handler。
- 负责 React 生命周期、focus、subscription、request cancellation 和导航结果映射。
- 清理 timer、subscription、animation 和异步竞态。
- 将纯计算、validation、selector 和状态转换移入 `model/` 或纯 `utils/`。
- 当业务操作可以脱离 React 测试且包含多步骤规则时，移入 `use-cases/`。
- 避免返回数十个互相关联 boolean；使用 discriminated union、Reducer 或明确 view model。

出现以下任一情况时，应评估拆分 Controller、Use Case 或 Reducer：

- 一个 Hook 同时编排两个以上相互独立的用户流程。
- 多个 async 操作存在顺序、互斥、重试、取消或 stale response 规则。
- 同一业务规则在 effect、handler 和 render 分支中重复。
- 状态组合可能表达不可能存在的 UI 状态。
- 不挂载 React 组件就无法测试核心业务规则。

### 4.14 Use Case 规则

Use Case 只在一个用户意图包含实质业务编排时引入，例如：

- validation 后调用一个或多个外部依赖
- 需要权限、会话、幂等、事务顺序或缓存一致性规则
- 同一操作被多个入口触发
- 需要以纯 TypeScript 测试成功、失败和并发分支

Use Case 必须：

- 以动词加业务对象命名，例如 `publishPost`、`deleteAccount`。
- 不 import React、React Native UI、Expo Router、Toast 或页面组件。
- 接收明确输入，并返回 discriminated union 或明确结果类型。
- 在一个地方展示关键业务步骤和顺序。
- 依赖注入只用于真实可替换依赖、测试隔离或多实现；不为每个函数创建空 interface。
- 不用 class、Factory、Repository 包装一个没有变化点的一行 API 调用。

### 4.15 Reducer 与状态机规则

以下情况优先使用 Reducer 或显式状态机：

- `idle`、`loading`、`success`、`error` 等状态互斥。
- 多个 boolean 会形成非法组合，例如同时 `loading` 与 `submitted`。
- 转换依赖当前状态，存在 retry、cancel、optimistic update 或 rollback。
- 同一事件在不同状态下行为不同。

规则：

- 优先使用 TypeScript discriminated union 表达状态。
- Reducer 只做纯状态转换，不发请求、不导航、不读写存储。
- 副作用由 Controller 或 Use Case 执行，再向 Reducer dispatch 结果事件。
- 不因使用“状态机”概念就强制新增第三方库；`useReducer` 和显式 transition 足够时保持简单。
- 测试覆盖合法转换、被拒绝的转换和关键 invariant。

### 4.16 列表和重复结构

- 重复卡片、菜单、选项和行项目使用数据驱动渲染。
- 数据驱动只替代真正同构的重复结构；不同业务语义不能塞进一个包含大量 `type` 分支的万能 renderer。
- 根据数据量、虚拟化需求和嵌套结构选择 `FlatList`、`SectionList` 或简单 `map`。
- 同级 item 的高度、padding、divider 和间距必须统一。
- 首项、末项和选中项的视觉差异要显式表达。
- 未来可能分页或动态增减的数据，从第一版就保留稳定 key 和列表边界。
- 不使用数组索引、展示文案或临时时间值作为长期稳定 ID。

### 4.17 样式、Design Token 和 Typography

样式组织以阅读性为准：

- 小型、私有且只服务一个组件的 `StyleSheet.create` 可以放在同一文件底部，减少无意义跳转。
- 当样式较大、存在明显视觉分区、平台分支、多个文件共享或影响组件主体阅读时，拆到相邻的 `ComponentName.styles.ts`。
- 不能只按代码行数机械拆分，也不能把动态业务逻辑放入 styles 文件。
- 项目规定统一 styling system 时，全项目沿用，不能局部混用第二套。
- JSX 中只保留确实依赖运行时状态的最小动态样式。

Token 规则：

- 优先使用当前 App 已定义的颜色、字体、间距、圆角、阴影和动效 Token。
- 重复出现的设计值不能长期散落为字面量。
- 不能因为另一个 App 使用某个 Token，就复制到当前 App。
- Figma 值与代码 Token 接近但不完全一致时，先判断是否应绑定现有 Token，再说明偏差。
- 新增或修改全局 Token 属于设计系统变更，需要明确确认。
- 一次性的局部尺寸可以保留，但名称和用途必须清楚。

文本至少确认：

- `fontFamily`
- `fontSize`
- `fontWeight` 或具体字体映射
- `lineHeight`
- `letterSpacing`
- 文本语言与 glyph fallback

不能机械复制 Figma Dev Mode 的字体名称；需要确认 App 实际加载的字体和目标语言支持。

### 4.18 Import、公开入口和可发现性

- 优先使用项目配置的路径别名，避免深层 `../../`。
- 每个 workspace 只能 import 自己 `package.json` 中声明的外部 package。
- 使用方不能通过深路径绕过 package 的公开 `exports`。
- feature 的公共入口只导出明确允许跨边界使用的模块，不使用无界 `export *` 暴露全部内部实现。
- 避免在每个目录建立 barrel file；过度 barrel 会隐藏真实依赖、增加循环引用和降低代码搜索可读性。
- type-only import 遵守项目 TypeScript 约定，避免引入不必要的运行时代码。
- 共通组件应有可搜索的语义名称、公开入口和最小使用示例；不要求为此新增第三方组件文档依赖。

### 4.19 代码审查必须能回答的问题

审查目标页面或 flow 时，应能快速回答：

1. 这个 UI 是否搜索并复用了已有 primitive / pattern？为什么没有合并另一个相似组件？
2. 共享抽象的消费者是否具有相同语义、状态合同和变化原因？
3. 当前抽象是否位于最低稳定层，而不是万能组件？
4. 状态在哪里维护，哪些状态是互斥的？
5. 用户动作从哪个 UI 回调进入，权威编排函数在哪里？
6. API、存储、缓存和导航分别在哪个边界发生？
7. 是否存在只做同参数转发的方法或同义 handler 链？
8. 采用 Reducer、Use Case、Strategy、Adapter 或 Repository 解决了什么真实问题？
9. 设计值来自哪里，双端差异在哪里？
10. 修改该共通组件时，所有直接使用方是否已检查？

---
