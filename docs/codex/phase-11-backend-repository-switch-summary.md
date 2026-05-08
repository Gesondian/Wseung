# Phase 11 Backend Repository Switch Summary

## 阶段定位

- 后端 Phase 4：将审计日志、安全事件、幂等服务从纯内存实现推进到可配置 Repository。
- 本阶段保持默认 profile 可无数据库运行；`db` profile 下可注册 JDBC Repository。

## 任务范围

- 为审计日志新增 `AuditLogRepository` 接口。
- 为安全事件新增 `SecurityEventRepository` 接口。
- 为幂等服务新增 `IdempotencyRepository` 接口。
- 默认 profile 使用内存 Repository，保持现有 Mock/基础测试可运行。
- `db` profile 下注册 JDBC Repository：
  - `AuditLogJdbcRepository`
  - `SecurityEventJdbcRepository`
  - `JdbcIdempotencyRepository`
- 扩展 Testcontainers PostgreSQL 测试：
  - Flyway 基础迁移验证。
  - 审计日志 JDBC 落库/读取。
  - 安全事件 JDBC 落库/读取。
  - 幂等键 JDBC 保存、查询、完成状态更新。

## 修改文件清单

- `apps/api/src/main/java/com/example/lowcode/audit/application/AuditLogService.java`
- `apps/api/src/main/java/com/example/lowcode/audit/application/SecurityEventService.java`
- `apps/api/src/main/java/com/example/lowcode/common/idempotency/IdempotencyService.java`
- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/AuditLogJdbcRepository.java`
- `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`
- `docs/codex/00-project-context-summary.md`

## 新增文件清单

- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/AuditPersistenceConfiguration.java`
- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/MemoryAuditLogRepository.java`
- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/MemorySecurityEventRepository.java`
- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/SecurityEventJdbcRepository.java`
- `apps/api/src/main/java/com/example/lowcode/common/idempotency/IdempotencyPersistenceConfiguration.java`
- `apps/api/src/main/java/com/example/lowcode/common/idempotency/MemoryIdempotencyRepository.java`
- `apps/api/src/main/java/com/example/lowcode/common/idempotency/JdbcIdempotencyRepository.java`
- `docs/codex/phase-11-backend-repository-switch-summary.md`

## 执行过的命令与结果

- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，7 个后端测试全部通过，0 skipped。
- `bash scripts/check.sh`：通过，frontend lint/typecheck/build 与 backend test 全部通过；后端 Testcontainers PostgreSQL 测试 4 个通过，0 skipped。

## 验收结果

- 默认 profile 仍使用内存 Repository，不要求本机 PostgreSQL。
- `db` profile 下可通过 Spring bean 注册 JDBC Repository。
- Testcontainers PostgreSQL 中，Flyway 迁移、审计日志、安全事件、幂等键持久化验证均通过。
- 没有为合同、报销、采购创建独立物理业务表。

## 未完成事项

- 运行态记录保存/查询 Repository 尚未实现。
- 文件、流程、权限等服务仍未接入真实持久化。
- `JdbcIdempotencyRepository` 当前使用默认租户，后续需要把 tenantId 纳入幂等接口。
- `db` profile 尚未启动完整后端应用做 API 层落库验证。

## 风险或不确定点

- 后续运行 Docker/Testcontainers 仍需在 Codex 中使用提升权限。
- Java 25 下仍有 Mockito 动态 agent 警告，测试通过；后续建议统一 JDK 21。
- Vite 构建仍有 Ant Design chunk 大小警告。
