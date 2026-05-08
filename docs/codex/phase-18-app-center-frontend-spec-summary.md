# Phase 18 应用中心前端规格梳理总结

日期：2026-05-07  
状态：已完成  
范围：`P0-AC-001 ~ P0-AC-024` 前端设计、测试与验收规格  

## 1. 阶段目标

本阶段暂停代码实现，按照用户确认的新节奏，以 `10-P0-requirement-traceability-matrix.md` 的功能点清单为主索引，先为应用中心 `P0-AC-001 ~ P0-AC-024` 产出前端设计、测试与验收基线。

## 2. 已完成内容

- 新增 `62-P0-AC-frontend-design-test-acceptance.md`。
- 明确应用中心后续前端实现必须先按 RTM 功能点出设计、测试、验收，再进入代码。
- 将 `P0-AC-001 ~ P0-AC-024` 映射到页面、路由、区块、交互载体、测试点和验收点。
- 明确应用中心当前实现偏差，包括创建向导、分类管理、移动分类、基础信息编辑、回收站、成员管理、导入导出任务态、操作日志筛选和真实权限联调。

## 3. 新增文件

- `docs/codex/62-P0-AC-frontend-design-test-acceptance.md`
- `docs/codex/phase-18-app-center-frontend-spec-summary.md`

## 4. 修改文件

- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-project-context-summary.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`

## 5. 执行过的命令

```text
sed -n '7,90p' docs/codex/10-P0-requirement-traceability-matrix.md
sed -n '92,220p' docs/codex/10-P0-requirement-traceability-matrix.md
sed -n '193,590p' docs/codex/02-P0-app-center.md
rg -n "AppListPage|AppDetailPage|/apps/:appId|/apps" apps/web/src/routes/index.tsx apps/web/src/pages/app-center apps/web/src/services/appApi.ts packages/api-client/src/index.ts packages/mock-data/src/index.ts
```

## 6. 命令结果

- 已确认 `10-P0-requirement-traceability-matrix.md` 中应用中心范围为 `P0-AC-001 ~ P0-AC-024`。
- 已确认 `02-P0-app-center.md` 中每个 P0-AC 功能点均包含用户角色、目标、输入、处理逻辑、权限、审计、异常和验收标准。
- 已确认当前代码已有 `/apps`、`/apps/:appId`、`/apps/:appId/overview`、设计态和运行态路由。
- 本阶段未运行构建或测试命令，因为未修改代码。

## 7. 未完成事项

- 尚未按新规格调整前端代码。
- 尚未补应用中心 E2E 或组件测试。
- 尚未进入 `P0-OUR-001 ~ P0-OUR-024` 组织用户角色前端规格。

## 8. 风险或不确定点

- 当前已有应用中心 Mock 页面和新规格之间存在偏差，后续需要按规格逐项调整。
- `62-P0-AC` 是应用中心前端基线，后续若 `10-P0-requirement-traceability-matrix.md` 扩展第二批模块，需要同步扩展前端规格。
- 当前规格区分 Mock 验收和真实联调验收；不得把入口级 Mock 视为真实 P0 完成。
