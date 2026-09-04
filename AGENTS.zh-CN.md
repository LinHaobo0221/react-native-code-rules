# Codex 仓库级执行说明

rules_language: zh-CN

文档链接相对于本文件所在目录解析；从已安装的 package 读取本文件时，也以 package 内本文件的位置为基准，不以使用方项目的工作目录为基准。

## 1. 生效范围与规则优先级

本文件位于仓库根目录，对整个仓库生效。更靠近目标代码目录的 `AGENTS.md` 或 `AGENTS.override.md`，只在其目录范围内补充或覆盖本文件。

规则冲突时，按以下优先级处理：

1. 用户当前任务中明确提出的需求、限制和验收条件。
2. 距离目标文件最近且处于生效范围内的 `AGENTS.override.md` / `AGENTS.md`。
3. 当前仓库中可验证的项目事实，包括代码、配置、API contract、测试和已批准的架构文档。
4. [docs/zh-CN/README.md](docs/zh-CN/README.md) 中列出的完整工程标准分册。

[docs/zh-CN/00-core-rules.md](docs/zh-CN/00-core-rules.md) 是每次编码前的强制执行闸门，也是完整标准的执行摘要；它不能被理解为对完整标准的删减或放宽。

## 2. 必须使用的两类 React Native / Expo 规则文档

Codex 在 React Native / Expo 代码任务中，必须使用以下两类共通规则文档：

1. [docs/zh-CN/00-core-rules.md](docs/zh-CN/00-core-rules.md)
   - 精简执行规则。
   - 每次生成、修改、修复或重构 React Native / Expo 代码前，必须完整读取。

2. [docs/zh-CN/README.md](docs/zh-CN/README.md) 中列出的完整工程标准分册
   - 完整且权威的工程标准。
   - 按本文件定义的章节路由读取；架构级、跨 Feature 或高风险任务必须完整读取 `01`～`12` 全部分册（`12` 同时保留原文第 13 节总结）。索引不能代替分册正文。

不能以历史会话、过去读取过、摘要或记忆代替本次任务中的实际读取。如果核心规则、工程标准索引或本次任务要求读取的任一分册不存在或无法读取，在报告缺失路径之前，不得修改 React Native / Expo 代码。

## 3. 修改代码前的强制顺序

必须按以下顺序执行。完成第 1～7 步之前，不得开始写代码或修改文件。

### 第 1 步：理解当前任务

- 明确目标、限制、涉及的平台和完成条件。
- 判断任务类型：功能实现、Bug 修复、重构、代码审查、Figma 还原或架构设计。
- 区分用户明确要求与模型自行推测的内容；不得把推测当作项目事实。

### 第 2 步：加载仓库规则

- 应用根目录本文件。
- 继续检查目标文件路径上是否存在更近的 `AGENTS.md` 或 `AGENTS.override.md`。
- 按第 1 节的优先级解决冲突。

### 第 3 步：完整读取核心规则

完整读取：

[docs/zh-CN/00-core-rules.md](docs/zh-CN/00-core-rules.md)

必须把其中的六条硬规则和完成前检查清单作为本次任务的强制条件。

### 第 4 步：确认项目事实，再选择架构

至少检查：

- `git status`，并保留与当前任务无关的修改。
- 相关 workspace 的 `package.json` 和可用 scripts。
- Expo 配置、`tsconfig`、路径别名、lint、format 和测试配置。
- 与任务直接相关的架构文档、API contract 和项目约定。
- 当前项目实际使用的状态管理、请求、存储、路由、UI 和测试方案。

禁止自行发明仓库中没有依据的依赖、Route、Design Token、API contract、状态库、存储机制或平台行为。

### 第 5 步：先检查现有代码，再决定新建代码

必须读取和搜索：

- 目标 Feature 的 Page、UI、Hook、Model、Use Case、API、Types 和 Utils。
- 目标代码的直接调用方、直接消费者和相关测试。
- 当前 Feature 内已有的相似实现。
- `shared/ui`、`shared/hooks`、`shared/utils`、`shared/constants` 和公共 exports。
- 已有 Design Token、基础组件，以及表达相同用户意图的实现。

修改 Shared 组件、Shared Hook 或共通流程前，必须检查所有直接消费者，不能只查看当前页面。

### 第 6 步：按任务类型读取完整工程标准

索引：[docs/zh-CN/README.md](docs/zh-CN/README.md)。分册编号对应完整标准原章节；`12` 分册另含原文第 13 节总结。

所有代码任务都必须读取：

- 第 1 节：[规则定位和使用边界](docs/zh-CN/01-core-principles.md)
- 第 2 节：[项目与目录结构](docs/zh-CN/02-project-structure.md)
- 第 4 节：[Page、UI、复用、Controller 和样式](docs/zh-CN/04-component-and-styling.md)
- 第 7 节：[依赖、修改范围和交付流程](docs/zh-CN/07-delivery-and-constraints.md)
- 第 9 节：[测试策略](docs/zh-CN/09-testing-strategy.md)
- 第 12 节：[最终检查清单](docs/zh-CN/12-final-checklist.md)

根据任务追加读取：

- Route、Navigation、Tabs、Stack、返回行为、路由级 Modal：读取[第 3 节](docs/zh-CN/03-routing-and-navigation.md)。
- Figma、新 UI、视觉调整、图片/SVG、表单、键盘、Sheet、Dialog、Safe Area、可访问性、iOS/Android 差异：读取[第 5 节](docs/zh-CN/05-figma-workflow.md)和[第 6 节](docs/zh-CN/06-interaction-platform-and-accessibility.md)。
- 列表、渲染、图片性能、动画、Cache、启动、内存、性能优化：读取[第 8 节](docs/zh-CN/08-performance-and-rendering.md)。
- Auth、Token、API 安全、存储、上传下载、权限、Deep Link、WebView、隐私或敏感数据：读取[第 10 节](docs/zh-CN/10-security-and-privacy.md)。
- 项目事实缺失、新项目区域初始化、项目规范审计：读取[第 11 节](docs/zh-CN/11-project-specific-rules.md)。

以下任务必须完整读取整个工程标准，即 `01`～`12` 全部分册：

- 跨 Feature 重构。
- 架构调整或新增子系统。
- Shared 基础设施变更。
- Auth / Session 变更。
- 安全敏感变更。
- 同时影响三个及以上生产模块的变更。

### 第 7 步：通过实现前质量闸门

开始修改前，必须先给出简洁的实现说明，至少包含：

1. 目标文件及每个文件的职责。
2. 复用候选，以及最终选择：直接复用、扩展、抽取更低层能力或保持独立。
3. 主要用户动作从 UI callback 到权威编排点，再到外部副作用的完整路径。
4. 准备使用的设计模式、其解决的真实复杂度，以及明确不引入哪些没有必要的模式。
5. 修改后准备执行的检查命令和平台验收项目。

未找到复用候选时，必须明确写出已搜索的范围以及“未发现语义匹配实现”，不能直接省略复用审查。

## 4. 实现过程中的强制规则

- 使用满足需求的最小且完整的变更，不重写无关代码。
- 先搜索再新建。只有语义、状态合同、可访问性/平台合同和未来变化原因一致时才共通。
- 按最低稳定层复用：Token → Primitive → 纯函数/Model → Headless Hook → Feature Pattern → Shared Pattern。
- 尚不稳定的抽象保留在 Feature 内，不创建包含页面专属 Boolean、Route 判断、巨大 Config 或无界 Style Override 的万能组件。
- 每个主要用户动作只能有一个权威编排点，关键步骤必须能在该边界中顺序阅读。
- 删除 `handleX -> doX -> executeX -> service.x` 这类空转链；除非每一层确实增加了转换、校验、Invariant、分支、错误映射、并发控制、副作用边界或可替换实现。
- 只有在真实复杂度触发时才使用 Controller、Use Case、Reducer/状态机、Strategy、Adapter 或 Repository，禁止为了表现“有架构”而增加层级。
- UI 不得承担 API、Auth、存储和导航编排；Use Case 不得依赖 React、UI、Toast 或 Router；Reducer 必须保持纯函数。
- 未经用户明确批准，不新增生产依赖。
- 抽取共通代码时，应在同一次修改中迁移目标消费者并删除被替代的重复实现；必须分阶段时，记录范围、原因和完成条件。
- 按行为和回归风险新增或更新相应层级的测试。

## 5. 修改后的验证与复核顺序

实现完成后，必须按以下顺序执行：

1. 项目已有 Formatter 可用时，对修改文件执行格式化。
2. 执行相关 Lint。
3. 执行 TypeScript Typecheck。
4. 先执行针对修改行为的测试，再按影响范围执行更大的相关测试集。
5. 按受影响范围执行 Expo config、bundle 或原生构建检查。
6. 平台敏感修改必须验证 iOS 和 Android；Web 渲染不能作为最终原生验收。
7. 审查完整 Diff，检查无关修改、死代码、遗留重复实现、隐藏调用链、不安全类型断言、缺失 Cleanup 和新增跨层依赖。
8. 重新读取 [核心规则第 6 节](docs/zh-CN/00-core-rules.md)，以及[工程标准第 12 节](docs/zh-CN/12-final-checklist.md)。
9. 对所有相关检查项标记：通过、失败、不适用或未执行。
10. 必须执行但未执行的检查，要说明具体项目和原因；不得将工作描述为“已完整完成”。

## 6. 最终回复必须包含

- 修改内容和关键文件。
- 复用/共通化的决定及理由。
- 主要动作路径和权威编排边界。
- 引入的设计模式及其必要性。
- 实际执行的命令、检查和结果。
- 已完成的 iOS / Android 验证。
- 剩余风险、偏差和未验证项目。

## 7. 禁止的快捷做法

- 未读取强制规则和相关现有代码就开始生成代码。
- 未做复用搜索就新增近似的 Button、Card、Row、Input、Modal、EmptyState、Hook、Utility 或业务流程。
- 仅因为代码外观相似或出现两次就强行抽象。
- 使用 EventBus、Context、Module Singleton、Generic Manager 或同参数包装函数隐藏本可直接表达的控制流。
- 创建没有清晰单一职责的 `helpers.ts`、`common.ts`、`manager.ts` 或 `service.ts`。
- 为了使用设计模式，给简单的一次 API 调用增加无意义的 Use Case、Repository、Factory、Class 或 Interface。
- 使用新依赖回避现有技术栈本来可以清晰实现的问题。
- 跳过测试、Typecheck、双端影响分析或 Diff Review 后宣称任务已完成。
