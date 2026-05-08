# 当前工作计划

## 当前阶段

P0 工程已完成前端 Mock 主闭环、设计态核心 Mock 界面、表单拖拽设计器纵切版、应用中心首页与详情 P0 文档驱动对齐、后端 Phase 3/4 基础设施骨架、数据库接入准备、Docker/Testcontainers 真实验证、审计/安全/幂等 Repository 切换、运行态记录最小后端真实接口、运行态提交审批最小后端接口，以及流程任务列表/详情/同意/驳回最小后端接口。已完成 Monorepo、前端/后端骨架、Mock API 与样板 RuntimeModel、基础页面、运行态列表、运行态记录详情/新建/编辑/提交审批、任务中心与审批详情 Mock、发布/文件/审计/安全/诊断 Mock 页面、应用概览、数据模型、表单设计、流程设计和权限设计 Mock 页面，以及后端请求上下文、统一响应/异常、Mock 认证、审计/安全事件、幂等服务、Flyway 基础迁移文件、PostgreSQL profile、Testcontainers 迁移测试、可配置 Repository、`lc_business_record` 最小持久化和 `lc_workflow_task` 最小流程任务持久化。当前前端仍属于 Mock 验收，后端真实权限、文件、发布快照和完整流程事务尚未完成，不等同于真实后端联调。

Phase 17B 已新增前端 P0 文档驱动对齐规则，并以 `02-P0-app-center.md` 为基线补强应用中心的分类、筛选、排序、状态、负责人、创建人、更新时间和创建/导入入口。后续前端任务必须先读取对应模块 md 并在总结中列出覆盖的 P0 编号。

Phase 17C 已继续按 `02-P0-app-center.md` 补应用详情页、资源结构、设计/运行/发布入口、生命周期确认入口、成员入口、导入导出范围和操作日志 Mock 展示，覆盖 `P0-AC-011` 至 `P0-AC-023` 的主要详情页能力；回收站恢复 `P0-AC-019` 尚未完成。

Phase 18 已暂停代码实现，改为按 `10-P0-requirement-traceability-matrix.md` 的功能点切片推进前端设计；已新增 `62-P0-AC-frontend-design-test-acceptance.md`，为 `P0-AC-001 ~ P0-AC-024` 产出应用中心前端设计、测试、验收和当前偏差清单。

Phase 19 已进一步缩小粒度：应用中心不一次性出完 `P0-AC-001 ~ P0-AC-024`，而是先产出 `P0-AC-001 ~ P0-AC-004` 首页、卡片/列表、搜索、筛选排序前端设计，形成 `62-P0-AC-001-004-app-home-frontend-design.md`，且该设计已由用户确认。Phase 20 已按该确认设计调整 `/apps` 首页，只保留应用中心浏览、卡片/列表、搜索、筛选和排序能力，未带入创建、导入、分类管理、详情生命周期等后续功能实现。

## 已完成任务

1. 完成 P0 文档基线：需求、架构、数据库、API、技术栈、后端服务、前端 Runtime Renderer、页面组件、任务拆解、测试验收、Codex 执行说明。
2. 完成 Phase 0 / Phase 1：Monorepo、`apps/web`、`apps/api`、`packages`、`infra`、`scripts`、`openapi` 初始化。
3. 完成 Phase 2：Mock API、共享类型、样板 RuntimeModel、样板业务记录。
4. 完成 Phase 5 前端基础：登录、工作台、应用中心、运行态首页、运行态列表。
5. 完成 Phase 5 hardening：Maven 安装、项目内 Maven 仓库、前端 smoke test、路由 lazy loading、全量检查通过。
6. 完成 Phase 6：任务中心、待办/已办、审批详情、同意/驳回 Mock 动作、taskVersion 冲突错误码。
7. 完成 Phase 7：发布管理、文件附件、审计日志、安全事件、诊断巡检 Mock 页面。
8. 完成 Phase 8 前置补强：运行态记录详情、新建、编辑、提交审批 Mock 闭环。
9. 完成 Phase 9 后端基础设施骨架：请求上下文、统一响应/异常、Mock 认证、审计/安全事件、幂等服务、Flyway P0 基础迁移文件与后端测试。
10. 完成 Phase 10 数据库接入准备：`db` profile、Flyway PostgreSQL 支持、Testcontainers 迁移测试、最小审计日志 JDBC Repository。
11. 完成 Phase 10 追加验证：Docker Desktop 可访问，Testcontainers PostgreSQL 迁移与 JDBC Repository 测试 0 skipped 通过。
12. 完成 Phase 11 后端 Repository 切换：审计日志、安全事件、幂等服务支持内存/JDBC 可配置 Repository，并通过 Testcontainers 验证。
13. 完成 Phase 12 运行态记录最小后端：创建、查询、列表、版本冲突更新、内存/JDBC Repository 与 Testcontainers 验证。
14. 完成 Phase 13 运行态提交审批最小后端：提交接口、幂等返回、版本冲突、`submitted` 状态更新、流程任务占位、内存/JDBC Repository 与 Testcontainers 验证。
15. 完成 Phase 14 流程任务最小后端：任务列表、任务详情、同意、驳回、taskVersion 冲突、动作幂等、内存/JDBC Repository 与 Testcontainers 验证。
16. 完成 Phase 15 前端界面蓝图：明确已有 Mock 页面、待补设计态页面、运行态升级项、任务中心真实联调路线和 Phase 16 推荐实现范围。
17. 完成 Phase 16 设计态核心界面 Mock：应用概览、数据模型、表单设计、流程设计、权限设计、设计态路由和侧边菜单。
18. 完成 Phase 17A 表单拖拽设计器纵切版：字段物料、拖入画布、跨分区移动、选中配置、删除、复制、上下移动、JSON 预览和 Mock 保存提示。
19. 完成 Phase 17B 前端 P0 文档驱动对齐：建立前端实现必须对照对应 md 的规则，并按 `02-P0-app-center.md` 补强应用中心首页 P0 能力。
20. 完成 Phase 17C 应用详情与生命周期 Mock：按 `02-P0-app-center.md` 补应用详情、资源结构、入口、成员、导入导出、操作日志和生命周期确认入口。
21. 完成 Phase 18 应用中心前端规格梳理：按 `10-P0-requirement-traceability-matrix.md` 为 `P0-AC-001 ~ P0-AC-024` 产出设计、测试、验收基线和偏差清单。
22. 完成 Phase 19 应用中心 P0-AC-001~004 前端设计并经用户确认：按小批次只设计首页、应用展示、搜索、筛选与排序，不展开后续功能点。
23. 完成 Phase 20 应用中心 P0-AC-001~004 首页实现：按确认设计收窄 `/apps` 页面，补卡片/列表切换、筛选摘要、创建时间排序和已停用 Mock 应用。

## 当前检查状态

最近一次 `bash scripts/check.sh` 已通过：

```text
- frontend lint: pass
- frontend typecheck: pass
- frontend build: pass with Vite chunk warning
- backend maven test: pass
```

补充检查：

```text
- pnpm test: pass
```

## 下一步任务

1. 下一批小批次产出 `P0-AC-005 ~ P0-AC-006` 分类管理与移动分类前端设计。
2. 可补 `/apps` 首页自动化测试，覆盖搜索、状态筛选、关系筛选、分类筛选、创建时间排序、卡片/列表切换。
3. 继续保持应用中心实现按 RTM 小批次推进，不一次性展开 `P0-AC-007` 之后能力。
4. 应用中心全部小批次设计确认后，再进入 `P0-OUR-001 ~ P0-OUR-024` 组织用户角色前端设计、测试与验收规格。
5. 可选文档任务：产出 `40A-openapi-spec.yaml`、`81-e2e-test-case-catalog.md`、`82-test-fixture-and-mock-data-design.md`。

## 暂不做

- 不把 Mock 验收宣称为真实联调验收。
- 不为合同、报销、采购创建独立物理业务表。
- 不接入真实第三方登录。
- 不做完整 BPMN、BI、插件市场、SaaS 计费。
- 不绕过 RuntimeModel 写样板应用专属运行态页面。

## 当前风险

- Vite 构建仍有 Ant Design 共享 chunk 大于 500KB 警告。
- Java 25 下后端测试仍会输出 Mockito 动态 agent 提示，测试通过；后续建议统一 JDK 21。
- `packages/*` lint/test 多数仍为 P0 stub。
- Docker/Testcontainers 当前全量检查已识别 Docker Desktop socket 并通过；若后续回到默认受限环境，仍可能需要提升权限访问 Docker socket。
- 审计日志、安全事件、幂等、运行态记录、流程任务占位已支持可配置 Repository；完整流程、文件、权限仍未接入真实持久化。
- 运行态记录 API 暂未接入 runtime pointer，`snapshotId/appVersionId` 仍是 P0 默认值。
- 后端真实权限、文件鉴权、完整流程事务和前后端真实联调尚未实现。
- 当前拖拽设计器仍是前端 Mock 纵切版，未接真实元数据草稿保存、撤销/重做和发布校验。
- 后续前端页面必须逐项对照对应 P0 md 文档，不允许只凭页面感觉补功能。
- 应用中心详情页生命周期、成员维护、导入导出仍为 Mock 入口，未接真实应用中心后端和审计持久化；回收站恢复尚未实现。
- 前端后续推进必须先按 RTM 功能点范围产出设计、测试、验收规格；应用中心当前改为小批次推进，`P0-AC-001 ~ P0-AC-004` 已确认并实现，下一步不得直接跳到全量应用中心。
