# Phase 13 运行态提交审批最小后端总结

## 1. 阶段范围

本阶段继续后端 Phase 4，只实现运行态记录“提交审批”的最小真实后端接口，不实现完整 BPMN、不实现审批同意/驳回、不把前端 Mock 任务中心声明为真实联调完成。

## 2. 已完成内容

1. 新增 `POST /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}/submit`。
2. 提交审批请求支持 `recordVersion` 与 `idempotencyKey`。
3. 提交时先按幂等键查询已有流程任务，重复提交同一幂等键返回同一个任务。
4. 新幂等键提交时校验记录版本，版本过期返回 `VERSION_CONFLICT`。
5. 提交成功后将运行态记录 `workflowStatus` 更新为 `submitted`。
6. 新增最小流程任务占位数据模型与内存/JDBC Repository。
7. Flyway 基础迁移增加 `lc_workflow_task`。
8. MockMvc 覆盖提交成功、重复提交幂等、过期版本冲突。
9. Testcontainers 覆盖 `lc_workflow_task` 表与 JDBC Repository。

## 3. 修改文件清单

1. `apps/api/src/main/resources/db/migration/V1__p0_foundation.sql`
2. `apps/api/src/main/java/com/example/lowcode/record/api/RuntimeRecordController.java`
3. `apps/api/src/main/java/com/example/lowcode/record/application/RuntimeRecordService.java`
4. `apps/api/src/test/java/com/example/lowcode/LowcodeApplicationTests.java`
5. `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
6. `docs/codex/00-current-working-plan.md`
7. `docs/codex/00-project-doc-index.md`
8. `docs/codex/00-baseline-state.md`
9. `docs/codex/00-decision-log.md`
10. `docs/codex/00-project-context-summary.md`

## 4. 新增文件清单

1. `apps/api/src/main/java/com/example/lowcode/record/api/SubmitRuntimeRecordRequest.java`
2. `apps/api/src/main/java/com/example/lowcode/workflow/api/WorkflowTaskResponse.java`
3. `apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskService.java`
4. `apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskRepository.java`
5. `apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/WorkflowPersistenceConfiguration.java`
6. `apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/MemoryWorkflowTaskRepository.java`
7. `apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/JdbcWorkflowTaskRepository.java`
8. `docs/codex/phase-13-runtime-submit-backend-summary.md`

## 5. 执行过的命令

```bash
git status --short
bash scripts/check.sh
sed -n '1,220p' docs/codex/00-current-working-plan.md
sed -n '1,220p' docs/codex/00-project-doc-index.md
sed -n '1,220p' docs/codex/00-baseline-state.md
sed -n '220,520p' docs/codex/00-baseline-state.md
sed -n '1,260p' docs/codex/00-project-context-summary.md
sed -n '1,260p' docs/codex/00-decision-log.md
rg --files apps/api/src/main/java apps/api/src/test/java apps/api/src/main/resources docs/codex
```

## 6. 命令结果

1. `git status --short`：失败，当前目录不是 Git 仓库，无法通过 Git 输出变更清单。
2. `bash scripts/check.sh`：通过。
3. 前端 lint：通过。
4. 前端 typecheck：通过。
5. 前端 build：通过，仍有 Vite chunk 大于 500KB 警告。
6. 后端 Maven test：通过。
7. Testcontainers PostgreSQL：真实启动并通过，`Tests run: 11, Failures: 0, Errors: 0, Skipped: 0`。

## 7. 未完成事项

1. 尚未实现任务列表/任务详情/同意/驳回的真实后端 API。
2. 尚未实现完整流程实例、节点流转、审批动作事务和任务版本冲突闭环。
3. 提交审批暂未接入真实权限入口。
4. 提交审批暂未接入 `lc_app_runtime_pointer` 与真实 `metadata_snapshot`。
5. 前端仍通过 Mock API 演示任务中心和审批详情，尚未切到真实后端。

## 8. 风险或不确定点

1. 本阶段仍在 P0 scaffold 阶段直接修改 `V1__p0_foundation.sql`；一旦有已部署数据库，后续必须改为新增 `V2__...` 迁移。
2. 当前流程任务是占位能力，不等同于完整 BPMN 或真实审批引擎。
3. 默认 profile 仍使用内存 Repository，只有 `db` profile 走 JDBC Repository。
4. Docker/Testcontainers 在 Codex 默认沙箱内可能仍需要提升权限访问 Docker socket。
5. Java 25 测试仍有 Mockito 动态 agent 提示，建议后续统一 JDK 21 或显式配置 agent。
