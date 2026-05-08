# Phase 17C 应用详情与生命周期 Mock 总结

日期：2026-05-07  
状态：已完成  
对应文档：`02-P0-app-center.md`

## 1. 本阶段目标

按用户要求，前端页面实现必须对照对应 P0 md 文档。本阶段基于 `02-P0-app-center.md` 继续补齐应用中心详情页能力，不进入真实业务逻辑和真实后端联调。

## 2. 覆盖的 P0 编号

已覆盖或部分覆盖：

- `P0-AC-011` 应用详情页：新增应用详情页，展示基础信息、状态、当前版本、资源统计和最近操作。
- `P0-AC-012` 应用内资源结构展示：展示对象、表单、视图、流程、权限、发布资源摘要和入口。
- `P0-AC-013` 设计入口：提供数据建模、表单设计、流程设计、权限配置、发布管理入口。
- `P0-AC-014` 运行入口：已发布应用可进入运行端，草稿/停用状态给出提示。
- `P0-AC-015` 发布入口：详情页提供发布管理入口。
- `P0-AC-016` 应用停用：提供停用确认提示和 Mock 操作入口。
- `P0-AC-017` 应用恢复启用：停用状态可展示恢复入口；当前样板数据未含停用应用。
- `P0-AC-018` 应用软删除：提供删除确认提示和 Mock 操作入口。
- `P0-AC-020` 应用成员管理入口：展示成员列表和维护入口。
- `P0-AC-021` 导出应用元数据包：展示导出包包含/不包含范围。
- `P0-AC-022` 导入应用元数据包：展示导入流程和冲突检测入口。
- `P0-AC-023` 应用操作日志：展示最近操作日志。

未完成：

- `P0-AC-019` 回收站恢复应用：尚未实现回收站页面和恢复动作。
- 生命周期动作仍是前端 Mock 提示，未接真实应用中心后端。
- 成员维护、导入、导出、发布仍是入口级 Mock，不产生真实状态变更。

## 3. 修改文件清单

修改文件：

- `packages/api-client/src/index.ts`
- `packages/mock-data/src/index.ts`
- `apps/web/src/services/appApi.ts`
- `apps/web/src/pages/app-center/AppListPage.tsx`
- `apps/web/src/routes/index.tsx`
- `apps/web/src/styles.css`
- `docs/codex/00-current-working-plan.md`
- `docs/codex/00-project-doc-index.md`
- `docs/codex/00-project-context-summary.md`
- `docs/codex/00-baseline-state.md`
- `docs/codex/00-decision-log.md`

新增文件：

- `apps/web/src/pages/app-center/AppDetailPage.tsx`
- `docs/codex/phase-17c-app-detail-lifecycle-summary.md`

## 4. 实现内容

- 新增 `/apps/:appId` 应用详情页。
- 应用列表卡片新增“详情”入口，原 `/apps/:appId/overview` 保留为设计态概览。
- Mock API 新增 `getAppDetail(appId)`。
- Mock 数据新增三类样板应用详情，包括资源统计、资源入口、成员、操作日志和元数据包范围。
- 详情页新增运行、发布、导出、导入、停用/恢复、删除、成员维护等入口提示。
- 导出提示明确 P0 仅导出元数据，不包含业务数据、流程实例、附件和审计日志。

## 5. 执行过的命令与结果

```text
git status --short
结果：失败；当前目录不是 Git 仓库。

pnpm --filter @lowcode/web lint
结果：通过。

pnpm --filter @lowcode/web typecheck
结果：首次失败，原因是 mockAppDetails 字面量键不能被 string 直接索引；已修复后通过。

pnpm --filter @lowcode/web build
结果：通过；仍存在既有 Vite chunk 大于 500KB 警告。

bash scripts/check.sh
结果：通过。
- frontend lint: pass
- frontend typecheck: pass
- frontend build: pass with Vite chunk warning
- backend maven test: pass
- Testcontainers: 已识别 Docker Desktop socket，PostgreSQL 容器迁移测试实际运行，0 skipped。
```

## 6. 风险与不确定点

- 当前仍是前端 Mock 验收，不是应用中心真实后端联调。
- 应用停用、恢复、删除、导入、导出、成员维护未写入真实数据库，也未生成真实审计日志。
- 回收站页面和 `P0-AC-019` 恢复能力尚未实现。
- Ant Design 相关共享 chunk 仍超过 500KB，后续需要按需拆包或配置 manualChunks。
- 当前目录不是 Git 仓库，变更追踪依赖文件清单而不是 git diff。

## 7. 下一步建议

继续按对应 P0 md 文档推进：

1. 按 `02-P0-app-center.md` 补回收站页面和恢复应用入口，覆盖 `P0-AC-019`。
2. 按 `05-P0-form-designer.md` 增强拖拽表单设计器，补撤销/重做、校验规则、选项编辑、lookup 配置和运行态预览。
3. 按 `09-P0-release-runtime.md` 补发布校验、运行态入口状态和发布版本详情。
