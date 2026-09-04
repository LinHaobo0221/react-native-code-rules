# 5. Figma 读取与页面构造规则

### 5.1 触发条件

以下任意情况都会触发 Figma 工作流：

- 用户提供 Figma URL
- 用户提供 Figma node
- 用户提供设计截图
- 用户明确要求按设计稿创建或修改页面

### 5.2 开始前确认

开始生成页面代码前，必须确认：

1. 已完整读取共通规约和项目级规约。
2. 当前 Expo / React Native 配置和允许的依赖。
3. 当前 App 的 Token、字体、图标和已有组件入口。
4. 页面所属 feature 和 route 层级。
5. 用户要求的页面状态、交互范围和数据边界。

### 5.3 Figma 强制读取顺序

#### 第一步：读取入口节点

把用户提供的整个 screen、frame 或 section 作为入口，不能把顶层截图直接当成完整实现依据。

先读取：

- metadata / 节点树
- frame 尺寸和 Auto Layout
- 直接子节点
- component instance
- hidden layer
- variable / style 引用
- asset 与 vector group

#### 第二步：按职责分类

关键节点分类为：

- 页面壳层与背景
- safe area、header、navigation
- tab、segment
- section header
- card、list row
- button、input、picker
- modal、sheet、dialog
- icon、SVG group
- 图片、插画、背景资源
- chart、visualization
- 系统 UI

#### 第三步：深入读取关键子节点

继续读取到足以确认：

- 尺寸和约束
- padding、gap 和对齐
- 字体与行高
- fill、stroke、radius 和 shadow
- variant / component property
- clipping、mask、z-index 和 overflow
- 资源类型和导出边界
- 默认、选中、禁用、loading、error 等状态

以下复合控件的内部元素必须单独确认：

- TextField / SearchField
- Select / Dropdown
- Date / Time picker row
- Tab / Segment
- Card action
- Chart tooltip / legend

不能只读取外框后使用近似 icon 或猜测内部 spacing。

#### 第四步：生成节点读取清单

开始改代码前必须记录：

- 入口 node ID 与名称
- 已读取的关键子节点 ID 与名称
- 每个节点对应的代码落点
- 计划导出的 SVG / PNG 资源
- 明确跳过的节点及原因

如果工具无法访问节点或权限不足，必须说明降级依据、使用的截图以及尚未确认的内容。

### 5.4 Figma 到代码的整体构造

```text
Figma 入口节点
  ↓
读取节点树、尺寸和布局
  ↓
按页面职责分类
  ↓
深入读取关键复合节点
  ↓
记录节点到文件/组件/资源的映射
  ↓
映射 Token、组件、字体和交互
  ↓
实现 feature page / UI
  ↓
执行 iOS / Android 视觉与交互验收
```

### 5.5 Auto Layout 映射

- Auto Layout 优先映射为 Flexbox 关系。
- 根据 `hug`、`fill`、`fixed`、`min/max constraint` 判断宽高行为。
- 不用大量 absolute positioning 复刻本可由正常布局表达的结构。
- absolute 只用于明确叠层、角标、装饰和覆盖关系。

### 5.6 Component 和 Variant 映射

- 先搜索当前 App 已有组件，确认结构和语义是否匹配。
- Figma component property 映射为有限、类型安全的 props。
- Variant 优先映射为 `variant`、`size`、`tone`、`state` 等枚举。
- 不为了“复用已有组件”而强行接受明显结构偏差。
- 新组件默认放在当前 feature。
- 确认跨 feature 稳定复用后，才进入 `shared`。

### 5.7 Variables 和 Token

- Figma Variables 映射到当前 App Token，而不是共通库中的固定值。
- Figma 使用 alias 时，代码也尽量使用语义 Token，而不是原始色值。
- 发现 Figma 和代码 Token 漂移时，不能静默选择一方。
- 必须说明差异，并按项目事实源处理。

### 5.8 Typography 和布局数值

- 确认文本语言、字体覆盖和 Figma fallback。
- 根据 App 已加载字体选择实际 `fontFamily`。
- 同时映射字号、行高、字距和字重。
- 不擅自新增字体 package 或资源。
- Figma 数值默认按相同数字映射为 React Native 逻辑像素。
- 只有字体渲染、原生控件或平台行为造成有依据的差异时才平台微调，并记录原因。

### 5.9 图片、SVG 和资源命名

- 功能 icon、小型状态图形和可缩放矢量优先导出本地 SVG。
- 照片、复杂插画、Banner 和位图纹理使用合适倍率的本地图片。
- Figma 中已组合完成的复杂 vector group 优先整体导出。
- 只有结构简单且需要运行时动态形变或换色时才手写 SVG。
- 不使用网络 URL、base64 或第三方近似图标替代正式本地资产，除非项目明确允许。
- 不把低清截图当作生产资源。
- 不把可访问文本烘焙进图片，除非原始设计就是不可拆分位图。

推荐：

```text
icon-arrow-left.svg
profile-avatar-placeholder.png
empty-history-illustration.svg
```

禁止：

- hash
- 随机字符串
- 导出工具临时名
- `image-1.png`
- 无法判断用途的文件名

工具生成的临时资源必须在同一任务中重命名，未使用资源应删除。

### 5.10 系统 UI

以下内容默认属于设备环境，不是业务 UI：

- iOS Home Indicator
- 状态栏时间、电量、信号和 Wi-Fi
- Android 系统导航栏
- 设备外框和屏幕圆角遮罩

不能手工绘制假系统元素。页面必须正确处理 safe area、StatusBar 和系统背景。只有制作营销 mockup 或设备展示图时才可以例外。

### 5.11 交互意图

必须从设计和 prototype 判断：

- 点击目标与 hit area
- Tab / Segment 切换
- 输入 focus、placeholder 和 validation
- Sheet / Modal 打开与关闭
- loading、empty、error、disabled 状态
- 滚动区和固定区边界
- 导航前进、返回和关闭的区别

如果 Figma 只显示静态状态：

- 不自行发明真实业务规则。
- 可以实现任务允许的本地展示状态。
- 不擅自接入真实网络、持久化、Auth 或业务流程。
- 明确哪些行为仍是占位。

### 5.12 实现前输出和视觉验收

写代码前应输出：

1. 适用的关键项目规则
2. 将创建或修改的完整文件路径
3. 每个文件的职责
4. Figma 子节点读取清单
5. 计划复用的现有组件、Token 和资产
6. 已知不确定项与保守假设

实现后至少检查：

- 结构和层级
- padding、gap 和对齐
- 字号、行高、字重和字距
- 颜色、stroke、圆角和阴影
- 图片裁切和 SVG 尺寸
- scroll、fixed footer 和 safe area
- press、focus、selected、disabled 状态
- 小屏幕和长文本
- iOS / Android 原生表现

Web 可以辅助检查路由和基础渲染，但不能替代 iOS / Android 的视觉、键盘、safe area、Modal 和转场验收。

交付时说明：

- 已还原的内容
- 与 Figma 仍存在的偏差
- 偏差原因：资源缺失、平台行为、依赖限制或设计不完整
- 已验证的平台和状态
- 尚需用户决定的 Token、字体、动效或业务行为

---
