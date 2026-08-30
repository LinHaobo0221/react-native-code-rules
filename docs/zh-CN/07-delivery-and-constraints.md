# 07 交付与约束

> 本文件定义依赖、变更范围、检查、测试、原生验收和最终交付要求。

## 依赖约束

- 未经明确批准，不新增第三方依赖。
- 需要新增依赖时，先提交选型说明，再执行安装。
- 每个 workspace 只能 import 自己 `package.json` 中声明的 package。
- 不能因为根目录或其他 workspace 的 `node_modules` 中存在某个 package，就直接依赖 hoist 结果。
- React、React Native、Expo 和原生模块必须避免重复或冲突版本。
- UI package、config plugin 和 native module 应遵守项目当前 Expo workflow，不擅自切换 managed / prebuild / bare 策略。

依赖选型至少说明：

- 当前 Expo / React Native 兼容性
- iOS / Android 支持
- 是否包含原生代码或 config plugin
- 性能和包体积影响
- 维护活跃度与升级风险
- 现有依赖或原生实现能否满足
- 安装、配置、EAS 和回滚成本

未经批准，只能给出建议，不能实际安装。

## 项目边界

- `mobile/` 是移动端事实范围，不能直接 import backend 的 Node-only 内部文件。
- 跨 workspace 共享必须通过公开 package exports。
- 不为单个页面修改 monorepo workspace 边界。
- 不擅自调整 build、EAS、native project 或 signing 配置。
- 不提交 `.expo`、build output、临时导出资源和本地凭据。
- 不把 token、密码、密钥、个人信息或环境变量值写入代码、日志和文档。

## 修改范围

- 保留仓库中与任务无关的既有修改。
- 不执行破坏性 git 操作清理他人工作。
- 不因局部需求大规模格式化无关文件。
- 若同一根因影响同 flow 多个页面，可在明确边界内同步修复，并在交付时列出范围。
- 如果完成任务需要改变 API、数据结构、依赖或项目架构，应在实施前获得确认。

## 代码生成流程

### 1. 读取与分析

- 读取共通规约、项目级规约和相关现有代码。
- 检查 package、路径别名、测试与构建配置。
- Figma 任务执行完整节点读取流程。
- 确认工作区已有改动，避免覆盖。

### 2. 目录映射

开始修改前明确：

- 创建和修改的文件
- 每个文件的职责
- feature / shared / route 的放置原因
- 计划复用的组件、Hook、Token 与资源
- 不确定项和假设

### 3. 实现

- 使用最小必要变更完成需求。
- 遵守现有格式、类型、测试和注释风格。
- 不引入未批准依赖和业务扩展。
- 资源在同一任务中完成语义化命名与引用。

### 4. 验证

根据风险执行项目已有命令：

- formatter / format check
- lint
- TypeScript typecheck
- unit / integration tests
- Expo config 或 bundle 检查
- iOS / Android 原生运行检查

具体命令必须记录在项目级规约，不能假设所有项目使用同一工具。

若仓库存在存量失败，必须区分：

- 本次变更新增的问题
- 与本次无关的既有问题

不能用“项目本来有错误”掩盖本次新增回归。

## 测试要求

测试强度与变更风险匹配：

- 纯样式调整：lint、typecheck 和目标页面原生视觉检查
- 交互组件：状态、回调、disabled、accessibility 和平台分支测试
- Hook：派生状态、竞态、cleanup、成功与失败分支
- 导航：入口、返回、replace、modal 关闭与系统返回
- API：request contract、loading、错误、Auth 失效和并发行为
- 共通组件修改：检查所有直接使用方

不能只验证 happy path。修复 bug 时优先增加能覆盖根因的回归测试。

## Figma 交付要求

Figma 页面任务完成后必须说明：

- 已完成的节点和状态
- 复用或新增的组件
- 新增的本地资源
- 与 Figma 的偏差及原因
- iOS / Android 验证情况
- 是否检查同 flow 的兄弟页面

若未能访问正式 Figma 节点，只能以截图或描述降级实现，并明确标记尚待正式对齐。

## 完成定义

任务只有在以下条件满足时才算完成：

- 文件位于正确目录
- route 与导航层级正确
- 组件职责和状态归属清楚
- 没有新增未批准依赖
- 没有散落新的重复 Token 或业务事实源
- 关键交互真实可用
- iOS / Android 风险已处理或明确说明
- 可访问性和测试入口已覆盖关键控件
- 相关检查通过，或存量失败已隔离说明
- 最终回复列出关键文件、验证结果和剩余偏差

## 禁止事项

禁止：

- 跳过项目规约直接生成代码
- 在 `app/` 路由入口堆完整页面实现
- 为隐藏 tab bar 使用样式或动态卸载 hack
- 把页面业务逻辑塞入 shared UI
- 复制另一个 App 的 Token、字体或动效作为默认值
- 使用在线近似 icon 代替 Figma 正式资产
- 手绘设备系统 UI
- 用 Web 截图作为原生最终验收
- 只处理一个平台却不说明范围
- 通过新增依赖回避可以用当前项目能力解决的问题
- 创建未经确认的真实 API、存储、权限、埋点或业务流程
- 在复杂度明显上升时拒绝合理拆分
