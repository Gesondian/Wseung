# 00-P0-trunk-consistency-checklist.md

版本：v1.0  
适用范围：P0 平台主干文档  
最后更新：2026-05-06

---

## 1. 文档目的

本文档用于统一低代码平台 P0 阶段主干文档的术语、状态、元数据 DSL、权限、审计、发布和 AI 生成约束。

本检查表不是业务需求文档，而是后续所有 P0 模块文档、系统架构设计、数据库设计、API 设计、前后端代码生成、测试用例生成的共同基线。

本轮纳入一致性检查的主干文档包括：

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

## 2. 主干文档优化目标

第一批主干文档需要达到以下目标：

```text
1. 术语一致：同一个业务概念在所有文档中只使用一套主名称。
2. 状态一致：应用、对象、表单、流程、发布、任务等状态码统一。
3. DSL 一致：所有元数据配置使用统一公共头部。
4. 权限一致：所有设计态和运行态操作必须引用统一权限模型。
5. 审计一致：所有关键配置变更、运行操作和越权行为必须可审计。
6. 发布一致：所有设计态配置必须通过发布生成运行态快照。
7. 模块边界一致：每个模块明确输入、输出、依赖、被消费方和不负责范围。
8. AI 生成一致：后续 AI 不得超出 P0 范围，不得生成与主干规则冲突的内容。
```

---

## 3. 统一术语表

| 主术语 | 英文/代码建议 | 说明 |
|---|---|---|
| 租户 | Tenant | P0 优先私有化单租户，但所有核心表和 DSL 预留 tenantId。 |
| 应用 | App | 顶层业务容器，承载对象、表单、视图、流程、权限、版本。 |
| 应用编码 | appKey | 同一租户内唯一，创建后原则上不可修改。 |
| 组织单元 | Org Unit | 部门、子部门等组织树节点。 |
| 用户 | User | 平台登录与业务操作主体。 |
| 角色 | Role | 权限分配载体。 |
| 授权主体 | Principal | user、role、orgUnit 等可被授权的对象。 |
| 业务对象 | Entity | 低代码业务数据模型，不直接称为数据库表。 |
| 字段 | Field | 业务对象属性。 |
| 子表 | Subtable | 明细数据结构，P0 作为对象字段类型或子对象处理。 |
| 关联对象 | Lookup | 单条关联对象，P0 不做复杂多对多。 |
| 表单 | Form | 数据录入、编辑、查看、审批的 UI 元数据。 |
| 视图/台账 | View / Ledger | 数据查询、列表、详情和业务台账入口。 |
| 流程定义 | Workflow Definition | 审批流程设计态配置。 |
| 流程实例 | Workflow Instance | 一次流程运行。 |
| 任务实例 | Task Instance | 某个流程节点生成的待办/已办任务。 |
| 权限策略 | Permission Policy | 对主体、资源、动作、条件的授权规则。 |
| 发布版本 | App Version | 应用发布后的不可变版本。 |
| 元数据快照 | Metadata Snapshot | 发布时固化的应用、对象、表单、流程、权限等配置。 |
| 运行时指针 | Runtime Pointer | 当前运行端指向的发布版本。 |
| 审计日志 | Audit Log | 关键操作留痕。 |

---

## 4. 命名规范

### 4.1 文档与 DSL 命名

文档、API 示例和 DSL 示例优先使用 camelCase：

```text
tenantId
appId
appKey
entityId
entityKey
fieldId
fieldKey
formId
workflowId
versionId
snapshotId
createdBy
updatedBy
deletedAt
```

### 4.2 数据库命名

数据库表和字段优先使用 snake_case：

```text
tenant_id
app_id
app_key
entity_id
entity_key
field_id
field_key
form_id
workflow_id
version_id
snapshot_id
created_by
updated_by
deleted_at
```

### 4.3 文档写作规则

```text
1. 业务说明使用中文术语。
2. API/DSL 示例使用 camelCase。
3. 数据库存储建议使用 snake_case。
4. 同一概念首次出现时建议同时标注中文 + 英文/代码名。
5. 不再混用 object、model、table 表示业务对象，统一使用“业务对象 Entity”。
```

---

## 5. 统一公共字段

所有 P0 主干资源建议至少包含以下公共字段。

### 5.1 DSL/API 公共字段

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "resourceType": "form",
  "resourceId": "form_contract_apply",
  "resourceKey": "contract_apply_form",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "createdBy": "u_001",
  "updatedBy": "u_001"
}
```

### 5.2 数据库公共字段

```text
id
tenant_id
app_id
version
status
created_by
created_at
updated_by
updated_at
deleted_by
deleted_at
is_deleted
remark
```

说明：

```text
1. 平台级资源可以没有 app_id，但必须有 tenant_id。
2. P0 优先私有化单租户，但仍需保留 tenant_id。
3. 软删除统一使用 is_deleted + deleted_at + deleted_by。
4. 运行态不可直接读取草稿版本。
```

---

## 6. 统一状态模型

### 6.1 应用状态 App Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| draft | 草稿 | 应用已创建但尚未发布。 |
| published | 已发布 | 应用已有可运行版本。 |
| disabled | 已停用 | 运行入口关闭，配置和数据保留。 |
| deleted | 已删除 | 进入回收站，未物理删除。 |

### 6.2 设计态资源状态 Resource Status

适用于业务对象、字段、表单、流程定义、权限配置等设计态资源。

| 状态码 | 中文 | 说明 |
|---|---|---|
| draft | 草稿 | 可编辑，不影响运行态。 |
| published | 已发布 | 已进入某个发布版本快照。 |
| disabled | 已停用 | 不再用于新运行流程或页面。 |
| deleted | 已删除 | 软删除，仅保留历史追溯。 |

### 6.3 业务数据状态 Business Record Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| draft | 草稿 | 用户保存但未提交。 |
| submitted | 已提交 | 已提交，可触发流程。 |
| running | 审批中 | 正在流程审批。 |
| approved | 已通过 | 流程通过或无需流程的数据已完成。 |
| rejected | 已驳回 | 流程驳回。 |
| withdrawn | 已撤回 | 发起人撤回。 |
| voided | 已作废 | 业务主动作废。 |
| archived | 已归档 | 业务结束并归档。 |
| deleted | 已删除 | 软删除。 |

### 6.4 流程定义状态 Workflow Definition Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| draft | 草稿 | 可编辑。 |
| published | 已发布 | 可被运行态使用。 |
| disabled | 已停用 | 不允许新发起，但历史实例继续按原版本运行。 |
| deleted | 已删除 | 软删除。 |

### 6.5 流程实例状态 Workflow Instance Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| running | 审批中 | 当前存在待处理任务。 |
| approved | 已通过 | 流程全部通过。 |
| rejected | 已驳回 | 流程被驳回。 |
| withdrawn | 已撤回 | 发起人撤回。 |
| voided | 已作废 | 管理员或有权限用户作废。 |
| archived | 已归档 | 流程完成后归档。 |

### 6.6 任务状态 Task Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| pending | 待处理 | 当前处理人可处理。 |
| approved | 已通过 | 该任务通过。 |
| rejected | 已驳回 | 该任务驳回。 |
| copied | 已抄送 | 抄送任务已生成或已读。 |
| cancelled | 已取消 | 流程撤回、作废或版本失效导致取消。 |
| expired | 已失效 | 任务因流程推进或异常失效。 |

### 6.7 发布状态 Release Status

| 状态码 | 中文 | 说明 |
|---|---|---|
| checking | 校验中 | 正在执行发布前校验。 |
| success | 发布成功 | 新版本已生成并可作为运行版本。 |
| failed | 发布失败 | 未影响当前运行版本。 |
| rolledBack | 已回滚 | 当前运行指针已回到历史版本。 |

---

## 7. 统一 P0 范围边界

P0 只做支撑合同管理、费用报销、采购申请三类样板应用的主干能力。

### 7.1 P0 必须支持

```text
应用创建与管理
组织、用户、角色基础管理
数据对象与字段建模
表单设计与运行时渲染
列表/详情/台账基础能力
基础审批流程
平台/应用/对象/数据/字段/流程节点权限
发布、版本、运行态快照
Excel 导入导出基础能力
审计日志
回收站
合同、费用报销、采购申请三个模板
```

### 7.2 P0 统一不做

```text
完整 SaaS 多租户运营与计费
完整 BI 平台
完整 BPMN 兼容
复杂会签、并行、加签、转交、委托、子流程
完整插件市场
在线 IDE
复杂动作流编排
深度第三方集成套件
AI 自动生成完整应用
OCR/RPA/电子签章深度集成
原生 App
复杂 ERP 全量替代
```

---

## 8. 统一权限规则

### 8.1 权限模型

P0 采用：

```text
RBAC + 数据范围 + 字段权限 + 流程节点权限
```

### 8.2 权限层级

```text
平台级权限
应用级权限
对象级权限
表单级权限
视图级权限
字段级权限
数据级权限
流程定义权限
流程任务权限
发布权限
审计查看权限
导入导出权限
```

### 8.3 权限基本原则

```text
1. 默认拒绝：未授权即不可访问。
2. 最小权限：默认仅授予完成任务所需权限。
3. 服务端强制校验：前端隐藏按钮不等于权限控制。
4. 运行态接口全部鉴权：列表、详情、提交、审批、导出、看板都必须鉴权。
5. 字段权限双端生效：前端控制展示，后端控制返回与写入。
6. 流程任务必须校验当前处理人。
7. 导入导出必须独立授权，并受数据权限和字段权限过滤。
8. 权限变更进入运行态的规则以发布运行时文档为准。
```

---

## 9. 统一审计规则

### 9.1 必须审计的配置行为

```text
创建、编辑、删除、恢复应用
创建、编辑、删除、发布对象和字段
创建、编辑、删除、发布表单
创建、编辑、删除、发布流程
配置或修改权限策略
发布、回滚、停用应用
导入、导出应用包或业务数据
```

### 9.2 必须审计的运行行为

```text
新增、编辑、删除、作废、恢复业务数据
发起流程
审批通过
审批驳回
撤回流程
作废流程
附件上传、下载、删除
越权访问或越权写入
运行时异常
```

### 9.3 审计字段建议

```text
auditId
tenantId
appId
operatorId
operatorName
action
resourceType
resourceId
resourceName
beforeValue
afterValue
result
ip
userAgent
createdAt
traceId
```

---

## 10. 统一发布规则

```text
1. 设计态、发布态、运行态必须隔离。
2. 草稿修改不得直接影响已发布运行版本。
3. 应用发布必须生成不可变版本和元数据快照。
4. 发布失败不得影响当前运行版本。
5. 运行端只能读取当前运行版本指针对应的元数据快照。
6. 流程实例必须绑定发起时的流程版本。
7. 回滚只调整当前运行版本指针，不删除业务数据。
8. 权限配置如何进入运行态必须由发布运行时统一控制。
9. 停用应用只关闭运行入口，不删除配置和业务数据。
10. 删除必须进入回收站或软删除，不做物理删除。
```

---

## 11. 统一元数据 DSL 公共头

所有 DSL 建议采用统一公共头 + 模块扩展体。

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "resourceType": "entity",
  "resourceId": "ent_contract",
  "resourceKey": "contract",
  "resourceName": "合同",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {}
}
```

约束：

```text
1. resourceType 必须可枚举。
2. resourceKey 同一 appId 内建议唯一。
3. schemaVersion 用于后续 DSL 升级。
4. metadata 内部结构由具体模块定义。
5. 发布时必须把 DSL 固化进入 metadataSnapshot。
```

---

## 12. 模块输入/输出边界检查

| 模块 | 输入 | 输出 | 被消费方 |
|---|---|---|---|
| 应用中心 | tenant、用户、角色、模板 | app、appFolder、appMember、appStatus | 所有设计器、发布运行时、权限系统 |
| 组织用户角色 | tenant、平台管理员配置 | orgUnit、user、role、userRole、departmentLeader | 权限、流程、人员字段、数据权限 |
| 数据建模 | app、权限上下文 | entity、field、relation、entityVersion | 表单、视图、流程、权限、导入导出、发布 |
| 表单设计器 | entity、field、权限 | form、formComponent、formRule、formVersion | 运行时、流程、视图、模板 |
| 流程引擎 | app、entity、form、user、role、orgUnit | workflowDef、workflowVersion、workflowInstance、taskInstance | 运行时、待办、审计、权限 |
| 权限系统 | user、role、orgUnit、app、entity、field | permissionPolicy、resourceAcl、permissionSnapshot | 所有运行态接口和设计态操作 |
| 发布运行时 | 草稿元数据、权限策略 | appVersion、metadataSnapshot、runtimePointer | 运行端页面、表单、流程、视图 |

---

## 13. AI 生成统一约束

后续 AI 基于任意 P0 主干文档生成内容时，必须遵守：

```text
1. 不得超出 P0 范围。
2. 不得引入 P1/P2/P3 能力作为必需实现。
3. 所有配置必须元数据驱动。
4. 不得把合同、报销、采购写死为固定代码。
5. 所有资源必须包含 tenantId、appId、status、version 等上下文。
6. 所有删除默认软删除。
7. 所有关键操作必须写入 auditLog。
8. 所有运行态接口必须经过服务端权限校验。
9. 所有设计态修改不得直接影响已发布版本。
10. 所有配置产物必须可序列化为 JSON。
11. 运行态必须读取已发布 metadataSnapshot。
12. 测试用例必须覆盖权限、状态、异常、审计和发布隔离。
```

---

## 14. 主干一致性检查清单

| 检查项 | 状态 | 说明 |
|---|---|---|
| 是否存在 7 个主干文档 | 已完成 | 本轮补齐 03-P0-org-user-role.md。 |
| 术语是否统一 | 已统一 | 增加统一术语表和每个文档的规范引用。 |
| ID 命名是否统一 | 已统一 | API/DSL 用 camelCase，DB 用 snake_case。 |
| 状态是否统一 | 已统一 | 应用、设计态资源、业务数据、流程、任务、发布状态统一。 |
| P0 不做范围是否统一 | 已统一 | 每个主干文档补充统一 P0 非目标引用。 |
| 权限规则是否统一 | 已统一 | 以 08-P0-permission-system.md 为权限总规范。 |
| 审计规则是否统一 | 已统一 | 每个主干模块增加统一审计要求。 |
| 设计态/运行态边界是否统一 | 已统一 | 以 09-P0-release-runtime.md 为发布运行总规范。 |
| DSL 公共字段是否统一 | 已统一 | 每个模块补充公共 DSL 头部要求。 |
| 模块输入/输出是否明确 | 已统一 | 每个主干文档增加模块边界说明。 |
| 样板应用是否贯穿 | 已统一 | 合同为主样板，报销和采购为辅助样板。 |
| AI 生成约束是否统一 | 已统一 | 每个文件补充统一生成约束。 |

---

## 15. 后续使用方式

后续进入第二批文档前，必须遵守以下规则：

```text
1. 第二批文档必须引用本文档的术语、状态、权限、审计和发布规则。
2. 第二批文档不得重新定义与主干冲突的状态码和 DSL 公共字段。
3. 如第二批发现主干规则不足，先修改本文档，再同步影响到相关主干文档。
4. 架构设计、数据库设计、API 设计均应先读取本文档。
5. AI 生成代码或测试用例时，应把本文档作为全局约束。
```

---

## 16. 下一步建议

完成第一批主干一致性优化后，可以继续进入第二批文档：

```text
06-P0-view-data-management.md
10-P0-dashboard-report.md
11-P0-excel-import-export.md
12-P0-template-center.md
13-P0-audit-recycle-bin.md
```

说明：`06-P0-view-data-management.md` 已提前产出，但仍建议在第二批阶段按本文档规则进行二次校准。
