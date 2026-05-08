# Phase 10 Docker Testcontainers Verification Summary

## 阶段定位

- 复核并解决 Phase 10 中 PostgreSQL/Testcontainers 测试被跳过的问题。
- 本阶段不新增业务逻辑，不调整技术栈，只验证 Docker 与 Testcontainers 的真实可用性。

## 问题定位

- Docker CLI 已安装，Docker Desktop 已启动。
- `/var/run/docker.sock` 指向 `/Users/soengw/.docker/run/docker.sock`，socket 文件存在。
- 默认 Codex 沙箱内执行 `docker version` 会报 `permission denied while trying to connect to the docker API`。
- 使用提升权限后，`docker version` 可正常连接 Docker Desktop。

## 结论

- 问题不是 Docker 未安装或未启动。
- 问题是默认沙箱无法访问 Docker Unix socket。
- 后续需要运行 Testcontainers 的命令，应在 Codex 中使用提升权限执行。

## 修改文件清单

- `docs/codex/phase-10-db-flyway-testcontainers-summary.md`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`
- `docs/codex/00-project-context-summary.md`

## 新增文件清单

- `docs/codex/phase-10-docker-testcontainers-verification-summary.md`

## 执行过的命令与结果

- `which docker`：通过，Docker CLI 位于 `/usr/local/bin/docker`。
- `docker version`：默认沙箱内失败，报 Docker socket permission denied。
- `ls -l /var/run/docker.sock`：通过，确认该路径链接到用户目录 Docker socket。
- `ls -l /Users/soengw/.docker/run/docker.sock`：通过，确认 socket 文件存在。
- `docker version`：提升权限后通过，Docker Desktop Server 可访问。
- `mvn -Dmaven.repo.local=../../.m2/repository test`：提升权限后通过，5 个后端测试全部通过，0 skipped。
- `bash scripts/check.sh`：提升权限后通过，frontend lint/typecheck/build 与 backend test 全部通过；Testcontainers PostgreSQL 测试 2 个通过，0 skipped。

## 验收结果

- Testcontainers 成功连接 Docker。
- 首次运行已拉取 `testcontainers/ryuk:0.12.0` 与 `postgres:16-alpine` 镜像。
- PostgreSQL 容器成功启动。
- Flyway 成功应用 `V1__p0_foundation.sql`。
- 审计日志 JDBC Repository 落库/读取测试通过。
- 后端总测试结果：5 run, 0 failures, 0 errors, 0 skipped。

## 未完成事项

- 未将 `AuditLogJdbcRepository` 接管到线上 `AuditLogService`。
- 安全事件、幂等、运行态记录 Repository 仍待后续实现。
- 默认 Codex 沙箱内仍不能直接访问 Docker socket；需要提升权限运行涉及 Docker/Testcontainers 的命令。

## 风险或不确定点

- 后续 CI 或其他开发机需要保证 Docker 可用，且允许 Testcontainers 访问 Docker socket。
- 首次运行 Testcontainers 会拉取镜像，耗时受网络影响。
- Java 25 下仍有 Mockito 动态 agent 警告，测试通过；后续建议统一 JDK 21。
