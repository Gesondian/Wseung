# CODEX.md

本仓库用于企业级低代码平台 P0 版本工程实现。

Codex 执行任务前必须优先阅读：

1. `CODEX.md`
2. `README-CODEX-RUNBOOK.md`
3. `docs/codex/phase-0-summary.md`

固定技术栈：

- 前端：React + TypeScript + Vite + Ant Design
- 后端：Java + Spring Boot + Maven
- 数据库：PostgreSQL + Flyway
- 缓存：Redis
- 文件存储：本地文件 + S3 Compatible 适配层
- 工程形态：Monorepo

P0 红线：

- 不得更换技术栈。
- 不得为合同、报销、采购创建独立物理业务表。
- 不得把运行态页面写死为样板应用专属页面。
- 不得把 Mock 验收宣称为真实联调验收。
- 不得在 Phase 0 / Phase 1 实现复杂业务逻辑。
