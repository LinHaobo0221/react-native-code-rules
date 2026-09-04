# 更新日志

**简体中文** · [日本語](CHANGELOG.ja.md) · [English](CHANGELOG.md)

## 未发布

- 以更新后的根 `AGENTS.md` 同步中文、英文、日文执行入口，保留完整执行顺序与任务阅读路由。
- 按最新 `v2.0（2026-09-04）` 源文重建三语 `00`～`12` 分册；核心六节和完整标准十三节全部保留，原文第 13 节并入 `12`。
- 修正失效路径和单文件导航指代，保留两份原文供维护对照，记录所有结构适配。
- 将项目模板同步为第 11 节要求的 22 项，更新 README；语言必须明确声明，不再沿用旧版英文 fallback。
- 增加无外部依赖的 `docs:check`，验证原文、分册、三语结构、代码示例、模板和链接；不发布或调整 package 版本。

## 0.1.0

- 将 package 身份确定为 `@linhaobo0221/react-native-code-rules`，与仓库所有者保持一致。
- 补充不可变 GitHub Tag 压缩包安装方式和未来公共 npm 包名。
- 在 npm 账号归属与发布流程得到明确确认前保留 `private: true`。
- 建立 React Native / Expo 共通规约入口与强制读取顺序。
- 定义标准 `mobile/` 目录、职责边界和路由组织原则。
- 定义组件、样式、Figma、双端交互、可访问性与交付规则。
- 定义 React 渲染、虚拟列表、图片、异步任务与 profiling 性能规则。
- 定义 unit、Hook、component、integration、竞态和原生测试策略。
- 定义数据分类、安全存储、Token Auth、网络、权限和隐私规则。
- 增加项目级 `app-specific.md` 模板。
- 增加简体中文（`zh-CN`）、日文（`ja`）和英文（`en`）三套完整规约及项目模板。
- 增加显式 `rules_language` 选择与英文 fallback，避免根据设备 locale 或代码内容猜测规约语言。
- 采用以 `LinHaobo0221` 为版权主体的 MIT License。
- 保持 package 为纯文档，不包含 UI、Token、动效或业务实现。
