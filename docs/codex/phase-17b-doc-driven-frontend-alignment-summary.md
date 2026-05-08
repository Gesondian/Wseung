# Phase 17B 前端 P0 文档驱动对齐总结

## 1. 阶段范围

本阶段响应“前端设计必须按照对应 md 文档执行，保证文档里的 P0 要求”的要求，正式将前端实现改为文档驱动流程，并以 `02-P0-app-center.md` 为示范，对应用中心页面做一轮 P0 对齐。

## 2. 新增执行规则

后续每个前端页面任务必须先读取对应模块文档：

1. 应用中心：`02-P0-app-center.md`
2. 组织用户角色：`03-P0-org-user-role.md`
3. 数据建模：`04-P0-data-modeling.md`
4. 表单设计器：`05-P0-form-designer.md`
5. 流程引擎：`07-P0-workflow-engine.md`
6. 权限系统：`08-P0-permission-system.md`
7. 发布与运行时：`09-P0-release-runtime.md`
8. 前端运行态渲染器：`60-frontend-runtime-renderer-design.md`
9. 前端页面组件：`61-frontend-page-and-component-design.md`

每次实现前必须提取：

1. P0-Must / P0-Guardrail 功能点。
2. 页面输入、输出、权限、审计和异常处理。
3. 验收标准。
4. 当前阶段 Mock 与真实后端边界。

## 3. 本阶段应用中心对齐内容

对照 `02-P0-app-center.md`：

| 功能编号 | 文档要求 | 本阶段对齐情况 |
|---|---|---|
| P0-AC-001 | 首页应有应用列表、分类栏、创建入口、搜索筛选区 | 已补分类栏、创建入口、搜索筛选区 |
| P0-AC-002 | 卡片展示名称、编码、状态、负责人、创建人、更新时间、发布状态 | 已补编码、状态、负责人、创建人、更新时间、发布时间 |
| P0-AC-003 | 按名称、编码、描述、负责人搜索 | 已扩展搜索字段 |
| P0-AC-004 | 按状态、分类、关系筛选，按更新时间/创建时间/名称排序 | 已补状态、分类、关系筛选和排序 |
| P0-AC-005 | 应用分类/文件夹管理入口 | 已补分类栏和新建分类 Mock 入口 |
| P0-AC-007/008/009 | 空白创建、模板创建、Excel 创建入口 | 已补空白创建、模板创建、导入应用入口；Excel 创建后续单独补 |
| P0-AC-014 | 已发布应用运行入口 | 已按发布状态控制运行入口展示 |

## 4. 修改文件清单

1. `packages/api-client/src/index.ts`
2. `packages/mock-data/src/index.ts`
3. `apps/web/src/pages/app-center/AppListPage.tsx`
4. `apps/web/src/services/designApi.ts`
5. `apps/web/src/styles.css`
6. `docs/codex/00-current-working-plan.md`
7. `docs/codex/00-project-doc-index.md`
8. `docs/codex/00-baseline-state.md`
9. `docs/codex/00-project-context-summary.md`
10. `docs/codex/00-decision-log.md`

## 5. 新增文件清单

1. `docs/codex/phase-17b-doc-driven-frontend-alignment-summary.md`

## 6. 执行过的命令

```bash
sed -n '1,260p' docs/codex/02-P0-app-center.md
sed -n '1,260p' docs/codex/61-frontend-page-and-component-design.md
sed -n '1,220p' docs/codex/00-current-working-plan.md
sed -n '1,220p' apps/web/src/pages/app-center/AppListPage.tsx
rg -n "^#### P0-AC-|^### 5A|^## 5|应用中心首页|应用卡片|应用搜索|应用筛选|应用分类|模板|导入|导出|审计" docs/codex/02-P0-app-center.md
sed -n '220,620p' docs/codex/02-P0-app-center.md
sed -n '1,260p' packages/api-client/src/index.ts
sed -n '1,160p' packages/mock-data/src/index.ts
pnpm --filter @lowcode/web lint
pnpm --filter @lowcode/web typecheck
pnpm --filter @lowcode/web build
```

## 7. 命令结果

1. `pnpm --filter @lowcode/web lint`：通过。
2. 第一次 `pnpm --filter @lowcode/web typecheck`：失败，原因是应用状态扩展了 `disabled`，但 `DesignAppOverview.status` 未同步。
3. 修复后 `pnpm --filter @lowcode/web typecheck`：通过。
4. `pnpm --filter @lowcode/web build`：通过，仍有 Vite chunk 大于 500KB 警告。

## 8. 未完成事项

1. 应用中心仍未实现真实创建、分类管理、导入导出、停用、恢复、删除和审计落库。
2. Excel 创建入口尚未单独补齐。
3. 应用详情页仍需继续对齐 `P0-AC-011` 到 `P0-AC-023`。
4. 其它前端页面仍需按对应 md 文档逐项对齐。

## 9. 风险或不确定点

1. 当前补齐仍是 Mock 层，不等同于真实应用中心后端闭环。
2. 文档 P0 功能很多，应按模块和功能编号分批实现，避免一次性大改。
3. 后续必须在阶段总结里列出“对照了哪个 md、覆盖了哪些 P0 编号、未覆盖哪些编号”。
