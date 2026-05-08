# Phase 6 Workflow Task Summary

## 阶段定位

- 推荐路线中的 Phase 6：运行态页面、任务中心、审批。
- 详细任务卡对应 P7-RT-006 / P7-FE-002 的前端 Mock 验收子集。
- 本阶段只做 Mock 闭环，不接真实后端，不实现复杂流程引擎。

## 任务范围

- 扩展 Workflow Mock API：待办、已办、任务详情、同意、驳回。
- 扩展任务中心页面：待办/已办 Tab、任务表格、审批详情入口。
- 新增审批详情页面：任务信息、RuntimeModel 驱动的业务记录详情、审批意见、流程轨迹。
- 审批动作携带 taskVersion、recordVersion、snapshotId、workflowInstanceId、idempotencyKey。
- 保持运行态页面不为合同、报销、采购写专属页面。

## 修改文件清单

- `packages/shared-types/src/index.ts`
- `packages/mock-data/src/index.ts`
- `packages/api-client/src/index.ts`
- `apps/web/src/services/workflowApi.ts`
- `apps/web/src/pages/tasks/TaskTodoPage.tsx`
- `apps/web/src/routes/index.tsx`

## 新增文件清单

- `apps/web/src/pages/tasks/TaskDetailPage.tsx`
- `docs/codex/phase-6-workflow-task-summary.md`

## 执行过的命令与结果

- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `pnpm test`：通过，`apps/web` 1 个 smoke test 通过；多个 package 仍是 P0 stub test。
- `pnpm build`：通过，仍有 Vite chunk 大于 500KB 的构建警告。
- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，后端 Spring Boot context test 通过。
- `bash scripts/check.sh`：通过，串联完成 frontend lint/typecheck/build 与 backend test。

## 验收结果

- `/tasks/todo` 可查看待办与已办。
- 待办可进入 `/tasks/:taskId` 审批详情。
- 审批详情通过 RuntimeModel 字段配置渲染业务记录。
- 待办任务可执行同意或驳回 Mock 动作。
- 已处理任务不再显示可提交动作。
- taskVersion 冲突错误码已进入共享类型与 Mock API 返回路径。

## 未完成事项

- 未实现真实后端 workflow API。
- 未实现运行态记录新建、保存、提交审批入口。
- 未实现节点字段权限裁剪，仅保留 RuntimeModel 字段渲染基础。
- 未实现审批附件区，仅预留审批意见与流程轨迹。
- 未新增任务中心组件测试，当前仍依赖 smoke test。

## 风险或不确定点

- 任务编号存在路线描述与详细任务卡编号不一致：推荐路线称为 Phase 6，详细任务卡将 Runtime Approval / 任务中心列为 P7。当前总结按推荐路线衔接命名。
- Vite 构建仍存在 Ant Design 共享 chunk 大于 500KB 警告，构建成功但后续需要 manualChunks 优化。
- Java 25 环境下后端测试仍会输出 Mockito 动态 agent 提示，测试通过；后续建议统一 JDK 21。
