# 03 路由与导航

> 本文件定义 Expo Router 的通用组织原则。具体 route group、path、tab 名称和转场参数由项目级规约提供。

## 基本规则

- `mobile/app/` 只负责路由声明、layout 和极薄桥接。
- 实际页面实现放在 `features/<feature>/pages/`。
- route 文件优先只做 re-export，不在其中堆积 Hook、静态数据和样式。
- `app/_layout.tsx` 只负责根导航、Provider 和全局系统配置，不放页面业务内容。
- 路由字符串必须集中维护在项目路由常量或类型安全入口中。
- `router.push`、`replace`、`pathname`、`Stack.Screen name`、`Tabs.Screen name` 和 `initialRouteName` 不得散落硬编码字符串。

是否允许 `index.tsx`、route group 的固定命名，以及路径别名形式，必须在项目级规约明确。若项目已形成一致约定，新增页面必须沿用，不能建立第二套路径习惯。

## Route group

项目应根据启动、未登录、已登录、Modal 或其他稳定壳层划分 route group。共通规则只要求：

- group 表达导航边界，不表达临时页面分类。
- 同一 flow 的页面尽量由同一 Stack 管理。
- 页面是否显示 tab bar、header 或 modal 壳层，应由正确的导航层级自然决定。
- 不通过页面样式或动态卸载导航容器模拟路由层级。

具体 group 名称必须记录在 `app-specific.md`。

## Tabs 与 Stack

Tabs 只负责一级目的地切换。同一个 tab 内的二级、三级页面必须由该 tab 自己的 Stack 管理。

标准关系：

```text
Root Stack
└── App Route Group
    └── Tabs
        ├── Tab A Stack
        │   ├── Main
        │   └── Detail / Edit / Filter
        └── Tab B Stack
            └── Main
```

必须遵守：

- Bottom Tab Bar 在 Tabs layout 中定义一次。
- 不在多个页面重复绘制 tab bar。
- 不把详情页、编辑页、设置子页作为伪 tab。
- 不为隐藏 tab bar 而动态返回 `null`、将高度设为 0、移出屏幕或条件卸载 Tabs。
- 需要覆盖全部 tabs 的全屏页面应挂到 Tabs 外层 Stack。
- 属于某个 tab 的子流程应保留在该 tab 的 Stack 中。

## 导航语义

- 前进到详情、编辑或下一步使用项目约定的 push 语义。
- 返回优先使用导航栈原生 back 语义，保留返回手势。
- 只有确实替换历史的流程节点才使用 replace。
- Tab 切换保持 tab 语义，不伪装成 Stack push。
- 关闭整个 modal flow 与返回 modal 内上一步是两个不同动作，不能共用错误语义。

具体转场动画、手势开关和 duration 由项目级动效规则决定。共通规约只要求同类导航保持一致，并尊重 iOS / Android 原生行为。

## 页面分类

新增页面前必须确定它属于：

1. 某个 tab 的根页面
2. 某个 tab 内的子流程
3. 跨 tab 的全屏页面
4. 路由级 modal flow
5. 页面内部的 sheet / dialog，而非独立 route

分类决定页面所在 Stack、tab bar 是否自然可见、关闭语义和返回行为。不能先把页面随意放入 `app/` 根层，再通过样式弥补导航错误。

## 路由级 Modal 与页面内弹层

以下情况通常适合路由级 modal：

- 内部存在多 step 导航
- 需要独立历史和系统返回行为
- 需要覆盖当前 Tabs
- 关闭动作表示退出整个流程

以下情况通常适合页面内 Modal / Sheet：

- 短选项列表
- 单次确认
- 日期或筛选选择器
- 不需要独立路由历史的轻量交互

具体实现方式和动画必须复用项目现有稳定模式，不在每个页面创造新弹层结构。

## 路由常量

项目应集中维护：

- path
- route name
- route group name
- 常用 pathname 参数类型

路由常量必须保持业务语义清楚，避免同一路径在多个文件重复。路径参数应采用稳定 ID，不以展示文案或数组索引代替。

## 导航层验证

交付前至少检查：

- 页面从正确入口可达
- 返回目标正确
- replace 不留下不应返回的历史
- tab bar 在转场中不跳动、不延迟、不被重复绘制
- modal 关闭语义正确
- iOS 返回手势和 Android 系统返回行为可用
- safe area 和 StatusBar 不因导航层级切换产生闪烁或遮挡
