---
title: 测试与验收计划
subtitle: 企业级低代码平台 v1.1｜P0 测试策略、验收场景、功能映射与 Codex 质量门禁
version: v1.1
date: 2026-05-06
status: 增强基线版
depends_on:
  - 00-project-context-summary.md
  - 00-project-doc-index.md
  - 00-current-working-plan.md
  - 00-decision-log.md
  - 20-system-architecture-design.md
  - 30-core-database-design.md
  - 40-api-design.md
  - 45-tech-stack-and-scaffold-decision.md
  - 50-backend-service-design.md
  - 60-frontend-runtime-renderer-design.md
  - 61-frontend-page-and-component-design.md
  - 70-development-task-breakdown.md
  - 90-metadata-dsl-guideline.md
---

# 80-test-and-acceptance-plan.md

版本：v1.1  
适用范围：低代码平台 P0 测试策略、测试分层、验收标准、样板应用验收、Codex 生成代码质量门禁、前后端联调验收  
最后更新：2026-05-06  
状态：增强基线版

---

## 1. 文档目的

本文档定义企业级低代码平台 P0 阶段的测试与验收计划，承接：

```text
20-system-architecture-design.md
30-core-database-design.md
40-api-design.md
45-tech-stack-and-scaffold-decision.md
50-backend-service-design.md
60-frontend-runtime-renderer-design.md
61-frontend-page-and-component-design.md
70-development-task-breakdown.md
90-metadata-dsl-guideline.md
```

本文档用于指导：

```text
1. Codex 生成代码后的质量检查。
2. 前端、后端、数据库、API、Mock、E2E 的测试范围定义。
3. P0 主闭环验收。
4. 合同管理、费用报销、采购申请三个样板应用验收。
5. 发布快照、回滚、权限、字段裁剪、流程审批、附件鉴权、审计等核心机制验收。
6. 开发任务进入完成状态前的检查门禁。
7. 后续生成自动化测试、验收脚本、CI 检查配置的输入。
```

本文档不是完整测试用例脚本，不替代单元测试代码、接口自动化脚本或 E2E 测试脚本；但本文档必须作为后续生成测试用例目录、测试编号、CI 门禁、验收报告和 Codex 执行检查的基线。后续可以基于本文生成：

```text
1. JUnit / Spring Boot Test 测试用例。
2. React Testing Library / Vitest 前端测试。
3. Playwright E2E 测试。
4. API 集成测试集合。
5. Mock 场景数据。
6. CI 质量门禁配置。
```

---

## 2. 测试与验收目标

| 目标 | 说明 |
|---|---|
| 验证 P0 主闭环 | 应用创建、数据建模、表单配置、流程审批、权限控制、发布运行、数据沉淀、审计追踪必须可跑通。 |
| 验证元数据驱动 | 运行态页面必须由 RuntimeModel / Metadata Snapshot 驱动，不得硬编码合同、报销、采购页面。 |
| 验证快照隔离 | 设计态修改不得影响当前运行态；发布成功后才切换运行指针；回滚只切换指针。 |
| 验证权限安全 | 菜单、对象、数据、字段、流程任务、文件下载必须由后端最终鉴权，前端只做表现裁剪。 |
| 验证通用数据模型 | 业务数据必须进入 `lc_business_record`，索引字段进入 `lc_business_record_index`，不得生成业务对象专表。 |
| 验证流程可用 | 提交表单可发起审批；待办可审批通过/驳回；流程实例绑定启动时快照。 |
| 验证三样板应用 | 合同管理、费用报销、采购申请必须覆盖主表、子表、附件、流程、权限、列表、详情、审计。 |
| 验证 Codex 产物质量 | 代码必须遵守文档约束、工程结构、检查命令和 P0 不做范围。 |

---

## 3. 测试与验收原则

```text
1. 先验证主闭环，再验证边界和异常。
2. 先验证 Mock 可运行，再验证真实后端联调。
3. 先验证后端强约束，再验证前端表现。
4. 运行态所有测试必须经过 RuntimeModel，不得绕过渲染器。
5. 权限、字段裁剪、附件下载、审批任务必须以后端结果为准。
6. 自动化测试优先覆盖高风险链路：发布、回滚、保存、提交、审批、下载、权限拒绝。
7. 测试数据必须覆盖合同、报销、采购三个样板应用。
8. 测试失败不得通过隐藏错误、跳过校验或降低权限约束解决。
9. 不以页面能打开作为完成标准，必须满足数据、权限、流程、审计和异常状态验收。
10. Codex 每批任务完成后必须运行对应检查命令，并记录未完成项。
```

---

## 4. P0 测试范围

| 测试域 | P0 覆盖内容 |
|---|---|
| 工程脚手架测试 | Monorepo、前端、后端、数据库迁移、Mock、启动命令、构建命令。 |
| 前端页面测试 | 登录、应用中心、模板、设计态页面、运行态页面、任务中心、审计安全、诊断页面。 |
| Runtime Renderer 测试 | RuntimeModel Adapter、组件注册表、字段组件、表单、列表、详情、审批、dirty state、版本冲突。 |
| 后端服务测试 | Auth、App、Org、Metadata、Permission、Release、Runtime、Record、Workflow、File、Audit、Recycle、Diagnostics。 |
| API 测试 | `/api/v1` 统一响应、认证、权限、分页、过滤、错误码、幂等、审计。 |
| 数据库测试 | Flyway 迁移、核心表存在、唯一约束、软删除策略、快照不可变、索引同步。 |
| 权限测试 | 应用权限、菜单权限、对象权限、数据权限、字段权限、流程任务权限、文件权限。 |
| 发布回滚测试 | 发布校验、快照生成、运行指针切换、失败不切换、回滚只切换指针。 |
| 流程测试 | 发起流程、生成待办、审批通过、驳回、任务版本冲突、流程轨迹。 |
| 文件测试 | 上传、绑定、预览、下载、无权限拒绝、访问日志、安全事件。 |
| 审计安全测试 | 高风险操作审计、安全事件、越权提交、附件拒绝、登录风险。 |
| E2E 验收 | 三个样板应用端到端场景。 |

---

## 5. P0 不做测试范围

```text
1. 不测试完整 SaaS 租户运营后台、计费套餐、资源配额。
2. 不测试插件市场、第三方组件安装、插件沙箱。
3. 不测试完整 BPMN 引擎能力。
4. 不测试复杂 BI、数据仓库、OLAP、指标宽表。
5. 不测试 AI 自动生成应用、提示词历史、训练数据。
6. 不测试原生移动端 App 和离线同步。
7. 不测试大规模性能压测，仅做 P0 级基础性能冒烟。
8. 不测试跨区域灾备和复杂高可用切换。
9. 不测试多数据库厂商的完整兼容矩阵，P0 以 PostgreSQL 为主。
10. 不测试外部 SSO、OIDC、SAML、企业微信、钉钉、飞书等深度集成。
```

---


## 6. 测试用例编号规则

### 6.1 编号目标

测试用例编号用于保证 P0 功能点、开发任务、自动化测试、缺陷记录和验收报告之间可追踪。后续 Codex 生成测试代码、测试报告或缺陷修复说明时，必须引用稳定测试编号。

### 6.2 编号格式

```text
TC-{测试层级}-{模块域}-{三位序号}
```

示例：

```text
TC-FE-APP-001
TC-RT-FORM-001
TC-BE-RECORD-001
TC-API-PUBLISH-001
TC-DB-SNAPSHOT-001
TC-E2E-CONTRACT-001
TC-PERM-FIELD-001
TC-SEC-FILE-001
```

### 6.3 测试层级编码

| 编码 | 含义 | 说明 |
|---|---|---|
| FE | 前端页面 / 组件测试 | 页面渲染、交互状态、路由、组件 Props。 |
| RT | Runtime Renderer 测试 | RuntimeModel Adapter、字段组件、列表、表单、详情、审批渲染。 |
| BE | 后端服务测试 | Application Service、Domain Service、事务边界、缓存、审计。 |
| API | API 契约与集成测试 | `/api/v1` 接口、错误码、分页、幂等、鉴权。 |
| DB | 数据库与迁移测试 | Flyway、表结构、约束、索引、快照不可变。 |
| E2E | 端到端验收测试 | 从页面到 API、后端、数据库的完整业务闭环。 |
| PERM | 权限专项测试 | 应用、菜单、对象、数据、字段、流程、文件权限。 |
| SEC | 安全专项测试 | 越权、敏感数据、附件拒绝、登录风险、安全事件。 |
| OPS | 诊断 / 运维测试 | 一致性巡检、健康检查、运行错误追踪。 |

### 6.4 模块域编码

| 编码 | 模块域 |
|---|---|
| AUTH | 认证登录 |
| APP | 应用中心 |
| TEMPLATE | 模板中心 |
| ORG | 组织用户角色 |
| METADATA | 元数据 / 数据建模 |
| FORM | 表单设计与表单运行 |
| VIEW | 视图 / 列表 |
| WORKFLOW | 流程设计与流程运行 |
| PERMISSION | 权限配置 |
| RELEASE | 发布、版本、回滚 |
| RUNTIME | 运行态模型 |
| RECORD | 通用业务数据 |
| SEQUENCE | 自动编号 |
| UNIQUE | 唯一字段 |
| FILE | 文件与附件 |
| RECYCLE | 回收站 |
| AUDIT | 审计日志 |
| SECURITY | 安全事件 |
| DIAG | 诊断与一致性巡检 |
| CONTRACT | 合同管理样板应用 |
| EXPENSE | 费用报销样板应用 |
| PURCHASE | 采购申请样板应用 |

### 6.5 测试用例记录字段模板

后续生成测试用例时，建议使用以下字段：

| 字段 | 说明 |
|---|---|
| case_id | 测试用例编号，例如 `TC-E2E-CONTRACT-001`。 |
| title | 测试标题。 |
| priority | P0-Must / P0-Recommended / P0-Optional。 |
| type | unit / integration / e2e / manual / smoke / security。 |
| related_docs | 关联文档编号，如 `40`、`60`、`80`。 |
| related_api | 关联 API。 |
| related_page | 关联页面或路由。 |
| preconditions | 前置条件。 |
| test_data | 测试数据。 |
| steps | 测试步骤。 |
| expected_result | 预期结果。 |
| automation | automated / manual / semi-automated。 |
| gate | Gate 1 / Gate 2 / Gate 3。 |

### 6.6 编号使用规则

```text
1. 测试编号创建后不得因文案调整而变更。
2. 删除测试用例时，编号不得复用。
3. P0-Must 测试不得降级为 skip / todo。
4. Codex 生成测试文件时，应在测试标题或描述中包含 case_id。
5. 验收报告必须按 case_id 汇总通过、失败、阻塞和未执行状态。
```

---

## 7. 测试覆盖与 P0 功能点映射

### 7.1 映射目标

本节用于保证 P0 主闭环中的每个功能点都有明确页面、API、后端服务、测试用例和验收标准。后续 Codex 生成测试、验收报告或修复缺陷时，必须以本表作为覆盖基线。

### 7.2 P0 功能点映射表

| P0 功能点 | 关联页面 / 路由 | 关联 API 域 | 关联后端服务 | 核心数据表 | 测试用例编号 | 自动化要求 | 验收标准 | 优先级 |
|---|---|---|---|---|---|---|---|---|
| 登录认证 | `/login` | Auth API | AuthService, UserAuthService | `lc_user`, `lc_user_auth`, `lc_security_event` | TC-API-AUTH-001, TC-FE-AUTH-001, TC-SEC-AUTH-001 | API + FE | 正确登录、失败提示、锁定/停用不可登录、安全事件记录。 | P0-Must |
| 应用列表 | `/apps` | App API | AppService | `lc_app`, `lc_app_member`, `lc_app_category` | TC-FE-APP-001, TC-API-APP-001 | FE + API | 可按权限看到应用，空状态、错误态、无权限态正常。 | P0-Must |
| 应用创建 | `/apps/new` | App API | AppService, AuditService | `lc_app`, `lc_app_member`, `lc_audit_log` | TC-E2E-APP-001, TC-BE-APP-001 | E2E | 创建应用成功后进入设计态，写入应用成员与审计。 | P0-Must |
| 模板创建应用 | `/templates`, `/apps/new?template=` | Template API | TemplateService, AppService, MetadataService | `lc_app_template`, `lc_app`, `lc_metadata_resource` | TC-E2E-TEMPLATE-001, TC-API-TEMPLATE-001 | E2E + API | 可从合同、报销、采购模板创建应用，新 ID 不复用模板 ID。 | P0-Must |
| 组织用户角色 | `/admin/org`, `/admin/users`, `/admin/roles` | Org API | OrgService, UserService, RoleService | `lc_org_unit`, `lc_user`, `lc_role`, `lc_user_org_unit`, `lc_user_role` | TC-E2E-ORG-001, TC-API-ORG-001 | E2E + API | 可维护组织、用户、角色，角色变更触发权限缓存失效。 | P0-Must |
| 数据建模 | `/apps/:appId/models` | Metadata API | MetadataService, DataModelService | `lc_metadata_resource`, `lc_metadata_dependency` | TC-E2E-METADATA-001, TC-BE-METADATA-001 | E2E + BE | 可创建对象和字段，依赖关系正确，未发布不影响运行态。 | P0-Must |
| 表单设计 | `/apps/:appId/forms` | Metadata API | FormDesignService, MetadataService | `lc_metadata_resource`, `lc_metadata_dependency` | TC-E2E-FORM-001, TC-FE-FORM-001 | E2E + FE | 可配置字段、分组、子表、必填/只读/可见，保存为 DSL。 | P0-Must |
| 视图 / 列表设计 | `/apps/:appId/views` | Metadata API | ViewDesignService | `lc_metadata_resource` | TC-E2E-VIEW-001, TC-RT-VIEW-001 | E2E + RT | 可配置列表列、筛选、排序，运行态按配置渲染。 | P0-Must |
| 流程设计 | `/apps/:appId/workflows` | Workflow Design API | WorkflowDesignService, MetadataService | `lc_metadata_resource`, `lc_metadata_dependency` | TC-E2E-WORKFLOW-001, TC-FE-WORKFLOW-001 | E2E + FE | 可配置开始、审批、条件、抄送、结束节点和审批人规则。 | P0-Must |
| 权限配置 | `/apps/:appId/permissions` | Permission API | PermissionService | `lc_permission_policy`, `lc_permission_assignment`, `lc_permission_change_log` | TC-E2E-PERMISSION-001, TC-PERM-APP-001 | E2E + PERM | 应用、菜单、对象、数据、字段、流程权限可保存并审计。 | P0-Must |
| 发布应用 | `/apps/:appId/releases` | Release API | PublishService, RuntimeModelService | `lc_app_version`, `lc_metadata_snapshot`, `lc_app_runtime_pointer`, `lc_publish_log` | TC-E2E-RELEASE-001, TC-BE-RELEASE-001 | E2E + BE | 发布成功生成不可变快照并切换 pointer；失败不切换。 | P0-Must |
| 回滚应用 | `/apps/:appId/releases` | Release API | RollbackService | `lc_app_runtime_pointer`, `lc_rollback_log`, `lc_app_version` | TC-E2E-RELEASE-002, TC-BE-RELEASE-002 | E2E + BE | 回滚只切换运行指针，不改历史快照和历史业务记录。 | P0-Must |
| 运行态模型加载 | `/runtime/apps/:appId` | Runtime API | RuntimeModelService | `lc_app_runtime_pointer`, `lc_metadata_snapshot` | TC-RT-RUNTIME-001, TC-API-RUNTIME-001 | RT + API | 运行态只读取当前快照，不读取草稿元数据。 | P0-Must |
| 运行态列表 | `/runtime/apps/:appId/entities/:entityKey/list` | Runtime Record API | RecordQueryService, PermissionService | `lc_business_record`, `lc_business_record_index` | TC-RT-VIEW-002, TC-E2E-RUNTIME-001 | RT + E2E | 列表按数据权限过滤，字段权限裁剪，分页筛选排序可用。 | P0-Must |
| 运行态表单填写 | `/runtime/apps/:appId/entities/:entityKey/new` | Runtime Record API | RecordCommandService, RuntimeValidationService | `lc_business_record`, `lc_business_record_index`, `lc_business_unique_value` | TC-RT-FORM-001, TC-E2E-RUNTIME-002 | RT + E2E | 按 RuntimeModel 渲染，dirty state、字段校验、唯一校验可用。 | P0-Must |
| 运行态详情 | `/runtime/apps/:appId/entities/:entityKey/:recordId` | Runtime Record API | RecordQueryService | `lc_business_record`, `lc_business_record_change_log` | TC-RT-DETAIL-001, TC-E2E-RUNTIME-003 | RT + E2E | 详情字段按权限裁剪，可查看变更与审批信息。 | P0-Must |
| 自动编号 | 表单运行态 | Runtime Record API | SequenceService | `lc_sequence_counter`, `lc_business_record` | TC-BE-SEQUENCE-001, TC-E2E-SEQUENCE-001 | BE + E2E | 后端生成编号，并发不重复，失败允许跳号但不重复。 | P0-Must |
| 唯一字段 | 表单运行态 | Runtime Record API | UniqueValueService | `lc_business_unique_value`, `lc_business_record_index` | TC-BE-UNIQUE-001, TC-E2E-UNIQUE-001 | BE + E2E | 并发保存唯一字段不能重复，冲突返回明确错误。 | P0-Must |
| Lookup 字段 | 表单运行态 / Lookup 弹窗 | Runtime Lookup API | LookupService, PermissionService | `lc_business_record`, `lc_business_record_index`, `lc_business_record_relation` | TC-RT-LOOKUP-001, TC-API-LOOKUP-001 | RT + API | Lookup 支持搜索、分页、回显，结果经过后端权限过滤。 | P0-Must |
| Subtable 字段 | 表单运行态 | Runtime Record API | RuntimeValidationService | `lc_business_record.data_json` | TC-RT-SUBTABLE-001, TC-E2E-SUBTABLE-001 | RT + E2E | 行级、表级、跨行校验可用，后端重新校验。 | P0-Must |
| 文件上传与绑定 | 表单 / 详情 / 审批意见 | File API | FileService, FileAttachmentService | `lc_file_object`, `lc_file_attachment`, `lc_file_access_log` | TC-E2E-FILE-001, TC-SEC-FILE-001 | E2E + SEC | 上传后绑定权威表，下载/预览必须鉴权并记录访问。 | P0-Must |
| 提交流程 | 运行态表单 | Workflow API | WorkflowRuntimeService, RecordCommandService | `lc_workflow_instance`, `lc_workflow_task`, `lc_workflow_trace` | TC-E2E-WORKFLOW-002, TC-BE-WORKFLOW-001 | E2E + BE | 提交记录后创建流程实例和首批待办，绑定 snapshotId。 | P0-Must |
| 审批待办 | `/tasks/todo`, `/tasks/:taskId` | Workflow API | WorkflowTaskService | `lc_workflow_task`, `lc_workflow_task_action` | TC-E2E-WORKFLOW-003, TC-BE-WORKFLOW-002 | E2E + BE | 可审批通过/驳回，taskVersion 冲突有明确提示。 | P0-Must |
| 字段权限 | 运行态列表 / 表单 / 详情 / 审批 | Runtime + Permission API | PermissionService, FieldPermissionService | `lc_permission_policy`, `lc_metadata_snapshot` | TC-PERM-FIELD-001, TC-RT-FORM-002 | PERM + RT | 不可见字段不返回，不可编辑字段提交被后端拒绝。 | P0-Must |
| 数据权限 | 运行态列表 / 详情 | Runtime Record API | PermissionService, RecordQueryService | `lc_business_record`, `lc_business_record_index` | TC-PERM-DATA-001, TC-E2E-PERMISSION-002 | PERM + E2E | 用户只能访问本人/本部门/被授权数据，越权返回拒绝。 | P0-Must |
| 审计日志 | `/audit/logs` | Audit API | AuditService | `lc_audit_log`, `lc_audit_log_detail` | TC-E2E-AUDIT-001, TC-API-AUDIT-001 | E2E + API | 发布、权限、数据、审批、文件等关键操作可追踪。 | P0-Must |
| 安全事件 | `/security/events` | Security API | SecurityEventService | `lc_security_event` | TC-SEC-PERMISSION-001, TC-SEC-FILE-002 | SEC | 字段越权、文件拒绝、权限拒绝等产生安全事件。 | P0-Must |
| 回收站 | `/recycle` | Recycle API | RecycleService | `lc_recycle_item` | TC-E2E-RECYCLE-001, TC-BE-RECYCLE-001 | E2E + BE | 删除进入回收站，恢复前做冲突校验，禁止不安全彻底删除。 | P0-Must |
| 一致性巡检 | `/diagnostics/consistency` | Diagnostics API | ConsistencyCheckService | 多表 | TC-OPS-DIAG-001, TC-BE-DIAG-001 | OPS + BE | 可检查 pointer、snapshot、index、unique、file binding 等一致性。 | P0-Recommended |
| 合同管理样板应用 | 合同应用运行态 | Runtime / Workflow / File API | Record, Workflow, File, Permission | 多表 | TC-E2E-CONTRACT-001 至 009 | E2E | 完成合同创建、附件、审批、权限、审计主流程。 | P0-Must |
| 费用报销样板应用 | 报销应用运行态 | Runtime / Workflow / File API | Record, Workflow, File, Permission | 多表 | TC-E2E-EXPENSE-001 至 009 | E2E | 完成报销创建、明细、发票、审批、权限、审计主流程。 | P0-Must |
| 采购申请样板应用 | 采购应用运行态 | Runtime / Workflow / File API | Record, Workflow, File, Permission | 多表 | TC-E2E-PURCHASE-001 至 009 | E2E | 完成采购创建、明细、供应商、审批、权限、审计主流程。 | P0-Must |

### 7.3 覆盖规则

```text
1. P0-Must 功能点至少需要一个自动化测试或半自动化验收脚本。
2. 涉及权限、安全、快照、发布、回滚、文件鉴权的功能点必须包含失败路径测试。
3. 三个样板应用必须覆盖主表、子表、附件、流程、权限、审计。
4. Mock 验收可以验证 UI 和交互完整性，但不能替代真实联调验收。
5. 后续新增 P0 功能时，必须先补本映射表，再补测试用例。
```

---

## 8. CI 质量门禁分级

### 8.1 门禁目标

CI 门禁用于约束 Codex 或开发人员每批代码变更后的最低质量检查。任何任务不得仅以“代码已生成”作为完成标准。

### 8.2 门禁分级

| 门禁 | 触发时机 | 必须通过项 | 失败处理 |
|---|---|---|---|
| Gate 0 文档约束门禁 | Codex 开始任务前 | 必读文档存在；任务范围明确；不做范围明确。 | 缺文档或范围不清时不得开始生成代码。 |
| Gate 1 本地开发门禁 | 每个 Codex 批次结束 | install、lint、typecheck、build、相关单测。 | 必须修复或明确列出阻塞原因。 |
| Gate 2 PR 合并门禁 | 合并到主分支前 | lint、typecheck、unit test、API mock test、数据库迁移校验。 | 不得合并。 |
| Gate 3 集成验收门禁 | 进入联调 / 演示前 | 前后端启动、核心 API 集成、样板应用 smoke、权限和文件专项。 | 不得标记为可验收。 |
| Gate 4 P0 完整验收门禁 | P0 验收前 | 完整 E2E、权限、安全、发布回滚、流程、文件、审计、H5 冒烟。 | 不得通过 P0 验收。 |

### 8.3 推荐命令映射

| 命令 | Gate 1 | Gate 2 | Gate 3 | Gate 4 |
|---|---:|---:|---:|---:|
| `npm install` / `npm ci` | 必须 | 必须 | 必须 | 必须 |
| `npm run lint` | 必须 | 必须 | 必须 | 必须 |
| `npm run typecheck` | 必须 | 必须 | 必须 | 必须 |
| `npm run build` | 必须 | 必须 | 必须 | 必须 |
| `npm run test` | 相关模块 | 必须 | 必须 | 必须 |
| `npm run test:e2e` | 可选 | 关键 smoke | 必须 | 必须 |
| `mvn test` | 相关模块 | 必须 | 必须 | 必须 |
| `mvn verify` | 可选 | 必须 | 必须 | 必须 |
| `flyway validate` | 数据库变更时 | 必须 | 必须 | 必须 |
| `docker compose up` 冒烟 | 可选 | 可选 | 必须 | 必须 |

### 8.4 门禁红线

```text
1. Gate 2 / Gate 3 失败时，不得把任务状态标记为完成。
2. 不得通过关闭 lint、降低 typecheck 或删除失败测试来通过门禁。
3. P0-Must 功能的测试不得被移动到 optional job。
4. Mock 验收通过不得替代 Gate 4 真实联调验收。
```

---

## 9. 测试数据重置策略

### 9.1 数据分层

| 数据层 | 示例 | 重置策略 |
|---|---|---|
| 基础 seed 数据 | 默认租户、管理员、角色、分类 | 每次环境初始化固定写入，可重复执行。 |
| 样板模板数据 | 合同、报销、采购模板 | 固定版本 seed，不由 E2E 随意修改。 |
| Mock Runtime 数据 | RuntimeModel JSON、Mock 记录、Mock 待办 | 每次前端 Mock 测试前重置到 fixtures。 |
| E2E 临时业务数据 | 测试合同、报销单、采购单 | 使用 `test_run_id` 标记，测试后清理或软删除。 |
| 文件测试数据 | 测试附件、图片、发票 | 使用测试 bucket / test directory，测试后清理。 |
| 审计与安全事件 | 测试产生的 audit/security log | 可保留用于验收报告，但必须带 `test_run_id`。 |

### 9.2 重置规则

```text
1. 每轮 E2E 前必须初始化默认租户、管理员、测试角色和三个样板应用。
2. 自动编号计数器允许跳号，不要求回滚到原值，但不得重复。
3. 业务记录、流程任务、附件、审计、安全事件必须能按 test_run_id 查询。
4. Mock 数据重置不得影响真实联调数据库。
5. 真实联调测试不得污染默认演示账号、模板元数据和基线快照。
6. 删除测试业务数据时优先软删除；涉及审计、流程、附件的数据不得物理删除。
```

### 9.3 测试运行标识

建议每次自动化测试生成：

```text
test_run_id = p0-{yyyyMMddHHmmss}-{shortRandom}
```

使用位置：

```text
1. 业务记录 remark 或 data_json.testRunId。
2. 审计 request_summary_json.testRunId。
3. 文件 original_name 或 metadata.testRunId。
4. Playwright / JUnit 测试报告。
```

---

## 10. Mock 验收与真实联调验收边界

### 10.1 Mock 验收目标

Mock 验收用于验证前端页面、Runtime Renderer、交互状态、样板应用演示路径和异常态展示是否完整。

Mock 验收允许：

```text
1. 使用 MSW / Mock Service。
2. 使用静态 RuntimeModel JSON。
3. 使用内存数据模拟业务记录、审批、发布、回滚。
4. 使用 mock file url 模拟附件预览和下载。
5. 使用 mock 权限结果验证前端可见、只读、隐藏、禁用表现。
```

Mock 验收不代表：

```text
1. 不代表真实后端权限安全成立。
2. 不代表数据库事务正确。
3. 不代表发布快照真实生成。
4. 不代表附件下载真实鉴权完成。
5. 不代表审计和安全事件真实落库。
```

### 10.2 真实联调验收目标

真实联调验收用于验证前端、后端、数据库、文件存储、权限、流程、审计的真实闭环。

真实联调必须验证：

```text
1. 真实登录认证和会话上下文。
2. 真实 app_runtime_pointer 与 metadata_snapshot。
3. 真实 business_record、business_record_index、business_unique_value 写入。
4. 真实 workflow_instance、workflow_task、workflow_task_action 写入。
5. 真实 lc_file_attachment 权威鉴权。
6. 真实 audit_log 与 security_event 写入。
7. 发布失败、回滚、版本冲突、权限拒绝等真实失败路径。
```

### 10.3 边界规则

```text
1. P0 最小可演示版本可以通过 Mock 验收。
2. P0 完整验收版本必须通过真实联调验收。
3. Mock API 返回的数据结构必须与 40-api-design.md 一致。
4. Mock 中通过的权限表现必须在真实联调中由后端再次验证。
5. 验收报告必须明确当前结果属于 Mock 验收还是真实联调验收。
```

---

## 11. 最小自动化测试集

### 11.1 定义

最小自动化测试集是每个 Codex 开发批次结束后必须执行的最低测试集合。该集合不覆盖所有 P0 场景，但必须防止主干代码不可启动、核心渲染器不可用、核心服务被破坏。

### 11.2 最小测试项

| 编号 | 测试项 | 建议用例编号 | 检查方式 | Gate |
|---|---|---|---|---|
| MAT-01 | 前端依赖安装成功 | TC-FE-SCAFFOLD-001 | `npm ci` | Gate 1 |
| MAT-02 | 前端 lint/typecheck/build 通过 | TC-FE-SCAFFOLD-002 | `npm run lint && npm run typecheck && npm run build` | Gate 1 |
| MAT-03 | 核心路由可渲染 | TC-FE-ROUTE-001 | Vitest / Playwright smoke | Gate 1 |
| MAT-04 | RuntimeModel Adapter 单测通过 | TC-RT-RUNTIME-001 | Vitest | Gate 1 |
| MAT-05 | 字段权限裁剪单测通过 | TC-RT-FORM-002 | Vitest | Gate 1 |
| MAT-06 | recordVersion / taskVersion 冲突提示可用 | TC-RT-VERSION-001 | Vitest / Playwright | Gate 1 |
| MAT-07 | Mock Runtime API 正常响应 | TC-API-MOCK-001 | Mock API test | Gate 1 |
| MAT-08 | 后端核心单测通过 | TC-BE-SCAFFOLD-001 | `mvn test` | Gate 1 |
| MAT-09 | 发布失败不切换 pointer | TC-BE-RELEASE-001 | Spring Boot Test | Gate 2 |
| MAT-10 | 附件无权限下载被拒绝 | TC-SEC-FILE-001 | API / Service Test | Gate 2 |
| MAT-11 | 三个样板应用 smoke 可跑 | TC-E2E-CONTRACT-001, TC-E2E-EXPENSE-001, TC-E2E-PURCHASE-001 | Playwright smoke | Gate 3 |
| MAT-12 | Docker Compose 环境启动冒烟 | TC-OPS-SCAFFOLD-001 | health check | Gate 3 |

### 11.3 Codex 执行要求

```text
1. Codex 每完成一个任务批次，必须优先运行本批次相关的最小测试项。
2. 若测试失败，必须先修复再继续扩展功能。
3. 若因环境缺失无法运行，必须在结果说明中列出无法运行的命令和原因。
4. 不得通过删除测试、跳过测试或放宽断言来使最小测试集通过。
```

---

## 12. 验收角色与权限矩阵

| 角色 | 账号示例 | 必测页面 | 必测权限点 | 必测拒绝场景 |
|---|---|---|---|---|
| 平台管理员 | `admin` | 全部管理页、诊断、审计 | 用户、组织、角色、全局模板、审计查看 | 不得绕过字段权限直接改业务敏感字段。 |
| 应用管理员 | `app_admin` | 应用中心、设计态、发布、权限 | 管理所属应用、发布、回滚、配置权限 | 不得管理未授权应用。 |
| 应用设计者 | `designer` | 数据建模、表单、流程、视图 | 编辑设计态草稿 | 不得直接影响运行态。 |
| 普通员工 | `employee` | 运行态列表、表单、详情、本人待办 | 创建本人数据、查看本人数据 | 不得查看他人无授权数据。 |
| 部门负责人 | `manager` | 待办、部门数据列表 | 审批下属申请、查看本部门数据 | 不得查看其他部门数据。 |
| 法务审批人 | `legal` | 合同待办、合同详情 | 查看法务字段、填写法务意见 | 不得审批非自己待办。 |
| 财务审批人 | `finance` | 报销/采购待办、财务字段 | 查看金额、发票、预算字段 | 不得编辑已审批完成记录。 |
| 采购审批人 | `buyer` | 采购待办、供应商字段 | 查看采购明细、供应商信息 | 不得查看无授权合同/报销数据。 |

规则：

```text
1. 每个角色至少覆盖一个允许访问场景和一个拒绝访问场景。
2. 权限测试不得只验证菜单隐藏，必须验证 API 拒绝。
3. 字段权限必须同时验证列表、详情、表单、审批节点。
```

---

## 13. 缺陷等级与阻断规则

| 等级 | 定义 | 示例 | 是否阻断 P0 |
|---|---|---|---|
| Blocker | 主闭环不可用、数据损坏、安全绕过。 | 发布后运行态不可用；越权下载附件；审批写错记录。 | 是 |
| Critical | 核心功能不可用或高风险机制错误。 | 快照被原地修改；字段权限后端未校验；回滚改写历史数据。 | 是 |
| Major | 重要功能异常但有临时绕行方式。 | 某个设计器保存失败但可通过 API 保存；部分错误态缺失。 | 视情况 |
| Minor | 不影响主流程的展示或交互问题。 | 文案、间距、空状态提示不完整。 | 否 |
| Trivial | 不影响使用的小问题。 | 非关键页面图标或排序轻微问题。 | 否 |

阻断规则：

```text
1. 存在 Blocker 或 Critical 时，不得通过 P0 完整验收。
2. 存在安全、权限、数据一致性、快照隔离缺陷时，默认至少为 Critical。
3. Major 缺陷必须记录风险和修复计划，由项目负责人决定是否允许进入下一阶段。
4. Minor / Trivial 不得掩盖 P0-Must 功能未完成事实。
```

---

## 14. 不可接受的测试降级

以下行为属于不可接受的测试降级：

```text
1. 删除失败测试来使 CI 通过。
2. 将 P0-Must 测试改为 skip / todo / optional。
3. 关闭 lint、typecheck、build 严格检查。
4. 只测试前端菜单隐藏，不测试后端权限拒绝。
5. 用 Mock 验收替代真实联调验收。
6. 只测试 happy path，不测试权限拒绝、版本冲突、发布失败和附件拒绝。
7. 为了测试通过修改生产逻辑绕过权限、审计、幂等或快照校验。
8. 用固定 sleep 替代可靠的异步等待。
9. 在测试中硬编码管理员万能权限覆盖普通用户验收。
10. 忽略失败的数据库迁移或将迁移校验移出门禁。
11. 忽略安全事件或审计日志断言。
12. 将真实文件鉴权测试替换成 mock URL 是否可打开。
```

违反上述规则时，任务不得标记为完成，并应回到对应开发阶段修复。

---

## 15. 回归测试触发条件

以下变更必须触发完整或专项回归：

| 变更类型 | 必跑回归 |
|---|---|
| RuntimeModel 结构变化 | Runtime Renderer、样板应用运行态、字段权限、H5。 |
| 权限策略或权限服务变化 | 应用、菜单、对象、数据、字段、流程、文件权限全量专项。 |
| 发布 / 回滚逻辑变化 | 发布失败、发布成功、回滚、快照不可变、pointer 切换。 |
| `business_record` 写入逻辑变化 | 保存、提交、索引、唯一字段、自动编号、审计、回收站。 |
| `workflow_task` 状态机变化 | 待办、审批、驳回、taskVersion、流程轨迹。 |
| `file_attachment` 鉴权变化 | 上传、绑定、预览、下载、拒绝、安全事件。 |
| 数据库迁移脚本变化 | Flyway validate、核心表、索引、唯一约束、软删除策略。 |
| API 统一响应或错误码变化 | API 契约、前端错误处理、Mock API。 |
| 表单设计器或 Runtime 表单变更 | 字段组件、dirty state、lookup、subtable、附件。 |

---

## 16. Codex 生成测试代码要求

Codex 生成或修改代码时，必须遵守：

```text
1. 每个新增 P0-Must 功能必须新增或更新对应测试。
2. 每个修复缺陷必须补充回归测试，优先引用 case_id。
3. 每个批次结束必须运行最小自动化测试集中的相关命令。
4. 测试代码不得绕过真实服务边界，例如直接改数据库模拟审批完成。
5. 前端测试应覆盖 loading、empty、ready、error、permission_denied、version_conflict 状态。
6. 后端测试应覆盖事务成功与失败回滚路径。
7. API 测试应覆盖统一响应、错误码、权限拒绝、幂等冲突。
8. 安全测试不得只停留在前端禁用按钮层面。
9. 若不能运行测试，必须说明缺失命令、缺失依赖或环境限制。
10. 不得将测试文件写入临时目录后不纳入工程脚本。
```

---

## 17. 验收报告模板

### 17.1 报告元信息

```markdown
# P0 验收报告

验收版本：
验收日期：
验收环境：Mock / Integration / Staging
文档基线版本：
代码提交版本：
数据库迁移版本：
测试执行人：
验收负责人：
```

### 17.2 自动化测试结果

| 测试集 | 命令 | 结果 | 失败数量 | 报告链接 / 日志 |
|---|---|---|---:|---|
| 前端 lint | `npm run lint` | PASS / FAIL |  |  |
| 前端 typecheck | `npm run typecheck` | PASS / FAIL |  |  |
| 前端 build | `npm run build` | PASS / FAIL |  |  |
| 前端单测 | `npm run test` | PASS / FAIL |  |  |
| E2E | `npm run test:e2e` | PASS / FAIL |  |  |
| 后端单测 | `mvn test` | PASS / FAIL |  |  |
| 后端验证 | `mvn verify` | PASS / FAIL |  |  |
| 数据库迁移 | `flyway validate` | PASS / FAIL |  |  |

### 17.3 P0 功能点覆盖结果

| P0 功能点 | 测试用例编号 | 结果 | 备注 |
|---|---|---|---|
| 应用创建 | TC-E2E-APP-001 | PASS / FAIL / BLOCKED |  |
| 数据建模 | TC-E2E-METADATA-001 | PASS / FAIL / BLOCKED |  |
| 表单配置 | TC-E2E-FORM-001 | PASS / FAIL / BLOCKED |  |
| 流程审批 | TC-E2E-WORKFLOW-001 | PASS / FAIL / BLOCKED |  |
| 权限控制 | TC-E2E-PERMISSION-001 | PASS / FAIL / BLOCKED |  |
| 发布运行 | TC-E2E-RELEASE-001 | PASS / FAIL / BLOCKED |  |
| 数据沉淀 | TC-E2E-RUNTIME-001 | PASS / FAIL / BLOCKED |  |
| 审计追踪 | TC-E2E-AUDIT-001 | PASS / FAIL / BLOCKED |  |

### 17.4 样板应用验收结果

| 样板应用 | 主流程 | 子表 | 附件 | 流程 | 权限 | 审计 | 结果 |
|---|---|---|---|---|---|---|---|
| 合同管理 |  |  |  |  |  |  | PASS / FAIL |
| 费用报销 |  |  |  |  |  |  | PASS / FAIL |
| 采购申请 |  |  |  |  |  |  | PASS / FAIL |

### 17.5 缺陷与风险

| 缺陷编号 | 等级 | 描述 | 影响范围 | 处理状态 | 是否阻断 |
|---|---|---|---|---|---|
|  | Blocker / Critical / Major / Minor |  |  | open / fixed / accepted | yes / no |

### 17.6 验收结论

```text
验收结论：通过 / 有条件通过 / 不通过
是否允许进入下一阶段：是 / 否
遗留风险：
下一步动作：
负责人：
```

---
## 18. 测试分层策略

### 6.1 测试金字塔

| 层级 | 目标 | 工具建议 | 覆盖重点 |
|---|---|---|---|
| 静态检查 | 提前发现类型、格式、依赖、构建问题 | TypeScript、ESLint、Maven、Checkstyle 可选 | 编译、类型、导入、格式、目录约束。 |
| 单元测试 | 验证函数、组件、领域规则 | Vitest、React Testing Library、JUnit | Adapter、字段组件、权限规则、编号、唯一值、状态流转。 |
| 服务测试 | 验证后端服务用例 | Spring Boot Test、Testcontainers 可选 | 发布、回滚、保存记录、审批、文件鉴权、审计。 |
| API 集成测试 | 验证接口契约 | REST Assured / HTTP Client / Postman Collection | 统一响应、错误码、权限、幂等、分页、过滤。 |
| 前端集成测试 | 验证页面组件组合 | React Testing Library、MSW | 页面状态、Mock API、表单交互、错误态。 |
| E2E 测试 | 验证端到端业务闭环 | Playwright | 三个样板应用主流程、审批、权限、附件、发布回滚。 |
| 手工验收 | 验证体验和业务完整性 | 浏览器、验收清单 | 视觉、交互、异常提示、H5 自适应。 |

### 6.2 自动化优先级

| 优先级 | 自动化范围 |
|---|---|
| P0-Must | 构建、Lint、核心服务单测、API 冒烟、Runtime Renderer 核心渲染、主闭环 E2E。 |
| P0-Recommended | 权限矩阵、版本冲突、文件鉴权、发布回滚、三样板应用全路径 E2E。 |
| P0-Optional | 视觉快照、可访问性扫描、基础性能趋势、复杂异常矩阵。 |

---

## 19. 测试环境要求

### 7.1 本地开发测试环境

本地开发环境必须支持：

```text
1. 前端 Vite dev server。
2. 后端 Spring Boot 本地启动。
3. PostgreSQL 本地或 Docker Compose 启动。
4. Redis 本地或 Docker Compose 启动。
5. 本地文件存储或 S3 Compatible Mock。
6. Mock API 模式和真实 API 模式可切换。
7. Flyway migration 可重复执行。
```

### 7.2 Mock 前端测试环境

前端在没有真实后端时必须支持：

```text
1. 登录 Mock。
2. 合同、报销、采购三个样板应用 Mock。
3. RuntimeModel Mock。
4. 业务记录 Mock。
5. 待办任务 Mock。
6. 文件上传/预览/下载 Mock。
7. 权限拒绝 Mock。
8. 版本冲突 Mock。
9. RuntimeModel 不兼容 Mock。
10. 字段渲染异常 Mock。
```

### 7.3 集成测试环境

集成测试环境必须支持：

```text
1. 使用真实数据库迁移脚本。
2. 使用后端真实 API。
3. 使用前端真实构建产物或 dev server。
4. 初始化默认租户、管理员、角色、组织、样板模板。
5. 自动清理测试数据或使用独立测试租户。
```

---

## 20. 测试数据策略

### 8.1 基础数据

P0 测试必须初始化：

```text
1. 默认租户：default。
2. 超级管理员：admin。
3. 组织结构：总部、法务部、财务部、采购部、销售部、研发部。
4. 用户：普通员工、部门负责人、法务审批人、财务审批人、采购审批人、应用管理员、平台管理员。
5. 角色：platform_admin、app_admin、designer、employee、finance_approver、legal_approver、purchase_approver。
6. 应用模板：合同管理、费用报销、采购申请。
```

### 8.2 样板应用数据

| 样板应用 | 必须包含数据 |
|---|---|
| 合同管理 | 草稿合同、审批中合同、已通过合同、被驳回合同、带附件合同、金额字段受限合同。 |
| 费用报销 | 草稿报销单、待上级审批、待财务审批、已通过报销单、发票附件、费用明细子表。 |
| 采购申请 | 草稿采购申请、待部门负责人审批、待采购审批、待财务审批、供应商 lookup、采购明细子表。 |

### 8.3 权限测试数据

必须覆盖：

```text
1. 本人数据。
2. 本部门数据。
3. 全部数据。
4. 无数据权限。
5. 字段可见但只读。
6. 字段不可见。
7. 字段可编辑。
8. 按角色授权。
9. 按部门授权。
10. 按应用角色授权。
```

### 8.4 异常测试数据

必须覆盖：

```text
1. recordVersion 冲突。
2. taskVersion 冲突。
3. RuntimeModel 版本不兼容。
4. Metadata Snapshot 不存在。
5. 运行指针损坏。
6. 字段类型不匹配。
7. 子表行级校验失败。
8. lookup 无权限选项。
9. 附件下载无权限。
10. 幂等键冲突。
```

---

## 21. 质量门禁总览

| 门禁 | 必须通过条件 |
|---|---|
| 工程门禁 | 前端和后端均可安装、启动、构建。 |
| 静态门禁 | TypeScript 类型检查、ESLint、Maven 编译通过。 |
| 数据库门禁 | Flyway migration 可从空库执行成功。 |
| API 门禁 | 核心 API 冒烟通过，统一响应和错误码符合 `40-api-design.md`。 |
| 前端门禁 | P0 路由可访问，页面状态完整，Runtime Renderer 可渲染三样板应用。 |
| 后端门禁 | 核心服务事务、权限、审计、幂等、版本冲突处理通过测试。 |
| E2E 门禁 | 合同、报销、采购至少各一条主流程通过。 |
| 安全门禁 | 字段越权、数据越权、附件越权、任务越权必须被拒绝并记录。 |
| 验收门禁 | P0 最小可演示版本和完整验收版本定义均满足。 |

---

## 22. 推荐检查命令

### 10.1 前端检查命令

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

如果前端工程拆分为 workspace，必须支持：

```bash
npm run --workspace apps/web lint
npm run --workspace apps/web typecheck
npm run --workspace apps/web test
npm run --workspace apps/web build
```

### 10.2 后端检查命令

```bash
mvn clean test
mvn clean package
```

如果测试依赖数据库，可以提供：

```bash
docker compose up -d postgres redis
mvn clean verify
```

### 10.3 数据库检查命令

```bash
mvn flyway:migrate
mvn flyway:info
```

或通过应用启动自动执行 Flyway。

### 10.4 E2E 检查命令

```bash
npm run e2e
```

P0 初期如果 E2E 尚未接入，可以先要求：

```bash
npm run build
mvn clean test
```

并手工执行 P0 主闭环验收清单。

---

## 23. 前端测试计划

### 11.1 前端静态检查

| 检查项 | 验收标准 |
|---|---|
| TypeScript | 不允许存在阻塞构建的类型错误。 |
| ESLint | 不允许存在阻塞级 lint 错误。 |
| 构建 | `npm run build` 成功。 |
| 路由 | 所有 P0 路由可访问，无未捕获异常。 |
| API Client | 页面不得直接散落 fetch URL，必须经过统一 service / client。 |

### 11.2 Runtime Renderer 单元测试

| 测试项 | 验收标准 |
|---|---|
| RuntimeModel Adapter | 能接受 raw model，输出规范 RuntimeModel、warnings、unsupportedFeatures。 |
| 版本兼容 | 支持版本正常渲染，不支持版本显示 UnsupportedRuntimeModel。 |
| 组件注册表 | 内置字段组件、容器组件、动作组件、fallback 组件均注册成功。 |
| 字段组件 Props | 所有字段组件遵守统一 RuntimeFieldProps。 |
| 错误边界 | 单个字段渲染异常不导致整个页面白屏。 |
| Dirty State | 编辑后 dirty=true，保存成功后重置。 |
| 离开确认 | dirty=true 时路由离开、刷新、关闭抽屉需要确认。 |
| lookup | 支持搜索、分页、回显、无权限选项 disabled。 |
| subtable | 支持行级、表级、跨行校验错误展示。 |
| recordVersion | 后端返回版本冲突时显示冲突提示。 |
| taskVersion | 审批任务版本冲突时重新拉取任务详情。 |

### 11.3 页面级测试

| 页面域 | 必测页面 | 验收标准 |
|---|---|---|
| 认证 | 登录页 | 登录成功进入工作台，登录失败有错误提示。 |
| 应用中心 | 应用列表、应用详情 | 能展示合同、报销、采购应用，支持进入设计态和运行态。 |
| 模板 | 模板列表、创建应用 | 能从三个样板模板创建应用 Mock。 |
| 数据建模 | 对象列表、字段配置 | 能查看、创建、编辑对象与字段 Mock。 |
| 表单设计 | 表单设计器 | 能添加字段、调整顺序、配置属性、预览、保存 Mock。 |
| 流程设计 | 流程设计器 | 能配置开始、审批、条件、抄送、结束节点 Mock。 |
| 权限设计 | 权限配置页 | 能配置应用、对象、数据、字段、流程节点权限 Mock。 |
| 发布 | 发布管理 | 能执行发布校验、发布成功、发布失败、回滚 Mock。 |
| 运行态 | 列表、详情、表单 | 能通过 Runtime Renderer 渲染，字段权限表现正确。 |
| 任务中心 | 待办、已办、审批详情 | 能审批通过/驳回，处理版本冲突。 |
| 审计安全 | 审计日志、安全事件 | 能展示高风险操作和越权事件。 |
| 诊断 | 一致性巡检 | 能展示巡检结果 Mock。 |

### 11.4 前端页面状态测试

每个 P0 页面必须覆盖：

```text
1. loading
2. empty
3. ready
4. error
5. permission_denied
6. not_found
```

运行态页面额外覆盖：

```text
1. unsupported_model
2. version_conflict
3. render_error
4. submit_success
5. submit_failed
```

---

## 24. 后端测试计划

### 12.1 后端静态与构建测试

| 检查项 | 验收标准 |
|---|---|
| Maven 编译 | `mvn clean test` 成功。 |
| 包结构 | 符合 `50-backend-service-design.md` 模块划分。 |
| 分层 | Controller 不承载领域逻辑，Repository 不承载业务规则。 |
| 配置 | dev/test profile 可启动。 |
| Flyway | 空库可迁移成功。 |

### 12.2 认证与上下文测试

| 测试项 | 验收标准 |
|---|---|
| 登录成功 | 有效账号密码返回 token / session。 |
| 登录失败 | 错误密码返回认证失败，不泄露敏感信息。 |
| 用户停用 | 停用用户不得登录。 |
| Auth 状态 | 必须同时校验 `lc_user` 与 `lc_user_auth` 状态。 |
| 租户上下文 | 所有核心查询必须带 tenantId。 |
| 请求上下文 | requestId、traceId、userId、tenantId 可进入日志和审计。 |

### 12.3 应用与模板服务测试

| 测试项 | 验收标准 |
|---|---|
| 创建应用 | 生成 `lc_app`，初始化 owner 成员。 |
| 从模板创建应用 | 基于 `lc_app_template` 复制生成 app、metadata、permission。 |
| 应用列表 | 按权限返回可见应用。 |
| 应用停用 | 运行态不可访问，历史数据保留。 |
| 应用删除 | 进入回收站，不物理删除历史数据。 |

### 12.4 元数据服务测试

| 测试项 | 验收标准 |
|---|---|
| 保存草稿 | 只更新 `lc_metadata_resource.draft_json`。 |
| 依赖解析 | 写入或更新 `lc_metadata_dependency`。 |
| 删除保护 | 被引用资源不得直接删除。 |
| DSL 校验 | 不符合 Schema 的元数据不得发布。 |
| 运行态隔离 | 保存草稿不影响当前运行快照。 |

### 12.5 发布与回滚服务测试

| 测试项 | 验收标准 |
|---|---|
| 发布成功 | 生成 `lc_metadata_snapshot`、`lc_app_version`，切换 `lc_app_runtime_pointer`。 |
| 发布失败 | 不切换运行指针，写入 failed publish log。 |
| 快照不可变 | 发布后的 snapshot_json 不允许原地修改。 |
| 回滚成功 | 只切换 runtime pointer，不修改历史 snapshot。 |
| 缓存失效 | 发布和回滚后失效 RuntimeModel 与权限缓存。 |

### 12.6 权限服务测试

| 测试项 | 验收标准 |
|---|---|
| 应用访问 | 无应用权限不得进入运行态。 |
| 菜单权限 | 无菜单权限不得返回菜单项。 |
| 对象权限 | 无对象读取/写入权限不得操作记录。 |
| 数据权限 | 列表只返回允许范围数据。 |
| 字段权限 | 详情裁剪不可见字段，保存过滤不可编辑字段。 |
| deny 优先 | deny 策略优先于 allow。 |
| 权限变更 | 写入权限变更日志并失效缓存。 |

### 12.7 通用业务数据服务测试

| 测试项 | 验收标准 |
|---|---|
| 创建记录 | 写入 `lc_business_record`，绑定 appVersionId 与 snapshotId。 |
| 更新记录 | 校验 recordVersion，更新 data_json、index、relation、change_log、audit。 |
| 字段校验 | 类型、必填、格式、范围、唯一、子表规则后端重新校验。 |
| 索引同步 | searchable/filterable/sortable/permissionRelevant 字段同步到索引表。 |
| 唯一字段 | 通过 `lc_business_unique_value` 保证并发唯一。 |
| 自动编号 | 通过 `lc_sequence_counter` 后端生成，不重复。 |
| 删除记录 | 软删除并写入回收站或业务变更日志。 |

### 12.8 流程服务测试

| 测试项 | 验收标准 |
|---|---|
| 提交流程 | 创建 workflow_instance 和首批 workflow_task。 |
| 快照绑定 | instance/task 保存启动时 appVersionId 与 snapshotId。 |
| 审批通过 | 校验 taskVersion，写 task_action、trace，推进下一节点。 |
| 驳回 | 状态正确回写，记录审批意见。 |
| 任务越权 | 非处理人不得审批。 |
| 任务冲突 | 已完成任务再次审批返回冲突。 |
| 节点字段权限 | 审批时按节点权限校验可编辑字段。 |

### 12.9 文件服务测试

| 测试项 | 验收标准 |
|---|---|
| 上传文件 | 写入 `lc_file_object`。 |
| 绑定文件 | 写入权威绑定表 `lc_file_attachment`。 |
| 预览下载 | 必须鉴权后返回短期地址或流式响应。 |
| 无权限下载 | 返回拒绝，写入 file_access_log 或 security_event。 |
| 删除文件 | 有业务绑定时不得直接物理删除。 |
| 附件字段 | 业务记录保存时同步附件绑定。 |

### 12.10 审计与安全测试

| 测试项 | 验收标准 |
|---|---|
| 关键写操作 | 创建、更新、删除、发布、回滚、审批、下载写审计。 |
| 字段越权 | 记录 security_event。 |
| 数据越权 | 返回拒绝并记录。 |
| 文件越权 | 返回拒绝并记录。 |
| 登录风险 | 错误密码、账号锁定写安全事件。 |
| 脱敏 | 审计详情不得保存密码、Token、密钥明文。 |

---

## 25. API 测试计划

### 13.1 API 通用契约测试

| 测试项 | 验收标准 |
|---|---|
| 路径前缀 | 所有 API 使用 `/api/v1`。 |
| 统一响应 | 成功和失败响应结构符合 `40-api-design.md`。 |
| 错误码 | 权限、校验、版本冲突、幂等冲突、资源不存在有明确错误码。 |
| 分页 | pageNo、pageSize、total、items 语义一致。 |
| 排序过滤 | 不允许未授权字段过滤，不允许直接拼接 SQL。 |
| 幂等 | 高风险写接口支持 Idempotency-Key 或服务端幂等策略。 |
| 审计 | 高风险 API 触发审计或安全事件。 |

### 13.2 API 域验收清单

| API 域 | 必测能力 |
|---|---|
| Auth API | 登录、登出、当前用户、权限上下文。 |
| App API | 应用列表、创建、详情、成员、停用、删除。 |
| Template API | 模板列表、从模板创建应用。 |
| Org API | 部门树、用户列表、角色、用户角色关系。 |
| Metadata API | 资源草稿、版本、依赖、校验。 |
| Permission API | 策略、分配、预览、缓存失效。 |
| Release API | 发布校验、发布、版本列表、回滚。 |
| Runtime API | 运行态模型、菜单、视图、表单。 |
| Record API | 列表、详情、创建、编辑、提交、删除、lookup。 |
| Workflow API | 待办、已办、审批详情、通过、驳回。 |
| File API | 上传、绑定、预览、下载、删除。 |
| Audit API | 审计日志、安全事件、运行错误。 |
| Recycle API | 回收站列表、恢复、彻底删除限制。 |
| Diagnostics API | 一致性巡检、运行指针检查。 |

---

## 26. 数据库测试计划

### 14.1 Migration 测试

| 测试项 | 验收标准 |
|---|---|
| 空库迁移 | Flyway 可从空库执行到最新版本。 |
| 重复启动 | 已迁移数据库再次启动不失败。 |
| 表名前缀 | 所有核心表使用 `lc_` 前缀。 |
| tenant_id | 核心表包含 tenant_id。 |
| 软删除 | 核心业务表包含 is_deleted、deleted_by、deleted_at。 |
| 乐观锁 | 可编辑核心表包含 version。 |
| JSON 字段 | 元数据和业务数据表 JSON 字段存在。 |

### 14.2 数据模型红线测试

必须验证：

```text
1. 不存在 contract、expense_report、purchase_request 独立物理业务表。
2. 存在 lc_metadata_resource。
3. 存在 lc_metadata_snapshot。
4. 存在 lc_app_runtime_pointer。
5. 存在 lc_business_record。
6. 存在 lc_business_record_index。
7. 存在 lc_business_unique_value。
8. 存在 lc_sequence_counter。
9. 存在 lc_file_attachment。
10. 存在 lc_audit_log。
```

### 14.3 一致性测试

| 巡检项 | 验收标准 |
|---|---|
| runtime pointer | 指向的 app_version 和 snapshot 必须存在。 |
| business_record snapshot | 记录绑定的 snapshot 必须存在。 |
| workflow snapshot | 流程实例绑定的 snapshot 必须存在。 |
| file attachment | file_attachment 指向的 file_object 必须存在。 |
| metadata dependency | required 依赖不得 broken。 |
| record index | 索引表与 data_json 中对应字段一致。 |
| unique value | 唯一值占用与业务记录当前值一致。 |

---

## 27. Runtime Renderer 验收计划

### 15.1 RuntimeModel 验收

| 验收项 | 标准 |
|---|---|
| 加载模型 | 能通过 Runtime API 获取 appId 对应 RuntimeModel。 |
| 版本兼容 | 支持版本正常渲染，不支持版本显示错误页。 |
| Adapter | 能补齐默认值、输出 warnings、识别 unsupportedFeatures。 |
| 缓存 | 使用 tenantId + appId + snapshotId + runtimeModelVersion 作为缓存维度。 |
| 权限表现 | 根据后端裁剪结果隐藏/禁用/只读字段和动作。 |

### 15.2 字段组件验收

P0 字段组件至少覆盖：

```text
text
textarea
number
money
date
datetime
select
multi_select
user_picker
org_picker
lookup
attachment
subtable
boolean
```

每个字段组件必须支持：

```text
1. value
2. readonly
3. disabled
4. required
5. visible
6. error
7. onChange
8. onBlur
```

### 15.3 表单渲染验收

| 验收项 | 标准 |
|---|---|
| 新建表单 | 通过 RuntimeModel 渲染字段和布局。 |
| 编辑表单 | 加载记录数据并显示。 |
| 只读详情 | 字段不可编辑。 |
| dirty state | 编辑后触发离开确认。 |
| 字段校验 | 必填、类型、格式、范围、子表校验有提示。 |
| 保存提交 | 通过 Runtime Action Dispatcher 调用 API。 |
| 错误边界 | 单字段异常不白屏。 |

### 15.4 列表渲染验收

| 验收项 | 标准 |
|---|---|
| 列表视图 | 根据 View DSL 渲染列。 |
| 搜索过滤 | 调用后端列表 API，不在前端全量过滤。 |
| 排序分页 | 支持分页和排序参数。 |
| 数据权限 | 后端返回已过滤数据，前端不自行扩大范围。 |
| 字段权限 | 不可见字段不显示列。 |
| 行动作 | 编辑、查看、提交、删除动作按权限显示。 |

### 15.5 审批渲染验收

| 验收项 | 标准 |
|---|---|
| 待办列表 | 显示当前用户待办。 |
| 审批详情 | 显示记录、流程轨迹、审批意见、附件。 |
| 节点字段权限 | 当前节点可编辑字段正确表现。 |
| 审批通过 | 携带 taskVersion 调用 API。 |
| 驳回 | 可填写意见并提交。 |
| 冲突处理 | 任务已处理时显示冲突并刷新。 |

---

## 28. 权限验收计划

### 16.1 权限矩阵

| 角色 | 应用中心 | 设计态 | 运行态 | 审批 | 组织管理 | 审计安全 |
|---|---|---|---|---|---|---|
| 平台管理员 | 全部 | 可配置 | 可访问 | 可查看 | 全部 | 全部 |
| 应用管理员 | 所属应用 | 可配置 | 可访问 | 视规则 | 无或只读 | 所属应用 |
| 应用设计者 | 所属应用 | 可编辑元数据 | 可预览 | 无审批权 | 无 | 无或只读 |
| 普通员工 | 可见应用 | 无 | 本人数据 | 发起流程 | 无 | 无 |
| 部门负责人 | 可见应用 | 无 | 本部门数据 | 审批部门任务 | 无 | 无 |
| 财务审批人 | 财务相关应用 | 无 | 授权数据 | 财务节点审批 | 无 | 无 |
| 法务审批人 | 合同应用 | 无 | 授权合同 | 法务节点审批 | 无 | 无 |
| 采购审批人 | 采购应用 | 无 | 授权采购 | 采购节点审批 | 无 | 无 |

### 16.2 字段权限验收

必须覆盖：

```text
1. 字段可见且可编辑。
2. 字段可见但只读。
3. 字段不可见。
4. 字段在列表不可见但详情可见。
5. 字段在发起节点可编辑，在审批节点只读。
6. 字段在审批节点可补充意见。
7. 前端隐藏字段被恶意提交时，后端拒绝或过滤。
```

### 16.3 数据权限验收

必须覆盖：

```text
1. 本人数据。
2. 本部门数据。
3. 本部门及下级。
4. 指定角色全部数据。
5. 无数据权限返回空列表或拒绝。
6. lookup 弹窗也必须执行数据权限。
7. 导出数据必须执行同等数据权限。
```

---

## 29. 发布与回滚验收计划

### 17.1 发布成功场景

验收步骤：

```text
1. 创建或修改应用元数据草稿。
2. 点击发布。
3. 后端执行 DSL 校验、依赖校验、权限校验、流程校验。
4. 生成 app_version。
5. 生成 metadata_snapshot。
6. 切换 app_runtime_pointer。
7. 前端运行态重新加载 RuntimeModel。
8. 新版本运行态生效。
```

验收标准：

```text
1. 发布日志为 success。
2. app_runtime_pointer 指向新 snapshot。
3. 旧 snapshot 不被修改。
4. 运行态不读取 draft_json。
5. 审计日志存在发布记录。
```

### 17.2 发布失败场景

必须模拟：

```text
1. 字段引用不存在。
2. 表单绑定对象不存在。
3. 流程节点配置不完整。
4. 权限策略目标不存在。
5. DSL schema 不兼容。
```

验收标准：

```text
1. 发布失败不切换 runtime pointer。
2. 当前运行版本继续可用。
3. publish_log 记录 failed。
4. 前端显示可理解的校验错误。
```

### 17.3 回滚场景

验收标准：

```text
1. 回滚只切换 runtime pointer。
2. 历史 app_version 和 metadata_snapshot 不被修改。
3. 已在旧快照下启动的流程实例继续使用原 snapshotId。
4. 回滚后新打开运行态页面读取目标 snapshot。
5. 审计日志和 rollback_log 完整。
```

---

## 30. 业务记录验收计划

### 18.1 新建记录

验收标准：

```text
1. 前端通过 RuntimeFormRenderer 渲染。
2. 后端读取当前 runtime pointer。
3. 业务记录写入 lc_business_record。
4. appVersionId 和 snapshotId 写入记录。
5. 索引字段写入 lc_business_record_index。
6. lookup 字段写入 lc_business_record_relation。
7. 附件写入 lc_file_attachment。
8. 写入业务变更日志和审计日志。
```

### 18.2 编辑记录

验收标准：

```text
1. 请求携带 recordVersion。
2. 后端校验字段权限。
3. 不可编辑字段被修改时拒绝或过滤。
4. 保存成功后返回新 recordVersion。
5. 版本冲突时前端提示刷新或放弃本地修改。
```

### 18.3 提交审批

验收标准：

```text
1. 记录状态从 draft 进入 submitted / in_approval。
2. 创建 workflow_instance。
3. 创建首个 workflow_task。
4. 任务绑定 appVersionId 和 snapshotId。
5. 审计日志记录提交动作。
```

---

## 31. 流程审批验收计划

### 19.1 审批通过

验收标准：

```text
1. 只有合法 assignee 或候选人可审批。
2. 请求携带 taskVersion。
3. 当前任务状态更新为 approved。
4. 写入 workflow_task_action。
5. 写入 workflow_trace。
6. 推进下一节点或完成流程。
7. 业务记录状态同步更新。
```

### 19.2 驳回

验收标准：

```text
1. 支持填写审批意见。
2. 可附加意见附件。
3. 任务状态更新为 rejected。
4. 流程实例状态和业务记录状态正确回写。
5. 审计日志完整。
```

### 19.3 冲突和越权

必须覆盖：

```text
1. 已完成任务再次审批。
2. 非处理人审批。
3. taskVersion 过期。
4. 当前节点字段越权编辑。
5. 流程定义所依赖 snapshot 缺失。
```

---

## 32. 文件与附件验收计划

### 20.1 上传与绑定

验收标准：

```text
1. 上传生成 lc_file_object。
2. 业务记录保存或审批意见保存时生成 lc_file_attachment。
3. lc_file_attachment 是唯一权威绑定关系。
4. lc_business_record_attachment 如存在，仅作为查询冗余。
```

### 20.2 预览与下载

验收标准：

```text
1. 预览/下载必须鉴权。
2. 不得直接暴露 storage_path。
3. 无权限返回拒绝。
4. 拒绝访问写入 file_access_log 或 security_event。
5. 有权限访问写入 file_access_log。
```

---

## 33. 回收站验收计划

| 场景 | 验收标准 |
|---|---|
| 删除应用 | 应用进入回收站，不物理删除历史数据。 |
| 删除元数据资源 | 写入 recycle_item，恢复前校验依赖和编码冲突。 |
| 删除业务记录 | 软删除记录并可在回收站查看。 |
| 恢复资源 | 校验 active 唯一键冲突，冲突时 blocked。 |
| 彻底删除 | P0 默认不建议；若支持，必须限制有历史记录、流程、附件、审计的数据。 |

---

## 34. 审计与安全验收计划

### 22.1 审计事件覆盖

必须记录审计：

```text
1. 登录成功/失败。
2. 创建应用。
3. 修改元数据。
4. 发布。
5. 回滚。
6. 修改权限。
7. 创建业务记录。
8. 修改业务记录。
9. 提交审批。
10. 审批通过/驳回。
11. 上传文件。
12. 下载文件。
13. 删除/恢复资源。
```

### 22.2 安全事件覆盖

必须记录安全事件：

```text
1. 无应用访问权限。
2. 无对象权限。
3. 无数据权限。
4. 字段越权提交。
5. 非处理人审批任务。
6. 无权限附件下载。
7. 登录失败次数过多。
8. 幂等键冲突或疑似重放。
```

---

## 35. 三个样板应用 E2E 验收

### 23.1 合同管理 E2E

验收路径：

```text
1. 管理员从模板创建合同管理应用。
2. 设计者查看 contract 对象、合同表单、合同流程、权限配置。
3. 发布合同管理应用。
4. 普通员工进入运行态新建合同。
5. 填写合同名称、编号、金额、相对方、签署日期、附件、付款计划子表。
6. 提交合同审批。
7. 部门负责人审批。
8. 法务审批。
9. 财务审批。
10. 合同状态变为 approved。
11. 员工只能查看本人或授权范围合同。
12. 无权限用户不能下载合同附件。
13. 审计日志可追踪创建、提交、审批、下载拒绝。
```

必须验证：

```text
1. 金额字段权限。
2. 法务意见字段权限。
3. 附件鉴权。
4. 付款计划 subtable 校验。
5. 相对方 lookup 权限。
```

### 23.2 费用报销 E2E

验收路径：

```text
1. 从模板创建费用报销应用。
2. 发布应用。
3. 员工新建报销单。
4. 填写报销金额、费用类型、费用明细子表、发票附件。
5. 提交审批。
6. 直属上级审批。
7. 财务审批。
8. 报销单状态变为 approved。
9. 财务可查看授权范围，普通员工只看本人数据。
10. 无权限用户不能查看受限字段或下载发票附件。
```

必须验证：

```text
1. 报销金额自动校验。
2. 费用明细合计与报销金额一致。
3. 发票附件字段。
4. 直属上级处理人规则。
5. 财务角色数据权限。
```

### 23.3 采购申请 E2E

验收路径：

```text
1. 从模板创建采购申请应用。
2. 发布应用。
3. 员工新建采购申请。
4. 填写采购金额、采购部门、供应商、预算科目、采购明细子表。
5. 提交审批。
6. 部门负责人审批。
7. 采购角色审批。
8. 财务审批。
9. 采购申请状态变为 approved。
10. 采购角色可查看采购相关数据，普通员工只能查看本人申请。
```

必须验证：

```text
1. supplier lookup。
2. purchase_items subtable。
3. 采购金额权限和审批分支。
4. 采购角色与财务角色不同权限。
5. 审批轨迹完整。
```

---

## 36. 异常场景验收矩阵

| 场景 | 预期结果 |
|---|---|
| RuntimeModel 不兼容 | 前端显示 UnsupportedRuntimeModel，不白屏。 |
| 单字段组件异常 | 显示字段错误占位，表单继续可用。 |
| 表单 dirty 离开 | 出现确认提示。 |
| recordVersion 冲突 | 提示记录已被修改，提供刷新/放弃。 |
| taskVersion 冲突 | 提示任务状态已变化，重新加载任务。 |
| 发布校验失败 | 不切换 pointer，显示校验错误。 |
| 回滚目标不可用 | 回滚失败，不影响当前版本。 |
| lookup 无权限 | 不返回或返回 disabled 选项。 |
| subtable 校验失败 | 行级/表级错误准确展示。 |
| 附件无权限 | 下载拒绝并记录安全事件。 |
| 幂等键重复 | 相同请求返回首次结果，不同请求返回冲突。 |
| 运行指针损坏 | 诊断 API 可发现，运行态显示错误。 |

---

## 37. 基础性能冒烟验收

P0 不做完整性能压测，但需要基础冒烟：

| 场景 | P0 建议验收 |
|---|---|
| 应用中心列表 | 常规数据量下可在可接受时间内返回。 |
| RuntimeModel 加载 | 单应用模型加载可缓存，重复进入不重复大量请求。 |
| 业务列表分页 | 必须分页，不允许一次性加载全部记录。 |
| lookup 弹窗 | 必须分页和搜索，不允许前端全量过滤。 |
| 审计日志 | 必须分页。 |
| 文件下载 | 不直接通过前端暴露存储路径。 |

Codex 生成代码不得：

```text
1. 在前端一次性加载全部业务记录做筛选。
2. 在前端全量加载 lookup 候选项。
3. 对 data_json 做无边界 LIKE 查询作为核心查询。
4. 在运行态每次字段渲染都重新请求 RuntimeModel。
```

---

## 38. H5 自适应验收

P0 移动端只要求 H5 自适应，不做原生 App。

必须验收：

```text
1. 登录页在手机宽度可用。
2. 应用中心在手机宽度可浏览。
3. 运行态列表在手机宽度可查看和进入详情。
4. 运行态表单在手机宽度可填写主要字段。
5. 审批详情在手机宽度可查看记录和审批。
6. 附件预览/下载按钮可操作。
```

可暂缓优化：

```text
1. 复杂表单设计器移动端编辑体验。
2. 流程设计器移动端拖拽体验。
3. 管理后台复杂表格移动端高级操作。
```

---

## 39. Codex 生成代码验收规则

### 27.1 Codex 每批任务完成后必须输出

```text
1. 本次修改了哪些文件。
2. 对应 70-development-task-breakdown.md 的哪些任务。
3. 执行了哪些命令。
4. 哪些命令通过。
5. 哪些命令失败以及原因。
6. 哪些功能未完成。
7. 是否违反 P0 不做范围。
```

### 27.2 Codex 不得通过以下方式“修复”测试

```text
1. 删除测试用例。
2. 注释掉权限校验。
3. 绕过 RuntimeModel 直接硬编码页面。
4. 去掉 TypeScript 类型检查。
5. 跳过 Maven 测试。
6. 将错误吞掉但不提示。
7. 把后端鉴权改成前端隐藏按钮。
8. 为合同、报销、采购创建独立业务表。
9. 修改文档基线以迎合代码实现。
10. 移除审计、安全事件、幂等、版本冲突处理。
```

### 27.3 Codex 允许的降级方式

如果某批任务无法完整实现，可以允许：

```text
1. 使用 Mock API 替代真实后端，但必须标注。
2. 使用内存数据替代数据库，但不得作为最终后端实现。
3. 暂不实现 E2E 自动化，但必须保留手工验收路径。
4. 暂不实现复杂视觉优化，但不得破坏核心交互。
5. 暂不实现 P0-Optional 表或缓存，但必须说明替代策略。
```

---

## 40. P0 最小可演示版本验收标准

最小可演示版本用于早期演示，可以基于 Mock API。

必须满足：

```text
1. 前端工程可启动。
2. 登录 Mock 可用。
3. 应用中心展示合同、报销、采购三个应用。
4. 可进入应用设计态页面。
5. 数据建模、表单设计、流程设计、权限配置页面有可交互 Mock。
6. 发布管理页面可模拟发布成功/失败。
7. 运行态列表、详情、表单填写由 Runtime Renderer 渲染。
8. 可提交一条合同/报销/采购记录进入审批。
9. 任务中心可模拟审批通过/驳回。
10. 字段只读、隐藏、权限拒绝、版本冲突至少有 Mock 场景。
11. `npm run build` 成功。
```

可以暂缓：

```text
1. 真实后端联调。
2. 真实数据库迁移。
3. 完整 E2E 自动化。
4. 复杂权限策略 UI。
5. 复杂视觉细节。
```

---

## 41. P0 完整验收版本标准

完整验收版本必须满足：

```text
1. 前端、后端、数据库均可本地启动。
2. Flyway 从空库迁移成功。
3. 默认租户、管理员、组织、角色和样板模板初始化成功。
4. Auth API 可登录并返回当前用户上下文。
5. 应用中心、模板、组织用户角色 API 可用。
6. 元数据草稿保存、依赖校验、发布校验可用。
7. 发布成功生成 app_version、metadata_snapshot、runtime_pointer。
8. 运行态 API 只读取当前 snapshot。
9. Runtime Renderer 渲染三个样板应用。
10. 业务记录保存写入 data、index、relation、change_log、audit。
11. 自动编号、唯一字段、lookup、subtable、附件字段可用。
12. 提交审批创建流程实例和任务。
13. 审批通过/驳回更新流程和业务状态。
14. 权限、字段裁剪、数据范围、文件下载鉴权由后端执行。
15. 发布失败不切换 pointer。
16. 回滚只切换 pointer。
17. 回收站基础能力可用。
18. 审计日志、安全事件、运行错误日志可查询。
19. 一致性巡检 API 可发现典型异常。
20. 前端 build、后端 test、核心 E2E 或手工验收通过。
```

---

## 42. 验收通过 / 不通过规则

### 30.1 通过条件

P0 验收通过必须同时满足：

```text
1. P0 主闭环通过。
2. 三个样板应用核心流程通过。
3. 发布、回滚、快照隔离通过。
4. 权限、字段裁剪、文件鉴权通过。
5. 业务记录、索引、流程、审计数据落点通过。
6. 前端核心页面无阻塞错误。
7. 后端核心服务测试通过。
8. 构建和检查命令通过。
9. 未违反 P0 红线。
```

### 30.2 不通过条件

出现以下任一情况，不得通过 P0 验收：

```text
1. 运行态读取设计态 draft_json。
2. 为合同、报销、采购生成独立业务表。
3. 发布失败仍切换 runtime pointer。
4. 回滚修改历史 snapshot。
5. 前端隐藏字段但后端不校验。
6. 无权限用户可下载附件。
7. 非审批人可审批任务。
8. 业务记录未保存 appVersionId 或 snapshotId。
9. 流程实例未绑定 snapshotId。
10. 关键写操作无审计。
11. recordVersion/taskVersion 冲突被静默覆盖。
12. Runtime Renderer 被硬编码为三套业务页面。
13. 代码无法构建或核心服务无法启动。
```

---

## 43. 给 AI 生成测试代码的强约束

```text
1. 测试必须围绕 P0 主闭环、三样板应用和核心红线生成。
2. 不得只生成 happy path 测试。
3. 必须覆盖权限拒绝、字段越权、版本冲突、发布失败、附件拒绝。
4. 前端测试必须经过 Runtime Renderer，不得直接测试硬编码合同页面。
5. 后端测试必须验证事务边界、审计、安全事件和幂等。
6. 数据库测试不得生成业务对象专表。
7. API 测试必须校验统一响应和错误码。
8. E2E 测试必须包含合同、报销、采购三个样板应用。
9. 测试数据必须可重复初始化。
10. 不得为通过测试而删除文档要求的功能或放宽安全约束。
```

---

## 44. 后续文档衔接

本文档完成后，建议进入：

```text
1. 99-codex-execution-guide.md
2. CODEX.md
3. 可选：40A-openapi-spec.yaml
4. 可选：81-e2e-test-case-catalog.md
```

其中：

```text
99-codex-execution-guide.md 用于告诉 Codex 如何读取文档、执行任务和提交结果。
CODEX.md 用于作为仓库根目录的简短执行入口。
40A-openapi-spec.yaml 用于从 40 API 设计生成结构化接口契约。
81-e2e-test-case-catalog.md 可用于将本文验收场景拆成更细的自动化测试用例。
```

---

## 45. 附录：P0 测试验收红线

```text
1. 不得只验收页面是否能打开，必须验收数据、权限、流程、审计和异常。
2. 不得跳过发布失败、回滚、版本冲突、附件拒绝测试。
3. 不得把前端权限表现等同于后端权限校验。
4. 不得让运行态绕过 RuntimeModel。
5. 不得让测试数据只覆盖一个样板应用。
6. 不得为通过测试创建业务对象专表。
7. 不得在测试中直接修改已发布 snapshot。
8. 不得忽略 tenantId 条件。
9. 不得静默吞掉安全事件和审计失败。
10. 不得把 Mock 可演示版本误认为完整验收版本。
```
