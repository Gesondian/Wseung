# Phase 5 Hardening Summary

## 任务范围

- 修复历史环境阻塞：安装 Maven 并复跑后端测试。
- 优化前端路由加载：将页面改为 lazy loading，降低初始包压力。
- 增加前端 smoke test，覆盖未登录访问应用中心时跳转登录页。

## 实现内容

- `apps/web/src/routes/index.tsx` 使用 `React.lazy` + `Suspense` 加载页面。
- `apps/web/vite.config.ts` 增加 Vitest `jsdom` 测试环境。
- 新增 `apps/web/src/test/setup.ts`。
- 新增 `apps/web/src/app/App.test.tsx`。
- 增加测试依赖 `@testing-library/react`、`@testing-library/jest-dom`。
- 已通过 Homebrew 安装 Maven，`mvn -v` 返回 Apache Maven 3.9.15。
- `scripts/check.sh` 后端测试改为使用项目内 Maven 仓库：`mvn -Dmaven.repo.local=../../.m2/repository test`，避免沙箱环境写入用户级 `~/.m2`。
- `.gitignore` 忽略项目内 `.m2/` 依赖缓存目录。
- 新增 `apps/api/src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker`，将测试 mock maker 固定为 `mock-maker-subclass`，降低 Java 25 下 Mockito inline 动态 attach 的不稳定性。

## 修改文件清单

- `.gitignore`
- `scripts/check.sh`
- `apps/web/package.json`
- `apps/web/vite.config.ts`
- `apps/web/src/routes/index.tsx`
- `apps/web/src/styles.css`
- `pnpm-lock.yaml`

## 新增文件清单

- `apps/web/src/test/setup.ts`
- `apps/web/src/app/App.test.tsx`
- `apps/api/src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker`
- `docs/codex/phase-5-hardening-summary.md`

## 执行过的命令与结果

- `mvn -v`：通过，Apache Maven 3.9.15，Java 25.0.2。
- `pnpm install`：通过，安装前端测试依赖与 `jsdom`。
- `pnpm lint`：通过。
- `pnpm typecheck`：通过。
- `pnpm build`：通过，仍有 Vite chunk 大于 500KB 的构建警告。
- `pnpm test`：通过，`apps/web` 1 个 smoke test 通过；多个 package 仍是 P0 stub test。
- `mvn -Dmaven.repo.local=../../.m2/repository test`：通过，`LowcodeApplicationTests` 1 个 Spring Boot context test 通过。
- `bash scripts/check.sh`：通过，串联完成 frontend lint/typecheck/build 与 backend test。

## 后续注意

- 路由已懒加载，但 Ant Design 仍会进入多个页面 chunk，后续可继续配置 manualChunks。
- 当前测试仍是最小 smoke test，后续应覆盖登录成功、应用中心、运行态列表。
- `packages/*` 的 lint/test 多数仍是 P0 stub，需要后续按包补真实规则和测试。
- Maven 历史失败项已关闭；当前 Java 25 下 Mockito 仍会输出动态 agent 相关提示，后续若升级测试策略可再配置显式 javaagent 或统一项目 JDK 到 Java 21。
