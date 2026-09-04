# 3. 路由与导航规则

### 3.1 Router 入口

- `mobile/app/` 只负责路由声明、layout 和极薄桥接。
- 实际页面实现放在 `features/<feature>/pages/`。
- route 文件优先只做 re-export。
- `app/_layout.tsx` 只负责根导航、Provider 和全局系统配置。
- route 文件中不能堆积 Hook、静态数据和样式。
- 路由字符串集中维护在项目路由常量或类型安全入口中。
- `router.push`、`replace`、`pathname`、`Stack.Screen name`、`Tabs.Screen name` 和 `initialRouteName` 不能散落硬编码。
- 是否允许 `index.tsx`、route group 固定命名和路径别名形式，由项目级规约确定。

### 3.2 Route Group

Route group 用来表达稳定导航边界，例如：

- 启动流程
- 未登录流程
- 已登录流程
- Modal 流程
- 其他稳定壳层

规则：

- group 表达导航边界，不表达临时页面分类。
- 同一 flow 的页面尽量由同一个 Stack 管理。
- header、tab bar 和 modal 壳层由正确的导航层级自然决定。
- 不能用页面样式或动态卸载导航容器模拟路由层级。

### 3.3 Tabs 与 Stack

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

- Tabs 只负责一级目的地切换。
- 同一 Tab 的二级、三级页面由该 Tab 自己的 Stack 管理。
- Bottom Tab Bar 在 Tabs layout 中只定义一次。
- 不在多个页面重复绘制 Tab Bar。
- 不把详情页、编辑页、设置子页作为伪 Tab。
- 不通过 `return null`、高度设为 0、移出屏幕或条件卸载 Tabs 隐藏 Tab Bar。
- 覆盖全部 Tabs 的全屏页面挂在 Tabs 外层 Stack。
- 属于某个 Tab 的子流程留在该 Tab 的 Stack 中。

### 3.4 导航语义

- 前进到详情、编辑或下一步：使用项目约定的 push 语义。
- 返回：优先使用原生 back 语义，保留返回手势。
- 只有真正替换历史的流程节点才使用 replace。
- Tab 切换保持 Tab 语义，不能伪装成 Stack push。
- 关闭整个 Modal flow 与返回 Modal 内上一层是两个不同动作，不能使用错误的语义混淆。
- 具体转场动画、手势开关和 duration 由项目级动效规则决定，同类导航必须保持一致。

### 3.5 页面分类

新增页面前必须先确定它属于：

1. 某个 Tab 的根页面
2. 某个 Tab 内的子流程
3. 跨 Tab 的全屏页面
4. 路由级 Modal flow
5. 页面内部的 Sheet / Dialog

分类决定页面所在 Stack、Tab Bar 是否出现、关闭语义和返回行为。

### 3.6 Modal 分类

适合路由级 Modal 的情况：

- 内部存在多 step 导航
- 需要独立历史和系统返回
- 需要覆盖当前 Tabs
- 关闭动作表示退出整个流程

适合页面内 Modal / Sheet 的情况：

- 短选项列表
- 单次确认
- 日期或筛选选择器
- 不需要独立路由历史的轻量交互

### 3.7 导航验收

交付前检查：

- 页面从正确入口可达。
- 返回目标正确。
- replace 不留下错误历史。
- Tab Bar 在转场中不跳动、不延迟、不重复绘制。
- Modal 关闭语义正确。
- iOS 返回手势和 Android 系统返回可用。
- safe area 和 StatusBar 不因导航层级切换产生闪烁或遮挡。

---
