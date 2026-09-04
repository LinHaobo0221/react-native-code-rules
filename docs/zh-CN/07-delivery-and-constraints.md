# 7. 依赖、变更范围和交付规则

### 7.1 依赖约束

- 未经明确批准，不新增第三方依赖。
- 需要新依赖时，先提交选型说明，再执行安装。
- 每个 workspace 只能 import 自己 `package.json` 中声明的 package。
- 不能依赖根目录或其他 workspace 的 hoist 结果。
- React、React Native、Expo 和原生模块避免重复或冲突版本。
- UI package、config plugin 和 native module 遵守当前 Expo workflow。
- 不擅自切换 managed / prebuild / bare。
- 不因希望使用某个设计模式而引入 DI container、状态机库、Repository 框架或 UI library；当前语言和项目能力足够时保持无依赖实现。

依赖选型至少说明：

- Expo / React Native 兼容性
- iOS / Android 支持
- 是否包含原生代码或 config plugin
- 性能和包体积影响
- 维护活跃度和升级风险
- 当前依赖或原生实现能否满足
- 安装、配置、EAS 和回滚成本

未经批准只能给建议，不能实际安装。

### 7.2 项目边界

- `mobile/` 是移动端事实范围，不能直接 import backend 的 Node-only 内部文件。
- 跨 workspace 共享必须通过公开 package exports。
- 不为单个页面修改 monorepo workspace 边界。
- 不擅自调整 build、EAS、native project 或 signing 配置。
- 不提交 `.expo`、build output、临时导出资源和本地凭据。
- 不把 token、密码、密钥、个人信息或环境变量值写入代码、日志和文档。
- 不通过全局 EventBus、module singleton 或隐式 barrel export 绕过 feature 边界。

### 7.3 修改范围

- 保留与任务无关的既有修改。
- 不执行破坏性 git 操作清理他人工作。
- 不因局部需求大规模格式化无关文件。
- 同一根因影响同一 flow、共通组件或共通 Use Case 的多个消费者时，应在明确边界内同步检查，并列出范围。
- 共通化迁移必须删除被替代的重复实现，或明确分阶段迁移计划和到期条件。
- 如果需要改变 API、数据结构、依赖或项目架构，实施前获得确认。

### 7.4 代码生成流程

1. 读取共通规约、项目规约和相关现有代码。
2. 检查 package、路径别名、测试、构建配置和工作区已有改动。
3. 对新增 UI、Hook、工具和业务操作执行复用搜索，列出候选与采用/不采用理由。
4. 标出主要用户动作的调用路径，决定使用直接 handler、Controller、Use Case、Reducer、Strategy、Adapter 或 Repository；每个模式写明触发原因。
5. Figma 任务执行完整节点读取流程，并把 Figma component/variant 映射到已有或新增代码抽象。
6. 先输出目录映射、文件职责、复用审查、动作流程、不确定项和假设。
7. 使用最小必要变更完成需求；保持一条动作一个权威编排点。
8. 共通化时更新所有目标消费者并删除旧重复版本；不保留无说明的双事实源。
9. 删除无语义转发函数、同义 handler 和因本次修改产生的死代码。
10. 资源在同一任务中完成语义化命名和引用。
11. 执行项目已有的 format、lint、typecheck、test、Expo config、bundle 和原生检查。
12. 复核主要动作的实际调用链、共通组件全部直接使用方和 iOS / Android 行为。
13. 区分本次新增问题和仓库已有问题，不能用存量错误掩盖回归。

实现前输出示例：

```text
复用审查：复用 shared/ui/Button；抽取 feature/ui/ProfileField；
          不合并 HomeCard 与 ProfileCard，因为状态合同和变化方向不同。
动作路径：ProfileEditorView.onSubmit
          -> useProfileEditorController.actions.submit
          -> updateProfile use case
          -> profileApi.update
          -> typed result
          -> reducer + navigation
模式理由：存在 validation、提交锁、API、cache replace 和错误映射，使用 Use Case；
          状态互斥，使用 Reducer；没有多数据源，不引入 Repository。
```

### 7.5 测试强度与风险匹配

- 纯样式调整：lint、typecheck 和目标页面原生视觉检查。
- Feature UI：状态、回调、disabled、accessibility、variant 和平台分支测试。
- Shared UI：测试公开合同，并检查所有直接消费者；不能只测试组件本身。
- Hook / Controller：页面状态映射、竞态、cleanup、用户动作和导航/反馈结果。
- Use Case：用纯单元测试覆盖步骤顺序、成功、失败、幂等、错误映射和依赖调用边界。
- Reducer / Model：覆盖合法转换、非法组合、selector 和 invariant。
- Strategy / Adapter / Repository：覆盖合同一致性、实现切换和外部错误转换。
- 导航：入口、返回、replace、Modal 关闭和系统返回。
- API：request contract、runtime validation、loading、错误、Auth 失效和并发行为。

不能只验证 happy path。Bug 修复优先增加覆盖根因的回归测试。测试应证明公开行为和 invariant，不断言无意义的 private method 调用链。

### 7.6 Figma 交付要求

Figma 页面完成后说明：

- 已完成的节点和状态
- 复用的 Token、primitive、pattern 和 feature 组件
- 新增组件为何不能复用现有实现
- 新增的本地资源
- 与 Figma 的偏差和原因
- iOS / Android 验证情况
- 是否检查同 flow 的兄弟页面和共通组件消费者

无法访问正式 Figma 节点时，只能依据截图或描述降级实现，并明确标记尚待正式对齐的内容。

### 7.7 完成定义

只有以下条件都满足才算完成：

- 文件位于正确目录，依赖方向清楚。
- route 和导航层级正确。
- 已完成复用搜索；新增抽象有明确语义、消费者和变化原因。
- 共通能力位于最低稳定层，没有为共通而共通。
- 被替代的重复实现已删除，或迁移例外已记录。
- 组件职责、状态归属和主要动作路径清楚。
- 每个复杂用户动作有一个权威编排点，不存在连续空转转发链。
- 设计模式解决了可说明的真实复杂度，没有形式化过度设计。
- 没有新增未批准依赖。
- 没有散落新的重复 Token、业务规则或业务事实源。
- 关键交互真实可用。
- iOS / Android 风险已处理或明确说明。
- 可访问性和测试入口覆盖关键控件。
- 相关检查通过，或存量失败已隔离说明。
- 最终回复列出关键文件、复用决策、动作流程、验证结果和剩余偏差。

### 7.8 明确禁止

禁止：

- 跳过项目规约和已有代码搜索直接生成代码
- 在 `app/` 路由入口堆完整页面实现
- 未评估现有组件就新增近似 Button、Card、Row、Modal、Input 或 EmptyState
- 仅因视觉相似或出现两次就合并业务组件
- 为多个页面制造包含大量 boolean、route 判断、render override 和 style escape hatch 的万能组件
- 把页面业务逻辑塞进 shared UI
- 使用 `handleX -> doX -> executeX -> service.x` 等同义、同参数空转调用链
- 创建没有清楚职责的 `helpers`、`common`、`manager`、`service` 或 Facade
- 为展示设计模式而给一次 API 调用增加 Use Case、Repository、Factory、class 或 interface
- 使用 EventBus、Context 或 module singleton 隐藏本可直接表达的控制流
- 在 Reducer 中执行请求、导航、存储或其他副作用
- 在 Use Case 中操作 Toast、Dialog、组件状态或 Expo Router
- 复制另一个 App 的 Token、字体或动效作为默认值
- 用在线近似 icon 代替 Figma 正式资产
- 手绘设备系统 UI
- 用 Web 截图作为原生最终验收
- 只处理一个平台却不说明范围
- 通过新增依赖回避当前项目能力可以解决的问题
- 创建未经确认的真实 API、存储、权限、埋点或业务流程
- 在复杂度明显上升时拒绝合理拆分，或在简单场景强行增加架构层

---
