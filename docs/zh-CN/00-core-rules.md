# React Native / Expo Codex 执行规则

> 本文件是核心执行闸门，由仓库根目录 `AGENTS.md` 强制引用，必须在每次生成、修改、重构或审查 React Native / Expo 代码前完整读取。完整解释、平台、Figma、性能、测试和安全要求见同目录的[工程标准索引](README.md)。

## 1. 六条硬规则

1. **先查再建**：新增组件、Hook、工具或流程前，搜索当前 feature、`shared`、Token、公共出口和相同用户意图的实现。
2. **同因才抽**：语义、状态合同和未来变化原因一致才共通；视觉相似不是充分条件。
3. **最低稳定层复用**：依次考虑 Token、primitive、纯函数、Headless Hook、feature pattern、shared pattern；不要直接制造万能组件。
4. **Feature First**：不稳定抽象留在 feature；跨 feature、无业务偏向且合同稳定后再进入 `shared`。
5. **一条动作一处编排**：一个主要用户动作只有一个权威编排点，关键步骤在该处按顺序可读。
6. **禁止空转转发**：不增加转换、校验、invariant、分支、错误映射、并发控制、副作用边界或可替换性的包装函数必须删除。

## 2. 开始编码前必须输出

```text
目标文件：
- path：职责

复用审查：
- 候选组件 / Hook / Token：
- 决定：直接复用 / 扩展 / 抽取低层能力 / 保持独立
- 原因：语义、状态合同、变化原因

主要动作路径：
UI callback
-> Controller action 或直接 handler
-> 可选 Use Case
-> API / storage / cache adapter
-> typed result
-> UI state / navigation / feedback

模式选择：
- 使用了什么模式、解决什么真实复杂度
- 明确说明没有必要引入的模式
```

没有找到复用候选时，写明“已搜索，未发现语义匹配实现”。

## 3. UI 共通化判断

### 3.1 重复类型与正确落点

| 重复内容 | 首选抽象 |
| --- | --- |
| 颜色、间距、圆角、字体、动效 | Token |
| 相同 UI 结构与相同交互语义 | feature UI；稳定后 shared UI |
| 相同行为、不同 UI | Headless Hook / 纯状态模型 |
| 相同 validation、转换、selector | `model/` 或纯 `utils/` |
| 相同多步骤业务操作 | `use-cases/` |
| 平台、第三方 SDK、DTO 差异 | Adapter |
| 仅当前外观相似 | 保持独立，复用低层 primitive |

核心问题：

> 需求变化时，这几处是否应该因为同一个原因一起修改？

### 3.2 Shared UI 必须同时满足

- 能用中立名称表达，不依赖 feature 名。
- 消费者的状态、交互、可访问性和平台合同一致。
- 预计同因变化。
- 不 import route、API、Auth、存储、Use Case 或 feature store。
- Props 不包含页面名、route、feature 枚举和消费者专属布尔值。
- 不依赖大量内部 style override 或 `mode="custom"` 才能复用。

### 3.3 抽象时机

- 第一次：清楚的 feature-local 实现。
- 第二次：评估语义和变化原因，可只抽低层能力。
- 第三次稳定使用：通常抽取并迁移旧实现。
- 项目设计系统 primitive、安全 invariant 可以更早抽取。

### 3.4 组件 API

- 封闭视觉差异：`variant`、`size`、`tone`。
- 真实结构差异：composition、children、slot。
- 状态由业务层控制：controlled props + `onXxx`。
- 不用大量 boolean、巨大 config、route 判断或无界 style escape hatch。
- 共通化后更新全部消费者并删除旧重复版本。

## 4. 逻辑和控制流

推荐路径：

```text
Page
├── View / feature UI -> shared UI
└── Controller Hook
    ├── optional Use Case
    ├── Reducer / Model
    └── API / Adapter
```

### 4.1 简单流程

少量局部状态、一次同步动作或无业务规则的一次 API 调用，可以使用直接 handler。不要为形式创建 Use Case、Repository、Factory 或 class。

### 4.2 复杂流程

当一个用户动作包含 validation、多个副作用、缓存一致性、提交锁、取消、重试、幂等或多个入口时，使用：

- Controller：React 生命周期、UI state、action 入口、导航和反馈。
- Use Case：无 React 的业务步骤、顺序和 typed result。
- Reducer / 状态机：互斥状态、非法组合和显式 transition。
- Adapter：平台、原生模块、第三方 SDK、DTO 差异。
- Strategy：同一算法存在多个真实实现。
- Repository：多个数据源、cache/offline 策略需要统一。

### 4.3 禁止的调用链

禁止：

```ts
const handleSave = () => submit();
const submit = () => executeSave();
const executeSave = () => service.save(form);
```

一个函数只有在至少增加以下一种价值时才保留：

- 输入或输出转换
- validation / invariant
- 分支和顺序决策
- 错误映射
- 副作用边界
- cancellation / lock / idempotency
- 可替换实现
- 必要 instrumentation

Controller action 直接进入权威编排点。不要用 EventBus、Context 或 module singleton 隐藏同一页面内可以直接表达的流程。

### 4.4 Use Case 限制

- 以用户意图命名：`publishPost`、`updateProfile`。
- 不 import React、React Native UI、Expo Router、Toast 或页面组件。
- 返回 discriminated union / typed result。
- 不为一行 API 调用创建空 Use Case。
- 不为每个函数创建无意义 interface 或 class。

### 4.5 Reducer 限制

- Reducer 只做纯状态转换。
- 请求、导航、存储和 Toast 由 Controller / Use Case 执行。
- 用 discriminated union 防止非法 boolean 组合。
- 不强制引入状态机第三方库。

## 5. 目录与依赖

```text
app -> feature pages
feature pages -> feature ui -> shared/ui
feature pages -> hooks/controllers
hooks/controllers -> use-cases / model / api / shared
use-cases -> model / api / shared
api -> shared/api
```

- `shared` 不 import `features`。
- UI 不 import route、API、Auth、存储、Use Case。
- Model 不 import React、Router、API。
- Use Case 不 import UI、Router、Toast。
- API 不 import Page/UI。
- 不使用无界 `export *` 暴露 feature 内部实现。
- 不创建无职责的 `helpers.ts`、`common.ts`、`manager.ts`、`service.ts`。

## 6. 完成前必须检查

- [ ] 已搜索已有组件、Hook、Token、规则和流程。
- [ ] 共通化依据是同语义、同状态合同、同变化原因。
- [ ] 抽象位于最低稳定层，没有万能组件。
- [ ] Shared props 没有消费者专属特判。
- [ ] 被替代重复实现已删除，直接消费者已检查。
- [ ] 每个主要动作只有一个权威编排点。
- [ ] 不存在 `handle -> do -> execute -> service` 空转链。
- [ ] Use Case、Reducer、Strategy、Adapter、Repository 均有真实触发原因。
- [ ] Use Case 无 UI/Router；Reducer 无副作用。
- [ ] 相关 Shared UI、Controller、Use Case、Reducer 已按风险测试。
- [ ] 最终说明复用决策、动作路径、模式理由、验证结果和剩余偏差。
