# Phase 9 Backend Foundation Summary

## 阶段定位

- 后端 Phase 3/4 基础设施骨架：认证上下文、统一响应/异常、审计/安全事件、幂等服务、Flyway 迁移骨架。
- 本阶段只完成后端基础设施与可测试接口，不实现复杂业务逻辑，不接真实数据库持久化，不改变既定技术栈。

## 任务范围

- 建立统一 API 响应结构，包含 `success`、`code`、`message`、`data`、`details`、`requestId`、`traceId`。
- 建立请求上下文过滤器，从请求头读取或生成 `X-Request-Id`、`X-Trace-Id`，并提供 P0 默认租户、用户与角色上下文。
- 建立统一业务异常与全局异常处理。
- 新增 Mock 登录、当前用户、登出接口。
- 新增内存版审计日志、安全事件、幂等服务。
- 新增审计日志与安全事件查询接口。
- 将健康检查和诊断上下文接口纳入统一响应。
- 新增 Flyway P0 基础表迁移骨架，覆盖审计、安全事件、幂等、元数据快照、运行态指针、通用业务记录。
- 新增后端 MockMvc 测试覆盖统一响应、请求上下文、登录失败安全事件。

## 修改文件清单

- `apps/api/src/main/java/com/example/lowcode/common/ApiResponse.java`
- `apps/api/src/main/java/com/example/lowcode/diagnostics/HealthController.java`
- `apps/api/src/test/java/com/example/lowcode/LowcodeApplicationTests.java`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`
- `docs/codex/00-project-context-summary.md`

## 新增文件清单

- `apps/api/src/main/java/com/example/lowcode/common/ApiErrorDetail.java`
- `apps/api/src/main/java/com/example/lowcode/common/context/RequestContext.java`
- `apps/api/src/main/java/com/example/lowcode/common/context/RequestContextHolder.java`
- `apps/api/src/main/java/com/example/lowcode/common/web/RequestContextFilter.java`
- `apps/api/src/main/java/com/example/lowcode/common/web/ResponseFactory.java`
- `apps/api/src/main/java/com/example/lowcode/common/error/ErrorCode.java`
- `apps/api/src/main/java/com/example/lowcode/common/error/BusinessException.java`
- `apps/api/src/main/java/com/example/lowcode/common/error/GlobalExceptionHandler.java`
- `apps/api/src/main/java/com/example/lowcode/common/idempotency/IdempotencyService.java`
- `apps/api/src/main/java/com/example/lowcode/auth/api/LoginRequest.java`
- `apps/api/src/main/java/com/example/lowcode/auth/api/LoginResponse.java`
- `apps/api/src/main/java/com/example/lowcode/auth/api/AuthController.java`
- `apps/api/src/main/java/com/example/lowcode/auth/application/AuthApplicationService.java`
- `apps/api/src/main/java/com/example/lowcode/audit/application/AuditLogService.java`
- `apps/api/src/main/java/com/example/lowcode/audit/application/SecurityEventService.java`
- `apps/api/src/main/java/com/example/lowcode/audit/api/AuditController.java`
- `apps/api/src/main/resources/db/migration/V1__p0_foundation.sql`
- `docs/codex/phase-9-backend-foundation-summary.md`

## 执行过的命令与结果

- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，3 个后端测试通过。
- `bash scripts/check.sh`：通过，串联完成 frontend lint、frontend typecheck、frontend build、backend maven test。

## 验收结果

- `GET /api/v1/health` 返回统一响应，并回传 `requestId`、`traceId`。
- `GET /api/v1/diagnostics/context` 可查看当前请求上下文。
- `POST /api/v1/auth/login` 支持 P0 Mock 管理员登录；错误密码返回统一 `UNAUTHORIZED`。
- 登录失败会记录安全事件，可通过 `GET /api/v1/audit/security-events` 查询。
- `GET /api/v1/audit/logs` 提供内存审计日志查询入口。
- Flyway 迁移文件已存在，但当前 `application.yml` 中仍关闭 Flyway，避免在尚未接入 PostgreSQL 时误连真实数据库。

## 未完成事项

- 未启用真实 PostgreSQL 与 Flyway 自动迁移。
- 审计日志、安全事件、幂等键仍是内存服务，未落库。
- 登录仍是 Mock 管理员账号，不是正式用户、角色、会话或 JWT 体系。
- 后端权限校验、运行态记录、流程事务、文件鉴权尚未实现。
- `lc_business_record_index`、流程、文件、组织、权限等完整表组仍待后续迁移补齐。

## 风险或不确定点

- Java 25 下测试会输出 Mockito 动态 agent 提示，测试通过；后续建议统一 JDK 21。
- Vite 构建仍存在 Ant Design 共享 chunk 大于 500KB 警告。
- Flyway 迁移文件使用 PostgreSQL `jsonb`，后续启用测试数据库时需确保使用 PostgreSQL 或 Testcontainers。
- 当前后端接口为基础设施验收，不代表真实后端联调或真实权限闭环完成。
