# 2. 标准 `mobile/` 目录结构

标准结构如下：

```text
mobile/
├── app/
├── features/
│   └── <feature>/
│       ├── pages/
│       ├── ui/
│       ├── hooks/
│       ├── model/
│       ├── use-cases/
│       ├── events/
│       ├── data/
│       ├── constants/
│       ├── api/
│       ├── context/
│       ├── types/
│       └── utils/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── events/
│   ├── api/
│   ├── auth/
│   ├── constants/
│   ├── types/
│   └── utils/
├── assets/
├── types/
├── plugins/
├── test/
├── docs/
│   └── agents/
├── app.json
├── metro.config.js
├── tsconfig.json
└── package.json
```

目录按需创建，不为了结构完整而提交空目录。`model`、`use-cases`、`api`、`auth`、`context`、`events`、`plugins` 等只有项目真正需要时才出现。简单页面不需要为了满足目录结构强行创建 Controller、Reducer、Use Case 或 Repository。

### 2.1 顶层目录职责

| 目录 | 规则 |
| --- | --- |
| `app/` | 只放 Expo Router 路由入口、route group 的 `_layout` 和极薄桥接；不放完整页面 JSX、业务状态、静态业务数据或大段样式。 |
| `features/` | 按稳定产品功能或用户流程划分；feature 名表达业务领域，不能只表达页面视觉位置。 |
| `shared/` | 只放已跨 feature 稳定复用，或被项目明确认定为基础设施/设计系统的能力；不能成为无归属代码的暂存区。 |
| `assets/` | 放本地图片、SVG、字体和其他静态资源；文件名必须语义明确。 |
| `types/` | 放全 App 生效的环境声明、资源 module declaration 和真正跨层的公共类型。 |
| `plugins/` | 放 Expo config plugin 或构建期扩展；不放运行时业务逻辑。 |
| `test/` | 放跨 feature 测试工具、fixture builder 和测试环境辅助。 |
| `docs/agents/` | 放项目级规则文档、组件目录和已批准的架构例外。 |

### 2.2 Feature 子目录职责

| 目录 | 应该放什么 | 限制 |
| --- | --- | --- |
| `pages/` | 页面级组件，组合 section、调用页面 Controller Hook、传递状态和动作。 | 默认使用 `PascalCase` 文件名；不能长期承载复杂状态机、大量 handler、底层视觉细节或大量硬编码数据。 |
| `ui/` | 当前 feature 的展示组件和结构区块，例如卡片、列表项、表单 section、复杂装饰和 SVG group。 | 可以表达 feature 语义，但不能直接请求 API、读写 Auth/存储或做路由决策。 |
| `hooks/` | React 绑定、局部 UI 状态、页面/flow Controller、生命周期和副作用接入。 | 不重复实现底层 client，不把可独立测试的业务规则埋在 React Hook 中，不制造 handler 转发链。 |
| `model/` | 纯状态模型、Reducer、selector、validation、状态转换和业务 invariant。 | 不 import React、Expo Router、API client 或可变全局状态；Reducer 和 selector 必须保持纯函数。 |
| `use-cases/` | 以用户意图命名的多步骤业务操作，例如提交资料、发布帖子、切换账号。 | 默认是无 React 依赖的 TypeScript 函数；不操作 UI、Toast 或导航；单纯转发一次 API 调用时不要创建。 |
| `events/` | typed event name、payload 和 Provider-scoped 入口。 | 只用于轻量通知，不能作为业务事实源、持久缓存或替代直接调用链。 |
| `data/` | 静态展示数据、本地原型数据、选项配置和最小离线 fallback。 | 不放请求、副作用或长期业务事实。 |
| `constants/` | feature 私有且稳定的常量、枚举映射和设计语义常量。 | 具体 Token 值优先来自项目 Token，不在 feature 中复制。 |
| `api/` | feature 专属 endpoint adapter、DTO 转换、runtime validation 和语义 API 方法。 | 通用 request、Auth refresh、错误 envelope 等基础能力放 `shared`；不能包含页面状态和导航。 |
| `context/` | 当前 feature 或明确路由范围内的 Provider。 | 不作为无边界全局 store，不承载频繁变化的大对象。 |
| `types/` | feature 专属 UI model、Use Case 输入/结果、事件 payload 和领域类型。 | 后端 contract 通过批准的公开 package 暴露，不能直接引用后端内部文件。 |
| `utils/` | feature 专属纯函数。 | 不访问 React Hook、路由、API 或可变全局状态。 |

### 2.3 Shared 子目录职责

- `shared/ui`：项目级 UI primitive 和稳定、无业务偏向的 UI pattern。可以在文档中区分 `primitive` 与 `pattern`，但不强制创建额外目录。
- `shared/hooks`：不包含具体业务名称的通用 React 行为，例如受控 disclosure、稳定 keyboard adapter；业务流程 Hook 不进入这里。
- `shared/events`：无业务语义的 typed event 基础设施。
- `shared/api`：request client、错误处理和跨 feature transport 基础设施。
- `shared/auth`：统一 Auth 能力；页面不能直接操作 token。
- `shared/constants`：跨 feature 稳定常量和项目级 Token 入口。
- `shared/types`：真正跨 feature 的类型。
- `shared/utils`：无副作用纯工具。

`shared` 中的每个公开模块都应有清楚的用途、消费者和 API 边界。仅因“以后可能会用”或“两个页面看起来相似”不能进入 `shared`。

### 2.4 依赖方向

```text
app
└── feature pages
    ├── feature ui ───────────────> shared/ui
    └── feature hooks/controllers
        ├── feature use-cases ────> feature model / feature api / shared
        ├── feature model ────────> feature types / pure shared utilities
        └── feature api ──────────> shared/api
```

必须遵守：

- `shared` 不得 import `features`。
- UI 组件不直接依赖路由、API client、Auth、存储、Use Case 或业务 store。
- Page 负责组合 UI 与 Controller，不直接散落多步骤 API 编排。
- Controller Hook 可以访问 React 生命周期和导航；Use Case、Model 不得访问 React、React Native UI 或 Expo Router。
- `model`、`data`、`constants`、`types` 和纯 `utils` 不反向依赖页面、UI、Controller 或 API。
- `api` 不能依赖 Page/UI；DTO 到领域/UI model 的转换放在明确边界，不在多个页面复制。
- feature 不得 import 另一个 feature 的页面、私有 Hook、私有 UI 或私有数据。确需跨 feature 使用时，通过经批准的公开入口，或将无业务偏向的能力提升到 `shared`。
- 跨 workspace 共享代码必须通过公开 package `exports`，不能直接 import 内部路径。
- 不能通过 EventBus、Context 或 module singleton 绕过清楚的依赖方向。
- 不能把 `shared` 当成规避架构判断的杂物目录。

### 2.5 文件命名

- 组件和页面：`PascalCase.tsx`
- 页面 Controller Hook：`useSomethingController.ts`
- 局部行为 Hook：`useSomething.ts`
- Use Case：`verbNoun.ts`，例如 `submitProfile.ts`、`publishPost.ts`
- Reducer / State Model：`somethingReducer.ts`、`somethingModel.ts`
- 纯工具：`camelCase.ts`
- 测试：`name.test.ts` 或 `name.test.tsx`
- 类型：使用语义文件名，避免笼统的 `types.ts` 无限增长。
- 常量：使用语义文件名，避免笼统的 `constants.ts` 无限增长。
- route 文件：遵守 Expo Router 以及项目既有的小写路径规则。

避免使用无法说明责任的 `helpers.ts`、`manager.ts`、`common.ts`、`service.ts`。确有 Service、Manager 或 Facade 语义时，名称必须体现其管理对象或边界，例如 `AuthSessionCoordinator`，并在项目规约中说明职责。

每个文件应有一个主要职责。是否拆分根据阅读路径、变化原因和测试边界决定，不能只按代码行数机械拆分，也不能为了“分层”制造只做转发的文件。

### 2.6 新文件放置判断顺序

1. 只是 Expo Router 入口：放 `app/`。
2. 只服务一个 feature：放该 feature 最具体的目录。
3. 是 React 生命周期或页面动作入口：放 `hooks/`，复杂时命名为 Controller。
4. 是无 React 的多步骤用户意图：在满足复杂度触发条件时放 `use-cases/`。
5. 是纯状态转换、规则或 selector：放 `model/` 或 `utils/`。
6. 已被多个 feature 稳定复用，或被项目明确认定为基础 primitive，且不带业务语义：考虑放 `shared/`。
7. 属于资源、声明、构建插件或测试基础设施：放对应顶层目录。
8. 仍无法判断：采用最小 feature 边界并记录假设，不新增自定义顶层目录。

未经项目明确批准，不改变 `mobile/` 顶层结构，不建立平行架构体系。

---
