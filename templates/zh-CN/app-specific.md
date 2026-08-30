# App 专属移动端规约

> 将本模板复制到使用方项目的 `mobile/docs/agents/app-specific.md`。删除示例提示并填写当前 App 的真实配置。未确定的内容写明“未确定”，不要用另一个 App 的配置代替。

## 1. 项目身份

- 规约语言：`zh-CN`
- App 名称：
- mobile workspace 路径：`mobile/`
- package 名称：
- Expo SDK：
- React Native：
- React：
- package manager：
- 原生 workflow：managed / prebuild / bare

## 2. 必读文档

列出生成 mobile 代码前还必须读取的项目文档：

- 架构文档：
- API contract：
- 数据与存储策略：
- 键盘布局指南：
- 测试规范：
- 发布规范：

## 3. 目录与路径别名

- 是否完整采用共通 `mobile/` 标准结构：
- 项目批准的额外目录：
- 路径别名：
- route 文件是否允许 `index.tsx`：
- 页面 export 约定：

如有偏离，说明原因和适用范围。

## 4. 路由与导航

- Expo Router route groups：
- Root Stack：
- Tabs：
- 各 tab 对应 Stack：
- 跨 tab 全屏页面：
- 路由级 Modal：
- route 常量文件：
- 默认 push / replace / modal 动画：
- 手势与系统返回要求：

## 5. Design Token

- Token 代码事实源：
- Figma Variables / Library：
- 颜色：
- spacing：
- radius：
- shadow / elevation：
- typography：
- z-index / layer：
- light / dark / brand mode：

这里记录来源和命名体系，不复制全部 Token 数值。

## 6. 字体与语言

- 支持语言：
- 已加载字体：
- 各语言默认字体：
- 英文 / 数字展示字体：
- 字重映射：
- fallback 策略：
- 动态字体与最大缩放策略：

## 7. 动效

- motion token 事实源：
- navigation transition：
- Modal / Sheet：
- press feedback：
- loading / skeleton：
- reduce motion：
- 禁止使用的实现：

## 8. Styling 与基础组件

- 默认 styling system：
- 全局 theme 入口：
- 已有通用 Button：
- 已有通用 Input：
- 已有 Switch / Checkbox / Radio：
- 已有 Image / Avatar：
- 已有 Modal / Sheet：
- 已有 keyboard-aware 组件：
- 已有 loading / empty / error 组件：

业务页面必须优先复用上述入口，不创建平行版本。

## 9. 图片、SVG 与图标

- 资源目录：
- SVG 接入方式：
- 允许的 icon 来源：
- 多倍率位图规则：
- placeholder / fallback：
- 文件命名规则补充：

## 10. 数据、API 与状态

- API client：
- response envelope：
- query / mutation Hook 约定：
- Auth 策略：
- token 保存：
- key-value 存储：
- 结构化离线数据：
- 文件缓存：
- scoped event / state 方案：
- 禁止使用的状态或存储方案：

任何尚未批准的数据方案都应在实施前单独确认。

## 11. 平台配置

- iOS 最低版本：
- Android 最低版本 / API level：
- edge-to-edge：
- StatusBar / system navigation：
- safe area 基础壳层：
- 权限处理：
- 平台已知差异与 fallback：

## 12. 性能与渲染

- 目标设备与最低设备档位：
- 关键性能路径：
- release profiling 构建方式：
- profiling 工具：
- 启动、帧率、内存或交互预算：
- 大列表典型与最大数据量：
- 虚拟列表实现：
- 图片加载、缓存和缩略图策略：
- Cache owner、容量和清理策略：
- 已知性能风险与验收场景：

## 13. 测试策略

- test runner：
- unit / Hook test：
- component test：
- integration test：
- E2E 工具：
- native module mock：
- 全局 setup / cleanup：
- 测试文件 include 规则：
- 测试 ID 命名：
- coverage 策略：
- flaky test 处理：
- iOS / Android 验收矩阵：
- CI required checks：

## 14. 安全与隐私

- 数据分类与敏感字段清单：
- Auth / session contract：
- protected storage：
- 普通 KV / database / file cache：
- API base URL 与允许的 origin：
- 开发 HTTP 例外：
- deep link / universal link allowlist：
- WebView 策略：
- 权限清单与申请时机：
- logging / analytics / crash redaction：
- 第三方 SDK 数据范围与 consent：
- logout / account switch / deletion 清理：
- backup / device migration / biometric：
- OWASP MASVS 适用范围或其他安全基线：

## 15. 依赖约束

- 允许的 UI / animation / gesture package：
- 允许的 native module：
- 新依赖审批方式：
- workspace dependency 规则：
- Expo config plugin 规则：

## 16. Figma 工作流

- Figma team / project：
- Design Library：
- 页面文件：
- Dev Mode / Code Connect：
- 资源导出权限与目录：
- Token 对齐负责人或流程：
- 视觉验收设备：

## 17. 检查与交付命令

```bash
# format

# lint

# typecheck

# test

# iOS

# Android
```

- 最低交付检查：
- CI required checks：
- 存量问题记录位置：

## 18. 项目专属禁止事项

- （填写项目专属禁止事项）

## 19. 已批准例外

对每个例外记录：

- 共通规则：
- 例外原因：
- 影响范围：
- 替代措施：
- 验收方式：
- 到期或复查条件：
