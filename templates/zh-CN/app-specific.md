# App 专属移动端规约

> 将本模板复制到使用方项目的 `mobile/docs/agents/app-specific.md` 或等价项目级文档，填写当前 App 的真实配置。未确定的内容写“未确定”，不能用另一个 App 的配置代替。以下 22 项与完整工程标准第 11 节逐项对应。

## 1. 项目身份

- 规约语言：`zh-CN`
- App 名称：
- `mobile/` 路径：
- package 名称：
- Expo SDK：
- React Native：
- React：
- package manager：
- 原生 workflow：

## 2. 必读文档

- 架构：
- API contract：
- 数据与存储：
- 键盘布局：
- 测试规范：
- 发布规范：

## 3. 目录与路径别名

- 是否采用标准结构：
- 批准的额外目录：
- `model` 使用条件：
- `use-cases` 使用条件：
- 路径别名：
- `index.tsx` 约定：
- 页面 export 约定：

## 4. 路由与导航

- route groups：
- Root Stack：
- Tabs：
- Tab Stack：
- 跨 Tab 页面：
- Modal：
- route constants：
- 动画要求：
- 返回要求：

## 5. Design Token

- 代码事实源：
- Figma Variables / Library：
- 颜色：
- spacing：
- radius：
- shadow：
- typography：
- z-index：
- 主题模式：

## 6. 字体与语言

- 支持语言：
- 字体：
- fallback：
- 字重映射：
- 动态字体：
- 最大缩放：

## 7. 动效

- motion token：
- navigation：
- Modal / Sheet：
- press feedback：
- loading：
- reduce motion：
- 禁止实现：

## 8. Styling 与基础组件

- styling system：
- 样式共置/拆分规则：
- theme 入口：
- Button 入口：
- Input 入口：
- Switch 入口：
- Checkbox 入口：
- Radio 入口：
- Image 入口：
- Avatar 入口：
- Modal 入口：
- Sheet 入口：
- keyboard-aware 入口：
- loading 入口：
- empty 入口：
- error 入口：

## 9. 共通组件目录

- 公开 primitive / pattern：
- 公开入口：
- 直接消费者：
- variant：
- 弃用组件：
- 组件示例位置：
- style escape policy：

## 10. 图片、SVG 与图标

- 资源目录：
- SVG 接入：
- icon 来源：
- 多倍率位图：
- placeholder：
- fallback：
- 命名规则：

## 11. 数据、API 与状态

- API client：
- response envelope：
- Controller 使用条件：
- Use Case 使用条件：
- Reducer 使用条件：
- Strategy 使用条件：
- Adapter 使用条件：
- Repository 使用条件：
- Auth：
- token：
- KV：
- 离线数据：
- 文件 cache：
- scoped event/state：
- 禁止方案：

## 12. 控制流约定

- 主要动作路径：
- Controller 返回结构：
- Use Case result 约定：
- 错误映射：
- 导航归属：
- 提交锁：
- 取消规则：
- stale-result 规则：

## 13. 复用策略

- 复用搜索范围：
- Feature First：
- 提升到 shared 的条件：
- 迁移流程：
- 降级流程：
- 允许的 slot/variant：
- 重复代码后续触发条件：

## 14. 平台配置

- iOS 最低版本：
- Android 最低版本：
- edge-to-edge：
- StatusBar：
- system navigation：
- safe area：
- 权限：
- 平台差异：

## 15. 性能与渲染

- 目标设备：
- 关键性能路径：
- release profiling：
- 工具：
- 预算：
- 列表规模：
- 虚拟列表：
- 图片 cache：
- Cache owner：
- 清理策略：

## 16. 测试策略

- test runner：
- 各层工具：
- Use Case 测试：
- Reducer 测试：
- Controller 测试：
- native mock：
- setup/cleanup：
- include：
- test ID：
- coverage：
- flaky test：
- 双端验收矩阵：
- CI checks：

## 17. 安全与隐私

- 数据分类：
- Auth contract：
- protected storage：
- KV/database/cache：
- API origin：
- HTTP 例外：
- Deep Link：
- WebView：
- 权限：
- 日志脱敏：
- SDK consent：
- logout 清理：
- 删除清理：

## 18. 依赖约束

- 允许的 UI：
- 允许的 animation：
- 允许的 gesture：
- 允许的 native module：
- 新依赖审批：
- workspace dependency 规则：
- Expo config plugin 规则：

## 19. Figma 工作流

- team/project：
- Design Library：
- 页面文件：
- Dev Mode / Code Connect：
- 资源导出权限：
- Token 与共通组件对齐流程：
- 视觉验收设备：

## 20. 检查与交付命令

- format：
- lint：
- typecheck：
- test：
- dependency boundary：
- iOS：
- Android：
- 最低交付检查：
- CI checks：
- 存量问题记录位置：

## 21. 项目专属禁止事项

- 项目专属禁止事项：

## 22. 已批准例外

每个例外分别记录：

- 共通规则：
- 例外原因：
- 影响范围：
- 替代措施：
- 验收方式：
- 到期或复查条件：
