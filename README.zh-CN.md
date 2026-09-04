# React Native Code Rules

**简体中文** · [日本語](README.ja.md) · [English](README.md)

React Native / Expo 项目的共通代码生成规约。该仓库只维护结构、职责、实现流程和质量标准，不提供具体 UI、Design Token、动效参数、品牌资源或业务实现。

当前版本：`0.1.0`

## 适用范围

本规约用于采用 React Native 与 Expo 的移动端项目，尤其适合由 Figma 驱动页面实现、使用 Expo Router 组织路由、并希望在多个 App 之间保持相同代码结构的团队。

共通库负责：

- `mobile/` 标准目录结构
- Page / UI / Controller / Use Case / Model / API / Shared 的职责边界
- 组件、文件、Props 与样式组织规范
- Expo Router 的通用组织原则
- Figma 读取、节点分析、资源导出和交付流程
- iOS / Android 双端、键盘、Modal、safe area 与可访问性标准
- 性能、渲染、列表、图片与资源生命周期原则
- 分层测试、竞态测试和原生验收策略
- 安全存储、Auth、网络、权限和隐私质量下限
- 依赖、检查和交付约束

每个 App 自己负责：

- 颜色、字体、间距、圆角、阴影等 Design Token
- 动效时长、easing 与转场参数
- 品牌组件、图片、SVG 和字体资源
- 具体 route group、route path 与 tab 名称
- API、Auth、本地存储与业务状态策略
- 具体性能预算、目标设备和 profiling 工具
- 测试 runner、component / E2E 工具和 CI 门槛
- 数据分类、权限、第三方 SDK 和安全风险等级
- Expo / React Native 版本和允许使用的第三方依赖
- 项目自己的 Figma Library、文件和页面链接

## 支持语言

- 简体中文：`zh-CN`
- 日文：`ja`
- 英文：`en`

使用方仓库必须明确声明受支持的 `rules_language`，并指向对应语言的 `AGENTS` 入口。不能根据设备 locale、代码文本或单条用户消息猜测规则语言。

## 仓库结构

```text
react-native-code-rules/
├── AGENTS.md
├── AGENTS.zh-CN.md
├── AGENTS.ja.md
├── AGENTS.en.md
├── README.md
├── README.zh-CN.md
├── README.ja.md
├── CHANGELOG.md
├── CHANGELOG.zh-CN.md
├── CHANGELOG.ja.md
├── docs/
│   ├── zh-CN/
│   ├── ja/
│   └── en/
└── templates/
    ├── zh-CN/
    ├── ja/
    └── en/
```

每个 `docs/<语言>/` 目录包含同一套 `00`～`12` 共 13 份规约文档及 `README.md` 索引；对应项目模板位于 `templates/<语言>/app-specific.md`。

先读对应语言的 `AGENTS` 执行入口，再完整读取 `00` 核心闸门；工程标准按入口要求读取必读及任务相关分册，高风险任务完整读取 `01`～`12`。`12` 同时保留原文第 13 节总结，不能只读索引代替正文。

中文入口：[AGENTS.zh-CN.md](AGENTS.zh-CN.md)；章节映射与原文保留说明：[工程标准索引](docs/zh-CN/README.md)。规则源文修订版为 `v2.0（2026-09-04）`，与 package 版本 `0.1.0` 分别管理；本次不自动发布或升级 package 版本。

## 在 App 中使用

`0.1.0` 暂时设置为 `private`，避免在 npm 账号归属和发布流程尚未确认前误发布到 registry。当前可通过本地路径试用：

```bash
npm install --save-dev ../react-native-code-rules
```

重新发布修正后的 `v0.1.0` GitHub Release 后，可通过不可变的 HTTPS Tag 压缩包固定安装：

```bash
npm install --save-dev https://github.com/LinHaobo0221/react-native-code-rules/archive/refs/tags/v0.1.0.tar.gz
```

未来发布到公共 npm registry 后，使用全小写 scoped package 安装：

```bash
npm install --save-dev @linhaobo0221/react-native-code-rules@0.1.0
```

仅安装 package 不会自动使项目规则生效。使用方必须在仓库自身的 `AGENTS.md` 或 `mobile/AGENTS.md` 中明确要求代码生成工具读取本 package：

```md
# Mobile 规约入口

rules_language: zh-CN

修改 `mobile/` 前，必须依次完整读取：

1. `node_modules/@linhaobo0221/react-native-code-rules/AGENTS.zh-CN.md`
2. `mobile/docs/agents/app-specific.md`

共通规约定义代码结构和质量下限；项目级文档定义当前 App 的设计与工程事实。
```

然后将 [templates/zh-CN/app-specific.md](templates/zh-CN/app-specific.md) 复制到使用方项目的 `mobile/docs/agents/app-specific.md`，填写项目特有内容。

## 规则优先级

1. 当前任务中用户明确提出的需求、限制和验收条件
2. 距离目标文件最近且处于生效范围内的 `AGENTS.override.md` / `AGENTS.md`
3. 当前仓库中可验证的项目事实，包括代码、配置、API contract、测试和已批准的架构文档
4. 本 package 的完整工程标准分册

核心规则是每次编码前的强制闸门，不是对完整标准的删减或放宽。执行细节以对应语言的 `AGENTS` 入口为准。

项目级规则可以确定 Token、动效和技术选型，但不应静默降低共通规约中的可维护性、可访问性和双端质量下限。确需例外时，应记录原因、范围和验收方式。

## 文档校验

```bash
npm run docs:check
npm run pack:check
```

前者检查中文分册与保留原文的一致性、三语结构和代码示例、相对链接及模板；后者预览 package 内容，不执行发布。翻译的语义等价仍需人工复核，不能仅由结构检查证明。

## License

本项目采用 [MIT License](LICENSE)。可以自由用于商业或非商业项目，也可以修改、再发布、再许可和销售；复制或发布时需要保留原版权及许可声明。

## 版本策略

- Patch：澄清文案、修正规则冲突，不改变既有代码结构要求
- Minor：增加兼容规则、可选目录或新的实现检查项
- Major：修改标准目录、职责边界、必读顺序或其他破坏性规则

每个 App 应固定规约版本，升级时通过 Pull Request 审查规则差异，不使用不受控的浮动版本。
