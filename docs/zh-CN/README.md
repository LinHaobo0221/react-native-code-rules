# React Native / Expo 工程规范（分册索引）

> 本目录组成完整的 React Native / Expo 中文工程规范，说明目录结构、代码分层、路由、组件、Figma 到代码的工作流、双端交互、性能、测试、安全和交付规则。
>
> 它适用于 React Native / Expo App，不是某个具体 App 的业务实现。具体的 Token、品牌资源、业务规则、API、依赖和 Figma 文件仍由使用方项目自己的 `app-specific.md` 定义。

> **修订版：v2.0（2026-09-04）**
>
> 本次修订重点补强两类问题：UI 与行为逻辑的适度共通化，以及用户动作到业务副作用之间的显式控制流。新增“先查再建、按变化原因抽象、最低稳定层复用、一条动作一处编排、禁止空转转发、按复杂度选用模式”等硬规则。

## 文件定位与读取入口

- 执行入口是 [AGENTS.zh-CN.md](../../AGENTS.zh-CN.md)，与仓库根目录 [AGENTS.md](../../AGENTS.md) 的中文规则一致。
- 每次任务先完整读取 [00 核心执行规则](00-core-rules.md)，再按执行入口规定读取工程标准的必读分册和任务相关分册。
- `01`～`12` 分册合起来是完整且权威的工程标准，不是摘要；本索引不能代替正文。各分册已替换旧版同名文件，不再同时读取旧版历史分册。
- 跨 Feature 重构、架构调整或新增子系统、Shared 基础设施变更、Auth / Session 变更、安全敏感变更，以及同时影响三个及以上生产模块的变更，必须完整读取 `01`～`12`。
- 评审报告、版本 Diff 和旧索引只用于维护或追溯，不属于日常代码生成的规则输入。
- 普通 App 任务只读取项目声明语言的版本，不根据设备 locale、代码文本或单条消息猜测语言。链接相对于当前文档所在目录解析。

## 分册与原文章节对应

| 分册 | 完整保留的原文范围 | 读取条件 |
| --- | --- | --- |
| [00 核心执行规则](00-core-rules.md) | 核心规则第 1～6 节 | 每次完整读取 |
| [01 核心原则](01-core-principles.md) | 工程标准第 1 节 | 所有代码任务 |
| [02 项目与目录结构](02-project-structure.md) | 工程标准第 2 节 | 所有代码任务 |
| [03 路由与导航](03-routing-and-navigation.md) | 工程标准第 3 节 | Route、Navigation、Tabs、Stack、返回、路由级 Modal |
| [04 Page、UI、复用、Controller 和样式](04-component-and-styling.md) | 工程标准第 4 节 | 所有代码任务 |
| [05 Figma 工作流](05-figma-workflow.md) | 工程标准第 5 节 | Figma、新 UI、视觉、资源、表单、键盘、弹层、Safe Area、可访问性、平台差异 |
| [06 交互、平台和可访问性](06-interaction-platform-and-accessibility.md) | 工程标准第 6 节 | 与 05 相同，按执行入口一并读取 |
| [07 依赖、变更与交付](07-delivery-and-constraints.md) | 工程标准第 7 节 | 所有代码任务 |
| [08 性能与渲染](08-performance-and-rendering.md) | 工程标准第 8 节 | 列表、渲染、图片性能、动画、Cache、启动、内存、性能优化 |
| [09 测试策略](09-testing-strategy.md) | 工程标准第 9 节 | 所有代码任务 |
| [10 安全与隐私](10-security-and-privacy.md) | 工程标准第 10 节 | Auth、Token、API 安全、存储、上传下载、权限、Deep Link、WebView、隐私、敏感数据 |
| [11 项目级规约](11-project-specific-rules.md) | 工程标准第 11 节 | 项目事实缺失、新项目区域初始化、项目规范审计 |
| [12 最终检查清单与总结](12-final-checklist.md) | 工程标准第 12、13 节 | 所有代码任务；交付前重新读取第 12 节 |

项目补充文档使用 [app-specific.md 模板](../../templates/zh-CN/app-specific.md)，按第 11 节的 22 项填写当前项目事实。

## 原文保留与结构调整说明

本次拆分采用仓库中实际存在的两份最新原文，原文件保持不变，作为维护对照，不是另一套需要混读的执行规则：

- [react-native-codex-execution-rules.md](../react-native-codex-execution-rules.md)
- [react-native-engineering-standards.md](../react-native-engineering-standards.md)

原 `AGENTS.md` 中的 `react-native-expo-core-rules.md` 和 `react-native-expo-engineering-standards.md` 是未落地的引用名，已分别改为 `00-core-rules.md` 和本分册索引。原文第 1.4 节的 `docs/codex/react-native-codex-execution-rules.md` 同样映射到当前语言的 `00-core-rules.md`。

中文规则正文只作分册、文件首标题层级及上述路径调整；第 1.4 节原先指向完整单文件的“本文件”同步改指完整分册或本共通规约。条款、列表、表格、示例和检查项不增删、不改写。原文开头关于单文件和历史十份分册的文件定位说明，已由本索引的现行定位取代。第 13 节总结完整并入 `12`，没有省略。英文与日文按相同结构逐条翻译。

原文第 1.3 节的共通规约优先级表述保持原样；执行时以当前 `AGENTS` 入口第 1 节规定的优先级处理冲突，不在拆分过程中改写规则。

维护验证命令：`npm run docs:check`（原文覆盖、三语结构、代码示例、相对链接）与 `npm run pack:check`（打包内容）。自动化结构检查不能代替翻译语义复核。
