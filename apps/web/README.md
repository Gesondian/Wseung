# Web App

React + TypeScript + Vite + Ant Design 前端工程。

## 当前状态

前端已完成 P0 Mock 主闭环的一批页面：

- 登录、工作台、应用中心
- 运行态应用首页、记录列表、详情、新建、编辑、提交审批
- 任务中心、审批详情、同意、驳回
- 发布管理、文件附件、审计日志、安全事件、诊断巡检

当前页面仍主要通过 Mock API 验证界面、路由和交互，不等同于真实后端联调完成。

## 下一步界面计划

前端界面规划从 Phase 15 开始正式落盘，详见 `docs/codex/phase-15-frontend-interface-blueprint-summary.md`。

推荐下一步 Phase 16：

- 补应用概览页
- 补数据模型设计页
- 补表单设计页
- 补流程设计页
- 补权限设计页
- 更新路由与侧边菜单
- 保持 Mock API，不冒充真实后端联调

```bash
pnpm install
pnpm --filter @lowcode/web dev
pnpm --filter @lowcode/web build
```
