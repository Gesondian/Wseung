---
title: 技术栈与工程脚手架决策
subtitle: 企业级低代码平台 v1.0｜P0 技术栈、工程结构与 Codex 代码生成基线
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
  - 90-metadata-dsl-guideline.md
---

# 45-tech-stack-and-scaffold-decision.md

版本：v1.0  
适用范围：低代码平台 P0 技术选型、工程脚手架、目录结构、开发命令、代码生成、Codex 执行约束  
最后更新：2026-05-06  
状态：基线版

---

## 1. 文档目的

本文档用于明确低代码平台 P0 阶段的技术栈与工程脚手架决策，承接 `20-system-architecture-design.md`、`30-core-database-design.md`、`40-api-design.md` 与 `90-metadata-dsl-guideline.md`。

本文档重点解决以下问题：

```text
1. 前端、后端、数据库、缓存、文件存储分别使用什么技术栈。
2. 采用单仓库还是多仓库。
3. 前端工程、后端工程、数据库迁移、OpenAPI、Mock、测试如何组织。
4. Codex 后续生成代码时必须遵守哪些脚手架边界。
5. 哪些技术选型是 P0 基线，哪些只是可替换适配层。
```

本文档不是完整前端页面设计，不替代 `60-frontend-page-and-component-design.md`。  
本文档不是完整后端服务设计，不替代 `50-backend-service-design.md`。  
本文档不是完整测试计划，不替代 `80-test-and-acceptance-plan.md`。

---

## 2. 前置结论

P0 技术栈基线如下：

| 层级 | P0 决策 |
|---|---|
| 仓库形态 | 单仓库 Monorepo，前后端同仓管理。 |
| 前端框架 | React + TypeScript + Vite。 |
| 前端组件库 | Ant Design。 |
| 前端状态管理 | Zustand + TanStack Query。 |
| 前端路由 | React Router。 |
| 前端拖拽 | dnd-kit。 |
| 前端图形/流程 | React Flow。 |
| 前端富文本/代码编辑 | Monaco Editor 用于 JSON / DSL 查看与调试。 |
| 后端语言 | Java。 |
| 后端框架 | Spring Boot。 |
| 后端工程形态 | 模块化单体，按领域包拆分。 |
| 构建工具 | Maven。 |
| 数据库 | PostgreSQL 优先，MySQL 作为兼容目标。 |
| 数据库迁移 | Flyway。 |
| 缓存 | Redis，P0 可用于权限、运行态模型、幂等锁等缓存。 |
| 文件存储 | 本地文件存储 + S3 Compatible 适配层，P0 推荐 MinIO 或等价对象存储。 |
| API 文档 | OpenAPI 3.1。 |
| API Client | 基于 OpenAPI 生成 TypeScript Axios Client。 |
| 前端测试 | Vitest + React Testing Library + Playwright。 |
| 后端测试 | JUnit 5 + Spring Boot Test + Testcontainers。 |
| 代码规范 | ESLint + Prettier + Checkstyle / Spotless。 |
| 容器化 | Docker Compose 优先，Kubernetes 预留。 |

说明：

```text
1. P0 不追求技术栈多样性，优先减少选择面。
2. P0 不使用微前端、不使用微服务、不使用复杂工作流引擎集群。
3. P0 可以先以 Mock API 支撑前端界面生成，但接口命名、DTO 和错误码必须遵守 40-api-design.md。
4. 后续如引入其他技术栈，必须先更新本文档并记录决策日志。
```

---

## 3. 设计目标

| 目标 | 说明 |
|---|---|
| 可快速生成 | Codex 能基于文档包快速生成工程骨架、页面、API Client、Mock 数据和基础测试。 |
| 可长期演进 | 技术栈支持从 P0 原型演进到企业私有化部署。 |
| 前后端边界清楚 | 前端只负责展示、交互和渲染，权限、字段校验、发布、回滚、审批推进由后端负责。 |
| 低代码特征明确 | 工程结构必须支持设计态、发布态、运行态分层和元数据驱动渲染。 |
| 便于联调 | API、Mock、OpenAPI、DTO、错误码、幂等 Header 保持统一。 |
| 便于测试 | 前端、后端、API、E2E 和样板应用测试可以按模块生成。 |
| 便于私有化部署 | 支持 Docker Compose 一键启动数据库、缓存、对象存储、后端和前端。 |

---

## 4. 设计原则

```text
1. 技术选型必须服务于 P0 闭环，不为 P1/P2 能力提前引入重型依赖。
2. 前端必须支持元数据驱动渲染，不能只写死三个样板应用页面。
3. 后端必须采用模块化单体，不能提前拆成多个独立微服务。
4. 运行态 API、数据访问和权限校验必须遵守 40-api-design.md。
5. 数据库表、字段、事务和索引策略必须遵守 30-core-database-design.md。
6. 元数据 DSL、snapshot_json 和 runtime model 必须遵守 90-metadata-dsl-guideline.md。
7. Codex 生成代码时必须优先遵守本文档，不得自行替换核心技术栈。
8. 所有可替换技术必须通过适配层隔离，例如文件存储、缓存、ID 生成、认证扩展。
```

---

## 5. P0 工程范围

P0 工程需要覆盖：

```text
1. Web 前端工程。
2. Java 后端工程。
3. 数据库迁移脚本。
4. OpenAPI 规范目录。
5. API Client 生成目录。
6. Mock API 与样板应用 Mock 数据。
7. Docker Compose 本地开发环境。
8. 前端单元测试、组件测试和 E2E 测试入口。
9. 后端单元测试、集成测试和 API 测试入口。
10. Codex 执行说明入口。
```

---

## 6. P0 不做范围

```text
1. 不引入微服务治理体系。
2. 不引入 Kubernetes 作为 P0 必需部署方式。
3. 不引入微前端。
4. 不引入独立 BI/OLAP 引擎。
5. 不引入插件市场运行时。
6. 不引入完整 BPMN 引擎集群。
7. 不引入原生移动端工程。
8. 不引入多租户计费、套餐和运营后台工程。
9. 不引入 AI 自动生成应用的模型服务或训练服务。
10. 不让 Codex 自行选择新的 UI 组件库或后端框架。
```

---

## 7. 仓库形态决策

### 7.1 决策

P0 采用单仓库 Monorepo。

建议仓库名：

```text
lowcode-platform-p0
```

### 7.2 选择理由

```text
1. P0 前后端、API、数据库、Mock 和文档需要频繁联动。
2. 单仓库更利于 Codex 理解上下文并批量生成相关文件。
3. 单仓库便于统一本地启动和测试命令。
4. P0 模块化单体优先，不需要多仓库的发布复杂度。
```

### 7.3 后续拆分预留

```text
1. frontend 可未来独立为前端仓库。
2. backend 可未来拆分为多个服务仓库。
3. openapi 可未来独立为契约仓库。
4. docs 可未来独立为产品/架构文档仓库。
```

但 P0 不做拆分。

---

## 8. 推荐根目录结构

```text
lowcode-platform-p0/
  README.md
  CODEX.md
  package.json
  pnpm-workspace.yaml
  .editorconfig
  .gitignore
  .env.example

  docs/
    00-project-context-summary.md
    00-project-doc-index.md
    00-current-working-plan.md
    00-decision-log.md
    20-system-architecture-design.md
    30-core-database-design.md
    40-api-design.md
    45-tech-stack-and-scaffold-decision.md
    90-metadata-dsl-guideline.md

  apps/
    web/
      package.json
      index.html
      vite.config.ts
      tsconfig.json
      src/

    api/
      pom.xml
      src/main/java/
      src/main/resources/
      src/test/java/

  packages/
    api-client/
    metadata-types/
    mock-data/
    shared-utils/

  openapi/
    openapi.yaml
    fragments/

  db/
    migrations/
    seed/

  infra/
    docker-compose.yml
    nginx/
    minio/
    postgres/

  scripts/
    generate-api-client.sh
    lint-all.sh
    test-all.sh
    dev-up.sh
    dev-down.sh
```

说明：

```text
1. apps/web 是前端应用。
2. apps/api 是后端应用。
3. packages/api-client 由 OpenAPI 生成，不允许人工大量修改。
4. packages/metadata-types 保存元数据 DSL TypeScript 类型。
5. packages/mock-data 保存三个样板应用的 Mock 元数据和 Mock 业务数据。
6. db/migrations 保存 Flyway SQL。
7. infra 保存本地部署和私有化部署基础配置。
8. CODEX.md 是 Codex 的短入口说明。
```

---

## 9. 前端技术栈决策

### 9.1 基线技术栈

| 类型 | 决策 |
|---|---|
| 语言 | TypeScript |
| 框架 | React |
| 构建工具 | Vite |
| 包管理 | pnpm |
| 组件库 | Ant Design |
| 路由 | React Router |
| 服务端状态 | TanStack Query |
| 客户端状态 | Zustand |
| 表单状态 | React Hook Form 或 Ant Design Form，P0 优先 Ant Design Form |
| 拖拽 | dnd-kit |
| 流程画布 | React Flow |
| 图标 | Ant Design Icons |
| 日期处理 | dayjs |
| 请求库 | Axios，通过 OpenAPI Client 封装 |
| 单元测试 | Vitest |
| 组件测试 | React Testing Library |
| E2E | Playwright |

### 9.2 前端选择理由

```text
1. React + TypeScript 适合组件化、元数据渲染器和复杂设计器场景。
2. Vite 适合快速开发和 Codex 生成后即时验证。
3. Ant Design 适合企业后台、中后台表格、表单、弹窗、抽屉和权限配置页面。
4. Zustand 轻量，适合保存设计器局部状态、运行态上下文和 UI 状态。
5. TanStack Query 适合服务端状态、缓存、刷新、错误处理和接口联动。
6. dnd-kit 适合表单设计器字段拖拽。
7. React Flow 适合 P0 轻量审批流程设计与流程轨迹展示。
```

### 9.3 前端不得替换的选型

Codex 不得自行替换以下选型：

```text
1. 不得将 React 替换为 Vue、Angular、Svelte 或 Next.js。
2. 不得将 Ant Design 替换为 Material UI、Arco、Element、shadcn/ui 或自研全量组件库。
3. 不得将 Vite 替换为 Webpack、Rspack、Rsbuild 或 CRA。
4. 不得将 pnpm 替换为 npm、yarn、bun。
5. 不得将 Axios Client 替换为手写散落 fetch。
```

如确需替换，必须先更新本文档和 `00-decision-log.md`。

---

## 10. 前端工程目录结构

建议 `apps/web/src` 目录如下：

```text
apps/web/src/
  main.tsx
  App.tsx
  routes/
    index.tsx
    routeConfig.ts
    RequireAuth.tsx

  layouts/
    AuthLayout.tsx
    MainLayout.tsx
    RuntimeLayout.tsx

  pages/
    login/
    app-center/
    app-detail/
    org/
    user/
    role/
    metadata/
    data-modeling/
    form-designer/
    view-designer/
    workflow-designer/
    permission-designer/
    release/
    runtime/
    tasks/
    files/
    audit/
    recycle-bin/
    diagnostics/

  components/
    common/
    layout/
    data-display/
    data-entry/
    feedback/
    permission/

  lowcode/
    metadata/
    runtime/
    designer/
    fields/
    forms/
    views/
    workflows/
    permissions/

  services/
    api/
    mock/
    queryKeys.ts

  stores/
    authStore.ts
    appStore.ts
    designerStore.ts
    runtimeStore.ts

  hooks/
    useCurrentUser.ts
    usePermission.ts
    useRuntimeModel.ts
    useMetadataSnapshot.ts

  utils/
    request.ts
    error.ts
    format.ts
    id.ts

  styles/
    global.css
    theme.ts

  types/
    api.ts
    metadata.ts
    runtime.ts
```

---

## 11. 前端页面边界

P0 前端页面分为三类。

### 11.1 平台管理页面

```text
/login
/apps
/admin/org
/admin/users
/admin/roles
/audit/logs
/security/events
/diagnostics
```

### 11.2 设计态页面

```text
/apps/:appId/overview
/apps/:appId/models
/apps/:appId/forms
/apps/:appId/views
/apps/:appId/workflows
/apps/:appId/permissions
/apps/:appId/releases
/apps/:appId/settings
```

### 11.3 运行态页面

```text
/runtime/apps/:appId
/runtime/apps/:appId/entities/:entityKey/list
/runtime/apps/:appId/entities/:entityKey/new
/runtime/apps/:appId/entities/:entityKey/:recordId
/runtime/apps/:appId/entities/:entityKey/:recordId/edit
/tasks/todo
/tasks/done
/tasks/:taskId
```

详细页面与组件设计由 `60-frontend-page-and-component-design.md` 继续展开。

---

## 12. 前端低代码核心模块

### 12.1 metadata 模块

职责：

```text
1. 定义 DSL TypeScript 类型。
2. 提供 metadata snapshot 解析函数。
3. 提供 resourceType、fieldType、permissionType 等枚举。
4. 提供元数据校验的前端轻量提示。
```

不负责：

```text
1. 不执行最终 DSL 发布校验。
2. 不执行最终权限判断。
3. 不生成真实数据库结构。
```

### 12.2 runtime 模块

职责：

```text
1. 加载 runtime model API。
2. 根据后端裁剪后的模型渲染菜单、列表、表单、详情和按钮。
3. 支持字段 visible / readonly / required 表现。
4. 支持流程节点动作显示。
```

不负责：

```text
1. 不绕过后端权限校验。
2. 不读取设计态 draft_json。
3. 不自行构造未授权字段提交。
```

### 12.3 designer 模块

职责：

```text
1. 支持数据对象、字段、表单、视图、流程、权限的设计态 UI。
2. 生成符合 90 文档的 DSL 草稿。
3. 调用 40 文档中的设计态 API 保存草稿。
```

不负责：

```text
1. 不直接切换运行版本。
2. 不直接修改 metadata_snapshot。
3. 不直接写业务数据。
```

---

## 13. 前端 API Client 决策

P0 前端 API 调用必须经过统一 API Client。

### 13.1 推荐方式

```text
1. 40-api-design.md 先生成 openapi/openapi.yaml。
2. 使用 OpenAPI Generator 生成 packages/api-client。
3. apps/web 只从 packages/api-client 引入 API 方法和 DTO 类型。
4. apps/web/src/services/api 只做业务级封装，不重复定义接口路径。
```

### 13.2 目录示例

```text
packages/api-client/
  src/
    apis/
    models/
    runtime.ts
  package.json
```

```text
apps/web/src/services/api/
  authApi.ts
  appApi.ts
  metadataApi.ts
  releaseApi.ts
  runtimeApi.ts
  recordApi.ts
  workflowApi.ts
  fileApi.ts
```

### 13.3 强约束

```text
1. 不得在页面组件中硬编码完整 API URL。
2. 不得在多个页面重复定义同一个 DTO。
3. 不得绕过统一 request 拦截器。
4. 不得丢失 X-Tenant-Id、X-Request-Id、Idempotency-Key 等请求头。
5. 错误处理必须识别 40-api-design.md 中的统一错误码。
```

---

## 14. 前端 Mock 策略

P0 支持先用 Mock API 出界面。

### 14.1 Mock 实现方式

建议使用 MSW 或 Vite dev middleware 方式。若需要快速生成，可先使用本地 `mockService`。

优先级：

```text
1. P0 初版：本地 mockService + JSON 数据。
2. 联调前：MSW 拦截 API。
3. 联调后：切换真实 API Client。
```

### 14.2 Mock 数据目录

```text
packages/mock-data/
  apps/
    contract-management.json
    expense-report.json
    purchase-request.json
  metadata/
    contract-management.snapshot.json
    expense-report.snapshot.json
    purchase-request.snapshot.json
  records/
    contract.records.json
    expense-report.records.json
    purchase-request.records.json
  workflow/
    todo-tasks.json
    done-tasks.json
  users/
    current-user.json
    org-tree.json
    roles.json
```

### 14.3 Mock 数据约束

```text
1. Mock 元数据必须符合 90-metadata-dsl-guideline.md。
2. Mock runtime model 必须模拟 40-api-design.md 的响应结构。
3. Mock 业务记录必须包含 appVersionId、snapshotId、businessStatus、workflowStatus。
4. Mock 权限必须能体现字段隐藏、只读、必填、按钮权限和数据范围。
5. Mock 不得引入 P1/P2 能力。
```

---

## 15. 后端技术栈决策

### 15.1 基线技术栈

| 类型 | 决策 |
|---|---|
| 语言 | Java |
| JDK | Java 21 LTS 优先，最低不低于 Java 17 |
| 框架 | Spring Boot |
| 构建 | Maven |
| Web | Spring Web MVC |
| 认证 | Spring Security + JWT / Session 适配 |
| 数据访问 | MyBatis 或 Spring Data JDBC，P0 推荐 MyBatis |
| 数据库迁移 | Flyway |
| JSON | Jackson |
| 校验 | Jakarta Bean Validation |
| OpenAPI | springdoc-openapi 或等价工具 |
| 测试 | JUnit 5 + Spring Boot Test + Testcontainers |
| 日志 | SLF4J + Logback |
| 监控预留 | Actuator |

### 15.2 后端选择理由

```text
1. Java + Spring Boot 适合企业私有化交付和权限、审计、事务密集型系统。
2. Maven 简单稳定，适合 Codex 生成和后续 CI。
3. MyBatis 对通用业务记录表、动态索引表和复杂查询更可控。
4. Flyway 适合数据库迁移脚本与版本化管理。
5. Spring Security 可承接 P0 内置登录与后续 SSO 预留。
```

### 15.3 后端不得替换的选型

Codex 不得自行替换：

```text
1. 不得将 Java 后端替换为 Node.js、Go、Python、PHP 或 .NET。
2. 不得将 Spring Boot 替换为 Quarkus、Micronaut、Vert.x 或 NestJS。
3. 不得将 Maven 替换为 Gradle。
4. 不得将 PostgreSQL 优先策略替换为 MongoDB、SQLite 或纯 JSON 文件。
5. 不得绕过 Flyway 手工散落 SQL 初始化。
```

---

## 16. 后端工程目录结构

建议 `apps/api` 采用如下结构：

```text
apps/api/
  pom.xml
  src/main/java/com/example/lowcode/
    LowcodeApplication.java

    common/
      config/
      context/
      error/
      response/
      security/
      audit/
      id/
      json/
      pagination/
      transaction/

    auth/
      controller/
      application/
      domain/
      repository/
      dto/

    app/
    template/
    org/
    user/
    role/
    metadata/
    model/
    form/
    view/
    workflow/
    permission/
    release/
    runtime/
    record/
    file/
    recycle/
    auditlog/
    securityevent/
    diagnostic/

  src/main/resources/
    application.yml
    application-local.yml
    db/migration/

  src/test/java/com/example/lowcode/
```

每个业务模块默认按以下分层：

```text
controller/      处理 HTTP 请求、参数绑定、响应包装
application/     编排用例、事务边界、调用领域服务
domain/          领域规则、校验、状态机、策略
repository/      数据访问接口和实现
dto/             Request / Response / Command / View Object
```

---

## 17. 后端模块边界

P0 后端模块必须至少包括：

| 模块 | 职责 |
|---|---|
| auth | 登录、登出、当前用户、认证上下文。 |
| app | 应用中心、应用成员、应用状态。 |
| template | 应用模板、从模板创建应用。 |
| org / user / role | 组织、用户、角色、用户部门、用户角色。 |
| metadata | 元数据资源、依赖、DSL 草稿保存。 |
| model | 数据对象、字段建模。 |
| form / view | 表单、视图、菜单设计。 |
| workflow | 流程设计与流程运行。 |
| permission | 权限策略、分配、校验、字段裁剪。 |
| release | 发布、回滚、快照、运行指针。 |
| runtime | 运行态模型加载与裁剪。 |
| record | 通用业务记录、索引、唯一字段、自动编号。 |
| file | 文件对象、文件绑定、下载鉴权。 |
| recycle | 统一回收站。 |
| auditlog | 审计日志。 |
| securityevent | 安全事件。 |
| diagnostic | 一致性巡检。 |

详细服务职责由 `50-backend-service-design.md` 继续展开。

---

## 18. 数据库技术栈决策

### 18.1 数据库选择

P0 主数据库优先使用 PostgreSQL。

兼容目标：MySQL。

### 18.2 选择理由

```text
1. PostgreSQL 对 JSONB、事务、索引、部分唯一索引和复杂查询支持较好。
2. 30-core-database-design.md 已明确 PostgreSQL 的部分唯一索引策略更适合软删除唯一约束。
3. MySQL 保留为企业环境兼容目标，但 DDL 生成时必须处理 active_key 等差异策略。
```

### 18.3 数据库版本策略

```text
1. 本地开发默认 PostgreSQL 17 或项目统一版本。
2. 私有化部署可支持 PostgreSQL 16+。
3. MySQL 兼容目标不低于 MySQL 8.0。
4. 不支持 SQLite 作为正式运行数据库。
```

---

## 19. 数据库迁移决策

P0 使用 Flyway 管理数据库迁移。

目录：

```text
apps/api/src/main/resources/db/migration/
  V1__init_tenant_org_user.sql
  V2__init_app_metadata.sql
  V3__init_release_runtime.sql
  V4__init_permission.sql
  V5__init_business_record.sql
  V6__init_workflow.sql
  V7__init_file_audit.sql
  V8__seed_default_data.sql
```

要求：

```text
1. 迁移脚本必须与 30-core-database-design.md 一致。
2. 不得在 Java 代码中隐式创建核心表。
3. 已发布版本的迁移脚本不得随意改写，只能新增迁移。
4. PostgreSQL 和 MySQL 如需差异脚本，应分 profile 或目录管理。
5. 初始化数据必须包含默认 tenant、管理员、角色、应用分类和三个样板模板。
```

---

## 20. 缓存技术栈决策

P0 使用 Redis 作为可选缓存与短期锁组件。

用途：

```text
1. 登录会话或 Token 黑名单。
2. 运行态 metadata snapshot 缓存。
3. runtime model 缓存。
4. 权限有效结果缓存。
5. 幂等 processing 锁。
6. 发布锁、回滚锁或应用级操作锁。
7. 字典、组织树、角色摘要缓存。
```

约束：

```text
1. Redis 不得成为已发布快照的唯一持久化来源。
2. Redis 不得成为业务记录的唯一存储。
3. 缓存失效必须覆盖发布、回滚、权限变更、用户角色变更、应用成员变更。
4. Redis 不可用时，P0 核心流程应可降级为数据库读取，除非是明确依赖锁的高风险操作。
```

---

## 21. 文件存储技术栈决策

### 21.1 P0 文件存储策略

P0 使用文件存储适配层：

```text
FileStorageService
  - LocalFileStorageAdapter
  - S3CompatibleStorageAdapter
```

本地开发可使用：

```text
local filesystem
```

私有化部署推荐：

```text
MinIO 或其他 S3 Compatible 对象存储
```

### 21.2 约束

```text
1. 业务代码不得直接拼接 storage_path 返回给前端。
2. 文件下载、预览必须经过后端鉴权。
3. 文件绑定权威关系必须使用 lc_file_attachment。
4. 本地文件和对象存储必须通过同一个接口暴露。
5. P0 不做公开永久 URL。
```

---

## 22. 认证与安全技术决策

P0 支持内置账号密码登录。

后续预留 SSO/OIDC/SAML/企业微信/钉钉/飞书接入。

### 22.1 P0 认证实现

```text
1. lc_user 保存用户基础信息。
2. lc_user_auth 保存认证凭证。
3. password_hash 不得保存明文密码。
4. 登录成功后返回访问令牌或建立服务端会话。
5. 所有 API 通过认证过滤器注入 RequestContext。
```

### 22.2 Token / Session 策略

P0 推荐：

```text
1. 前后端分离场景使用 JWT access token + refresh token 或服务端 session。
2. 私有化内网简化部署可先使用 HttpOnly Cookie Session。
3. 具体方案由 50-backend-service-design.md 最终收口。
```

无论使用哪种策略，都必须满足：

```text
1. 后端可获取 userId、tenantId、orgId、roleIds。
2. 可记录 requestId、traceId、clientIp、userAgent。
3. 登出、锁定、停用用户后必须阻止继续访问。
4. 登录失败、账号锁定、越权访问必须写安全事件。
```

---

## 23. OpenAPI 与代码生成决策

### 23.1 OpenAPI 目录

```text
openapi/
  openapi.yaml
  fragments/
    common.yaml
    auth.yaml
    app.yaml
    metadata.yaml
    release.yaml
    runtime.yaml
    record.yaml
    workflow.yaml
    file.yaml
    audit.yaml
```

### 23.2 生成目标

```text
1. TypeScript Axios Client：packages/api-client。
2. 后端 Controller / DTO 可参考 OpenAPI，但不强制全量生成。
3. API Mock 可从 OpenAPI 示例生成。
4. API 测试可从 OpenAPI 路径和错误码生成。
```

### 23.3 约束

```text
1. openapi.yaml 必须遵守 40-api-design.md。
2. API Client 生成后不得手工改动生成目录。
3. 业务封装应写在 apps/web/src/services/api。
4. OpenAPI 中必须包含统一响应结构、错误码、分页、幂等 Header、鉴权 Header。
```

---

## 24. ID 生成决策

P0 核心表 ID 使用字符串全局 ID。

推荐：

```text
UUID v7 或雪花 ID
```

约束：

```text
1. 所有核心表 id 字段保持 varchar(64) 兼容。
2. 前端不得生成最终业务记录 ID。
3. 后端可为设计态临时组件生成 clientId，但保存后必须返回后端 ID。
4. appVersionId 与 snapshotId 在发布事务开始时预生成。
5. id 生成逻辑必须集中在 common/id 模块。
```

---

## 25. 环境变量规范

根目录提供 `.env.example`。

### 25.1 前端环境变量

```text
VITE_API_BASE_URL=http://localhost:8080
VITE_MOCK_ENABLED=true
VITE_DEFAULT_TENANT_ID=default
VITE_APP_TITLE=LowCode Platform P0
```

### 25.2 后端环境变量

```text
APP_ENV=local
SERVER_PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/lowcode
DB_USERNAME=lowcode
DB_PASSWORD=lowcode
REDIS_HOST=localhost
REDIS_PORT=6379
FILE_STORAGE_TYPE=local
FILE_STORAGE_LOCAL_ROOT=./data/files
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=lowcode
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
JWT_SECRET=change-me-in-production
```

约束：

```text
1. 不得提交真实密码、Token、密钥。
2. .env.local 不得进入 Git。
3. 私有化部署必须提供独立配置说明。
```

---

## 26. 本地开发启动方式

### 26.1 推荐命令

根目录 `package.json` 提供：

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:web": "pnpm --filter @lowcode/web dev",
    "dev:api": "cd apps/api && mvn spring-boot:run",
    "dev:infra": "docker compose -f infra/docker-compose.yml up -d",
    "dev:down": "docker compose -f infra/docker-compose.yml down",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "build": "pnpm -r build",
    "generate:api-client": "bash scripts/generate-api-client.sh"
  }
}
```

### 26.2 本地启动顺序

```text
1. pnpm install
2. pnpm dev:infra
3. cd apps/api && mvn spring-boot:run
4. pnpm dev:web
```

### 26.3 Mock 前端启动

在后端尚未实现时：

```text
1. 设置 VITE_MOCK_ENABLED=true。
2. apps/web 使用 packages/mock-data。
3. 页面调用 mockService 模拟 40-api-design.md 响应。
```

---

## 27. Docker Compose 本地环境

`infra/docker-compose.yml` 至少包含：

```text
1. postgres
2. redis
3. minio
4. api，可选
5. web，可选
6. nginx，可选
```

P0 本地开发最小依赖：

```text
postgres + redis + minio
```

约束：

```text
1. 不要求 P0 使用 Kubernetes。
2. Docker Compose 必须可一键启动基础依赖。
3. 数据卷路径必须清晰，避免误删。
4. MinIO bucket 初始化可由脚本完成。
```

---

## 28. 代码规范决策

### 28.1 前端规范

```text
1. TypeScript strict 模式。
2. ESLint 检查。
3. Prettier 格式化。
4. 组件文件使用 PascalCase。
5. Hook 使用 useXxx 命名。
6. API 封装使用 xxxApi.ts。
7. Zustand store 使用 xxxStore.ts。
8. 类型优先从 api-client 或 metadata-types 引入。
```

### 28.2 后端规范

```text
1. Java 包名全小写。
2. Controller 不写复杂业务逻辑。
3. Application Service 管理事务边界。
4. Domain Service 承载业务规则。
5. Repository 不返回 HTTP DTO。
6. 所有查询默认包含 tenant_id 和 is_deleted 条件。
7. 日志必须包含 requestId / traceId。
8. 高风险操作必须写 audit_log 或 security_event。
```

---

## 29. 分支与提交规范

P0 推荐简单分支策略：

```text
main        稳定基线
feature/*   功能开发
fix/*       缺陷修复
docs/*      文档更新
```

提交信息建议：

```text
feat: add app center page
feat: add runtime model api
fix: handle field permission readonly state
docs: add tech stack decision
chore: update docker compose
```

Codex 提交或补丁说明必须包含：

```text
1. 修改了哪些文件。
2. 实现了哪些文档要求。
3. 未完成或假设的内容。
4. 已执行的检查命令。
```

---

## 30. 前端生成顺序建议

Codex 生成前端时建议按以下顺序：

```text
1. 创建 Vite + React + TypeScript 工程。
2. 安装 Ant Design、React Router、TanStack Query、Zustand、Axios。
3. 建立 MainLayout、AuthLayout、RuntimeLayout。
4. 建立路由表。
5. 建立 Mock 数据和 mockService。
6. 建立 API Client 封装占位。
7. 实现登录页和应用中心。
8. 实现设计态页面骨架。
9. 实现运行态 runtime renderer 最小版本。
10. 实现任务中心和审批详情。
11. 实现发布、回滚、审计、安全、诊断页面骨架。
12. 增加基础测试。
```

---

## 31. 后端生成顺序建议

Codex 生成后端时建议按以下顺序：

```text
1. 创建 Spring Boot Maven 工程。
2. 建立 common 模块：响应、错误码、上下文、鉴权、审计、ID、分页。
3. 建立 Flyway 迁移脚本。
4. 实现 auth、org、user、role 基础 API。
5. 实现 app、template 基础 API。
6. 实现 metadata 草稿保存与依赖 API。
7. 实现 release、snapshot、runtime pointer API。
8. 实现 runtime model API。
9. 实现 record、index、unique、sequence API。
10. 实现 workflow task API。
11. 实现 file upload/download API。
12. 实现 recycle、audit、security、diagnostic API。
13. 增加集成测试。
```

---

## 32. 样板应用工程落点

三个样板应用必须作为 seed / mock 数据进入工程：

```text
1. contract_management
2. expense_report
3. purchase_request
```

工程落点：

```text
packages/mock-data/apps/*.json
packages/mock-data/metadata/*.snapshot.json
db/seed/*.sql 或 db/seed/*.json
apps/api/src/main/resources/seed/*.json
```

约束：

```text
1. 样板应用不得写成独立前端页面专属逻辑。
2. 样板应用必须通过 metadata + runtime renderer 渲染。
3. 样板业务数据必须进入通用 record mock 或 lc_business_record。
4. 样板流程必须进入 workflow DSL 或流程运行表。
```

---

## 33. 与 90 元数据 DSL 的关系

本文档要求工程中至少建立以下共享类型包：

```text
packages/metadata-types/
  src/
    common.ts
    entity.ts
    field.ts
    form.ts
    view.ts
    workflow.ts
    permission.ts
    menu.ts
    snapshot.ts
    runtime.ts
```

约束：

```text
1. TypeScript 类型必须以 90 文档为准。
2. 前端运行态渲染器必须消费 snapshot 或 runtime model，不得消费 draft_json。
3. 后端元数据校验必须以 90 文档为准。
4. 后续 OpenAPI 中的 metadata DTO 应引用相同语义。
```

---

## 34. 与 30 数据库设计的关系

后端代码生成必须遵守：

```text
1. 表名前缀 lc_。
2. 不为业务对象生成独立业务表。
3. 使用 lc_business_record + lc_business_record_index。
4. 文件绑定权威表是 lc_file_attachment。
5. 自动编号使用 lc_sequence_counter。
6. 唯一字段使用 lc_business_unique_value。
7. 回收站使用 lc_recycle_item。
8. 发布与运行指针使用 lc_app_version、lc_metadata_snapshot、lc_app_runtime_pointer。
9. 不得原地修改已发布 snapshot_json。
10. 所有核心查询必须包含 tenant_id。
```

---

## 35. 与 40 API 设计的关系

前端和后端代码生成必须遵守：

```text
1. API 路径统一使用 /api/v1。
2. 统一响应结构。
3. 统一错误码。
4. 统一分页、排序、过滤规范。
5. 高风险写接口支持 Idempotency-Key。
6. 运行态 API 必须先读取 app_runtime_pointer。
7. 运行态 API 不得读取 metadata_resource.draft_json。
8. 附件下载必须后端鉴权。
9. 查询结果必须后端字段裁剪。
10. 越权行为必须写 security_event。
```

---

## 36. 技术版本策略

P0 使用“主版本锁定 + 小版本可升级”策略。

示例：

```text
Node.js: 24 LTS
React: 19.x
Vite: 7.x
TypeScript: 5.x
Ant Design: 5.x
Java: 21 LTS
Spring Boot: 3.x
PostgreSQL: 17.x preferred, 16+ supported
Redis: 7.x
```

约束：

```text
1. package.json 和 pom.xml 应锁定主版本范围。
2. 不在 P0 中追逐实验性框架。
3. 升级主版本必须更新本文档和决策日志。
4. Codex 不得自行升级到未确认的主版本。
```

---

## 37. 性能与规模假设

P0 技术栈按以下规模假设设计：

```text
1. 单租户私有化部署。
2. 几十到数百个内部用户。
3. 三个样板应用优先。
4. 单应用对象数量有限。
5. 表单字段、视图字段、流程节点数量处于中后台系统常见范围。
6. 业务记录量可以增长，但 P0 不做 OLAP 和复杂报表。
```

技术策略：

```text
1. 列表查询依赖固定列和索引表。
2. 运行态模型可以缓存。
3. 权限结果可以缓存。
4. 文件走后端鉴权流式下载。
5. 审计日志和运行错误日志可按时间归档。
```

---

## 38. 安全基线

```text
1. 所有 API 默认需要认证，除登录、健康检查和公开静态资源外。
2. 所有运行态 API 必须执行权限校验。
3. 表单提交不得信任前端隐藏字段。
4. 附件下载不得直接暴露 storage_path。
5. 密码不得明文存储。
6. Token、密钥、密码不得进入日志和审计详情。
7. 前端不得硬编码管理员账号或密钥。
8. CORS、Cookie、Token 策略必须区分本地和生产。
9. 数据导出必须执行字段权限裁剪。
10. 越权和可疑行为必须记录安全事件。
```

---

## 39. 测试技术决策

### 39.1 前端测试

```text
1. Vitest：工具函数、元数据解析、字段组件逻辑。
2. React Testing Library：表单渲染、权限裁剪表现、页面交互。
3. Playwright：登录、应用中心、设计态保存、发布、运行态填报、审批、附件下载等 E2E。
```

### 39.2 后端测试

```text
1. JUnit 5：领域规则和工具类。
2. Spring Boot Test：Controller、Application Service、权限拦截。
3. Testcontainers：PostgreSQL、Redis、MinIO 集成测试。
4. API 契约测试：基于 OpenAPI 或统一响应结构验证。
```

### 39.3 必测场景

```text
1. 设计态修改不影响运行态。
2. 发布失败不切换运行指针。
3. 回滚只切换 pointer。
4. 业务记录保存同步索引和唯一字段。
5. 字段越权提交被拒绝。
6. 无权限附件下载被拒绝。
7. 流程实例绑定旧 snapshot 不受新发布影响。
8. tenant_id 隔离条件存在。
```

详细测试验收由 `80-test-and-acceptance-plan.md` 展开。

---

## 40. CI 检查建议

P0 至少需要以下检查：

```text
1. 前端 lint。
2. 前端 typecheck。
3. 前端 unit test。
4. 前端 build。
5. 后端 compile。
6. 后端 unit test。
7. Flyway migration 校验。
8. OpenAPI lint。
9. Docker Compose 配置校验。
```

建议脚本：

```text
scripts/lint-all.sh
scripts/test-all.sh
scripts/build-all.sh
scripts/check-openapi.sh
```

---

## 41. Codex 执行入口约束

仓库根目录必须提供 `CODEX.md`。

`CODEX.md` 至少包含：

```text
1. 先阅读 docs/00-project-context-summary.md。
2. 再阅读 docs/90-metadata-dsl-guideline.md。
3. 再阅读 docs/20-system-architecture-design.md。
4. 再阅读 docs/30-core-database-design.md。
5. 再阅读 docs/40-api-design.md。
6. 再阅读 docs/45-tech-stack-and-scaffold-decision.md。
7. 若做前端，继续阅读 docs/60-frontend-page-and-component-design.md。
8. 若做后端，继续阅读 docs/50-backend-service-design.md。
9. 不得自行替换技术栈。
10. 每次改动后运行对应检查命令。
```

完整 Codex 执行说明由 `99-codex-execution-guide.md` 展开。

---

## 42. Codex 生成前端代码强约束

```text
1. 必须使用 React + TypeScript + Vite + Ant Design。
2. 必须使用 React Router 管理路由。
3. 必须使用 TanStack Query 管理服务端状态。
4. 必须使用 Zustand 管理复杂本地 UI 状态。
5. 页面不得直接硬编码真实后端 URL。
6. 运行态页面必须通过 runtime model 或 metadata snapshot 渲染。
7. 样板应用不得写成三套固定 CRUD 页面。
8. 字段权限必须影响前端展示，但最终校验仍以后端为准。
9. 不得在前端实现最终审批推进逻辑，只能调用流程 API。
10. 不得在前端生成最终业务编号。
```

---

## 43. Codex 生成后端代码强约束

```text
1. 必须使用 Java + Spring Boot + Maven。
2. 必须按模块化单体组织代码。
3. 不得生成微服务网关、注册中心、服务发现等 P0 不做内容。
4. 不得为 contract、expense_report、purchase_request 创建独立业务表。
5. 所有运行态读取必须通过 app_runtime_pointer 和 metadata_snapshot。
6. 业务记录写入必须同步 data、index、relation、unique、change_log、audit。
7. 发布、回滚、审批、业务提交必须有事务边界。
8. 附件下载必须查询 lc_file_attachment 并鉴权。
9. 查询默认包含 tenant_id。
10. 不得把密码字段放入 lc_user。
```

---

## 44. 可替换适配层

以下技术可以通过适配层替换，但不得影响业务代码：

| 能力 | 默认实现 | 可替换方向 | 适配层 |
|---|---|---|---|
| 文件存储 | 本地 / S3 Compatible | 企业对象存储、NAS | FileStorageService |
| 缓存 | Redis | 内存缓存、其他缓存 | CacheService |
| ID 生成 | UUID v7 / 雪花 | 企业统一 ID 服务 | IdGenerator |
| 认证 | 内置账号密码 | SSO/OIDC/SAML | AuthProvider |
| 消息通知 | P0 可不做 | 邮件、企业 IM | NotificationService |
| 审计写入 | 数据库 | 日志平台、SIEM | AuditSink |

约束：

```text
1. 适配层接口稳定。
2. 业务模块依赖接口，不依赖具体实现。
3. P0 只实现最小可用默认实现。
```

---

## 45. 后续文档输入

本文档完成后，应进入：

```text
1. 50-backend-service-design.md
2. 60-frontend-page-and-component-design.md
3. 70-development-task-breakdown.md
4. 80-test-and-acceptance-plan.md
5. 99-codex-execution-guide.md
```

如果目标是先让 Codex 生成前端界面，则优先补：

```text
1. 60-frontend-page-and-component-design.md
2. 70-development-task-breakdown.md
3. 99-codex-execution-guide.md
```

---

## 46. 附录：P0 技术栈红线

```text
1. 不得自行替换 React / TypeScript / Vite / Ant Design。
2. 不得自行替换 Java / Spring Boot / Maven。
3. 不得把 P0 后端拆成多个微服务。
4. 不得引入微前端。
5. 不得让前端成为权限判断权威。
6. 不得让运行态读取设计态 draft_json。
7. 不得为业务对象生成独立业务表。
8. 不得绕过 OpenAPI / API Client 直接散落接口调用。
9. 不得绕过 Flyway 手工建表。
10. 不得把文件 storage_path 作为公开 URL 返回。
11. 不得把 Mock 数据设计成与 90 DSL 和 40 API 不一致。
12. 不得在未更新本文档和决策日志的情况下升级主版本技术栈。
```
