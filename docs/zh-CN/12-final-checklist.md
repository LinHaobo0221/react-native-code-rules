# 12. 最终检查清单

### 目录和架构

- [ ] 页面实现位于正确 feature 的 `pages/`。
- [ ] Router 文件只做入口、layout 或 re-export。
- [ ] UI、Controller Hook、Use Case、Model、API、data、types 和 utils 职责清楚。
- [ ] 简单场景没有被强行增加 Controller、Use Case、Repository 或 class。
- [ ] `shared` 确实稳定复用或属于明确的 design-system primitive，且没有业务语义。
- [ ] 依赖方向没有反向引用、EventBus 绕路或隐式全局耦合。
- [ ] 文件命名、公开入口和样式组织符合规则。

### 复用和共通化

- [ ] 新增组件、Hook、工具和流程前已搜索现有实现。
- [ ] 已记录复用候选以及直接复用、扩展、低层抽取或保持独立的理由。
- [ ] 共通依据是相同语义、状态合同和变化原因，不只是视觉相似或复制次数。
- [ ] 抽象位于最低稳定层，优先复用 Token、primitive、行为或纯规则。
- [ ] Shared props 没有页面名、route、feature 枚举、消费者专属布尔值或无界 style escape hatch。
- [ ] 共通化后旧重复实现已删除，所有直接消费者已检查。
- [ ] 错误抽象已拆分或降级，没有为了“复用率”继续增加特判。

### 控制流和设计模式

- [ ] 每个主要用户动作可以从 UI 回调追踪到一个权威编排点。
- [ ] 关键步骤、短路条件、调用顺序、错误映射和成功处理在清楚边界中可顺序阅读。
- [ ] 不存在 `handle -> do -> execute -> service` 等连续空转转发链。
- [ ] 每个抽象函数都提供语义、转换、invariant、边界、并发控制或可替换性中的至少一种价值。
- [ ] Use Case 不依赖 React、UI、Toast 或 Router；Reducer 不执行副作用。
- [ ] Reducer、状态机、Strategy、Adapter、Repository 或 class 均有明确复杂度触发原因。
- [ ] typed result、discriminated union 和状态 invariant 已用于避免隐藏分支和非法状态。

### Figma 和视觉

- [ ] 已读取入口节点、节点树、Auto Layout 和关键子节点。
- [ ] 已记录节点 ID、代码落点、资源导出和跳过原因。
- [ ] Figma component / variant 已先映射到现有 Token、primitive 和 pattern。
- [ ] Auto Layout 已合理映射为 Flexbox。
- [ ] Component、Variant、Variables 和 Token 已明确映射。
- [ ] 字体、fallback 和多语言 glyph 已确认。
- [ ] 图片和 SVG 使用正式本地资产并完成语义化命名。
- [ ] 未手工绘制系统 UI。
- [ ] 已检查布局、字体、颜色、资源、状态、safe area 和双端表现。

### 交互和平台

- [ ] 控件使用正确原生语义。
- [ ] 输入、按压、切换、disabled、loading 和 Modal 有真实反馈。
- [ ] 键盘不会遮挡输入和主要操作。
- [ ] safe area、StatusBar、系统导航栏和 edge-to-edge 已验证。
- [ ] iOS 和 Android 的返回、手势、权限、字体、Modal 和系统 picker 已评估。
- [ ] 关键控件具备 accessibility role、label、state 和测试入口。

### 质量和交付

- [ ] 未新增未批准依赖。
- [ ] 没有重复 Token、业务规则、业务事实源或无界 Cache。
- [ ] Shared UI、Use Case、Reducer 和 Controller 按风险完成相应测试。
- [ ] 已执行适合风险的 format、lint、typecheck、test、bundle 和原生检查。
- [ ] 已覆盖成功、失败、取消、loading、empty、stale 和竞态路径。
- [ ] 已说明本次问题与存量问题的边界。
- [ ] 最终交付说明关键文件、复用决策、动作流程、验证结果和剩余偏差。

### 安全和隐私

- [ ] 客户端 bundle 中没有真正秘密。
- [ ] Token 不进入公开 React state、route、URL、日志或 analytics。
- [ ] Auth 具有单一事实源、Persist Before Publish、Local-First Logout 和 stale-result fencing。
- [ ] Production 使用受控 HTTPS origin。
- [ ] 外部 URL、Deep Link、文件和网络 response 被视为不可信输入。
- [ ] 权限按需申请，拒绝后有 fallback。
- [ ] logout、账号切换和数据删除有明确清理策略。
- [ ] iOS / Android release 构建完成安全相关验收。

---

## 13. 一句话总结

```text
Figma / 项目事实
        ↓
app 路由入口
        ↓
feature page
   ┌────┴────────────────────┐
   ↓                         ↓
feature ui              controller hook
   ↓                         ↓
shared ui primitive     optional use case
                             ↓
                     model / api / adapter
                             ↓
                    shared 基础设施
        ↓
iOS / Android 双端交互、性能、安全和视觉验收
```

共通规约决定“代码应该如何组织和验证”，项目级规约决定“当前 App 具体使用什么”。执行时始终遵守：**先查再建、同因才抽、最低层共通、一条动作一处编排、禁止空转转发、模式只解决真实复杂度。**
