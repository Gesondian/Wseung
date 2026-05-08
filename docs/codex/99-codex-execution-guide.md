---
title: Codex 执行说明
subtitle: 企业级低代码平台 v1.0｜Codex 代码生成与执行指南
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
  - 70-development-task-breakdown.md
  - 80-test-and-acceptance-plan.md
  - 90-metadata-dsl-guideline.md
---

# 99-codex-execution-guide.md

版本：v1.0  
适用范围：Codex 生成 P0 低代码平台工程、前端界面、后端服务、Mock、测试与联调代码  
最后更新：2026-05-06  
状态：基线版

---

## 0. 使用方式

本文档用于指导 Codex 在代码仓库中执行开发任务。Codex 在开始任何代码生成、修改、重构、测试或修复前，必须优先阅读本文档和 `CODEX.md`。

本文档不是产品需求文档，也不是 API 明细文档。本文档负责回答：

```text
1. Codex 应该先读哪些文档。
2. Codex 当前允许生成哪些代码。
3. Codex 不允许做哪些事。
4. Codex 每一批任务如何执行、检查和汇报。
5. Codex 遇到不确定点时如何处理。
6. Codex 如何判断一批任务是否完成。
```

---

## 1. 文档目的

本指南用于把当前低代码平台 P0 文档包转换为 Codex 可执行的工程约束，使 Codex 能够按统一技术栈、统一目录结构、统一 API 边界、统一运行态渲染规则和统一测试验收规则生成代码。

目标不是让 Codex 一次性完成完整平台，而是让 Codex 按阶段、按任务、按验收标准逐步产出可运行、可检查、可回滚的代码。

---

## 2. Codex 总目标

Codex 的总目标是基于文档包生成企业级低代码平台 P0 工程，覆盖以下主闭环：

```text
应用创建
→ 数据建模
→ 表单设计
→ 流程审批配置
→ 权限配置
→ 发布运行
→ 运行态填报
→ 流程审批
→ 数据沉淀
→ 附件鉴权
→ 审计追踪
```

P0 必须覆盖三个样板应用：

```text
1. 合同管理 contract_management
2. 费用报销 expense_report
3. 采购申请 purchase_request
```

---

## 3. Codex 必读文档顺序

Codex 开始任务前必须按以下顺序阅读文档。

### 3.1 全局入口

```text
1. CODEX.md
2. 99-codex-execution-guide.md
3. 00-project-context-summary.md
4. 00-project-doc-index.md
5. 00-current-working-plan.md
6. 00-decision-log.md
```

### 3.2 核心设计输入

```text
7. 90-metadata-dsl-guideline.md
8. 20-system-architecture-design.md
9. 30-core-database-design.md
10. 40-api-design.md
11. 45-tech-stack-and-scaffold-decision.md
```

### 3.3 实现设计输入

```text
12. 50-backend-service-design.md
13. 60-frontend-runtime-renderer-design.md
14. 61-frontend-page-and-component-design.md
15. 70-development-task-breakdown.md
16. 80-test-and-acceptance-plan.md
```

### 3.4 模块需求输入

需要实现某个模块时，再阅读对应模块文档：

```text
01-P0-overview.md
02-P0-app-center.md
03-P0-org-user-role.md
04-P0-data-modeling.md
05-P0-form-designer.md
07-P0-workflow-engine.md
08-P0-permission-system.md
09-P0-release-runtime.md
10-P0-requirement-traceability-matrix.md
```

---

## 4. 文档职责分工

| 文档 | Codex 使用方式 |
|---|---|
| `90-metadata-dsl-guideline.md` | 生成 RuntimeModel、元数据 DSL、表单/视图/流程/权限模型时必须遵守。 |
| `20-system-architecture-design.md` | 判断系统边界、设计态/发布态/运行态隔离、部署和架构红线。 |
| `30-core-database-design.md` | 生成 DDL、ORM、Repository、事务和数据访问时必须遵守。 |
| `40-api-design.md` | 生成 API Controller、API Client、Mock API 和联调代码时必须遵守。 |
| `45-tech-stack-and-scaffold-decision.md` | 生成工程目录、依赖、脚手架、构建命令时必须遵守。 |
| `50-backend-service-design.md` | 生成 Spring Boot 后端代码和服务层逻辑时必须遵守。 |
| `60-frontend-runtime-renderer-design.md` | 生成运行态渲染器、字段组件、RuntimeModel Adapter、Action Dispatcher 时必须遵守。 |
| `61-frontend-page-and-component-design.md` | 生成页面、路由、布局、设计器组件、页面 API 调用时必须遵守。 |
| `70-development-task-breakdown.md` | 拆分任务、确认阶段、执行顺序和验收标准时必须遵守。 |
| `80-test-and-acceptance-plan.md` | 生成测试、运行检查、判断完成和输出验收报告时必须遵守。 |

---

## 5. 当前推荐执行路线

P0 推荐执行路线：

```text
Phase 0：文档确认与仓库检查
Phase 1：Monorepo 与前后端脚手架
Phase 2：API 类型、Mock API 与样板数据
Phase 3：前端基础布局、登录、应用中心
Phase 4：设计态页面：数据建模、表单设计器、流程设计器、权限配置
Phase 5：Runtime Renderer：列表、表单、详情、审批、字段组件
Phase 6：后端基础设施：认证、上下文、异常、审计、幂等、Flyway
Phase 7：后端核心服务：应用、元数据、发布、权限、记录、流程、文件
Phase 8：前后端联调：真实 API、数据库、文件、权限、审计
Phase 9：测试补齐：最小自动化集、样板应用 E2E、H5 冒烟
Phase 10：验收修复与交付报告
```

如果当前目标只是先出界面，允许优先执行 Phase 0 到 Phase 5，并使用 Mock API。但必须明确这是 Mock 验收，不等于真实联调验收。

---

## 6. 执行模式

### 6.1 前端 Mock 原型模式

适用于：先生成可运行界面和低代码运行态演示。

允许：

```text
1. 使用 Mock API / MSW / 内存数据。
2. 使用静态 RuntimeModel JSON。
3. 使用 mock 文件预览和下载地址。
4. 使用前端模拟发布、审批和版本冲突。
```

禁止：

```text
1. 宣称 Mock 验收等同真实联调。
2. 绕过 60 文档直接写固定 CRUD 页面。
3. 为合同、报销、采购写死专用运行态页面。
4. 跳过 RuntimeModel Adapter、组件注册表和字段组件协议。
```

### 6.2 后端服务实现模式

适用于：生成 Spring Boot 后端、数据库迁移、API 实现。

必须：

```text
1. 遵守 30 数据库设计。
2. 遵守 40 API 设计。
3. 遵守 50 后端服务分层。
4. 所有运行态 API 读取 app_runtime_pointer 和 metadata_snapshot。
5. 所有核心写操作有事务、权限、审计和必要幂等。
```

### 6.3 全栈联调模式

适用于：前端 Mock 替换为真实 API，完成端到端闭环。

必须验证：

```text
1. 登录认证真实可用。
2. 发布生成真实 metadata_snapshot。
3. 运行态读取真实 current_snapshot_id。
4. 业务记录写入真实 lc_business_record。
5. 流程任务使用真实 taskVersion 乐观锁。
6. 附件下载以 lc_file_attachment 为权威鉴权。
7. 审计日志和安全事件真实落库。
```

---

## 7. 固定技术栈

Codex 不得擅自替换以下技术栈。

### 7.1 前端

```text
React
TypeScript
Vite
Ant Design
React Router
Axios 或基于 OpenAPI 生成的 API Client
MSW 或等价 Mock Service
```

### 7.2 后端

```text
Java
Spring Boot
Maven
Spring Security
Spring Validation
Spring Transaction
Flyway
PostgreSQL
Redis
S3 Compatible 文件存储适配层
```

### 7.3 工程形态

```text
Monorepo
apps/web
apps/api
packages/shared-types
packages/mock-data
infra/docker-compose
```

如现有仓库结构不同，Codex 必须先说明差异，并尽量以最小修改适配，不得随意推翻当前工程。

---

## 8. 推荐仓库结构

```text
.
├── CODEX.md
├── docs/
│   ├── 00-project-context-summary.md
│   ├── 20-system-architecture-design.md
│   ├── 30-core-database-design.md
│   ├── 40-api-design.md
│   ├── 45-tech-stack-and-scaffold-decision.md
│   ├── 50-backend-service-design.md
│   ├── 60-frontend-runtime-renderer-design.md
│   ├── 61-frontend-page-and-component-design.md
│   ├── 70-development-task-breakdown.md
│   ├── 80-test-and-acceptance-plan.md
│   ├── 90-metadata-dsl-guideline.md
│   └── 99-codex-execution-guide.md
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared-types/
│   └── mock-data/
└── infra/
    └── docker-compose/
```

如果文档包放在仓库根目录而不是 `docs/`，Codex 仍应按同样阅读顺序处理。

---

## 9. 每批任务执行流程

Codex 每次执行任务必须遵守以下流程。

```text
1. 识别当前任务目标。
2. 阅读 CODEX.md 和本指南。
3. 阅读任务相关输入文档。
4. 检查仓库已有结构和依赖。
5. 制定最小修改计划。
6. 执行代码修改。
7. 补充或更新测试。
8. 运行对应检查命令。
9. 修复失败项。
10. 输出执行报告。
```

Codex 不得跳过第 4 步直接创建一套新工程，除非仓库为空。

---

## 10. 任务开始前检查清单

在写代码前，Codex 必须确认：

```text
1. 当前任务属于 70 文档中的哪个 Phase 和任务编号。
2. 任务输入文档是否已阅读。
3. 是否涉及前端、后端、数据库、Mock、测试或联调。
4. 是否需要新增依赖。
5. 是否需要新增环境变量。
6. 是否影响 RuntimeModel。
7. 是否影响 API 契约。
8. 是否影响数据库迁移。
9. 是否影响权限、审计、安全事件或幂等。
10. 是否需要补测试。
```

如果无法确认，应优先按 P0 保守范围实现，并在执行报告中列出假设。

---

## 11. 代码生成总约束

### 11.1 不得生成 P1/P2 能力

P0 不做：

```text
1. 插件市场。
2. 完整 BPMN。
3. 完整 BI。
4. AI 自动生成应用。
5. 完整 SaaS 计费和运营后台。
6. 原生移动 App。
7. 第三方连接器市场。
8. 复杂表达式脚本执行引擎。
```

### 11.2 不得绕过元数据驱动

运行态页面不得为合同、报销、采购写死专属页面。必须基于 RuntimeModel、form/view/workflow/permission 渲染。

### 11.3 不得绕过后端权限

前端权限裁剪只用于用户体验。后端必须执行最终权限校验。

### 11.4 不得动态建业务表

不得生成 `contract`、`expense_report`、`purchase_request` 等业务对象专用物理表。业务记录必须进入 `lc_business_record`。

---

## 12. 前端生成规则

Codex 生成前端代码时必须遵守：

```text
1. 使用 React + TypeScript + Vite + Ant Design。
2. 路由、页面和组件遵守 61 文档。
3. 运行态列表、表单、详情、审批遵守 60 文档。
4. API 调用必须经过统一 API Client 或 Mock Service。
5. 页面必须具备 loading、empty、ready、error、permission_denied、not_found 状态。
6. 核心运行态组件必须支持 H5 自适应。
7. 不得在页面组件中散落复杂业务逻辑。
8. 不得直接从 localStorage 伪造权限作为最终判断。
9. 不得为样板应用写死专属运行态表单。
10. 每个阶段必须至少保证 npm run build 不失败。
```

---

## 13. Runtime Renderer 生成规则

Codex 生成 Runtime Renderer 时必须实现或预留：

```text
1. RuntimeModel Adapter。
2. RuntimeModel 版本兼容判断。
3. Component Registry 初始化流程。
4. 字段组件统一 Props。
5. Field Error Boundary。
6. Runtime Action Dispatcher。
7. RuntimeModel 缓存策略。
8. dirty state 和离开确认。
9. recordVersion / taskVersion 冲突处理。
10. lookup 弹窗列表 API 参数。
11. subtable 行级和表级校验。
12. attachment 字段渲染与文件 API 接入。
13. Runtime 测试夹具。
```

如果某项暂时以 stub 实现，必须在代码和执行报告中标记 `TODO(P0-stub)`，并不得声称完成完整验收。

---

## 14. 后端生成规则

Codex 生成后端代码时必须遵守：

```text
1. 使用 Spring Boot 模块化单体。
2. Controller 只做协议适配。
3. Application Service 负责编排、事务、权限入口、幂等入口和审计入口。
4. Domain Service 承载领域规则。
5. Repository 只做数据访问。
6. 运行态 API 不得读取 metadata_resource.draft_json。
7. 发布、回滚、业务记录写入、流程审批、文件访问必须有事务边界。
8. 默认查询必须包含 tenant_id 和 is_deleted 条件。
9. 附件下载必须以 lc_file_attachment 为权威鉴权。
10. 审计日志和安全事件不得保存密码、Token、密钥明文。
```

---

## 15. 数据库生成规则

Codex 生成数据库迁移时必须遵守：

```text
1. 表名使用 lc_ 前缀。
2. 使用 Flyway 管理迁移。
3. 所有核心表保留 tenant_id。
4. 可编辑核心表保留 version。
5. 核心业务表支持软删除。
6. 不得生成业务对象专用表。
7. 不得简单生成 tenant_id + key + is_deleted 普通唯一索引作为软删除唯一方案。
8. PostgreSQL 优先使用部分唯一索引表达 UK(active)。
9. app_version 与 metadata_snapshot 循环引用按预生成 ID + 同事务插入处理。
10. 已发布 snapshot_json 不得原地更新。
```

---

## 16. API 与 Mock 生成规则

### 16.1 API Client

```text
1. API 路径遵守 /api/v1。
2. DTO 命名遵守 40 文档。
3. 错误码必须能映射为统一前端错误状态。
4. 运行态 API 必须携带 appId、entityKey、snapshotId 或可由后端解析。
5. 记录更新必须携带 recordVersion。
6. 审批动作必须携带 taskVersion。
```

### 16.2 Mock API

Mock API 必须覆盖：

```text
1. 登录成功和失败。
2. 应用列表和空状态。
3. 合同、报销、采购 RuntimeModel。
4. 运行态列表、详情、新增、编辑、提交。
5. lookup 搜索和分页。
6. subtable 校验失败。
7. recordVersion 冲突。
8. taskVersion 冲突。
9. 权限拒绝。
10. 附件无权限下载。
11. 发布成功和失败。
12. 回滚成功。
13. RuntimeModel 不兼容。
```

Mock 验收不等于真实联调验收。

---

## 17. 测试生成规则

Codex 每批生成代码时必须同步考虑测试。

最小自动化测试集应优先覆盖：

```text
1. 前端 build。
2. 关键路由渲染。
3. RuntimeModel Adapter。
4. 字段权限表现。
5. recordVersion / taskVersion 冲突处理。
6. Mock Runtime API。
7. 后端核心 Service 单元测试。
8. 发布失败不切换 runtime pointer。
9. 附件无权限下载被拒绝。
10. 三个样板应用 smoke test。
```

不得通过删除测试、跳过测试、降低断言来使 CI 通过。

---

## 18. CI 与检查命令

Codex 每批任务结束后，至少运行与本次修改相关的命令。

### 18.1 前端命令

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run test
```

如果仓库使用 pnpm，则使用：

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

### 18.2 后端命令

```bash
mvn test
mvn package
```

### 18.3 数据库 / 本地环境命令

```bash
docker compose up -d
mvn flyway:migrate
```

具体命令以仓库脚本为准。若命令不存在，Codex 应先检查 `package.json`、`pom.xml`、`README` 和 `Makefile`，不得自行臆造执行成功。

---

## 19. 每批任务完成定义

每批任务必须满足：

```text
1. 代码已按输入文档实现目标。
2. 未引入 P0 不做范围能力。
3. 未违反技术栈决策。
4. 已更新或新增必要测试。
5. 已运行相关检查命令。
6. 已说明通过命令和失败命令。
7. 失败项已修复，或明确列为阻塞问题。
8. 未删除或跳过 P0-Must 测试。
9. 未将 Mock 验收伪装为真实联调验收。
10. 输出执行报告。
```

---

## 20. 执行报告模板

Codex 每次完成任务后，应输出：

```text
任务编号：
任务名称：
本次目标：
读取文档：
修改文件：
新增文件：
实现内容：
未实现内容：
假设与取舍：
运行命令：
命令结果：
测试结果：
风险与遗留问题：
下一步建议：
```

如果存在失败命令，不得写“已完成”，必须写明失败原因和修复建议。

---

## 21. 不确定点处理规则

Codex 遇到不确定点时，按以下优先级处理：

```text
1. 先查 CODEX.md 和 99-codex-execution-guide.md。
2. 再查对应设计文档。
3. 再查 70 任务拆解和 80 验收计划。
4. 若仍不明确，选择 P0 保守实现。
5. 在代码中使用 TODO(P0-question) 标记。
6. 在执行报告中列出问题。
```

不得因为不确定就引入大型框架、P1/P2 能力或重写架构。

---

## 22. 常见错误与修正方向

| 错误 | 修正方向 |
|---|---|
| 直接为合同管理写死页面 | 改为 RuntimeModel 驱动渲染。 |
| 运行态读取 draft_json | 改为通过 runtime pointer 读取 snapshot。 |
| 只隐藏菜单不做后端权限 | 后端增加权限校验和安全事件。 |
| 附件直接返回 storage_path | 改为后端鉴权后返回短期预览/下载链接。 |
| 业务记录只存 JSON 不建索引 | 同步维护 business_record_index。 |
| 忽略 recordVersion | 更新 API 和前端错误处理。 |
| 审批不校验 taskVersion | 更新 Workflow Service 和前端动作。 |
| 发布失败仍切换 pointer | 修正事务边界。 |
| 删除失败测试 | 恢复测试并修复代码。 |

---

## 23. 推荐 Codex 初始 Prompt

将文档包放入仓库后，可以对 Codex 使用以下初始任务：

```text
请先阅读 CODEX.md 和 docs/99-codex-execution-guide.md，再按文档中的阅读顺序读取 00、20、30、40、45、50、60、61、70、80、90 文档。
当前目标是实现 P0 低代码平台前端 Mock 原型与工程骨架。
请不要生成 P1/P2 能力，不要改变技术栈，不要为合同/报销/采购写死专属运行态页面。
请先完成 70-development-task-breakdown.md 中 Phase 0 和 Phase 1 的任务，并在完成后运行可用的构建/检查命令，输出执行报告。
```

如果要实现后端，则使用：

```text
请基于 CODEX.md、99-codex-execution-guide.md、30-core-database-design.md、40-api-design.md、45-tech-stack-and-scaffold-decision.md 和 50-backend-service-design.md，实现 P0 后端基础设施与核心服务骨架。
必须使用 Spring Boot + Maven + PostgreSQL + Flyway，不得生成业务对象专用表。
请先完成 70 文档中后端基础设施相关任务，并补充单元测试和迁移脚本。
```

---

## 24. Codex 执行批次建议

### Batch 1：工程初始化

```text
目标：Monorepo、前端、后端、共享类型、Mock 数据目录初始化。
输入：45、70、99、CODEX。
验收：基础命令可运行。
```

### Batch 2：前端基础壳

```text
目标：登录、AppShell、路由、应用中心、模板中心。
输入：45、61、70。
验收：核心页面可打开，Mock 应用可展示。
```

### Batch 3：Runtime Renderer 骨架

```text
目标：RuntimeModel Adapter、组件注册表、字段组件、列表/表单/详情渲染。
输入：60、90、40。
验收：三个样板应用 RuntimeModel 可渲染。
```

### Batch 4：设计态页面

```text
目标：数据建模、表单设计器、流程设计器、权限配置、发布管理。
输入：61、04、05、07、08、09。
验收：设计态页面可基于 Mock 保存和预览。
```

### Batch 5：后端基础

```text
目标：Spring Boot 工程、认证、上下文、异常、审计、Flyway、基础表。
输入：30、40、45、50。
验收：mvn test / package 通过，迁移脚本可运行。
```

### Batch 6：核心后端服务

```text
目标：应用、元数据、发布、权限、运行态模型、业务记录、流程、文件。
输入：30、40、50。
验收：核心 API smoke test 通过。
```

### Batch 7：联调与验收

```text
目标：替换 Mock API，完成主闭环联调，补齐测试。
输入：70、80。
验收：P0 最小自动化测试集和样板应用 E2E 通过。
```

---

## 25. 交付红线

```text
1. 不得改变技术栈。
2. 不得跳过文档阅读顺序。
3. 不得生成 P0 不做范围。
4. 不得硬编码三个样板应用运行态页面。
5. 不得让运行态读取设计态草稿。
6. 不得绕过后端权限、字段权限、附件鉴权。
7. 不得为业务对象动态建物理表。
8. 不得原地修改已发布 snapshot。
9. 不得删除失败测试来通过 CI。
10. 不得把 Mock 验收当作真实联调验收。
```

---

## 26. 进入 Codex 前检查表

将文档包交给 Codex 前，至少应确认：

| 检查项 | 要求 |
|---|---|
| 文档入口 | 存在 `CODEX.md` 与 `99-codex-execution-guide.md`。 |
| 技术栈 | 存在 `45-tech-stack-and-scaffold-decision.md`。 |
| 后端 | 存在 `50-backend-service-design.md`。 |
| 前端运行态 | 存在 `60-frontend-runtime-renderer-design.md`。 |
| 前端页面 | 存在 `61-frontend-page-and-component-design.md`。 |
| 任务拆解 | 存在 `70-development-task-breakdown.md`。 |
| 测试验收 | 存在 `80-test-and-acceptance-plan.md`。 |
| DSL | 存在 `90-metadata-dsl-guideline.md`。 |
| API | 存在 `40-api-design.md`。 |
| 数据库 | 存在 `30-core-database-design.md`。 |

---

## 27. 后续可选增强

以下文档不是 Codex 启动的绝对前置，但建议后续补充：

```text
1. 40A-openapi-spec.yaml
2. 81-e2e-test-case-catalog.md
3. 82-test-fixture-and-mock-data-design.md
4. 85-deployment-and-ops-guide.md
```

其中 `40A-openapi-spec.yaml` 对 API Client 和后端 Controller 生成最有帮助。

---

## 28. 附录：Codex 工作红线

```text
1. Codex 必须先读 CODEX.md。
2. Codex 必须按文档包当前技术栈实现。
3. Codex 不得擅自替换 React、Ant Design、Spring Boot、PostgreSQL、Flyway。
4. Codex 不得生成 P0 不做范围。
5. Codex 不得将前端权限表现当作最终权限。
6. Codex 不得将 Mock 验收当作真实联调验收。
7. Codex 不得用删除测试、跳过测试、降低断言来制造通过结果。
8. Codex 每批任务必须输出执行报告。
9. Codex 遇到不确定点必须保守实现并记录假设。
10. Codex 必须优先保证 P0 主闭环可运行、可验证、可追踪。
```
