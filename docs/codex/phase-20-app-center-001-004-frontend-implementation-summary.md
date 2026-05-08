# Phase 20 应用中心 P0-AC-001~004 首页实现总结

日期：2026-05-08  
状态：已完成  
范围：`P0-AC-001 ~ P0-AC-004`

## 1. 阶段目标

根据已确认的 `62-P0-AC-001-004-app-home-frontend-design.md` 调整 `/apps` 首页，只保留应用中心浏览、应用展示、搜索、筛选和排序能力，不带入后续应用创建、导入、分类管理、生命周期、成员和操作日志功能。

## 2. 修改文件

- `apps/web/src/pages/app-center/AppListPage.tsx`
- `apps/web/src/styles.css`
- `packages/api-client/src/index.ts`
- `packages/mock-data/src/index.ts`
- `docs/codex/62-P0-AC-001-004-app-home-frontend-design.md`
- `docs/codex/phase-19-app-center-001-004-design-summary.md`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-project-context-summary.md`
- `docs/codex/00-baseline-state.md`

## 3. 新增文件

- `docs/codex/phase-20-app-center-001-004-frontend-implementation-summary.md`

## 4. 实现内容

- `/apps` 页面改为应用中心专属布局：左侧应用范围/分类筛选，右侧搜索、筛选、排序和结果区。
- 移除本页中的空白创建、模板创建、导入应用、新建分类入口，避免提前进入后续 P0 批次。
- 保留卡片模式，并新增列表模式切换。
- 搜索覆盖应用名称、编码、描述、负责人。
- 筛选覆盖状态、分类、关系。
- 排序覆盖最近更新、创建时间、应用名称。
- 补充结果摘要、无匹配清空筛选、错误重试和加载骨架。
- Mock 数据补充已停用应用，并为应用摘要补充 `createdAt`。

## 5. 执行过的命令

```text
pnpm --filter @lowcode/web lint
pnpm --filter @lowcode/web typecheck
pnpm --filter @lowcode/web build
date '+%Y-%m-%d %H:%M:%S %Z'
```

## 6. 命令结果

- `pnpm --filter @lowcode/web lint`：通过。
- `pnpm --filter @lowcode/web typecheck`：通过。
- `pnpm --filter @lowcode/web build`：通过，仍存在既有 Vite chunk 大于 500KB 警告。
- `date`：返回 `2026-05-08 10:36:26 CST`。

## 7. 未完成事项

- 尚未补 `/apps` 首页自动化测试。
- 尚未进入 `P0-AC-005 ~ P0-AC-006` 分类管理与移动分类设计。
- 应用详情、设计、运行入口仍复用既有 Mock 路由，不代表真实后端联调完成。

## 8. 风险或不确定点

- 当前 `/apps` 仍使用 Mock Service 数据，权限过滤只体现前端样板数据，不等同真实后端授权。
- Ant Design 共享 chunk 仍超过 500KB，属于既有构建警告。
- 后续必须继续按 RTM 小批次推进，避免把应用中心后续能力一次性混入首页。
