# React Native / Expo 共通代码生成规约（索引）

本 package 是 React Native / Expo 移动端项目的共通规约入口。它只定义可跨 App 复用的目录、代码、Figma 工作流和质量标准；任何具体设计值、业务规则和项目依赖必须由使用方仓库自己的项目级文档提供。

使用方项目必须在自己的 `AGENTS.md` 中声明 `rules_language: zh-CN`，并明确指向本文件。若项目选择其他语言，应改读对应语言入口，不能在一次普通 App 任务中混读多套译本。

## 强制读取顺序

生成或修改 React Native / Expo 代码前，必须完整读取：

1. [docs/zh-CN/01-core-principles.md](docs/zh-CN/01-core-principles.md)
2. [docs/zh-CN/02-project-structure.md](docs/zh-CN/02-project-structure.md)
3. [docs/zh-CN/03-routing-and-navigation.md](docs/zh-CN/03-routing-and-navigation.md)
4. [docs/zh-CN/04-component-and-styling.md](docs/zh-CN/04-component-and-styling.md)
5. [docs/zh-CN/05-figma-workflow.md](docs/zh-CN/05-figma-workflow.md)
6. [docs/zh-CN/06-interaction-platform-and-accessibility.md](docs/zh-CN/06-interaction-platform-and-accessibility.md)
7. [docs/zh-CN/07-delivery-and-constraints.md](docs/zh-CN/07-delivery-and-constraints.md)
8. [docs/zh-CN/08-performance-and-rendering.md](docs/zh-CN/08-performance-and-rendering.md)
9. [docs/zh-CN/09-testing-strategy.md](docs/zh-CN/09-testing-strategy.md)
10. [docs/zh-CN/10-security-and-privacy.md](docs/zh-CN/10-security-and-privacy.md)
11. 使用方项目自己的 `mobile/docs/agents/app-specific.md` 或等价项目级规约

默认必须读取全部文件，不能依赖历史摘要代替原文。若任务完全不涉及 Figma，`05-figma-workflow.md` 中的 Figma 节点读取步骤不触发，但其他结构与质量规则仍然有效。

## 规则边界

- 共通规约确定标准目录、文件职责、代码分层、交互质量、性能诊断、测试、安全隐私和交付流程。
- 项目级规约确定 route 名称、Token、字体、动效、资源、依赖、API、Auth、存储和业务约束。
- Figma 是当前设计任务的视觉事实源；代码目录和工程约束由规约决定。
- 不能把某个既有 App 的页面名、业务组件、品牌色或技术偶然性提升为所有 App 的共通规则。
- 项目级规则缺失时，采用最保守实现，不自行创造 Design Token、动效系统、依赖或业务逻辑。

## 使用方接入要求

每个使用方仓库必须保留一个仓库内可直接发现的 `AGENTS.md` 入口，在入口中声明 `rules_language: zh-CN`，并明确指向本文件和项目级补充文档。不能只安装 npm package 后假设代码生成工具会自动发现 `node_modules` 中的规约。

项目级补充文档可从 [templates/zh-CN/app-specific.md](templates/zh-CN/app-specific.md) 开始填写。

## 维护要求

- 共通原则只在本仓库维护，避免多个 App 各自复制后独立演化。
- 使用方 App 只维护项目差异，不重复粘贴整套共通规则。
- 新规则进入共通库前，必须确认它至少适用于两个 App，或本质上属于平台级质量要求。
- 具体组件实现、Token 数值和动效参数不得进入本仓库。
