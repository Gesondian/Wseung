---
title: 前端运行态渲染器设计
subtitle: 企业级低代码平台 v1.1｜P0 前端运行态渲染器增强设计
version: v1.1
date: 2026-05-06
status: 增强基线版
depends_on:
  - 00-project-context-summary.md
  - 00-project-doc-index.md
  - 00-current-working-plan.md
  - 00-decision-log.md
  - 20-system-architecture-design.md
  - 30-core-database-design.md
  - 40-api-design.md
  - 45-tech-stack-and-scaffold-decision.md
  - 61-frontend-page-and-component-design.md
  - 90-metadata-dsl-guideline.md
  - 02-P0-app-center.md
  - 03-P0-org-user-role.md
  - 04-P0-data-modeling.md
  - 05-P0-form-designer.md
  - 07-P0-workflow-engine.md
  - 08-P0-permission-system.md
  - 09-P0-release-runtime.md
---

# 60-frontend-runtime-renderer-design.md

版本：v1.1  
适用范围：P0 低代码平台前端运行态模型加载、版本兼容、Adapter、组件注册表、字段/表单/列表/详情/审批渲染、Mock Runtime、Codex 前端实现  
最后更新：2026-05-06  
状态：增强基线版

---

## 0. v1.1 增强说明

本版本在 v1.0 基线版上增强，目标是让 Codex 能够**直接实现低代码运行态渲染器**，而不是凭经验生成普通 CRUD 页面。

### 0.1 本次增强重点

```text
1. 增加 RuntimeModel 版本兼容策略。
2. 增加 RuntimeModel Adapter 输入输出契约。
3. 增加组件注册表初始化流程。
4. 增加字段组件错误边界。
5. 增加表单 dirty state 和离开确认。
6. 增加 recordVersion / taskVersion 处理规则。
7. 增加 lookup 弹窗列表 API 参数。
8. 增加 subtable 行级校验规则。
9. 增加 Mock Runtime API 路由清单。
10. 增加 Runtime Renderer Definition of Done。
11. 增加 Runtime Renderer 状态机。
12. 增加 Runtime Action Dispatcher。
13. 增加 RuntimeModel 缓存策略。
14. 增加字段组件统一 Props 契约。
15. 增加 Runtime 测试夹具。
```

### 0.2 本文档与 61 文档的分工

| 文档 | 职责 | 不负责 |
|---|---|---|
| `60-frontend-runtime-renderer-design.md` | 定义运行态渲染器、RuntimeModel、Adapter、字段组件、表单/列表/详情/审批渲染、Mock Runtime API 与渲染器验收。 | 不定义所有产品页面布局和设计态页面组件。 |
| `61-frontend-page-and-component-design.md` | 定义前端页面、路由、布局、页面级 API、设计器组件拆解、Mock 场景和前端完成定义。 | 不重复定义 Runtime Renderer 内部机制。 |

---

## 1. 文档目的

本文档定义低代码平台 P0 阶段的前端运行态渲染器设计，承接 `90-metadata-dsl-guideline.md`、`20-system-architecture-design.md`、`40-api-design.md` 与 `45-tech-stack-and-scaffold-decision.md`。

它用于指导 Codex 或开发人员实现运行端页面时，如何从后端运行态 API 获取已发布元数据快照、如何转换为前端运行时模型、如何执行前端级权限表现、如何渲染列表/表单/详情/流程动作，以及如何与后端权限校验、字段裁剪、流程版本锁定保持一致。

本文档是 Codex 实现以下代码的直接输入：

```text
apps/web/src/runtime/
apps/web/src/mocks/runtime/
apps/web/src/services/runtime*
apps/web/src/types/runtime*
apps/web/src/pages/runtime/*
```

---

## 2. Runtime Renderer 设计目标

| 目标 | 说明 |
|---|---|
| 元数据驱动 | 运行端页面必须由已发布 Metadata Snapshot / RuntimeModel 驱动，不写死合同、报销、采购等对象页面。 |
| 快照隔离 | 运行态只使用当前 `runtime pointer` 指向的 `snapshotId`，不得读取设计态草稿。 |
| 版本兼容 | RuntimeModel 必须有版本兼容与 Adapter 迁移机制，避免后端模型小版本升级导致前端崩溃。 |
| 统一渲染 | 列表、表单、详情、审批动作使用统一运行时模型与组件注册机制。 |
| 权限一致 | 前端根据后端返回的有效权限做展示裁剪，但不得替代后端权限校验。 |
| 错误隔离 | 单个字段、组件或区块渲染失败不得导致整个运行态页面白屏。 |
| 可 Mock | 支持基于合同、报销、采购样板应用元数据和 Mock API 独立运行前端原型。 |
| 可验收 | 通过 Definition of Done 明确 Codex 生成 Runtime Renderer 的完成标准。 |

---

## 3. Runtime Renderer 设计原则

```text
1. 运行态模型来自 /api/v1/runtime/apps/{appId}/model 或同等运行态接口。
2. 前端不得直接读取、解析或修改设计态 draft_json。
3. 前端隐藏、禁用、只读只是用户体验，后端仍必须做最终鉴权和字段校验。
4. Runtime Renderer 不得为 contract、expense_report、purchase_request 写专属页面。
5. 字段组件必须通过 field.type / component.type 映射，不能硬编码字段名。
6. RuntimeModel 必须经过 Adapter 归一化后才能进入渲染器。
7. 所有运行态动作必须经过 Runtime Action Dispatcher 或同等统一动作层。
8. 表单提交必须携带 appId、entityKey、snapshotId、recordVersion 或 idempotencyKey 等必要上下文。
9. 审批动作必须基于 workflowTaskId 和 taskVersion，不能只基于 recordId 推进流程。
10. 附件预览和下载必须调用文件 API，不得拼接 storagePath。
11. Codex 必须优先实现通用 Runtime Renderer，再挂接样板应用 Mock 数据。
```

---

## 4. P0 Runtime Renderer 范围

| 能力 | P0 范围 |
|---|---|
| 运行态模型加载 | 加载当前应用运行态模型、当前用户权限、菜单、实体、表单、视图、流程动作。 |
| RuntimeModel Adapter | 校验、补齐默认值、兼容旧字段、转换权限表现。 |
| 组件注册表 | 注册字段组件、容器组件、动作组件、fallback 组件。 |
| 运行态列表 | 基于 view DSL 渲染表格、筛选、排序、分页、操作按钮。 |
| 运行态表单 | 基于 form DSL 渲染新增、编辑、提交、审批节点表单。 |
| 运行态详情 | 基于 form/view DSL 渲染只读详情、流程轨迹、附件。 |
| 字段组件 | 文本、数字、金额、日期、枚举、人员、部门、附件、子表、lookup 等 P0 字段。 |
| 权限表现 | 菜单、按钮、字段可见性、只读性、必填性、数据动作可用性。 |
| 流程动作 | 提交、审批、驳回、撤回、作废、评论/附件意见的基础动作。 |
| 版本冲突处理 | recordVersion / taskVersion 冲突提示与刷新策略。 |
| Mock Runtime | 使用 Mock API 支撑前端无后端演示。 |

---

## 5. P0 Runtime Renderer 不做范围

```text
1. 不实现自定义脚本执行沙箱。
2. 不实现第三方组件插件市场。
3. 不实现完整移动端原生渲染器。
4. 不在前端做最终数据权限判定。
5. 不绕过 RuntimeModel 直接读取数据库字段定义。
6. 不为三个样板应用写固定专属运行态页面。
7. 不实现完整 BPMN 图形运行器。
8. 不实现离线缓存与离线提交。
```

---

## 6. RuntimeModel 总体结构

RuntimeModel 是前端运行态渲染的唯一模型输入，应由后端基于当前 `app_runtime_pointer`、`metadata_snapshot`、当前用户权限和运行态上下文生成。

### 6.1 推荐 TypeScript 结构

```ts
export type RuntimeModel = {
  runtimeModelVersion: string;
  tenantId: string;
  appId: string;
  appKey: string;
  appVersionId: string;
  snapshotId: string;
  currentUser: RuntimeUser;
  menus: RuntimeMenu[];
  entities: RuntimeEntity[];
  forms: RuntimeForm[];
  views: RuntimeView[];
  workflows: RuntimeWorkflow[];
  permissions: RuntimePermissionSummary;
  actions: RuntimeActionDef[];
  dictionaries?: RuntimeDictionary[];
  ui?: RuntimeUiConfig;
};
```

### 6.2 关键字段规则

| 字段 | 规则 |
|---|---|
| `runtimeModelVersion` | 必填，用于前端兼容判断。 |
| `appVersionId` | 必填，运行态版本上下文。 |
| `snapshotId` | 必填，运行态快照上下文。 |
| `entities` | 不得包含设计态未发布对象。 |
| `forms` | 只包含当前用户可访问或运行所需表单。 |
| `views` | 只包含当前用户可访问或运行所需视图。 |
| `permissions` | 是前端表现权限，不是最终权限判定。 |

---

## 7. RuntimeModel 版本兼容策略

### 7.1 版本声明

```text
1. RuntimeModel 必须包含 runtimeModelVersion。
2. 前端 Runtime Renderer 必须声明 supportedRuntimeModelVersions。
3. 前端不得在没有版本判断的情况下直接渲染 raw model。
4. 不支持的版本必须进入 UnsupportedRuntimeModel 状态。
```

### 7.2 P0 版本兼容表

| RuntimeModel 版本 | 前端支持策略 | 处理方式 |
|---|---|---|
| `1.0.x` | 支持 | 正常渲染。 |
| `1.1.x` | 兼容 | Adapter 补齐默认值或做字段别名转换。 |
| `1.x` 未知小版本 | 尝试兼容 | 输出 warning，缺失关键字段时降级为错误页。 |
| `2.x` | 不支持 | 显示 UnsupportedRuntimeModel 页面。 |

### 7.3 兼容原则

```text
1. 小版本新增字段必须向后兼容。
2. 字段缺失时由 Adapter 补默认值，不得散落到业务组件中判断。
3. 字段语义变化必须通过 Adapter 迁移，不得在字段组件内临时兼容。
4. 版本不兼容时前端必须显示明确错误信息，包括 appId、snapshotId、runtimeModelVersion。
5. Codex 不得在页面组件中直接写 if runtimeModelVersion 逻辑，版本兼容集中在 Adapter 层。
```

---

## 8. RuntimeModel Adapter 输入输出

RuntimeModel Adapter 是 raw API 响应进入渲染器前的唯一归一化入口。

### 8.1 输入输出契约

```ts
export type RuntimeModelAdapterInput = {
  rawModel: unknown;
  currentUser: RuntimeUser;
  device: "desktop" | "mobile";
  locale?: string;
};

export type RuntimeModelAdapterOutput = {
  model?: RuntimeModel;
  warnings: RuntimeModelWarning[];
  unsupportedFeatures: UnsupportedFeature[];
  errors: RuntimeModelError[];
};

export type RuntimeModelWarning = {
  code: string;
  message: string;
  path?: string;
};

export type UnsupportedFeature = {
  featureType: string;
  featureKey?: string;
  fallback: "hide" | "readonly" | "unsupported_component" | "block_page";
};
```

### 8.2 Adapter 负责事项

```text
1. 校验 rawModel 是否包含 appId、snapshotId、runtimeModelVersion 等关键字段。
2. 判断 runtimeModelVersion 是否可支持。
3. 补齐 ui、actions、permissions、dictionaries 等可选字段默认值。
4. 兼容旧字段命名和小版本字段差异。
5. 将后端权限结果转换为前端字段状态：visible、readonly、required、disabled。
6. 归一化 form / view / workflow / action 配置。
7. 收集 warnings 和 unsupportedFeatures。
```

### 8.3 Adapter 不负责事项

```text
1. 不负责最终权限判定。
2. 不负责调用保存、审批、发布等 API。
3. 不负责执行业务公式或任意脚本。
4. 不负责修改 rawModel。
5. 不负责展示 UI 弹窗；只输出结构化错误和警告。
```

---

## 9. Runtime Renderer 状态机

运行态页面应使用统一状态机，避免页面各自写散乱的 loading / error 状态。

```text
idle
loading_model
model_loaded
loading_record
ready
submitting
submit_success
submit_failed
permission_denied
version_conflict
unsupported_model
render_error
not_found
```

### 9.1 状态说明

| 状态 | 含义 | 页面表现 |
|---|---|---|
| `loading_model` | 正在加载 RuntimeModel。 | 全页骨架屏。 |
| `unsupported_model` | RuntimeModel 版本不支持。 | 不支持页面，显示版本信息。 |
| `loading_record` | 正在加载业务记录。 | 表单/详情骨架屏。 |
| `ready` | 可交互。 | 正常渲染。 |
| `submitting` | 正在保存、提交或审批。 | 按钮 loading，禁止重复提交。 |
| `version_conflict` | 乐观锁冲突。 | 冲突提示和刷新入口。 |
| `permission_denied` | 无权限访问。 | 权限拒绝页。 |
| `render_error` | 渲染异常。 | 错误边界页或区块错误。 |

---

## 10. Component Registry 初始化流程

### 10.1 注册表职责

组件注册表负责根据 RuntimeModel 中的组件类型查找实际 React 组件。

```text
field.type -> Field Component
container.type -> Container Component
action.type -> Action Component
view.type -> View Component
```

### 10.2 初始化顺序

```text
1. 初始化 Registry 实例。
2. 注册基础字段组件。
3. 注册容器组件。
4. 注册动作组件。
5. 注册运行态列表/表单/详情/审批组件。
6. 注册 fallback 组件。
7. 注册 Error Boundary 包装器。
8. 冻结 registry，运行时不得随意覆盖核心组件。
```

### 10.3 推荐目录

```text
apps/web/src/runtime/registry/
  componentRegistry.ts
  registerBuiltinFields.ts
  registerBuiltinContainers.ts
  registerBuiltinActions.ts
  fallbackComponents.ts
```

### 10.4 P0 内置字段组件

| field.type | 组件 | 说明 |
|---|---|---|
| `text` | TextField | 单行文本。 |
| `textarea` | TextareaField | 多行文本。 |
| `number` | NumberField | 数字。 |
| `money` | MoneyField | 金额。 |
| `date` | DateField | 日期。 |
| `datetime` | DateTimeField | 日期时间。 |
| `select` | SelectField | 单选枚举。 |
| `multiSelect` | MultiSelectField | 多选枚举。 |
| `user` | UserPickerField | 人员选择。 |
| `orgUnit` | OrgUnitPickerField | 部门选择。 |
| `lookup` | LookupField | 业务记录引用。 |
| `attachment` | AttachmentField | 附件。 |
| `subtable` | SubtableField | 子表。 |

---

## 11. 字段组件统一 Props 契约

字段组件必须遵守统一 Props，不得各自设计一套不同接口。

```ts
export type RuntimeFieldProps<TValue = unknown> = {
  field: RuntimeField;
  value: TValue;
  readonly: boolean;
  disabled: boolean;
  required: boolean;
  visible: boolean;
  error?: RuntimeFieldError;
  recordContext: RuntimeRecordContext;
  onChange: (value: TValue) => void;
  onBlur?: () => void;
};

export type RuntimeRecordContext = {
  tenantId: string;
  appId: string;
  appVersionId: string;
  snapshotId: string;
  entityKey: string;
  recordId?: string;
  recordVersion?: number;
  mode: "create" | "edit" | "detail" | "approve";
};
```

### 11.1 字段组件规则

```text
1. visible = false 的字段不渲染。
2. readonly = true 的字段不得触发 onChange。
3. disabled = true 的字段显示但不可操作。
4. required = true 只控制前端提示，后端仍必须校验。
5. 字段组件不得直接调用业务记录保存 API。
6. 字段组件不得自行读取全局 RuntimeModel。
```

---

## 12. 字段组件错误边界

### 12.1 错误边界目标

```text
1. 单个字段组件渲染失败不得导致整个表单白屏。
2. 单个子表行渲染失败不得导致整个运行态页面白屏。
3. 错误必须被记录，且用户看到可理解的降级 UI。
```

### 12.2 推荐层级

```text
RuntimeFormRenderer
  FormErrorBoundary
    RuntimeFieldRenderer
      FieldErrorBoundary
        ActualFieldComponent
```

### 12.3 错误类型

| 错误 | 说明 | 前端表现 |
|---|---|---|
| `FIELD_COMPONENT_NOT_FOUND` | 字段类型没有注册组件。 | UnsupportedField。 |
| `FIELD_RENDER_ERROR` | 字段组件渲染异常。 | FieldRenderError。 |
| `FORM_RENDER_ERROR` | 表单级异常。 | FormRenderError。 |
| `UNSUPPORTED_RUNTIME_MODEL` | 模型版本不支持。 | UnsupportedRuntimeModel 页面。 |

### 12.4 记录要求

```text
1. 开发环境可显示简化 stack。
2. 生产环境不得暴露完整 stack。
3. 错误上下文至少包含 appId、snapshotId、entityKey、fieldKey、componentType。
4. 可先写入前端日志；接入后端后应调用 runtime error log API。
```

---

## 13. 表单渲染机制

### 13.1 表单渲染输入

```ts
export type RuntimeFormRenderInput = {
  model: RuntimeModel;
  formKey: string;
  entityKey: string;
  mode: "create" | "edit" | "detail" | "approve";
  initialValues: Record<string, unknown>;
  recordVersion?: number;
  taskVersion?: number;
};
```

### 13.2 渲染步骤

```text
1. 根据 entityKey + formKey 查找 RuntimeForm。
2. 根据权限结果过滤不可见字段和动作。
3. 根据 mode 计算字段 readonly / disabled / required。
4. 根据 form layout 递归渲染容器和字段。
5. 初始化表单状态、校验规则、dirty state。
6. 用户提交时通过 Runtime Action Dispatcher 执行动作。
```

---

## 14. 表单 Dirty State 与离开确认

### 14.1 Dirty State 规则

```text
1. 表单加载完成后，将后端返回值设置为 initialValues。
2. 用户编辑后，与 initialValues 做结构化比较，生成 dirty = true。
3. 保存成功、提交成功、审批成功后重置 dirty = false。
4. 只读字段变化不应触发 dirty。
5. 系统自动编号预览不应触发 dirty，最终编号以后端返回为准。
6. 上传附件未保存前应视为 dirty。
7. 子表新增、删除、排序、编辑均应触发 dirty。
```

### 14.2 离开确认场景

| 场景 | dirty = true 时处理 |
|---|---|
| 路由跳转 | 弹出确认。 |
| 浏览器刷新 | 使用 beforeunload 提示。 |
| 抽屉关闭 | 弹出确认。 |
| 弹窗关闭 | 弹出确认。 |
| 取消编辑 | 弹出确认或明确放弃。 |
| 审批提交中 | 禁止离开或提示正在提交。 |

---

## 15. 列表渲染机制

### 15.1 列表渲染输入

```ts
export type RuntimeListRenderInput = {
  model: RuntimeModel;
  entityKey: string;
  viewKey: string;
  query: RuntimeListQuery;
};
```

### 15.2 列表行为

```text
1. 根据 view DSL 渲染列、筛选项、排序、批量动作。
2. 列字段必须经过字段可见权限裁剪。
3. 行动作必须根据对象权限和记录级权限表现启用或禁用。
4. 查询必须走运行态列表 API，不得直接过滤本地全量数据。
5. 列表返回数据仍需要前端按 permissions 做表现裁剪，但最终数据裁剪以后端为准。
```

---

## 16. 详情渲染机制

详情页应复用表单只读渲染能力，并补充：

```text
1. 记录基础信息。
2. 流程状态。
3. 流程轨迹。
4. 附件列表。
5. 可用动作按钮。
6. 审计或变更摘要入口。
```

---

## 17. 审批详情渲染机制

审批详情页由以下区域组成：

```text
1. 业务记录详情区。
2. 当前任务处理区。
3. 节点字段权限渲染区。
4. 审批意见输入区。
5. 审批附件区。
6. 流程轨迹区。
```

审批动作必须携带：

```text
taskId
taskVersion
workflowInstanceId
recordId
recordVersion
snapshotId
actionType
opinion
idempotencyKey
```

---

## 18. recordVersion / taskVersion 处理规则

### 18.1 recordVersion

```text
1. 业务记录编辑、保存、提交必须携带 recordVersion。
2. 后端返回 VERSION_CONFLICT_RECORD 时，前端显示“记录已被他人修改”。
3. 用户可以选择刷新、放弃本地修改，或复制本地内容后重新编辑。
4. 保存成功后以前端收到的最新 recordVersion 更新表单上下文。
```

### 18.2 taskVersion

```text
1. 审批同意、驳回、转交、撤回必须携带 taskVersion。
2. 后端返回 VERSION_CONFLICT_TASK 或 TASK_ALREADY_COMPLETED 时，前端显示“任务状态已变化”。
3. 前端应重新拉取任务详情和流程轨迹。
4. 已完成任务不得继续显示可操作审批按钮。
```

### 18.3 推荐错误码

```text
VERSION_CONFLICT_RECORD
VERSION_CONFLICT_TASK
TASK_ALREADY_COMPLETED
RUNTIME_MODEL_CHANGED
FIELD_PERMISSION_DENIED
```

---

## 19. Lookup 弹窗列表 API 参数

### 19.1 Lookup 查询参数

```ts
export type LookupQueryParams = {
  appId: string;
  entityKey: string;
  fieldKey: string;
  keyword?: string;
  pageNo: number;
  pageSize: number;
  filters?: RuntimeFilter[];
  selectedIds?: string[];
  snapshotId?: string;
};
```

### 19.2 推荐 API

```text
GET /api/v1/runtime/apps/{appId}/entities/{entityKey}/lookup
```

### 19.3 Lookup 返回结构

```ts
export type LookupOption = {
  recordId: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  disabledReason?: string;
  raw?: Record<string, unknown>;
};
```

### 19.4 Lookup 规则

```text
1. lookup 列表必须经过后端权限过滤。
2. 前端不得直接查询全部业务记录后本地过滤。
3. 已选择项回显要支持批量加载。
4. lookup 弹窗支持搜索、分页、单选、多选。
5. 不可选项可以展示，但必须 disabled 并展示原因。
6. lookup 保存值应包含 recordId，展示值由运行态模型或回显接口提供。
```

---

## 20. Subtable 行级校验规则

### 20.1 数据结构

```ts
export type RuntimeSubtableRow = {
  rowId: string;
  rowStatus: "new" | "normal" | "modified" | "deleted";
  values: Record<string, unknown>;
  errors?: RuntimeFieldError[];
};
```

### 20.2 校验类型

| 校验类型 | 说明 |
|---|---|
| `cell_validation` | 单元格字段必填、类型、格式校验。 |
| `row_validation` | 当前行内多个字段组合校验。 |
| `table_validation` | 最小行数、最大行数、合计金额等表级校验。 |
| `cross_row_validation` | 跨行重复、合计、唯一等校验。 |

### 20.3 P0 规则

```text
1. subtable 每行必须有前端临时 rowId。
2. 新增行、删除行、复制行、排序行必须可追踪。
3. 行内字段校验失败只标记当前行。
4. 表格级校验失败显示在 subtable 顶部。
5. 提交时必须把 subtable 转换为 data_json 中的数组结构。
6. 删除行可在前端标记 rowStatus = deleted，提交时由后端解释。
7. 后端仍然必须重新校验 subtable。
```

---

## 21. 附件字段渲染规则

```text
1. 附件字段只展示文件名、大小、上传人、上传时间、预览/下载动作。
2. 前端不得展示 storagePath。
3. 上传完成后拿到 fileId，并通过业务记录保存或流程意见保存建立绑定。
4. 下载/预览必须调用文件 API 获取授权地址或流。
5. 无权限下载时显示权限拒绝，并可触发安全事件 Mock。
```

---

## 22. Runtime Action Dispatcher

运行态按钮和动作不得直接散落调用 API，应进入统一 Dispatcher。

### 22.1 动作类型

```text
saveDraft
submit
approve
reject
withdraw
void
uploadFile
downloadFile
openLookup
refreshRecord
refreshRuntimeModel
```

### 22.2 Dispatcher 输入

```ts
export type RuntimeActionDispatchInput = {
  actionType: RuntimeActionType;
  context: RuntimeRecordContext;
  payload?: Record<string, unknown>;
  idempotencyKey?: string;
};
```

### 22.3 规则

```text
1. Dispatcher 负责补齐 appId、snapshotId、recordVersion、taskVersion 等上下文。
2. Dispatcher 负责统一处理 loading、success、error、version conflict。
3. Dispatcher 不负责最终权限判断。
4. Dispatcher 不得绕过 API Client。
```

---

## 23. RuntimeModel 缓存策略

### 23.1 缓存 Key

```text
runtimeModelCacheKey = tenantId + appId + snapshotId + runtimeModelVersion + userId
```

### 23.2 缓存方式

```text
1. P0 前端优先使用内存缓存。
2. 不要求 IndexedDB 离线缓存。
3. 当前用户刷新页面后可以重新拉取。
4. 同一 appId + snapshotId 下可复用模型。
```

### 23.3 失效条件

```text
1. 用户退出登录。
2. 切换租户或用户。
3. 发布成功。
4. 回滚成功。
5. 权限变更。
6. 用户角色变更。
7. 后端返回 RUNTIME_MODEL_CHANGED。
```

---

## 24. Mock Runtime API 路由清单

Codex 生成前端原型时，必须至少提供以下 Mock Runtime API。

| 方法 | 路由 | 说明 |
|---|---|---|
| GET | `/api/v1/runtime/apps/:appId/model` | 加载运行态模型。 |
| GET | `/api/v1/runtime/apps/:appId/entities/:entityKey/views/:viewKey/records` | 查询运行态列表。 |
| GET | `/api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId` | 查询记录详情。 |
| POST | `/api/v1/runtime/apps/:appId/entities/:entityKey/records` | 新建记录。 |
| PUT | `/api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId` | 编辑记录。 |
| POST | `/api/v1/runtime/apps/:appId/entities/:entityKey/records/:recordId/submit` | 提交审批。 |
| GET | `/api/v1/runtime/apps/:appId/entities/:entityKey/lookup` | lookup 弹窗列表。 |
| GET | `/api/v1/workflow/tasks/todo` | 我的待办。 |
| GET | `/api/v1/workflow/tasks/:taskId` | 任务详情。 |
| POST | `/api/v1/workflow/tasks/:taskId/approve` | 审批通过。 |
| POST | `/api/v1/workflow/tasks/:taskId/reject` | 审批驳回。 |
| POST | `/api/v1/files/:fileId/preview-url` | 获取预览地址。 |
| POST | `/api/v1/files/:fileId/download-url` | 获取下载地址。 |

### 24.1 Mock 必须覆盖的结果

```text
success
permission_denied
field_permission_denied
version_conflict_record
version_conflict_task
task_already_completed
unsupported_runtime_model
field_render_error
subtable_validation_failed
file_download_denied
```

---

## 25. Runtime 测试夹具

Codex 应生成或维护以下测试夹具，用于开发和测试 Runtime Renderer：

```text
apps/web/src/runtime/__fixtures__/
  contractRuntimeModel.json
  expenseRuntimeModel.json
  purchaseRuntimeModel.json
  contractRecords.json
  expenseRecords.json
  purchaseRecords.json
  permissionCases.json
  versionConflictCases.json
  unsupportedRuntimeModel.json
  subtableValidationCases.json
```

### 25.1 夹具规则

```text
1. 三个样板应用必须覆盖普通字段、lookup、attachment、subtable、workflow action。
2. permissionCases 必须覆盖字段隐藏、只读、按钮禁用、无数据权限。
3. versionConflictCases 必须覆盖 recordVersion 和 taskVersion。
4. unsupportedRuntimeModel 用于验证不支持版本页面。
```

---

## 26. H5 自适应规则

```text
1. P0 不做原生移动端，只做 H5 自适应。
2. 表单在窄屏下从多列布局降级为单列布局。
3. 列表在窄屏下可降级为卡片列表。
4. 子表在窄屏下可横向滚动或转为行卡片。
5. 审批按钮在窄屏下固定底部操作区。
6. 文件预览和 lookup 弹窗在窄屏下使用全屏 Drawer。
```

---

## 27. Runtime Renderer Definition of Done

只有满足以下清单，Runtime Renderer 才可认为完成 P0：

```text
1. 能加载 Mock RuntimeModel 并渲染合同、报销、采购三个样板应用。
2. 能渲染运行态列表、表单、详情、审批详情。
3. 能根据字段权限隐藏、只读、必填字段。
4. 能处理 lookup、attachment、subtable 字段。
5. 能处理表单 dirty state 和离开确认。
6. 能处理 recordVersion / taskVersion 冲突。
7. 单个字段组件异常不会导致页面白屏。
8. RuntimeModel 版本不兼容时显示明确错误页。
9. H5 宽度下表单、详情和审批页面可正常浏览。
10. 所有运行态保存、提交、审批动作都走 Mock API 或 API Client。
11. RuntimeModel Adapter 有独立单元测试或测试用例。
12. Component Registry 初始化顺序明确且可测试。
13. Lookup 弹窗支持搜索、分页、回显和禁用项。
14. Subtable 支持新增、删除、行级校验和表级校验。
15. npm run build 不因 Runtime Renderer 代码失败。
```

---

## 28. 给 Codex 生成 Runtime Renderer 的强约束

```text
1. 必须使用 React + TypeScript + Vite + Ant Design。
2. Runtime Renderer 代码必须集中在 apps/web/src/runtime 下。
3. 页面组件不得直接解析 raw RuntimeModel，必须经过 Adapter。
4. 字段组件不得直接调用保存、提交、审批 API。
5. 列表、表单、详情、审批必须复用 RuntimeModel。
6. 不得为 contract、expense_report、purchase_request 写专属运行态页面。
7. 不得在前端拼接文件 storagePath。
8. 不得把权限校验当成只隐藏菜单。
9. 不得忽略 recordVersion / taskVersion。
10. 不得在组件内部执行任意用户脚本。
11. Mock API 路由必须与 40-api-design.md 保持一致。
12. 组件缺失必须显示 fallback，不得白屏。
13. 版本不兼容必须显示 UnsupportedRuntimeModel。
14. 表单 dirty state 必须覆盖路由跳转、弹窗关闭、浏览器刷新。
15. 子表必须支持行级错误展示。
```

---

## 29. 附录：Runtime Renderer 红线

```text
1. 不得读取设计态 draft_json。
2. 不得绕过 RuntimeModel 渲染运行态页面。
3. 不得为 P0 样板应用写固定业务页面。
4. 不得在前端做最终权限判定。
5. 不得下载无鉴权附件。
6. 不得忽略 snapshotId / appVersionId。
7. 不得忽略 recordVersion / taskVersion。
8. 不得让一个字段组件异常导致整页白屏。
9. 不得把 lookup 做成本地全量数据搜索。
10. 不得只做 happy path Mock。
```
