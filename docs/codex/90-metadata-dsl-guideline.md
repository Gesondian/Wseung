# 90-metadata-dsl-guideline.md

版本：v1.0  
适用范围：低代码平台 P0 元数据 DSL 设计、研发实现、数据库设计、API 设计、发布运行时、AI 代码生成  
最后更新：2026-05-06  
状态：建议基线版

---

## 1. 文档目的

本文档用于统一低代码平台 P0 阶段所有元数据 DSL 的结构、命名、版本、校验、发布、快照和存储映射规则。

本文档不是某一个模块的需求文档，而是以下工作的共同规范：

```text
1. 数据建模 DSL 设计
2. 表单设计器 DSL 设计
3. 视图/台账 DSL 设计
4. 流程审批 DSL 设计
5. 权限策略 DSL 设计
6. 应用模板与元数据包导入导出
7. 发布版本与 metadataSnapshot 生成
8. 运行时渲染与执行
9. 数据库存储设计
10. API 设计与前后端代码生成
11. 测试用例与元数据校验规则生成
```

P0 阶段目标不是设计一个无限通用的元数据语言，而是为合同管理、费用报销、采购申请三个样板应用提供稳定、可发布、可运行、可审计、可扩展的最小元数据规范。

---

## 2. 前置结论与约束

本文档承接当前项目已确认的主干决策：

```text
1. P0 面向企业内部管理应用的低代码搭建与流程自动化。
2. P0 首版支持合同管理、费用报销、采购申请三个样板应用。
3. P0 采用元数据表 + 通用业务记录表 + JSON 数据字段 + 可索引字段扩展。
4. P0 优先私有化单租户，但所有核心 DSL 与表结构预留 tenantId。
5. P0 不做完整 BPMN，只做轻量企业审批流。
6. P0 不做完整 BI，不做插件市场，不做 AI 自动生成应用。
7. P0 移动端只做 H5 自适应。
8. 运行态只能读取已发布元数据快照，不读取草稿配置。
9. 发布后生成不可变应用版本和 metadataSnapshot。
10. 权限必须由服务端强制校验，前端隐藏不等于权限控制。
```

---

## 3. DSL 设计目标

### 3.1 核心目标

元数据 DSL 需要满足以下目标：

| 目标 | 说明 |
|---|---|
| 可序列化 | 所有设计态配置必须可序列化为 JSON。 |
| 可校验 | 保存、预览、发布、导入时都可以执行结构校验与依赖校验。 |
| 可发布 | 草稿 DSL 必须能生成不可变发布版本。 |
| 可快照 | 发布时必须能合并为完整 metadataSnapshot。 |
| 可运行 | 运行时可以基于快照渲染表单、列表、详情、审批页并执行权限。 |
| 可审计 | 配置变更、发布、回滚、权限变更必须可追踪。 |
| 可导入导出 | 应用元数据包可以跨环境迁移，且能处理编码冲突。 |
| 可扩展 | P1/P2 能扩展字段类型、组件、流程节点、权限条件和连接器。 |

### 3.2 非目标

P0 DSL 明确不承担以下目标：

```text
1. 不作为完整编程语言，不允许执行任意 JavaScript / Groovy / Python 等脚本。
2. 不作为完整 BPMN 标准实现。
3. 不覆盖复杂公式引擎、复杂报表引擎、实时数仓或 OLAP。
4. 不支持插件市场中的第三方组件动态执行。
5. 不支持多租户商业 SaaS 的完整隔离策略，但必须预留 tenantId。
6. 不支持无限嵌套子表、复杂多对多关系和对象级事务编排。
```

---

## 4. 总体 DSL 分层

P0 元数据 DSL 分为四层：

```text
应用包层 App Package
  └── 资源定义层 Resource DSL
        └── 模块元数据层 metadata
              └── 表达式与规则层 condition / validation / permission / layout
```

### 4.1 应用包层

用于应用模板、导入导出、发布快照前的整体资源组织。

典型内容包括：

```text
app
entities
forms
views
workflows
permissions
menus
roles
settings
```

### 4.2 资源定义层

每一个可独立管理、发布或引用的配置对象都称为资源 Resource。

典型资源包括：

```text
app
entity
field
form
view
workflowDef
permissionPolicy
menu
template
metadataSnapshot
```

### 4.3 模块元数据层

模块元数据放在统一公共头的 `metadata` 内部，由具体模块定义。

示例：

```json
{
  "resourceType": "entity",
  "resourceKey": "contract",
  "metadata": {
    "primaryFieldKey": "contract_name",
    "fields": []
  }
}
```

### 4.4 表达式与规则层

表达式与规则层用于字段校验、显隐规则、流程条件分支、数据权限条件等场景。

P0 统一采用声明式 JSON 表达式，不执行用户输入脚本。

---

## 5. 命名规范

### 5.1 属性命名

DSL 与 API 示例统一使用 camelCase：

```text
tenantId
appId
appKey
resourceType
resourceId
resourceKey
resourceName
schemaVersion
createdBy
updatedBy
fieldKey
formKey
workflowKey
snapshotId
```

数据库表和字段统一使用 snake_case：

```text
tenant_id
app_id
app_key
resource_type
resource_id
resource_key
schema_version
created_by
updated_by
field_key
form_key
workflow_key
snapshot_id
```

### 5.2 编码命名

业务编码类字段建议使用 lower_snake_case：

```text
contract
contract_name
contract_amount
contract_apply_form
contract_approval
expense_items
purchase_request
```

规则：

```text
1. resourceKey、entityKey、fieldKey、formKey、workflowKey 创建后原则上不可修改。
2. 同一 tenantId + appId + resourceType 下 resourceKey 必须唯一。
3. 同一 entityKey 下 fieldKey 必须唯一。
4. 编码不应包含中文、空格、特殊符号或环境相关信息。
5. 展示名称使用 resourceName、fieldName、label 等字段承载。
```

### 5.3 ID 与 Key 的区别

| 字段 | 说明 | 是否可展示给用户 | 是否跨环境稳定 |
|---|---|---:|---:|
| id / resourceId | 系统生成的内部唯一 ID。 | 否 | 不保证 |
| key / resourceKey | 业务编码，用于引用和导入导出冲突检测。 | 可有限展示 | 是 |
| name / resourceName | 展示名称。 | 是 | 否 |

规则：

```text
1. 运行时内部优先使用 ID 定位资源。
2. 元数据包导入导出、模板复用、跨环境迁移优先使用 key 做引用。
3. 同一环境内应保存 key 与 id 的映射关系。
4. 导入应用包时如 key 冲突，P0 默认要求重命名，不覆盖现有应用。
```

---

## 6. 统一公共头

所有可独立保存、发布、导入导出的 DSL 资源必须采用统一公共头。

### 6.1 标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "entity",
  "resourceId": "ent_contract",
  "resourceKey": "contract",
  "resourceName": "合同",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "description": "合同管理主对象",
  "createdBy": "u_001",
  "createdAt": "2026-05-06T10:00:00+08:00",
  "updatedBy": "u_001",
  "updatedAt": "2026-05-06T10:00:00+08:00",
  "metadata": {}
}
```

### 6.2 公共字段说明

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| tenantId | string | 是 | 租户 ID。P0 单租户也必须保留。 |
| appId | string | 条件必填 | 应用内资源必填；平台级资源可为空。 |
| appKey | string | 条件必填 | 应用编码，用于导入导出和跨环境引用。 |
| resourceType | string | 是 | 资源类型，必须来自平台枚举。 |
| resourceId | string | 是 | 资源 ID，由系统生成。 |
| resourceKey | string | 是 | 资源编码，同一应用同类型内唯一。 |
| resourceName | string | 是 | 资源展示名称。 |
| schemaVersion | string | 是 | DSL 结构版本。P0 默认为 `1.0`。 |
| version | number | 是 | 资源草稿版本号或定义版本号。 |
| status | string | 是 | 资源状态。 |
| description | string | 否 | 资源描述。 |
| createdBy | string | 是 | 创建人。 |
| createdAt | string | 是 | 创建时间，ISO 8601。 |
| updatedBy | string | 是 | 最后更新人。 |
| updatedAt | string | 是 | 最后更新时间，ISO 8601。 |
| metadata | object | 是 | 模块自定义元数据。 |

### 6.3 公共状态

P0 资源状态建议统一使用：

| 状态 | 中文 | 说明 |
|---|---|---|
| draft | 草稿 | 设计态可编辑版本。 |
| published | 已发布 | 已进入发布版本或快照。 |
| active | 启用 | 当前可被运行态使用。 |
| disabled | 停用 | 暂停使用但不删除。 |
| deleted | 已删除 | 软删除，进入回收站或不可见。 |
| archived | 已归档 | 历史保留，不再参与运行。 |
| invalid | 异常 | 引用缺失、校验失败或迁移失败。 |

说明：

```text
1. 设计态资源通常使用 draft / disabled / deleted。
2. 发布版本通常使用 published / active / archived。
3. 运行态必须读取 active 的 runtimePointer 对应 metadataSnapshot。
4. 删除必须软删除，不直接物理删除。
```

---

## 7. resourceType 枚举

P0 建议支持以下资源类型：

| resourceType | 中文 | 说明 |
|---|---|---|
| app | 应用 | 顶层业务容器。 |
| appFolder | 应用分类 | 应用中心分类。 |
| appMenu | 应用菜单 | 运行端菜单入口。 |
| role | 角色 | 平台或应用角色。 |
| appMember | 应用成员 | 应用成员关系。 |
| entity | 业务对象 | 数据建模主对象。 |
| field | 字段 | 业务对象字段。 |
| relation | 对象关系 | lookup、subtable 等关系定义。 |
| form | 表单 | 表单设计器元数据。 |
| formComponent | 表单组件 | 可拆分存储时使用。 |
| formRule | 表单规则 | 显隐、必填、只读、校验规则。 |
| view | 视图/台账 | 列表、详情、查询条件、排序。 |
| workflowDef | 流程定义 | 审批流程设计态定义。 |
| workflowNode | 流程节点 | 可拆分存储时使用。 |
| workflowEdge | 流程连线 | 可拆分存储时使用。 |
| permissionPolicy | 权限策略 | RBAC、数据权限、字段权限等。 |
| metadataSnapshot | 元数据快照 | 发布后不可变配置集合。 |
| appVersion | 应用版本 | 应用发布版本。 |
| template | 应用模板 | 预置应用模板或导入导出包。 |
| auditConfig | 审计配置 | 预留资源类型。 |

P0 研发实现可以整体 JSON 存储，也可以拆表存储，但 DSL 层对外应保持稳定。

---

## 8. 版本模型

P0 存在三类版本概念，不能混用。

| 版本 | 字段 | 说明 |
|---|---|---|
| DSL 结构版本 | schemaVersion | 描述 DSL 语法结构，例如 `1.0`。 |
| 资源草稿版本 | version | 设计态资源每次保存递增。 |
| 应用发布版本 | appVersion / versionNo | 发布时生成的不可变版本，例如 `v3`。 |

### 8.1 schemaVersion 规则

```text
1. P0 默认 schemaVersion = 1.0。
2. 兼容新增字段时可保持 1.0，读取端必须忽略未知字段。
3. 删除字段、改字段含义、改枚举语义属于破坏性变更，必须升级 schemaVersion。
4. 导入元数据包时必须检查 schemaVersion 是否兼容。
5. 发布快照中必须记录每类资源的 schemaVersion。
```

### 8.2 草稿版本规则

```text
1. 每次保存设计态 DSL，资源 version 递增。
2. 草稿 version 只代表设计态历史，不等于发布版本。
3. 草稿修改不得影响运行态。
4. 已发布资源如继续编辑，应基于最新发布内容生成新草稿。
```

### 8.3 发布版本规则

```text
1. 每次发布应用生成新的 appVersion。
2. appVersion 必须关联 metadataSnapshot。
3. metadataSnapshot 发布后不可编辑。
4. 回滚只调整 runtimePointer，不修改历史快照。
5. 发布失败不得影响当前线上运行版本。
```

---

## 9. 依赖引用规范

### 9.1 引用字段

DSL 中跨资源引用优先使用 key，同时在存储层可保存 id 加速查询。

常见引用字段：

```text
appKey
entityKey
fieldKey
formKey
viewKey
workflowKey
roleKey
orgUnitKey
principalKey
resourceKey
```

示例：

```json
{
  "resourceType": "form",
  "resourceKey": "contract_apply_form",
  "metadata": {
    "entityKey": "contract",
    "components": [
      {
        "id": "cmp_contract_amount",
        "type": "money",
        "fieldKey": "contract_amount"
      }
    ]
  }
}
```

### 9.2 依赖关系建议结构

用于保存或导出资源依赖，也可由系统自动生成。

```json
{
  "source": {
    "resourceType": "form",
    "resourceKey": "contract_apply_form"
  },
  "target": {
    "resourceType": "field",
    "resourceKey": "contract.contract_amount"
  },
  "relationType": "binds",
  "required": true
}
```

### 9.3 依赖校验规则

```text
1. 表单组件绑定的 fieldKey 必须存在且未删除。
2. 子表组件只能绑定 subtable 字段。
3. 附件组件只能绑定 attachment / image 字段。
4. lookup 字段的 targetEntityKey 必须存在且未停用。
5. 流程 trigger.formKey 必须存在且属于同一 app。
6. 流程节点字段权限引用的 fieldKey 必须存在。
7. 权限策略引用的 role、user、orgUnit、entity、field、form、workflow 必须存在。
8. 发布时必须执行全量依赖校验。
```

---

## 10. 条件表达式 DSL

条件表达式用于以下场景：

```text
1. 表单显隐规则
2. 表单只读规则
3. 表单必填规则
4. 字段校验规则
5. 流程条件分支
6. 数据权限过滤
7. 字段权限条件
```

### 10.1 标准结构

```json
{
  "logic": "AND",
  "rules": [
    {
      "field": "contract_amount",
      "operator": ">=",
      "value": 100000
    },
    {
      "field": "contract_type",
      "operator": "in",
      "value": ["purchase", "framework"]
    }
  ]
}
```

### 10.2 嵌套结构

```json
{
  "logic": "OR",
  "rules": [
    {
      "field": "contract_amount",
      "operator": ">=",
      "value": 100000
    },
    {
      "logic": "AND",
      "rules": [
        {
          "field": "contract_type",
          "operator": "=",
          "value": "purchase"
        },
        {
          "field": "risk_level",
          "operator": "in",
          "value": ["medium", "high"]
        }
      ]
    }
  ]
}
```

### 10.3 操作符枚举

| operator | 说明 | 适用字段 |
|---|---|---|
| = | 等于 | 文本、数字、日期、枚举、布尔 |
| != | 不等于 | 文本、数字、日期、枚举、布尔 |
| > | 大于 | 数字、金额、日期、日期时间 |
| >= | 大于等于 | 数字、金额、日期、日期时间 |
| < | 小于 | 数字、金额、日期、日期时间 |
| <= | 小于等于 | 数字、金额、日期、日期时间 |
| in | 属于集合 | 枚举、人员、部门、状态 |
| notIn | 不属于集合 | 枚举、人员、部门、状态 |
| contains | 包含 | 文本、多选 |
| notContains | 不包含 | 文本、多选 |
| isEmpty | 为空 | 全部 |
| isNotEmpty | 不为空 | 全部 |
| between | 区间 | 数字、金额、日期、日期时间 |
| eqCurrentUser | 等于当前用户 | 人员字段 |
| eqCurrentUserDepartment | 等于当前用户部门 | 部门字段 |
| inCurrentUserDepartments | 属于当前用户部门集合 | 部门字段 |

### 10.4 安全限制

```text
1. P0 不允许在 DSL 中保存任意可执行脚本。
2. 条件表达式只能引用当前记录字段、系统上下文和有限枚举。
3. 服务端必须重新执行权限相关条件判断。
4. 前端执行条件仅用于交互体验，不作为最终权限依据。
5. 条件表达式失败时应按安全默认处理：权限拒绝、流程阻断、发布失败或规则不生效并提示。
```

### 10.5 上下文变量

P0 可预留以下上下文变量：

```text
$currentUser.id
$currentUser.departmentId
$currentUser.departmentIds
$currentUser.roleKeys
$currentRecord.createdBy
$currentRecord.createdDeptId
$currentRecord.status
$currentWorkflow.nodeKey
$currentWorkflow.initiatorId
$now
$today
```

上下文变量由服务端注入，禁止由前端请求直接传入并信任。

---

## 11. 字段类型 DSL 规范

### 11.1 字段类型总表

| fieldType | 中文 | JSON 存储建议 | 默认组件 |
|---|---|---|---|
| text | 单行文本 | string | text |
| textarea | 多行文本 | string | textarea |
| number | 数字 | number | number |
| money | 金额 | string 或 decimal | money |
| date | 日期 | string: YYYY-MM-DD | date |
| datetime | 日期时间 | ISO 8601 string | datetime |
| singleSelect | 单选 | string | select |
| multiSelect | 多选 | string[] | multiSelect |
| boolean | 布尔 | boolean | switch |
| user | 人员 | string 或 string[] | userPicker |
| department | 部门 | string 或 string[] | departmentPicker |
| attachment | 附件 | object[] | attachment |
| image | 图片 | object[] | image |
| autoNumber | 自动编号 | string | readonlyText |
| status | 状态 | string | statusTag |
| createdBy | 创建人 | string | readonlyUser |
| createdAt | 创建时间 | ISO 8601 string | readonlyDatetime |
| updatedBy | 更新人 | string | readonlyUser |
| updatedAt | 更新时间 | ISO 8601 string | readonlyDatetime |
| ownerDepartment | 所属部门 | string | readonlyDepartment |
| subtable | 子表 | object[] | subtable |
| lookup | 关联对象 | string 或 object | lookup |

### 11.2 字段 DSL 标准结构

```json
{
  "fieldId": "fld_contract_amount",
  "fieldKey": "contract_amount",
  "fieldName": "合同金额",
  "fieldType": "money",
  "required": true,
  "unique": false,
  "defaultValue": null,
  "description": "合同含税金额",
  "validation": {
    "min": "0.01",
    "precision": 2
  },
  "indexable": true,
  "searchable": true,
  "sortable": true,
  "listVisible": true,
  "importable": true,
  "exportable": true,
  "system": false,
  "status": "active"
}
```

### 11.3 选项字段结构

```json
{
  "fieldKey": "contract_type",
  "fieldName": "合同类型",
  "fieldType": "singleSelect",
  "required": true,
  "options": [
    {
      "value": "sales",
      "label": "销售合同",
      "color": "blue",
      "enabled": true,
      "sortOrder": 10
    },
    {
      "value": "purchase",
      "label": "采购合同",
      "color": "green",
      "enabled": true,
      "sortOrder": 20
    }
  ]
}
```

规则：

```text
1. option.value 创建后原则上不可修改。
2. option.label 可以修改，用于展示历史值。
3. 停用选项不得影响历史记录展示。
4. multiSelect 存储 value 数组。
```

### 11.4 自动编号字段结构

```json
{
  "fieldKey": "contract_no",
  "fieldName": "合同编号",
  "fieldType": "autoNumber",
  "required": true,
  "unique": true,
  "readonly": true,
  "autoNumberRule": {
    "prefix": "HT",
    "datePattern": "yyyy",
    "sequenceLength": 4,
    "resetCycle": "YEAR"
  }
}
```

### 11.5 子表字段结构

```json
{
  "fieldKey": "expense_items",
  "fieldName": "报销明细",
  "fieldType": "subtable",
  "required": true,
  "subFields": [
    {
      "fieldKey": "item_date",
      "fieldName": "发生日期",
      "fieldType": "date",
      "required": true
    },
    {
      "fieldKey": "amount",
      "fieldName": "金额",
      "fieldType": "money",
      "required": true,
      "validation": {
        "min": "0.01",
        "precision": 2
      }
    }
  ]
}
```

P0 子表规则：

```text
1. 子表 P0 作为字段类型或受控子对象处理。
2. P0 不支持无限嵌套子表。
3. 子表字段必须在子表组件内部展示。
4. 子表数据默认存储在主记录 dataJson 中。
5. 后续如需独立统计和权限，可升级为独立子对象。
```

### 11.6 关联对象字段结构

```json
{
  "fieldKey": "supplier_id",
  "fieldName": "供应商",
  "fieldType": "lookup",
  "required": false,
  "lookup": {
    "targetEntityKey": "supplier",
    "displayFieldKey": "supplier_name",
    "searchFieldKeys": ["supplier_name"],
    "multiple": false
  }
}
```

P0 lookup 规则：

```text
1. P0 默认支持单条关联，multiple=false。
2. 复杂多对多关系放到 P1/P2。
3. 被关联对象停用后，新数据禁止选择，历史数据可展示。
4. lookup 查询结果必须受目标对象数据权限控制。
```

---

## 12. 业务对象 Entity DSL

### 12.1 标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "entity",
  "resourceId": "ent_contract",
  "resourceKey": "contract",
  "resourceName": "合同",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "entityKey": "contract",
    "entityName": "合同",
    "description": "合同管理主对象",
    "isMainEntity": true,
    "primaryFieldKey": "contract_name",
    "recordNoFieldKey": "contract_no",
    "statusFieldKey": "contract_status",
    "fields": [
      {
        "fieldKey": "contract_no",
        "fieldName": "合同编号",
        "fieldType": "autoNumber",
        "required": true,
        "unique": true,
        "readonly": true,
        "autoNumberRule": {
          "prefix": "HT",
          "datePattern": "yyyy",
          "sequenceLength": 4,
          "resetCycle": "YEAR"
        },
        "listVisible": true,
        "searchable": true,
        "importable": false,
        "exportable": true
      },
      {
        "fieldKey": "contract_name",
        "fieldName": "合同名称",
        "fieldType": "text",
        "required": true,
        "validation": {
          "maxLength": 200
        },
        "indexable": true,
        "searchable": true,
        "listVisible": true,
        "importable": true,
        "exportable": true
      },
      {
        "fieldKey": "contract_amount",
        "fieldName": "合同金额",
        "fieldType": "money",
        "required": true,
        "validation": {
          "min": "0.01",
          "precision": 2
        },
        "indexable": true,
        "searchable": true,
        "sortable": true,
        "listVisible": true,
        "importable": true,
        "exportable": true
      }
    ]
  }
}
```

### 12.2 Entity 校验规则

保存草稿时必须校验：

```text
1. entityKey 在 app 内唯一。
2. fieldKey 在 entity 内唯一。
3. fieldType 属于 P0 支持枚举。
4. required、unique、defaultValue、validation 与 fieldType 兼容。
5. primaryFieldKey 必须引用有效字段。
6. recordNoFieldKey 如存在，字段类型建议为 autoNumber 或 text。
7. statusFieldKey 如存在，字段类型必须为 status 或 singleSelect。
```

发布时必须额外校验：

```text
1. 对象至少包含一个有效业务字段。
2. 被表单、流程、权限引用的字段不得删除。
3. lookup 目标对象存在且未删除。
4. 需要索引的字段类型必须可索引。
5. 字段危险变更必须被阻止或要求迁移策略。
```

---

## 13. 表单 Form DSL

### 13.1 标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "form",
  "resourceId": "form_contract_apply",
  "resourceKey": "contract_apply_form",
  "resourceName": "合同申请表单",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "formKey": "contract_apply_form",
    "formName": "合同申请表单",
    "entityKey": "contract",
    "mode": "create",
    "layout": {
      "type": "vertical",
      "pcColumns": 2,
      "mobileColumns": 1
    },
    "components": [
      {
        "id": "grp_basic",
        "type": "group",
        "label": "基础信息",
        "children": [
          {
            "id": "cmp_contract_name",
            "type": "text",
            "fieldKey": "contract_name",
            "label": "合同名称",
            "required": true,
            "readonly": false,
            "visible": true,
            "placeholder": "请输入合同名称"
          },
          {
            "id": "cmp_contract_amount",
            "type": "money",
            "fieldKey": "contract_amount",
            "label": "合同金额",
            "required": true,
            "validation": {
              "min": "0.01"
            }
          }
        ]
      }
    ],
    "rules": [
      {
        "id": "rule_amount_required",
        "type": "required",
        "targetComponentId": "cmp_contract_amount",
        "targetFieldKey": "contract_amount",
        "condition": {
          "logic": "AND",
          "rules": [
            {
              "field": "contract_type",
              "operator": "=",
              "value": "purchase"
            }
          ]
        }
      }
    ]
  }
}
```

### 13.2 表单 mode 枚举

| mode | 说明 |
|---|---|
| create | 新建表单。 |
| edit | 编辑表单。 |
| view | 查看表单。 |
| approve | 审批表单。 |

### 13.3 组件类型枚举

| type | 中文 | 是否绑定字段 | 说明 |
|---|---|---:|---|
| text | 单行文本 | 是 | 绑定 text。 |
| textarea | 多行文本 | 是 | 绑定 textarea。 |
| number | 数字 | 是 | 绑定 number。 |
| money | 金额 | 是 | 绑定 money。 |
| date | 日期 | 是 | 绑定 date。 |
| datetime | 日期时间 | 是 | 绑定 datetime。 |
| select | 下拉/单选 | 是 | 绑定 singleSelect。 |
| multiSelect | 多选 | 是 | 绑定 multiSelect。 |
| switch | 布尔 | 是 | 绑定 boolean。 |
| userPicker | 人员选择 | 是 | 绑定 user。 |
| departmentPicker | 部门选择 | 是 | 绑定 department。 |
| attachment | 附件 | 是 | 绑定 attachment。 |
| image | 图片 | 是 | 绑定 image。 |
| lookup | 关联对象 | 是 | 绑定 lookup。 |
| subtable | 子表 | 是 | 绑定 subtable。 |
| readonlyText | 只读文本 | 是 | 系统字段展示。 |
| group | 分组 | 否 | 布局组件。 |
| grid | 栅格 | 否 | 布局组件。 |
| tabs | 标签页 | 否 | 布局组件。 |
| divider | 分割线 | 否 | 辅助组件。 |
| description | 说明文本 | 否 | 辅助组件。 |
| workflowTimeline | 流程日志 | 否 | 审批/详情展示区域。 |

### 13.4 表单规则类型

| type | 说明 |
|---|---|
| visible | 显隐规则。 |
| readonly | 只读规则。 |
| required | 必填规则。 |
| validation | 校验规则。 |
| defaultValue | 默认值规则。 |

### 13.5 表单校验规则

保存草稿时必须校验：

```text
1. formKey 在 app 内唯一。
2. entityKey 存在。
3. 字段组件必须绑定 fieldKey，布局组件和辅助组件除外。
4. fieldKey 必须属于当前 entity。
5. 组件 type 必须与 fieldType 兼容。
6. 组件 id 在表单内唯一。
7. rules.targetComponentId 或 targetFieldKey 必须有效。
8. 移动端 mobileColumns 必须可渲染，P0 组件必须支持 H5。
```

发布时必须额外校验：

```text
1. 表单引用的字段不得已删除。
2. 必填字段在 create/edit/approve 场景下必须有可输入组件或默认值策略。
3. 审批表单字段权限必须能与流程节点权限合并。
4. 表单 DSL 可被运行时解析，不能包含未知必需组件。
```

---

## 14. 视图 View DSL

P0 虽然未单独展开视图模块文档，但运行端必须支持列表、详情、台账入口，因此需要最小视图 DSL。

### 14.1 标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "view",
  "resourceId": "view_contract_list",
  "resourceKey": "contract_list",
  "resourceName": "合同台账",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "viewKey": "contract_list",
    "viewName": "合同台账",
    "entityKey": "contract",
    "viewType": "table",
    "columns": [
      {
        "fieldKey": "contract_no",
        "label": "合同编号",
        "visible": true,
        "sortable": true,
        "width": 160
      },
      {
        "fieldKey": "contract_name",
        "label": "合同名称",
        "visible": true,
        "sortable": false,
        "width": 240
      },
      {
        "fieldKey": "contract_amount",
        "label": "合同金额",
        "visible": true,
        "sortable": true,
        "width": 160
      }
    ],
    "filters": [
      {
        "fieldKey": "status",
        "operator": "in",
        "defaultValue": ["draft", "in_approval", "approved"]
      },
      {
        "fieldKey": "createdAt",
        "operator": "between"
      }
    ],
    "sorts": [
      {
        "fieldKey": "createdAt",
        "direction": "desc"
      }
    ],
    "pageSize": 20,
    "actions": ["view", "edit", "delete", "export"]
  }
}
```

### 14.2 viewType 枚举

| viewType | 说明 |
|---|---|
| table | 表格列表。 |
| detail | 详情页。 |
| kanban | 看板预留，P0 可不完整实现。 |
| calendar | 日历预留，P0 不要求。 |

### 14.3 视图校验规则

```text
1. viewKey 在 app 内唯一。
2. entityKey 必须存在。
3. columns.fieldKey 必须存在且未删除。
4. filters.fieldKey 必须存在且字段类型支持该操作符。
5. sorts.fieldKey 必须存在且字段可排序。
6. 导出动作必须独立校验 export 权限，并按字段权限过滤。
7. 列表查询必须分页。
```

---

## 15. 流程 Workflow DSL

P0 流程定位为轻量企业审批流，不做完整 BPMN。

### 15.1 标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "workflowDef",
  "resourceId": "wf_contract_approval",
  "resourceKey": "contract_approval",
  "resourceName": "合同审批流程",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "workflowKey": "contract_approval",
    "workflowName": "合同审批流程",
    "entityKey": "contract",
    "trigger": {
      "type": "formSubmit",
      "formKey": "contract_apply_form"
    },
    "statusFieldKey": "contract_status",
    "nodes": [
      {
        "id": "start_1",
        "type": "start",
        "name": "开始",
        "initialStatus": "in_approval",
        "starterPermission": {
          "roleKeys": ["contract_user"],
          "departmentKeys": []
        }
      },
      {
        "id": "approve_dept",
        "type": "approval",
        "name": "部门负责人审批",
        "assigneeRule": {
          "type": "initiatorManager"
        },
        "formPermission": {
          "editableFields": [],
          "readonlyFields": ["*"],
          "requiredFields": []
        },
        "rejectStatus": "rejected"
      },
      {
        "id": "approve_legal",
        "type": "approval",
        "name": "法务审批",
        "assigneeRule": {
          "type": "role",
          "roleKeys": ["legal_reviewer"]
        },
        "formPermission": {
          "editableFields": ["legal_opinion", "risk_level"],
          "readonlyFields": ["*"],
          "requiredFields": ["legal_opinion"]
        },
        "rejectStatus": "rejected"
      },
      {
        "id": "branch_amount",
        "type": "condition",
        "name": "金额判断"
      },
      {
        "id": "end_approved",
        "type": "end",
        "name": "审批完成",
        "endStatus": "approved",
        "businessStatus": "archived"
      }
    ],
    "edges": [
      {
        "id": "e1",
        "from": "start_1",
        "to": "approve_dept"
      },
      {
        "id": "e2",
        "from": "approve_dept",
        "to": "approve_legal"
      },
      {
        "id": "e3",
        "from": "approve_legal",
        "to": "branch_amount"
      },
      {
        "id": "e4",
        "from": "branch_amount",
        "to": "end_approved",
        "condition": {
          "priority": 1,
          "expression": {
            "logic": "AND",
            "rules": [
              {
                "field": "contract_amount",
                "operator": "<",
                "value": 100000
              }
            ]
          }
        }
      }
    ]
  }
}
```

### 15.2 节点类型

| type | 中文 | P0 要求 |
|---|---|---|
| start | 开始节点 | 必须有且只有一个。 |
| approval | 审批节点 | P0 核心节点。 |
| condition | 条件节点 | 用于金额、类型等分支。 |
| cc | 抄送节点 | P0 可选。 |
| end | 结束节点 | 至少一个。 |
| parallelGateway | 并行网关 | P1/P2，P0 仅预留。 |

### 15.3 处理人规则

| type | 说明 |
|---|---|
| initiator | 发起人。 |
| initiatorManager | 发起人直属上级。 |
| role | 指定角色。 |
| user | 指定用户。 |
| departmentLeader | 指定部门负责人。 |
| fieldUser | 根据人员字段取处理人。 |
| fieldDepartmentLeader | 根据部门字段取部门负责人。 |

### 15.4 流程校验规则

保存草稿时必须校验：

```text
1. workflowKey 在 app 内唯一。
2. entityKey 存在。
3. trigger.formKey 存在且绑定同一 entity。
4. nodes.id 在流程内唯一。
5. 有且只有一个 start 节点。
6. 至少有一个 end 节点。
7. edges.from 和 edges.to 必须引用有效节点。
8. 条件节点出边必须有条件或默认分支。
9. assigneeRule 必须可解析。
10. formPermission 引用的 fieldKey 必须有效。
```

发布时必须额外校验：

```text
1. 所有审批节点都能解析出处理人或明确允许管理员兜底。
2. 条件分支优先级明确，不存在无法解析的循环。
3. 流程状态字段存在且支持状态写入。
4. 节点字段权限能与表单字段权限合并。
5. 流程不可引用草稿表单或已删除字段。
```

---

## 16. 权限 Permission DSL

P0 权限模型为：

```text
RBAC + 数据范围 + 字段权限 + 流程节点权限
```

### 16.1 应用角色 DSL

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "permissionPolicy",
  "resourceId": "perm_contract_app_roles",
  "resourceKey": "contract_app_roles",
  "resourceName": "合同应用角色权限",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "appRoles": [
      {
        "roleKey": "app_admin",
        "roleName": "应用管理员",
        "permissions": [
          "app.manage",
          "app.design",
          "app.publish",
          "app.audit"
        ]
      },
      {
        "roleKey": "app_user",
        "roleName": "应用使用者",
        "permissions": ["app.access"]
      }
    ]
  }
}
```

### 16.2 对象权限 DSL

```json
{
  "entityKey": "contract",
  "policies": [
    {
      "policyKey": "contract_applicant_self",
      "effect": "allow",
      "principal": {
        "type": "role",
        "key": "contract_applicant"
      },
      "resource": {
        "type": "entity",
        "key": "contract"
      },
      "actions": ["view", "create"],
      "dataScope": {
        "type": "self",
        "fieldKey": "createdBy"
      }
    },
    {
      "policyKey": "department_manager_contract",
      "effect": "allow",
      "principal": {
        "type": "role",
        "key": "department_manager"
      },
      "resource": {
        "type": "entity",
        "key": "contract"
      },
      "actions": ["view", "approve", "export"],
      "dataScope": {
        "type": "department",
        "fieldKey": "ownerDepartment",
        "includeChildren": false
      }
    }
  ]
}
```

### 16.3 字段权限 DSL

```json
{
  "entityKey": "contract",
  "scene": "approval",
  "nodeKey": "legal_review",
  "fieldPolicies": [
    {
      "fieldKey": "contract_name",
      "permission": "readonly"
    },
    {
      "fieldKey": "contract_amount",
      "permission": "readonly"
    },
    {
      "fieldKey": "legal_opinion",
      "permission": "editable",
      "required": true
    },
    {
      "fieldKey": "payment_method",
      "permission": "hidden"
    }
  ]
}
```

### 16.4 数据权限条件 DSL

```json
{
  "type": "condition",
  "logic": "AND",
  "conditions": [
    {
      "field": "ownerDepartment",
      "operator": "eqCurrentUserDepartment"
    },
    {
      "field": "status",
      "operator": "in",
      "value": ["in_approval", "approved", "archived"]
    }
  ]
}
```

### 16.5 权限枚举

#### 16.5.1 数据范围

| type | 说明 |
|---|---|
| all | 全部数据。 |
| self | 本人数据。 |
| department | 本部门数据。 |
| departmentAndChildren | 本部门及下级部门数据。 |
| customCondition | 自定义条件。 |

#### 16.5.2 字段权限

| permission | 说明 |
|---|---|
| hidden | 不可见。 |
| readonly | 只读。 |
| editable | 可编辑。 |
| masked | 脱敏展示。 |

#### 16.5.3 权限合并优先级

P0 建议权限合并顺序如下：

```text
1. 系统安全限制优先。
2. 数据权限先过滤记录集合。
3. 对象动作权限决定是否可执行 view/create/edit/delete/import/export/approve。
4. 字段权限决定返回、展示和写入字段。
5. 流程节点字段权限在审批场景中叠加生效。
6. 多条策略冲突时，deny 优先；无匹配策略默认拒绝。
```

如 P0 首版暂不提供显式 deny 策略，也必须保留 `effect` 字段，默认值为 `allow`。

### 16.6 权限校验规则

```text
1. principal 引用的 user、role、orgUnit 必须存在且有效。
2. resource 引用的 app、entity、form、field、workflow 必须存在且有效。
3. actions 必须来自平台权限动作字典。
4. dataScope.fieldKey 必须存在且字段类型兼容。
5. fieldPolicies.fieldKey 必须存在。
6. 字段权限不仅前端生效，后端返回和写入也必须过滤。
7. 导入、导出、附件下载、批量操作必须独立授权。
8. 权限变更必须进入审计日志。
```

---

## 17. 应用菜单 App Menu DSL

应用菜单用于运行端入口组织。

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "resourceType": "appMenu",
  "resourceId": "menu_contract_list",
  "resourceKey": "contract_list_menu",
  "resourceName": "合同台账",
  "schemaVersion": "1.0",
  "version": 1,
  "status": "draft",
  "metadata": {
    "menuType": "view",
    "targetResourceType": "view",
    "targetResourceKey": "contract_list",
    "icon": "file-text",
    "sortOrder": 10,
    "visible": true,
    "permission": "contract.view"
  }
}
```

规则：

```text
1. 菜单只负责入口组织，不绕过权限系统。
2. targetResourceKey 必须存在。
3. 运行端菜单必须按用户权限过滤。
4. 停用应用时关闭运行入口，不删除菜单配置。
```

---

## 18. 应用元数据包 App Package DSL

应用元数据包用于模板安装、导入导出和环境迁移。

### 18.1 标准结构

```json
{
  "packageType": "appMetadataPackage",
  "schemaVersion": "1.0",
  "exportedAt": "2026-05-06T10:00:00+08:00",
  "exportedBy": "u_001",
  "source": {
    "tenantId": "t_default",
    "environment": "dev"
  },
  "app": {
    "appKey": "contract_management",
    "appName": "合同管理",
    "description": "合同管理样板应用"
  },
  "resources": {
    "entities": [],
    "forms": [],
    "views": [],
    "workflows": [],
    "permissions": [],
    "menus": [],
    "roles": []
  },
  "manifest": {
    "resourceCount": 0,
    "checksum": "",
    "dependencies": []
  }
}
```

### 18.2 导入规则

```text
1. 导入前校验 packageType 和 schemaVersion。
2. appKey 冲突时 P0 默认要求重命名，不覆盖已有应用。
3. resourceKey 冲突时要求重命名或中止导入。
4. 导入时重新生成 resourceId，但保留 resourceKey。
5. 导入后必须执行全量依赖校验。
6. 导入完成后应用默认处于 draft，不自动发布。
7. P0 应用元数据包默认不包含业务数据。
```

### 18.3 导出规则

```text
1. 导出范围默认只包含元数据，不包含业务记录。
2. 导出必须受 app.export 权限控制。
3. 导出时应包含 schemaVersion、资源清单、依赖清单和校验摘要。
4. 导出内容必须过滤敏感运行数据和用户密钥。
5. 导出操作必须记录审计日志。
```

---

## 19. 元数据快照 Metadata Snapshot DSL

元数据快照是发布后运行时的唯一可信配置来源。

### 19.1 快照标准结构

```json
{
  "tenantId": "t_default",
  "appId": "app_contract",
  "appKey": "contract_management",
  "snapshotId": "snap_contract_v3",
  "versionId": "app_version_3",
  "versionNo": "v3",
  "schemaVersion": "1.0",
  "releasedAt": "2026-05-06T10:00:00+08:00",
  "releasedBy": "u_001",
  "releaseNote": "合同管理 P0 基线版本",
  "app": {
    "appKey": "contract_management",
    "appName": "合同管理",
    "status": "active"
  },
  "menus": [],
  "entities": [],
  "forms": [],
  "views": [],
  "workflows": [],
  "permissions": {
    "roles": [],
    "policies": [],
    "fieldPolicies": []
  },
  "manifest": {
    "resourceCount": 0,
    "resourceVersions": [],
    "checksum": ""
  }
}
```

### 19.2 快照生成规则

```text
1. 发布前读取当前设计态草稿资源。
2. 执行对象、字段、表单、流程、权限、菜单、视图的全量校验。
3. 校验通过后生成 appVersion。
4. 将所有运行态需要的 DSL 合并为 metadataSnapshot。
5. 写入 snapshotHash / checksum，用于完整性校验。
6. 更新 runtimePointer 指向新版本。
7. 发布失败不得修改 runtimePointer。
8. 快照生成、发布成功、发布失败都必须记录审计日志。
```

### 19.3 快照不可变规则

```text
1. metadataSnapshot 写入后不得直接编辑。
2. 若需要修改配置，必须进入设计态产生新草稿并重新发布。
3. 回滚只调整 runtimePointer 到历史 snapshot。
4. 快照损坏时禁止回滚到该版本。
5. 运行时发现快照缺失或解析失败，应返回应用配置异常。
```

### 19.4 快照内容裁剪

运行时快照不一定需要保存设计器所需的全部 UI 编辑信息。

P0 建议分为：

| 内容 | 是否进入快照 | 说明 |
|---|---:|---|
| entity 字段定义 | 是 | 运行时数据校验、列表、表单依赖。 |
| form 运行结构 | 是 | 渲染新建、编辑、查看、审批页。 |
| workflow 执行结构 | 是 | 发起、流转、任务生成。 |
| permission 策略 | 是 | 服务端权限校验。 |
| view 列表结构 | 是 | 运行端列表台账。 |
| menu 入口 | 是 | 运行端导航。 |
| 设计器画布坐标 | 可选 | 仅设计器需要，运行端可不需要。 |
| 审计日志 | 否 | 独立存储，不进入快照。 |
| 业务数据 | 否 | 存储在通用业务记录表。 |
| 用户密码、密钥 | 否 | 禁止进入快照。 |

---

## 20. 业务数据 JSON 规范

P0 业务数据采用通用记录表 + dataJson 存储。

### 20.1 记录结构建议

```json
{
  "recordId": "rec_001",
  "tenantId": "t_default",
  "appId": "app_contract",
  "entityKey": "contract",
  "versionId": "app_version_3",
  "status": "in_approval",
  "dataJson": {
    "contract_no": "HT20260001",
    "contract_name": "办公设备采购合同",
    "contract_amount": "120000.00",
    "contract_type": "purchase",
    "counterparty_id": "rec_supplier_001",
    "contract_files": [
      {
        "fileId": "file_001",
        "fileName": "合同正文.pdf",
        "size": 204800
      }
    ]
  },
  "createdBy": "u_001",
  "createdAt": "2026-05-06T10:00:00+08:00",
  "updatedBy": "u_001",
  "updatedAt": "2026-05-06T10:00:00+08:00"
}
```

### 20.2 dataJson 规则

```text
1. dataJson 的 key 必须使用 fieldKey。
2. 系统字段可以同时存在于通用记录表公共字段和 dataJson，最终以后端规范为准。
3. 金额建议使用 decimal 字符串或数据库 decimal，避免浮点误差。
4. 日期统一使用 YYYY-MM-DD。
5. 日期时间统一使用 ISO 8601 并带时区。
6. 附件和图片存储 fileId 引用，不直接存储文件内容。
7. lookup 默认存储目标 recordId，可冗余 displayValue 用于历史展示。
8. 已删除字段的历史值可以保留在 dataJson 中，但运行态不展示或按历史快照解释。
```

### 20.3 索引字段规则

```text
1. 不是所有 JSON 字段都建立索引。
2. 只有 searchable、sortable、indexable 或高频过滤字段进入索引表/索引列。
3. 索引配置变更通过发布生效。
4. 索引字段必须受数据权限和字段权限过滤。
5. P0 不针对千万级单对象数据做极致优化。
```

---

## 21. 存储映射建议

### 21.1 元数据存储表

后续数据库设计文档可基于以下逻辑表展开：

| 表名 | 说明 |
|---|---|
| lc_app | 应用定义。 |
| lc_app_version | 应用发布版本。 |
| lc_metadata_resource | 通用元数据资源表，可存储各类 DSL。 |
| lc_entity_def | 对象定义。 |
| lc_entity_version | 对象版本。 |
| lc_field_def | 字段定义。 |
| lc_form_def | 表单定义。 |
| lc_form_version | 表单版本。 |
| lc_view_def | 视图定义。 |
| lc_workflow_def | 流程定义。 |
| lc_workflow_version | 流程版本。 |
| lc_permission_policy | 权限策略。 |
| lc_metadata_snapshot | 元数据快照。 |
| lc_metadata_dependency | 元数据依赖关系。 |
| lc_metadata_publish_log | 元数据发布日志。 |

### 21.2 通用元数据资源表建议字段

```text
id
tenant_id
app_id
resource_type
resource_key
resource_name
schema_version
version
status
draft_json
published_json
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
1. P0 可以选择统一资源表 + 模块扩展表，也可以按模块拆表。
2. 对于表单、流程等结构复杂资源，建议保留完整 JSON。
3. 高频查询字段可冗余到列中，例如 app_id、resource_type、resource_key、status。
4. 发布后的不可变内容建议进入 version 表或 snapshot 表，不依赖 draft_json。
```

### 21.3 业务记录表建议字段

```text
id
tenant_id
app_id
entity_id
entity_key
version_id
record_no
status
data_json
created_by
created_dept_id
created_at
updated_by
updated_at
deleted_by
deleted_at
is_deleted
version
```

### 21.4 记录索引表建议字段

```text
id
tenant_id
app_id
entity_key
record_id
field_key
field_type
string_value
number_value
datetime_value
bool_value
created_at
updated_at
```

说明：

```text
1. 同一个字段根据 fieldType 写入对应 value 列。
2. 列表筛选和排序优先走索引表或冗余列。
3. 查询结果仍需回表读取 dataJson 并执行字段权限过滤。
```

---

## 22. API 协议建议

### 22.1 设计态接口

设计态接口用于创建、编辑、校验和预览 DSL。

```text
GET    /api/apps/{appId}/metadata/resources
POST   /api/apps/{appId}/metadata/resources
GET    /api/apps/{appId}/metadata/resources/{resourceId}
PUT    /api/apps/{appId}/metadata/resources/{resourceId}
DELETE /api/apps/{appId}/metadata/resources/{resourceId}
POST   /api/apps/{appId}/metadata/resources/{resourceId}/validate
GET    /api/apps/{appId}/metadata/resources/{resourceId}/dependencies
```

模块也可以保留更友好的专用接口：

```text
POST   /api/apps/{appId}/entities
POST   /api/apps/{appId}/forms
POST   /api/apps/{appId}/workflows
PUT    /api/apps/{appId}/permissions
```

### 22.2 发布接口

```text
POST   /api/apps/{appId}/release/validate
POST   /api/apps/{appId}/release
GET    /api/apps/{appId}/versions
GET    /api/apps/{appId}/versions/{versionId}
GET    /api/apps/{appId}/versions/{versionId}/snapshot
POST   /api/apps/{appId}/versions/{versionId}/rollback
```

### 22.3 运行态接口

运行态接口只能读取已发布快照。

```text
GET    /api/runtime/apps/{appKey}
GET    /api/runtime/apps/{appKey}/menus
GET    /api/runtime/apps/{appKey}/views/{viewKey}
GET    /api/runtime/apps/{appKey}/forms/{formKey}
GET    /api/runtime/apps/{appKey}/entities/{entityKey}/records
POST   /api/runtime/apps/{appKey}/entities/{entityKey}/records
GET    /api/runtime/apps/{appKey}/entities/{entityKey}/records/{recordId}
PUT    /api/runtime/apps/{appKey}/entities/{entityKey}/records/{recordId}
POST   /api/runtime/workflows/{workflowKey}/start
POST   /api/runtime/tasks/{taskId}/approve
POST   /api/runtime/tasks/{taskId}/reject
```

### 22.4 接口安全规则

```text
1. 设计态接口校验设计权限。
2. 发布接口校验 app.release 权限。
3. 运行态接口校验 app.access 及具体资源权限。
4. 所有写接口必须校验 CSRF/鉴权/租户/应用边界。
5. 前端传入的 DSL 必须经过服务端结构校验和权限校验。
```

---

## 23. 元数据校验机制

### 23.1 校验阶段

| 阶段 | 校验目标 |
|---|---|
| 保存草稿 | 保证 JSON 结构合法、枚举合法、基础字段完整。 |
| 预览 | 保证当前资源可被设计器或运行时局部解析。 |
| 发布前 | 保证应用内所有资源完整、依赖有效、权限可执行。 |
| 导入前 | 保证包结构合法、schemaVersion 兼容、编码冲突可处理。 |
| 运行时 | 防止快照损坏、越权访问、数据类型不匹配。 |

### 23.2 通用校验项

```text
1. JSON 格式合法。
2. 公共头必填字段完整。
3. resourceType 属于枚举。
4. schemaVersion 兼容。
5. resourceKey 唯一。
6. status 合法。
7. metadata 结构与 resourceType 匹配。
8. 引用资源存在且未删除。
9. 字段类型与组件、条件、索引、权限兼容。
10. 不包含任意脚本、密钥、敏感运行数据。
```

### 23.3 发布校验项

```text
1. 应用至少包含一个主业务对象。
2. 每个运行菜单目标存在。
3. 每个表单绑定有效对象。
4. 每个字段组件绑定有效字段。
5. 每个视图列、筛选、排序字段有效。
6. 每个流程 start/end/approval/condition 结构有效。
7. 每个审批节点处理人规则可解析。
8. 每个权限策略引用主体和资源有效。
9. 导入导出权限、附件下载权限、字段权限策略完整。
10. 所有运行态需要的资源均可进入 metadataSnapshot。
```

### 23.4 校验结果结构

```json
{
  "valid": false,
  "errors": [
    {
      "code": "FIELD_NOT_FOUND",
      "level": "error",
      "resourceType": "form",
      "resourceKey": "contract_apply_form",
      "path": "metadata.components[0].children[1].fieldKey",
      "message": "字段 contract_amount 不存在或已删除"
    }
  ],
  "warnings": [
    {
      "code": "FIELD_NOT_INDEXED",
      "level": "warning",
      "resourceType": "view",
      "resourceKey": "contract_list",
      "path": "metadata.filters[0].fieldKey",
      "message": "筛选字段未配置索引，数据量较大时可能影响查询性能"
    }
  ]
}
```

---

## 24. 兼容性与迁移

### 24.1 向前兼容规则

```text
1. 读取端必须忽略未知的非必需字段。
2. 新增可选字段不得破坏旧 DSL。
3. 新增枚举值必须有默认兜底行为。
4. 旧版本快照必须能继续被运行时读取。
5. 删除字段或修改字段语义必须提供迁移策略。
```

### 24.2 迁移任务建议结构

```json
{
  "migrationId": "mig_schema_1_0_to_1_1",
  "fromSchemaVersion": "1.0",
  "toSchemaVersion": "1.1",
  "resourceTypes": ["form", "workflowDef"],
  "steps": [
    {
      "type": "renameField",
      "path": "metadata.layout.pcColumns",
      "newPath": "metadata.layout.desktopColumns"
    }
  ]
}
```

P0 可以不实现完整自动迁移框架，但数据库设计和代码结构应预留 migration 入口。

---

## 25. 安全与权限约束

```text
1. DSL 是配置，不是可信代码。
2. 任何来自前端的 DSL 都必须经过服务端校验。
3. 运行态必须基于 metadataSnapshot 和服务端权限判断执行。
4. 字段 hidden 时，后端不得返回字段值。
5. 字段 readonly 时，后端不得接受写入变更。
6. 导出必须按数据权限和字段权限过滤。
7. 附件下载必须独立校验权限。
8. 权限策略、发布快照、回滚操作必须写审计日志。
9. metadataSnapshot 不得包含密码、密钥、访问令牌等敏感信息。
10. 超级管理员操作不得绕过审计。
```

---

## 26. 审计与 Diff 规范

### 26.1 必须审计的 DSL 操作

```text
1. 创建资源
2. 修改资源
3. 删除资源
4. 恢复资源
5. 停用资源
6. 发布应用
7. 回滚版本
8. 导入元数据包
9. 导出元数据包
10. 修改权限策略
```

### 26.2 Diff 建议结构

```json
{
  "resourceType": "field",
  "resourceKey": "contract.contract_amount",
  "changeType": "update",
  "before": {
    "required": false
  },
  "after": {
    "required": true
  },
  "changedBy": "u_001",
  "changedAt": "2026-05-06T10:00:00+08:00",
  "reason": "合同金额改为必填"
}
```

规则：

```text
1. 审计日志不要求保存完整 DSL 全量副本，但必须能追踪关键差异。
2. 发布日志必须关联 appVersion、snapshotId、发布人、发布时间和发布说明。
3. 回滚日志必须记录来源版本、目标版本和原因。
```

---

## 27. AI 生成约束

后续使用 AI 生成数据库、API、前端、测试用例或样板应用配置时，必须遵循以下规则：

```text
1. 不要为每个业务对象生成独立物理表，P0 默认采用通用记录表 + JSON 数据字段。
2. 不要把合同、报销、采购写死成固定业务页面，必须基于元数据动态渲染。
3. 不要生成完整 BPMN 引擎，只生成 P0 轻量审批流能力。
4. 不要在 DSL 中生成可执行脚本。
5. 不要绕过权限系统直接访问数据。
6. 不要让运行时读取草稿 DSL。
7. 不要修改已发布 metadataSnapshot。
8. 不要忽略 tenantId，即使 P0 是单租户。
9. 不要混用 object/model/table 表示业务对象，统一使用 Entity。
10. 不要使用 fieldCode 与 fieldKey 混乱命名；后续统一优先使用 fieldKey。
11. 不要使用 objectCode 与 entityKey 混乱命名；后续统一优先使用 entityKey。
12. 生成测试用例时必须覆盖 DSL 校验、依赖缺失、权限过滤、发布快照、回滚和历史字段解释。
```

兼容说明：已有主干文档示例中出现的 `objectCode`、`objectKey`、`fieldCode` 可以视为历史表达。后续新文档与新代码建议统一收敛为：

```text
objectCode / objectKey → entityKey
fieldCode → fieldKey
workflowCode → workflowKey
formCode → formKey
```

---

## 28. P0 样板应用覆盖要求

DSL 规范必须支持以下三个样板应用。

### 28.1 合同管理

必须覆盖：

```text
1. 合同主对象
2. 合同编号自动生成
3. 合同金额字段
4. 合同相对方 lookup
5. 合同附件
6. 法务审批字段权限
7. 财务审批字段权限
8. 合同台账视图
9. 合同归档状态
```

### 28.2 费用报销

必须覆盖：

```text
1. 报销主对象
2. 报销明细子表
3. 金额汇总字段
4. 发票附件
5. 部门负责人审批
6. 财务审批
7. 移动端 H5 提交
8. 按本人/部门数据权限查看
```

### 28.3 采购申请

必须覆盖：

```text
1. 采购申请主对象
2. 采购明细子表
3. 供应商 lookup
4. 金额条件分支
5. 采购员/部门负责人审批
6. 采购台账
7. 导入导出权限
```

---

## 29. 最小端到端示例

以下示例展示一个合同金额字段从对象、表单、流程、权限到快照的引用链路。

### 29.1 对象字段

```json
{
  "fieldKey": "contract_amount",
  "fieldName": "合同金额",
  "fieldType": "money",
  "required": true,
  "indexable": true,
  "validation": {
    "min": "0.01",
    "precision": 2
  }
}
```

### 29.2 表单组件

```json
{
  "id": "cmp_contract_amount",
  "type": "money",
  "fieldKey": "contract_amount",
  "label": "合同金额",
  "required": true
}
```

### 29.3 流程条件

```json
{
  "from": "branch_amount",
  "to": "approve_finance",
  "condition": {
    "priority": 1,
    "expression": {
      "logic": "AND",
      "rules": [
        {
          "field": "contract_amount",
          "operator": ">=",
          "value": 100000
        }
      ]
    }
  }
}
```

### 29.4 字段权限

```json
{
  "fieldKey": "contract_amount",
  "permission": "readonly"
}
```

### 29.5 业务数据

```json
{
  "dataJson": {
    "contract_amount": "120000.00"
  }
}
```

### 29.6 运行时解释规则

```text
1. 运行时从 metadataSnapshot 读取 contract_amount 的字段定义。
2. 表单渲染器根据 fieldType=money 选择金额组件。
3. 数据服务根据 validation 校验金额格式和最小值。
4. 流程引擎根据条件表达式决定是否进入财务审批。
5. 权限服务根据字段权限决定是否返回、展示或允许写入该字段。
6. 列表查询如按合同金额排序，可读取索引表或索引列。
```

---

## 30. 后续文档衔接

本文档将被以下后续文档引用：

| 后续文档 | 依赖本文档的内容 |
|---|---|
| 20-system-architecture-design.md | 元数据服务、发布服务、运行时渲染服务、权限服务边界。 |
| 30-core-database-design.md | 元数据表、通用记录表、索引表、快照表设计。 |
| API 设计文档 | 设计态、发布态、运行态接口协议。 |
| 前端设计文档 | 表单渲染器、视图渲染器、流程审批页、权限过滤。 |
| 测试设计文档 | DSL 校验、依赖检查、发布快照、权限过滤、回滚。 |

后续文档不得重新定义与本文档冲突的 DSL 公共头、命名、版本、发布快照和权限校验规则。如确需修改，应先更新本文档并记录决策日志。

---

## 31. 附录：P0 DSL 必须遵守的十条红线

```text
1. 所有核心配置必须元数据化。
2. 所有 DSL/API 属性名必须优先使用 camelCase。
3. 所有业务对象统一称为 Entity，不再混用 Object / Model / Table。
4. 所有核心 DSL 必须有 tenantId。
5. 所有可发布资源必须有 resourceType、resourceKey、schemaVersion、version、status。
6. 所有运行态接口必须读取 metadataSnapshot，不读取草稿。
7. metadataSnapshot 发布后不可修改。
8. 字段权限、数据权限、流程节点权限必须服务端生效。
9. 业务数据默认进入通用记录表 dataJson，不为每个对象动态建物理表。
10. P0 DSL 不允许保存或执行任意脚本。
```
