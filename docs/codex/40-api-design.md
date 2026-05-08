---
title: 核心 API 设计
subtitle: 企业级低代码平台 v1.0｜P0 核心 API 设计基线版
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
  - 90-metadata-dsl-guideline.md
  - 02-P0-app-center.md
  - 03-P0-org-user-role.md
  - 04-P0-data-modeling.md
  - 05-P0-form-designer.md
  - 07-P0-workflow-engine.md
  - 08-P0-permission-system.md
  - 09-P0-release-runtime.md
---

# 40-api-design.md

版本：v1.0  
适用范围：低代码平台 P0 API 设计、OpenAPI 生成、Controller / Service 接口生成、DTO 生成、前后端联调、接口测试用例生成  
最后更新：2026-05-06  
状态：基线版

---

## 0. 文档定位

本文档定义低代码平台 P0 阶段的核心 API 设计，承接：

```text
20-system-architecture-design.md
30-core-database-design.md
90-metadata-dsl-guideline.md
02-P0-app-center.md
03-P0-org-user-role.md
04-P0-data-modeling.md
05-P0-form-designer.md
07-P0-workflow-engine.md
08-P0-permission-system.md
09-P0-release-runtime.md
```

本文档用于指导：

```text
1. API 路由和资源命名。
2. RESTful 接口设计。
3. 请求 DTO 和响应 DTO 设计。
4. Controller / Service / Repository 代码生成。
5. 权限校验、中间件和审计策略实现。
6. OpenAPI / Swagger 文档生成。
7. 前端设计态、运行态与管理后台联调。
8. 自动化接口测试和端到端测试用例生成。
```

本文档不是完整代码实现，也不是最终 OpenAPI YAML。后续可以基于本文生成：

```text
1. 40A-openapi-spec.yaml
2. 50-backend-service-design.md
3. Controller 接口骨架
4. Service 接口骨架
5. DTO / VO / Query 对象
6. API 集成测试用例
```

---

## 1. API 设计目标

| 目标 | 说明 |
|---|---|
| 统一协议 | 所有 P0 API 使用统一 URL、请求、响应、错误码、分页和审计上下文。 |
| 三态隔离 | 设计态 API、发布态 API、运行态 API 边界清晰，运行态不得读取草稿元数据。 |
| 元数据驱动 | 表单、视图、流程、权限、菜单等 API 以 DSL 资源为核心输入输出。 |
| 后端可信 | 权限、字段裁剪、数据范围、流程任务处理人、附件下载鉴权必须由后端执行。 |
| 快照稳定 | 运行态 API 必须通过 `lc_app_runtime_pointer` 读取当前 `lc_metadata_snapshot`。 |
| 事务完整 | 发布、回滚、业务记录写入、审批、附件绑定等写操作必须有明确事务边界。 |
| 可审计 | 关键写操作、拒绝访问、越权字段提交、附件下载拒绝必须写审计或安全事件。 |
| 可测试 | 每类 API 必须能映射到可执行测试用例。 |
| 可生成 | API 设计必须足够结构化，便于 AI 生成 OpenAPI、后端骨架和前端 SDK。 |

---

## 2. API 设计原则

```text
1. API 使用 RESTful 风格，基础路径统一为 /api/v1。
2. 平台管理态、设计态、发布态、运行态 API 使用不同路径前缀隔离。
3. 所有核心请求必须包含认证上下文。
4. tenant_id 不由普通前端请求任意传入，必须由登录态、部署上下文或服务端上下文解析。
5. appId 可以出现在路径中，作为应用边界。
6. 运行态 API 必须以 appId + runtime pointer + snapshotId 作为模型加载边界。
7. 写 API 必须使用 DTO 白名单，不得直接透传数据库实体。
8. 所有列表 API 必须分页。
9. 所有查询 API 默认追加 tenant_id 和 is_deleted = false。
10. 所有运行态返回数据必须执行字段权限裁剪。
11. 所有写操作必须明确是否需要幂等键。
12. 所有高风险写操作必须写审计日志。
13. API 不暴露数据库内部字段作为业务协议，除非该字段是业务语义的一部分。
14. DSL JSON 允许作为请求体，但必须经过 Schema 校验、资源依赖校验和安全校验。
15. 用户上传的表达式、条件、公式不得作为代码执行。
```

---

## 3. P0 API 范围

| API 域 | 覆盖能力 | 主要数据库表 |
|---|---|---|
| 认证 API | 登录、登出、当前用户、修改密码 | `lc_user`, `lc_user_auth`, `lc_security_event`, `lc_audit_log` |
| 应用中心 API | 应用分类、应用创建、应用成员、应用列表 | `lc_app_category`, `lc_app`, `lc_app_member`, `lc_app_template` |
| 组织用户角色 API | 组织、用户、角色、用户部门、用户角色 | `lc_org_unit`, `lc_user`, `lc_role`, `lc_user_org_unit`, `lc_user_role` |
| 元数据设计 API | 对象、字段、表单、视图、流程、权限、菜单 DSL | `lc_metadata_resource`, `lc_metadata_dependency` |
| 发布 API | 发布校验、发布、回滚、运行指针 | `lc_app_version`, `lc_metadata_snapshot`, `lc_app_runtime_pointer`, `lc_publish_log`, `lc_rollback_log` |
| 运行态模型 API | 获取当前应用运行模型、表单模型、视图模型、菜单模型 | `lc_app_runtime_pointer`, `lc_metadata_snapshot` |
| 权限 API | 权限策略、权限分配、权限变更、有效权限查询 | `lc_permission_policy`, `lc_permission_assignment`, `lc_permission_change_log` |
| 业务数据 API | 记录创建、编辑、提交、删除、详情、列表、导出预留 | `lc_business_record`, `lc_business_record_index`, `lc_business_record_relation`, `lc_business_unique_value` |
| 自动编号 API | 预览编号规则、生成编号 | `lc_sequence_counter` |
| 流程 API | 发起流程、待办、审批、驳回、撤回、轨迹 | `lc_workflow_instance`, `lc_workflow_task`, `lc_workflow_task_action`, `lc_workflow_trace` |
| 文件 API | 上传、绑定、下载、预览、删除 | `lc_file_object`, `lc_file_attachment`, `lc_file_access_log` |
| 审计与安全 API | 审计查询、安全事件查询、运行错误查询 | `lc_audit_log`, `lc_audit_log_detail`, `lc_security_event`, `lc_runtime_error_log` |
| 回收站 API | 删除资源列表、恢复、彻底删除预留 | `lc_recycle_item` |
| 诊断 API | 一致性巡检、运行态健康检查 | 相关核心表 |

---

## 4. P0 不做 API 范围

```text
1. 不做完整 OAuth2 授权服务器 API。
2. 不做完整 SSO / OIDC / SAML / 企业微信 / 钉钉 / 飞书集成 API，仅预留身份源字段。
3. 不做插件市场 API。
4. 不做完整 BPMN 建模与运行 API。
5. 不做 BI 报表、指标建模、OLAP 查询 API。
6. 不做移动端原生离线同步 API。
7. 不做 SaaS 租户计费、套餐、资源配额和租户运营后台 API。
8. 不做 AI 自动生成应用 API。
9. 不做外部开放平台、第三方应用授权和 Webhook 市场。
10. 不做跨服务 Saga、分布式事务消息 API。
```

---

## 5. API 分层与路径总览

### 5.1 路径前缀

| API 类型 | 路径前缀 | 说明 |
|---|---|---|
| 认证 API | `/api/v1/auth` | 登录、登出、当前用户、密码。 |
| 平台管理 API | `/api/v1/admin` | 组织、用户、角色、系统初始化、诊断。 |
| 应用中心 API | `/api/v1/apps` | 应用、分类、成员、模板。 |
| 设计态 API | `/api/v1/apps/{appId}/design` | 元数据草稿、依赖、设计态校验。 |
| 发布态 API | `/api/v1/apps/{appId}/release` | 发布校验、发布、版本、回滚。 |
| 运行态 API | `/api/v1/runtime/apps/{appId}` | 运行模型、业务记录、流程、附件。 |
| 文件 API | `/api/v1/files` | 文件上传、下载、预览。 |
| 审计 API | `/api/v1/audit` | 审计日志、安全事件、运行错误。 |

### 5.2 三态 API 隔离

```text
设计态 API：
- 读写 lc_metadata_resource.draft_json。
- 允许保存不完整草稿。
- 不影响运行用户。

发布态 API：
- 读取设计态资源。
- 执行校验、构建版本和快照。
- 切换 lc_app_runtime_pointer。

运行态 API：
- 只读取 lc_app_runtime_pointer 和 lc_metadata_snapshot。
- 不读取 lc_metadata_resource.draft_json。
- 所有业务数据写入都绑定 app_version_id 和 snapshot_id。
```

---

## 6. 统一认证与会话模型

### 6.1 P0 登录方式

P0 私有化部署至少支持账号密码登录。

| 能力 | P0 是否支持 | 说明 |
|---|---|---|
| 用户名密码登录 | 是 | 基于 `lc_user_auth.auth_type = password`。 |
| 手机号登录 | 可选 | 使用 `login_identifier` 承载。 |
| 邮箱登录 | 可选 | 使用 `login_identifier` 承载。 |
| SSO / OIDC / SAML | 预留 | P0 不做完整集成。 |
| API Token | 预留 | P0 非必须。 |

### 6.2 登录校验链路

```text
1. 根据 loginIdentifier 查询 lc_user_auth。
2. 校验 lc_user_auth.status。
3. 校验密码哈希。
4. 查询 lc_user。
5. 校验 lc_user.status 与 lc_user.login_enabled。
6. 查询用户部门、角色和应用成员基础信息。
7. 生成访问令牌或服务端会话。
8. 更新 last_login_at / last_login_ip。
9. 写入审计日志或安全事件。
```

### 6.3 认证 API

| 方法 | 路径 | 说明 | 幂等 | 审计 |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | 用户登录 | 否 | 成功/失败均记录 |
| POST | `/api/v1/auth/logout` | 用户登出 | 是 | 记录 |
| GET | `/api/v1/auth/me` | 获取当前用户信息 | 是 | 可不记录 |
| POST | `/api/v1/auth/change-password` | 修改密码 | 否 | 记录高风险审计 |
| POST | `/api/v1/auth/reset-password` | 管理员重置密码 | 否 | 记录高风险审计 |

### 6.4 登录请求 DTO

```json
{
  "loginIdentifier": "admin",
  "password": "******",
  "captchaToken": "optional",
  "rememberMe": false
}
```

### 6.5 登录响应 DTO

```json
{
  "accessToken": "token",
  "tokenType": "Bearer",
  "expiresIn": 7200,
  "user": {
    "id": "usr_001",
    "username": "admin",
    "displayName": "系统管理员",
    "primaryOrgId": "org_001",
    "roles": ["system_admin"]
  }
}
```

---

## 7. 统一请求上下文

所有通过认证的 API 在服务端解析以下上下文：

| 字段 | 来源 | 说明 |
|---|---|---|
| tenantId | 登录态 / 部署上下文 | P0 默认 default 租户，不由普通前端任意传入。 |
| userId | 访问令牌 / 会话 | 当前用户。 |
| primaryOrgId | 用户主部门 | 数据权限和流程处理人规则使用。 |
| roleIds | 用户角色 | 权限计算使用。 |
| appRoles | 应用成员关系 | 应用级权限使用。 |
| requestId | 请求头或网关生成 | 用于幂等、日志和排障。 |
| traceId | 网关或服务端生成 | 用于链路追踪。 |
| clientIp | 请求来源 | 审计和安全事件使用。 |
| userAgent | 请求头 | 审计和安全事件使用。 |

推荐请求头：

```http
Authorization: Bearer <token>
X-Request-Id: <request-id>
X-Idempotency-Key: <idempotency-key>
```

说明：

```text
1. tenantId 只能由服务端可信上下文确定。
2. appId 来自路径，但必须校验当前用户是否有应用访问权限。
3. 对外响应不得返回 password_hash、password_salt、storage_path 等敏感字段。
```

---

## 8. 统一响应结构

### 8.1 成功响应

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {},
  "requestId": "req_001",
  "traceId": "trace_001"
}
```

### 8.2 失败响应

```json
{
  "success": false,
  "code": "PERMISSION_DENIED",
  "message": "无权限访问该资源",
  "details": [
    {
      "field": "amount",
      "reason": "field_not_editable"
    }
  ],
  "requestId": "req_001",
  "traceId": "trace_001"
}
```

### 8.3 分页响应

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "hasNext": true
}
```

### 8.4 响应规则

```text
1. 业务失败不返回数据库异常原文。
2. 权限失败不暴露无权资源的敏感详情。
3. 校验失败应返回字段级 details。
4. 批量操作应返回成功、失败和跳过的明细。
5. 运行态接口响应必须经过字段权限裁剪。
```

---

## 9. 统一错误码

| 错误码 | HTTP 状态 | 说明 |
|---|---:|---|
| OK | 200 | 成功。 |
| BAD_REQUEST | 400 | 请求参数错误。 |
| UNAUTHORIZED | 401 | 未登录或令牌失效。 |
| PERMISSION_DENIED | 403 | 无权限。 |
| RESOURCE_NOT_FOUND | 404 | 资源不存在或无权访问。 |
| CONFLICT | 409 | 数据冲突。 |
| VERSION_CONFLICT | 409 | 乐观锁冲突。 |
| IDEMPOTENCY_CONFLICT | 409 | 幂等键重复但请求摘要不同。 |
| VALIDATION_FAILED | 422 | 业务校验失败。 |
| DSL_SCHEMA_INVALID | 422 | DSL Schema 校验失败。 |
| DEPENDENCY_BROKEN | 422 | 元数据依赖断裂。 |
| FIELD_PERMISSION_DENIED | 403 | 字段无权查看或编辑。 |
| DATA_PERMISSION_DENIED | 403 | 数据范围无权访问。 |
| WORKFLOW_TASK_INVALID | 409 | 流程任务状态不可操作。 |
| SNAPSHOT_NOT_FOUND | 500 | 运行快照不存在。 |
| APP_NOT_PUBLISHED | 400 | 应用未发布。 |
| FILE_ACCESS_DENIED | 403 | 文件无权访问。 |
| RATE_LIMITED | 429 | 请求过于频繁。 |
| INTERNAL_ERROR | 500 | 未知系统错误。 |

错误码约束：

```text
1. 错误码使用大写蛇形命名。
2. 错误码必须稳定，不得随意变更。
3. 需要前端特殊处理的错误必须在本文登记。
4. 权限错误不得返回无权字段的原始值。
```

---

## 10. 分页、排序、过滤和搜索

### 10.1 通用分页参数

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| page | int | 1 | 页码，从 1 开始。 |
| pageSize | int | 20 | 每页数量，最大建议 200。 |
| sortBy | string | createdAt | 排序字段。 |
| sortOrder | string | desc | asc / desc。 |
| keyword | string | 空 | 关键词。 |

### 10.2 运行态列表查询参数

```json
{
  "page": 1,
  "pageSize": 20,
  "viewKey": "default_list",
  "keyword": "合同",
  "filters": [
    {
      "fieldKey": "amount",
      "operator": "gte",
      "value": 10000
    }
  ],
  "sorts": [
    {
      "fieldKey": "createdAt",
      "order": "desc"
    }
  ]
}
```

### 10.3 过滤操作符

| 操作符 | 说明 |
|---|---|
| eq | 等于 |
| ne | 不等于 |
| gt / gte | 大于 / 大于等于 |
| lt / lte | 小于 / 小于等于 |
| contains | 包含 |
| startsWith | 前缀匹配 |
| in | 在集合中 |
| between | 区间 |
| isNull | 为空 |
| notNull | 非空 |

查询约束：

```text
1. 运行态过滤字段必须来自已发布 snapshot 的可查询字段。
2. filterable / searchable / sortable / permissionRelevant 字段应优先走 lc_business_record_index。
3. 不得允许前端传入任意 SQL 片段。
4. 排序字段必须白名单校验。
```

---

## 11. 幂等设计

### 11.1 需要幂等控制的接口

| 操作 | 是否必须 | 说明 |
|---|---|---|
| 创建业务记录 | 推荐 | 避免重复提交。 |
| 提交业务记录 | 必须 | 避免重复发起流程。 |
| 审批通过 / 驳回 | 必须 | 避免重复审批。 |
| 发布应用 | 必须 | 避免重复发布。 |
| 回滚版本 | 必须 | 避免重复切换指针。 |
| 文件上传 | 推荐 | 避免重试产生多份文件。 |
| 修改普通配置 | 可选 | 可使用乐观锁替代。 |

### 11.2 幂等键规则

```text
1. 客户端可通过 X-Idempotency-Key 传入幂等键。
2. 服务端可在关键页面初始化时下发一次性 operationToken。
3. 相同幂等键 + 相同 requestHash 重复请求，返回首次结果。
4. 相同幂等键 + 不同 requestHash，返回 IDEMPOTENCY_CONFLICT。
5. processing 超时后，可按 lc_api_idempotency_key.locked_until 释放或重试。
```

### 11.3 幂等处理流程

```text
1. 读取 X-Idempotency-Key。
2. 计算 requestHash。
3. 尝试插入 lc_api_idempotency_key，状态 processing。
4. 如唯一冲突，读取既有记录。
5. 若 requestHash 相同且 success，返回 response_json。
6. 若 requestHash 不同，返回 IDEMPOTENCY_CONFLICT。
7. 业务处理成功后更新 response_json 和 operation_status = success。
8. 业务处理失败后更新 operation_status = failed 或删除幂等记录，按接口策略决定。
```

---

## 12. 权限校验通用链路

### 12.1 设计态权限

设计态 API 需要校验：

```text
1. 用户是否为应用 owner / admin / designer。
2. 用户是否拥有当前资源类型的设计权限。
3. 元数据变更是否允许影响已有发布资源。
4. 删除资源前是否通过依赖影响分析。
```

### 12.2 发布态权限

发布态 API 需要校验：

```text
1. 用户是否拥有应用发布权限。
2. 应用是否处于可发布状态。
3. DSL Schema 是否通过校验。
4. 依赖完整性是否通过校验。
5. 权限默认策略和流程绑定是否完整。
```

### 12.3 运行态权限

运行态 API 需要校验：

```text
1. 用户是否可访问应用。
2. 用户是否可访问当前菜单 / 视图 / 表单 / 对象。
3. 用户是否满足数据范围。
4. 用户是否可查看返回字段。
5. 用户是否可编辑提交字段。
6. 流程任务是否属于当前用户或候选用户。
7. 附件是否绑定到当前用户有权访问的资源。
```

### 12.4 权限校验顺序

```text
1. 认证校验。
2. tenantId 上下文校验。
3. appId 访问校验。
4. runtime pointer / snapshot 加载。
5. 应用级权限校验。
6. 对象级权限校验。
7. 数据范围校验。
8. 字段级权限校验。
9. 流程节点字段权限校验。
10. 审计或安全事件记录。
```

---

## 13. 审计与安全事件策略

### 13.1 必须写审计的操作

```text
1. 登录成功、登录失败、登出、修改密码、重置密码。
2. 创建、修改、删除应用。
3. 修改应用成员。
4. 创建、修改、删除组织、用户、角色。
5. 创建、修改、删除元数据资源。
6. 发布、回滚、停用、启用应用。
7. 修改权限策略和权限分配。
8. 创建、修改、删除、提交、作废业务记录。
9. 审批通过、驳回、撤回、作废流程。
10. 上传、绑定、删除文件。
11. 高风险文件下载。
12. 回收站恢复和彻底删除。
```

### 13.2 必须写安全事件的操作

```text
1. 登录异常、账号锁定。
2. 无权限访问应用。
3. 数据权限拒绝。
4. 字段越权提交。
5. 附件下载拒绝。
6. 幂等键冲突。
7. 运行态快照缺失或指针异常。
8. API 频率异常。
```

### 13.3 审计上下文字段

```text
tenantId
appId
module
action
targetType
targetId
operatorId
operationTime
operationResult
riskLevel
requestId
traceId
clientIp
userAgent
```

---

## 14. 应用中心 API

### 14.1 应用分类 API

| 方法 | 路径 | 说明 | 权限 | 主要表 |
|---|---|---|---|---|
| GET | `/api/v1/apps/categories` | 查询应用分类 | 登录用户 | `lc_app_category` |
| POST | `/api/v1/apps/categories` | 创建应用分类 | 平台管理员 | `lc_app_category` |
| PUT | `/api/v1/apps/categories/{categoryId}` | 修改应用分类 | 平台管理员 | `lc_app_category` |
| DELETE | `/api/v1/apps/categories/{categoryId}` | 删除应用分类 | 平台管理员 | `lc_app_category`, `lc_recycle_item` |

### 14.2 应用 API

| 方法 | 路径 | 说明 | 权限 | 主要表 |
|---|---|---|---|---|
| GET | `/api/v1/apps` | 应用列表 | 登录用户 | `lc_app`, `lc_app_member`, `lc_app_runtime_pointer` |
| POST | `/api/v1/apps` | 创建空白应用 | 平台管理员 / 应用创建权限 | `lc_app`, `lc_app_member` |
| POST | `/api/v1/apps/from-template` | 从模板创建应用 | 应用创建权限 | `lc_app_template`, `lc_app`, `lc_metadata_resource` |
| GET | `/api/v1/apps/{appId}` | 应用详情 | 应用成员 | `lc_app` |
| PUT | `/api/v1/apps/{appId}` | 修改应用基础信息 | owner / admin | `lc_app` |
| POST | `/api/v1/apps/{appId}/disable` | 停用应用 | owner / admin | `lc_app`, `lc_app_runtime_pointer`, `lc_publish_log` |
| POST | `/api/v1/apps/{appId}/enable` | 启用应用 | owner / admin | `lc_app`, `lc_app_runtime_pointer`, `lc_publish_log` |
| DELETE | `/api/v1/apps/{appId}` | 删除到回收站 | owner / admin | `lc_app`, `lc_recycle_item` |

### 14.3 创建应用请求 DTO

```json
{
  "appKey": "contract_management",
  "appName": "合同管理",
  "appDesc": "合同全生命周期管理",
  "categoryId": "cat_contract",
  "icon": "contract",
  "ownerId": "usr_001",
  "settings": {
    "theme": "default"
  }
}
```

### 14.4 应用列表响应 DTO

```json
{
  "items": [
    {
      "id": "app_001",
      "appKey": "contract_management",
      "appName": "合同管理",
      "designStatus": "changed",
      "runtimeStatus": "active",
      "status": "active",
      "currentVersionId": "ver_001",
      "currentSnapshotId": "snap_001",
      "owner": {
        "id": "usr_001",
        "displayName": "管理员"
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### 14.5 应用成员 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/members` | 查询应用成员。 |
| POST | `/api/v1/apps/{appId}/members` | 添加应用成员。 |
| PUT | `/api/v1/apps/{appId}/members/{memberId}` | 修改应用成员角色。 |
| DELETE | `/api/v1/apps/{appId}/members/{memberId}` | 移除应用成员。 |

成员请求 DTO：

```json
{
  "memberType": "user",
  "memberId": "usr_001",
  "appRole": "designer",
  "effectiveFrom": null,
  "effectiveTo": null
}
```

规则：

```text
1. 应用至少保留一个 owner。
2. 应用成员变更后必须失效权限缓存。
3. 应用成员变更必须写审计。
```

---

## 15. 应用模板 API

### 15.1 模板 API 清单

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/apps/templates` | 查询应用模板列表 | `lc_app_template` |
| GET | `/api/v1/apps/templates/{templateId}` | 查询模板详情 | `lc_app_template` |
| POST | `/api/v1/apps/from-template` | 从模板创建应用 | `lc_app_template`, `lc_app`, `lc_metadata_resource`, `lc_permission_policy` |

### 15.2 从模板创建应用请求 DTO

```json
{
  "templateId": "tpl_contract",
  "appKey": "contract_management",
  "appName": "合同管理",
  "categoryId": "cat_contract",
  "ownerId": "usr_001"
}
```

### 15.3 从模板创建应用规则

```text
1. 读取 lc_app_template.template_json。
2. 生成新的 appId、resourceId、policyId、workflowKey 等必要 ID。
3. 不得复用模板内资源 ID。
4. 创建 lc_app、lc_metadata_resource、lc_permission_policy、lc_permission_assignment。
5. 默认不自动发布，除非请求明确 autoPublish = true。
6. 模板市场、评分、下载统计不属于 P0。
```

---

## 16. 组织用户角色 API

### 16.1 组织 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/admin/org-units/tree` | 查询组织树 | `lc_org_unit` |
| GET | `/api/v1/admin/org-units` | 查询组织列表 | `lc_org_unit` |
| POST | `/api/v1/admin/org-units` | 创建组织 | `lc_org_unit` |
| PUT | `/api/v1/admin/org-units/{orgUnitId}` | 修改组织 | `lc_org_unit` |
| DELETE | `/api/v1/admin/org-units/{orgUnitId}` | 删除组织 | `lc_org_unit`, `lc_recycle_item` |

组织保存规则：

```text
1. 禁止组织树成环。
2. 更新 parent_id 时必须重算 org_path 和 org_level。
3. 停用部门不影响历史业务记录 created_dept_id。
4. 删除前必须检查是否存在活跃用户归属。
```

### 16.2 用户 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/admin/users` | 查询用户列表 | `lc_user`, `lc_user_org_unit`, `lc_user_role` |
| POST | `/api/v1/admin/users` | 创建用户 | `lc_user`, `lc_user_auth` |
| GET | `/api/v1/admin/users/{userId}` | 查询用户详情 | `lc_user` |
| PUT | `/api/v1/admin/users/{userId}` | 修改用户 | `lc_user` |
| POST | `/api/v1/admin/users/{userId}/enable-login` | 启用登录 | `lc_user`, `lc_user_auth` |
| POST | `/api/v1/admin/users/{userId}/disable-login` | 禁用登录 | `lc_user`, `lc_user_auth` |
| POST | `/api/v1/admin/users/{userId}/reset-password` | 重置密码 | `lc_user_auth` |
| DELETE | `/api/v1/admin/users/{userId}` | 删除用户 | `lc_user`, `lc_recycle_item` |

创建用户 DTO：

```json
{
  "username": "zhangsan",
  "displayName": "张三",
  "mobile": "13800000000",
  "email": "zhangsan@example.com",
  "primaryOrgId": "org_sales",
  "directManagerId": "usr_manager",
  "loginEnabled": true,
  "initialPassword": "******",
  "roleIds": ["role_user"],
  "orgUnitIds": ["org_sales"]
}
```

规则：

```text
1. 密码只进入 lc_user_auth，不得进入 lc_user。
2. 创建用户时如 loginEnabled = true，必须创建 password 类型认证记录。
3. 用户停用后不得登录，但历史业务数据保留。
```

### 16.3 角色 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/admin/roles` | 查询角色列表 | `lc_role` |
| POST | `/api/v1/admin/roles` | 创建角色 | `lc_role` |
| GET | `/api/v1/admin/roles/{roleId}` | 查询角色详情 | `lc_role` |
| PUT | `/api/v1/admin/roles/{roleId}` | 修改角色 | `lc_role` |
| DELETE | `/api/v1/admin/roles/{roleId}` | 删除角色 | `lc_role`, `lc_recycle_item` |
| POST | `/api/v1/admin/users/{userId}/roles` | 分配用户角色 | `lc_user_role` |
| DELETE | `/api/v1/admin/users/{userId}/roles/{roleId}` | 移除用户角色 | `lc_user_role` |

角色变更规则：

```text
1. 用户角色变化后必须失效权限缓存。
2. 系统内置角色不得被普通管理员删除。
3. 删除角色前必须检查是否存在用户绑定或权限分配。
```

---

## 17. 元数据设计 API

### 17.1 元数据资源类型

P0 设计态 API 统一以 metadata resource 方式管理以下资源：

```text
app
entity
field
form
view
workflowDef
permissionPolicy
menu
```

### 17.2 元数据资源 API 清单

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/apps/{appId}/design/resources` | 查询资源列表 | `lc_metadata_resource` |
| POST | `/api/v1/apps/{appId}/design/resources` | 创建资源 | `lc_metadata_resource` |
| GET | `/api/v1/apps/{appId}/design/resources/{resourceId}` | 查询资源详情 | `lc_metadata_resource` |
| PUT | `/api/v1/apps/{appId}/design/resources/{resourceId}` | 保存资源草稿 | `lc_metadata_resource`, `lc_metadata_dependency` |
| DELETE | `/api/v1/apps/{appId}/design/resources/{resourceId}` | 删除资源 | `lc_metadata_resource`, `lc_metadata_dependency`, `lc_recycle_item` |
| POST | `/api/v1/apps/{appId}/design/resources/{resourceId}/validate` | 校验单资源 DSL | `lc_metadata_resource` |
| POST | `/api/v1/apps/{appId}/design/validate` | 校验整个应用设计态 | `lc_metadata_resource`, `lc_metadata_dependency` |
| GET | `/api/v1/apps/{appId}/design/dependencies` | 查询依赖关系 | `lc_metadata_dependency` |
| GET | `/api/v1/apps/{appId}/design/resources/{resourceId}/impact` | 删除/修改影响分析 | `lc_metadata_dependency` |

### 17.3 创建资源 DTO

```json
{
  "resourceType": "entity",
  "resourceKey": "contract",
  "resourceName": "合同",
  "parentResourceId": null,
  "schemaVersion": "1.0",
  "draftJson": {
    "resourceType": "entity",
    "key": "contract",
    "name": "合同"
  }
}
```

### 17.4 保存资源草稿规则

```text
1. 保存草稿只更新 lc_metadata_resource.draft_json。
2. 保存草稿不得影响 lc_metadata_snapshot。
3. 保存草稿必须更新 draft_version 和 checksum。
4. 保存草稿后应重建该资源相关 lc_metadata_dependency。
5. resource_key 创建后原则上不可修改。
6. 字段删除前必须进行影响分析。
7. 字段类型修改如影响既有业务数据，必须提示风险。
```

### 17.5 元数据校验结果 DTO

```json
{
  "valid": false,
  "errors": [
    {
      "resourceType": "form",
      "resourceKey": "contract_form",
      "path": "fields[3].fieldKey",
      "code": "DEPENDENCY_BROKEN",
      "message": "字段 amount 不存在"
    }
  ],
  "warnings": [
    {
      "resourceType": "entity",
      "resourceKey": "contract",
      "code": "FIELD_NOT_INDEXED",
      "message": "字段 amount 被用于筛选但未标记 filterable"
    }
  ]
}
```

---

## 18. 数据建模 API

数据建模 API 可以复用元数据资源 API，也可以提供面向前端设计器的语义化包装。

### 18.1 对象 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/entities` | 查询对象列表。 |
| POST | `/api/v1/apps/{appId}/design/entities` | 创建对象。 |
| GET | `/api/v1/apps/{appId}/design/entities/{entityKey}` | 查询对象详情。 |
| PUT | `/api/v1/apps/{appId}/design/entities/{entityKey}` | 修改对象。 |
| DELETE | `/api/v1/apps/{appId}/design/entities/{entityKey}` | 删除对象。 |

### 18.2 字段 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/entities/{entityKey}/fields` | 查询字段列表。 |
| POST | `/api/v1/apps/{appId}/design/entities/{entityKey}/fields` | 创建字段。 |
| PUT | `/api/v1/apps/{appId}/design/entities/{entityKey}/fields/{fieldKey}` | 修改字段。 |
| DELETE | `/api/v1/apps/{appId}/design/entities/{entityKey}/fields/{fieldKey}` | 删除字段。 |
| POST | `/api/v1/apps/{appId}/design/entities/{entityKey}/fields/{fieldKey}/impact` | 字段变更影响分析。 |

字段创建 DTO：

```json
{
  "fieldKey": "amount",
  "fieldName": "合同金额",
  "fieldType": "decimal",
  "required": true,
  "unique": false,
  "searchable": true,
  "filterable": true,
  "sortable": true,
  "permissionRelevant": true,
  "options": {
    "precision": 2
  }
}
```

规则：

```text
1. unique = true 的字段运行态保存时必须使用 lc_business_unique_value。
2. autoNumber 字段运行态保存时必须使用 lc_sequence_counter。
3. filterable / searchable / sortable / permissionRelevant 字段必须进入索引策略。
4. P0 子表默认存入主记录 data_json。
5. P0 不为 entity 动态创建物理业务表。
```

---

## 19. 表单、视图与菜单设计 API

### 19.1 表单设计 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/forms` | 查询表单列表。 |
| POST | `/api/v1/apps/{appId}/design/forms` | 创建表单。 |
| GET | `/api/v1/apps/{appId}/design/forms/{formKey}` | 查询表单详情。 |
| PUT | `/api/v1/apps/{appId}/design/forms/{formKey}` | 保存表单 DSL。 |
| DELETE | `/api/v1/apps/{appId}/design/forms/{formKey}` | 删除表单。 |
| POST | `/api/v1/apps/{appId}/design/forms/{formKey}/validate` | 校验表单 DSL。 |

### 19.2 视图设计 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/views` | 查询视图列表。 |
| POST | `/api/v1/apps/{appId}/design/views` | 创建视图。 |
| GET | `/api/v1/apps/{appId}/design/views/{viewKey}` | 查询视图详情。 |
| PUT | `/api/v1/apps/{appId}/design/views/{viewKey}` | 保存视图 DSL。 |
| DELETE | `/api/v1/apps/{appId}/design/views/{viewKey}` | 删除视图。 |

### 19.3 菜单设计 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/menus` | 查询菜单树。 |
| PUT | `/api/v1/apps/{appId}/design/menus` | 保存菜单树。 |
| POST | `/api/v1/apps/{appId}/design/menus/validate` | 校验菜单引用。 |

规则：

```text
1. 表单引用字段必须存在。
2. 视图引用字段必须存在且有查询策略。
3. 菜单引用视图、表单、对象必须存在。
4. 运行态菜单裁剪必须由后端按权限完成。
```

---

## 20. 权限设计 API

### 20.1 权限策略 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/apps/{appId}/design/permissions/policies` | 查询权限策略 | `lc_permission_policy` |
| POST | `/api/v1/apps/{appId}/design/permissions/policies` | 创建权限策略 | `lc_permission_policy` |
| GET | `/api/v1/apps/{appId}/design/permissions/policies/{policyId}` | 权限策略详情 | `lc_permission_policy` |
| PUT | `/api/v1/apps/{appId}/design/permissions/policies/{policyId}` | 修改权限策略 | `lc_permission_policy`, `lc_permission_change_log` |
| DELETE | `/api/v1/apps/{appId}/design/permissions/policies/{policyId}` | 删除权限策略 | `lc_permission_policy`, `lc_permission_change_log` |

### 20.2 权限分配 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/apps/{appId}/design/permissions/assignments` | 查询权限分配 | `lc_permission_assignment` |
| POST | `/api/v1/apps/{appId}/design/permissions/assignments` | 创建权限分配 | `lc_permission_assignment` |
| DELETE | `/api/v1/apps/{appId}/design/permissions/assignments/{assignmentId}` | 删除权限分配 | `lc_permission_assignment` |
| POST | `/api/v1/apps/{appId}/design/permissions/evaluate` | 设计态权限试算 | `lc_permission_policy`, `lc_permission_assignment` |

### 20.3 权限策略 DTO

```json
{
  "policyKey": "contract_amount_field_edit",
  "policyName": "合同金额字段编辑权限",
  "policyType": "field",
  "targetType": "field",
  "targetResourceKey": "contract.amount",
  "effect": "allow",
  "priority": 100,
  "policyJson": {
    "actions": ["read", "edit"],
    "conditions": []
  }
}
```

规则：

```text
1. 权限变更必须写 lc_permission_change_log。
2. 权限变更后必须失效权限缓存。
3. deny 优先于 allow。
4. 运行态权限以快照内固化的权限模型为准。
5. 设计态权限 API 不等价于运行态有效权限 API。
```

---

## 21. 流程设计 API

流程设计 API 管理 workflow DSL 草稿，流程运行 API 见后续章节。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/apps/{appId}/design/workflows` | 查询流程定义列表。 |
| POST | `/api/v1/apps/{appId}/design/workflows` | 创建流程定义。 |
| GET | `/api/v1/apps/{appId}/design/workflows/{workflowKey}` | 查询流程定义详情。 |
| PUT | `/api/v1/apps/{appId}/design/workflows/{workflowKey}` | 保存流程 DSL。 |
| DELETE | `/api/v1/apps/{appId}/design/workflows/{workflowKey}` | 删除流程定义。 |
| POST | `/api/v1/apps/{appId}/design/workflows/{workflowKey}/validate` | 校验流程定义。 |

流程校验规则：

```text
1. 流程必须绑定 entityKey。
2. 开始节点和结束节点必须存在。
3. 审批节点处理人规则必须可解析。
4. 条件分支引用字段必须存在。
5. 节点字段权限引用字段必须存在。
6. P0 不支持完整 BPMN，仅支持轻量审批流 DSL。
```

---

## 22. 发布 API

### 22.1 发布 API 清单

| 方法 | 路径 | 说明 | 幂等 | 主要表 |
|---|---|---|---|---|
| POST | `/api/v1/apps/{appId}/release/validate` | 发布前校验 | 否 | `lc_metadata_resource`, `lc_metadata_dependency` |
| POST | `/api/v1/apps/{appId}/release/publish` | 发布应用 | 必须 | `lc_app_version`, `lc_metadata_snapshot`, `lc_app_runtime_pointer`, `lc_publish_log` |
| GET | `/api/v1/apps/{appId}/release/versions` | 查询发布版本 | 是 | `lc_app_version` |
| GET | `/api/v1/apps/{appId}/release/versions/{versionId}` | 查询版本详情 | 是 | `lc_app_version`, `lc_metadata_snapshot` |
| GET | `/api/v1/apps/{appId}/release/current` | 当前运行版本 | 是 | `lc_app_runtime_pointer` |
| POST | `/api/v1/apps/{appId}/release/disable` | 停用运行态 | 必须 | `lc_app_runtime_pointer`, `lc_publish_log` |
| POST | `/api/v1/apps/{appId}/release/enable` | 启用运行态 | 必须 | `lc_app_runtime_pointer`, `lc_publish_log` |

### 22.2 发布请求 DTO

```json
{
  "versionNo": "1.0.0",
  "versionName": "首个运行版本",
  "releaseNote": "发布合同管理应用首版",
  "force": false
}
```

### 22.3 发布响应 DTO

```json
{
  "appVersionId": "ver_001",
  "snapshotId": "snap_001",
  "versionNo": "1.0.0",
  "releaseStatus": "current",
  "metadataHash": "hash_001",
  "releasedAt": "2026-05-06T10:00:00Z",
  "validationResult": {
    "valid": true,
    "errors": [],
    "warnings": []
  }
}
```

### 22.4 发布事务规则

```text
1. 获取应用发布锁。
2. 读取设计态 metadata_resource。
3. 执行 DSL Schema 校验。
4. 执行依赖完整性校验。
5. 执行权限默认策略校验。
6. 执行流程定义校验。
7. 预生成 appVersionId 和 snapshotId。
8. 写入 metadata_resource_version。
9. 写入 metadata_snapshot。
10. 写入 app_version。
11. 写入或更新 app_runtime_pointer。
12. 更新 app 冗余版本字段。
13. 写入 publish_log success。
14. 提交事务。
15. 事务提交后失效运行态模型缓存和权限缓存。
```

### 22.5 发布失败规则

```text
1. 发布失败不得切换 app_runtime_pointer。
2. 发布失败通常只写 lc_publish_log failed。
3. 若实现上保留 failed app_version，则该版本不得关联 active snapshot，不得被 runtime_pointer 引用。
4. 失败错误必须返回 validationResult 或 errorCode。
```

---

## 23. 回滚 API

### 23.1 回滚 API 清单

| 方法 | 路径 | 说明 | 幂等 | 主要表 |
|---|---|---|---|---|
| POST | `/api/v1/apps/{appId}/release/rollback` | 回滚到指定版本 | 必须 | `lc_app_runtime_pointer`, `lc_rollback_log` |
| GET | `/api/v1/apps/{appId}/release/rollback-logs` | 查询回滚日志 | 是 | `lc_rollback_log` |
| POST | `/api/v1/apps/{appId}/release/versions/{versionId}/can-rollback` | 校验是否可回滚 | 否 | `lc_app_version`, `lc_metadata_snapshot` |

### 23.2 回滚请求 DTO

```json
{
  "targetVersionId": "ver_001",
  "rollbackReason": "新版本表单配置异常"
}
```

### 23.3 回滚规则

```text
1. 回滚只切换 lc_app_runtime_pointer。
2. 回滚不得修改历史 app_version。
3. 回滚不得修改历史 metadata_snapshot。
4. 回滚不得批量改写历史 business_record。
5. 已启动流程实例继续使用原 workflow_instance.snapshot_id。
6. 回滚成功后必须失效运行态模型缓存和权限缓存。
```

---

## 24. 运行态模型 API

运行态模型 API 是前端运行端渲染的入口。

### 24.1 API 清单

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/runtime/apps/{appId}/model` | 获取当前应用运行模型 | `lc_app_runtime_pointer`, `lc_metadata_snapshot` |
| GET | `/api/v1/runtime/apps/{appId}/menus` | 获取权限裁剪后的菜单 | `lc_metadata_snapshot` |
| GET | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/forms/{formKey}` | 获取运行态表单模型 | `lc_metadata_snapshot` |
| GET | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/views/{viewKey}` | 获取运行态视图模型 | `lc_metadata_snapshot` |
| GET | `/api/v1/runtime/apps/{appId}/permissions/effective` | 获取当前用户有效权限摘要 | `lc_metadata_snapshot`, `lc_permission_effective_cache` |

### 24.2 运行模型响应 DTO

```json
{
  "appId": "app_001",
  "appKey": "contract_management",
  "appName": "合同管理",
  "appVersionId": "ver_001",
  "snapshotId": "snap_001",
  "schemaVersion": "1.0",
  "menus": [],
  "entities": [],
  "forms": [],
  "views": [],
  "permissions": {
    "actions": [],
    "fieldPermissions": {}
  }
}
```

### 24.3 运行模型加载规则

```text
1. 查询 lc_app_runtime_pointer。
2. 校验 pointer_status = active。
3. 查询 lc_metadata_snapshot。
4. 校验 snapshot.status = active。
5. 从 snapshot_json 解析菜单、对象、表单、视图、流程和权限。
6. 根据当前用户执行权限裁剪。
7. 返回裁剪后的运行模型。
8. 不得读取 lc_metadata_resource.draft_json。
```

---

## 25. 业务记录运行态 API

### 25.1 API 清单

| 方法 | 路径 | 说明 | 幂等 | 主要表 |
|---|---|---|---|---|
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/query` | 查询记录列表 | 是 | `lc_business_record`, `lc_business_record_index` |
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records` | 创建记录 | 推荐 | `lc_business_record`, `lc_business_record_index`, `lc_business_unique_value` |
| GET | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}` | 查询记录详情 | 是 | `lc_business_record` |
| PUT | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}` | 修改记录 | 推荐 | `lc_business_record`, `lc_business_record_index` |
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}/submit` | 提交记录并触发流程 | 必须 | `lc_business_record`, `lc_workflow_instance`, `lc_workflow_task` |
| DELETE | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}` | 删除记录到回收站 | 推荐 | `lc_business_record`, `lc_recycle_item` |
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}/void` | 作废记录 | 必须 | `lc_business_record`, `lc_business_record_change_log` |
| GET | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}/changes` | 查询变更历史 | 是 | `lc_business_record_change_log` |

### 25.2 创建 / 修改记录请求 DTO

```json
{
  "formKey": "contract_form",
  "data": {
    "contractName": "办公楼租赁合同",
    "amount": 100000,
    "counterparty": "rec_counterparty_001",
    "signDate": "2026-05-06",
    "attachments": ["file_001"]
  },
  "clientDraftId": "draft_001"
}
```

### 25.3 记录详情响应 DTO

```json
{
  "id": "rec_001",
  "entityKey": "contract",
  "recordNo": "HT-202605-0001",
  "recordTitle": "办公楼租赁合同",
  "businessStatus": "draft",
  "workflowStatus": null,
  "appVersionId": "ver_001",
  "snapshotId": "snap_001",
  "data": {
    "contractName": "办公楼租赁合同",
    "amount": 100000
  },
  "permissions": {
    "canEdit": true,
    "canDelete": true,
    "editableFields": ["contractName", "amount"],
    "visibleFields": ["contractName", "amount"]
  }
}
```

### 25.4 记录写入规则

```text
1. 读取 runtime pointer。
2. 读取 metadata snapshot。
3. 校验对象权限、表单权限和字段编辑权限。
4. 使用快照中的字段定义校验类型、必填、格式、范围。
5. 过滤用户无权编辑字段。
6. 自动编号字段由后端生成。
7. unique 字段通过 lc_business_unique_value 占用。
8. 写入 lc_business_record。
9. 同步重建 lc_business_record_index。
10. 同步维护 lc_business_record_relation。
11. 同步维护 lc_file_attachment。
12. 写入 lc_business_record_change_log。
13. 写入 lc_audit_log。
14. 如果触发流程，创建 workflow_instance 和首批 workflow_task。
```

### 25.5 记录查询规则

```text
1. 查询必须先进行应用和对象权限校验。
2. 数据范围条件必须由后端根据权限 DSL 生成。
3. 字段筛选和排序必须白名单校验。
4. 可查询字段优先走 lc_business_record_index。
5. 回表读取 data_json 后必须按字段权限裁剪。
6. 前端传入的 filters 不得绕过数据权限。
```

---

## 26. 自动编号与唯一字段 API

### 26.1 自动编号 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/fields/{fieldKey}/sequence/preview` | 预览编号规则 | `lc_metadata_snapshot` |
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/fields/{fieldKey}/sequence/next` | 生成下一个编号 | `lc_sequence_counter` |

规则：

```text
1. 最终业务编号必须由后端生成。
2. 前端只能预览编号规则，不得生成最终编号。
3. 编号规则来自运行态 snapshot。
4. 编号生成应在业务记录创建事务内完成。
5. 允许跳号，不允许重复。
```

### 26.2 唯一字段校验 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| POST | `/api/v1/runtime/apps/{appId}/entities/{entityKey}/fields/{fieldKey}/unique/check` | 友好唯一性预校验 | `lc_business_unique_value`, `lc_business_record_index` |

请求 DTO：

```json
{
  "value": "HT-202605-0001",
  "recordId": null
}
```

规则：

```text
1. unique/check 只用于友好提示。
2. 最终唯一性以业务保存事务中的 lc_business_unique_value 占用为准。
3. 并发冲突返回 VALIDATION_FAILED 或 CONFLICT。
```

---

## 27. 流程运行 API

### 27.1 待办 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/runtime/tasks/todo` | 查询我的待办 | `lc_workflow_task` |
| GET | `/api/v1/runtime/tasks/done` | 查询我的已办 | `lc_workflow_task`, `lc_workflow_task_action` |
| GET | `/api/v1/runtime/tasks/{taskId}` | 查询任务详情 | `lc_workflow_task`, `lc_workflow_instance`, `lc_business_record` |
| POST | `/api/v1/runtime/tasks/{taskId}/claim` | 领取任务 | `lc_workflow_task` |

### 27.2 审批操作 API

| 方法 | 路径 | 说明 | 幂等 | 主要表 |
|---|---|---|---|---|
| POST | `/api/v1/runtime/tasks/{taskId}/approve` | 审批通过 | 必须 | `lc_workflow_task`, `lc_workflow_task_action` |
| POST | `/api/v1/runtime/tasks/{taskId}/reject` | 驳回 | 必须 | `lc_workflow_task`, `lc_workflow_task_action` |
| POST | `/api/v1/runtime/workflows/{instanceId}/withdraw` | 撤回 | 必须 | `lc_workflow_instance`, `lc_workflow_task_action` |
| POST | `/api/v1/runtime/workflows/{instanceId}/void` | 作废 | 必须 | `lc_workflow_instance`, `lc_workflow_task_action` |
| GET | `/api/v1/runtime/workflows/{instanceId}/trace` | 查询流程轨迹 | 是 | `lc_workflow_trace` |

### 27.3 审批请求 DTO

```json
{
  "actionComment": "同意",
  "fieldUpdates": {
    "financeOpinion": "预算充足"
  },
  "attachments": ["file_001"],
  "version": 3
}
```

### 27.4 审批事务规则

```text
1. 锁定 workflow_task。
2. 校验 task_status 为 pending / claimed。
3. 校验当前用户是 assignee_user_id 或合法候选人。
4. 校验 version 乐观锁。
5. 读取 workflow_instance.snapshot_id 对应快照。
6. 校验节点字段权限。
7. 过滤无权更新字段。
8. 写入 workflow_task_action。
9. 更新 workflow_task 状态。
10. 推进 workflow_instance。
11. 必要时更新 business_record。
12. 创建下一步 workflow_task。
13. 写入 workflow_trace。
14. 写入 audit_log。
```

---

## 28. 文件 API

### 28.1 API 清单

| 方法 | 路径 | 说明 | 幂等 | 主要表 |
|---|---|---|---|---|
| POST | `/api/v1/files/upload` | 上传文件 | 推荐 | `lc_file_object` |
| POST | `/api/v1/files/{fileId}/bind` | 绑定文件 | 推荐 | `lc_file_attachment` |
| GET | `/api/v1/files/{fileId}` | 文件元信息 | 是 | `lc_file_object`, `lc_file_attachment` |
| GET | `/api/v1/files/{fileId}/download` | 下载文件 | 是 | `lc_file_object`, `lc_file_attachment`, `lc_file_access_log` |
| GET | `/api/v1/files/{fileId}/preview` | 预览文件 | 是 | `lc_file_object`, `lc_file_attachment`, `lc_file_access_log` |
| DELETE | `/api/v1/files/{fileId}` | 删除文件对象或解绑 | 推荐 | `lc_file_object`, `lc_file_attachment`, `lc_recycle_item` |

### 28.2 文件绑定请求 DTO

```json
{
  "appId": "app_001",
  "bindType": "business_record",
  "bindId": "rec_001",
  "entityKey": "contract",
  "fieldKey": "attachments",
  "usageType": "attachment"
}
```

### 28.3 文件鉴权规则

```text
1. 文件下载和预览必须以后端鉴权为准。
2. lc_file_attachment 是文件绑定关系权威表。
3. lc_business_record_attachment 如存在，仅可作为查询加速，不得作为最终鉴权依据。
4. storage_path 不得作为公开 URL 直接返回前端。
5. 下载拒绝必须写 lc_file_access_log 或 lc_security_event。
6. 业务记录附件鉴权必须校验用户对记录和字段的可见权限。
7. 流程意见附件鉴权必须校验用户是否可查看对应流程实例或任务。
```

---

## 29. 回收站 API

### 29.1 API 清单

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/recycle/items` | 查询回收站列表 | `lc_recycle_item` |
| POST | `/api/v1/recycle/items/{itemId}/restore` | 恢复资源 | `lc_recycle_item` 和目标资源表 |
| DELETE | `/api/v1/recycle/items/{itemId}` | 彻底删除预留 | `lc_recycle_item` |

### 29.2 恢复规则

```text
1. 恢复前必须校验原始资源仍存在且未被彻底删除。
2. 恢复 app / metadata_resource / business_record 前，必须重新校验 active 唯一编码。
3. 如原 key 已被新资源占用，恢复应进入 blocked 状态或要求重命名恢复。
4. 应用恢复时必须校验 runtime pointer、snapshot 和依赖资源完整性。
5. 已产生历史记录、流程、附件或审计的资源，P0 不建议物理彻底删除。
```

---

## 30. 审计、安全和运行错误 API

### 30.1 审计 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/audit/logs` | 查询审计日志 | `lc_audit_log` |
| GET | `/api/v1/audit/logs/{logId}` | 查询审计详情 | `lc_audit_log`, `lc_audit_log_detail` |

### 30.2 安全事件 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/audit/security-events` | 查询安全事件 | `lc_security_event` |
| GET | `/api/v1/audit/security-events/{eventId}` | 查询安全事件详情 | `lc_security_event` |
| POST | `/api/v1/audit/security-events/{eventId}/handle` | 标记处理 | `lc_security_event` |

### 30.3 运行错误 API

| 方法 | 路径 | 说明 | 主要表 |
|---|---|---|---|
| GET | `/api/v1/audit/runtime-errors` | 查询运行错误 | `lc_runtime_error_log` |
| GET | `/api/v1/audit/runtime-errors/{errorId}` | 查询错误详情 | `lc_runtime_error_log` |

规则：

```text
1. 审计和安全 API 默认仅平台管理员可访问。
2. 应用管理员可以查看本应用范围内审计日志，是否开放由权限策略决定。
3. request_summary_json、response_summary_json 必须脱敏。
4. 不得返回密码、Token、密钥、完整 storage_path。
```

---

## 31. 运行态诊断与一致性巡检 API

### 31.1 诊断 API 清单

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/v1/admin/diagnostics/runtime-health` | 运行态健康检查。 |
| POST | `/api/v1/admin/diagnostics/consistency-check` | 执行一致性巡检。 |
| GET | `/api/v1/admin/diagnostics/consistency-checks/{checkId}` | 查询巡检结果。 |

### 31.2 巡检项

```text
1. lc_app_runtime_pointer 指向的 app_version / snapshot 是否存在。
2. lc_business_record.snapshot_id 是否存在。
3. lc_workflow_instance.snapshot_id 是否存在。
4. lc_file_attachment.file_id 是否存在。
5. lc_metadata_dependency 是否存在 broken 依赖。
6. lc_business_record_index 是否与 lc_business_record.data_json 一致。
7. lc_business_unique_value 是否与业务记录当前值一致。
8. lc_app.current_version_id / current_snapshot_id 是否与 runtime_pointer 一致。
```

说明：

```text
1. P0 可以先实现诊断 API 的同步版本。
2. 大数据量场景后续可改为异步任务。
3. 巡检结果可以先写运行错误日志或审计日志，不强制单独建表。
```

---

## 32. 初始化与种子数据 API

P0 私有化部署可提供受保护的初始化 API，或通过安装脚本完成。

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/v1/admin/setup/init-default-tenant` | 初始化默认租户。 |
| POST | `/api/v1/admin/setup/init-admin-user` | 初始化超级管理员。 |
| POST | `/api/v1/admin/setup/init-sample-templates` | 初始化三个样板应用模板。 |
| POST | `/api/v1/admin/setup/install-sample-app` | 安装样板应用。 |

规则：

```text
1. 初始化 API 只能在系统未初始化或维护模式下调用。
2. 初始化 API 必须受部署密钥或本地管理员保护。
3. 初始化样板应用不得绕过元数据校验。
4. 初始化完成后应禁用或限制 setup API。
```

---

## 33. API 事务边界汇总

| 操作 | 事务边界 |
|---|---|
| 发布应用 | metadata_resource_version + metadata_snapshot + app_version + runtime_pointer + publish_log。 |
| 回滚应用 | runtime_pointer + rollback_log + app/app_version 冗余字段。 |
| 创建业务记录 | business_record + index + relation + unique_value + file_attachment + change_log + audit_log。 |
| 提交业务记录 | business_record + workflow_instance + workflow_task + workflow_trace + audit_log。 |
| 审批任务 | workflow_task + task_action + workflow_instance + business_record + workflow_trace + audit_log。 |
| 上传并绑定文件 | file_object + file_attachment + audit_log。 |
| 权限变更 | permission_policy / assignment + permission_change_log + cache invalidation。 |
| 删除资源 | 目标资源软删除 + recycle_item + audit_log。 |

事务规则：

```text
1. 写操作必须明确事务边界。
2. 主业务写成功但审计写失败时，必须有降级或补偿策略。
3. 发布和回滚失败不得留下被 runtime_pointer 引用的半成品。
4. 业务记录写入失败不得产生孤儿索引、孤儿唯一值或孤儿附件绑定。
```

---

## 34. 缓存与失效 API 约束

P0 可使用 Redis 或本地缓存保存运行态模型、权限结果和字典数据。

### 34.1 缓存 Key 建议

```text
runtime_model:{tenantId}:{appId}:{snapshotId}
effective_permission:{tenantId}:{appId}:{snapshotId}:{userId}
app_pointer:{tenantId}:{appId}
org_user_roles:{tenantId}:{userId}
```

### 34.2 必须失效缓存的事件

```text
1. 应用发布成功。
2. 应用回滚成功。
3. 应用停用或启用。
4. 用户角色变更。
5. 应用成员变更。
6. 权限策略或分配变更。
7. 组织结构变更。
```

### 34.3 缓存约束

```text
1. 缓存不得作为权限唯一来源。
2. 缓存 Key 必须包含 tenantId。
3. 运行态模型缓存必须包含 snapshotId。
4. 回滚后不得继续使用旧 pointer 缓存。
```

---

## 35. 样板应用 API 覆盖

### 35.1 合同管理

必须覆盖：

```text
1. 从模板创建合同管理应用。
2. 发布合同管理应用。
3. 获取合同列表视图。
4. 创建合同记录。
5. 合同编号自动生成。
6. 合同金额进入索引表。
7. 合同附件上传和绑定。
8. 提交合同审批。
9. 法务、财务审批。
10. 权限裁剪金额字段和法务意见字段。
```

### 35.2 费用报销

必须覆盖：

```text
1. 从模板创建费用报销应用。
2. 创建报销单。
3. 报销单号自动生成。
4. 报销明细进入 data_json。
5. 发票附件绑定。
6. 直属上级和财务审批。
7. 本人、本部门、财务全部数据权限。
```

### 35.3 采购申请

必须覆盖：

```text
1. 从模板创建采购申请应用。
2. 创建采购申请。
3. 供应商 lookup 关系维护。
4. 采购金额、供应商、采购部门进入索引表。
5. 部门负责人、采购、财务审批。
6. 采购角色和财务角色数据权限。
```

---

## 36. 后续 OpenAPI 生成输入

生成 OpenAPI 时必须遵守：

```text
1. 所有路径以 /api/v1 开头。
2. 所有接口返回统一响应结构。
3. 分页接口返回 PageResult。
4. 错误响应引用统一 ErrorResponse。
5. 认证使用 Bearer Token。
6. 高风险写接口声明 X-Idempotency-Key。
7. 所有 appId、entityKey、recordId、taskId、fileId 等路径参数必须有描述。
8. 运行态业务数据 DTO 中 data 字段为 object，但必须说明由 snapshot 校验。
9. DSL 字段为 object，但必须说明由 schemaVersion 校验。
10. 文件上传使用 multipart/form-data。
```

---

## 37. 后续后端服务设计输入

后端服务建议按模块拆分：

```text
auth-service
app-service
org-service
metadata-service
permission-service
release-service
runtime-model-service
record-service
workflow-service
file-service
audit-service
recycle-service
diagnostic-service
```

每个服务至少定义：

```text
1. Controller API。
2. Application Service。
3. Domain Service。
4. Repository。
5. DTO / VO / Query。
6. Permission Guard。
7. Audit Writer。
8. Transaction Boundary。
```

约束：

```text
1. 不得把所有表写入一个巨型 Repository。
2. record-service 不得直接读取 design draft_json。
3. runtime-model-service 是读取运行快照的统一入口。
4. permission-service 是权限计算和字段裁剪的统一入口。
5. file-service 是文件绑定和下载鉴权的统一入口。
```

---

## 38. API 测试用例输入

后续测试用例至少覆盖：

```text
1. 未登录访问返回 UNAUTHORIZED。
2. 无应用权限访问返回 PERMISSION_DENIED。
3. 设计态修改不影响运行态模型。
4. 发布失败不切换 runtime_pointer。
5. 发布成功后运行态读取新 snapshot。
6. 回滚只切换 pointer，不修改旧 snapshot。
7. 创建业务记录写入 app_version_id 和 snapshot_id。
8. 字段越权提交被拒绝并记录安全事件。
9. 列表查询执行数据权限。
10. 详情响应执行字段裁剪。
11. 唯一字段并发写入只有一个成功。
12. 自动编号并发生成不重复。
13. 审批重复请求被幂等拦截。
14. 非处理人审批返回 WORKFLOW_TASK_INVALID 或 PERMISSION_DENIED。
15. 文件下载必须校验 lc_file_attachment。
16. 无权限附件下载被拒绝并记录日志。
17. 删除资源进入回收站。
18. 回收站恢复冲突进入 blocked 或要求重命名。
19. tenantId 条件存在，跨租户数据不可见。
20. 审计接口不返回敏感明文。
```

---

## 39. 给 AI 生成 API / 代码的强约束

### 39.1 API 生成约束

```text
1. 运行态 API 必须以 /api/v1/runtime/apps/{appId} 开头。
2. 运行态 API 必须先读取 lc_app_runtime_pointer。
3. 运行态 API 不得读取 lc_metadata_resource.draft_json。
4. 设计态 API 不得直接修改 lc_metadata_snapshot。
5. 发布 API 必须生成不可变 metadata_snapshot。
6. 回滚 API 只能切换 runtime pointer。
7. 业务数据 API 不得为 contract、expense_report、purchase_request 生成专属物理表接口。
8. 业务记录新增和编辑必须执行字段权限校验。
9. 列表和详情响应必须执行字段权限裁剪。
10. 附件下载必须以 lc_file_attachment 为权威绑定关系执行鉴权。
11. 高风险写接口必须支持幂等。
12. API 不得暴露 password_hash、password_salt、storage_path、Token、密钥。
```

### 39.2 Controller 生成约束

```text
1. Controller 只做参数接收、上下文提取、权限入口和响应包装。
2. Controller 不直接访问 Repository。
3. Controller 不直接拼 SQL。
4. Controller 不直接执行 DSL 表达式。
5. Controller 必须传递 requestId、traceId、userContext。
```

### 39.3 Service 生成约束

```text
1. Service 必须承载事务边界。
2. 发布、回滚、审批、业务记录写入必须显式开启事务。
3. Service 必须调用 permission-service 做权限校验。
4. Service 必须调用 audit-service 写审计。
5. Service 必须调用 runtime-model-service 读取运行快照。
6. Service 不得信任前端隐藏字段。
```

### 39.4 DTO 生成约束

```text
1. Request DTO 不得直接复用数据库 Entity。
2. Response DTO 不得返回敏感字段。
3. 运行态 data 字段使用 Map/Object，但必须经过 snapshot 校验。
4. DSL 字段使用 Map/Object，但必须经过 schemaVersion 校验。
5. 所有写 DTO 必须包含 version 或幂等键策略。
```

---

## 40. 附录：P0 API 红线

```text
1. 不得让运行态 API 读取草稿元数据。
2. 不得让前端权限裁剪替代后端权限校验。
3. 不得让前端生成最终自动编号。
4. 不得只通过先查后写实现唯一字段并发控制。
5. 不得下载未经过绑定关系鉴权的附件。
6. 不得把 storage_path 直接返回给前端作为下载地址。
7. 不得在业务数据 API 中绕过 app_runtime_pointer。
8. 不得让流程实例在执行时读取最新草稿流程定义。
9. 不得在回滚时修改历史 snapshot。
10. 不得让发布失败切换运行指针。
11. 不得把用户密码字段放入 lc_user。
12. 不得在列表查询中忽略数据权限。
13. 不得在详情响应中返回无权字段。
14. 不得在 API 查询中省略 tenantId 条件。
15. 不得将 lc_business_record_attachment 作为附件鉴权权威来源。
```

---

## 41. 后续文档衔接

本文档完成后，建议进入：

```text
1. 40A-openapi-spec.yaml，基于本文生成 OpenAPI 结构化接口规范。
2. 50-backend-service-design.md，定义后端服务、事务、领域边界和代码结构。
3. 60-frontend-runtime-renderer-design.md，定义运行态渲染器如何消费 runtime model API。
4. 70-test-case-design.md，基于 API 和数据库事务边界生成测试用例。
```

如果不单独产出 `40A-openapi-spec.yaml`，则 `50-backend-service-design.md` 必须直接引用本文作为接口输入。
