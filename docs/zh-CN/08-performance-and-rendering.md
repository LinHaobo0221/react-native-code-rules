# 08 性能与渲染

> 本文件定义 React Native / Expo App 的共通性能规则。它规定诊断方法、代码边界和验收方式，不规定某个 App 的具体性能预算、列表参数、图片库或动画实现。

## 核心原则

- 先测量，再优化；不根据直觉堆叠 `memo`、`useMemo` 和列表参数。
- 性能验收使用 release 或接近 release 的构建，不能以 development mode 的结果下最终结论。
- 同时区分 JavaScript thread、UI thread、网络、图片解码和原生模块的成本。
- 优化必须保留正确性、可访问性和代码可读性。
- 不把一次设备偶然表现写成全项目结论；使用可复现操作、固定数据量和目标设备档位。
- 没有测量证据时，优先保持简单、正确的实现。

## 项目必须定义的性能事实

每个 App 应在 `app-specific.md` 中记录：

- 目标设备与最低支持设备档位
- 冷启动和热启动关注指标
- 关键页面与关键用户路径
- 大列表典型和上限数据量
- 图片尺寸、缓存和上传策略
- 允许使用的动画与列表 package
- 性能 profiling 工具和验收构建方式
- 已知性能预算或监控指标

共通规约不能为所有 App 固定同一 FPS、启动时间、内存或列表参数。

## React 渲染边界

### State 归属

- State 放在需要它的最小稳定 owner 中。
- 不把只有单个页面使用的输入状态提升到全局 Context。
- 不保存可以从 props 或现有 state 直接推导的第二份 state。
- 更新集合时保持未变化 item 的引用稳定，避免整列表无意义重建。
- 使用 functional state update 处理依赖旧值的并发更新。

### Context

- Context 按更新频率和语义拆分，避免一个大 Context 让无关页面全部重渲染。
- Provider value 中的 action 和对象只有在跨渲染引用稳定确有价值时才 memoize。
- 公开 snapshot 未变化时应保持引用稳定，尤其是使用 `useSyncExternalStore` 的外部 store。
- Context 不承载 token、大型列表 cache 或高频动画值。

### `memo`、`useMemo` 与 `useCallback`

它们是性能工具，不是代码格式要求。

适合使用的情况：

- 值计算经过 profiling 证明昂贵
- 引用稳定是 `memo` 子组件、Context value、effect 或 native subscription 的真实契约
- `FlatList` 的 `renderItem`、footer、empty component 因引用变化触发明显额外工作
- 数据转换会为大量 item 创建新对象且确实影响帧时间

不应使用的情况：

- 计算只是简单属性读取或短数组操作
- 没有 memo boundary，引用稳定不会减少任何工作
- dependency 经常变化，memo 几乎每次失效
- 为了消除 lint 或让代码“看起来优化”
- 自定义 comparator 比重新渲染更复杂或容易返回错误结果

`React.memo` 只用于纯组件。自定义比较函数必须覆盖所有影响渲染和交互的 props，并有性能证据与测试；不能通过忽略 callback 或对象变化制造陈旧 UI。

## 大列表与虚拟化

### 组件选择

- 短且确定不会增长的内容可以使用 `ScrollView` 或 `map`。
- 长列表、分页列表和动态数据使用 `FlatList` / `SectionList` 或项目批准的虚拟列表。
- 不用 `ScrollView` 一次渲染大量 item。
- 不在同方向 `ScrollView` 内嵌虚拟列表来规避布局问题。

### Key 与 item 引用

- `keyExtractor` 使用后端或本地模型的稳定 ID。
- 不使用数组索引、展示文案或每次 render 新生成的值作为 key。
- 分页 append 按稳定 ID 去重，并保持未变化 item 引用。
- 删除、屏蔽、点赞等局部 patch 只更新受影响 item，不重建无关页面 cache。

### `renderItem` 与 `extraData`

- `renderItem` 应保持职责集中，不在其中执行 API、昂贵解析或无界数据转换。
- 传给 item 的对象和 handler 应避免无意义地每次重建，但不要为了引用稳定牺牲清晰性。
- `extraData` 只包含真正影响列表 item 的最小状态；不能传入每次 render 都变化的大对象。
- item 内昂贵 view model 转换应移到数据适配层、selector 或有依据的 memoization。

### `getItemLayout`

- 仅在 item 尺寸固定或可以可靠计算时使用。
- offset 必须包含 separator 尺寸。
- 动态高度列表不能为了优化而填写不准确的 `getItemLayout`。
- 固定尺寸 carousel、picker 或规则行列表可优先使用它跳过测量。

### Window 参数

`initialNumToRender`、`maxToRenderPerBatch`、`updateCellsBatchingPeriod`、`windowSize` 和 `removeClippedSubviews` 必须根据：

- 首屏高度
- item 成本
- 目标设备
- 快速滚动空白风险
- 内存压力
- 平台差异

通过 profiling 调整。不能从其他 App 复制一组“通用最佳值”。

### Pagination 与 Refresh

- `onEndReached` 必须幂等，不能因多次触发产生重复请求。
- loading lock 在发请求前同步设置；不能只等待下一次 React render 才阻止并发。
- refresh、initial load 和 load-more 的互斥关系必须明确。
- cursor 从当前最新 cache 读取，不从陈旧闭包继续翻页。
- late response 在写入 state 前校验 request version、query key 或 cancellation signal。
- 页面卸载、筛选条件改变或账号切换后，旧 response 不得写入新页面。
- 删除末尾 item 后是否自动补页应有明确规则，不能形成请求循环。

## 异步工作与主线程

- 昂贵同步计算不放在 render、scroll handler 或 press feedback 同一帧。
- 可以预计算、分页或移到纯数据层的工作，不在每个 item 中重复。
- 不在 scroll event 中频繁 `setState`；优先使用稳定阈值、native/UI-thread 动画或节流方案。
- timeout、request、subscription 和 animation 在卸载或条件变化时清理。
- `AbortController`、request version 或 session lease 用于防止无效异步结果提交；仅检查 mounted 不能解决跨查询或跨账号 stale data。
- 独立初始化任务可并行执行，但有顺序或安全依赖的任务必须显式串行。

## 图片与文件

- 列表缩略图使用与显示尺寸匹配的资源，不下载原始大图后依赖缩放。
- 使用当前项目批准的图片缓存、占位和错误 fallback 方案。
- 对远程图片明确 `resizeMode`、宽高或 aspect ratio，减少布局跳动。
- 不在滚动期间反复创建 base64、大对象或进行同步图片处理。
- 图片预处理、裁切和压缩应在提交前或后台阶段完成，不阻塞按压反馈。
- 只为判断文件类型时读取最小必要 header，不把整份大文件读入 JavaScript 内存。
- File handle、临时文件和 object URL 必须按生命周期释放或清理。
- 动画缩放大图时优先使用 transform，而不是每帧改变原始宽高和触发重新裁切。

## 动画与手势

- 复用项目统一动画基础设施和 motion token。
- 能在 UI / native thread 执行的连续动画，不应依赖每帧 React state 更新。
- 动画开始、取消、快速重复点击和组件卸载都要有确定行为。
- 转场期间避免同步执行大数据转换、日志批量写入或大型组件树重建。
- Gesture callback 不创建无界对象、timer 或 request。
- reduce motion 模式下使用项目批准的降级方案。

## 启动与导航

- 启动阶段只阻塞真正决定首屏正确性的任务。
- 字体、Auth restore、必要配置等依赖关系必须明确；不相关任务尽量延后或并行。
- Native Splash 只在 App 尚未具备可显示首帧时保留，不能被页面各自控制。
- Root Provider 数量和 value 更新应受控，不在根层订阅所有 feature 数据。
- 大型非首屏模块是否 lazy load 由 bundle 与首屏测量决定。
- 页面切换不因错误 key、条件重建 Root 或重复 Provider 导致整棵树 remount。

## Cache 与内存

- Cache 必须有 owner、key、容量或清理条件。
- user-scoped cache 按 user 隔离，并在 logout / account switch 时清理或失效。
- 不把 API response 无限累积在 module-level Map 或 Context。
- 列表分页应定义保留页数、刷新替换和删除策略。
- blob、base64、图片、文件 handle 和大型日志不能长期留在 React state。
- AppState 切换和内存告警下是否需要释放资源，由项目级策略决定。

## 日志与调试代码

- 不在 render、scroll、animation frame 和高频 listener 中输出 console 日志。
- Production 构建不得保留可能造成明显性能损耗或泄露数据的调试日志。
- 性能 instrumentation 使用项目批准的工具，并能够在关闭后不改变业务行为。

## Profiling 流程

发现卡顿、启动慢、内存增长或列表空白时：

1. 定义可复现步骤、数据规模、设备和构建类型。
2. 判断是 JS frame、UI frame、网络、图片、原生模块还是内存问题。
3. 使用 React Native DevTools、平台 profiler 或项目监控获取证据。
4. 记录修改前基线。
5. 一次只改变一个主要变量。
6. 在相同场景复测，并检查正确性和低端设备回归。
7. 将必要预算和验收方式写入项目级规约。

性能结论必须来自 release 或接近 release 的构建。Development mode 只能用于定位，不用于最终指标。

## 性能测试与验收

自动测试用于保证：

- pagination lock 和去重
- stale response 不提交
- Context snapshot 引用稳定契约
- cleanup 和资源释放
- 大数据 selector / view model 的正确性

自动测试不能代替真实设备 profiling。最终至少验证：

- 首屏进入
- 快速滚动与反向滚动
- refresh 与 load-more 并发
- 图片密集页面
- 键盘打开时输入和列表滚动
- Modal / navigation transition
- 后台恢复
- 长时间使用后的内存趋势

## Review 清单

- [ ] 优化前有可复现问题或明确预算。
- [ ] 性能在 release 或近 release 构建验证。
- [ ] State 位于最小合理 owner。
- [ ] Context 没有无关高频更新。
- [ ] memoization 有真实边界和正确 dependency。
- [ ] 列表 key 稳定，分页和 refresh 有同步锁。
- [ ] stale response 不会覆盖新查询、新页面或新账号。
- [ ] 大图、文件 handle、timer、listener 和 animation 会清理。
- [ ] 没有在高频路径输出日志或进行昂贵同步计算。
- [ ] iOS 与 Android、目标低端设备均完成验证。

## 参考基线

- [React Native Performance Overview](https://reactnative.dev/docs/performance)
- [React Native Profiling](https://reactnative.dev/docs/profiling)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [React Native ScrollView](https://reactnative.dev/docs/scrollview)
