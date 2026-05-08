# 企业级低代码平台 P0

基于最新 P0 文档包初始化的 Monorepo 工程骨架。

## 技术栈

- 前端：React + TypeScript + Vite + Ant Design
- 后端：Java + Spring Boot + Maven
- 数据库：PostgreSQL + Flyway
- 缓存：Redis
- 文件存储：本地文件 + S3 Compatible 适配层

## 目录

- `apps/web`：前端应用骨架
- `apps/api`：后端 Spring Boot 应用骨架
- `packages/shared-types`：共享类型占位
- `packages/api-client`：OpenAPI TypeScript Client 生成占位
- `packages/runtime-contracts`：RuntimeModel 契约占位
- `mocks`：Mock Runtime、样板应用和异常场景占位
- `infra`：本地 PostgreSQL、Redis、对象存储编排占位
- `scripts`：统一开发和检查脚本
- `openapi`：OpenAPI 3.1 契约占位
- `docs`：项目文档和 Codex 执行摘要

## 本地命令

```bash
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

后端：

```bash
cd apps/api
mvn test
```

当前仅完成 Phase 0 / Phase 1 工程骨架，不包含完整业务逻辑。
