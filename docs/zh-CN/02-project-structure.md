# 02 项目与目录结构

> 本文件定义 `mobile/` 标准目录、职责边界、依赖方向和文件放置规则。

## 标准目录

React Native / Expo App 默认采用以下结构：

```text
mobile/
├── app/
├── features/
│   └── <feature>/
│       ├── pages/
│       ├── ui/
│       ├── hooks/
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

目录按需创建，不为“结构看起来完整”而提交空目录。`api`、`auth`、`context`、`events`、`plugins` 等只有在项目确实需要时才出现。

## 顶层职责

### `app/`

- 只放 Expo Router 路由入口、route group `_layout` 和极薄路由桥接。
- 不放完整页面 JSX、业务状态、静态业务数据或大段样式。
- route 文件优先 re-export `features/<feature>/pages` 中的页面。

### `features/`

- 按稳定产品功能或用户流程划分。
- feature 名应表达业务领域，而不是页面视觉位置。
- 一个 feature 内聚合自己的页面、私有组件、Hook、数据与事件。
- feature 之间禁止直接读取对方页面或内部状态。

### `shared/`

- 只放已跨 feature 稳定复用、且不带单一业务页面语义的能力。
- shared 不能依赖 `features/*`。
- 不因“以后可能复用”而提前把功能私有实现放入 shared。

### `assets/`

- 放本地图片、SVG、字体和其他静态资源。
- 资源分类方式由项目级规则确定，但文件名必须语义明确。

### `types/`

- 放全 App 生效的环境声明、资源 module declaration 和真正跨层公共类型。
- feature 专属类型仍放在对应 feature 内。

### `plugins/`

- 放 Expo config plugin 或构建期扩展。
- 不放运行时业务逻辑。

### `test/`

- 放跨 feature 测试工具、fixture builder 和测试环境辅助。
- 页面或模块单元测试优先与被测文件相邻。

## Feature 子目录职责

### `pages/`

- 页面级组件，默认使用 `PascalCase` 文件名。
- 页面负责组合 section / UI 组件和传递 Hook 结果。
- 页面不得长期承载复杂状态机、大量 handler 或底层视觉细节。
- 供 Expo Router re-export 的页面应使用项目约定的稳定 export 方式；若项目未另行规定，默认 `default export`。

### `ui/`

- 只服务当前 feature 的展示组件和结构区块。
- 可以表达 feature 语义，但不直接进行 API 请求或路由决策。
- 复杂装饰、SVG group、表单 section、卡片和列表项应放在这里。

### `hooks/`

- 放当前 feature 的本地状态、派生状态、handler、副作用和流程编排。
- API mutation/query 的 UI 状态包装也可放在这里，但底层 client 不应重复实现。

### `events/`

- 放当前 feature 的 typed event name、payload 和 Provider-scoped 入口。
- 事件只用于轻量通知，不作为业务事实源或持久缓存。

### `data/`

- 放静态展示数据、本地原型数据、选项配置和离线 fallback 的最小数据。
- 不放请求、副作用或长期业务事实。

### `constants/`

- 放 feature 私有且稳定的常量、枚举映射和设计语义常量。
- 具体 Token 值应优先来自项目 Design Token，不在 feature 中复制。

### `api/`

- 放 feature 专属 endpoint adapter、DTO 转换或语义 API 方法。
- 通用 request、Auth refresh、错误 envelope 等基础能力应放 shared。

### `context/`

- 只放当前 feature 或明确路由范围内的 Provider。
- Context 不应被用作无边界全局 store，也不应承载频繁变化的大对象而导致整棵树重渲染。

### `types/`

- 放 feature 专属 UI model、事件 payload 和领域类型。
- 与后端共享的 contract 必须通过项目批准的跨 workspace package 暴露，不直接跨目录引用后端内部文件。

### `utils/`

- 放 feature 专属纯函数。
- 不访问 React Hook、路由或可变全局状态。

## Shared 子目录职责

- `shared/ui`：跨 feature 的基础 UI 模式。
- `shared/hooks`：跨 feature 的通用 Hook，不包含具体业务名称。
- `shared/events`：无业务语义的 typed event bus 基础实现。
- `shared/api`：request client、错误处理、跨 feature transport 基础设施。
- `shared/auth`：只有项目存在统一 Auth 时才使用；页面不能直接操作 token。
- `shared/constants`：跨 feature 稳定常量和项目级 Design Token 入口。
- `shared/types`：真正跨 feature 的类型。
- `shared/utils`：无副作用纯工具。

## 依赖方向

默认依赖方向为：

```text
app -> feature pages -> feature ui/hooks -> shared
```

必须遵守：

- `shared` 不得 import `features`。
- feature 不得 import 另一个 feature 的页面、私有 Hook 或私有数据。
- `data`、`constants`、`types` 和纯 `utils` 不反向依赖页面或 UI。
- UI 组件不直接依赖路由、API client、Auth 或业务 store。
- 跨 workspace 共享代码必须通过对方 package 的公开 `exports`，不得直接 import 内部路径。

若两个 feature 需要共享某项能力，先判断它是否已具备稳定、无业务偏向的抽象，再移动到 shared。不要用 shared 作为规避架构判断的杂物目录。

## 命名与文件规则

- 组件与页面：`PascalCase.tsx`
- 组件样式：`ComponentName.styles.ts`
- Hook：`useSomething.ts`
- 纯工具：`camelCase.ts`
- 测试：`name.test.ts` 或 `name.test.tsx`
- 类型：使用语义文件名，避免笼统的 `types.ts` 无限增长
- 常量：使用语义文件名，避免笼统的 `constants.ts` 无限增长
- route 文件遵守 Expo Router 和项目现有的小写路径命名习惯

每个文件应有一个主要职责。一个文件是否需要拆分，以阅读路径、变更原因和测试边界判断，不以机械行数作为唯一标准。

## 文件放置判断顺序

新增代码前按以下顺序判断：

1. 它是否只是 Expo Router 入口？是则放 `app/`。
2. 它是否只服务一个 feature？是则放该 feature 最具体的子目录。
3. 它是否已被多个 feature 稳定复用且不带业务语义？是则考虑 shared。
4. 它是否属于资源、声明、构建插件或测试基础设施？放对应顶层目录。
5. 如果仍无法判断，不新增自定义顶层目录；先采用最小 feature 边界并记录假设。

未经项目明确批准，不改变 `mobile/` 顶层结构或新增平行架构体系。
