# Phase 12 Runtime Record Backend Summary

## 阶段定位

- 后端 Phase 4：运行态记录保存/查询的最小真实接口与 Repository 测试。
- 本阶段只实现通用业务记录 `lc_business_record` 的最小闭环，不实现复杂流程提交、权限矩阵、字段权限、附件绑定。

## 任务范围

- 新增运行态记录 API：
  - `GET /api/v1/runtime/apps/{appId}/entities/{entityKey}/records`
  - `GET /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}`
  - `POST /api/v1/runtime/apps/{appId}/entities/{entityKey}/records`
  - `PUT /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}`
- 新增 `RuntimeRecordService`，支持创建、查询、列表、版本校验更新。
- 新增 `RuntimeRecordRepository`，默认 profile 使用内存实现，`db` profile 使用 JDBC 实现。
- JDBC 实现写入 `lc_business_record.data_json` 的 PostgreSQL `jsonb` 字段。
- 创建/更新记录时写入审计日志。
- 新增 MockMvc 测试覆盖创建、查询、更新、版本冲突。
- 扩展 Testcontainers PostgreSQL 测试覆盖运行态记录 Repository 落库、读取、更新。

## 修改文件清单

- `apps/api/src/test/java/com/example/lowcode/LowcodeApplicationTests.java`
- `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`
- `docs/codex/00-project-context-summary.md`

## 新增文件清单

- `apps/api/src/main/java/com/example/lowcode/record/api/RuntimeRecordController.java`
- `apps/api/src/main/java/com/example/lowcode/record/api/RuntimeRecordResponse.java`
- `apps/api/src/main/java/com/example/lowcode/record/api/SaveRuntimeRecordRequest.java`
- `apps/api/src/main/java/com/example/lowcode/record/application/RuntimeRecordService.java`
- `apps/api/src/main/java/com/example/lowcode/record/application/RuntimeRecordRepository.java`
- `apps/api/src/main/java/com/example/lowcode/record/infrastructure/RecordPersistenceConfiguration.java`
- `apps/api/src/main/java/com/example/lowcode/record/infrastructure/MemoryRuntimeRecordRepository.java`
- `apps/api/src/main/java/com/example/lowcode/record/infrastructure/JdbcRuntimeRecordRepository.java`
- `docs/codex/phase-12-runtime-record-backend-summary.md`

## 执行过的命令与结果

- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，9 个后端测试全部通过，0 skipped。
- `bash scripts/check.sh`：通过，frontend lint/typecheck/build 与 backend test 全部通过；后端 Testcontainers PostgreSQL 测试 5 个通过，0 skipped。

## 验收结果

- 默认 profile 可通过内存 Repository 完成运行态记录创建、查询、更新、版本冲突校验。
- `db` profile 下 JDBC Repository 可写入/读取/更新 `lc_business_record`。
- PostgreSQL `jsonb` 数据可通过 Jackson `JsonNode` 正常保存与读取。
- 仍遵守通用业务记录表策略，没有为合同、报销、采购创建独立物理业务表。

## 未完成事项

- 未实现运行态提交审批的后端真实接口。
- 未接入运行态快照指针 `lc_app_runtime_pointer` 来生成真实 `snapshotId/appVersionId`。
- 未实现字段级权限、后端权限校验、唯一校验、附件绑定、流程事务。
- 运行态列表暂未实现分页对象，与前端 Mock `PageResponse` 仍有差异。

## 风险或不确定点

- 当前 `snapshotId/appVersionId` 仍是 P0 默认生成值，后续必须切到发布态 runtime pointer。
- 运行态记录 API 尚未接入前端真实 API client，目前前端仍使用 Mock client。
- 后续 Docker/Testcontainers 命令仍需在 Codex 中使用提升权限。
- Java 25 下仍有 Mockito 动态 agent 警告，测试通过；后续建议统一 JDK 21。
