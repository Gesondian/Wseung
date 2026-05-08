---
title: 开发任务拆解
subtitle: 企业级低代码平台 v1.0｜P0 Codex 可执行开发任务拆解
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
  - 50-backend-service-design.md
  - 60-frontend-runtime-renderer-design.md
  - 61-frontend-page-and-component-design.md
  - 90-metadata-dsl-guideline.md
---

# 70-development-task-breakdown.md

版本：v1.0  
适用范围：低代码平台 P0 开发任务拆解、Codex 执行计划、工程落地顺序、任务验收、前后端协作、Mock 与联调阶段安排  
最后更新：2026-05-06  
状态：基线版

---

## 1. 文档目的

本文档用于将 P0 阶段低代码平台的架构、数据库、API、技术栈、后端服务、前端运行态渲染器和前端页面组件设计拆解为可执行开发任务。

本文档面向：

```text
1. 使用 Codex 生成代码的执行过程。
2. 前端、后端、数据库、测试任务拆解。
3. 开发顺序规划。
4. 每个任务的输入、产出、验收标准定义。
5. 避免 Codex 一次性生成过多无边界代码。
6. 避免 Codex 跳过元数据 DSL、运行态快照、权限、审计、幂等和版本冲突等核心约束。
```

本文档不是项目管理系统中的完整排期表，不包含人力、日期、工期和成本估算。后续可以基于本文拆分 Jira / Linear / GitHub Issues / GitLab Issues。

---

## 2. 开发任务拆解目标

| 目标 | 说明 |
|---|---|
| 可执行 | 每个任务都能被 Codex 或开发人员独立理解和执行。 |
| 可验收 | 每个任务必须有明确验收标准。 |
| 可追溯 | 每个任务必须指向输入文档。 |
| 可分阶段 | 支持先前端 Mock、再后端、再联调，也支持前后端并行。 |
| 不跑偏 | 明确禁止事项，避免生成 P1/P2 能力或违背架构决策。 |
| 可回滚 | 每个阶段尽量形成可运行检查点。 |
| 可测试 | 每个阶段都给出需要执行的命令和测试范围。 |

---

## 3. 开发任务拆解原则

```text
1. 先搭工程骨架，再补功能实现。
2. 先 Mock 可运行，再接真实后端。
3. 先实现 P0 主闭环，再实现增强页面。
4. 先实现通用机制，再实现三个样板应用。
5. 先实现后端强约束，再做前端表现优化。
6. 任何运行态能力必须经过 RuntimeModel，不得硬编码业务对象页面。
7. 任何后端写操作必须考虑事务、权限、审计、幂等和版本冲突。
8. 任何数据库生成不得为合同、报销、采购创建独立业务表。
9. 每个任务完成后必须运行对应检查命令。
10. 如果任务无法完整完成，必须保留可运行状态并写明未完成项。
```

---

## 4. P0 开发范围

P0 开发覆盖以下能力：

```text
1. Monorepo 工程骨架。
2. React + TypeScript + Vite + Ant Design 前端应用。
3. Spring Boot + Maven 后端应用。
4. PostgreSQL 数据库迁移脚本。
5. Redis 缓存接入预留。
6. 本地文件和 S3 Compatible 文件存储适配。
7. 应用中心、模板中心、组织用户角色。
8. 元数据设计态：对象、字段、表单、视图、菜单、流程、权限。
9. 发布态：校验、快照、版本、运行指针、回滚。
10. 运行态：RuntimeModel、列表、表单、详情、审批、附件。
11. 通用业务记录、索引、唯一字段、自动编号。
12. 流程实例、待办、审批动作、轨迹。
13. 审计日志、安全事件、运行错误日志。
14. 回收站和一致性巡检。
15. 三个样板应用：合同管理、费用报销、采购申请。
16. Mock API、Mock RuntimeModel、Mock 业务数据。
17. 单元测试、前端组件测试、API 测试、E2E 验收预留。
```

---

## 5. P0 不做范围

```text
1. 不做插件市场。
2. 不做完整 BPMN。
3. 不做完整 BI 和报表平台。
4. 不做 AI 自动生成应用。
5. 不做完整 SaaS 计费、套餐、租户运营后台。
6. 不做原生移动端 App。
7. 不做多仓库工程。
8. 不为业务对象动态生成物理表。
9. 不接入真实第三方企业微信、钉钉、飞书、OIDC、SAML。
10. 不做复杂分布式事务、Saga、消息总线。
11. 不做插件沙箱和自定义代码组件。
12. 不做生产级高可用部署编排。
```

---

## 6. 输入文档阅读顺序

Codex 或开发人员开始实现前，必须按以下顺序阅读文档：

```text
1. 00-project-context-summary.md
2. 00-project-doc-index.md
3. 00-current-working-plan.md
4. 00-decision-log.md
5. 90-metadata-dsl-guideline.md
6. 20-system-architecture-design.md
7. 30-core-database-design.md
8. 40-api-design.md
9. 45-tech-stack-and-scaffold-decision.md
10. 50-backend-service-design.md
11. 60-frontend-runtime-renderer-design.md
12. 61-frontend-page-and-component-design.md
13. 70-development-task-breakdown.md
```

说明：

```text
1. 90 定义 DSL，不得被前端或后端代码自由改写。
2. 20 定义架构边界，不得绕过设计态、发布态、运行态分层。
3. 30 定义数据库落点，不得新增对象专属业务表。
4. 40 定义 API 契约，不得随意更改路径和响应结构。
5. 45 定义技术栈和脚手架，不得更换前端框架、组件库、后端框架和数据库。
6. 50 定义后端服务边界，不得把业务逻辑堆入 Controller 或单一 Service。
7. 60 定义运行态渲染器，不得硬编码合同、报销、采购页面。
8. 61 定义页面组件，不得遗漏 P0 页面、状态和角色视角。
```

---

## 7. 任务编号规范

任务编号采用：

```text
P{phase}-{domain}-{seq}
```

示例：

```text
P1-FE-001：初始化前端工程
P2-BE-003：创建后端基础模块
P4-RT-002：实现 RuntimeModel Adapter
P7-QA-005：验收字段权限裁剪
```

任务域说明：

| 域 | 说明 |
|---|---|
| DOC | 文档和约束确认 |
| INFRA | 工程、依赖、脚手架、CI |
| DB | 数据库、迁移、初始化数据 |
| BE | 后端服务 |
| API | API 契约、Client、Mock |
| FE | 前端页面和组件 |
| RT | Runtime Renderer |
| MOCK | Mock 数据和 Mock API |
| SAMPLE | 样板应用 |
| QA | 测试和验收 |
| OPS | 本地运行、部署和诊断 |

---

## 8. 任务卡片模板

每个开发任务建议采用如下结构：

```text
任务编号：
任务名称：
优先级：P0-Must-Core / P0-Must-Support / P0-Recommended / P0-Optional
阶段：
输入文档：
前置任务：
目标：
涉及目录：
主要步骤：
产出物：
禁止事项：
验收标准：
检查命令：
```

Codex 执行时不得省略：

```text
1. 输入文档。
2. 目标。
3. 产出物。
4. 禁止事项。
5. 验收标准。
6. 检查命令。
```

---

## 9. 优先级定义

| 优先级 | 含义 | 示例 |
|---|---|---|
| P0-Must-Core | P0 主闭环不可缺失，不完成不能进入验收。 | 登录、应用中心、元数据、发布、运行态表单、业务记录、流程审批、权限、审计。 |
| P0-Must-Support | P0 主闭环支撑能力，不一定首日完成，但进入 P0 验收前必须完成。 | 自动编号、唯一字段、回收站、安全事件、运行错误日志、样板模板。 |
| P0-Recommended | 强烈建议完成，可提升稳定性和可用性。 | 幂等键、文件访问日志、前端组件测试。 |
| P0-Optional | 可在 P0 采用替代方案或暂缓。 | 数据库权限缓存表、业务附件冗余表。 |
| P1-Reserved | P0 不实现，只预留。 | 插件市场、完整 BI、AI 生成应用、复杂 SaaS 后台。 |

---

## 10. 推荐开发路线

本文档支持两种路线。

### 10.1 前端优先路线

适合目标：先给 Codex 生成可运行界面和 Mock 演示。

```text
Phase 0：文档约束确认
Phase 1：Monorepo 与前端脚手架
Phase 2：Mock API 与样板 RuntimeModel
Phase 3：基础布局、登录、应用中心
Phase 4：设计态页面
Phase 5：Runtime Renderer
Phase 6：运行态页面、任务中心、审批
Phase 7：发布、文件、审计、安全、诊断页面 Mock
Phase 8：补齐状态、权限、版本冲突和 H5
Phase 9：前端验收
```

### 10.2 全栈并行路线

适合目标：前后端一起落地。

```text
Phase 0：文档约束确认
Phase 1：Monorepo、前端、后端、数据库脚手架
Phase 2：OpenAPI / Mock / API Client
Phase 3：后端基础设施和认证
Phase 4：数据库迁移和初始化数据
Phase 5：核心后端服务
Phase 6：前端设计态页面
Phase 7：前端运行态渲染器
Phase 8：前后端联调
Phase 9：测试和验收
```

### 10.3 本文推荐路线

建议采用“前端 Mock + 后端骨架并行”的路线：

```text
1. 先保证前端界面可运行。
2. 同时生成后端工程骨架、数据库迁移和基础服务。
3. 用 Mock API 驱动前端，避免等待后端完成。
4. 后端 API 完成后逐步替换 Mock。
5. 最后做联调、权限、流程、文件、审计和验收。
```

---

## 11. 阶段总览

| 阶段 | 名称 | 目标 | 完成标志 |
|---|---|---|---|
| Phase 0 | 文档与边界确认 | 读取文档，确认禁止事项和目标路线。 | 形成执行摘要，不修改代码。 |
| Phase 1 | 工程脚手架 | 创建 Monorepo、前端、后端、数据库、Mock 基础结构。 | 本地可启动空壳。 |
| Phase 2 | 契约与 Mock | 建立 API 类型、Mock 服务、样板数据。 | 前端可用 Mock API。 |
| Phase 3 | 后端基础设施 | 认证、上下文、异常、审计、幂等、基础 Repository。 | 后端基础 API 可跑通。 |
| Phase 4 | 核心数据库与服务 | 实现元数据、应用、组织、权限、发布、记录、流程、文件核心服务。 | 后端主闭环 API 可用。 |
| Phase 5 | 前端基础页面 | 实现登录、布局、应用中心、管理页面。 | 页面路由可访问。 |
| Phase 6 | 设计态前端 | 实现数据建模、表单设计器、流程设计器、权限设计、发布管理。 | 设计态主流程可 Mock 保存。 |
| Phase 7 | Runtime Renderer | 实现运行态模型适配、字段组件、表单、列表、详情、审批渲染。 | 三个样板应用可运行。 |
| Phase 8 | 联调与样板应用 | 前后端联调，初始化样板应用。 | 样板应用主闭环跑通。 |
| Phase 9 | 测试验收 | 补齐测试、错误态、权限态、H5、构建检查。 | 满足 P0 DoD。 |
| Phase 10 | Codex 交接 | 生成执行说明和后续任务清单。 | 可交给 Codex 持续迭代。 |

---

# Phase 0：文档与边界确认

## 12. P0-DOC-001：读取文档并生成执行摘要

| 字段 | 内容 |
|---|---|
| 任务编号 | P0-DOC-001 |
| 任务名称 | 读取文档并生成执行摘要 |
| 优先级 | P0-Must-Core |
| 输入文档 | 00、20、30、40、45、50、60、61、90、70 |
| 前置任务 | 无 |
| 目标 | 确认项目目标、技术栈、P0 范围、不做范围和代码生成边界。 |
| 涉及目录 | 仓库根目录，docs/ |

主要步骤：

```text
1. 读取 00-project-context-summary.md。
2. 读取 00-project-doc-index.md。
3. 读取 00-current-working-plan.md。
4. 读取 00-decision-log.md。
5. 读取 90 / 20 / 30 / 40 / 45 / 50 / 60 / 61。
6. 输出不超过 100 行的执行摘要。
7. 标出当前阶段只实现 P0，不实现 P1/P2。
```

产出物：

```text
docs/execution-summary.md（可选）
```

禁止事项：

```text
1. 不得修改技术栈。
2. 不得新增 P1/P2 能力。
3. 不得开始生成业务代码前跳过文档阅读。
```

验收标准：

```text
1. 执行摘要包含 P0 范围。
2. 执行摘要包含技术栈。
3. 执行摘要包含禁止事项。
4. 执行摘要包含后续任务阶段。
```

检查命令：

```bash
ls docs || true
```

---

## 13. P0-DOC-002：确认工程实现路线

| 字段 | 内容 |
|---|---|
| 任务编号 | P0-DOC-002 |
| 任务名称 | 确认工程实现路线 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45-tech-stack-and-scaffold-decision.md, 70-development-task-breakdown.md |
| 前置任务 | P0-DOC-001 |
| 目标 | 选择“前端 Mock + 后端骨架并行”路线。 |

主要步骤：

```text
1. 确认 Monorepo。
2. 确认前端使用 React + TypeScript + Vite + Ant Design。
3. 确认后端使用 Java + Spring Boot + Maven。
4. 确认数据库使用 PostgreSQL + Flyway。
5. 确认先 Mock API，再真实联调。
```

产出物：

```text
README.md 中的开发路线说明，或 docs/execution-summary.md 中的开发路线小节。
```

禁止事项：

```text
1. 不得改用 Next.js、Vue、Angular、NestJS、Django、Rails。
2. 不得改用 MySQL 作为首选数据库。
3. 不得改成多仓库。
```

验收标准：

```text
1. 工程路线明确。
2. Codex 后续任务不需要再猜技术栈。
```

---

# Phase 1：工程脚手架

## 14. P1-INFRA-001：创建 Monorepo 根结构

| 字段 | 内容 |
|---|---|
| 任务编号 | P1-INFRA-001 |
| 任务名称 | 创建 Monorepo 根结构 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45-tech-stack-and-scaffold-decision.md |
| 前置任务 | P0-DOC-001, P0-DOC-002 |
| 目标 | 创建符合 45 文档的单仓库结构。 |

涉及目录：

```text
apps/web
apps/server
packages/shared
packages/api-client
packages/runtime-types
infra/docker
infra/db
infra/mock
scripts
docs
```

主要步骤：

```text
1. 创建根目录结构。
2. 创建根 README.md。
3. 创建 package.json 或 pnpm-workspace.yaml。
4. 创建 .gitignore。
5. 创建 .editorconfig。
6. 创建基础 scripts 目录。
7. 将文档包放入 docs/ 或保持现有文档目录可访问。
```

产出物：

```text
README.md
package.json
pnpm-workspace.yaml
apps/web/
apps/server/
packages/
infra/
scripts/
```

禁止事项：

```text
1. 不得创建多个不相关工程。
2. 不得将前后端代码混在同一 src 中。
3. 不得把文档散落到代码目录。
```

验收标准：

```text
1. 仓库根目录能看出前端、后端、共享包和基础设施目录。
2. README 说明本地启动方式。
3. 目录命名与 45 文档一致。
```

检查命令：

```bash
ls
find apps packages infra scripts -maxdepth 2 -type d
```

---

## 15. P1-FE-001：初始化前端工程

| 字段 | 内容 |
|---|---|
| 任务编号 | P1-FE-001 |
| 任务名称 | 初始化前端工程 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45, 60, 61 |
| 前置任务 | P1-INFRA-001 |
| 目标 | 创建 React + TypeScript + Vite + Ant Design 前端项目。 |

涉及目录：

```text
apps/web
apps/web/src/app
apps/web/src/routes
apps/web/src/layouts
apps/web/src/pages
apps/web/src/components
apps/web/src/runtime
apps/web/src/designers
apps/web/src/services
apps/web/src/mocks
apps/web/src/stores
apps/web/src/types
apps/web/src/utils
```

主要步骤：

```text
1. 初始化 Vite React TypeScript 项目。
2. 安装 Ant Design。
3. 配置 React Router。
4. 配置基础布局。
5. 配置 ESLint / TypeScript。
6. 创建空路由页面。
7. 创建 Mock Service 入口预留。
```

产出物：

```text
apps/web/package.json
apps/web/vite.config.ts
apps/web/src/main.tsx
apps/web/src/app/App.tsx
apps/web/src/routes/index.tsx
apps/web/src/layouts/*
```

禁止事项：

```text
1. 不得使用 Vue、Angular、Next.js。
2. 不得跳过 TypeScript。
3. 不得在页面中硬编码合同/报销/采购运行态逻辑。
```

验收标准：

```text
1. npm run dev 可启动。
2. npm run build 可通过。
3. 页面能显示基础 AppShell。
```

检查命令：

```bash
cd apps/web
npm install
npm run build
```

---

## 16. P1-BE-001：初始化后端工程

| 字段 | 内容 |
|---|---|
| 任务编号 | P1-BE-001 |
| 任务名称 | 初始化后端工程 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45, 50 |
| 前置任务 | P1-INFRA-001 |
| 目标 | 创建 Java + Spring Boot + Maven 后端工程骨架。 |

涉及目录：

```text
apps/server/src/main/java
apps/server/src/main/resources
apps/server/src/test/java
```

建议包结构：

```text
com.company.lowcode
  common
  auth
  tenant
  app
  org
  metadata
  permission
  release
  runtime
  record
  workflow
  file
  audit
  recycle
  diagnostics
```

主要步骤：

```text
1. 初始化 Spring Boot Maven 工程。
2. 配置 Web、Validation、Security、JPA 或 MyBatis、Flyway。
3. 创建统一响应结构。
4. 创建统一异常处理。
5. 创建健康检查接口。
6. 创建基础配置文件。
```

产出物：

```text
apps/server/pom.xml
apps/server/src/main/java/.../LowcodeApplication.java
apps/server/src/main/resources/application.yml
apps/server/src/main/java/.../common/*
```

禁止事项：

```text
1. 不得创建微服务拆分工程。
2. 不得把所有业务写入一个 controller 或 service。
3. 不得跳过统一异常处理。
```

验收标准：

```text
1. mvn test 可通过。
2. 服务可启动。
3. /actuator/health 或 /api/v1/health 可返回正常。
```

检查命令：

```bash
cd apps/server
mvn test
```

---

## 17. P1-DB-001：创建数据库迁移目录和基础配置

| 字段 | 内容 |
|---|---|
| 任务编号 | P1-DB-001 |
| 任务名称 | 创建数据库迁移目录和基础配置 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 45 |
| 前置任务 | P1-BE-001 |
| 目标 | 建立 Flyway 迁移结构。 |

涉及目录：

```text
apps/server/src/main/resources/db/migration
infra/db
```

主要步骤：

```text
1. 创建 Flyway 迁移目录。
2. 创建 V001__init_schema.sql。
3. 创建 V002__seed_default_tenant.sql。
4. 创建数据库连接配置。
5. 创建 Docker Compose 中 PostgreSQL 服务。
```

产出物：

```text
V001__init_schema.sql
V002__seed_default_tenant.sql
docker-compose.yml
```

禁止事项：

```text
1. 不得为 contract / expense_report / purchase_request 创建独立业务表。
2. 不得跳过 tenant_id。
3. 不得生成普通唯一索引 tenant_id + key + is_deleted 作为软删除唯一策略。
```

验收标准：

```text
1. 数据库可启动。
2. Flyway 可执行。
3. 基础表结构与 30 文档一致。
```

检查命令：

```bash
docker compose up -d postgres
cd apps/server
mvn test
```

---

## 18. P1-INFRA-002：创建 Docker Compose 本地环境

| 字段 | 内容 |
|---|---|
| 任务编号 | P1-INFRA-002 |
| 任务名称 | 创建 Docker Compose 本地环境 |
| 优先级 | P0-Must-Support |
| 输入文档 | 45 |
| 前置任务 | P1-INFRA-001 |
| 目标 | 本地提供 PostgreSQL、Redis、对象存储模拟服务。 |

服务清单：

```text
postgres
redis
minio 或本地对象存储替代
```

禁止事项：

```text
1. 不得要求开发者必须安装生产级中间件。
2. 不得把数据库密码写死在代码里。
```

验收标准：

```text
1. docker compose up -d 可启动基础服务。
2. 后端可通过环境变量连接数据库。
```

---

# Phase 2：API 契约、Mock 与样板数据

## 19. P2-API-001：创建共享 API 类型和统一响应类型

| 字段 | 内容 |
|---|---|
| 任务编号 | P2-API-001 |
| 任务名称 | 创建共享 API 类型和统一响应类型 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 45 |
| 前置任务 | P1-FE-001, P1-BE-001 |
| 目标 | 定义前后端共享的响应、分页、错误、上下文类型。 |

涉及目录：

```text
packages/shared
packages/api-client
apps/web/src/services
apps/server/src/main/java/.../common/api
```

主要步骤：

```text
1. 定义 ApiResponse。
2. 定义 PageRequest / PageResponse。
3. 定义 ErrorCode。
4. 定义 RequestContext。
5. 前端和后端保持字段命名口径一致。
```

验收标准：

```text
1. 前端 API Client 可以使用统一响应类型。
2. 后端 Controller 返回统一结构。
3. 错误码命名与 40 文档一致。
```

---

## 20. P2-MOCK-001：创建 Mock API 基础设施

| 字段 | 内容 |
|---|---|
| 任务编号 | P2-MOCK-001 |
| 任务名称 | 创建 Mock API 基础设施 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 60, 61 |
| 前置任务 | P1-FE-001 |
| 目标 | 前端可在无后端情况下调用 Mock API。 |

涉及目录：

```text
apps/web/src/mocks
apps/web/src/services
apps/web/src/runtime/__fixtures__
```

Mock 路由最小集合：

```text
POST   /api/v1/auth/login
GET    /api/v1/apps
GET    /api/v1/apps/:appId
GET    /api/v1/runtime/apps/:appId/model
GET    /api/v1/runtime/apps/:appId/entities/:entityKey/views/:viewKey/records
GET    /api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId
POST   /api/v1/runtime/apps/:appId/entities/:entityKey/records
PUT    /api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId
POST   /api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId/submit
GET    /api/v1/workflow/tasks/todo
POST   /api/v1/workflow/tasks/:taskId/approve
POST   /api/v1/workflow/tasks/:taskId/reject
```

验收标准：

```text
1. 前端启动后可以使用 Mock 登录。
2. 应用中心显示三个样板应用。
3. 运行态模型可以被 Runtime Renderer 加载。
```

---

## 21. P2-SAMPLE-001：创建三个样板应用 Mock 数据

| 字段 | 内容 |
|---|---|
| 任务编号 | P2-SAMPLE-001 |
| 任务名称 | 创建三个样板应用 Mock 数据 |
| 优先级 | P0-Must-Core |
| 输入文档 | 01-10, 60, 61, 90 |
| 前置任务 | P2-MOCK-001 |
| 目标 | 提供合同管理、费用报销、采购申请的 Mock RuntimeModel 和记录。 |

涉及目录：

```text
apps/web/src/runtime/__fixtures__
apps/web/src/mocks/data
```

样板应用：

```text
contract_management
expense_report
purchase_request
```

每个样板应用必须包含：

```text
1. app 信息。
2. entity 定义。
3. field 定义。
4. form 定义。
5. list view 定义。
6. detail view 定义。
7. workflow 定义。
8. permission mock。
9. sample records。
10. sample tasks。
11. file attachments mock。
```

禁止事项：

```text
1. 不得为每个样板应用写独立页面。
2. 不得绕过 RuntimeModel。
```

验收标准：

```text
1. 三个样板应用可在应用中心看到。
2. 三个样板应用可进入运行态列表。
3. 至少一个样板应用可创建、提交、审批 Mock 记录。
```

---

## 22. P2-API-002：生成或手写前端 API Client 初版

| 字段 | 内容 |
|---|---|
| 任务编号 | P2-API-002 |
| 任务名称 | 生成或手写前端 API Client 初版 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 45, 60, 61 |
| 前置任务 | P2-MOCK-001 |
| 目标 | 所有页面通过统一 API Client 调用接口或 Mock。 |

涉及目录：

```text
apps/web/src/services/apiClient.ts
apps/web/src/services/authApi.ts
apps/web/src/services/appApi.ts
apps/web/src/services/runtimeApi.ts
apps/web/src/services/workflowApi.ts
apps/web/src/services/fileApi.ts
```

禁止事项：

```text
1. 页面组件不得直接 fetch。
2. 页面组件不得拼接底层 URL。
3. Runtime Renderer 不得绕过 runtimeApi。
```

验收标准：

```text
1. 页面调用统一 service。
2. Mock 和真实 API baseURL 可切换。
3. 错误统一经过 API error handler。
```

---

# Phase 3：后端基础设施

## 23. P3-BE-001：实现统一请求上下文

| 字段 | 内容 |
|---|---|
| 任务编号 | P3-BE-001 |
| 任务名称 | 实现统一请求上下文 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 50 |
| 前置任务 | P1-BE-001 |
| 目标 | 后端每个请求具备 tenantId、userId、requestId、traceId。 |

主要步骤：

```text
1. 创建 RequestContext。
2. 创建 RequestContextHolder。
3. 创建过滤器或拦截器。
4. 解析 requestId / traceId。
5. P0 默认 tenantId = default 租户。
```

验收标准：

```text
1. Controller 和 Service 可获取上下文。
2. 日志中包含 requestId / traceId。
3. 后续审计可读取上下文。
```

---

## 24. P3-BE-002：实现认证与会话服务初版

| 字段 | 内容 |
|---|---|
| 任务编号 | P3-BE-002 |
| 任务名称 | 实现认证与会话服务初版 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P3-BE-001, P1-DB-001 |
| 目标 | 支持 P0 内置账号密码登录。 |

主要表：

```text
lc_user
lc_user_auth
lc_security_event
lc_audit_log
```

主要接口：

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

禁止事项：

```text
1. 不得把密码字段放入 lc_user。
2. 不得保存明文密码。
3. 不得跳过 lc_user.status 和 lc_user.login_enabled 校验。
```

验收标准：

```text
1. 管理员可登录。
2. 密码错误返回统一错误。
3. 登录失败写安全事件或审计。
```

---

## 25. P3-BE-003：实现统一异常和错误码处理

| 字段 | 内容 |
|---|---|
| 任务编号 | P3-BE-003 |
| 任务名称 | 实现统一异常和错误码处理 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 50 |
| 前置任务 | P1-BE-001 |
| 目标 | 所有 API 返回统一错误结构。 |

错误类别：

```text
auth_error
permission_denied
validation_error
version_conflict
runtime_model_error
workflow_error
file_error
system_error
```

验收标准：

```text
1. Controller 抛出的业务异常被统一转换。
2. 前端可以根据 code 做错误处理。
3. 错误响应包含 requestId。
```

---

## 26. P3-BE-004：实现审计与安全事件基础服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P3-BE-004 |
| 任务名称 | 实现审计与安全事件基础服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P1-DB-001, P3-BE-001 |
| 目标 | 提供审计日志和安全事件写入能力。 |

主要表：

```text
lc_audit_log
lc_audit_log_detail
lc_security_event
```

验收标准：

```text
1. 关键写操作可调用 auditService。
2. 越权事件可调用 securityEventService。
3. 敏感字段不记录明文。
```

---

## 27. P3-BE-005：实现幂等服务基础能力

| 字段 | 内容 |
|---|---|
| 任务编号 | P3-BE-005 |
| 任务名称 | 实现幂等服务基础能力 |
| 优先级 | P0-Recommended |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P1-DB-001 |
| 目标 | 支持高风险写接口幂等控制。 |

主要表：

```text
lc_api_idempotency_key
```

适用接口：

```text
record_create
record_submit
task_approve
publish
rollback
file_upload
```

验收标准：

```text
1. 相同 idempotencyKey + requestHash 返回相同结果。
2. 相同 idempotencyKey + 不同 requestHash 返回冲突。
3. processing 超时有可恢复策略。
```

---

# Phase 4：核心数据库与后端服务

## 28. P4-DB-001：生成 P0-Must-Core 数据表迁移

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-DB-001 |
| 任务名称 | 生成 P0-Must-Core 数据表迁移 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30 |
| 前置任务 | P1-DB-001 |
| 目标 | 创建 P0 主闭环所需核心表。 |

核心表组：

```text
lc_tenant
lc_user
lc_user_auth
lc_org_unit
lc_role
lc_user_org_unit
lc_user_role
lc_app_category
lc_app
lc_app_member
lc_metadata_resource
lc_metadata_resource_version
lc_metadata_dependency
lc_app_version
lc_metadata_snapshot
lc_app_runtime_pointer
lc_publish_log
lc_rollback_log
lc_permission_policy
lc_permission_assignment
lc_permission_change_log
lc_business_record
lc_business_record_index
lc_business_record_relation
lc_business_record_change_log
lc_workflow_runtime_binding
lc_workflow_instance
lc_workflow_task
lc_workflow_task_action
lc_workflow_trace
lc_file_object
lc_file_attachment
lc_audit_log
lc_audit_log_detail
lc_security_event
lc_runtime_error_log
```

禁止事项：

```text
1. 不得创建 contract、expense_report、purchase_request 物理表。
2. 不得更新已发布 snapshot_json。
3. 不得生成错误软删除唯一索引。
```

验收标准：

```text
1. Flyway 迁移成功。
2. 所有核心表包含 tenant_id。
3. 可编辑表包含 version。
4. 软删除表包含 is_deleted、deleted_by、deleted_at。
```

---

## 29. P4-DB-002：生成 P0-Must-Support 数据表迁移

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-DB-002 |
| 任务名称 | 生成 P0-Must-Support 数据表迁移 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30 |
| 前置任务 | P4-DB-001 |
| 目标 | 创建自动编号、唯一字段、回收站、模板等支撑表。 |

表清单：

```text
lc_sequence_counter
lc_business_unique_value
lc_recycle_item
lc_app_template
```

可选推荐：

```text
lc_api_idempotency_key
lc_file_access_log
```

验收标准：

```text
1. 自动编号表有唯一计数维度。
2. 唯一字段表有 active 唯一占用策略。
3. 回收站表可表达恢复状态。
4. 模板表可保存三个样板应用模板。
```

---

## 30. P4-BE-001：实现应用中心服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-001 |
| 任务名称 | 实现应用中心服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 02, 30, 40, 50 |
| 前置任务 | P4-DB-001 |
| 目标 | 支持应用列表、创建、详情、成员、状态管理。 |

主要接口：

```text
GET    /api/v1/apps
POST   /api/v1/apps
GET    /api/v1/apps/{appId}
PUT    /api/v1/apps/{appId}
GET    /api/v1/apps/{appId}/members
POST   /api/v1/apps/{appId}/members
```

验收标准：

```text
1. 可创建应用。
2. 可查询应用列表。
3. 应用列表受权限控制。
4. 写操作记录审计。
```

---

## 31. P4-BE-002：实现模板服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-002 |
| 任务名称 | 实现模板服务 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30, 40, 50, 90 |
| 前置任务 | P4-BE-001, P4-DB-002 |
| 目标 | 支持从合同、报销、采购模板创建应用。 |

主要表：

```text
lc_app_template
lc_app
lc_metadata_resource
lc_permission_policy
```

验收标准：

```text
1. 模板列表可查询。
2. 从模板创建应用会生成新 appId 和 resourceId。
3. 不复用模板 ID。
4. 不实现模板市场能力。
```

---

## 32. P4-BE-003：实现组织用户角色服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-003 |
| 任务名称 | 实现组织用户角色服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 03, 30, 40, 50 |
| 前置任务 | P4-DB-001 |
| 目标 | 支持组织树、用户、角色、用户部门关系、用户角色关系。 |

验收标准：

```text
1. 可查询组织树。
2. 可创建用户和角色。
3. 用户可分配部门和角色。
4. 角色变化触发权限缓存失效。
```

---

## 33. P4-BE-004：实现元数据服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-004 |
| 任务名称 | 实现元数据服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 04, 05, 07, 08, 09, 30, 40, 50, 90 |
| 前置任务 | P4-BE-001, P4-DB-001 |
| 目标 | 支持 entity、field、form、view、workflow、permission、menu 的草稿保存和依赖关系维护。 |

主要规则：

```text
1. 设计态保存只写 lc_metadata_resource.draft_json。
2. 运行态不得读取 draft_json。
3. 保存时校验 DSL 基础结构。
4. 保存时更新 lc_metadata_dependency。
```

验收标准：

```text
1. 可保存对象和字段 DSL。
2. 可保存表单和视图 DSL。
3. 可保存流程和权限 DSL。
4. 删除资源前检查依赖。
```

---

## 34. P4-BE-005：实现权限服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-005 |
| 任务名称 | 实现权限服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 08, 30, 40, 50 |
| 前置任务 | P4-BE-003, P4-BE-004 |
| 目标 | 支持应用、菜单、对象、数据、字段、流程节点权限。 |

验收标准：

```text
1. 可保存权限策略和分配。
2. 权限变更写 change_log。
3. deny 优先于 allow。
4. 运行态服务可调用权限校验。
5. 字段裁剪由后端完成。
```

---

## 35. P4-BE-006：实现发布与版本服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-006 |
| 任务名称 | 实现发布与版本服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 09, 30, 40, 50, 90 |
| 前置任务 | P4-BE-004, P4-BE-005 |
| 目标 | 支持发布校验、快照生成、版本创建、运行指针切换。 |

事务步骤：

```text
1. 获取发布锁。
2. 读取设计态元数据。
3. 校验 DSL。
4. 校验依赖。
5. 生成 resource version。
6. 生成 snapshot。
7. 生成 app version。
8. 切换 runtime pointer。
9. 写 publish_log。
10. 失效缓存。
```

禁止事项：

```text
1. 发布失败不得切换 pointer。
2. 不得原地修改历史 snapshot。
3. 不得让运行态读取草稿。
```

验收标准：

```text
1. 发布成功后生成 snapshot。
2. runtime pointer 指向新 snapshot。
3. 发布失败当前运行版本不受影响。
```

---

## 36. P4-BE-007：实现回滚服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-007 |
| 任务名称 | 实现回滚服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 09, 30, 40, 50 |
| 前置任务 | P4-BE-006 |
| 目标 | 支持将运行指针切换到历史版本和快照。 |

验收标准：

```text
1. 回滚只切换 runtime pointer。
2. 不修改历史 app_version 和 metadata_snapshot。
3. 不批量改写业务记录。
4. 回滚记录 rollback_log。
```

---

## 37. P4-BE-008：实现运行态模型服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-008 |
| 任务名称 | 实现运行态模型服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 20, 30, 40, 50, 60, 90 |
| 前置任务 | P4-BE-006, P4-BE-005 |
| 目标 | 根据 runtime pointer 和 snapshot 返回前端 RuntimeModel。 |

主要接口：

```text
GET /api/v1/runtime/apps/{appId}/model
```

规则：

```text
1. 先读取 lc_app_runtime_pointer。
2. 再读取 lc_metadata_snapshot。
3. 根据用户权限裁剪菜单、动作、字段表现。
4. 返回 appVersionId、snapshotId、runtimeModelVersion。
```

验收标准：

```text
1. 返回 RuntimeModel 可被前端 Adapter 解析。
2. 无权限应用返回 permission_denied。
3. 不读取 draft_json。
```

---

## 38. P4-BE-009：实现通用业务数据服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-009 |
| 任务名称 | 实现通用业务数据服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50, 60, 90 |
| 前置任务 | P4-BE-008 |
| 目标 | 支持运行态列表、详情、新增、编辑、提交。 |

主要表：

```text
lc_business_record
lc_business_record_index
lc_business_record_relation
lc_business_record_change_log
lc_business_unique_value
lc_sequence_counter
lc_file_attachment
```

关键规则：

```text
1. 写入必须使用当前 snapshot。
2. 字段必须由后端校验。
3. 无权编辑字段必须被拒绝或过滤。
4. 返回字段必须经过字段权限裁剪。
5. 保存时同步 index、relation、unique、attachment、change_log、audit。
```

验收标准：

```text
1. 可创建合同/报销/采购记录。
2. 可查询列表。
3. 可读取详情。
4. 字段权限生效。
5. recordVersion 冲突返回统一错误。
```

---

## 39. P4-BE-010：实现自动编号服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-010 |
| 任务名称 | 实现自动编号服务 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P4-BE-009 |
| 目标 | 支持合同编号、报销单号、采购申请编号生成。 |

验收标准：

```text
1. 编号由后端生成。
2. 并发下不重复。
3. 编号规则来自 snapshot。
4. 允许跳号，不允许重复。
```

---

## 40. P4-BE-011：实现唯一字段服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-011 |
| 任务名称 | 实现唯一字段服务 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P4-BE-009 |
| 目标 | 支持低代码字段 unique 并发安全。 |

验收标准：

```text
1. 唯一字段保存时写入 lc_business_unique_value。
2. 并发冲突返回唯一校验失败。
3. 更新唯一字段时释放旧值并占用新值。
4. 软删除后默认不释放历史占用。
```

---

## 41. P4-BE-012：实现流程运行服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-012 |
| 任务名称 | 实现流程运行服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 07, 30, 40, 50, 60 |
| 前置任务 | P4-BE-009 |
| 目标 | 支持提交发起流程、待办、审批、驳回、轨迹。 |

关键规则：

```text
1. 流程实例绑定启动时 snapshotId。
2. 审批任务携带 taskVersion。
3. 审批读取 workflow_instance.snapshot_id 对应快照。
4. 审批动作写 task_action、trace、audit。
5. 审批更新业务状态。
```

验收标准：

```text
1. 提交记录可生成流程实例和待办。
2. 待办列表可查询。
3. 审批通过可推进流程。
4. 任务版本冲突返回统一错误。
```

---

## 42. P4-BE-013：实现文件服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-013 |
| 任务名称 | 实现文件服务 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50, 60 |
| 前置任务 | P4-BE-009 |
| 目标 | 支持文件上传、绑定、预览、下载、鉴权。 |

关键规则：

```text
1. lc_file_attachment 是文件绑定权威表。
2. 下载必须后端鉴权。
3. storage_path 不得直接暴露给前端。
4. 无权限下载写安全事件或文件访问日志。
```

验收标准：

```text
1. 文件可上传。
2. 文件可绑定业务记录和流程意见。
3. 无权限下载被拒绝。
4. 下载拒绝可追踪。
```

---

## 43. P4-BE-014：实现回收站服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-014 |
| 任务名称 | 实现回收站服务 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P4-BE-001, P4-BE-009, P4-BE-013 |
| 目标 | 支持应用、元数据、业务记录、文件软删除展示和恢复。 |

验收标准：

```text
1. 删除资源写 lc_recycle_item。
2. 恢复前校验唯一编码冲突。
3. 恢复前校验依赖完整性。
4. 不物理删除已产生历史数据的核心资源。
```

---

## 44. P4-BE-015：实现一致性巡检服务

| 字段 | 内容 |
|---|---|
| 任务编号 | P4-BE-015 |
| 任务名称 | 实现一致性巡检服务 |
| 优先级 | P0-Must-Support |
| 输入文档 | 30, 40, 50 |
| 前置任务 | P4-BE-006, P4-BE-009, P4-BE-013 |
| 目标 | 支持后台诊断 API 检查运行指针、快照、索引、附件、依赖一致性。 |

巡检项：

```text
1. runtime_pointer 指向版本和快照存在。
2. business_record.snapshot_id 存在。
3. workflow_instance.snapshot_id 存在。
4. file_attachment.file_id 存在。
5. metadata_dependency 无 broken 强依赖。
6. business_record_index 与 data_json 一致。
7. business_unique_value 与当前记录一致。
```

验收标准：

```text
1. 诊断 API 可返回检查结果。
2. 不自动修复高风险数据。
3. 结果可供前端诊断页展示。
```

---

# Phase 5：前端基础页面

## 45. P5-FE-001：实现前端全局布局和路由

| 字段 | 内容 |
|---|---|
| 任务编号 | P5-FE-001 |
| 任务名称 | 实现前端全局布局和路由 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45, 61 |
| 前置任务 | P1-FE-001 |
| 目标 | 实现认证、工作台、设计态、运行态、管理态布局。 |

布局：

```text
AuthLayout
MainShell
DesignShell
RuntimeShell
AdminShell
```

验收标准：

```text
1. 路由清单中的 P0 路由可访问。
2. 页面具备 loading / error / empty 基础状态。
3. 布局符合企业后台风格。
```

---

## 46. P5-FE-002：实现登录页和会话状态

| 字段 | 内容 |
|---|---|
| 任务编号 | P5-FE-002 |
| 任务名称 | 实现登录页和会话状态 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 45, 61 |
| 前置任务 | P5-FE-001, P2-API-002 |
| 目标 | 支持 Mock 登录、登出、当前用户信息。 |

验收标准：

```text
1. 登录成功进入应用中心。
2. 登录失败显示错误。
3. 当前用户信息可用于权限和角色视角 Mock。
```

---

## 47. P5-FE-003：实现应用中心页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P5-FE-003 |
| 任务名称 | 实现应用中心页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 02, 40, 61 |
| 前置任务 | P5-FE-002, P2-SAMPLE-001 |
| 目标 | 展示应用列表、分类、模板入口、运行和设计入口。 |

验收标准：

```text
1. 显示合同管理、费用报销、采购申请。
2. 可进入应用设计态。
3. 可进入应用运行态。
4. 无应用时显示 empty 状态。
```

---

## 48. P5-FE-004：实现组织用户角色页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P5-FE-004 |
| 任务名称 | 实现组织用户角色页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 03, 40, 61 |
| 前置任务 | P5-FE-001, P2-API-002 |
| 目标 | 实现组织树、用户列表、角色列表和分配 Mock。 |

验收标准：

```text
1. 可浏览组织树。
2. 可浏览用户列表。
3. 可浏览角色列表。
4. 可模拟用户角色变更。
```

---

# Phase 6：设计态前端页面

## 49. P6-FE-001：实现应用设计态工作台

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-001 |
| 任务名称 | 实现应用设计态工作台 |
| 优先级 | P0-Must-Core |
| 输入文档 | 02, 61 |
| 前置任务 | P5-FE-003 |
| 目标 | 提供应用概览、设计菜单、发布入口。 |

验收标准：

```text
1. /apps/:appId/overview 可访问。
2. 设计态菜单包含模型、表单、流程、权限、发布。
3. 可切换到运行态预览。
```

---

## 50. P6-FE-002：实现数据建模页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-002 |
| 任务名称 | 实现数据建模页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 04, 40, 61, 90 |
| 前置任务 | P6-FE-001 |
| 目标 | 支持对象、字段、字段属性、索引标记 Mock 编辑。 |

验收标准：

```text
1. 可查看对象列表。
2. 可查看字段列表。
3. 可编辑字段 required/searchable/filterable/sortable/unique。
4. 保存输出符合 90 DSL 的草稿结构。
```

---

## 51. P6-FE-003：实现表单设计器

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-003 |
| 任务名称 | 实现表单设计器 |
| 优先级 | P0-Must-Core |
| 输入文档 | 05, 60, 61, 90 |
| 前置任务 | P6-FE-002 |
| 目标 | 支持字段拖入、属性配置、布局、预览、保存 Mock。 |

组件拆解：

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

验收标准：

```text
1. 可展示字段组件面板。
2. 可在画布中展示表单结构。
3. 可编辑字段 label、required、readonly、visible。
4. 可预览运行态表单。
5. 保存输出 form DSL。
```

---

## 52. P6-FE-004：实现流程设计器

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-004 |
| 任务名称 | 实现流程设计器 |
| 优先级 | P0-Must-Core |
| 输入文档 | 07, 60, 61, 90 |
| 前置任务 | P6-FE-002 |
| 目标 | 支持轻量审批流设计 Mock。 |

节点类型：

```text
start
approval
condition
cc
end
```

组件拆解：

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

验收标准：

```text
1. 可展示流程画布。
2. 可编辑审批节点处理人规则。
3. 可编辑条件规则。
4. 可编辑节点字段权限。
5. 不实现完整 BPMN。
```

---

## 53. P6-FE-005：实现权限设计页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-005 |
| 任务名称 | 实现权限设计页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 08, 60, 61, 90 |
| 前置任务 | P6-FE-002 |
| 目标 | 支持应用、菜单、对象、数据、字段、流程权限配置 Mock。 |

组件拆解：

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

验收标准：

```text
1. 可选择主体 user/role/org/app_role。
2. 可配置对象操作权限。
3. 可配置数据范围权限。
4. 可配置字段可见/可编辑。
5. 可预览权限效果。
```

---

## 54. P6-FE-006：实现发布管理页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P6-FE-006 |
| 任务名称 | 实现发布管理页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 09, 40, 61 |
| 前置任务 | P6-FE-002, P6-FE-003, P6-FE-004, P6-FE-005 |
| 目标 | 支持发布校验、发布、版本列表、回滚 Mock。 |

验收标准：

```text
1. 可点击发布校验。
2. 可展示校验结果。
3. 可发布 Mock 版本。
4. 可查看版本列表。
5. 可回滚到历史版本。
```

---

# Phase 7：运行态渲染器与运行态页面

## 55. P7-RT-001：实现 RuntimeModel 类型和 Adapter

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-001 |
| 任务名称 | 实现 RuntimeModel 类型和 Adapter |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 90 |
| 前置任务 | P2-SAMPLE-001 |
| 目标 | 将后端或 Mock 返回的 rawModel 适配为前端 RuntimeModel。 |

涉及目录：

```text
apps/web/src/runtime/model
apps/web/src/runtime/adapter
apps/web/src/runtime/types
```

验收标准：

```text
1. 支持 runtimeModelVersion。
2. 不支持版本显示 UnsupportedRuntimeModel。
3. Adapter 输出 warnings 和 unsupportedFeatures。
4. 三个样板 RuntimeModel 均可通过适配。
```

---

## 56. P7-RT-002：实现组件注册表

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-002 |
| 任务名称 | 实现组件注册表 |
| 优先级 | P0-Must-Core |
| 输入文档 | 60 |
| 前置任务 | P7-RT-001 |
| 目标 | 注册字段组件、容器组件、动作组件和 fallback 组件。 |

验收标准：

```text
1. text、number、decimal、date、datetime、select、multiSelect、user、org、lookup、attachment、subtable 均有组件。
2. 未知字段类型显示 UnsupportedField。
3. 单字段错误不导致表单白屏。
```

---

## 57. P7-RT-003：实现 RuntimeFormRenderer

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-003 |
| 任务名称 | 实现 RuntimeFormRenderer |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P7-RT-001, P7-RT-002 |
| 目标 | 基于 RuntimeModel 渲染创建和编辑表单。 |

必须支持：

```text
1. 字段可见性。
2. 字段只读。
3. 字段必填。
4. dirty state。
5. 离开确认。
6. recordVersion。
7. lookup。
8. attachment。
9. subtable。
10. 字段错误边界。
```

验收标准：

```text
1. 合同表单可渲染。
2. 报销表单可渲染子表。
3. 采购表单可渲染 lookup。
4. 表单保存走 Mock API。
5. 字段权限表现正确。
```

---

## 58. P7-RT-004：实现 RuntimeListRenderer

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-004 |
| 任务名称 | 实现 RuntimeListRenderer |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P7-RT-001, P7-RT-002 |
| 目标 | 基于 view DSL 渲染运行态列表。 |

验收标准：

```text
1. 支持列展示。
2. 支持过滤、搜索、排序、分页。
3. 支持行级操作。
4. 字段不可见时不显示列。
5. 无数据、无权限、错误状态完整。
```

---

## 59. P7-RT-005：实现 RuntimeDetailRenderer

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-005 |
| 任务名称 | 实现 RuntimeDetailRenderer |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P7-RT-003 |
| 目标 | 基于 RuntimeModel 渲染记录详情。 |

验收标准：

```text
1. 可查看记录详情。
2. 字段不可见时不展示。
3. 附件可预览和下载 Mock。
4. 详情可进入编辑或提交审批。
```

---

## 60. P7-RT-006：实现 RuntimeApprovalRenderer

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-RT-006 |
| 任务名称 | 实现 RuntimeApprovalRenderer |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P7-RT-003, P7-RT-005 |
| 目标 | 支持审批详情、节点字段权限、同意、驳回。 |

验收标准：

```text
1. 待办详情可打开。
2. 节点字段权限生效。
3. 审批同意走 Mock API。
4. 审批驳回走 Mock API。
5. taskVersion 冲突可提示。
```

---

## 61. P7-FE-001：实现运行态应用页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-FE-001 |
| 任务名称 | 实现运行态应用页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P7-RT-004 |
| 目标 | 提供运行态应用入口、菜单和实体列表页面。 |

验收标准：

```text
1. /runtime/apps/:appId 可访问。
2. 运行态菜单来自 RuntimeModel。
3. 点击实体菜单进入列表。
4. 无权限菜单不显示。
```

---

## 62. P7-FE-002：实现任务中心页面

| 字段 | 内容 |
|---|---|
| 任务编号 | P7-FE-002 |
| 任务名称 | 实现任务中心页面 |
| 优先级 | P0-Must-Core |
| 输入文档 | 40, 60, 61 |
| 前置任务 | P7-RT-006 |
| 目标 | 实现待办、已办、审批详情入口。 |

验收标准：

```text
1. 待办列表可查询。
2. 已办列表可查询。
3. 点击待办进入审批详情。
4. 审批完成后列表刷新。
```

---

# Phase 8：前后端联调与样板应用闭环

## 63. P8-SAMPLE-001：初始化三个样板应用模板到后端

| 字段 | 内容 |
|---|---|
| 任务编号 | P8-SAMPLE-001 |
| 任务名称 | 初始化三个样板应用模板到后端 |
| 优先级 | P0-Must-Core |
| 输入文档 | 01-10, 30, 50, 90 |
| 前置任务 | P4-BE-002 |
| 目标 | 将合同、报销、采购模板作为 seed 数据或 lc_app_template 初始化。 |

验收标准：

```text
1. 后端模板列表有三个模板。
2. 可从模板创建应用。
3. 创建后的应用可发布。
4. 发布后运行态模型可被前端加载。
```

---

## 64. P8-INTEG-001：应用创建到发布联调

| 字段 | 内容 |
|---|---|
| 任务编号 | P8-INTEG-001 |
| 任务名称 | 应用创建到发布联调 |
| 优先级 | P0-Must-Core |
| 输入文档 | 20, 30, 40, 50, 61 |
| 前置任务 | P4-BE-006, P6-FE-006 |
| 目标 | 从模板创建应用，保存设计态配置，发布到运行态。 |

验收标准：

```text
1. 前端从模板创建应用。
2. 后端生成 app 和 metadata_resource。
3. 发布生成 snapshot 和 app_version。
4. runtime pointer 指向当前快照。
5. 前端能进入运行态页面。
```

---

## 65. P8-INTEG-002：业务记录创建、提交、审批联调

| 字段 | 内容 |
|---|---|
| 任务编号 | P8-INTEG-002 |
| 任务名称 | 业务记录创建、提交、审批联调 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50, 60, 61 |
| 前置任务 | P4-BE-009, P4-BE-012, P7-RT-006 |
| 目标 | 跑通业务记录保存、提交、流程审批主闭环。 |

验收标准：

```text
1. 前端创建业务记录。
2. 后端写 business_record、index、change_log、audit。
3. 提交后创建 workflow_instance 和 workflow_task。
4. 审批人看到待办。
5. 审批通过后记录状态更新。
6. 流程轨迹可查看。
```

---

## 66. P8-INTEG-003：权限和字段裁剪联调

| 字段 | 内容 |
|---|---|
| 任务编号 | P8-INTEG-003 |
| 任务名称 | 权限和字段裁剪联调 |
| 优先级 | P0-Must-Core |
| 输入文档 | 08, 40, 50, 60, 61 |
| 前置任务 | P4-BE-005, P7-RT-003, P7-RT-004 |
| 目标 | 验证菜单、对象、数据、字段、流程节点字段权限。 |

验收标准：

```text
1. 无菜单权限时不显示菜单。
2. 无对象权限时接口拒绝。
3. 无数据权限时列表不返回记录。
4. 无字段查看权限时响应被裁剪。
5. 无字段编辑权限时提交被拒绝或过滤。
6. 流程节点字段权限生效。
```

---

## 67. P8-INTEG-004：文件上传、绑定、下载鉴权联调

| 字段 | 内容 |
|---|---|
| 任务编号 | P8-INTEG-004 |
| 任务名称 | 文件上传、绑定、下载鉴权联调 |
| 优先级 | P0-Must-Core |
| 输入文档 | 30, 40, 50, 60, 61 |
| 前置任务 | P4-BE-013, P7-RT-003 |
| 目标 | 跑通附件字段和流程意见附件。 |

验收标准：

```text
1. 文件可上传并生成 file_object。
2. 文件可绑定业务记录或流程动作。
3. 下载以 lc_file_attachment 为权威鉴权。
4. 无权限下载被拒绝并记录事件。
```

---

# Phase 9：测试、验收与质量收口

## 68. P9-QA-001：前端构建和静态检查

| 字段 | 内容 |
|---|---|
| 任务编号 | P9-QA-001 |
| 任务名称 | 前端构建和静态检查 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45, 60, 61 |
| 前置任务 | P7-FE-002 |
| 目标 | 确保前端可以安装、构建、检查。 |

检查命令：

```bash
cd apps/web
npm install
npm run build
npm run lint
npm run test
```

验收标准：

```text
1. build 通过。
2. lint 通过或只剩明确记录的非阻塞项。
3. test 通过。
4. 无 TypeScript 编译错误。
```

---

## 69. P9-QA-002：后端构建和测试

| 字段 | 内容 |
|---|---|
| 任务编号 | P9-QA-002 |
| 任务名称 | 后端构建和测试 |
| 优先级 | P0-Must-Core |
| 输入文档 | 45, 50 |
| 前置任务 | P4-BE-015 |
| 目标 | 确保后端可以编译、测试、启动。 |

检查命令：

```bash
cd apps/server
mvn test
mvn package
```

验收标准：

```text
1. mvn test 通过。
2. mvn package 通过。
3. 后端可启动。
4. 基础健康检查可访问。
```

---

## 70. P9-QA-003：P0 主闭环验收

| 字段 | 内容 |
|---|---|
| 任务编号 | P9-QA-003 |
| 任务名称 | P0 主闭环验收 |
| 优先级 | P0-Must-Core |
| 输入文档 | 20, 30, 40, 50, 60, 61, 90 |
| 前置任务 | P8-INTEG-001, P8-INTEG-002, P8-INTEG-003, P8-INTEG-004 |
| 目标 | 验收应用创建到业务审批完整闭环。 |

验收路径：

```text
1. 登录平台。
2. 进入应用中心。
3. 从模板创建合同管理应用。
4. 查看数据模型。
5. 查看表单设计。
6. 查看流程设计。
7. 查看权限配置。
8. 发布应用。
9. 进入运行态。
10. 新建合同记录。
11. 上传附件。
12. 提交审批。
13. 审批人处理待办。
14. 查看审批轨迹。
15. 查看审计日志。
16. 回滚到历史版本。
17. 确认运行态指针变化。
```

验收标准：

```text
1. 主路径无阻塞错误。
2. 权限校验生效。
3. 字段裁剪生效。
4. 审计日志可追踪。
5. 发布失败不影响当前运行版本。
6. 回滚不修改历史快照。
```

---

## 71. P9-QA-004：前端状态和异常场景验收

| 字段 | 内容 |
|---|---|
| 任务编号 | P9-QA-004 |
| 任务名称 | 前端状态和异常场景验收 |
| 优先级 | P0-Must-Core |
| 输入文档 | 60, 61 |
| 前置任务 | P9-QA-001 |
| 目标 | 验收页面 loading、empty、error、permission denied、version conflict 状态。 |

场景清单：

```text
1. 应用列表为空。
2. 应用无访问权限。
3. RuntimeModel 不兼容。
4. 字段组件渲染异常。
5. 表单 dirty state 离开确认。
6. recordVersion 冲突。
7. taskVersion 冲突。
8. 附件无权限下载。
9. 子表校验失败。
10. API 网络错误。
```

验收标准：

```text
1. 每个场景有明确 UI。
2. 不出现整页白屏。
3. 错误信息不泄露敏感信息。
```

---

## 72. P9-QA-005：H5 自适应验收

| 字段 | 内容 |
|---|---|
| 任务编号 | P9-QA-005 |
| 任务名称 | H5 自适应验收 |
| 优先级 | P0-Must-Support |
| 输入文档 | 60, 61 |
| 前置任务 | P7-FE-001, P7-FE-002 |
| 目标 | 验收运行态核心页面在移动宽度下可用。 |

验收页面：

```text
1. 运行态列表。
2. 运行态表单。
3. 运行态详情。
4. 审批待办。
5. 审批详情。
```

验收标准：

```text
1. 移动宽度下不横向溢出核心内容。
2. 表单字段可编辑。
3. 审批动作可操作。
4. 子表至少可横向滚动或卡片化展示。
```

---

# Phase 10：Codex 交接与后续任务

## 73. P10-DOC-001：生成 Codex 执行说明

| 字段 | 内容 |
|---|---|
| 任务编号 | P10-DOC-001 |
| 任务名称 | 生成 Codex 执行说明 |
| 优先级 | P0-Must-Core |
| 输入文档 | 00, 20, 30, 40, 45, 50, 60, 61, 70, 90 |
| 前置任务 | P0-DOC-001 |
| 目标 | 生成 99-codex-execution-guide.md。 |

主要内容：

```text
1. Codex 必读文档顺序。
2. 当前允许实现范围。
3. 当前禁止实现范围。
4. 技术栈不可变更规则。
5. 前端生成规则。
6. 后端生成规则。
7. 数据库生成规则。
8. 测试和检查命令。
9. 任务执行方式。
```

验收标准：

```text
1. Codex 拿到文档后知道先读什么。
2. Codex 知道每次生成后要运行什么命令。
3. Codex 知道不确定时不能自由扩展 P1/P2。
```

---

## 74. P10-DOC-002：生成仓库根 CODEX.md

| 字段 | 内容 |
|---|---|
| 任务编号 | P10-DOC-002 |
| 任务名称 | 生成仓库根 CODEX.md |
| 优先级 | P0-Must-Core |
| 输入文档 | 99-codex-execution-guide.md, 70-development-task-breakdown.md |
| 前置任务 | P10-DOC-001 |
| 目标 | 提供 Codex 在仓库根目录优先读取的短指令。 |

建议内容：

```text
1. 项目一句话说明。
2. 必读文档顺序。
3. 技术栈。
4. 当前任务入口。
5. 禁止事项。
6. 检查命令。
```

验收标准：

```text
1. CODEX.md 不超过 200 行。
2. 能指向 99 和 70。
3. 能明确“不得改技术栈、不得硬编码运行态业务页面”。
```

---

## 75. P10-DOC-003：生成后续未完成任务清单

| 字段 | 内容 |
|---|---|
| 任务编号 | P10-DOC-003 |
| 任务名称 | 生成后续未完成任务清单 |
| 优先级 | P0-Recommended |
| 输入文档 | 70, 80, 99 |
| 前置任务 | P9-QA-003 |
| 目标 | 整理仍未完成、已降级或进入 P1 的任务。 |

验收标准：

```text
1. 未完成任务有编号。
2. 每个任务有原因。
3. 每个任务标明 P0 还是 P1。
4. 不影响 P0 验收的任务不得阻塞发布。
```

---

## 76. 前端任务依赖关系

```text
P1-FE-001
  -> P2-MOCK-001
  -> P2-SAMPLE-001
  -> P2-API-002
  -> P5-FE-001
  -> P5-FE-002
  -> P5-FE-003
  -> P6-FE-001
  -> P6-FE-002
  -> P6-FE-003
  -> P6-FE-004
  -> P6-FE-005
  -> P6-FE-006
  -> P7-RT-001
  -> P7-RT-002
  -> P7-RT-003
  -> P7-RT-004
  -> P7-RT-005
  -> P7-RT-006
  -> P7-FE-001
  -> P7-FE-002
  -> P9-QA-001
  -> P9-QA-004
  -> P9-QA-005
```

说明：

```text
1. 如果只先做前端 Mock，可以优先完成 P1-FE、P2-MOCK、P2-SAMPLE、P5、P6、P7、P9-QA-001、P9-QA-004。
2. P8 联调可以等后端服务完成后再做。
3. Runtime Renderer 必须在运行态页面完整实现前完成。
```

---

## 77. 后端任务依赖关系

```text
P1-BE-001
  -> P1-DB-001
  -> P3-BE-001
  -> P3-BE-002
  -> P3-BE-003
  -> P3-BE-004
  -> P3-BE-005
  -> P4-DB-001
  -> P4-DB-002
  -> P4-BE-001
  -> P4-BE-002
  -> P4-BE-003
  -> P4-BE-004
  -> P4-BE-005
  -> P4-BE-006
  -> P4-BE-007
  -> P4-BE-008
  -> P4-BE-009
  -> P4-BE-010
  -> P4-BE-011
  -> P4-BE-012
  -> P4-BE-013
  -> P4-BE-014
  -> P4-BE-015
  -> P9-QA-002
```

说明：

```text
1. 后端服务必须先完成统一上下文、异常、审计，再实现业务服务。
2. 发布服务必须在运行态模型服务之前完成。
3. 业务数据服务必须在流程运行服务之前完成。
4. 文件服务可与业务数据服务并行，但最终联调必须以 lc_file_attachment 为权威。
```

---

## 78. 可并行任务

以下任务可以并行：

| 任务组 | 可并行原因 |
|---|---|
| P1-FE-001 与 P1-BE-001 | 前端和后端脚手架互不阻塞。 |
| P2-MOCK-001 与 P3-BE-001 | Mock API 与后端上下文可以并行。 |
| P6-FE-002 / P6-FE-003 / P6-FE-004 / P6-FE-005 | 设计态页面可并行，但需共享 DSL 类型。 |
| P4-BE-001 / P4-BE-003 | 应用中心和组织用户角色可并行。 |
| P7-RT-003 / P7-RT-004 / P7-RT-005 | 表单、列表、详情渲染可在 Registry 完成后并行。 |
| P9-QA-001 / P9-QA-002 | 前后端构建检查可并行。 |

---

## 79. 必须串行任务

以下任务必须串行：

| 串行任务 | 原因 |
|---|---|
| P4-BE-004 -> P4-BE-006 -> P4-BE-008 | 元数据保存、发布快照、运行态模型存在严格依赖。 |
| P4-BE-009 -> P4-BE-012 | 流程发起依赖业务记录。 |
| P7-RT-001 -> P7-RT-002 -> P7-RT-003 | Adapter、Registry、表单渲染存在实现依赖。 |
| P6-FE-002 -> P6-FE-003 | 表单设计器依赖数据建模字段。 |
| P8-INTEG-001 -> P8-INTEG-002 | 运行态业务闭环依赖发布完成。 |

---

## 80. Codex 执行批次建议

为避免一次性生成过多代码，建议 Codex 按批次执行。

### Batch 1：工程骨架

```text
目标：创建可启动的 Monorepo、前端空壳、后端空壳、Docker Compose。
包含任务：P1-INFRA-001, P1-FE-001, P1-BE-001, P1-DB-001, P1-INFRA-002。
验收：前端 build 通过，后端 mvn test 通过，docker compose 可启动数据库。
```

### Batch 2：Mock 和样板数据

```text
目标：前端可通过 Mock API 展示三个样板应用。
包含任务：P2-MOCK-001, P2-SAMPLE-001, P2-API-002, P5-FE-002, P5-FE-003。
验收：登录后进入应用中心，看到三个样板应用。
```

### Batch 3：前端设计态页面

```text
目标：完成数据建模、表单设计器、流程设计器、权限配置、发布管理 Mock 页面。
包含任务：P6-FE-001 至 P6-FE-006。
验收：所有设计态路由可访问，保存走 Mock API。
```

### Batch 4：Runtime Renderer

```text
目标：完成运行态模型适配、组件注册、列表、表单、详情、审批渲染。
包含任务：P7-RT-001 至 P7-RT-006, P7-FE-001, P7-FE-002。
验收：三个样板应用可以运行，合同/报销/采购至少各有一个可浏览流程。
```

### Batch 5：后端基础和数据库

```text
目标：完成后端基础设施、认证、数据库迁移、审计、异常、幂等。
包含任务：P3-BE-001 至 P3-BE-005, P4-DB-001, P4-DB-002。
验收：后端可启动，基础表迁移成功，登录接口可用。
```

### Batch 6：核心后端服务

```text
目标：完成应用、模板、组织、元数据、权限、发布、运行态模型、业务数据、流程、文件。
包含任务：P4-BE-001 至 P4-BE-015。
验收：核心 API 可通过后端测试或手动调用。
```

### Batch 7：联调和验收

```text
目标：前后端主闭环联调和验收。
包含任务：P8-INTEG-001 至 P8-INTEG-004, P9-QA-001 至 P9-QA-005。
验收：P0 主闭环通过。
```

---

## 81. 每次 Codex 执行后的通用检查

每次 Codex 完成一个批次后，至少执行：

```bash
cd apps/web && npm run build
cd apps/server && mvn test
```

如果当前批次不涉及后端，可只执行：

```bash
cd apps/web && npm run build
```

如果当前批次不涉及前端，可只执行：

```bash
cd apps/server && mvn test
```

如存在 lint/test 脚本，还应执行：

```bash
cd apps/web && npm run lint && npm run test
cd apps/server && mvn test
```

要求：

```text
1. 不得留下 TypeScript 编译错误。
2. 不得留下 Java 编译错误。
3. 不得忽略失败测试，除非明确写入已知问题。
4. 不得把检查命令失败当成完成。
```

---

## 82. 任务完成状态定义

| 状态 | 含义 |
|---|---|
| TODO | 尚未开始。 |
| IN_PROGRESS | 正在执行。 |
| CODE_DONE | 代码已生成，但未完成检查。 |
| CHECK_PASSED | 检查命令通过。 |
| BLOCKED | 被前置任务或缺失信息阻塞。 |
| PARTIAL | 部分完成，存在明确剩余项。 |
| DONE | 代码、检查、验收均完成。 |
| DEFERRED | 明确延后到 P1/P2。 |

Codex 不得把 `CODE_DONE` 直接标记为 `DONE`。

---

## 83. P0 最小可演示版本定义

最小可演示版本必须满足：

```text
1. 可以登录。
2. 可以进入应用中心。
3. 可以看到合同管理、费用报销、采购申请三个样板应用。
4. 可以进入应用设计态页面。
5. 可以看到数据模型、表单设计、流程设计、权限配置。
6. 可以 Mock 发布应用。
7. 可以进入运行态列表。
8. 可以新建业务记录。
9. 可以提交审批。
10. 可以在待办中审批。
11. 可以查看详情和审批轨迹。
12. 可以看到权限裁剪效果。
13. 前端 build 通过。
```

这个版本可以使用 Mock API，不要求真实后端全部完成。

---

## 84. P0 完整验收版本定义

完整 P0 验收版本必须满足：

```text
1. 前端页面、Runtime Renderer 和 Mock 场景完整。
2. 后端核心服务和数据库迁移完整。
3. 从模板创建应用可用。
4. 发布生成真实 snapshot 和 app_version。
5. 运行态通过 app_runtime_pointer 读取 snapshot。
6. 业务记录写入 lc_business_record 和索引表。
7. 流程提交和审批可用。
8. 权限校验和字段裁剪由后端执行。
9. 文件上传、绑定、下载鉴权可用。
10. 审计日志和安全事件可追踪。
11. 回滚只切换 pointer。
12. 一致性巡检可执行。
13. 前端和后端检查命令通过。
```

---

## 85. 风险与缓解策略

| 风险 | 表现 | 缓解策略 |
|---|---|---|
| Codex 生成普通 CRUD 页面 | 合同、报销、采购各写独立页面 | 强制使用 60 Runtime Renderer 和 RuntimeModel。 |
| 技术栈漂移 | 使用 Next.js、Vue、Node 后端 | 45 和 CODEX.md 中强制技术栈。 |
| API 口径漂移 | 页面直接 fetch 随意路径 | 所有调用经过 services/apiClient。 |
| 数据库表漂移 | 创建对象专属业务表 | 30 和 70 中反复禁止。 |
| 权限只做前端隐藏 | 后端未校验 | 50、60、70 验收中强制后端权限。 |
| 发布与运行态混淆 | 运行态读取 draft_json | 发布服务、运行态模型服务验收强制校验。 |
| 文件鉴权混乱 | 用冗余表判断下载权限 | lc_file_attachment 作为唯一权威。 |
| 一次性生成过多代码 | 难以检查和修复 | 使用 Batch 1-7 分批执行。 |
| Mock 与真实 API 脱节 | 后续联调困难 | Mock 路由与 40 API 保持一致。 |
| 测试缺失 | 构建通过但主路径不可用 | P9 QA 任务定义主闭环验收。 |

---

## 86. 给 Codex 生成代码的强约束

### 86.1 通用约束

```text
1. 必须先阅读 00、90、20、30、40、45、50、60、61、70。
2. 必须遵守 45 的技术栈。
3. 不得新增 P0 不做范围内的能力。
4. 不得修改核心文档中的架构决策。
5. 不得隐藏失败检查命令。
6. 不得在不确定时自行引入大型框架。
```

### 86.2 前端约束

```text
1. 必须使用 React + TypeScript + Vite + Ant Design。
2. 页面 API 调用必须经过 services。
3. 运行态必须经过 RuntimeModel Adapter。
4. 运行态字段必须通过组件注册表渲染。
5. 不得硬编码合同、报销、采购独立运行页面。
6. 字段组件异常不得导致整页白屏。
7. 必须处理 loading、empty、error、permission denied。
8. 必须实现 recordVersion / taskVersion 冲突提示。
9. 必须支持 dirty state 和离开确认。
10. 必须保留 H5 自适应基础能力。
```

### 86.3 后端约束

```text
1. 必须使用 Java + Spring Boot + Maven。
2. Controller 只做协议适配。
3. Application Service 负责用例编排和事务。
4. Domain Service 负责领域规则。
5. Repository 只做数据访问。
6. 运行态 API 不得读取 draft_json。
7. 业务记录写入必须执行权限、字段、数据范围校验。
8. 发布失败不得切换 runtime pointer。
9. 回滚不得修改历史 snapshot。
10. 文件下载必须以 lc_file_attachment 为权威鉴权。
```

### 86.4 数据库约束

```text
1. 表名必须使用 lc_ 前缀。
2. 所有核心表必须有 tenant_id。
3. 不得为业务对象生成独立物理表。
4. 必须包含 lc_metadata_snapshot 和 lc_app_runtime_pointer。
5. 必须包含 lc_business_record 和 lc_business_record_index。
6. 已发布 snapshot_json 不得 UPDATE。
7. 软删除唯一约束必须采用 UK(active) 语义。
8. 高频查询不得只依赖 JSON 全表扫描。
```

### 86.5 测试约束

```text
1. 每个批次完成后必须运行检查命令。
2. Runtime Renderer 必须有样板应用 fixture。
3. 后端关键事务必须有测试或可手动验证接口。
4. 权限、发布、回滚、版本冲突、文件鉴权必须进入验收。
```

---

## 87. 后续文档衔接

本文档完成后，建议继续产出：

```text
1. 80-test-and-acceptance-plan.md
2. 99-codex-execution-guide.md
3. CODEX.md
4. 可选：40A-openapi-spec.yaml
```

其中：

```text
80 用于把 P9 QA 任务展开成测试用例和验收脚本。
99 用于给 Codex 提供完整执行说明。
CODEX.md 用于放在仓库根目录作为 Codex 短指令入口。
40A 用于结构化 API 契约，提升 API Client 和后端 Stub 生成准确度。
```

---

## 88. 附录：P0 开发任务红线

```text
1. 不得跳过文档阅读直接写代码。
2. 不得改变 45 已定技术栈。
3. 不得把运行态做成业务对象硬编码页面。
4. 不得为业务对象生成独立物理表。
5. 不得让运行态读取设计态草稿。
6. 不得跳过后端权限校验。
7. 不得只做前端菜单隐藏当作权限。
8. 不得绕过 RuntimeModel Adapter。
9. 不得绕过组件注册表渲染字段。
10. 不得跳过 recordVersion / taskVersion。
11. 不得下载无鉴权附件。
12. 不得在发布失败时切换 runtime pointer。
13. 不得在回滚时修改历史 snapshot。
14. 不得把审计、安全事件和错误日志完全忽略。
15. 不得一次性生成无法检查的大量代码。
16. 不得把检查失败的代码标记为完成。
```
