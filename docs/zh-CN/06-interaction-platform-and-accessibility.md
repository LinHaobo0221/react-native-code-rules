# 06 交互、平台与可访问性

> 本文件定义 React Native 页面在交互、键盘、Modal、safe area、iOS / Android 和可访问性方面的共同质量下限。

## 交互必须真实可用

看起来可以操作的控件必须提供与任务范围相符的反馈：

- 输入框可以输入、聚焦和失焦
- Button / Pressable 有按压反馈
- Tab / Segment 可以切换选中态
- Checkbox / Radio / Switch 可以改变状态
- Modal / Sheet 可以打开和关闭
- disabled / loading 状态阻止重复动作并有明确视觉
- 列表项的选中、高亮和展开状态可被感知

若任务只要求静态设计还原，可以使用本地 state 演示交互；不得借机添加真实网络、持久化和业务规则。

## 使用正确的原生语义

默认使用语义匹配的 React Native 组件或当前项目已批准的基础封装：

- 文本输入：`TextInput`
- 点击操作：`Pressable`
- 图片：项目已选定的 Image 实现
- 长列表：`FlatList` / `SectionList`
- 短内容滚动：`ScrollView`
- 文本：`Text`

如果项目已有统一 Button、Input、Switch、Image、StatusBar 或 Sheet 组件，业务页面应优先复用，避免直接创建平行版本。

禁止用普通 `Text` 或静态 `View` 伪装交互控件。

## 交互状态归属

- 纯视觉瞬时状态可以在组件内部维护，例如按压动画内部值。
- 输入值、选中项、开关状态和流程步骤默认由页面 Hook 控制。
- UI 组件通过 props 和 callback 与外部通信。
- 跨页面轻量通知使用项目批准的 scoped event 或状态方案。
- EventBus 只发送通知，不保存业务事实、API response 或持久状态。
- 需要跨登录态、App 生命周期或离线恢复的状态，必须进入明确的数据与存储设计，不使用 module singleton 临时拼接。

## 输入与表单

每个输入控件都应评估：

- `value` / `defaultValue` 的受控策略
- placeholder
- focus / blur
- disabled / readonly
- error 与帮助文本
- 键盘类型
- return key 行为
- 自动填充和内容类型
- iOS / Android 对应属性
- accessibility label

密码、邮箱、验证码、数字和搜索输入不得只按 iOS 属性实现；必须同时确认 Android 和通用属性。

表单提交应：

- 防止 loading 时重复触发
- 保持错误归属清楚
- 不在展示组件里完成 API、token 或导航编排
- 不因键盘出现而遮挡当前输入和主要操作

## 键盘避让

包含 `TextInput`、composer、聊天框、评论框、底部输入栏或长表单时，必须先检查当前项目的键盘基础设施和项目级规约。

通用原则：

- Header 与固定导航保持在输入滚动区外。
- 长表单使用项目统一的 keyboard-aware 滚动容器。
- 固定底部 composer 使用项目统一的 sticky footer 或 keyboard controller 方案。
- 列表底部 padding 必须包含 composer 实际高度和安全间距。
- 输入型滚动容器设置适合平台的 keyboard dismiss 和 tap 行为。
- 不用任意大额 `marginBottom`、模拟键盘高度或绝对定位挤压解决遮挡。
- 不在同一输入区域叠加多套键盘机制。
- 不在每个页面重复注册 `keyboardDidShow` / `keyboardDidHide` listener。

对于“默认一行入口，聚焦后展开完整编辑器”的评论或聊天 UI：

- 默认入口使用 `Pressable` 与展示文本。
- 展开状态才渲染真实 multiline `TextInput`。
- wrapper 只负责状态切换，collapsed 和 expanded 组件职责分开。
- 区分“请求聚焦”和“已经聚焦”，避免 focus 循环。

普通单行表单如果聚焦前后语义不变，不需要强行拆成两个输入组件。

至少验证：

- iOS 键盘打开与交互式关闭
- Android 键盘打开与系统返回关闭
- Android 手势导航与三键导航
- 页面退出时 focus 和键盘状态清理
- 键盘关闭后布局恢复

## Modal、Sheet 与 Dialog

实现前先分类：

1. 路由级 full-screen modal
2. 页面内 bottom sheet / picker
3. 轻量 dialog / alert / toast

不同类型不混用实现结构。

### 路由级 Modal

- 用于多 step、独立历史或覆盖 Tabs 的流程。
- modal 内下一步使用内部 Stack，关闭按钮退出整个 modal flow。
- 正确处理 StatusBar、顶部 safe area 和系统返回。

### Bottom Sheet / Picker

- 遮罩和 sheet 本体职责分离。
- 遮罩可按设计关闭，sheet 本体阻止事件穿透。
- 内容可能超高时让内部列表独立滚动。
- 初始 `scrollToIndex` 只在刚打开或明确 reset 时执行，不能随选中值反复拉回。
- 打开、关闭和遮罩动画使用当前 App 的统一动效事实源。

### 轻量提示

- 短确认和提示不升级成复杂路由流程。
- Toast 不承载必须被用户明确确认的高风险操作。

不允许每个页面自行硬编码不同 animation duration 或 easing。

## Safe Area 与系统 UI

- 页面必须根据导航壳层正确处理 top、bottom、left 和 right inset。
- Modal、沉浸式页面和 edge-to-edge 配置必须在 iOS / Android 分别验证。
- 不以假空白、假状态栏或假 Home Indicator 修复布局。
- 不让 header、输入框和主要操作无依据地进入系统状态栏区域。
- Android 系统栏背景和 icon 明暗应与当前页面背景保持可读性。

## iOS / Android 双端

除非任务明确限定单一平台，所有实现默认覆盖双端。

必须评估的平台差异包括：

- 阴影与 elevation
- StatusBar 与系统导航栏
- safe area 和 edge-to-edge
- 键盘、自动填充和返回键
- 权限与系统 picker
- Modal presentation
- 返回手势
- 文件、图片与分享
- 字体渲染和文本截断
- haptic、animation 和 reduce motion

使用平台分支时应最小化差异，并说明为什么无法使用统一实现。

Web 只能作为辅助调试环境。原生表现冲突时，以 iOS / Android 为验收依据。

## 滚动与固定区域

Figma 页面实现前应明确：

- Header 是否固定
- 中间内容是否滚动
- Footer / CTA 是否固定
- 列表、表单和键盘之间的边界
- 小屏幕、动态字体和长文案是否仍可访问

若底部操作区固定，滚动内容必须保留相应底部空间。若按钮应跟随内容，不强行固定到底部。

禁止使用外层 `ScrollView` 包裹同方向虚拟化列表来规避布局设计，除非项目已有经过验证的特殊方案。

## 可访问性

关键交互元素应提供：

- 正确的 `accessibilityRole`
- 清楚的 `accessibilityLabel`
- 必要的 `accessibilityHint`
- selected / checked / disabled / expanded 等状态
- 稳定 `testID`，仅用于关键自动化入口

还必须保证：

- 视觉尺寸较小的控件通过 hit area 或 `hitSlop` 满足项目和平台触达标准。
- 阅读顺序与视觉顺序一致。
- 重要状态不只依赖颜色表达，同时使用符号、文案或结构提示。
- 文本缩放后主要内容和操作仍可访问。
- Button、Input 和错误文本具备足够对比度；具体阈值遵守项目设计系统与目标标准。
- 动画尊重项目的 reduce motion 策略。

## 异步状态

真实数据页面应明确：

- initial loading
- refreshing
- pagination loading
- empty
- recoverable error
- terminal error
- stale content with refresh failure

这些状态的事实源和缓存策略属于项目级数据架构，但 UI 不应把所有失败都表现为同一个空白页面。

若任务只实现静态原型，使用最小本地数据，并让数据结构接近未来 API 语义；不要创建多余 mock 系统。
