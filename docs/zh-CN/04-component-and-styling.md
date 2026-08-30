# 04 组件、Hook 与样式

> 本文件定义页面、UI 组件、Shared 组件、Hook 和样式的通用代码标准。具体 Design Token 与 styling technology 由项目级规约决定。

## 组件职责

### Page

Page 负责：

- 组合页面结构和 section
- 调用页面或 flow Hook
- 将状态和回调传递给 UI 组件
- 表达页面级 loading / error / empty / content 分支

Page 不应长期承担：

- 大量输入状态和 handler
- 复杂 API 编排
- 底层 SVG、渐变和装饰细节
- 多个无关 section 的完整 JSX
- 大量硬编码数据

### Feature UI

Feature UI 负责当前功能内的展示和用户输入。它可以使用 feature 语义命名，但应通过 props 接收状态与回调。

Feature UI 默认不负责：

- 导航决策
- API 请求
- Auth 或存储访问
- 跨页面业务事实
- 与页面生命周期强耦合的副作用

### Shared UI

组件只有在满足以下任一条件时才进入 `shared/ui`：

- 已被两个及以上 feature 稳定复用
- 本质上属于全 App 基础 UI 模式

Shared UI 必须：

- 使用中立 UI 语义
- 不依赖 `features/*`
- 不直接读取 route、API、Auth 或业务 store
- 不包含具体业务文案和页面状态机
- 对关键交互提供可访问性与测试入口

若组件为了适配不同页面持续增加特判、业务布尔值和样式逃生口，应拆分或回退到 feature，而不是继续扩大 shared 抽象。

## 每个组件一个主要职责

- 每个 UI 组件文件默认只定义一个对外组件。
- 简短、无状态且只服务当前文件的渲染 helper 可以保留，但不能形成隐藏组件体系。
- 页面、section 和复杂控件应按职责拆分，不按任意视觉碎片拆分。
- 拆分后必须改善阅读路径、变更边界或测试边界；仅把 JSX 平移到另一个文件不算有效拆分。

以下信号表示需要拆分：

- 同一文件同时存在 header、表单、预览、状态提示和操作区
- 大量条件渲染、switch 或平台分支
- 复杂 SVG / gradient / mask 与业务结构混在一起
- handler、effect 和 JSX 相互穿插，难以快速定位职责
- 一个修改原因经常影响文件中多个无关区域

## 重复代码与共通化

出现两处及以上相同或高度相似实现时，必须评估：

1. 只服务一个 feature：抽到该 feature 的 UI、Hook、constants 或 utils。
2. 已跨 feature 稳定复用：抽到 shared。
3. 视觉类似但业务状态不同：保持独立，复用更低层 primitive 或 Token。
4. 需求尚不稳定：暂不抽象，并记录后续触发条件。

共通化后应删除旧重复版本，避免同一模式长期存在多个事实源。

## Props 设计

Shared 和可复用 Feature UI 的 props 应优先使用：

- `label`
- `value`
- `selected`
- `disabled`
- `loading`
- `variant`
- `size`
- `tone`
- `layout`
- `onPress`
- `onChange`
- `onChangeText`
- `onClose`

必须遵守：

- 回调使用统一 `onXxx` 命名。
- 业务选中态、输入值和流程状态默认由外部控制。
- 多个稳定视觉分支使用有限枚举，不持续堆叠 `isPrimary`、`isLarge` 等布尔开关。
- optional prop 必须有清晰默认行为。
- 只有真正决定组件能否工作的输入才设为 required。
- Shared 组件只开放最小必要样式扩展，不能暴露一整套无约束内部 style 入口。
- 不把 feature 名、流程步骤或业务枚举写进 Shared props。

## 展示与逻辑分离

- UI 文件只处理展示、局部视觉状态和触发回调。
- 页面或 flow Hook 处理副作用、状态编排、导航意图和业务分支。
- API query / mutation 应进入独立 Hook 或 service 边界。
- UI 组件不能直接拼接 request、保存 token 或决定下一条 route。
- 静态 data、constants 和 types 不反向依赖 React 页面或 Hook。

## Hook 结构

Hook 内部保持稳定阅读顺序：

1. Context 与外部 Hook
2. `useState` / `useRef`
3. 派生变量与 memoized value
4. methods / handlers
5. effects
6. 返回值

同类变量之间保持分组，状态和方法之间留出清晰空行。不要把所有 state、callback 和 effect 混在一起。

Hook 应：

- 使用语义化名称，例如 `useProfileForm`、`usePickerSheet`
- 只暴露页面真正需要的状态和动作
- 避免返回不稳定的大对象或内部实现细节
- 清理 timer、subscription、animation 和异步竞态
- 将可纯函数化的计算移入 `utils`

## 样式文件

默认规则：

- 组件样式放在相邻的 `ComponentName.styles.ts`。
- React Native 原生样式优先使用 `StyleSheet.create`。
- 如果项目级规约明确采用其他 styling system，则全项目沿用该系统，不在局部混用第二套方案。
- JSX 中只保留确实依赖运行时状态的最小动态样式。
- 大型 styles 文件按组件或视觉职责拆分，不按任意行数机械拆分。

## Design Token

本共通库不规定任何 Token 名称或数值。每个 App 必须在项目级规约中指出 Token 的代码事实源。

实现时必须：

- 优先使用当前 App 已定义的颜色、字体、间距、圆角、阴影和动效 Token。
- 同一文件或多个文件重复出现的设计值，不长期散落为字面量。
- 不因为另一个 App 使用某个 Token，就将其复制到当前 App。
- Figma 值与项目 Token 接近但不完全一致时，先判断设计是否应绑定现有 Token，再说明偏差。
- 新增或修改全局 Token 属于设计系统变更，应在任务范围内得到明确确认。

允许页面保留真正一次性的局部尺寸，但其名称和用途应清楚。

## Typography

文本样式应根据 Figma 与项目字体配置完整评估：

- `fontFamily`
- `fontSize`
- `fontWeight` 或对应具体 font family
- `lineHeight`
- `letterSpacing`
- 文本语言与 glyph fallback

不能机械复制 Figma Dev Mode 显示的字体名称。设计工具可能因缺字而发生 fallback；实现前必须确认当前 App 实际加载的字体和目标语言支持。

混合语言、数字强调和单位文本是否拆分嵌套 `Text`，应由设计效果、可读性和字体覆盖决定。

## 列表与重复结构

- 重复卡片、菜单、选项和行项目使用数据驱动渲染。
- 根据数据量、虚拟化需求和嵌套结构选择 `FlatList`、`SectionList` 或简单 `map`。
- 同级 item 的高度、padding、divider 和间距必须有统一规则。
- 首项、末项或选中项的视觉差异应显式表达。
- 未来可能分页或动态增减的数据，从第一版就保留稳定 key 和列表边界。
- 不使用数组索引、展示文案或临时时间值作为长期稳定 ID。

## Import 与公开入口

- 优先使用项目已配置的路径别名，避免深层 `../../`。
- 每个 workspace 只能 import 自己声明的外部 package。
- package 内部私有文件不应被使用方通过深路径绕过公开 `exports`。
- type-only import 使用项目 TypeScript 约定，避免引入不必要运行时代码。

## 可审查性

交付的组件应让审查者快速回答：

- 状态在哪里维护？
- 用户动作进入哪个回调？
- API 或导航意图在哪里？
- 设计值来自哪里？
- iOS / Android 差异在哪里？
- 哪些内容是 shared，为什么可以 shared？

如果这些问题必须通读一个超长文件才能回答，说明组件边界仍需优化。
