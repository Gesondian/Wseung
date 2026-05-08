---
title: 前端页面与组件设计
subtitle: 企业级低代码平台 v1.1｜P0 前端页面与组件增强设计
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
  - 60-frontend-runtime-renderer-design.md
  - 90-metadata-dsl-guideline.md
  - 02-P0-app-center.md
  - 03-P0-org-user-role.md
  - 04-P0-data-modeling.md
  - 05-P0-form-designer.md
  - 07-P0-workflow-engine.md
  - 08-P0-permission-system.md
  - 09-P0-release-runtime.md
---

# 61-frontend-page-and-component-design.md

版本：v1.1  
适用范围：P0 前端页面、路由、组件、交互、设计态页面、发布态页面、运行态页面、样板应用 Mock UI、Codex 前端工程生成  
最后更新：2026-05-06  
状态：增强基线版

---

## 0. v1.1 增强说明

本版本在 v1.0 基线版上增强，目标是让 Codex 能够按照明确的页面、路由、组件、API、Mock 场景和验收标准生成前端工程。

### 0.1 本次增强重点

```text
1. 统一依赖文件名。
2. 解决 60 / 61 文件编号命名问题。
3. 增加页面与 P0 功能点映射。
4. 增加页面级 API 调用清单。
5. 增加表单设计器组件拆解。
6. 增加流程设计器组件拆解。
7. 增加权限设计页面组件拆解。
8. 增加前端工程脚手架要求。
9. 增加 Mock 场景清单。
10. 增加 P0 前端完成定义 Definition of Done。
11. 增加页面状态标准。
12. 增加角色视角矩阵。
13. 增加页面布局标准。
14. 增加核心组件 Props 契约。
15. 增加前端验收脚本。
```

---

## 1. 文档目的

本文档定义低代码平台 P0 阶段的前端页面、路由、组件、布局和交互设计，承接 `45-tech-stack-and-scaffold-decision.md` 与 `60-frontend-runtime-renderer-design.md`。

其中：

```text
1. 60 文档定义运行态渲染器如何根据元数据渲染。
2. 61 文档定义整个平台前端有哪些页面、如何路由、如何布局、如何拆组件。
3. 本文是 Codex 生成前端界面、Mock 页面、组件目录和路由表的直接输入。
```

---

## 2. 依赖文件统一命名

Codex 生成前端工程前，必须按以下文件名读取文档，禁止混用旧名称或推测文件名。

```text
00-project-context-summary.md
00-project-doc-index.md
00-current-working-plan.md
00-decision-log.md
20-system-architecture-design.md
30-core-database-design.md
40-api-design.md
45-tech-stack-and-scaffold-decision.md
60-frontend-runtime-renderer-design.md
61-frontend-page-and-component-design.md
90-metadata-dsl-guideline.md
```

### 2.1 命名约束

```text
1. API 设计文档统一为 40-api-design.md。
2. 不得使用 40-core-api-design.md 作为新文档名。
3. 前端运行态渲染器统一为 60-frontend-runtime-renderer-design.md。
4. 前端页面组件设计统一为 61-frontend-page-and-component-design.md。
```

---

## 3. 文件编号与命名说明

| 编号 | 文档 | 说明 |
|---|---|---|
| 45 | 技术栈与脚手架 | 决定前后端技术栈、工程结构、运行命令。 |
| 50 | 后端服务设计 | 后续后端模块、事务、领域服务设计。 |
| 60 | 前端运行态渲染器 | 定义 RuntimeModel、Adapter、字段组件、运行态渲染机制。 |
| 61 | 前端页面与组件 | 定义页面、路由、设计器组件、Mock 场景和前端 DoD。 |
| 70 | 开发任务拆解 | 后续任务计划。 |
| 80 | 测试验收计划 | 后续测试策略和验收。 |
| 99 | Codex 执行说明 | 后续 Codex 总入口。 |

`60` 和 `61` 均属于前端文档，但职责不同，因此使用连续编号。

---

## 4. 前端页面设计目标

| 目标 | 说明 |
|---|---|
| 可运行 | 生成的前端工程能启动、能路由、能用 Mock 数据演示。 |
| 覆盖闭环 | 覆盖应用创建、数据建模、表单配置、流程审批、权限、发布、运行、审计。 |
| 低代码特征明显 | 包含表单设计器、字段配置、运行态渲染器，而不是普通 CRUD 后台。 |
| 企业后台风格 | 使用 Ant Design，左侧菜单 + 顶部栏 + 内容区。 |
| 前后端边界清晰 | 页面通过 API Client / Mock API 获取数据，不直接读数据库结构。 |
| 样板应用可演示 | 合同、报销、采购三个样板应用可从应用中心进入运行态。 |
| 可交给 Codex | 页面、组件、API、Mock、验收命令足够明确。 |

---

## 5. 前端页面设计原则

```text
1. 前端基线使用 React + TypeScript + Vite + Ant Design。
2. 页面按管理态、设计态、发布态、运行态、审计运维态分区。
3. 设计态页面用于编辑草稿，不影响运行态。
4. 运行态页面必须复用 60 文档中的 Runtime Renderer。
5. 不得为样板应用写死完整专属业务页面，只允许用 Mock 数据配置出样板效果。
6. 所有 API 调用必须经过统一 API Client 或 Mock Service。
7. 页面级权限可以隐藏入口，但接口权限以后端为准。
8. 页面必须覆盖 loading、empty、error、permission_denied 等状态。
9. Codex 生成时优先完成骨架、路由、Mock 和主流程，不追求像素级视觉稿。
```

---

## 6. 前端工程脚手架要求

前端工程必须遵守 `45-tech-stack-and-scaffold-decision.md`。

### 6.1 推荐目录

```text
apps/web/src/
  app/
  routes/
  layouts/
  pages/
  components/
  runtime/
  designers/
  services/
  mocks/
  stores/
  types/
  utils/
```

### 6.2 目录职责

| 目录 | 职责 |
|---|---|
| `app` | 应用初始化、Provider、路由挂载。 |
| `routes` | 路由定义和懒加载。 |
| `layouts` | 管理态、设计态、运行态布局。 |
| `pages` | 页面级编排。 |
| `components` | 通用 UI 组件。 |
| `runtime` | 运行态渲染器，详见 60 文档。 |
| `designers` | 表单、流程、权限等设计器组件。 |
| `services` | API Client 和请求封装。 |
| `mocks` | Mock API、Mock 数据和场景。 |
| `stores` | Zustand 或同等状态管理。 |
| `types` | DTO、RuntimeModel、页面类型。 |
| `utils` | 通用工具函数。 |

### 6.3 工程约束

```text
1. pages 只负责编排，不直接写复杂业务逻辑。
2. services 只封装 API 调用，不写 UI 逻辑。
3. runtime 只放运行态渲染器，不放设计器页面。
4. designers 只放设计态组件。
5. mocks 只放 Mock Service 和 Mock 数据。
6. types 放 API DTO 和 RuntimeModel 类型。
```

---

## 7. 页面布局标准

| 页面域 | 布局 | 说明 |
|---|---|---|
| 认证 | `AuthLayout` | 登录、忘记密码预留。 |
| 管理态 | `AdminShell` | 组织、用户、角色、审计、安全。 |
| 应用中心 | `MainShell` | 工作台、应用中心、模板中心。 |
| 设计态 | `DesignShell` | 应用内设计器，左侧应用菜单 + 内容区。 |
| 发布态 | `DesignShell` | 发布检查、版本、回滚。 |
| 运行态 | `RuntimeShell` | 应用运行入口、列表、表单、详情。 |

### 7.1 Layout 规则

```text
1. 所有页面必须使用统一 Layout，不得每个页面独立写顶栏和侧栏。
2. DesignShell 必须展示当前 appName、运行状态、发布入口。
3. RuntimeShell 必须展示当前应用菜单和返回应用中心入口。
4. H5 下侧边栏可收起或变为 Drawer。
```

---

## 8. 路由清单

### 8.1 认证与工作台

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | LoginPage | 登录页。 |
| `/` | DashboardPage | 工作台首页。 |
| `/apps` | AppListPage | 应用中心。 |
| `/templates` | TemplateListPage | 模板中心。 |

### 8.2 应用设计态

| 路由 | 页面 | 说明 |
|---|---|---|
| `/apps/:appId/overview` | AppOverviewPage | 应用概览。 |
| `/apps/:appId/models` | ModelDesignerPage | 数据建模。 |
| `/apps/:appId/forms` | FormDesignerPage | 表单设计。 |
| `/apps/:appId/views` | ViewDesignerPage | 视图设计。 |
| `/apps/:appId/workflows` | WorkflowDesignerPage | 流程设计。 |
| `/apps/:appId/permissions` | PermissionDesignerPage | 权限设计。 |
| `/apps/:appId/releases` | ReleaseManagementPage | 发布管理。 |

### 8.3 运行态

| 路由 | 页面 | 说明 |
|---|---|---|
| `/runtime/apps/:appId` | RuntimeAppHomePage | 运行态应用首页。 |
| `/runtime/apps/:appId/entities/:entityKey/list` | RuntimeRecordListPage | 运行态列表。 |
| `/runtime/apps/:appId/entities/:entityKey/new` | RuntimeRecordCreatePage | 新建记录。 |
| `/runtime/apps/:appId/entities/:entityKey/:recordId` | RuntimeRecordDetailPage | 记录详情。 |
| `/runtime/apps/:appId/entities/:entityKey/:recordId/edit` | RuntimeRecordEditPage | 编辑记录。 |

### 8.4 任务与管理

| 路由 | 页面 | 说明 |
|---|---|---|
| `/tasks/todo` | TodoTaskPage | 我的待办。 |
| `/tasks/done` | DoneTaskPage | 我的已办。 |
| `/tasks/:taskId` | TaskDetailPage | 审批详情。 |
| `/admin/org` | OrgUnitPage | 组织管理。 |
| `/admin/users` | UserPage | 用户管理。 |
| `/admin/roles` | RolePage | 角色管理。 |
| `/audit/logs` | AuditLogPage | 审计日志。 |
| `/security/events` | SecurityEventPage | 安全事件。 |
| `/ops/diagnostics` | DiagnosticsPage | 诊断与一致性巡检。 |

---

## 9. 页面与 P0 功能点映射

| P0 功能点 | 页面 | 路由 | 主要组件 | API 域 | 必做 |
|---|---|---|---|---|---|
| 应用中心 | 应用列表页 | `/apps` | AppListPage | 应用中心 API | 是 |
| 模板创建 | 模板中心 | `/templates` | TemplateListPage | 模板 API | 是 |
| 数据建模 | 对象字段页 | `/apps/:appId/models` | ModelDesignerPage | 元数据 API | 是 |
| 表单设计 | 表单设计器 | `/apps/:appId/forms` | FormDesignerPage | 元数据 API | 是 |
| 视图设计 | 视图设计器 | `/apps/:appId/views` | ViewDesignerPage | 元数据 API | 是 |
| 流程审批 | 流程设计器/待办 | `/apps/:appId/workflows`, `/tasks/todo` | WorkflowDesignerPage, TodoTaskPage | 流程 API | 是 |
| 权限 | 权限配置页 | `/apps/:appId/permissions` | PermissionDesignerPage | 权限 API | 是 |
| 发布运行 | 发布页/运行页 | `/apps/:appId/releases`, `/runtime/apps/:appId` | ReleaseManagementPage, RuntimeAppHomePage | 发布/运行态 API | 是 |
| 业务数据 | 列表/表单/详情 | `/runtime/apps/:appId/entities/:entityKey/*` | Runtime Renderer | 业务记录 API | 是 |
| 附件 | 运行态表单/详情 | 多页面 | AttachmentField | 文件 API | 是 |
| 审计 | 审计日志页 | `/audit/logs` | AuditLogPage | 审计 API | 是 |
| 诊断 | 巡检页 | `/ops/diagnostics` | DiagnosticsPage | 诊断 API | 建议 |

---

## 10. 页面级 API 调用清单

### 10.1 应用列表页

```text
页面：AppListPage
路由：/apps
进入页面调用：
1. GET /api/v1/apps
2. GET /api/v1/app-categories
用户操作调用：
1. POST /api/v1/apps
2. POST /api/v1/templates/{templateId}/create-app
错误处理：
1. APP_CREATE_FAILED
2. PERMISSION_DENIED
3. NETWORK_ERROR
```

### 10.2 数据建模页

```text
页面：ModelDesignerPage
路由：/apps/:appId/models
进入页面调用：
1. GET /api/v1/apps/{appId}/metadata/resources?resourceType=entity
2. GET /api/v1/apps/{appId}/metadata/resources?resourceType=field
用户操作调用：
1. POST /api/v1/apps/{appId}/metadata/resources
2. PUT /api/v1/apps/{appId}/metadata/resources/{resourceId}
3. DELETE /api/v1/apps/{appId}/metadata/resources/{resourceId}
错误处理：
1. METADATA_DEPENDENCY_CONFLICT
2. RESOURCE_KEY_DUPLICATED
3. VALIDATION_FAILED
```

### 10.3 表单设计器页

```text
页面：FormDesignerPage
路由：/apps/:appId/forms
进入页面调用：
1. GET /api/v1/apps/{appId}/metadata/resources?resourceType=form
2. GET /api/v1/apps/{appId}/metadata/resources?resourceType=entity
用户操作调用：
1. POST /api/v1/apps/{appId}/metadata/resources
2. PUT /api/v1/apps/{appId}/metadata/resources/{resourceId}
错误处理：
1. FORM_SCHEMA_INVALID
2. FIELD_NOT_FOUND
3. SAVE_DRAFT_FAILED
```

### 10.4 流程设计器页

```text
页面：WorkflowDesignerPage
路由：/apps/:appId/workflows
进入页面调用：
1. GET /api/v1/apps/{appId}/metadata/resources?resourceType=workflowDef
2. GET /api/v1/apps/{appId}/metadata/resources?resourceType=entity
用户操作调用：
1. POST /api/v1/apps/{appId}/metadata/resources
2. PUT /api/v1/apps/{appId}/metadata/resources/{resourceId}
错误处理：
1. WORKFLOW_SCHEMA_INVALID
2. APPROVER_RULE_INVALID
3. NODE_FIELD_PERMISSION_INVALID
```

### 10.5 权限设计页

```text
页面：PermissionDesignerPage
路由：/apps/:appId/permissions
进入页面调用：
1. GET /api/v1/apps/{appId}/permissions/policies
2. GET /api/v1/apps/{appId}/permissions/assignments
3. GET /api/v1/org/users
4. GET /api/v1/org/roles
用户操作调用：
1. POST /api/v1/apps/{appId}/permissions/policies
2. PUT /api/v1/apps/{appId}/permissions/policies/{policyId}
3. POST /api/v1/apps/{appId}/permissions/assignments
错误处理：
1. PERMISSION_POLICY_INVALID
2. SUBJECT_NOT_FOUND
3. FIELD_PERMISSION_CONFLICT
```

### 10.6 发布管理页

```text
页面：ReleaseManagementPage
路由：/apps/:appId/releases
进入页面调用：
1. GET /api/v1/apps/{appId}/versions
2. GET /api/v1/apps/{appId}/runtime-pointer
用户操作调用：
1. POST /api/v1/apps/{appId}/release/validate
2. POST /api/v1/apps/{appId}/release
3. POST /api/v1/apps/{appId}/rollback
错误处理：
1. RELEASE_VALIDATION_FAILED
2. ROLLBACK_TARGET_INVALID
3. PUBLISH_LOCKED
```

### 10.7 运行态记录编辑页

```text
页面：RuntimeRecordEditPage
路由：/runtime/apps/:appId/entities/:entityKey/:recordId/edit
进入页面调用：
1. GET /api/v1/runtime/apps/{appId}/model
2. GET /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}
用户操作调用：
1. PUT /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}
2. POST /api/v1/runtime/apps/{appId}/entities/{entityKey}/records/{recordId}/submit
错误处理：
1. VERSION_CONFLICT_RECORD
2. FIELD_PERMISSION_DENIED
3. RUNTIME_MODEL_NOT_FOUND
```

### 10.8 审批详情页

```text
页面：TaskDetailPage
路由：/tasks/:taskId
进入页面调用：
1. GET /api/v1/workflow/tasks/{taskId}
2. GET /api/v1/runtime/apps/{appId}/model
用户操作调用：
1. POST /api/v1/workflow/tasks/{taskId}/approve
2. POST /api/v1/workflow/tasks/{taskId}/reject
错误处理：
1. VERSION_CONFLICT_TASK
2. TASK_ALREADY_COMPLETED
3. WORKFLOW_PERMISSION_DENIED
```

---

## 11. 页面状态标准

每个页面至少支持以下状态：

| 状态 | 说明 | 必须表现 |
|---|---|---|
| loading | 正在加载。 | Skeleton / Spin。 |
| empty | 无数据。 | Empty + 引导操作。 |
| ready | 正常。 | 页面内容。 |
| error | 接口或渲染异常。 | Result / Alert + 重试。 |
| permission_denied | 无权限。 | 403 Result。 |
| not_found | 资源不存在。 | 404 Result。 |
| version_conflict | 版本冲突。 | 冲突提示 + 刷新。 |

Codex 不得只实现 happy path。

---

## 12. 角色视角矩阵

| 角色 | 可见页面 | 典型动作 |
|---|---|---|
| 平台管理员 | 组织、用户、角色、审计、安全、应用中心 | 管理用户、查看审计。 |
| 应用管理员 | 应用概览、权限、发布、运行态 | 管理成员、发布回滚。 |
| 应用设计者 | 数据建模、表单、视图、流程 | 编辑草稿配置。 |
| 普通员工 | 运行态应用、我的待办、我的已办 | 新建记录、提交审批。 |
| 部门负责人 | 运行态应用、待办 | 审批部门内申请。 |
| 财务审批人 | 报销/采购待办、相关运行态数据 | 财务审批、查看金额字段。 |
| 法务审批人 | 合同待办、合同详情 | 法务审批、查看法务意见。 |
| 采购审批人 | 采购待办、供应商数据 | 采购审批。 |

---

## 13. 应用中心页面设计

### 13.1 页面组成

```text
AppListPage
  AppFilterBar
  AppCardGrid
  AppCreateButton
  TemplateCreateEntry
  AppStatusTag
```

### 13.2 P0 能力

```text
1. 展示应用列表。
2. 按分类、状态、关键字筛选。
3. 创建空白应用。
4. 从模板创建应用。
5. 进入设计态。
6. 进入运行态。
```

---

## 14. 模板中心页面设计

```text
TemplateListPage
  TemplateFilterBar
  TemplateCardGrid
  TemplatePreviewDrawer
  CreateFromTemplateModal
```

P0 模板必须包含：

```text
1. 合同管理
2. 费用报销
3. 采购申请
```

---

## 15. 应用设计态工作台

```text
AppDesignHomePage
  DesignShell
  AppDesignSidebar
  AppDesignHeader
  AppStatusSummary
  RecentChangeList
  ReleaseEntryCard
```

设计态工作台用于聚合数据建模、表单、视图、流程、权限和发布入口。

---

## 16. 数据建模页面设计

```text
ModelDesignerPage
  EntityListPanel
  EntityDetailPanel
  FieldListTable
  FieldEditorDrawer
  FieldTypeSelector
  FieldValidationPanel
```

P0 必做：

```text
1. 创建对象。
2. 编辑对象名称、编码、说明。
3. 创建字段。
4. 配置字段类型、必填、唯一、可检索、可排序。
5. 配置 lookup、attachment、subtable 基础字段。
6. 保存为设计态元数据草稿。
```

---

## 17. 表单设计器组件拆解

### 17.1 组件树

```text
FormDesignerPage
  FormDesignerToolbar
  FormCanvas
  FormComponentPalette
  FormFieldTree
  FormPropertyPanel
  FormLayoutContainer
  FormPreviewDrawer
  FormValidationPanel
```

### 17.2 P0 必做

```text
1. 字段拖入表单。
2. 调整字段顺序。
3. 配置字段 label、placeholder、required、readonly、visible。
4. 配置分组、栅格、子表。
5. 表单预览。
6. 保存表单 DSL。
```

### 17.3 P0 不做

```text
1. 自定义代码组件。
2. 插件市场组件。
3. 复杂脚本表达式。
4. 多端独立设计。
```

---

## 18. 流程设计器组件拆解

### 18.1 组件树

```text
WorkflowDesignerPage
  WorkflowCanvas
  WorkflowNodePalette
  WorkflowNode
  WorkflowEdge
  WorkflowPropertyPanel
  ApproverRuleEditor
  ConditionRuleEditor
  NodeFieldPermissionPanel
  WorkflowValidationPanel
```

### 18.2 P0 节点类型

```text
start
approval
condition
cc
end
```

### 18.3 P0 必做

```text
1. 新建流程。
2. 配置开始、审批、条件、抄送、结束节点。
3. 配置审批人规则：直属上级、部门负责人、指定角色、指定用户。
4. 配置条件分支。
5. 配置节点字段权限。
6. 流程校验和保存。
```

### 18.4 P0 不做

```text
1. 完整 BPMN。
2. 复杂并行网关。
3. 子流程。
4. 外部系统回调节点。
```

---

## 19. 权限设计页面组件拆解

### 19.1 组件树

```text
PermissionDesignerPage
  PermissionScopeTabs
  AppPermissionPanel
  MenuPermissionPanel
  ObjectPermissionPanel
  DataPermissionPanel
  FieldPermissionPanel
  WorkflowPermissionPanel
  PermissionSubjectSelector
  PermissionPreviewPanel
```

### 19.2 P0 权限范围

```text
1. 应用访问权限。
2. 菜单权限。
3. 对象操作权限。
4. 数据范围权限。
5. 字段可见/可编辑权限。
6. 流程节点字段权限。
```

### 19.3 权限页面规则

```text
1. 权限配置保存为设计态策略。
2. 发布后才影响运行态。
3. 前端权限预览仅用于展示，后端仍是最终权限权威。
```

---

## 20. 发布管理页面设计

```text
ReleaseManagementPage
  ReleaseValidationPanel
  ReleaseVersionList
  RuntimePointerCard
  RollbackConfirmModal
  PublishLogTable
```

P0 必做：

```text
1. 发布前校验。
2. 发布应用。
3. 查看版本列表。
4. 查看当前运行版本。
5. 回滚到历史版本。
6. 展示发布失败原因。
```

---

## 21. 运行态应用页面设计

运行态页面必须复用 `60` 文档定义的 Runtime Renderer。

```text
RuntimeAppHomePage
  RuntimeShell
  RuntimeMenu
  RuntimeWelcomePanel
  RuntimeEntityEntryList
```

---

## 22. 运行态列表页设计

```text
RuntimeRecordListPage
  RuntimeListRenderer
  RuntimeFilterBar
  RuntimeRecordTable
  RuntimeRowActions
  RuntimeBatchActions
```

必须支持：

```text
1. 分页。
2. 关键字搜索。
3. 筛选。
4. 排序。
5. 新建入口。
6. 行查看、编辑、提交等动作。
7. 权限控制后的按钮隐藏或禁用。
```

---

## 23. 运行态表单页设计

```text
RuntimeRecordCreatePage / RuntimeRecordEditPage
  RuntimeFormRenderer
  RuntimeFormToolbar
  RuntimeFieldRenderer
  RuntimeActionBar
```

必须支持：

```text
1. 新建。
2. 编辑。
3. 保存草稿。
4. 提交审批。
5. dirty state 离开确认。
6. recordVersion 冲突提示。
```

---

## 24. 运行态详情页设计

```text
RuntimeRecordDetailPage
  RuntimeDetailRenderer
  RuntimeActionBar
  WorkflowTimeline
  AttachmentSection
  ChangeLogEntry
```

必须支持：

```text
1. 字段只读展示。
2. 流程状态展示。
3. 流程轨迹展示。
4. 附件预览/下载。
5. 根据权限显示编辑、提交、撤回、作废等动作。
```

---

## 25. 任务中心页面设计

```text
TodoTaskPage
  TaskFilterBar
  TaskTable
  TaskStatusTag

TaskDetailPage
  RuntimeApprovalRenderer
  ApprovalActionPanel
  WorkflowTimeline
```

必须支持：

```text
1. 我的待办。
2. 我的已办。
3. 审批详情。
4. 审批通过。
5. 驳回。
6. taskVersion 冲突提示。
```

---

## 26. 组织用户角色页面设计

```text
OrgUnitPage
  OrgTree
  OrgDetailPanel
  UserInOrgTable

UserPage
  UserSearchBar
  UserTable
  UserEditorDrawer

RolePage
  RoleTable
  RoleEditorDrawer
  RoleAssignmentPanel
```

---

## 27. 文件与附件页面设计

P0 不单独做完整文件管理中心，但运行态附件组件和文件 API 必须可用。

```text
AttachmentField
  FileUploadButton
  FileList
  FilePreviewButton
  FileDownloadButton
```

规则：

```text
1. 不显示 storagePath。
2. 预览和下载必须走文件 API。
3. 无权限下载展示明确提示。
```

---

## 28. 审计与安全页面设计

```text
AuditLogPage
  AuditFilterBar
  AuditLogTable
  AuditDetailDrawer

SecurityEventPage
  SecurityEventFilterBar
  SecurityEventTable
  SecurityEventDetailDrawer
```

P0 主要用于演示关键操作审计和安全事件列表。

---

## 29. 诊断与一致性巡检页面设计

```text
DiagnosticsPage
  ConsistencyCheckPanel
  RuntimePointerCheckCard
  SnapshotCheckCard
  IndexConsistencyCheckCard
  FileBindingCheckCard
```

P0 可做 Mock 或只读演示，不要求完整自动修复。

---

## 30. Mock 场景清单

Codex 生成前端 Mock 时必须覆盖：

```text
1. 登录成功。
2. 登录失败。
3. 应用列表为空。
4. 应用列表有合同、报销、采购。
5. 合同管理正常运行。
6. 费用报销正常运行。
7. 采购申请正常运行。
8. 字段只读。
9. 字段隐藏。
10. 无应用访问权限。
11. 无数据权限。
12. 记录版本冲突。
13. 审批任务已被处理。
14. 附件无权限下载。
15. 发布成功。
16. 发布失败。
17. 回滚成功。
18. RuntimeModel 不兼容。
19. 表单字段渲染异常。
20. 子表校验失败。
```

---

## 31. 前端组件目录结构

```text
apps/web/src/components/
  common/
  data-display/
  feedback/
  navigation/

apps/web/src/designers/
  model/
  form/
  workflow/
  permission/
  release/

apps/web/src/runtime/
  adapter/
  registry/
  renderers/
  fields/
  actions/
  hooks/
  __fixtures__/
```

---

## 32. 核心组件 Props 契约

```ts
export type RuntimeRecordListProps = {
  appId: string;
  entityKey: string;
  viewKey: string;
};

export type RuntimeRecordFormProps = {
  appId: string;
  entityKey: string;
  recordId?: string;
  mode: "create" | "edit" | "approve";
};

export type FormDesignerProps = {
  appId: string;
  formKey?: string;
  entityKey?: string;
};

export type WorkflowDesignerProps = {
  appId: string;
  workflowKey?: string;
};

export type PermissionDesignerProps = {
  appId: string;
};
```

规则：

```text
1. 核心组件不得直接依赖路由参数，页面负责从路由读取后传入 props。
2. 组件不得直接访问 localStorage 中的业务上下文。
3. API 调用应通过 hooks 或 services 封装。
```

---

## 33. 样板应用前端覆盖

### 33.1 合同管理

必须能演示：

```text
1. 合同列表。
2. 合同新建表单。
3. 合同金额、相对方 lookup、合同附件。
4. 付款计划 subtable。
5. 法务/财务审批。
```

### 33.2 费用报销

必须能演示：

```text
1. 报销列表。
2. 报销单新建。
3. 费用明细 subtable。
4. 发票附件。
5. 直属上级和财务审批。
```

### 33.3 采购申请

必须能演示：

```text
1. 采购申请列表。
2. 供应商 lookup。
3. 采购明细 subtable。
4. 部门负责人、采购、财务审批。
```

---

## 34. 前端验收脚本

Codex 生成前端代码后，至少必须保证以下命令可运行：

```text
npm install
npm run dev
npm run build
npm run lint
```

如项目生成了测试脚本，还必须支持：

```text
npm run test
```

### 34.1 验收要求

```text
1. npm run build 必须通过。
2. npm run lint 不得出现阻塞级错误。
3. Mock 页面在本地 dev 环境可访问。
4. 三个样板应用可从应用中心进入运行态。
```

---

## 35. P0 前端完成定义 Definition of Done

```text
1. 所有 P0 路由可访问。
2. 登录后可进入应用中心。
3. 可看到合同、报销、采购三个样板应用。
4. 可进入应用设计态页面。
5. 可查看并编辑对象字段配置 Mock。
6. 可打开表单设计器并保存 Mock 表单。
7. 可打开流程设计器并保存 Mock 流程。
8. 可打开权限配置页面并保存 Mock 权限。
9. 可发布 Mock 应用。
10. 可进入运行态列表、详情、表单填写页面。
11. 可提交审批。
12. 可在待办中审批通过或驳回。
13. 可上传、预览、下载 Mock 附件。
14. 字段权限、数据权限、按钮权限在前端有正确表现。
15. recordVersion / taskVersion 冲突有明确提示。
16. 所有页面具备 loading、empty、error、permission_denied 状态。
17. H5 宽度下核心运行态页面可用。
18. npm install、npm run dev、npm run build、npm run lint 不失败。
```

---

## 36. 给 Codex 生成前端页面的强约束

```text
1. 必须使用 React + TypeScript + Vite + Ant Design。
2. 必须遵守 45 文档中的 Monorepo 和目录结构。
3. 必须遵守 60 文档中的 Runtime Renderer 机制。
4. 页面 API 必须经过 services 或 Mock Service。
5. 不得为合同、报销、采购写死专属运行态页面。
6. 不得跳过 RuntimeModel 直接写业务表单。
7. 不得只实现 happy path。
8. 不得忽略权限拒绝、空数据、错误、版本冲突状态。
9. 不得自行改名 40-api-design.md、60、61 等文档。
10. 不得引入文档未确认的组件库替换 Ant Design。
11. 不得生成插件市场、复杂 BPMN、完整 BI、AI 自动生成应用等 P1/P2 能力。
```

---

## 37. 附录：P0 前端页面红线

```text
1. 不得把低代码平台做成固定 CRUD 后台。
2. 不得只写页面不写 Mock 数据。
3. 不得只写设计态页面而无法进入运行态。
4. 不得让前端直接读取数据库表结构。
5. 不得绕过 API Client。
6. 不得忽略运行态快照。
7. 不得忽略字段权限表现。
8. 不得忽略文件下载鉴权表现。
9. 不得每个页面各写一套 Layout。
10. 不得让 Codex 自行决定技术栈。
```
