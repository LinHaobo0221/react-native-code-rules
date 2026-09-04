# 8. 性能与渲染规则

本节是性能与渲染的完整规则。

### 8.1 核心原则

- 先测量，再优化。
- 不根据直觉堆叠 `memo`、`useMemo`、`useCallback` 和列表参数。
- 性能验收使用 release 或接近 release 的构建，不能以 development mode 作为最终结论。
- 区分 JavaScript thread、UI thread、网络、图片解码和原生模块成本。
- 优化必须保留正确性、可访问性和可读性。
- 使用可复现操作、固定数据量和目标设备档位。
- 没有证据时，优先保持简单、正确的实现。

### 8.2 State、Context 和 memoization

- State 放在需要它的最小稳定 owner 中。
- 不把单页面输入状态提升到全局 Context。
- 不保存可由 props 或已有 state 推导出的第二份 state。
- 更新集合时保持未变化 item 的引用稳定。
- 依赖旧值的并发更新使用 functional state update。
- Context 按更新频率和语义拆分。
- Context 不承载 token、大型列表 cache 或高频动画值。
- `memo`、`useMemo`、`useCallback` 只有在确有计算成本、引用契约或 profiling 证据时使用。
- `React.memo` 只用于纯组件。
- 自定义 comparator 必须覆盖所有影响渲染和交互的 props，不能制造陈旧 UI。

### 8.3 大列表和虚拟化

- 短且确定不会增长的内容可用 `ScrollView` 或 `map`。
- 长列表、分页列表和动态数据使用 `FlatList` / `SectionList` 或项目批准的虚拟列表。
- 不用 `ScrollView` 一次渲染大量 item。
- 不在同方向 `ScrollView` 内嵌虚拟列表。
- `keyExtractor` 使用后端或本地模型稳定 ID。
- 分页 append 按稳定 ID 去重，保持未变化 item 引用。
- `renderItem` 不执行 API、昂贵解析或无界数据转换。
- `extraData` 只传入真正影响列表 item 的最小状态。
- `getItemLayout` 只在尺寸固定或可可靠计算时使用，offset 包含 separator。
- 不能为了“优化”填写不准确的动态高度布局。
- `initialNumToRender`、`windowSize` 等窗口参数必须根据首屏高度、item 成本、目标设备、空白风险、内存和平台差异 profiling 调整。

### 8.4 Pagination、Refresh 和异步工作

- `onEndReached` 必须幂等。
- 发请求前同步设置 loading lock，不能只等待下一次 render。
- initial load、refresh、load-more 的互斥关系必须明确。
- cursor 从最新 cache 读取，不能使用陈旧闭包。
- late response 写入前校验 request version、query key 或 cancellation signal。
- 页面卸载、筛选改变或账号切换后，旧 response 不得写入新页面。
- 删除末尾 item 后是否自动补页要有明确规则，不能形成请求循环。
- 昂贵同步计算不放在 render、scroll handler 或 press feedback 同一帧。
- 不在 scroll event 中频繁 `setState`。
- timeout、request、subscription 和 animation 在卸载或条件变化时清理。
- 仅检查 mounted 不能解决跨查询或跨账号 stale data；应使用 `AbortController`、request version 或 session lease。
- 有顺序或安全依赖的初始化任务必须显式串行，互不相关的任务可以并行。

### 8.5 图片、文件、动画和缓存

- 列表缩略图使用匹配显示尺寸的资源。
- 远程图片明确 `resizeMode`、宽高或 aspect ratio。
- 不在滚动期间反复创建 base64、大对象或进行同步图片处理。
- 图片预处理、裁切和压缩不阻塞按压反馈。
- 只为判断文件类型时读取最小 header。
- File handle、临时文件和 object URL 必须按生命周期释放。
- 动画缩放大图时优先使用 transform。
- 连续动画优先在 UI / native thread 执行，不依赖每帧 React state。
- 动画开始、取消、快速重复点击和卸载都要有确定行为。
- Gesture callback 不创建无界对象、timer 或 request。
- reduce motion 使用项目批准的降级方案。
- Cache 必须有 owner、key、容量或清理条件。
- user-scoped cache 按 user 隔离，并在 logout / account switch 时清理或失效。
- 不把 API response 无限累积在 module-level Map 或 Context。
- blob、base64、图片、文件 handle 和大型日志不能长期留在 React state。

### 8.6 启动、导航和 profiling

- 启动阶段只阻塞决定首屏正确性的任务。
- 字体、Auth restore 和必要配置的依赖关系要明确。
- Native Splash 只在 App 尚未具备可显示首帧时保留。
- Root Provider 数量和 value 更新受控，不在根层订阅所有 feature 数据。
- 是否 lazy load 大型非首屏模块由 bundle 和首屏测量决定。
- 页面切换不能因错误 key、条件重建 Root 或重复 Provider 导致整棵树 remount。
- 不在 render、scroll、animation frame 和高频 listener 中输出 console 日志。
- Production 不保留高损耗或可能泄露数据的调试日志。

Profiling 流程：

1. 定义可复现步骤、数据规模、设备和构建类型。
2. 判断是 JS frame、UI frame、网络、图片、原生模块还是内存问题。
3. 使用 DevTools、平台 profiler 或项目监控获取证据。
4. 记录修改前基线。
5. 一次只改变一个主要变量。
6. 在相同场景复测，检查正确性和低端设备回归。
7. 将必要预算和验收方式写入项目级规约。

最终至少验证首屏、快速滚动和反向滚动、refresh/load-more 并发、图片密集页面、键盘滚动、Modal/导航转场、后台恢复和长时间使用后的内存趋势。

---
