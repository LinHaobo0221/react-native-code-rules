# 6. 交互、键盘、Modal、平台和可访问性

### 6.1 控件必须真实可用

看起来可以操作的控件必须提供符合任务范围的反馈：

- 输入框可以输入、聚焦和失焦。
- Button / Pressable 有按压反馈。
- Tab / Segment 可以切换选中态。
- Checkbox / Radio / Switch 可以改变状态。
- Modal / Sheet 可以打开和关闭。
- disabled / loading 阻止重复动作并有明确视觉。
- 列表项的选中、高亮和展开状态可被感知。

### 6.2 原生语义

默认使用语义匹配的 React Native 组件或项目批准的封装：

- 文本输入：`TextInput`
- 点击操作：`Pressable`
- 图片：项目选定的 Image 实现
- 长列表：`FlatList` / `SectionList`
- 短内容滚动：`ScrollView`
- 文本：`Text`

禁止用普通 `Text` 或静态 `View` 伪装交互控件。

### 6.3 状态归属

- 纯视觉瞬时状态可以由组件内部维护，例如按压动画内部值。
- 输入值、选中项、开关状态和流程步骤默认由页面 Hook 控制。
- UI 通过 props 和 callback 与外部通信。
- 跨页面轻量通知使用项目批准的 scoped event 或状态方案。
- EventBus 只发送通知，不保存业务事实、API response 或持久状态。
- 需要跨登录态、App 生命周期或离线恢复的状态必须进入明确的数据与存储设计，不能用 module singleton 临时拼接。

### 6.4 输入与表单

每个输入控件都要评估：

- `value` / `defaultValue` 的受控策略
- placeholder
- focus / blur
- disabled / readonly
- error 和帮助文本
- 键盘类型
- return key 行为
- 自动填充和内容类型
- iOS / Android 属性
- accessibility label

密码、邮箱、验证码、数字和搜索输入不能只按 iOS 属性实现，必须确认 Android 和通用属性。

表单提交必须：

- loading 时防止重复触发
- 保持错误归属清楚
- 不在展示组件中完成 API、token 或导航编排
- 键盘出现时不遮挡当前输入和主要操作

### 6.5 键盘避让

包含 `TextInput`、composer、聊天框、评论框、底部输入栏或长表单时，必须先检查项目的键盘基础设施。

- Header 与固定导航保持在输入滚动区外。
- 长表单使用统一 keyboard-aware 滚动容器。
- 固定底部 composer 使用统一 sticky footer 或 keyboard controller。
- 列表底部 padding 包含 composer 实际高度和安全间距。
- 输入型滚动容器设置合适的 keyboard dismiss 和 tap 行为。
- 不用任意大额 `marginBottom`、模拟键盘高度或绝对定位解决遮挡。
- 不在同一输入区域叠加多套键盘机制。
- 不在每个页面重复注册 `keyboardDidShow` / `keyboardDidHide` listener。

对于“默认一行入口，聚焦后展开完整编辑器”的 UI：

- 默认入口使用 `Pressable` 和展示文本。
- 展开后才渲染真实 multiline `TextInput`。
- wrapper 只负责状态切换，collapsed / expanded 组件职责分开。
- 区分“请求聚焦”和“已经聚焦”，避免 focus 循环。

至少验证 iOS 键盘打开和交互式关闭、Android 键盘和系统返回关闭、手势/三键导航、页面退出时 focus 清理以及键盘关闭后的布局恢复。

### 6.6 Modal、Sheet 和 Dialog

实现前先分类：

1. 路由级 full-screen modal
2. 页面内 bottom sheet / picker
3. 轻量 dialog / alert / toast

路由级 Modal：

- 用于多 step、独立历史或覆盖 Tabs 的流程。
- Modal 内下一步使用内部 Stack。
- 关闭按钮退出整个 Modal flow。
- 正确处理 StatusBar、顶部 safe area 和系统返回。

Bottom Sheet / Picker：

- 遮罩和 sheet 本体职责分离。
- 遮罩是否可关闭由设计决定。
- sheet 本体阻止事件穿透。
- 内容过高时内部列表独立滚动。
- `scrollToIndex` 只在刚打开或明确 reset 时执行。
- 打开、关闭和遮罩动画使用项目统一动效事实源。

轻量提示：

- 短确认和提示不升级为复杂路由流程。
- Toast 不承载必须被用户明确确认的高风险操作。
- 不允许每个页面自行硬编码不同 animation duration 或 easing。

### 6.7 Safe Area、系统 UI 和双端

- 根据导航壳层正确处理 top、bottom、left、right inset。
- Modal、沉浸式页面和 edge-to-edge 在 iOS / Android 分别验证。
- 不以假空白、假状态栏或假 Home Indicator 修复布局。
- 不让 header、输入框和主要操作无依据地进入系统状态栏区域。
- Android 系统栏背景和 icon 明暗要保持可读性。
- 除非任务明确限定单一平台，所有实现默认覆盖 iOS 和 Android。

需要评估的差异：

- 阴影和 elevation
- StatusBar 与系统导航栏
- safe area 和 edge-to-edge
- 键盘、自动填充和返回键
- 权限和系统 picker
- Modal presentation
- 返回手势
- 文件、图片和分享
- 字体渲染和文本截断
- haptic、animation 和 reduce motion

平台分支应最小化，并说明为什么无法使用统一实现。Web 只能辅助调试，原生表现冲突时以 iOS / Android 为准。

### 6.8 滚动和固定区域

实现 Figma 页面前应明确：

- Header 是否固定
- 中间内容是否滚动
- Footer / CTA 是否固定
- 列表、表单和键盘的边界
- 小屏幕、动态字体和长文案是否仍可访问

固定底部操作区必须给滚动内容预留相应底部空间。按钮应随内容时，不要强行固定到底部。

禁止使用外层 `ScrollView` 包裹同方向虚拟化列表，除非项目已有经过验证的特殊方案。

### 6.9 可访问性

关键交互元素应提供：

- 正确的 `accessibilityRole`
- 清楚的 `accessibilityLabel`
- 必要的 `accessibilityHint`
- selected / checked / disabled / expanded 等状态
- 稳定 `testID`，仅用于关键自动化入口

还必须保证：

- 小控件通过 hit area 或 `hitSlop` 满足触达标准。
- 阅读顺序与视觉顺序一致。
- 重要状态不只依赖颜色，同时使用符号、文案或结构提示。
- 文本缩放后主要内容和操作仍可访问。
- Button、Input 和错误文本有足够对比度。
- 动画遵守 reduce motion 策略。

### 6.10 异步状态

真实数据页面应明确区分：

- initial loading
- refreshing
- pagination loading
- empty
- recoverable error
- terminal error
- stale content with refresh failure

UI 不能把所有失败都表现成同一个空白页面。静态原型使用最小本地数据，数据结构尽量接近未来 API 语义，不创建多余 mock 系统。

---
