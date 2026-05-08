# Phase 8 Runtime Record Mock Summary

## 阶段定位

- 推荐路线 Phase 8 前置补强：运行态记录详情、新建、编辑、提交审批 Mock 闭环。
- 本阶段继续保持前端 Mock 验收，不接真实后端，不实现复杂业务逻辑。

## 任务范围

- 扩展 Runtime Mock API：
  - 创建业务记录。
  - 更新业务记录。
  - 提交业务记录并创建 Mock 待办。
  - recordVersion 冲突错误返回。
- 扩展运行态页面：
  - 列表页支持新建、详情、编辑入口。
  - 新增运行态记录详情页。
  - 新增运行态记录新建/编辑表单页。
- 表单和详情均由 RuntimeModel 字段定义驱动，不为三个样板应用写专属页面。

## 修改文件清单

- `packages/api-client/src/index.ts`
- `apps/web/src/services/runtimeApi.ts`
- `apps/web/src/pages/runtime/RuntimeRecordListPage.tsx`
- `apps/web/src/routes/index.tsx`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`

## 新增文件清单

- `apps/web/src/pages/runtime/RuntimeRecordDetailPage.tsx`
- `apps/web/src/pages/runtime/RuntimeRecordFormPage.tsx`
- `docs/codex/phase-8-runtime-record-mock-summary.md`

## 执行过的命令与结果

- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `pnpm test`：通过，`apps/web` 1 个 smoke test 通过；多个 package 仍是 P0 stub test。
- `bash scripts/check.sh`：通过，串联完成 frontend lint/typecheck/build 与 backend test。

## 验收结果

- `/runtime/apps/:appId/entities/:entityKey/list` 可进入新建、详情、编辑。
- `/runtime/apps/:appId/entities/:entityKey/new` 可按 RuntimeModel 字段创建记录。
- `/runtime/apps/:appId/entities/:entityKey/:recordId` 可查看记录详情并提交审批。
- `/runtime/apps/:appId/entities/:entityKey/:recordId/edit` 可按 RuntimeModel 字段编辑记录。
- 提交审批会创建 Mock 待办，可在任务中心继续处理。
- 保存/提交动作携带 recordVersion 或 idempotencyKey。

## 未完成事项

- 未接真实后端 runtime record API。
- 未实现真实字段权限裁剪、唯一字段校验、自动编号、附件上传绑定。
- attachment/subtable 字段仍是 Mock 文本输入，不是完整组件。
- 未新增运行态详情/表单组件测试。

## 风险或不确定点

- 当前 Mock 记录保存在内存 API Client 中，刷新页面会恢复初始数据。
- Vite 构建仍存在 Ant Design 共享 chunk 大于 500KB 警告。
- 后端真实事务、审计、幂等、权限、文件绑定尚未实现。
