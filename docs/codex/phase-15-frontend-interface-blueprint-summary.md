# Phase 15 前端界面蓝图与推进计划总结

## 1. 阶段范围

本阶段不新增复杂业务逻辑，先把 P0 前端界面规划正式落盘，明确“已有界面”“待补界面”“界面实现顺序”和“前后端真实联调时机”。该阶段承接 `60-frontend-runtime-renderer-design.md` 与 `61-frontend-page-and-component-design.md`，用于后续逐页实现和验收。

## 2. 对用户问题的回答

前端界面规划从 Phase 15 正式开始。此前 Phase 5 到 Phase 8 已经完成一批可运行 Mock 页面，但它们属于“页面骨架与 Mock 验收”；从 Phase 15 起进入“界面蓝图 + 分批升级 + 后端联调准备”。

推荐节奏：

1. Phase 15：前端界面蓝图、页面清单、优先级、联调路线。
2. Phase 16：设计态核心界面补齐，包括应用概览、数据模型、表单设计、流程设计、权限设计。
3. Phase 17：运行态界面体验升级，包括列表筛选、表单布局、详情页、提交审批、附件入口、字段权限裁剪。
4. Phase 18：任务中心接真实后端最小接口，包括待办列表、任务详情、同意、驳回。
5. Phase 19：发布、审计、安全、文件页面从 Mock 逐步切到真实后端。

## 3. 当前已具备的前端页面

| 页面域 | 已有页面 | 当前性质 |
|---|---|---|
| 认证 | 登录页 | Mock 登录 |
| 工作台 | 工作台首页 | Mock 数据 |
| 应用中心 | 应用列表 | Mock 数据 |
| 设计态 | 应用概览占位、发布管理 | 部分 Mock/占位 |
| 运行态 | 应用首页、记录列表、详情、新建、编辑、提交审批 | Mock API 闭环 |
| 任务 | 待办、审批详情、同意、驳回 | Mock API 闭环 |
| 文件 | 附件页面 | Mock 数据 |
| 审计安全 | 审计日志、安全事件 | Mock 数据 |
| 运维 | 诊断巡检 | Mock 数据 |

## 4. 待补界面清单

### 4.1 设计态优先补齐

| 优先级 | 页面 | 路由建议 | 说明 |
|---|---|---|---|
| P0-Must | 应用概览 | `/apps/:appId/overview` | 展示应用状态、实体、流程、发布版本和运行入口。 |
| P0-Must | 数据模型设计 | `/apps/:appId/models` | 展示实体、字段、索引字段、关联关系。 |
| P0-Must | 表单设计 | `/apps/:appId/forms` | 左侧字段树、中间画布、右侧属性面板。 |
| P0-Must | 流程设计 | `/apps/:appId/workflows` | 节点列表、审批人配置、版本提示。 |
| P0-Must | 权限设计 | `/apps/:appId/permissions` | 角色、字段可见/可编辑、动作权限。 |

### 4.2 运行态优先升级

| 优先级 | 页面 | 说明 |
|---|---|---|
| P0-Must | 运行态列表 | 增加筛选、状态标签、批量入口和空状态。 |
| P0-Must | 运行态表单 | 增加字段权限裁剪、附件区、校验提示、dirty state。 |
| P0-Must | 运行态详情 | 增加审批状态、附件、审计摘要和操作区。 |
| P0-Must | 提交审批 | 后续切到真实 `/submit` 接口。 |

### 4.3 任务中心真实联调

| 优先级 | 页面 | 说明 |
|---|---|---|
| P0-Must | 待办列表 | 后续切到 `GET /api/v1/workflow/tasks`。 |
| P0-Must | 任务详情 | 后续切到 `GET /api/v1/workflow/tasks/{taskId}`。 |
| P0-Must | 同意/驳回 | 后续切到 approve/reject 真实接口，并处理 `taskVersion`。 |

## 5. 推荐下一步实现

下一步建议执行 Phase 16：设计态核心界面补齐。

目标：

1. 将 `/apps/:appId/overview` 从占位页升级为真实 Mock 应用概览。
2. 新增 `/apps/:appId/models` 数据模型设计 Mock 页面。
3. 新增 `/apps/:appId/forms` 表单设计 Mock 页面。
4. 新增 `/apps/:appId/workflows` 流程设计 Mock 页面。
5. 新增 `/apps/:appId/permissions` 权限设计 Mock 页面。
6. 更新路由和侧边菜单。
7. 保持所有数据来自 Mock service，不冒充真实后端联调。

## 6. 执行过的命令

```bash
sed -n '1,220p' docs/codex/00-current-working-plan.md
find apps/web/src -maxdepth 3 -type f | sort
sed -n '1,220p' apps/web/README.md
find docs/codex -maxdepth 1 -type f | sort
sed -n '1,260p' docs/codex/61-frontend-page-and-component-design.md
sed -n '1,260p' apps/web/src/routes/index.tsx
sed -n '1,260p' apps/web/src/app/App.tsx
sed -n '1,260p' apps/web/src/pages/README.md
```

## 7. 命令结果

1. 确认当前工作计划下一步仍偏后端权限，但用户明确询问前端界面规划，因此新增 Phase 15 前端蓝图。
2. 确认 `apps/web/src/pages` 已有登录、工作台、应用中心、运行态、任务、发布、文件、审计、安全、诊断页面。
3. 确认当前路由已有基础页面，但设计态模型/表单/流程/权限页面仍未补齐。
4. 确认 `apps/web/README.md` 仍停留在早期骨架描述，需要更新为当前前端状态。

## 8. 未完成事项

1. 尚未新增设计态具体页面代码。
2. 尚未将前端任务中心切到 Phase 14 真实后端接口。
3. 尚未补字段权限裁剪、附件组件真实交互和运行态表单组件测试。
4. 尚未产出像素级视觉稿；当前是工程可执行界面蓝图。

## 9. 风险或不确定点

1. 设计态页面如果一次性实现过多，容易变成不可验收的大改，建议 Phase 16 分页推进。
2. 前端当前仍以 Mock 为主，不应将页面可用误判为真实联调完成。
3. 真实权限、文件、发布快照尚未完成后端闭环，前端只能先做 Mock 和接口预留。
