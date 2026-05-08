# Phase 10 DB Flyway Testcontainers Summary

## 阶段定位

- 后端 Phase 4 数据库接入准备：PostgreSQL profile、Flyway PostgreSQL 支持、Testcontainers 迁移验证、最小 JDBC Repository。
- 本阶段不把默认应用启动切换为强依赖本机数据库，避免无 PostgreSQL 环境时阻断普通开发与 Mock 验收。

## 任务范围

- 增加 Flyway PostgreSQL database module。
- 增加 Testcontainers JUnit Jupiter 与 PostgreSQL 测试依赖。
- 新增 `application-db.yml`，通过 `db` profile 启用 PostgreSQL datasource 与 Flyway。
- 新增 PostgreSQL 容器测试，验证 `V1__p0_foundation.sql` 能迁移到真实 PostgreSQL。
- 新增最小 `AuditLogJdbcRepository`，验证审计日志可通过 JDBC 写入和读取 `lc_audit_log`。
- 保持默认 `application.yml` 中 Flyway 关闭，避免未配置数据库时影响现有后端测试。

## 修改文件清单

- `apps/api/pom.xml`
- `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`
- `docs/codex/00-project-context-summary.md`

## 新增文件清单

- `apps/api/src/main/resources/application-db.yml`
- `apps/api/src/main/java/com/example/lowcode/audit/infrastructure/AuditLogJdbcRepository.java`
- `apps/api/src/test/java/com/example/lowcode/PostgresFlywayMigrationTests.java`
- `docs/codex/phase-10-db-flyway-testcontainers-summary.md`

## 执行过的命令与结果

- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过。普通 Spring Boot 测试 3 个通过；PostgreSQL/Testcontainers 测试 2 个因 Docker 不可用被跳过。
- `bash scripts/check.sh`：通过。frontend lint/typecheck/build 通过，backend maven test 通过；Testcontainers 用例在当前环境跳过。

## 验收结果

- Maven 可解析 Flyway PostgreSQL 与 Testcontainers 依赖。
- 默认 profile 仍可启动和测试，不要求本机 PostgreSQL。
- `db` profile 已提供 PostgreSQL datasource 与 Flyway 配置入口。
- Testcontainers 测试已进入后端测试路径；在 Docker 可用环境会验证迁移表存在、`jsonb` 字段类型正确、审计日志可落库读取。
- 没有为合同、报销、采购创建独立物理业务表。

## 追加验证

- 2026-05-07 已在 Docker Desktop 可用后使用提升权限重新运行后端测试与全量检查。
- `mvn -Dmaven.repo.local=../../.m2/repository test`：5 个测试全部通过，0 skipped。
- `bash scripts/check.sh`：通过，Testcontainers PostgreSQL 测试 2 个通过，0 skipped。
- 之前跳过的原因确认为 Codex 默认沙箱无法访问 Docker socket，不是 Docker 未安装或迁移测试失败。

## 未完成事项

- 默认 Codex 沙箱仍无法访问 Docker socket；涉及 Testcontainers 的命令需要提升权限执行。
- `AuditLogJdbcRepository` 仍是最小 Repository，尚未接管线上 `AuditLogService`。
- 安全事件、幂等键、运行态记录尚未实现 JDBC Repository。
- 未补齐完整核心表组，例如组织、权限、流程、文件、业务记录索引等。

## 风险或不确定点

- 后续 CI 或其他开发机需要保证 Docker 可用，且允许 Testcontainers 访问 Docker socket。
- 默认 profile 与 `db` profile 当前是分离状态，后续接入真实后端联调时需要明确启动方式和环境变量。
- Java 25 下仍有 Mockito 动态 agent 警告，测试通过；后续建议统一 JDK 21。
- Vite 构建仍有 Ant Design chunk 大小警告。
