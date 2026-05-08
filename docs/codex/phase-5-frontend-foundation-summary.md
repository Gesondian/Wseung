# Phase 5 Frontend Foundation Summary

## 任务范围

- P5-FE-001：前端全局布局和路由初版
- P5-FE-002：登录页和 Mock 会话状态初版
- P5-FE-003：应用中心页面初版
- 运行态列表入口验证：基于 Phase 2 Mock RuntimeModel 展示记录列表

## 已阅读文档

- `docs/codex/70-development-task-breakdown.md`
- `docs/codex/61-frontend-page-and-component-design.md`
- `docs/codex/02-P0-app-center.md`
- `docs/codex/40-api-design.md`

## 实现内容

- 新增 `AuthLayout`、`MainShell`、`RuntimeShell` 三类布局。
- 新增 `/login`、`/`、`/apps`、`/apps/:appId/overview`、`/tasks/todo`、`/runtime/apps/:appId`、`/runtime/apps/:appId/entities/:entityKey/list` 路由。
- 新增 Mock 登录页，成功后进入应用中心，失败显示错误。
- 新增 localStorage Mock 会话管理，仅用于前端 Mock 阶段。
- 新增应用中心页面，展示合同管理、费用报销、采购申请，并提供设计态/运行态入口。
- 新增运行态应用首页，基于 RuntimeModel 列出 entity 入口。
- 新增运行态列表页，基于 RuntimeModel view/field 配置动态生成表格列。
- 新增我的待办页面，展示 Mock taskVersion。

## 明确未实现

- 未实现真实认证、刷新 token、后端会话或后端权限校验。
- 未实现正式设计态页面，仅提供 `/apps/:appId/overview` 占位入口。
- 未实现 Runtime Renderer 完整组件体系；运行态列表当前是最小验证版。
- 未实现记录详情、新建、编辑、提交、审批动作。
- 未实现模板中心、组织用户角色、审计、安全事件和诊断页面。

## 风险与后续衔接

- localStorage 只用于 Mock 会话，不可作为最终权限依据。
- 运行态列表已经避免样板应用专属页面，但还未接入完整 RuntimeModel Adapter。
- 下一步建议继续 Phase 5 hardening 或进入 Phase 6 设计态工作台骨架。
