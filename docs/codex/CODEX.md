# CODEX.md

本文件是 Codex 在本仓库执行任务时的根入口说明。Codex 在写代码前必须先阅读本文件，然后阅读 `99-codex-execution-guide.md`。

---

## 1. 当前项目

项目：企业级低代码平台 P0 版本  
目标：实现应用创建、数据建模、表单配置、流程审批、权限控制、发布运行、业务数据沉淀、附件鉴权和审计追踪的主闭环。

P0 样板应用：

```text
1. 合同管理 contract_management
2. 费用报销 expense_report
3. 采购申请 purchase_request
```

---

## 2. 必读文档顺序

Codex 必须按以下顺序阅读：

```text
1. CODEX.md
2. 99-codex-execution-guide.md
3. 00-project-context-summary.md
4. 00-project-doc-index.md
5. 00-current-working-plan.md
6. 00-decision-log.md
7. 90-metadata-dsl-guideline.md
8. 20-system-architecture-design.md
9. 30-core-database-design.md
10. 40-api-design.md
11. 45-tech-stack-and-scaffold-decision.md
12. 50-backend-service-design.md
13. 60-frontend-runtime-renderer-design.md
14. 61-frontend-page-and-component-design.md
15. 70-development-task-breakdown.md
16. 80-test-and-acceptance-plan.md
```

实现具体模块时，再阅读对应 P0 模块文档：

```text
02-P0-app-center.md
03-P0-org-user-role.md
04-P0-data-modeling.md
05-P0-form-designer.md
07-P0-workflow-engine.md
08-P0-permission-system.md
09-P0-release-runtime.md
```

---

## 3. 固定技术栈

不得擅自替换技术栈。

前端：

```text
React + TypeScript + Vite + Ant Design
```

后端：

```text
Java + Spring Boot + Maven
```

数据库与基础设施：

```text
PostgreSQL + Flyway + Redis + S3 Compatible 文件存储适配层
```

工程结构：

```text
Monorepo
apps/web
apps/api
packages/shared-types
packages/mock-data
infra/docker-compose
```

---

## 4. 当前优先目标

默认优先目标：按照 `70-development-task-breakdown.md` 分阶段执行。

推荐先做：

```text
Phase 0：文档确认与仓库检查
Phase 1：Monorepo 与工程脚手架
Phase 2：API 类型、Mock API 与样板应用数据
Phase 3：前端基础布局、登录、应用中心
Phase 4：设计态页面
Phase 5：Runtime Renderer
```

如任务要求后端，则按 `50-backend-service-design.md` 和 `70-development-task-breakdown.md` 的后端阶段执行。

---

## 5. 必须遵守的核心规则

```text
1. 不得生成 P0 不做范围能力。
2. 不得为合同、报销、采购生成专属物理业务表。
3. 不得写死三个样板应用的运行态页面。
4. 运行态必须基于 RuntimeModel 渲染。
5. 运行态不得读取 metadata_resource.draft_json。
6. 后端必须执行最终权限校验。
7. 附件下载必须以 lc_file_attachment 为权威鉴权。
8. 发布和回滚必须通过 app_runtime_pointer 切换快照。
9. 业务记录必须绑定 appVersionId 和 snapshotId。
10. 审批动作必须处理 taskVersion。
11. 记录编辑必须处理 recordVersion。
12. 不得删除失败测试或跳过 P0-Must 测试来通过 CI。
```

---

## 6. P0 不做范围

```text
1. 插件市场。
2. 完整 BPMN。
3. 完整 BI。
4. AI 自动生成应用。
5. 完整 SaaS 计费与运营后台。
6. 原生移动 App。
7. 第三方连接器市场。
8. 复杂脚本执行引擎。
```

---

## 7. 每批任务必须输出执行报告

Codex 每次完成任务后必须输出：

```text
任务编号：
任务名称：
读取文档：
修改文件：
新增文件：
实现内容：
未实现内容：
运行命令：
命令结果：
测试结果：
风险与遗留问题：
下一步建议：
```

如果有命令失败，不能声称任务完成。

---

## 8. 检查命令

根据任务范围运行相关命令。

前端：

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run test
```

后端：

```bash
mvn test
mvn package
```

本地环境：

```bash
docker compose up -d
```

若仓库实际脚本不同，先读取 `package.json`、`pom.xml`、`README`、`Makefile`，再使用实际命令。

---

## 9. Mock 与真实联调边界

Mock 验收只证明前端页面、Runtime Renderer、交互状态和样板应用演示路径可用。

真实联调验收必须证明：

```text
1. 真实认证。
2. 真实 metadata_snapshot。
3. 真实 app_runtime_pointer。
4. 真实 business_record。
5. 真实 workflow_task。
6. 真实 file_attachment 鉴权。
7. 真实 audit_log / security_event。
```

不得把 Mock 验收当作真实联调验收。

---

## 10. 不确定点处理

遇到不确定点时：

```text
1. 查本文件。
2. 查 99-codex-execution-guide.md。
3. 查对应设计文档。
4. 选择 P0 保守实现。
5. 在代码中标记 TODO(P0-question)。
6. 在执行报告中说明假设。
```

不得因为不确定而引入 P1/P2 能力或重写技术栈。
