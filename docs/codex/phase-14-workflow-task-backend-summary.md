# Phase 14 流程任务最小后端总结

## 1. 阶段范围

本阶段继续后端 Phase 4，在 Phase 13 提交审批占位任务基础上，补齐任务列表、任务详情、同意、驳回的最小真实后端接口。该阶段仍不实现完整 BPMN、复杂节点流转、会签/加签/转办，也不把前端 Mock 任务中心声明为真实联调完成。

## 2. 已完成内容

1. 新增 `GET /api/v1/workflow/tasks` 我的任务列表。
2. 新增 `GET /api/v1/workflow/tasks/{taskId}` 我的任务详情。
3. 新增 `POST /api/v1/workflow/tasks/{taskId}/approve` 同意任务。
4. 新增 `POST /api/v1/workflow/tasks/{taskId}/reject` 驳回任务。
5. 审批动作请求支持 `taskVersion`、`idempotencyKey` 和 `comment`。
6. 任务访问按 `X-Mock-User-Id` 与任务 `assigneeId` 做最小后端校验。
7. 审批动作支持 `taskVersion` 冲突校验，过期版本返回 `VERSION_CONFLICT`。
8. 已处理任务再次审批返回 `WORKFLOW_TASK_INVALID`。
9. 同一审批幂等键重复提交返回同一个已处理任务。
10. 内存/JDBC WorkflowTaskRepository 支持按处理人列表、按 ID 查询和状态更新。
11. MockMvc 覆盖列表、详情、同意、驳回、幂等、版本冲突和重复处理。
12. Testcontainers 覆盖 JDBC 任务列表、按 ID 查询和任务状态更新。

## 3. 修改文件清单

1. `apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskRepository.java`
2. `apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskService.java`
3. `apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/MemoryWorkflowTaskRepository.java`
4. `apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/JdbcWorkflowTaskRepository.java`
5. `apps/api/src/test/java/com/example/lowcode/LowcodeApplicationTests.java`
6. `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
7. `docs/codex/00-current-working-plan.md`
8. `docs/codex/00-project-doc-index.md`
9. `docs/codex/00-baseline-state.md`
10. `docs/codex/00-decision-log.md`
11. `docs/codex/00-project-context-summary.md`

## 4. 新增文件清单

1. `apps/api/src/main/java/com/example/lowcode/workflow/api/CompleteWorkflowTaskRequest.java`
2. `apps/api/src/main/java/com/example/lowcode/workflow/api/WorkflowTaskController.java`
3. `docs/codex/phase-14-workflow-task-backend-summary.md`

## 5. 执行过的命令

```bash
mvn -Dmaven.repo.local=../../.m2/repository test
bash scripts/check.sh
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskService.java
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/workflow/application/WorkflowTaskRepository.java
sed -n '1,320p' apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/JdbcWorkflowTaskRepository.java
sed -n '1,320p' apps/api/src/test/java/com/example/lowcode/LowcodeApplicationTests.java
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/workflow/infrastructure/MemoryWorkflowTaskRepository.java
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/workflow/api/WorkflowTaskResponse.java
sed -n '1,360p' apps/api/src/main/java/com/example/lowcode/record/application/RuntimeRecordService.java
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/common/error/ErrorCode.java
sed -n '1,240p' apps/api/src/main/java/com/example/lowcode/record/api/RuntimeRecordController.java
sed -n '1,220p' apps/api/src/main/java/com/example/lowcode/common/idempotency/IdempotencyService.java
sed -n '1,260p' apps/api/src/main/resources/db/migration/V1__p0_foundation.sql
sed -n '1,360p' apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java
sed -n '1,260p' apps/api/src/main/java/com/example/lowcode/common/web/RequestContextFilter.java
```

## 6. 命令结果

1. 第一次 `mvn -Dmaven.repo.local=../../.m2/repository test`：失败，原因是新增测试以默认 `anonymous` 用户查询“我的任务”，而提交审批占位任务分配给 `usr_approver`，列表为空。
2. 修复后 `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，`Tests run: 12, Failures: 0, Errors: 0, Skipped: 0`。
3. `bash scripts/check.sh`：通过。
4. 前端 lint：通过。
5. 前端 typecheck：通过。
6. 前端 build：通过，仍有 Vite chunk 大于 500KB 警告。
7. 后端 Maven test：通过，Testcontainers PostgreSQL 真实启动并 0 skipped。

## 7. 未完成事项

1. 尚未实现完整流程实例流转、下一节点生成、流程结束后回写业务状态。
2. 审批动作只更新当前任务状态，未生成已办查询接口。
3. 任务权限仍是基于 Mock 请求头的最小校验，尚未接入真实用户、角色和字段权限。
4. 前端任务中心和审批详情仍使用 Mock API，尚未切换到真实后端。
5. 文件鉴权、附件下载和真实发布快照仍未进入后端闭环。

## 8. 风险或不确定点

1. `comment` 当前只作为请求字段保留，尚未落库为审批意见。
2. `lc_workflow_task` 仍是 P0 占位模型，不能等同于完整流程引擎表设计。
3. 默认 profile 仍使用内存 Repository，只有 `db` profile 走 JDBC Repository。
4. 真实多租户、真实鉴权和事务边界尚未完成。
5. Java 25 测试仍有 Mockito 动态 agent 提示，建议后续统一 JDK 21 或显式配置 agent。
