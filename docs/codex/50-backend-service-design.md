---
title: 后端服务设计
subtitle: 企业级低代码平台 v1.0｜P0 后端服务、领域边界与代码生成基线
version: v1.0
date: 2026-05-06
status: 基线版
depends_on:
  - 00-project-context-summary.md
  - 00-project-doc-index.md
  - 00-current-working-plan.md
  - 00-decision-log.md
  - 20-system-architecture-design.md
  - 30-core-database-design.md
  - 40-api-design.md
  - 45-tech-stack-and-scaffold-decision.md
  - 60-frontend-runtime-renderer-design.md
  - 61-frontend-page-and-component-design.md
  - 90-metadata-dsl-guideline.md
---

# 50-backend-service-design.md

版本：v1.0  
适用范围：低代码平台 P0 后端服务设计、Spring Boot 模块化单体、Controller / Service / Repository 代码生成、事务边界、权限审计、缓存、测试用例生成  
最后更新：2026-05-06  
状态：基线版

---
## 0. 文档定位

本文档定义企业级低代码平台 P0 阶段的后端服务设计，承接：

```text
20-system-architecture-design.md
30-core-database-design.md
40-api-design.md
45-tech-stack-and-scaffold-decision.md
60-frontend-runtime-renderer-design.md
61-frontend-page-and-component-design.md
90-metadata-dsl-guideline.md
```

本文档用于指导：

```text
1. Spring Boot 后端模块化单体代码结构。
2. Controller / Application Service / Domain Service / Repository 分层。
3. 认证、租户上下文、权限、审计、幂等和异常处理的统一实现。
4. 应用中心、模板、组织用户角色、元数据、发布、运行态、业务记录、流程、文件、回收站、审计安全等服务边界。
5. 发布、回滚、业务记录保存、流程审批、文件下载等关键事务边界。
6. Codex 后续生成后端代码、接口测试、服务测试和集成测试的约束。
```

本文档不是完整 Java 代码实现，不替代 `40-api-design.md` 的 API 契约，不替代 `30-core-database-design.md` 的数据库设计，不替代后续 `80-test-and-acceptance-plan.md`。

后续可以基于本文生成：

```text
1. Spring Boot 工程目录和模块包结构。
2. Controller / ApplicationService / DomainService / Repository 接口骨架。
3. DTO / Command / Query / ViewObject / Mapper。
4. 事务注解和权限注解骨架。
5. 服务层单元测试、集成测试和 API 测试。
6. Codex 执行任务拆解。
```

---

## 1. 文档目的

本文档重点解决以下问题：

| 问题 | 设计输出 |
|---|---|
| 后端按哪些模块组织？ | 明确模块化单体的包结构和模块边界。 |
| 每类 API 由哪个服务承接？ | 建立 API 域、应用服务、领域服务和数据表之间的映射。 |
| 事务在哪里开启？ | 明确发布、回滚、保存记录、审批、文件绑定等事务边界。 |
| 权限在哪里校验？ | 明确认证上下文、应用权限、对象权限、字段权限、数据权限、流程任务权限和文件权限链路。 |
| 审计在哪里写？ | 明确审计日志、安全事件、文件访问日志、业务变更日志的写入位置。 |
| 幂等如何落地？ | 明确高风险写接口的幂等服务和 `lc_api_idempotency_key` 使用策略。 |
| Codex 如何生成代码？ | 给出目录、类名、方法职责、禁止事项和完成定义。 |

---

## 2. 前置结论

P0 后端服务基线如下：

```text
1. 后端采用 Java + Spring Boot + Maven。
2. 工程形态采用模块化单体，不拆微服务。
3. 代码按领域模块分包，不把所有逻辑堆到一个 service 或 repository。
4. API 使用 /api/v1，遵守 40-api-design.md。
5. 数据访问遵守 30-core-database-design.md，不为业务对象生成独立物理表。
6. 元数据 DSL 遵守 90-metadata-dsl-guideline.md。
7. 运行态必须通过 lc_app_runtime_pointer 加载 lc_metadata_snapshot，不读取 draft_json。
8. 权限校验必须在后端执行，前端权限表现不是安全边界。
9. 发布、回滚、业务记录写入、流程审批必须有清晰事务边界。
10. 附件下载、预览、删除必须以 lc_file_attachment 为权威绑定关系。
11. 高风险写操作必须支持幂等或在 API 设计中明确替代策略。
12. 所有核心查询默认携带 tenant_id 和软删除条件。
```

---

## 3. 后端服务设计目标

| 目标 | 说明 |
|---|---|
| 模块清晰 | 按 app、auth、org、metadata、release、permission、runtime、record、workflow、file、audit、system 等模块组织。 |
| 事务可控 | 关键写操作在 Application Service 层统一开事务。 |
| 权限强制 | 后端统一执行认证、应用访问、对象操作、字段、数据范围、流程任务和文件绑定校验。 |
| 快照隔离 | 设计态、发布态、运行态读取链路隔离。 |
| 数据一致 | 业务记录、索引、关系、附件、变更日志和流程实例在同一事务或明确一致性边界内维护。 |
| 可审计 | 关键写操作、权限拒绝、安全事件、附件访问和发布回滚均可追踪。 |
| 可测试 | 每个服务具备可单测的领域逻辑和可集成测试的事务场景。 |
| 可生成 | 为 Codex 提供明确包结构、服务职责、方法命名和禁止事项。 |
| 可演进 | P0 模块化单体保留多租户、缓存、对象存储、OpenAPI、测试和后续微服务化边界。 |

---

## 4. 后端服务设计原则

```text
1. Controller 只负责协议适配，不写业务规则。
2. Application Service 负责用例编排、事务、权限入口、审计入口和幂等入口。
3. Domain Service 负责领域规则，不直接依赖 Web 层。
4. Repository 只负责数据访问，不做跨模块业务编排。
5. Mapper 只做 DTO / Entity / VO 转换，不做权限判断。
6. PermissionService 是后端权限判断入口，禁止把权限散落在 Controller。
7. AuditService 是审计写入入口，禁止各模块随意拼接审计结构。
8. Runtime 服务只读取发布态快照，不读取设计态草稿。
9. 业务记录写入不得只保存 data_json，必须同步维护索引、关系、附件和变更日志。
10. 流程任务操作必须使用 taskVersion 或 version 做乐观锁。
11. 文件下载必须查询 lc_file_attachment 并执行业务权限校验。
12. P0 可以使用同步方法调用和本地事务，不引入复杂事件总线或分布式事务。
```

---

## 5. P0 后端服务范围

P0 后端服务覆盖：

| 服务域 | 范围 |
|---|---|
| 认证与会话 | 登录、登出、当前用户、密码认证、登录失败记录、认证上下文。 |
| 租户上下文 | 默认租户、tenant_id 传递、查询隔离预留。 |
| 应用中心 | 应用、分类、成员、模板创建应用。 |
| 组织用户角色 | 组织树、用户、角色、用户部门、用户角色。 |
| 元数据设计 | entity、field、form、view、workflow、permission、menu 等 DSL 草稿。 |
| 元数据依赖 | 引用关系、发布校验、删除影响分析。 |
| 权限设计 | 权限策略、权限分配、权限变更日志、有效权限计算。 |
| 发布与版本 | 发布校验、快照生成、运行指针切换、回滚。 |
| 运行态模型 | RuntimeModel 加载、权限裁剪、缓存。 |
| 通用业务数据 | 记录创建、编辑、详情、列表、提交、删除、导出预留。 |
| 自动编号 | 合同编号、报销单号、采购申请编号等后端生成。 |
| 唯一字段 | 低代码唯一字段并发安全占用。 |
| 流程运行 | 发起流程、待办、审批、驳回、撤回、轨迹。 |
| 文件服务 | 上传、绑定、预览、下载、删除、访问日志。 |
| 回收站 | 应用、元数据、业务记录、文件等软删除索引和恢复校验。 |
| 审计安全 | 审计日志、安全事件、运行错误日志。 |
| 幂等 | 表单提交、审批、发布、回滚、文件上传等高风险写操作。 |
| 诊断巡检 | 运行指针、快照、索引、依赖、附件、唯一值的一致性检查。 |

---

## 6. P0 后端不做范围

```text
1. 不拆分微服务。
2. 不引入分布式事务 Saga。
3. 不实现完整 BPMN 引擎。
4. 不实现插件市场、插件沙箱和第三方组件运行时。
5. 不实现完整 SaaS 计费、套餐、租户运营后台。
6. 不实现完整 BI、OLAP、数据仓库和指标引擎。
7. 不实现 AI 自动生成应用的提示词、训练和生成历史后端。
8. 不实现原生移动端离线同步后端。
9. 不为合同、报销、采购等业务对象生成独立物理表或独立 Repository。
10. 不让前端绕过后端权限提交隐藏字段。
```

---

## 7. 后端总体分层架构

P0 后端采用模块化单体，逻辑分层如下：

```text
API Layer
  Controller
  Request DTO
  Response VO
  Web Exception Handler

Application Layer
  Application Service
  Command / Query
  Transaction Boundary
  Permission Entry
  Idempotency Entry
  Audit Entry

Domain Layer
  Domain Service
  Domain Model
  Domain Policy
  Validator
  Runtime Interpreter

Infrastructure Layer
  Repository
  Entity / PO
  Mapper
  Cache Adapter
  File Storage Adapter
  Password Encoder
  Clock / ID Generator

Common Layer
  TenantContext
  UserContext
  RequestContext
  ErrorCode
  Result
  PageResult
  AuditContext
  SecurityContext
```

分层约束：

```text
1. Controller 可以依赖 Application Service。
2. Application Service 可以依赖 Domain Service、Repository、Common Service。
3. Domain Service 不依赖 Controller、Request、Response、Servlet。
4. Repository 不依赖 Application Service。
5. Infrastructure Adapter 通过接口被 Application / Domain 使用。
6. 跨模块调用优先通过 Application Service 或明确的 Domain Facade，不直接访问其他模块 Repository。
```

---

## 8. 后端工程结构

承接 `45-tech-stack-and-scaffold-decision.md`，后端工程建议目录如下：

```text
apps/api/
  pom.xml
  src/main/java/com/example/lowcode/
    LowcodeApplication.java

    common/
      context/
      error/
      result/
      id/
      time/
      lock/
      json/
      validation/
      security/
      audit/
      web/

    auth/
      api/
      application/
      domain/
      infrastructure/

    tenant/
      application/
      domain/
      infrastructure/

    app/
      api/
      application/
      domain/
      infrastructure/

    org/
      api/
      application/
      domain/
      infrastructure/

    metadata/
      api/
      application/
      domain/
      infrastructure/

    permission/
      api/
      application/
      domain/
      infrastructure/

    release/
      api/
      application/
      domain/
      infrastructure/

    runtime/
      api/
      application/
      domain/
      infrastructure/

    record/
      api/
      application/
      domain/
      infrastructure/

    workflow/
      api/
      application/
      domain/
      infrastructure/

    file/
      api/
      application/
      domain/
      infrastructure/

    audit/
      api/
      application/
      domain/
      infrastructure/

    recycle/
      api/
      application/
      domain/
      infrastructure/

    diagnostics/
      api/
      application/
      domain/
      infrastructure/

  src/main/resources/
    application.yml
    application-local.yml
    db/migration/
    mapper/
```

每个业务模块内部建议结构：

```text
module/
  api/
    XxxController.java
    dto/
    vo/
  application/
    XxxApplicationService.java
    command/
    query/
  domain/
    XxxDomainService.java
    model/
    policy/
    validator/
  infrastructure/
    persistence/
      XxxEntity.java
      XxxRepository.java
      XxxMapper.java
    cache/
    adapter/
```

Codex 生成代码时不得把所有类放入 `common`，也不得把所有 Repository 放在同一个包中。

---

## 9. 命名规范

| 类型 | 命名 |
|---|---|
| Controller | `XxxController` |
| Application Service | `XxxApplicationService` |
| Domain Service | `XxxDomainService` |
| Repository | `XxxRepository` |
| Entity / PO | `XxxEntity` |
| Request DTO | `XxxRequest` / `XxxCommand` |
| Query DTO | `XxxQuery` |
| Response VO | `XxxVO` |
| Mapper | `XxxMapper` |
| Validator | `XxxValidator` |
| Policy | `XxxPolicy` |
| Facade | `XxxFacade` |
| Adapter | `XxxAdapter` |

字段命名：

```text
1. Java 使用 camelCase。
2. 数据库字段使用 snake_case。
3. API DTO 字段使用 camelCase。
4. DSL 字段使用 camelCase。
5. 表名保持 30 文档的 lc_ 前缀。
```

---

## 10. 请求处理主链路

所有 API 请求建议经过以下链路：

```text
1. Web Filter 生成 requestId / traceId。
2. 认证过滤器解析 token / session。
3. 构建 UserContext。
4. 构建 TenantContext。
5. Controller 参数校验。
6. Application Service 执行业务用例。
7. PermissionService 执行权限校验。
8. Domain Service 执行领域规则。
9. Repository 执行数据读写。
10. AuditService / SecurityEventService 记录事件。
11. 返回统一 ApiResponse。
12. 异常由 GlobalExceptionHandler 转换为统一错误响应。
```

请求上下文必须包含：

| 字段 | 说明 |
|---|---|
| requestId | 单次请求 ID。 |
| traceId | 链路追踪 ID。 |
| tenantId | 租户 ID，P0 默认 default。 |
| userId | 当前用户 ID。 |
| username | 当前登录名。 |
| clientIp | 客户端 IP。 |
| userAgent | 浏览器或客户端标识。 |

---

## 11. 统一响应与异常处理

后端必须遵守 `40-api-design.md` 的统一响应结构。

建议错误码分层：

| 前缀 | 类型 | 示例 |
|---|---|---|
| AUTH | 认证错误 | AUTH_INVALID_PASSWORD |
| PERM | 权限错误 | PERM_FIELD_DENIED |
| META | 元数据错误 | META_DEPENDENCY_BROKEN |
| RELEASE | 发布错误 | RELEASE_VALIDATION_FAILED |
| RUNTIME | 运行态错误 | RUNTIME_MODEL_NOT_FOUND |
| RECORD | 业务记录错误 | RECORD_VERSION_CONFLICT |
| WORKFLOW | 流程错误 | WORKFLOW_TASK_COMPLETED |
| FILE | 文件错误 | FILE_ACCESS_DENIED |
| IDEMPOTENCY | 幂等错误 | IDEMPOTENCY_KEY_CONFLICT |
| SYSTEM | 系统错误 | SYSTEM_INTERNAL_ERROR |

异常处理约束：

```text
1. 业务异常使用 BusinessException。
2. 权限异常使用 PermissionDeniedException。
3. 乐观锁异常使用 VersionConflictException。
4. 参数校验异常返回 VALIDATION_ERROR。
5. 未捕获异常统一记录 runtime_error_log，不向前端暴露 stack。
6. 安全相关拒绝需要写入 lc_security_event。
```

---

## 12. 认证与会话服务设计

### 12.1 服务职责

认证服务负责登录、登出、当前用户、密码校验、登录失败计数、账号锁定和认证上下文。

### 12.2 核心表

```text
lc_user
lc_user_auth
lc_security_event
lc_audit_log
```

### 12.3 API 映射

| API | Application Service |
|---|---|
| POST /api/v1/auth/login | AuthApplicationService.login |
| POST /api/v1/auth/logout | AuthApplicationService.logout |
| GET /api/v1/auth/me | AuthApplicationService.getCurrentUser |
| POST /api/v1/auth/change-password | AuthApplicationService.changePassword |

### 12.4 核心方法

```text
login(LoginCommand command): LoginResult
logout(CurrentUser user): void
getCurrentUser(CurrentUser user): CurrentUserVO
changePassword(ChangePasswordCommand command): void
verifyPassword(String rawPassword, String passwordHash): boolean
recordLoginFailure(String loginIdentifier, String reason): void
```

### 12.5 关键规则

```text
1. 密码不得明文存储，必须使用 PasswordEncoder。
2. 登录必须同时校验 lc_user.status、lc_user.login_enabled 和 lc_user_auth.status。
3. 登录失败、账号锁定、异常登录需要写入安全事件。
4. P0 可以使用 JWT 或服务端 session，但必须在 45 文档约束下统一实现。
5. token 中不得包含敏感业务数据。
6. 用户停用后，不删除认证记录，但不得登录。
```

### 12.6 Codex 生成约束

```text
1. 不得把 password_hash 放在 lc_user 对应实体里作为主要认证字段。
2. 不得返回 passwordHash、passwordSalt。
3. 不得在 Controller 中直接查询认证表。
4. 不得跳过安全事件记录。
```

---

## 13. 租户上下文服务设计

### 13.1 服务职责

P0 优先私有化单租户，但后端必须保留租户上下文，所有核心表读写默认带 `tenant_id`。

### 13.2 核心规则

```text
1. P0 初始化默认租户 default。
2. TenantContext 必须在请求开始阶段构建。
3. 无 tenantId 时使用默认租户，但代码结构不得写死到 SQL。
4. Repository 查询默认追加 tenant_id。
5. 缓存 key 必须包含 tenantId。
6. 审计日志、安全事件、运行错误日志必须记录 tenantId。
```

### 13.3 伪代码

```text
TenantContext:
  tenantId
  tenantKey
  source

TenantContextHolder:
  getTenantId()
  setTenantContext()
  clear()
```

### 13.4 禁止事项

```text
1. 禁止直接在业务代码中硬编码 tenant_id = 'default'。
2. 禁止核心业务查询缺少 tenant_id。
3. 禁止跨租户读取运行态模型、业务记录、文件绑定。
```

---

## 14. 权限服务总体设计

### 14.1 服务职责

权限服务是后端权限判断的统一入口，覆盖：

```text
1. 应用访问权限。
2. 菜单权限。
3. 对象操作权限。
4. 数据范围权限。
5. 字段可见、可编辑权限。
6. 流程任务处理权限。
7. 流程节点字段权限。
8. 文件下载和预览权限。
```

### 14.2 核心表

```text
lc_permission_policy
lc_permission_assignment
lc_permission_change_log
lc_permission_effective_cache
lc_app_member
lc_user_role
lc_user_org_unit
lc_metadata_snapshot
lc_business_record
lc_file_attachment
```

### 14.3 核心方法

```text
checkAppAccess(AppAccessCommand command): PermissionDecision
checkObjectAction(ObjectActionCommand command): PermissionDecision
buildDataScope(DataScopeCommand command): DataScopeCondition
computeFieldPermission(FieldPermissionCommand command): FieldPermissionResult
filterReadableFields(FieldFilterCommand command): Map<String, Object>
filterWritableFields(FieldFilterCommand command): Map<String, Object>
checkWorkflowTaskPermission(TaskPermissionCommand command): PermissionDecision
checkFileAccess(FileAccessCommand command): PermissionDecision
```

### 14.4 权限决策结构

```text
PermissionDecision:
  allowed: boolean
  reasonCode: string
  reasonMessage: string
  matchedPolicies: array
  riskLevel: low | medium | high
```

### 14.5 权限链路

运行态读取列表：

```text
1. 校验用户登录。
2. 读取 app_runtime_pointer 和 metadata_snapshot。
3. 校验应用访问权限。
4. 校验对象 read 权限。
5. 构造数据范围过滤条件。
6. 查询业务记录 ID。
7. 回表读取 data_json。
8. 执行字段可见裁剪。
9. 返回列表。
```

运行态提交表单：

```text
1. 校验用户登录。
2. 读取 app_runtime_pointer 和 metadata_snapshot。
3. 校验对象 create / update / submit 权限。
4. 校验字段可编辑权限。
5. 过滤不可写字段。
6. 后端重新执行必填、类型、唯一、子表和业务规则校验。
7. 保存业务记录。
```

文件下载：

```text
1. 查询 lc_file_object。
2. 查询 lc_file_attachment 权威绑定关系。
3. 根据 bind_type 判断业务场景。
4. 对 business_record 绑定执行记录读权限和字段权限。
5. 对 workflow_action 绑定执行任务或流程可见权限。
6. 权限通过后生成短期下载地址。
7. 写入 lc_file_access_log。
```

### 14.6 禁止事项

```text
1. 不得只在前端隐藏菜单或按钮。
2. 不得在 Controller 中手写零散权限判断。
3. 不得使用 lc_business_record_attachment 作为文件鉴权权威来源。
4. 不得返回未经过字段裁剪的 data_json。
```

---

## 15. 审计、安全事件与运行错误服务设计

### 15.1 服务职责

审计安全服务统一记录操作审计、安全事件和运行错误。

### 15.2 核心表

```text
lc_audit_log
lc_audit_log_detail
lc_security_event
lc_runtime_error_log
lc_file_access_log
lc_business_record_change_log
lc_permission_change_log
lc_publish_log
lc_rollback_log
```

### 15.3 审计事件分类

| 模块 | 事件 |
|---|---|
| app | create / update / delete / restore |
| metadata | create / update / delete / validate |
| permission | policy_create / policy_update / assignment_change |
| release | validate / publish / rollback / disable / enable |
| record | create / update / submit / delete / void |
| workflow | start / approve / reject / withdraw / transfer |
| file | upload / bind / preview / download / delete |
| security | login_failed / permission_denied / field_violation / file_denied |

### 15.4 核心方法

```text
writeAudit(AuditCommand command): void
writeAuditDetail(AuditDetailCommand command): void
writeSecurityEvent(SecurityEventCommand command): void
writeRuntimeError(RuntimeErrorCommand command): void
writeFileAccessLog(FileAccessCommand command): void
```

### 15.5 审计降级策略

```text
1. 对发布、回滚、审批、业务记录保存，审计建议纳入主事务。
2. 对普通读取不写审计，除非是附件下载或敏感数据导出。
3. 审计详情不得保存密码、Token、密钥等敏感明文。
4. 审计失败时是否中断主事务必须按事件等级配置；P0 对高风险写操作建议中断或明确记录补偿任务。
5. 运行错误日志可异步或降级写入，但不得影响核心事务回滚语义。
```

---

## 16. 幂等服务设计

### 16.1 服务职责

幂等服务用于防止表单提交、审批、发布、回滚、文件上传等高风险写接口因为重复点击、网络重试或客户端重放造成重复数据。

### 16.2 核心表

```text
lc_api_idempotency_key
```

### 16.3 核心方法

```text
begin(IdempotencyCommand command): IdempotencyDecision
markSuccess(String idempotencyKey, Object responseSummary): void
markFailed(String idempotencyKey, String errorCode, String errorMessage): void
getExistingResult(String idempotencyKey): Optional<IdempotencyResult>
cleanupExpired(): void
```

### 16.4 使用链路

```text
1. Controller 接收 Idempotency-Key Header。
2. Application Service 计算 request_hash。
3. IdempotencyService.begin 尝试创建 processing 记录。
4. 如果相同 key + 相同 hash 已成功，直接返回首次响应摘要。
5. 如果相同 key + 不同 hash，返回 IDEMPOTENCY_KEY_CONFLICT。
6. 业务事务成功后 markSuccess。
7. 业务事务失败后 markFailed 或允许重试。
```

### 16.5 P0 必须接入的操作

```text
1. record_create
2. record_submit
3. task_approve
4. task_reject
5. publish
6. rollback
7. file_upload
```

### 16.6 禁止事项

```text
1. 不得只靠前端禁用按钮实现幂等。
2. 不得忽略相同 key 不同 request_hash 的冲突。
3. 不得把完整敏感响应写入 response_json。
```

---

## 17. 事务边界总则

P0 后端事务边界统一放在 Application Service 层。

```text
1. Controller 不开启事务。
2. Repository 不开启跨用例事务。
3. Application Service 使用 @Transactional 编排完整用例。
4. Domain Service 不主动提交事务。
5. 外部文件存储和数据库之间无法强事务时，必须设计补偿或最终一致性清理。
6. 审计、安全事件、变更日志是否参与主事务必须在服务设计中明确。
```

关键事务：

| 事务 | Application Service |
|---|---|
| 发布 | ReleaseApplicationService.publish |
| 回滚 | ReleaseApplicationService.rollback |
| 业务记录保存 | RecordApplicationService.saveRecord |
| 业务记录提交 | RecordApplicationService.submitRecord |
| 流程审批 | WorkflowTaskApplicationService.approve / reject |
| 文件上传绑定 | FileApplicationService.uploadAndBind |
| 回收站恢复 | RecycleApplicationService.restore |
| 权限分配变更 | PermissionApplicationService.assignPolicy |

---

## 18. 缓存设计

### 18.1 缓存目标

P0 可使用 Redis 或本地缓存提升运行态模型、权限、字典、组织角色等读取性能，但缓存不是数据权威来源。

### 18.2 推荐缓存项

| 缓存 | Key 维度 | 失效条件 |
|---|---|---|
| RuntimeModel | tenantId + appId + snapshotId | 发布、回滚、应用停用、权限变化 |
| MetadataSnapshot | tenantId + appId + snapshotId | 快照归档、缓存过期 |
| PermissionResult | tenantId + appId + snapshotId + userId | 权限变更、角色变更、应用成员变更 |
| UserRoles | tenantId + userId | 用户角色变更 |
| OrgTree | tenantId | 组织变更 |
| LookupOptions | tenantId + appId + entityKey + fieldKey + keyword | 记录变更或短 TTL |
| FileAccessToken | tenantId + fileId + userId | 短 TTL 过期 |

### 18.3 缓存规则

```text
1. 缓存 key 必须包含 tenantId。
2. 运行态模型缓存必须包含 snapshotId。
3. 权限缓存必须包含 snapshotId 和 userId。
4. 缓存失效不得依赖前端刷新。
5. 缓存未命中必须可回源数据库。
6. 不得缓存未裁剪敏感字段给普通用户复用。
```

---

## 19. 数据访问与 Repository 设计

### 19.1 Repository 职责

Repository 只负责单表或明确聚合的数据读写，不承载业务流程编排。

### 19.2 查询约束

```text
1. 核心查询默认包含 tenant_id。
2. 可软删除表默认包含 is_deleted = false。
3. 运行态查询不得读取 lc_metadata_resource.draft_json。
4. 通用业务记录查询必须基于 lc_business_record 和 lc_business_record_index。
5. 文件绑定鉴权必须读取 lc_file_attachment。
6. 列表查询必须支持分页，不得一次拉全量记录。
```

### 19.3 Repository 示例

```text
AppRepository:
  findById(tenantId, appId)
  findByKey(tenantId, appKey)
  pageApps(query)
  save(entity)

MetadataResourceRepository:
  findDraftResources(tenantId, appId)
  findByResourceKey(tenantId, appId, resourceType, resourceKey)
  save(entity)

RuntimePointerRepository:
  findByAppIdForUpdate(tenantId, appId)
  findByAppId(tenantId, appId)

BusinessRecordRepository:
  findById(tenantId, appId, entityKey, recordId)
  pageByIds(tenantId, appId, entityKey, recordIds)
  save(entity)

BusinessRecordIndexRepository:
  rebuildIndexes(recordId, indexes)
  queryRecordIds(indexQuery)

FileAttachmentRepository:
  findActiveBindings(tenantId, fileId)
  findByBind(tenantId, bindType, bindId)
```

### 19.4 禁止事项

```text
1. 不得为 contract、expense_report、purchase_request 生成独立 Repository。
2. 不得在 Repository 中拼接权限策略。
3. 不得把业务事务拆散到多个 Controller 方法。
4. 不得使用 data_json LIKE 作为核心查询策略。
```

---

## 20. DTO、Command、Query、VO 与 Mapper 设计

### 20.1 类型分工

| 类型 | 用途 |
|---|---|
| Request DTO | Controller 入参，接收 HTTP 请求。 |
| Command | Application Service 写操作入参。 |
| Query | Application Service 查询入参。 |
| VO | Controller 出参。 |
| Entity | 数据库表映射。 |
| Domain Model | 领域逻辑模型。 |
| Mapper | 类型转换。 |

### 20.2 转换规则

```text
1. Request DTO 不直接传入 Repository。
2. Entity 不直接返回前端。
3. data_json 返回前必须经过字段权限裁剪。
4. Mapper 不得查询数据库。
5. Mapper 不得执行权限判断。
6. Mapper 不得吞掉版本字段，如 recordVersion / taskVersion。
```

### 20.3 版本字段

| 前端字段 | 后端字段 | 数据库字段 |
|---|---|---|
| recordVersion | version | lc_business_record.version |
| taskVersion | version | lc_workflow_task.version |
| appVersionId | app_version_id | 多表 |
| snapshotId | snapshot_id | 多表 |

---

## 21. 应用中心服务设计

### 21.1 服务职责

应用中心服务负责应用分类、应用基础信息、应用成员、应用状态和应用入口可见性。

### 21.2 核心表

```text
lc_app_category
lc_app
lc_app_member
lc_app_runtime_pointer
lc_audit_log
lc_recycle_item
```

### 21.3 API 映射

| API 域 | Application Service |
|---|---|
| 应用列表 | AppApplicationService.pageApps |
| 应用详情 | AppApplicationService.getAppDetail |
| 创建应用 | AppApplicationService.createApp |
| 更新应用 | AppApplicationService.updateApp |
| 删除应用 | AppApplicationService.deleteApp |
| 成员管理 | AppMemberApplicationService |
| 分类管理 | AppCategoryApplicationService |

### 21.4 核心方法

```text
createApp(CreateAppCommand command): AppVO
updateApp(UpdateAppCommand command): AppVO
deleteApp(DeleteAppCommand command): void
restoreApp(RestoreAppCommand command): void
pageApps(AppPageQuery query): PageResult<AppListVO>
getAppDetail(AppDetailQuery query): AppDetailVO
addAppMember(AddAppMemberCommand command): void
removeAppMember(RemoveAppMemberCommand command): void
```

### 21.5 关键规则

```text
1. app_key 租户内未删除记录唯一。
2. 创建应用后初始化设计态空元数据集合。
3. 删除应用采用软删除，并写入 lc_recycle_item。
4. 已发布或存在业务数据的应用不得物理删除。
5. 应用入口可见性可基于 app_member 初筛，但细粒度权限仍由 PermissionService 决定。
6. current_version_id / current_snapshot_id 只是冗余展示字段，运行态权威以 app_runtime_pointer 为准。
```

---

## 22. 模板服务设计

### 22.1 服务职责

模板服务负责 P0 三个样板应用模板的读取、预览和从模板创建应用。

### 22.2 核心表

```text
lc_app_template
lc_app
lc_metadata_resource
lc_permission_policy
lc_app_member
lc_audit_log
```

### 22.3 核心方法

```text
pageTemplates(TemplatePageQuery query): PageResult<AppTemplateVO>
getTemplateDetail(String templateId): AppTemplateDetailVO
createAppFromTemplate(CreateAppFromTemplateCommand command): AppVO
```

### 22.4 从模板创建应用流程

```text
1. 校验模板存在且 active。
2. 校验用户有创建应用权限。
3. 校验目标 app_key 未被占用。
4. 生成新的 app_id。
5. 复制 template_json 中的 app、entity、field、form、view、workflow、permission、menu。
6. 重写所有 resource_id、policy_id、dependency_id。
7. 插入 lc_app。
8. 插入 lc_metadata_resource。
9. 插入 lc_metadata_dependency。
10. 插入 lc_permission_policy / assignment。
11. 初始化 app_member。
12. 写审计日志。
```

### 22.5 禁止事项

```text
1. 创建出的应用不得复用模板 ID。
2. 模板不是运行态来源。
3. P0 不做模板市场、评分、计费、审核和下载统计。
```

---

## 23. 组织用户角色服务设计

### 23.1 服务职责

组织用户角色服务负责组织树、用户、认证关联、角色、用户部门、用户角色。

### 23.2 核心表

```text
lc_org_unit
lc_user
lc_user_auth
lc_role
lc_user_org_unit
lc_user_role
lc_audit_log
lc_security_event
```

### 23.3 核心方法

```text
createOrgUnit(CreateOrgUnitCommand command): OrgUnitVO
updateOrgUnit(UpdateOrgUnitCommand command): OrgUnitVO
moveOrgUnit(MoveOrgUnitCommand command): void
createUser(CreateUserCommand command): UserVO
updateUser(UpdateUserCommand command): UserVO
disableUser(DisableUserCommand command): void
createRole(CreateRoleCommand command): RoleVO
assignUserRole(AssignUserRoleCommand command): void
assignUserOrgUnit(AssignUserOrgCommand command): void
```

### 23.4 关键规则

```text
1. org_path 用于部门及下级数据范围计算。
2. 禁止组织树形成环。
3. 用户停用后不得登录，但历史业务数据、流程和审计保留用户 ID。
4. 用户角色变化后必须失效权限缓存。
5. 用户主部门变化会影响后续记录 created_dept_id，不回写历史记录。
6. 删除用户、部门、角色前需要影响分析。
```

---

## 24. 元数据服务设计

### 24.1 服务职责

元数据服务负责设计态资源的创建、编辑、读取、删除、版本草稿和依赖维护。

### 24.2 资源类型

```text
app
entity
field
form
view
workflowDef
permissionPolicy
menu
dictionary
```

### 24.3 核心表

```text
lc_metadata_resource
lc_metadata_resource_version
lc_metadata_dependency
lc_permission_policy
lc_permission_assignment
lc_audit_log
```

### 24.4 核心方法

```text
createResource(CreateMetadataResourceCommand command): MetadataResourceVO
updateDraft(UpdateMetadataDraftCommand command): MetadataResourceVO
getResource(ResourceQuery query): MetadataResourceVO
listResources(ResourceListQuery query): List<MetadataResourceVO>
deleteResource(DeleteResourceCommand command): void
validateResource(ValidateResourceCommand command): ValidationResult
rebuildDependencies(RebuildDependencyCommand command): void
analyzeDeleteImpact(DeleteImpactQuery query): DeleteImpactResult
```

### 24.5 关键规则

```text
1. 设计态保存只写 draft_json。
2. 运行态不得读取 draft_json。
3. resource_key 创建后原则上不可修改。
4. 删除字段、对象、表单、流程前必须做依赖影响分析。
5. DSL 保存时执行结构基础校验，但允许不完整草稿。
6. 发布前执行严格校验。
7. 元数据变更必须记录审计。
```

---

## 25. 数据建模服务设计

### 25.1 服务职责

数据建模服务是元数据服务的领域子服务，负责 entity、field、lookup、subtable、唯一字段、索引字段、自动编号字段等建模规则。

### 25.2 核心方法

```text
createEntity(CreateEntityCommand command): EntityVO
updateEntity(UpdateEntityCommand command): EntityVO
createField(CreateFieldCommand command): FieldVO
updateField(UpdateFieldCommand command): FieldVO
deleteField(DeleteFieldCommand command): void
reorderFields(ReorderFieldsCommand command): void
validateEntityModel(EntityModelValidationCommand command): ValidationResult
```

### 25.3 关键规则

```text
1. P0 不根据 entity 创建物理表。
2. 字段定义进入 lc_metadata_resource。
3. searchable、filterable、sortable、permissionRelevant 字段发布后需要进入索引策略。
4. unique 字段发布后必须由 UniqueValueService 支撑并发唯一。
5. autoNumber 字段必须由 SequenceService 后端生成。
6. subtable P0 默认进入 data_json，不单独建子表。
7. lookup 字段必须维护业务记录关系。
```

---

## 26. 表单、视图与菜单服务设计

### 26.1 服务职责

表单、视图与菜单服务负责设计态 form、view、menu DSL 的保存、预览、校验和依赖维护。

### 26.2 核心方法

```text
saveFormDraft(SaveFormCommand command): FormVO
previewForm(PreviewFormQuery query): FormPreviewVO
validateForm(ValidateFormCommand command): ValidationResult
saveViewDraft(SaveViewCommand command): ViewVO
validateView(ValidateViewCommand command): ValidationResult
saveMenuDraft(SaveMenuCommand command): MenuVO
validateMenu(ValidateMenuCommand command): ValidationResult
```

### 26.3 关键规则

```text
1. 表单字段必须引用已存在 entity/field。
2. 视图列、筛选、排序必须引用已存在字段。
3. 菜单目标必须引用已存在 view、form、page 或运行态入口。
4. 表单设计器保存的是设计态草稿，不影响当前运行态。
5. 表单预览可以读取草稿，但必须明确为设计态预览接口。
6. 发布后运行态表单来自 metadata_snapshot。
```

---

## 27. 权限设计服务设计

### 27.1 服务职责

权限设计服务负责权限策略 DSL、权限分配、权限变更日志和有效权限预览。

### 27.2 核心方法

```text
createPolicy(CreatePermissionPolicyCommand command): PermissionPolicyVO
updatePolicy(UpdatePermissionPolicyCommand command): PermissionPolicyVO
deletePolicy(DeletePermissionPolicyCommand command): void
assignPolicy(AssignPermissionCommand command): void
removeAssignment(RemoveAssignmentCommand command): void
previewEffectivePermission(EffectivePermissionPreviewQuery query): EffectivePermissionVO
```

### 27.3 关键规则

```text
1. 权限策略变更必须写 lc_permission_change_log。
2. 权限策略变更必须失效权限缓存。
3. deny 优先于 allow。
4. 字段权限、数据范围权限和流程节点字段权限必须能进入发布快照。
5. 权限预览只用于设计态辅助，不替代运行态真实鉴权。
```

---

## 28. 发布与版本服务设计

### 28.1 服务职责

发布服务负责发布校验、资源版本生成、快照构建、运行指针切换、发布日志和回滚。

### 28.2 核心表

```text
lc_metadata_resource
lc_metadata_resource_version
lc_metadata_dependency
lc_app_version
lc_metadata_snapshot
lc_app_runtime_pointer
lc_publish_log
lc_rollback_log
lc_audit_log
```

### 28.3 核心方法

```text
validatePublish(PublishValidationCommand command): PublishValidationResult
publish(PublishCommand command): PublishResult
rollback(RollbackCommand command): RollbackResult
getVersionList(AppVersionQuery query): PageResult<AppVersionVO>
getSnapshot(SnapshotQuery query): MetadataSnapshotVO
disableRuntime(DisableRuntimeCommand command): void
enableRuntime(EnableRuntimeCommand command): void
```

### 28.4 发布事务

```text
1. 校验发布权限。
2. 获取应用发布锁。
3. 读取设计态 metadata_resource。
4. 执行 DSL schema 校验。
5. 执行依赖完整性校验。
6. 执行权限默认策略校验。
7. 执行流程定义校验。
8. 生成 appVersionId 和 snapshotId。
9. 写 metadata_resource_version。
10. 构建 metadata_snapshot.snapshot_json。
11. 插入 lc_metadata_snapshot。
12. 插入 lc_app_version。
13. 写 lc_publish_log success。
14. 切换 lc_app_runtime_pointer。
15. 更新 lc_app 冗余字段。
16. 写审计日志。
17. 提交事务。
18. 事务后失效 runtime model 和 permission cache。
```

### 28.5 发布失败规则

```text
1. 发布失败不得切换 app_runtime_pointer。
2. 发布失败必须写 lc_publish_log failed。
3. 通常不生成可运行 app_version。
4. 如实现上保留 failed app_version，则不得关联 active snapshot，不得被 runtime_pointer 引用。
```

### 28.6 回滚事务

```text
1. 校验回滚权限。
2. 校验目标 app_version 和 metadata_snapshot 可用。
3. 锁定 app_runtime_pointer。
4. 写 rollback_log running。
5. 切换 current_version_id 和 current_snapshot_id。
6. 更新 app_version.is_current 冗余状态。
7. 更新 lc_app 冗余字段。
8. 写 rollback_log success。
9. 写审计日志。
10. 提交事务。
11. 事务后失效 runtime model 和 permission cache。
```

### 28.7 禁止事项

```text
1. 不得原地修改已发布 metadata_snapshot.snapshot_json。
2. 不得让运行态读取发布中的半成品快照。
3. 不得回滚时批量改写历史业务记录。
4. 不得让已启动流程切换到新 snapshot。
```

---

## 29. 运行态模型服务设计

### 29.1 服务职责

运行态模型服务负责从运行指针加载快照，构建前端 RuntimeModel，并根据当前用户权限做服务端侧可见模型裁剪。

### 29.2 核心表

```text
lc_app_runtime_pointer
lc_metadata_snapshot
lc_app_version
lc_permission_policy
lc_permission_assignment
lc_permission_effective_cache
```

### 29.3 核心方法

```text
getRuntimeModel(RuntimeModelQuery query): RuntimeModelVO
getRuntimeModelBySnapshot(RuntimeSnapshotQuery query): RuntimeModelVO
buildRuntimeModel(BuildRuntimeModelCommand command): RuntimeModel
applyPermissionToRuntimeModel(RuntimeModel model, CurrentUser user): RuntimeModel
evictRuntimeModelCache(AppRuntimeCacheCommand command): void
```

### 29.4 RuntimeModel 构建规则

```text
1. 运行态入口先读取 lc_app_runtime_pointer。
2. 根据 current_snapshot_id 读取 lc_metadata_snapshot。
3. 校验 app.runtime_status 和 pointer_status。
4. 解析 snapshot_json。
5. 读取或计算当前用户有效权限。
6. 裁剪菜单、视图、动作、字段表现。
7. 返回 RuntimeModel。
```

### 29.5 缓存规则

```text
cache key = tenantId + appId + snapshotId + userId + permissionHash
```

失效条件：

```text
1. 发布成功。
2. 回滚成功。
3. 应用停用或启用。
4. 权限策略变化。
5. 权限分配变化。
6. 用户角色变化。
7. 应用成员变化。
```

### 29.6 禁止事项

```text
1. 不得读取 lc_metadata_resource.draft_json。
2. 不得返回未授权菜单和动作。
3. 不得把后端完整权限策略原样暴露给普通用户。
4. 不得省略 snapshotId 和 appVersionId。
```

---

## 30. 通用业务数据服务设计

### 30.1 服务职责

通用业务数据服务负责低代码对象记录的列表、详情、创建、编辑、草稿、提交、删除、作废和导出预留。

### 30.2 核心表

```text
lc_business_record
lc_business_record_index
lc_business_record_relation
lc_business_record_change_log
lc_business_unique_value
lc_sequence_counter
lc_file_attachment
lc_workflow_instance
lc_workflow_task
lc_audit_log
```

### 30.3 核心方法

```text
pageRecords(RecordPageQuery query): PageResult<RecordListVO>
getRecordDetail(RecordDetailQuery query): RecordDetailVO
createRecord(CreateRecordCommand command): RecordDetailVO
updateRecord(UpdateRecordCommand command): RecordDetailVO
saveDraft(SaveDraftCommand command): RecordDetailVO
submitRecord(SubmitRecordCommand command): SubmitRecordResult
deleteRecord(DeleteRecordCommand command): void
voidRecord(VoidRecordCommand command): void
```

### 30.4 创建 / 更新事务

```text
1. 读取 app_runtime_pointer。
2. 读取 metadata_snapshot。
3. 校验应用访问和对象操作权限。
4. 计算字段权限。
5. 过滤不可写字段。
6. 执行字段类型、必填、格式、范围校验。
7. 执行 subtable 行级和表级校验。
8. 执行唯一字段占用。
9. 执行自动编号生成。
10. 写 lc_business_record。
11. 重建 lc_business_record_index。
12. 维护 lc_business_record_relation。
13. 维护 lc_file_attachment 绑定。
14. 写 lc_business_record_change_log。
15. 写 lc_audit_log。
16. 如触发流程，创建 workflow_instance 和首批 workflow_task。
17. 提交事务。
```

### 30.5 列表查询流程

```text
1. 读取运行态模型。
2. 校验对象 read 权限。
3. 构造数据范围查询条件。
4. 使用 business_record 基础条件过滤 tenant_id/app_id/entity_key/is_deleted。
5. 条件字段走 business_record_index。
6. 查询 record_id 分页。
7. 回表读取 data_json。
8. 字段权限裁剪。
9. 返回列表。
```

### 30.6 乐观锁

```text
1. 更新记录必须携带 recordVersion。
2. recordVersion 对应 lc_business_record.version。
3. 版本不一致返回 RECORD_VERSION_CONFLICT。
4. 前端收到冲突后刷新记录或提示用户处理。
```

### 30.7 禁止事项

```text
1. 不得为具体业务对象创建专用表。
2. 不得保存用户无权编辑字段。
3. 不得返回用户无权查看字段。
4. 不得跳过索引表同步。
5. 不得跳过业务变更日志和审计。
```

---

## 31. 自动编号服务设计

### 31.1 服务职责

自动编号服务负责根据运行态快照中的编号规则生成最终业务编号。

### 31.2 核心表

```text
lc_sequence_counter
lc_business_record
```

### 31.3 核心方法

```text
generateNumber(GenerateNumberCommand command): GeneratedNumber
previewNumberRule(NumberPreviewQuery query): NumberRulePreview
```

### 31.4 生成规则

```text
1. 编号规则来自当前 snapshot。
2. 前端只可预览，不得生成最终编号。
3. 计数维度为 tenant_id + app_id + entity_key + field_key + sequence_scope + sequence_key。
4. 并发下使用数据库行锁或乐观锁重试。
5. 业务记录保存失败允许跳号，不允许重复。
6. 编号写入 data_json、record_no 和 business_unique_value 时必须一致。
```

---

## 32. 唯一字段服务设计

### 32.1 服务职责

唯一字段服务负责低代码 unique 字段的并发安全占用、释放和恢复校验。

### 32.2 核心表

```text
lc_business_unique_value
lc_business_record_index
lc_business_record
```

### 32.3 核心方法

```text
reserveUniqueValues(ReserveUniqueCommand command): void
releaseUniqueValues(ReleaseUniqueCommand command): void
validateUniqueValues(ValidateUniqueQuery query): ValidationResult
rebuildUniqueValues(RebuildUniqueCommand command): void
```

### 32.4 规则

```text
1. 友好提示可先查 index。
2. 最终唯一性以 business_unique_value 的 active 唯一约束为准。
3. 新增记录先占用新值。
4. 更新唯一字段时释放旧值并占用新值。
5. 删除或作废是否释放由字段 DSL 的 release_policy 决定。
6. 默认历史编号不复用。
```

---

## 33. 流程运行服务设计

### 33.1 服务职责

流程运行服务负责流程实例、任务、审批动作、流程轨迹和业务状态回写。

### 33.2 核心表

```text
lc_workflow_runtime_binding
lc_workflow_instance
lc_workflow_task
lc_workflow_task_action
lc_workflow_trace
lc_business_record
lc_audit_log
```

### 33.3 核心方法

```text
startWorkflow(StartWorkflowCommand command): WorkflowInstanceVO
pageTodoTasks(TaskPageQuery query): PageResult<TaskListVO>
pageDoneTasks(TaskPageQuery query): PageResult<TaskListVO>
getTaskDetail(TaskDetailQuery query): TaskDetailVO
approveTask(ApproveTaskCommand command): TaskActionResult
rejectTask(RejectTaskCommand command): TaskActionResult
withdraw(WithdrawWorkflowCommand command): void
voidWorkflow(VoidWorkflowCommand command): void
```

### 33.4 审批事务

```text
1. 校验幂等键。
2. 锁定 workflow_task。
3. 校验 taskVersion。
4. 校验任务状态 pending / claimed。
5. 校验当前用户是处理人或合法候选人。
6. 读取 workflow_instance.snapshot_id 对应快照。
7. 校验节点字段权限。
8. 过滤节点不可写字段。
9. 写 workflow_task_action。
10. 更新 workflow_task 状态。
11. 推进 workflow_instance 当前节点和状态。
12. 必要时更新 business_record.business_status / workflow_status / data_json。
13. 创建下一批 workflow_task。
14. 写 workflow_trace。
15. 写 audit_log。
16. 提交事务。
```

### 33.5 快照规则

```text
1. 流程实例创建后 app_version_id 和 snapshot_id 不得修改。
2. 流程运行必须读取实例绑定的 snapshot。
3. 新发布不影响已启动流程。
4. 回滚不影响已启动流程。
```

### 33.6 禁止事项

```text
1. 不得审批已完成任务。
2. 不得跳过 taskVersion。
3. 不得从最新草稿流程定义推进历史实例。
4. 不得在前端决定下一节点。
```

---

## 34. 文件服务设计

### 34.1 服务职责

文件服务负责文件上传、文件对象、绑定关系、预览、下载、删除、恢复和访问日志。

### 34.2 核心表

```text
lc_file_object
lc_file_attachment
lc_file_access_log
lc_business_record
lc_workflow_task_action
lc_audit_log
lc_security_event
```

### 34.3 核心方法

```text
upload(FileUploadCommand command): FileObjectVO
bindFile(FileBindCommand command): FileAttachmentVO
unbindFile(FileUnbindCommand command): void
getPreviewUrl(FileAccessCommand command): FileAccessVO
getDownloadUrl(FileAccessCommand command): FileAccessVO
deleteFile(DeleteFileCommand command): void
restoreFile(RestoreFileCommand command): void
```

### 34.4 上传与绑定规则

```text
1. 上传先写 file_object，状态 active 或 pending。
2. 绑定业务记录、流程意见、头像或元数据时写 file_attachment。
3. lc_file_attachment 是权威绑定关系。
4. lc_business_record_attachment 如启用，只能作为查询冗余。
5. 文件存储路径不得作为永久公开 URL 返回。
6. 下载和预览必须走后端鉴权。
```

### 34.5 文件访问鉴权

```text
1. 校验用户登录。
2. 查询 file_object。
3. 查询 file_attachment active 绑定。
4. 根据 bind_type 进入对应权限校验。
5. 权限通过后生成短期 URL 或流式返回。
6. 写 file_access_log success。
7. 权限拒绝写 file_access_log denied 和 security_event。
```

### 34.6 存储适配

```text
FileStorageAdapter:
  putObject()
  getObject()
  deleteObject()
  generatePresignedUrl()
```

P0 支持：

```text
1. local
2. s3_compatible
```

---

## 35. 回收站服务设计

### 35.1 服务职责

回收站服务负责软删除资源的统一索引、列表、恢复、彻底删除预留和恢复冲突校验。

### 35.2 核心表

```text
lc_recycle_item
lc_app
lc_metadata_resource
lc_business_record
lc_file_object
lc_file_attachment
lc_audit_log
```

### 35.3 核心方法

```text
pageRecycleItems(RecyclePageQuery query): PageResult<RecycleItemVO>
restore(RestoreCommand command): RestoreResult
purge(PurgeCommand command): PurgeResult
markDeleted(RecycleMarkCommand command): void
```

### 35.4 恢复冲突校验

恢复前必须校验：

```text
1. 原始资源仍存在且处于 deleted / is_deleted 状态。
2. active 唯一编码未被新资源占用。
3. 元数据依赖仍完整。
4. 文件对象和绑定关系仍存在。
5. 应用恢复时 runtime_pointer、snapshot 和 app_version 关系完整。
6. 业务记录恢复时 entity_key 仍在当前或历史快照中可解释。
7. 如出现冲突，restore_status 进入 blocked 或要求重命名恢复。
```

### 35.5 禁止事项

```text
1. 不得通过扫描所有业务表生成回收站列表。
2. 不得物理删除已产生历史流程、附件或审计的核心资源。
3. 不得恢复到破坏唯一约束的状态。
```

---

## 36. 诊断与一致性巡检服务设计

### 36.1 服务职责

诊断服务用于后台检查核心数据一致性，辅助开发、运维和验收。

### 36.2 巡检项

```text
1. app_runtime_pointer 指向的 app_version 和 metadata_snapshot 是否存在。
2. metadata_snapshot.app_version_id 与 app_version.metadata_snapshot_id 是否一致。
3. business_record.snapshot_id 是否存在。
4. workflow_instance.snapshot_id 是否存在。
5. workflow_task.workflow_instance_id 是否存在。
6. file_attachment.file_id 是否存在。
7. metadata_dependency 是否存在 broken 依赖。
8. business_record_index 是否与 business_record.data_json 一致。
9. business_unique_value 是否与 business_record 当前值一致。
10. recycle_item 是否指向真实软删除资源。
```

### 36.3 核心方法

```text
runCheck(DiagnosticsCommand command): DiagnosticsReport
checkRuntimePointer(AppDiagnosticsQuery query): CheckResult
checkRecordIndex(RecordIndexCheckQuery query): CheckResult
checkFileBinding(FileBindingCheckQuery query): CheckResult
checkMetadataDependency(MetadataDependencyCheckQuery query): CheckResult
```

### 36.4 P0 规则

```text
1. P0 可先做只读诊断，不做自动修复。
2. 自动修复必须单独权限控制。
3. 诊断接口只对平台管理员开放。
```

---

## 37. DSL 校验与运行解释服务设计

### 37.1 服务职责

DSL 校验与解释服务负责校验元数据 DSL、构建发布快照和运行态解释。

### 37.2 核心能力

```text
1. Schema 校验。
2. resourceType 校验。
3. resourceKey 命名校验。
4. 依赖引用校验。
5. 字段类型校验。
6. 表单字段引用校验。
7. 视图筛选排序字段校验。
8. 流程节点、条件、处理人规则校验。
9. 权限策略引用校验。
10. 快照构建和 hash 计算。
```

### 37.3 核心方法

```text
validateDsl(DslValidationCommand command): ValidationResult
validateAppForPublish(AppPublishValidationCommand command): PublishValidationResult
buildSnapshot(SnapshotBuildCommand command): MetadataSnapshot
parseRuntimeModel(MetadataSnapshot snapshot): RuntimeModel
```

### 37.4 禁止事项

```text
1. 不得执行用户 DSL 中的任意代码。
2. 不得允许 DSL 直接拼接 SQL。
3. 不得把草稿 DSL 作为运行态模型返回。
4. 不得忽略 schema_version。
```

---

## 38. 查询、过滤与排序服务设计

### 38.1 服务职责

查询服务负责把运行态视图、筛选条件、数据权限和用户查询参数转换为安全的数据库查询。

### 38.2 输入来源

```text
1. view DSL 默认筛选。
2. 用户列表筛选。
3. 用户关键字搜索。
4. 数据权限条件。
5. 排序字段。
6. 分页参数。
```

### 38.3 构造流程

```text
1. 校验 entity_key。
2. 校验字段是否允许 filterable / sortable / searchable。
3. 合并数据权限条件。
4. 将字段条件映射到 business_record_index。
5. 将固定字段条件映射到 business_record。
6. 禁止前端传入任意 SQL。
7. 生成安全查询对象。
```

### 38.4 禁止事项

```text
1. 不得信任前端直接传入字段路径。
2. 不得把 filter expression 原样拼接 SQL。
3. 不得让用户绕过数据权限查询全部数据。
```

---

## 39. 安全设计

### 39.1 后端安全边界

```text
1. 认证是所有非公开 API 的前置条件。
2. 权限服务是业务访问的后端权威。
3. 字段权限必须在入参和出参两侧执行。
4. 文件访问必须通过绑定关系鉴权。
5. 所有核心查询包含 tenant_id。
6. 敏感日志脱敏。
7. 防止 DSL 注入、SQL 注入、路径穿越和未授权下载。
```

### 39.2 输入校验

```text
1. 所有 Request DTO 使用 Bean Validation。
2. 所有 DSL 使用 DSL Validator。
3. 所有动态筛选使用白名单字段。
4. 文件名、扩展名、MIME、大小需要校验。
5. JSON 字段需要大小限制。
```

### 39.3 输出脱敏

```text
1. passwordHash / passwordSalt 永不输出。
2. token / secret 永不写入审计详情。
3. 无权字段从 data_json 中移除。
4. 安全事件不泄露完整无权字段值。
```

---

## 40. 模块 API 到服务映射

| API 域 | Controller | Application Service | 主要依赖 |
|---|---|---|---|
| 认证 | AuthController | AuthApplicationService | UserAuthRepository, SecurityEventService |
| 应用中心 | AppController | AppApplicationService | AppRepository, PermissionService, AuditService |
| 模板 | AppTemplateController | TemplateApplicationService | TemplateRepository, MetadataService |
| 组织用户角色 | OrgController / UserController / RoleController | OrgApplicationService / UserApplicationService / RoleApplicationService | OrgRepository, UserRepository, RoleRepository |
| 元数据 | MetadataController | MetadataApplicationService | MetadataRepository, DslValidator |
| 数据建模 | ModelController | DataModelApplicationService | MetadataService |
| 表单视图菜单 | FormController / ViewController / MenuController | FormViewApplicationService | MetadataService |
| 权限 | PermissionController | PermissionApplicationService | PermissionRepository, PermissionChangeLogRepository |
| 发布回滚 | ReleaseController | ReleaseApplicationService | MetadataService, SnapshotBuilder, RuntimePointerRepository |
| 运行态模型 | RuntimeModelController | RuntimeModelApplicationService | RuntimeModelService, PermissionService |
| 业务记录 | RuntimeRecordController | RecordApplicationService | RecordRepository, RecordIndexService, WorkflowService |
| 流程任务 | WorkflowTaskController | WorkflowTaskApplicationService | WorkflowRepository, PermissionService |
| 文件 | FileController | FileApplicationService | FileRepository, FileStorageAdapter, PermissionService |
| 回收站 | RecycleController | RecycleApplicationService | RecycleRepository, AuditService |
| 审计安全 | AuditController | AuditApplicationService | AuditRepository, SecurityEventRepository |
| 诊断 | DiagnosticsController | DiagnosticsApplicationService | 多模块 Repository |

---

## 41. 样板应用后端覆盖

### 41.1 合同管理

后端必须支持：

```text
1. contract 元数据设计和发布。
2. 合同编号由 SequenceService 生成。
3. 合同编号唯一由 UniqueValueService 保证。
4. 合同金额、状态、相对方进入 business_record_index。
5. 相对方 lookup 进入 business_record_relation。
6. 合同附件进入 file_object + file_attachment。
7. 审批流程进入 workflow_instance / task / action / trace。
8. 法务意见字段按节点字段权限控制。
```

### 41.2 费用报销

后端必须支持：

```text
1. expense_report 元数据设计和发布。
2. 报销单号自动编号。
3. 报销明细 subtable 存入 data_json。
4. 报销金额、费用类型、部门、状态进入索引。
5. 发票附件按字段绑定。
6. 直属上级和财务审批。
7. 财务角色可看全部，本人只看本人数据。
```

### 41.3 采购申请

后端必须支持：

```text
1. purchase_request 和 supplier 元数据。
2. 采购申请编号自动生成。
3. supplier lookup 关系维护。
4. 采购金额、采购部门、供应商、状态进入索引。
5. 部门负责人、采购、财务审批。
6. 采购和财务角色不同数据权限。
```

---

## 42. 后端测试输入

本文档为后续测试计划提供以下测试输入：

| 测试类型 | 关键场景 |
|---|---|
| 单元测试 | DSL 校验、字段权限、数据权限、编号生成、唯一占用、流程推进。 |
| Repository 测试 | tenant_id 过滤、软删除过滤、索引表查询、乐观锁。 |
| API 集成测试 | 登录、应用创建、发布、运行态保存、审批、附件下载。 |
| 事务测试 | 发布失败不切指针、记录保存失败回滚索引、审批冲突回滚。 |
| 权限测试 | 字段越权提交、无权限列表、无权限附件下载。 |
| 幂等测试 | 相同 key 返回首次结果，不同 hash 返回冲突。 |
| 回滚测试 | 只切 pointer，不改历史 snapshot 和业务记录。 |
| 巡检测试 | 构造断裂依赖、缺失索引和失效附件绑定。 |

---

## 43. 给 Codex 生成后端代码的强约束

### 43.1 工程约束

```text
1. 必须使用 Java + Spring Boot + Maven。
2. 必须遵守 45 文档的 Monorepo 和后端目录结构。
3. 不得改用 Node.js、Python、Go 或其他后端框架。
4. 不得引入微服务拆分。
5. 不得跳过 Flyway migration 方案。
```

### 43.2 分层约束

```text
1. Controller 不写业务规则。
2. Application Service 负责事务和用例编排。
3. Domain Service 负责领域规则。
4. Repository 只负责数据访问。
5. Mapper 不做权限判断。
6. PermissionService 是后端权限统一入口。
7. AuditService 是审计统一入口。
```

### 43.3 数据约束

```text
1. 不得为业务对象生成独立物理表。
2. 不得为 contract / expense_report / purchase_request 生成专用 Repository。
3. 运行态 API 不得读取 metadata_resource.draft_json。
4. 业务记录必须写 app_version_id 和 snapshot_id。
5. 写业务记录必须同步 index、relation、attachment、change_log。
6. 文件鉴权必须以 file_attachment 为权威来源。
7. 所有核心查询必须包含 tenant_id。
8. 软删除表查询默认包含 is_deleted = false。
```

### 43.4 权限与安全约束

```text
1. 字段权限必须同时约束入参和出参。
2. 数据权限必须在查询阶段生效。
3. 附件下载必须后端鉴权。
4. 越权提交必须写 security_event。
5. 不得返回 passwordHash、passwordSalt、token secret。
6. 不得执行用户 DSL 中的任意代码。
```

### 43.5 事务约束

```text
1. 发布、回滚、业务记录保存、业务记录提交、审批必须有事务。
2. 审批必须校验 taskVersion。
3. 编辑记录必须校验 recordVersion。
4. 发布失败不得切换 runtime pointer。
5. 回滚不得修改历史 snapshot。
6. 新发布不得影响已启动流程实例。
```

---

## 44. 后端服务 Definition of Done

`50-backend-service-design.md` 对应的后端代码生成完成定义如下：

```text
1. Spring Boot 工程可启动。
2. 后端目录按 app/auth/org/metadata/permission/release/runtime/record/workflow/file/audit/recycle/diagnostics 分包。
3. 每个 P0 模块至少具备 Controller、ApplicationService、Repository 骨架。
4. 认证登录、当前用户、登出接口可用。
5. 应用中心、模板、组织用户角色 API 有基础实现或 Mock 实现。
6. 元数据设计 API 可以保存和读取 draft_json。
7. 发布 API 可以执行校验、生成 snapshot、切换 runtime pointer。
8. 运行态模型 API 只读取 snapshot。
9. 业务记录 API 可以创建、更新、查询、列表和提交。
10. 业务记录保存同步维护 index、change_log，relation/attachment 至少有接口边界。
11. 自动编号和唯一字段服务有可测试实现。
12. 流程待办、审批、驳回 API 有基础实现。
13. 文件上传、绑定、预览、下载 API 经过权限服务。
14. 审计日志、安全事件、运行错误日志有统一写入服务。
15. 幂等服务支持核心写接口。
16. 全局异常处理返回统一错误结构。
17. 权限拒绝、字段越权、文件拒绝可记录安全事件。
18. Flyway migration 与 30 数据库设计一致。
19. 单元测试覆盖核心领域服务。
20. API 集成测试覆盖登录、发布、业务记录、审批、附件下载主链路。
```

---

## 45. P0 后端服务红线

```text
1. 不得让运行态读取设计态草稿元数据。
2. 不得把权限只做在前端。
3. 不得为每个业务对象动态建表。
4. 不得绕过 lc_app_runtime_pointer。
5. 不得修改已发布 metadata_snapshot。
6. 不得跳过 tenant_id 查询条件。
7. 不得保存用户无权编辑字段。
8. 不得返回用户无权查看字段。
9. 不得让附件下载绕过 lc_file_attachment。
10. 不得审批无权任务或已完成任务。
11. 不得在流程实例中丢失 app_version_id / snapshot_id。
12. 不得在并发唯一字段场景只靠先查后写。
13. 不得把密码字段放入 lc_user 作为认证主表。
14. 不得把所有业务逻辑写入一个巨大 Service。
15. 不得让 Codex 自行更换技术栈或工程目录。
```

---

## 46. 后续文档衔接

本文档完成后，建议继续产出：

```text
1. 70-development-task-breakdown.md
2. 80-test-and-acceptance-plan.md
3. 99-codex-execution-guide.md
4. CODEX.md
5. 40A-openapi-spec.yaml
```

其中 `70-development-task-breakdown.md` 应把本文的服务模块拆成 Codex 可执行任务，包含输入文档、目标、涉及目录、产出文件、禁止事项和验收标准。

---
