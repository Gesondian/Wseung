# 低代码平台文档总索引

## 1. 当前项目阶段
当前阶段：P0 文档基线已完成，工程已完成 Phase 0/1 初始化、Phase 2 Mock API、Phase 5 前端基础与 hardening、Phase 6 任务中心/审批详情 Mock、Phase 7 发布/文件/审计/安全/诊断 Mock 页面、Phase 8 前置运行态记录详情/新建/编辑/提交审批 Mock 闭环、Phase 9 后端基础设施骨架、Phase 10 数据库接入准备与 Docker/Testcontainers 真实验证、Phase 11 后端 Repository 切换、Phase 12 运行态记录最小后端、Phase 13 运行态提交审批最小后端、Phase 14 流程任务最小后端、Phase 15 前端界面蓝图、Phase 16 设计态核心界面 Mock、Phase 17A 表单拖拽设计器纵切版、Phase 17B 前端 P0 文档驱动对齐、Phase 17C 应用详情与生命周期 Mock、Phase 18 应用中心前端规格梳理、Phase 19 应用中心 P0-AC-001~004 前端设计与 Phase 20 首页实现。当前前端仍为 Mock 验收，后端真实权限、文件、发布快照和完整流程事务尚未完成，不等同于真实后端联调。下一步建议继续小批次设计 `P0-AC-005 ~ P0-AC-006` 分类管理与移动分类，或补 `/apps` 首页自动化测试。

## 2. 文档清单

| 编号  | 文档名称                                  | 版本   | 日期         | 状态  | 说明                 |
| --- | ------------------------------------- | ---- | ---------- | --- | ------------------ |
| 99  | lowcode_platform_PRD_v1.0             | v1.0 | 2026-04-29 | 已完成 | 企业级低代码平台产品需求文档 PRD |
| 00B | 00-baseline-state.md                 | v1.0 | 2026-05-07 | 已完成 | 上下文恢复与文档包基线状态入口 |
| 00  | 00-P0-trunk-consistency-checklist.md  | v1.2 | 2026-05-06 | 已完成 | 平台主干文档             |
| 01  | 01-P0-overview.md                     | v1.0 | 2026-05-06 | 已完成 | P0 总览              |
| 02  | 02-P0-app-center.md                   | v1.2 | 2026-05-06 | 已完成 | 应用中心               |
| 03  | 03-P0-org-user-role.md                | v1.2 | 2026-05-06 | 已完成 | 组织用户角色             |
| 04  | 04-P0-data-modeling.md                | v1.2 | 2026-05-06 | 已完成 | 数据建模               |
| 05  | 05-P0-form-designer.md                | v1.2 | 2026-05-06 | 已完成 | 表单设计器              |
| 07  | 07-P0-workflow-engine.md              | v1.2 | 2026-05-06 | 已完成 | 流程引擎               |
| 08  | 08-P0-permission-system.md            | v1.2 | 2026-05-06 | 已完成 | 权限系统               |
| 09  | 09-P0-release-runtime.md              | v1.2 | 2026-05-06 | 已完成 | 发布与运行时             |
| 10  | 10-P0-requirement-traceability-matrix.md | v1.0 | 2026-05-06 | 已完成 | 需求追踪矩阵             |
| 20  | 20-system-architecture-design.md      | v1.1 | 2026-05-06 | 已完成 | 系统架构设计增强基线版       |
| 30  | 30-core-database-design.md            | v1.1.1 | 2026-05-06 | 已完成 | 核心数据库设计小修订基线版     |
| 40  | 40-api-design.md                      | v1.0 | 2026-05-06 | 已完成 | 核心 API 设计基线版        |
| 45  | 45-tech-stack-and-scaffold-decision.md | v1.0 | 2026-05-06 | 已完成 | 技术栈与工程脚手架决策基线版 |
| 50  | 50-backend-service-design.md          | v1.0 | 2026-05-06 | 已完成 | 后端服务设计基线版           |
| 60  | 60-frontend-runtime-renderer-design.md | v1.1 | 2026-05-06 | 已完成 | 前端运行态渲染器设计增强基线版 |
| 61  | 61-frontend-page-and-component-design.md | v1.1 | 2026-05-06 | 已完成 | 前端页面与组件设计增强基线版 |
| 62-AC | 62-P0-AC-frontend-design-test-acceptance.md | v1.0 | 2026-05-07 | 已完成 | P0-AC-001 ~ P0-AC-024 应用中心前端设计、测试与验收规格 |
| 62-AC-001-004 | 62-P0-AC-001-004-app-home-frontend-design.md | v1.0 | 2026-05-07 | 已确认 | P0-AC-001 ~ P0-AC-004 应用中心首页前端设计 |
| 70  | 70-development-task-breakdown.md | v1.0 | 2026-05-06 | 已完成 | 开发任务拆解基线版 |
| 80  | 80-test-and-acceptance-plan.md | v1.1 | 2026-05-06 | 已完成 | 测试与验收计划增强基线版 |
| 90  | 90-metadata-dsl-guideline.md          | v1.0 | 2026-05-06 | 已完成 | 元数据 DSL 统一规范       |
| 99A | 99-codex-execution-guide.md | v1.0 | 2026-05-06 | 已完成 | Codex 执行说明基线版 |
| ROOT | CODEX.md | v1.0 | 2026-05-06 | 已完成 | Codex 仓库根入口文件 |
| 100 | 100-codex-first-task-prompt.md | v1.0 | 2026-05-06 | 已完成 | Codex 第一次任务 Prompt，限定 Phase 0 / Phase 1 工程初始化 |
| SUM-0 | phase-0-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 0/1 工程初始化阶段总结 |
| SUM-2 | phase-2-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 2 Mock API 与样板 RuntimeModel 总结 |
| SUM-5A | phase-5-frontend-foundation-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 5 前端基础页面总结 |
| SUM-5B | phase-5-hardening-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 5 hardening 与 Maven 修复总结 |
| SUM-6 | phase-6-workflow-task-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 6 任务中心与审批详情 Mock 总结 |
| SUM-7 | phase-7-ops-mock-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 7 发布/文件/审计/安全/诊断 Mock 总结 |
| SUM-8 | phase-8-runtime-record-mock-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 8 运行态记录 Mock 闭环总结 |
| SUM-9 | phase-9-backend-foundation-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 9 后端基础设施骨架总结 |
| SUM-10 | phase-10-db-flyway-testcontainers-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 10 数据库接入准备总结 |
| SUM-10B | phase-10-docker-testcontainers-verification-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 10 Docker/Testcontainers 追加验证总结 |
| SUM-11 | phase-11-backend-repository-switch-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 11 后端 Repository 切换总结 |
| SUM-12 | phase-12-runtime-record-backend-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 12 运行态记录最小后端总结 |
| SUM-13 | phase-13-runtime-submit-backend-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 13 运行态提交审批最小后端总结 |
| SUM-14 | phase-14-workflow-task-backend-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 14 流程任务最小后端总结 |
| SUM-15 | phase-15-frontend-interface-blueprint-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 15 前端界面蓝图与推进计划总结 |
| SUM-16 | phase-16-design-ui-mock-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 16 设计态核心界面 Mock 总结 |
| SUM-17A | phase-17a-form-drag-designer-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 17A 表单拖拽设计器纵切版总结 |
| SUM-17B | phase-17b-doc-driven-frontend-alignment-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 17B 前端 P0 文档驱动对齐总结 |
| SUM-17C | phase-17c-app-detail-lifecycle-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 17C 应用详情与生命周期 Mock 总结 |
| SUM-18 | phase-18-app-center-frontend-spec-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 18 应用中心前端规格梳理总结 |
| SUM-19 | phase-19-app-center-001-004-design-summary.md | v1.0 | 2026-05-07 | 已完成 | Phase 19 应用中心 P0-AC-001~004 前端设计总结 |
| SUM-20 | phase-20-app-center-001-004-frontend-implementation-summary.md | v1.0 | 2026-05-08 | 已完成 | Phase 20 应用中心 P0-AC-001~004 首页实现总结 |

## 3. 推荐后续文档

| 编号 | 文档名称 | 建议优先级 | 说明 |
|---|---|---|---|
| 40A | 40A-openapi-spec.yaml | 中 | 将 40 API 设计转为结构化 OpenAPI，提升 API Client 与后端 Controller 生成准确度。 |
| 81 | 81-e2e-test-case-catalog.md | 中 | 将 80 测试计划进一步拆成可执行 E2E 用例清单。 |
| 82 | 82-test-fixture-and-mock-data-design.md | 中 | 定义样板应用 Mock 数据、测试夹具、seed 数据和重置策略。 |
