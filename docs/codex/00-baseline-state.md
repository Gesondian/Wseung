---
title: 基线状态说明
subtitle: 企业级低代码平台 P0｜上下文恢复与文档包基线状态
version: v1.0
date: 2026-05-07
status: 已完成
depends_on:
  - 00-project-context-summary.md
  - 00-project-doc-index.md
  - 00-current-working-plan.md
  - 00-decision-log.md
---

# 00-baseline-state.md

版本：v1.0  
最后更新：2026-05-07  
状态：已完成  
用途：后续新对话、跨会话修改、Codex 执行前的上下文恢复入口  

---

## 1. 文档目的

本文档用于记录当前低代码平台 P0 文档包的**稳定基线状态**，作为后续继续修改、交给 Codex 执行、或在新对话中恢复上下文的入口文件。

后续如果对话上下文不足，应以**最新完整 ZIP 文档包 + 本文件**为准，不依赖聊天历史记忆。

---

## 2. 当前最新完整文档包

当前最新完整文档包建议命名为：

```text
P0-trunk-docs-detailed-v1.2-with-90-20-30-40-45-50-60-61-70-80-99-CODEX-100-BASELINE-20260507.zip
```

说明：

```text
1. 该包应包含全部 P0 主干文档、架构设计、数据库设计、API 设计、技术栈、后端服务、前端设计、任务拆解、测试验收、Codex 执行说明和第一次任务 Prompt。
2. 后续每次修改文档时，都应基于最新完整 ZIP 解包修改，并重新输出新的完整 ZIP。
3. 新对话中继续工作时，应上传最新完整 ZIP，并说明“以该 ZIP 为唯一基线”。
```

---

## 3. 推荐新对话恢复流程

在新的 ChatGPT 对话中继续修改时，建议直接发送：

```text
这是当前最新项目文档包，请以它为唯一基线。

请先读取：
1. 00-baseline-state.md
2. 00-project-context-summary.md
3. 00-project-doc-index.md
4. 00-current-working-plan.md
5. 00-decision-log.md

然后基于最新文档包继续后续修改。
```

恢复规则：

```text
1. 优先读取 00-baseline-state.md 了解当前包状态。
2. 再读取 00-project-doc-index.md 确认文档清单。
3. 再读取 00-current-working-plan.md 确认下一步任务。
4. 再读取 00-decision-log.md 确认关键决策。
5. 如需修改特定文档，再读取该文档及其 depends_on 中列出的关键依赖。
```

---

## 4. 当前项目阶段

当前阶段：

```text
P0 文档基线已完成，工程已完成前端 Mock 主闭环、前端界面蓝图、设计态核心 Mock 界面、表单拖拽设计器纵切版、前端 P0 文档驱动对齐规则、应用中心首页和应用详情与生命周期 Mock、应用中心 `P0-AC-001 ~ P0-AC-024` 前端设计/测试/验收总规格、应用中心 `P0-AC-001 ~ P0-AC-004` 首页前端设计小批次规格且已按确认范围实现 `/apps` 首页、后端基础设施骨架、数据库接入准备、Docker/Testcontainers 真实验证、后端 Repository 切换、运行态记录最小后端、运行态提交审批最小后端与流程任务最小后端，尚未完成完整设计器持久化、运行态体验升级、真实权限、文件、发布快照和完整流程事务，也尚未进入真实前后端联调阶段。
```

已完成能力域：

```text
1. P0 主干需求文档
2. 元数据 DSL 统一规范
3. 系统架构设计
4. 核心数据库设计
5. 核心 API 设计
6. 技术栈与工程脚手架决策
7. 后端服务设计
8. 前端 Runtime Renderer 设计
9. 前端页面与组件设计
10. 开发任务拆解
11. 测试与验收计划
12. Codex 执行说明
13. CODEX 仓库根入口文件
14. Codex 第一次任务 Prompt
15. 当前文档包基线状态说明
16. Monorepo、前端/后端骨架、packages、infra、scripts、openapi 初始化
17. Mock API、样板 RuntimeModel、样板业务记录
18. 登录、工作台、应用中心、运行态首页、运行态列表
19. 任务中心、审批详情、同意/驳回 Mock 动作
20. 发布、文件、审计、安全、诊断 Mock 页面
21. 运行态记录详情、新建、编辑、提交审批 Mock 闭环
22. 后端请求上下文、统一响应/异常、Mock 认证、审计/安全事件、幂等服务、Flyway 基础迁移文件
23. 后端 PostgreSQL `db` profile、Flyway PostgreSQL 支持、Testcontainers 迁移测试、最小审计日志 JDBC Repository
24. Docker/Testcontainers 追加验证：PostgreSQL 容器迁移和 JDBC Repository 测试实际通过，0 skipped
25. 审计日志、安全事件、幂等服务支持内存/JDBC 可配置 Repository，并通过 Testcontainers 验证
26. 运行态记录创建、查询、列表、版本冲突更新支持内存/JDBC Repository，并通过 Testcontainers 验证
27. 运行态提交审批支持最小真实后端接口、幂等重复返回、版本冲突校验、`submitted` 状态更新、流程任务占位、内存/JDBC Repository，并通过 Testcontainers 验证
28. 流程任务支持列表、详情、同意、驳回、taskVersion 冲突、动作幂等、内存/JDBC Repository，并通过 Testcontainers 验证
29. 前端界面蓝图已明确已有 Mock 页面、待补设计态页面、运行态升级项和任务中心真实联调路线
30. 设计态核心 Mock 界面已补齐应用概览、数据模型、表单设计、流程设计和权限设计
31. 表单拖拽设计器纵切版已支持字段物料、拖入画布、跨分区移动、选中配置、删除、复制、上下移动、JSON 预览和 Mock 保存提示
32. 前端 P0 文档驱动规则已建立；后续页面必须先对照对应 md 文档提取 P0 编号、权限、审计、异常和验收标准
33. 应用中心已按 `02-P0-app-center.md` 补齐详情页、资源结构、设计/运行/发布入口、成员入口、导入导出范围、操作日志和生命周期确认入口 Mock
34. 前端推进方式已改为按 `10-P0-requirement-traceability-matrix.md` 功能点切片先产出设计、测试和验收规格；应用中心 `P0-AC-001 ~ P0-AC-024` 已形成 `62-P0-AC-frontend-design-test-acceptance.md`
35. 应用中心前端设计进一步改为小批次推进；`P0-AC-001 ~ P0-AC-004` 已形成 `62-P0-AC-001-004-app-home-frontend-design.md`，并已按确认范围调整 `/apps` 首页实现
```

当前推荐动作：

```text
优先进入 `P0-AC-005 ~ P0-AC-006` 分类管理与移动分类小批次设计，或补 `/apps` 首页自动化测试。
```

---

## 5. 当前完整文档清单

| 序号 | 文档 | 当前版本 | 状态 | 作用 |
|---|---|---:|---|---|
| 00 | `00-baseline-state.md` | v1.0 | 已完成 | 上下文恢复与最新基线状态入口。 |
| 00 | `00-project-context-summary.md` | v1.0 | 已完成 | 项目背景与 P0 总体上下文。 |
| 00 | `00-project-doc-index.md` | v1.x | 已完成 | 文档总索引。 |
| 00 | `00-current-working-plan.md` | v1.x | 已完成 | 当前工作计划与下一步任务。 |
| 00 | `00-decision-log.md` | v1.x | 已完成 | 关键决策记录。 |
| 00 | `00-P0-trunk-consistency-checklist.md` | v1.2 | 已完成 | 主干一致性检查清单。 |
| 01 | `01-P0-overview.md` | v1.0 | 已完成 | P0 总览。 |
| 02 | `02-P0-app-center.md` | v1.2 | 已完成 | 应用中心需求。 |
| 03 | `03-P0-org-user-role.md` | v1.2 | 已完成 | 组织用户角色需求。 |
| 04 | `04-P0-data-modeling.md` | v1.2 | 已完成 | 数据建模需求。 |
| 05 | `05-P0-form-designer.md` | v1.2 | 已完成 | 表单设计器需求。 |
| 07 | `07-P0-workflow-engine.md` | v1.2 | 已完成 | 流程引擎需求。 |
| 08 | `08-P0-permission-system.md` | v1.2 | 已完成 | 权限系统需求。 |
| 09 | `09-P0-release-runtime.md` | v1.2 | 已完成 | 发布与运行时需求。 |
| 10 | `10-P0-requirement-traceability-matrix.md` | v1.0 | 已完成 | 需求追踪矩阵。 |
| 20 | `20-system-architecture-design.md` | v1.1 | 已完成 | 系统架构设计增强基线。 |
| 30 | `30-core-database-design.md` | v1.1.1 | 已完成 | 核心数据库设计小修订基线。 |
| 40 | `40-api-design.md` | v1.0 | 已完成 | 核心 API 设计基线。 |
| 45 | `45-tech-stack-and-scaffold-decision.md` | v1.0 | 已完成 | 技术栈与工程脚手架决策。 |
| 50 | `50-backend-service-design.md` | v1.0 | 已完成 | 后端服务设计基线。 |
| 60 | `60-frontend-runtime-renderer-design.md` | v1.1 | 已完成 | 前端运行态渲染器增强基线。 |
| 61 | `61-frontend-page-and-component-design.md` | v1.1 | 已完成 | 前端页面与组件增强基线。 |
| 62-AC | `62-P0-AC-frontend-design-test-acceptance.md` | v1.0 | 已完成 | 应用中心 P0-AC 前端设计、测试与验收规格。 |
| 62-AC-001-004 | `62-P0-AC-001-004-app-home-frontend-design.md` | v1.0 | 已完成 | 应用中心首页 P0-AC-001~004 前端设计。 |
| 70 | `70-development-task-breakdown.md` | v1.0 | 已完成 | 开发任务拆解基线。 |
| 80 | `80-test-and-acceptance-plan.md` | v1.1 | 已完成 | 测试与验收计划增强基线。 |
| 90 | `90-metadata-dsl-guideline.md` | v1.0 | 已完成 | 元数据 DSL 统一规范。 |
| 99 | `99-codex-execution-guide.md` | v1.0 | 已完成 | Codex 执行说明。 |
| ROOT | `CODEX.md` | v1.0 | 已完成 | Codex 仓库根入口文件。 |
| 100 | `100-codex-first-task-prompt.md` | v1.0 | 已完成 | Codex 第一次任务 Prompt。 |
| SUM | `phase-0-summary.md` | v1.0 | 已完成 | Phase 0/1 工程初始化总结。 |
| SUM | `phase-2-summary.md` | v1.0 | 已完成 | Phase 2 Mock API 与样板 RuntimeModel 总结。 |
| SUM | `phase-5-frontend-foundation-summary.md` | v1.0 | 已完成 | Phase 5 前端基础总结。 |
| SUM | `phase-5-hardening-summary.md` | v1.0 | 已完成 | Phase 5 hardening 与 Maven 修复总结。 |
| SUM | `phase-6-workflow-task-summary.md` | v1.0 | 已完成 | Phase 6 任务中心与审批详情 Mock 总结。 |
| SUM | `phase-7-ops-mock-summary.md` | v1.0 | 已完成 | Phase 7 发布/文件/审计/安全/诊断 Mock 总结。 |
| SUM | `phase-8-runtime-record-mock-summary.md` | v1.0 | 已完成 | Phase 8 运行态记录 Mock 闭环总结。 |
| SUM | `phase-9-backend-foundation-summary.md` | v1.0 | 已完成 | Phase 9 后端基础设施骨架总结。 |
| SUM | `phase-10-db-flyway-testcontainers-summary.md` | v1.0 | 已完成 | Phase 10 数据库接入准备总结。 |
| SUM | `phase-10-docker-testcontainers-verification-summary.md` | v1.0 | 已完成 | Phase 10 Docker/Testcontainers 追加验证总结。 |
| SUM | `phase-11-backend-repository-switch-summary.md` | v1.0 | 已完成 | Phase 11 后端 Repository 切换总结。 |
| SUM | `phase-12-runtime-record-backend-summary.md` | v1.0 | 已完成 | Phase 12 运行态记录最小后端总结。 |
| SUM | `phase-13-runtime-submit-backend-summary.md` | v1.0 | 已完成 | Phase 13 运行态提交审批最小后端总结。 |
| SUM | `phase-14-workflow-task-backend-summary.md` | v1.0 | 已完成 | Phase 14 流程任务最小后端总结。 |
| SUM | `phase-15-frontend-interface-blueprint-summary.md` | v1.0 | 已完成 | Phase 15 前端界面蓝图与推进计划总结。 |
| SUM | `phase-16-design-ui-mock-summary.md` | v1.0 | 已完成 | Phase 16 设计态核心界面 Mock 总结。 |
| SUM | `phase-17a-form-drag-designer-summary.md` | v1.0 | 已完成 | Phase 17A 表单拖拽设计器纵切版总结。 |
| SUM | `phase-17b-doc-driven-frontend-alignment-summary.md` | v1.0 | 已完成 | Phase 17B 前端 P0 文档驱动对齐总结。 |
| SUM | `phase-17c-app-detail-lifecycle-summary.md` | v1.0 | 已完成 | Phase 17C 应用详情与生命周期 Mock 总结。 |
| SUM | `phase-18-app-center-frontend-spec-summary.md` | v1.0 | 已完成 | Phase 18 应用中心前端规格梳理总结。 |
| SUM | `phase-19-app-center-001-004-design-summary.md` | v1.0 | 已完成 | Phase 19 应用中心 P0-AC-001~004 前端设计总结。 |

---

## 6. 当前关键决策摘要

### 6.1 产品与范围决策

```text
1. P0 首版只做合同管理、费用报销、采购申请三个样板应用。
2. P0 目标是企业内部管理应用的低代码搭建与流程自动化平台。
3. P0 主闭环是：应用创建 → 数据建模 → 表单配置 → 流程审批 → 权限控制 → 发布运行 → 数据沉淀 → 审计追踪。
4. P0 不做完整 BPMN、不做完整 BI、不做插件市场、不做 AI 自动生成应用、不做原生移动端。
```

### 6.2 架构与数据决策

```text
1. P0 优先私有化单租户，架构预留 SaaS 多租户。
2. 架构采用模块化单体优先。
3. 数据采用元数据表 + 通用业务记录表 + JSON + 索引字段。
4. 不为合同、报销、采购等业务对象生成独立物理表。
5. 运行态只读取 lc_app_runtime_pointer 指向的 lc_metadata_snapshot。
6. 已发布 app_version 和 metadata_snapshot 不可原地修改。
```

### 6.3 技术栈决策

```text
1. Monorepo 单仓库。
2. 前端：React + TypeScript + Vite + Ant Design。
3. 后端：Java + Spring Boot + Maven。
4. 数据库：PostgreSQL 优先。
5. 数据库迁移：Flyway。
6. 缓存：Redis。
7. 文件存储：本地文件 + S3 Compatible 适配层。
8. API Client 以后续 OpenAPI 或 40-api-design.md 为基线生成。
```

### 6.4 Codex 执行决策

```text
1. Codex 每次执行必须先读 CODEX.md。
2. 第一次任务仅执行 Phase 0 / Phase 1。
3. 不允许第一次任务直接实现完整业务。
4. 不允许擅自更换技术栈。
5. 不允许将 Mock 验收等同于真实联调验收。
6. 每批任务必须运行检查命令并输出执行报告。
```

---

## 7. 当前下一步任务

### 7.1 主线任务

```text
继续在当前工程中推进 P0 主闭环，下一步建议先按 RTM 功能点切片评审前端规格，再进入代码实现。
```

目标：

```text
1. 初始化 Monorepo 工程。
2. 创建 apps/web 前端工程骨架。
3. 创建 apps/api 后端工程骨架。
4. 初始化 docs、mocks、packages、infra、scripts、openapi 等目录。
5. 配置基础 build / lint / typecheck / test 命令。
6. 已启动后端认证上下文、统一异常、审计/安全事件、幂等、数据库迁移骨架。
7. 已新增真实数据库迁移与基础持久化测试入口；当前环境 Docker 不可用，用例会跳过。
8. 已在 Docker 可用环境验证 PostgreSQL 迁移和 JDBC Repository 测试；默认 Codex 沙箱仍需提升权限才能访问 Docker socket。
9. 已完成审计日志、安全事件、幂等 Repository 切换。
10. 已完成运行态记录保存/查询最小真实接口与 Repository 测试。
11. 已完成运行态提交审批最小真实接口与流程任务占位 Repository 测试。
12. 已完成流程任务列表、详情、同意、驳回最小真实接口与 Repository 测试。
13. 已完成前端界面蓝图与 Phase 16 页面实现范围规划。
14. 已完成应用概览、数据模型、表单设计、流程设计和权限设计 Mock 页面。
15. 已完成表单拖拽设计器纵切版。
16. 已建立前端 P0 文档驱动对齐规则，并按 `02-P0-app-center.md` 补强应用中心首页。
17. 已按 `02-P0-app-center.md` 补应用详情、资源结构、生命周期入口、成员入口、导入导出和操作日志 Mock。
18. 已按 `10-P0-requirement-traceability-matrix.md` 为 `P0-AC-001 ~ P0-AC-024` 产出应用中心前端设计、测试、验收规格。
19. 已按小批次产出并确认 `P0-AC-001 ~ P0-AC-004` 应用中心首页前端设计。
20. 已按 `62-P0-AC-001-004-app-home-frontend-design.md` 调整 `/apps` 首页实现，只保留应用中心浏览、应用展示、搜索、筛选和排序。
21. 下一步继续 `P0-AC-005 ~ P0-AC-006` 分类管理与移动分类设计，或补 `/apps` 首页自动化测试。
21. 继续保持不实现复杂业务逻辑、不宣称真实联调完成。
```

### 7.2 可选文档任务

| 优先级 | 文档 | 说明 |
|---|---|---|
| 中 | `40A-openapi-spec.yaml` | 将 `40-api-design.md` 转为结构化 OpenAPI，提高 API Client 与 Controller 生成准确度。 |
| 中 | `81-e2e-test-case-catalog.md` | 将 `80-test-and-acceptance-plan.md` 进一步拆成可执行 E2E 用例清单。 |
| 中 | `82-test-fixture-and-mock-data-design.md` | 定义样板应用 Mock 数据、测试夹具、seed 数据和重置策略。 |

---

## 8. 后续修改文档的固定流程

每次修改文档时必须遵守：

```text
1. 以上一版最新完整 ZIP 为输入。
2. 解包后修改目标文件。
3. 如果新增或修改重要文档，必须同步更新：
   - 00-project-doc-index.md
   - 00-current-working-plan.md
   - 00-decision-log.md
   - 00-baseline-state.md
4. 输出被修改的单文件。
5. 输出新的完整 ZIP。
6. 新 ZIP 文件名应体现新增或修改的关键文档编号。
```

推荐命名规则：

```text
P0-trunk-docs-detailed-v1.2-with-{doc-numbers}-{date}.zip
```

示例：

```text
P0-trunk-docs-detailed-v1.2-with-90-20-30-40-45-50-60-61-70-80-99-CODEX-100-BASELINE-20260507.zip
```

---

## 9. 后续修改请求模板

建议使用以下格式提出修改请求：

```text
请基于我上传的最新完整 ZIP 修改文档。

基线包：
{zip 文件名}

需要修改的文件：
{文件名}

修改目标：
{目标说明}

具体要求：
1. ...
2. ...
3. ...

同步更新：
1. 00-project-doc-index.md
2. 00-current-working-plan.md
3. 00-decision-log.md
4. 00-baseline-state.md

输出：
1. 修改后的单文件
2. 新的完整 ZIP
```

---

## 10. 当前 P0 红线摘要

```text
1. 不得为业务对象动态创建物理表。
2. 不得让运行态读取草稿元数据。
3. 不得原地修改已发布 metadata_snapshot。
4. 不得只在前端做权限控制。
5. 不得无鉴权下载附件。
6. 不得跳过 tenant_id 查询核心业务表。
7. 不得把 Mock 验收当作真实联调验收。
8. 不得让 Codex 擅自更换技术栈。
9. 不得一次性生成不可检查的大量代码。
10. 不得删除失败测试或降低 P0-Must 验收标准。
```

---

## 11. Codex 当前推荐第一条任务

可直接把以下内容交给 Codex：

```text
请先阅读 CODEX.md，然后按其中顺序阅读核心文档。

当前只执行 100-codex-first-task-prompt.md 中定义的 Phase 0 / Phase 1。

目标：
1. 初始化 Monorepo 工程。
2. 搭建 React + TypeScript + Vite + Ant Design 前端骨架。
3. 搭建 Java + Spring Boot + Maven 后端骨架。
4. 初始化 docs、mocks、packages、infra、scripts、openapi 目录。
5. 配置基础 build、lint、typecheck、test 命令。
6. 输出执行报告。

禁止：
1. 不要一次性实现完整业务。
2. 不要替换技术栈。
3. 不要生成业务对象独立表。
4. 不要将 Mock 验收等同于真实联调验收。
```

---

## 12. 本文件维护规则

```text
1. 每次新增关键文档后，应更新本文档的文档清单和下一步任务。
2. 每次修改关键决策后，应更新本文档的关键决策摘要。
3. 每次生成新的完整 ZIP 后，应更新“当前最新完整文档包”名称。
4. 本文档不替代 00-decision-log.md；这里只保存可快速恢复上下文的摘要。
5. 本文档不替代 00-project-doc-index.md；这里只保存当前稳定基线视图。
```
