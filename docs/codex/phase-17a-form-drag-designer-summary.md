# Phase 17A 表单拖拽设计器纵切版总结

## 1. 阶段范围

本阶段响应“下一步希望做完整的拖拉拽设计器”的目标，先实现表单设计器的可用纵切版。该版本支持字段物料拖入画布、画布内拖拽移动、选中字段配置、删除、复制、上下移动、JSON 预览和 Mock 保存提示。

当前仍不实现真实元数据草稿持久化、不实现发布联动、不实现完整拖拽设计器的全部能力。

## 2. 已完成内容

1. 将表单设计页从静态 Mock 升级为拖拽设计器 Mock。
2. 左侧字段物料支持 HTML5 drag/drop。
3. 中间画布支持把字段拖入指定分区。
4. 画布内字段支持拖到其他分区。
5. 支持选中字段并在右侧属性面板编辑标题、宽度、必填、只读。
6. 支持字段上移、下移、复制和删除。
7. 支持半行/整行布局切换。
8. 支持表单 Mock DSL JSON 预览。
9. 支持 Mock 草稿保存提示。
10. 补充拖拽态、选中态、画布分区和 JSON 预览样式。

## 3. 修改文件清单

1. `apps/web/src/pages/design/FormDesignerPage.tsx`
2. `apps/web/src/styles.css`
3. `docs/codex/00-current-working-plan.md`
4. `docs/codex/00-project-doc-index.md`
5. `docs/codex/00-baseline-state.md`
6. `docs/codex/00-project-context-summary.md`
7. `docs/codex/00-decision-log.md`

## 4. 新增文件清单

1. `docs/codex/phase-17a-form-drag-designer-summary.md`

## 5. 执行过的命令

```bash
sed -n '1,260p' apps/web/src/pages/design/FormDesignerPage.tsx
sed -n '1,260p' apps/web/src/services/designApi.ts
sed -n '1,220p' docs/codex/00-current-working-plan.md
cat apps/web/package.json
rg -n "Date\\.now|Math\\.random|crypto" apps/web/src/pages/design/FormDesignerPage.tsx
pnpm --filter @lowcode/web lint
pnpm --filter @lowcode/web typecheck
pnpm --filter @lowcode/web build
```

## 6. 命令结果

1. 第一次 `pnpm --filter @lowcode/web lint`：失败，React purity 规则不允许在渲染相关路径调用 `Date.now()` 生成实例 ID。
2. 修复方式：改为 `useRef` 自增计数器生成拖拽字段实例 ID。
3. 修复后 `pnpm --filter @lowcode/web lint`：通过。
4. `pnpm --filter @lowcode/web typecheck`：通过。
5. `pnpm --filter @lowcode/web build`：通过，仍有 Vite chunk 大于 500KB 警告。

## 7. 未完成事项

1. 尚未接入真实元数据草稿保存接口。
2. 尚未实现撤销/重做。
3. 尚未实现栅格布局拖拽、跨行排序和复杂容器组件。
4. 尚未实现字段校验规则编辑、选项编辑、lookup 数据源配置。
5. 尚未实现表单预览运行态渲染。
6. 尚未实现多人编辑锁、版本冲突和发布前校验。

## 8. 风险或不确定点

1. 当前拖拽基于 HTML5 drag/drop，适合桌面端；移动端拖拽体验后续可能需要专门适配。
2. 完整拖拽设计器应拆成多阶段推进，避免一次性引入不可控复杂度。
3. 当前 DSL 只用于前端 Mock 预览，不等同于真实 `metadata_resource.draft_json`。
4. 后续如引入成熟拖拽库，需要评估 React 19、Ant Design 6 和当前工程依赖兼容性。
