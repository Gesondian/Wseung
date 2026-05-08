---
title: Codex 第一次任务 Prompt
subtitle: 企业级低代码平台 P0｜Phase 0 / Phase 1 工程初始化任务
version: v1.0
date: 2026-05-06
status: 基线版
depends_on:
  - CODEX.md
  - 99-codex-execution-guide.md
  - 70-development-task-breakdown.md
  - 80-test-and-acceptance-plan.md
  - 45-tech-stack-and-scaffold-decision.md
  - 20-system-architecture-design.md
  - 40-api-design.md
  - 50-backend-service-design.md
  - 60-frontend-runtime-renderer-design.md
  - 61-frontend-page-and-component-design.md
  - 90-metadata-dsl-guideline.md
---

# 100-codex-first-task-prompt.md

版本：v1.0  
适用范围：第一次交给 Codex 执行工程生成任务时使用  
目标阶段：Phase 0 / Phase 1  
状态：基线版

---

## 1. 文档目的

本文档用于作为第一次交给 Codex 的任务 Prompt。它不是新的产品需求，也不是新的架构设计，而是对既有文档包的执行入口封装。

Codex 第一次任务只允许完成以下目标：

```text
1. 阅读并理解项目文档基线。
2. 初始化仓库工程结构。
3. 搭建 Monorepo 基础目录。
4. 创建前端 React + TypeScript + Vite + Ant Design 工程骨架。
5. 创建后端 Java + Spring Boot + Maven 工程骨架。
6. 创建 docs、mocks、packages、infra、scripts 等基础目录。
7. 配置基础开发命令、构建命令、lint/typecheck/test 占位命令。
8. 输出执行报告。
```

第一次任务**不得**尝试一次性实现完整低代码平台。

---

## 2. 使用方式

将本文档中的 **第 12 节：可直接复制给 Codex 的 Prompt** 复制给 Codex，并同时上传或提供完整文档包。

推荐输入文件包：

```text
P0-trunk-docs-detailed-v1.2-with-90-20-30-40-45-50-60-61-70-80-99-CODEX-20260506.zip
```

如果已有包含本文档的更新包，则使用最新包。

---

## 3. Codex 第一次任务目标

### 3.1 本次允许完成

```text
1. Phase 0：文档读取与工程边界确认。
2. Phase 1：Monorepo 与基础脚手架初始化。
3. 建立前端工程骨架，但不实现完整页面业务。
4. 建立后端工程骨架，但不实现完整 API 业务。
5. 建立 Mock、OpenAPI、数据库迁移、测试目录占位。
6. 配置本地开发命令和基础质量检查命令。
7. 输出本次执行报告。
```

### 3.2 本次禁止完成

```text
1. 禁止一次性实现全部前端页面。
2. 禁止一次性实现全部后端服务。
3. 禁止生成真实数据库全量 DDL。
4. 禁止生成完整业务流程引擎。
5. 禁止实现插件市场、BI、AI 自动建应用、完整 SaaS 多租户运营后台。
6. 禁止改变 45 文档定义的技术栈。
7. 禁止为合同、报销、采购生成独立业务表。
8. 禁止绕过 90 元数据 DSL、40 API、50 后端服务、60 Runtime Renderer、61 页面组件设计。
```

---

## 4. 必读文档顺序

Codex 必须按以下顺序阅读：

```text
1. CODEX.md
2. 99-codex-execution-guide.md
3. 70-development-task-breakdown.md
4. 45-tech-stack-and-scaffold-decision.md
5. 20-system-architecture-design.md
6. 90-metadata-dsl-guideline.md
7. 40-api-design.md
8. 50-backend-service-design.md
9. 60-frontend-runtime-renderer-design.md
10. 61-frontend-page-and-component-design.md
11. 80-test-and-acceptance-plan.md
```

本次任务不要求完整阅读所有 P0 业务模块文档，但如果创建样板应用 Mock 目录，可参考：

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

## 5. 固定技术栈

Codex 必须遵守 `45-tech-stack-and-scaffold-decision.md`。

### 5.1 前端

```text
React
TypeScript
Vite
Ant Design
React Router
Axios 或统一 fetch client
Mock Service Worker 或等价 Mock Service
```

### 5.2 后端

```text
Java
Spring Boot
Maven
模块化单体
PostgreSQL
Flyway
Redis
S3 Compatible 文件存储适配层
```

### 5.3 工程策略

```text
Monorepo
前后端同仓库
统一 docs 目录
统一 scripts 目录
统一 infra 目录
```

Codex 不得自行替换为 Next.js、Vue、NestJS、Go、Python、MongoDB、Prisma、GraphQL-only 或其他未被文档确认的技术栈。

---

## 6. 本次建议生成的仓库结构

第一次任务建议生成以下结构：

```text
.
├── CODEX.md
├── README.md
├── docs/
│   ├── project/
│   └── codex/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared-types/
│   ├── api-client/
│   └── runtime-contracts/
├── mocks/
│   ├── runtime/
│   ├── sample-apps/
│   └── scenarios/
├── infra/
│   ├── docker-compose.yml
│   └── README.md
├── scripts/
│   ├── check.sh
│   └── dev.sh
├── openapi/
│   └── README.md
└── README-CODEX-RUNBOOK.md
```

说明：

```text
1. apps/web 是前端工程。
2. apps/api 是后端工程。
3. packages/shared-types 用于共享类型占位。
4. packages/api-client 用于后续 OpenAPI Client 生成占位。
5. packages/runtime-contracts 用于 RuntimeModel 类型契约占位。
6. mocks 用于后续 Mock API、样板应用和异常场景。
7. infra 用于本地 PostgreSQL、Redis、对象存储等基础设施配置。
8. scripts 用于统一启动和检查命令。
```

如果当前仓库已经有部分结构，Codex 必须优先复用，不得无故重建或删除已有文件。

---

## 7. Phase 0 任务要求

### 7.1 目标

完成文档读取、边界确认和工程初始化计划。

### 7.2 产出

```text
1. README.md 中写明项目名称、目标、技术栈、启动方式占位。
2. README-CODEX-RUNBOOK.md 中写明 Codex 后续执行方式。
3. docs/codex/phase-0-summary.md，记录已阅读文档、确认技术栈、确认本次范围。
```

### 7.3 验收标准

```text
1. 明确列出已阅读文档。
2. 明确声明本次只做 Phase 0 / Phase 1。
3. 明确声明不实现完整业务逻辑。
4. 明确声明技术栈不变。
```

---

## 8. Phase 1 任务要求

### 8.1 前端工程骨架

在 `apps/web` 下创建前端工程骨架。

建议结构：

```text
apps/web/
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── app/
│   │   └── App.tsx
│   ├── routes/
│   │   └── index.tsx
│   ├── layouts/
│   ├── pages/
│   ├── runtime/
│   ├── designers/
│   ├── services/
│   ├── mocks/
│   ├── stores/
│   ├── types/
│   └── utils/
└── README.md
```

第一次任务只需要做到：

```text
1. 前端工程可以启动。
2. 首页显示项目名称和工程初始化成功状态。
3. 预留路由目录，不要求实现全部页面。
4. 预留 runtime、designers、services、mocks 目录。
5. 不要硬编码合同、报销、采购完整业务页面。
```

### 8.2 后端工程骨架

在 `apps/api` 下创建后端 Spring Boot 工程骨架。

建议结构：

```text
apps/api/
├── pom.xml
├── src/main/java/
│   └── com/example/lowcode/
│       ├── LowcodeApplication.java
│       ├── auth/
│       ├── app/
│       ├── org/
│       ├── metadata/
│       ├── permission/
│       ├── release/
│       ├── runtime/
│       ├── record/
│       ├── workflow/
│       ├── file/
│       ├── audit/
│       ├── recycle/
│       ├── diagnostics/
│       └── common/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── README.md
```

第一次任务只需要做到：

```text
1. Spring Boot 应用骨架可编译。
2. 可以提供一个健康检查接口占位，例如 GET /api/v1/health。
3. 模块包结构与 50 文档保持一致。
4. 不实现完整业务 API。
5. 不生成完整数据库表。
```

### 8.3 Mock 与样板应用目录

创建目录占位：

```text
mocks/
├── runtime/
├── sample-apps/
│   ├── contract-management/
│   ├── expense-report/
│   └── purchase-request/
└── scenarios/
```

第一次任务只需要创建 README 或占位 JSON，不需要填满全部 RuntimeModel。

### 8.4 基础脚本

创建统一脚本：

```text
scripts/check.sh
scripts/dev.sh
```

建议行为：

```text
1. check.sh 尝试执行前端 build/lint/typecheck 与后端 test/package 的可用命令。
2. dev.sh 提示如何启动前端、后端和 infra。
3. 如果某些命令暂未配置，必须在脚本输出中明确 TODO，不得静默成功伪造结果。
```

---

## 9. 检查命令要求

Codex 完成本次任务后，必须尽量运行以下命令，视实际包管理器和工程结构调整：

```bash
# 仓库根目录
find . -maxdepth 3 -type f | sort | head -200

# 前端
cd apps/web
npm install
npm run build

# 后端
cd ../api
mvn test
```

如果本次尚未配置 lint/typecheck/test，可以在执行报告中说明：

```text
1. 哪些命令已配置并通过。
2. 哪些命令尚未配置。
3. 下一批任务应补齐哪些命令。
```

不允许声称通过了未实际运行的命令。

---

## 10. 本次 Definition of Done

本次任务完成必须满足：

```text
1. 仓库根目录存在 CODEX.md。
2. 仓库根目录存在 README.md。
3. apps/web 前端工程骨架存在。
4. apps/api 后端工程骨架存在。
5. docs、mocks、packages、infra、scripts、openapi 目录存在。
6. 前端至少可以执行 install 和 build，或明确说明失败原因。
7. 后端至少可以执行 mvn test 或 mvn package，或明确说明失败原因。
8. 没有擅自改变技术栈。
9. 没有实现 P1/P2 范围。
10. 没有生成合同、报销、采购独立业务表。
11. 输出执行报告。
```

---

## 11. 执行报告格式

Codex 完成后必须输出：

```text
## 本次执行范围
- Phase:
- 任务：

## 已阅读文档
- CODEX.md
- 99-codex-execution-guide.md
- 70-development-task-breakdown.md
- 45-tech-stack-and-scaffold-decision.md
- 其他：

## 已创建/修改文件
- 路径：说明

## 已运行命令
- 命令：结果

## 未完成事项
- 事项：原因 / 下一步建议

## 风险与注意事项
- 风险：说明

## 下一批建议任务
- Phase 2 / Phase 3 中建议优先执行的任务
```

---

## 12. 可直接复制给 Codex 的 Prompt

以下内容可直接复制给 Codex 使用。

```text
你将基于我提供的低代码平台 P0 文档包初始化工程。请严格遵守文档，不要自由发挥技术栈或范围。

当前目标：只执行 Phase 0 / Phase 1。

本次任务范围：
1. 先阅读 CODEX.md。
2. 按顺序阅读：
   - 99-codex-execution-guide.md
   - 70-development-task-breakdown.md
   - 45-tech-stack-and-scaffold-decision.md
   - 20-system-architecture-design.md
   - 90-metadata-dsl-guideline.md
   - 40-api-design.md
   - 50-backend-service-design.md
   - 60-frontend-runtime-renderer-design.md
   - 61-frontend-page-and-component-design.md
   - 80-test-and-acceptance-plan.md
3. 初始化 Monorepo 工程结构。
4. 创建 apps/web 前端工程骨架。
5. 创建 apps/api 后端工程骨架。
6. 创建 docs、mocks、packages、infra、scripts、openapi 目录。
7. 配置基础 README、运行说明、检查脚本。
8. 完成后运行可用的检查命令，并输出执行报告。

固定技术栈：
- 前端：React + TypeScript + Vite + Ant Design。
- 后端：Java + Spring Boot + Maven。
- 数据库：PostgreSQL。
- 数据库迁移：Flyway。
- 缓存：Redis。
- 文件存储：本地文件 + S3 Compatible 适配层。
- 工程结构：Monorepo。

本次必须生成或确认的目录：
- apps/web
- apps/api
- packages/shared-types
- packages/api-client
- packages/runtime-contracts
- mocks/runtime
- mocks/sample-apps
- mocks/scenarios
- infra
- scripts
- openapi
- docs/codex

前端本次只需要工程骨架：
- 能启动或至少能 build。
- 建立 src/app、src/routes、src/layouts、src/pages、src/runtime、src/designers、src/services、src/mocks、src/stores、src/types、src/utils。
- 不要一次性实现全部页面。
- 不要硬编码完整合同、报销、采购业务页面。

后端本次只需要工程骨架：
- 创建 Spring Boot 应用。
- 按 50-backend-service-design.md 预留 auth、app、org、metadata、permission、release、runtime、record、workflow、file、audit、recycle、diagnostics、common 等模块包。
- 可提供 GET /api/v1/health 占位接口。
- 不要实现完整业务 API。
- 不要生成完整数据库 DDL。

严格禁止：
1. 不得更换技术栈。
2. 不得使用 Next.js、Vue、NestJS、Go、Python、MongoDB 或 GraphQL-only 替换既定方案。
3. 不得为 contract、expense_report、purchase_request 生成独立业务表。
4. 不得实现插件市场、BI、AI 自动建应用、完整 SaaS 运营后台。
5. 不得让运行态读取草稿元数据。
6. 不得把权限只做成前端菜单隐藏。
7. 不得把 Mock 验收说成真实联调验收。
8. 不得声称运行了未实际运行的命令。

完成后请输出执行报告，格式如下：

## 本次执行范围
- Phase:
- 任务：

## 已阅读文档
- 列出已阅读的文档

## 已创建/修改文件
- 路径：说明

## 已运行命令
- 命令：结果

## 未完成事项
- 事项：原因 / 下一步建议

## 风险与注意事项
- 风险：说明

## 下一批建议任务
- 建议下一步进入 Phase 2 / Phase 3 的哪些任务

本次完成定义：
1. 仓库根目录存在 CODEX.md 和 README.md。
2. apps/web 前端工程骨架存在。
3. apps/api 后端工程骨架存在。
4. docs、mocks、packages、infra、scripts、openapi 目录存在。
5. 前端 install/build 尽量通过；如失败，说明原因。
6. 后端 mvn test 或 mvn package 尽量通过；如失败，说明原因。
7. 不实现超出 Phase 0 / Phase 1 的复杂业务逻辑。
```

---

## 13. 下一批任务建议

第一次任务完成后，下一批建议进入：

```text
Phase 2：OpenAPI / Mock / 样板应用基础数据
Phase 3：前端基础布局、登录页、应用中心、路由骨架
```

不建议第二批立即实现完整后端业务服务。推荐先确保前端 Mock 演示链路和工程质量门禁稳定。

---

## 14. 附录：第一次任务红线

```text
1. 第一次任务不是完整平台开发。
2. 第一次任务不是完整 UI 开发。
3. 第一次任务不是完整后端开发。
4. 第一次任务不是完整数据库设计生成。
5. 第一次任务只负责工程地基。
6. 第一次任务必须可检查、可回滚、可继续迭代。
7. 第一次任务必须保留文档驱动开发方式。
```
