# Phase 16 设计态核心界面 Mock 总结

## 1. 阶段范围

本阶段按 Phase 15 蓝图补齐设计态核心界面：应用概览、数据模型、表单设计、流程设计、权限设计。所有页面均基于 Mock service 和 RuntimeModel Stub，不实现真实元数据草稿保存，不宣称真实后端联调完成。

## 2. 已完成内容

1. 新增设计态 Mock service：`designApi`。
2. 新增应用概览页：展示实体数、字段数、视图数、动作数、快照和设计入口。
3. 新增数据模型设计页：展示实体清单和字段配置。
4. 新增表单设计页：展示字段树、表单画布和属性面板。
5. 新增流程设计页：展示 P0 审批流主线和节点配置。
6. 新增权限设计页：展示角色、字段可见/可编辑和动作权限矩阵。
7. 更新设计态路由：
   - `/apps/:appId/overview`
   - `/apps/:appId/models`
   - `/apps/:appId/forms`
   - `/apps/:appId/workflows`
   - `/apps/:appId/permissions`
8. 更新主侧边栏：进入具体应用设计态后显示数据模型、表单设计、流程设计、权限设计菜单。
9. 补充设计器画布和字段卡片基础样式。

## 3. 修改文件清单

1. `apps/web/src/layouts/MainShell.tsx`
2. `apps/web/src/pages/design/DesignPlaceholderPage.tsx`
3. `apps/web/src/routes/index.tsx`
4. `apps/web/src/styles.css`
5. `docs/codex/00-current-working-plan.md`
6. `docs/codex/00-project-doc-index.md`
7. `docs/codex/00-baseline-state.md`
8. `docs/codex/00-project-context-summary.md`
9. `docs/codex/00-decision-log.md`

## 4. 新增文件清单

1. `apps/web/src/services/designApi.ts`
2. `apps/web/src/pages/design/AppOverviewPage.tsx`
3. `apps/web/src/pages/design/ModelDesignerPage.tsx`
4. `apps/web/src/pages/design/FormDesignerPage.tsx`
5. `apps/web/src/pages/design/WorkflowDesignerPage.tsx`
6. `apps/web/src/pages/design/PermissionDesignerPage.tsx`
7. `docs/codex/phase-16-design-ui-mock-summary.md`

## 5. 执行过的命令

```bash
pnpm --filter @lowcode/web lint
pnpm --filter @lowcode/web typecheck
pnpm --filter @lowcode/web build
pnpm --filter @lowcode/web dev -- --host 127.0.0.1
curl -I http://localhost:5173/apps/app_contract_management/overview
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5173
bash scripts/check.sh
```

## 6. 命令结果

1. 第一次 `pnpm --filter @lowcode/web lint`：失败，原因是新页面在 effect 中同步 `setLoading(false)`，已修复。
2. 第一次 `pnpm --filter @lowcode/web typecheck`：失败，原因是 `apps/web` 直接引用未声明依赖 `@lowcode/mock-data` 和 `@lowcode/shared-types`，已改为复用 `appApi/runtimeApi`。
3. 修复后 `pnpm --filter @lowcode/web lint`：通过。
4. 修复后 `pnpm --filter @lowcode/web typecheck`：通过。
5. `pnpm --filter @lowcode/web build`：通过，仍有 Vite chunk 大于 500KB 警告。
6. `pnpm --filter @lowcode/web dev -- --host 127.0.0.1`：已启动，Vite 显示 `http://localhost:5173/`。
7. 普通沙箱内 `curl` 访问本机 5173 失败，但 `lsof` 显示 5173 正在监听；提升权限后 `curl -I http://127.0.0.1:5173` 返回 `HTTP/1.1 200 OK`。
8. `bash scripts/check.sh`：通过，前端 lint/typecheck/build 通过，后端 Maven test 通过，Testcontainers PostgreSQL 真实启动且 0 skipped。

## 7. 未完成事项

1. 设计态页面仍为 Mock 展示，不支持保存草稿、发布校验或回滚真实动作。
2. 表单设计器不是完整拖拽设计器，仅展示字段树、画布和属性面板的 P0 Mock 形态。
3. 流程设计器不是 BPMN 画布，仅展示 P0 审批流节点。
4. 权限设计页尚未接真实权限后端。
5. 任务中心仍未切换 Phase 14 真实后端接口。

## 8. 风险或不确定点

1. 后续若继续增强设计器，应避免一次性实现完整低代码设计器，建议按模型、表单、流程、权限分别推进。
2. 当前设计态数据来自 RuntimeModel Mock，不等同于真实元数据草稿。
3. 开发服务已在本地 5173 监听；如果后续需要释放端口，应停止当前 Vite 会话。
4. Vite 大 chunk 警告仍存在，主要来自 Ant Design 共享包。
