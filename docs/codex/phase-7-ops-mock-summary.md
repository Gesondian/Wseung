# Phase 7 Ops Mock Summary

## 阶段定位

- 推荐路线中的 Phase 7：发布、文件、审计、安全、诊断页面 Mock。
- 本阶段只做前端 Mock 展示和统一 API Client 扩展，不接真实后端，不宣称真实联调完成。

## 任务范围

- 扩展 Mock 数据：发布记录、文件对象、审计日志、安全事件、诊断巡检结果。
- 扩展 API Client：`listReleases`、`listFiles`、`listAuditLogs`、`listSecurityEvents`、`listDiagnostics`。
- 新增服务入口：`fileApi`、`opsApi`。
- 新增页面：
  - `/apps/:appId/releases` 发布管理。
  - `/files` 文件与附件。
  - `/audit/logs` 审计日志。
  - `/security/events` 安全事件。
  - `/ops/diagnostics` 诊断与一致性巡检。
- 更新主导航，加入文件、审计、安全、诊断入口。
- 更新工作台当前阶段展示为 `P7 Mock`。

## 修改文件清单

- `packages/mock-data/src/index.ts`
- `packages/api-client/src/index.ts`
- `apps/web/src/services/fileApi.ts`
- `apps/web/src/routes/index.tsx`
- `apps/web/src/layouts/MainShell.tsx`
- `apps/web/src/pages/dashboard/DashboardPage.tsx`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`

## 新增文件清单

- `apps/web/src/services/opsApi.ts`
- `apps/web/src/pages/design/ReleaseManagementPage.tsx`
- `apps/web/src/pages/files/FileAttachmentPage.tsx`
- `apps/web/src/pages/audit/AuditLogPage.tsx`
- `apps/web/src/pages/security/SecurityEventPage.tsx`
- `apps/web/src/pages/ops/DiagnosticsPage.tsx`
- `docs/codex/phase-7-ops-mock-summary.md`

## 执行过的命令与结果

- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `pnpm build`：通过，仍有 Vite chunk 大于 500KB 的构建警告。
- `pnpm test`：通过，`apps/web` 1 个 smoke test 通过；多个 package 仍是 P0 stub test。
- `bash scripts/check.sh`：通过，串联完成 frontend lint/typecheck/build 与 backend test。

## 验收结果

- 发布管理页可按 appId 展示 Mock 发布记录。
- 文件页展示文件绑定、访问状态，未暴露 storagePath。
- 审计页展示发布、审批、文件访问等关键 Mock 审计日志。
- 安全页展示文件拒绝、任务冲突等 Mock 安全事件。
- 诊断页展示运行指针、快照、附件绑定、业务索引巡检结果。
- 主导航可进入新增页面。

## 未完成事项

- 未接真实发布、回滚、文件、审计、安全、诊断 API。
- 未实现审计详情 Drawer、安全事件处理动作和运行错误页面。
- 未实现真实文件预览/下载鉴权，只展示 Mock 访问状态。
- 未新增这些页面的组件测试。

## 风险或不确定点

- 当前为 Mock 验收，不代表真实后端审计、安全事件或文件鉴权已落库。
- Vite 构建仍存在 Ant Design 共享 chunk 大于 500KB 警告。
- `packages/*` lint/test 多数仍为 P0 stub，需要后续完善真实规则和测试。
