import type { RuntimeModelStub } from "@lowcode/runtime-contracts";

export const mockApps = [
  {
    appId: "app_contract_management",
    appKey: "contract_management",
    appName: "合同管理",
    description: "合同台账、附件、法务与财务审批的样板应用",
    status: "published",
    defaultEntityKey: "contract",
    categoryName: "合同管理",
    ownerName: "王法务",
    creatorName: "系统管理员",
    createdAt: "2026-05-07 09:10",
    updatedAt: "2026-05-07 16:20",
    publishedAt: "2026-05-07 10:00",
    relation: "managed"
  },
  {
    appId: "app_expense_report",
    appKey: "expense_report",
    appName: "费用报销",
    description: "报销明细、发票附件、部门负责人与财务审批的样板应用",
    status: "published",
    defaultEntityKey: "expense_report",
    categoryName: "财务管理",
    ownerName: "李财务",
    creatorName: "系统管理员",
    createdAt: "2026-05-07 09:12",
    updatedAt: "2026-05-07 15:45",
    publishedAt: "2026-05-07 10:15",
    relation: "used"
  },
  {
    appId: "app_purchase_request",
    appKey: "purchase_request",
    appName: "采购申请",
    description: "采购明细、供应商 lookup、金额条件分支审批的样板应用",
    status: "draft",
    defaultEntityKey: "purchase_request",
    categoryName: "采购供应链",
    ownerName: "赵采购",
    creatorName: "实施顾问",
    createdAt: "2026-05-07 13:20",
    updatedAt: "2026-05-07 14:10",
    publishedAt: undefined,
    relation: "created"
  },
  {
    appId: "app_asset_archive",
    appKey: "asset_archive",
    appName: "资产档案",
    description: "固定资产登记、状态跟踪和责任人维护的停用样板应用",
    status: "disabled",
    defaultEntityKey: "asset",
    categoryName: "资产管理",
    ownerName: "周行政",
    creatorName: "系统管理员",
    createdAt: "2026-05-06 11:30",
    updatedAt: "2026-05-06 17:05",
    publishedAt: "2026-05-06 15:20",
    relation: "managed"
  }
] as const;

export const mockRuntimeModels: Record<string, RuntimeModelStub> = {
  app_contract_management: {
    appId: "app_contract_management",
    appKey: "contract_management",
    appName: "合同管理",
    snapshotId: "snap_contract_v1",
    entities: [
      {
        entityKey: "contract",
        entityName: "合同主对象",
        primaryFieldKey: "contract_name",
        fields: [
          { fieldKey: "contract_no", fieldName: "合同编号", fieldType: "text", required: true, readonly: true },
          { fieldKey: "contract_name", fieldName: "合同名称", fieldType: "text", required: true },
          { fieldKey: "contract_amount", fieldName: "合同金额", fieldType: "money", required: true },
          { fieldKey: "counterparty", fieldName: "合同相对方", fieldType: "lookup", required: true },
          { fieldKey: "attachments", fieldName: "合同附件", fieldType: "attachment" },
          { fieldKey: "archive_status", fieldName: "归档状态", fieldType: "select", readonly: true }
        ]
      }
    ],
    views: [{ viewKey: "contract_ledger", viewName: "合同台账", entityKey: "contract", columns: ["contract_no", "contract_name", "contract_amount", "counterparty", "archive_status"] }],
    actions: [
      { actionKey: "create", actionName: "新建合同", type: "create" },
      { actionKey: "submit", actionName: "提交审批", type: "submit" }
    ]
  },
  app_expense_report: {
    appId: "app_expense_report",
    appKey: "expense_report",
    appName: "费用报销",
    snapshotId: "snap_expense_v1",
    entities: [
      {
        entityKey: "expense_report",
        entityName: "报销主对象",
        primaryFieldKey: "title",
        fields: [
          { fieldKey: "title", fieldName: "报销标题", fieldType: "text", required: true },
          { fieldKey: "details", fieldName: "报销明细", fieldType: "subtable", required: true },
          { fieldKey: "total_amount", fieldName: "金额汇总", fieldType: "money", required: true, readonly: true },
          { fieldKey: "invoice_files", fieldName: "发票附件", fieldType: "attachment" },
          { fieldKey: "department", fieldName: "所属部门", fieldType: "lookup", readonly: true }
        ]
      }
    ],
    views: [{ viewKey: "my_expenses", viewName: "我的报销", entityKey: "expense_report", columns: ["title", "total_amount", "department"] }],
    actions: [
      { actionKey: "create", actionName: "新建报销", type: "create" },
      { actionKey: "submit", actionName: "提交审批", type: "submit" }
    ]
  },
  app_purchase_request: {
    appId: "app_purchase_request",
    appKey: "purchase_request",
    appName: "采购申请",
    snapshotId: "snap_purchase_v1",
    entities: [
      {
        entityKey: "purchase_request",
        entityName: "采购申请主对象",
        primaryFieldKey: "title",
        fields: [
          { fieldKey: "title", fieldName: "采购标题", fieldType: "text", required: true },
          { fieldKey: "supplier", fieldName: "供应商", fieldType: "lookup", required: true },
          { fieldKey: "items", fieldName: "采购明细", fieldType: "subtable", required: true },
          { fieldKey: "total_amount", fieldName: "采购金额", fieldType: "money", required: true },
          { fieldKey: "import_export_scope", fieldName: "导入导出权限", fieldType: "select", readonly: true }
        ]
      }
    ],
    views: [{ viewKey: "purchase_ledger", viewName: "采购台账", entityKey: "purchase_request", columns: ["title", "supplier", "total_amount"] }],
    actions: [
      { actionKey: "create", actionName: "新建采购申请", type: "create" },
      { actionKey: "submit", actionName: "提交审批", type: "submit" }
    ]
  }
};

const appMetadataPackage = {
  version: "p0-metadata-v1",
  includes: [
    "app.json",
    "objects.json",
    "fields.json",
    "forms.json",
    "views.json",
    "workflows.json",
    "permissions.json",
    "dashboards.json",
    "menus.json",
    "version.json",
    "manifest.json"
  ],
  excludes: ["业务运行数据", "流程实例数据", "审批任务数据", "审计日志", "用户账号和组织架构", "文件附件实体"]
};

export const mockAppDetails = {
  app_contract_management: {
    app: mockApps[0],
    currentVersion: "v1.0",
    latestPublisherName: "系统管理员",
    createdAt: "2026-05-07 09:10",
    resourceStats: {
      objectCount: 1,
      formCount: 2,
      viewCount: 1,
      workflowCount: 1,
      dashboardCount: 1,
      memberCount: 4,
      recentOperationCount: 5
    },
    resources: [
      {
        resourceId: "object_contract",
        resourceType: "object",
        resourceName: "合同主对象",
        description: "合同编号、名称、金额、相对方和归档状态字段。",
        path: "/apps/app_contract_management/models",
        status: "ready"
      },
      {
        resourceId: "form_contract_main",
        resourceType: "form",
        resourceName: "合同登记表",
        description: "合同登记、附件上传和提交审批入口。",
        path: "/apps/app_contract_management/forms",
        status: "ready"
      },
      {
        resourceId: "view_contract_ledger",
        resourceType: "view",
        resourceName: "合同台账",
        description: "按合同编号、金额、相对方和归档状态展示。",
        path: "/runtime/apps/app_contract_management/entities/contract/list",
        status: "ready"
      },
      {
        resourceId: "workflow_contract_approval",
        resourceType: "workflow",
        resourceName: "合同审批流程",
        description: "提交申请、法务审批和财务备案节点。",
        path: "/apps/app_contract_management/workflows",
        status: "ready"
      },
      {
        resourceId: "permission_contract_roles",
        resourceType: "permission",
        resourceName: "合同权限矩阵",
        description: "应用管理员、设计者、使用者和只读者的入口。",
        path: "/apps/app_contract_management/permissions",
        status: "ready"
      },
      {
        resourceId: "release_contract_v1",
        resourceType: "release",
        resourceName: "发布版本 v1.0",
        description: "当前运行指针指向 snap_contract_v1。",
        path: "/apps/app_contract_management/releases",
        status: "ready"
      }
    ],
    members: [
      { memberId: "m_contract_owner", memberName: "王法务", roleName: "应用所有者", principalType: "user", updatedAt: "2026-05-07 09:10" },
      { memberId: "m_contract_admin", memberName: "系统管理员", roleName: "应用管理员", principalType: "role", updatedAt: "2026-05-07 09:15" },
      { memberId: "m_contract_designer", memberName: "实施顾问", roleName: "应用设计者", principalType: "user", updatedAt: "2026-05-07 09:20" },
      { memberId: "m_contract_user", memberName: "法务部", roleName: "应用使用者", principalType: "org", updatedAt: "2026-05-07 09:30" }
    ],
    operationLogs: [
      { logId: "op_contract_publish", action: "publish", operatorName: "系统管理员", occurredAt: "2026-05-07 10:00", result: "success", summary: "发布合同管理 v1.0 并生成运行快照。" },
      { logId: "op_contract_member", action: "member_change", operatorName: "王法务", occurredAt: "2026-05-07 09:30", result: "success", summary: "新增法务部为应用使用者。" },
      { logId: "op_contract_edit", action: "edit", operatorName: "实施顾问", occurredAt: "2026-05-07 09:25", result: "success", summary: "调整合同登记表字段布局。" },
      { logId: "op_contract_create", action: "create", operatorName: "系统管理员", occurredAt: "2026-05-07 09:10", result: "success", summary: "从合同管理模板创建应用。" }
    ],
    metadataPackage: {
      packageName: "contract_management_p0_metadata.zip",
      ...appMetadataPackage
    }
  },
  app_expense_report: {
    app: mockApps[1],
    currentVersion: "v1.0",
    latestPublisherName: "系统管理员",
    createdAt: "2026-05-07 09:12",
    resourceStats: {
      objectCount: 1,
      formCount: 2,
      viewCount: 1,
      workflowCount: 1,
      dashboardCount: 1,
      memberCount: 4,
      recentOperationCount: 4
    },
    resources: [
      {
        resourceId: "object_expense",
        resourceType: "object",
        resourceName: "报销主对象",
        description: "报销标题、明细、金额汇总、发票附件和部门字段。",
        path: "/apps/app_expense_report/models",
        status: "ready"
      },
      {
        resourceId: "form_expense_main",
        resourceType: "form",
        resourceName: "费用报销表",
        description: "报销明细、附件和提交审批表单。",
        path: "/apps/app_expense_report/forms",
        status: "ready"
      },
      {
        resourceId: "workflow_expense_finance",
        resourceType: "workflow",
        resourceName: "财务审批流程",
        description: "部门负责人审批后进入财务复核。",
        path: "/apps/app_expense_report/workflows",
        status: "ready"
      }
    ],
    members: [
      { memberId: "m_expense_owner", memberName: "李财务", roleName: "应用所有者", principalType: "user", updatedAt: "2026-05-07 09:12" },
      { memberId: "m_expense_admin", memberName: "财务管理员", roleName: "应用管理员", principalType: "role", updatedAt: "2026-05-07 09:18" },
      { memberId: "m_expense_user", memberName: "全体员工", roleName: "应用使用者", principalType: "org", updatedAt: "2026-05-07 09:35" }
    ],
    operationLogs: [
      { logId: "op_expense_publish", action: "publish", operatorName: "系统管理员", occurredAt: "2026-05-07 10:15", result: "success", summary: "发布费用报销 v1.0。" },
      { logId: "op_expense_import", action: "import", operatorName: "实施顾问", occurredAt: "2026-05-07 09:40", result: "success", summary: "校验模板元数据并初始化报销应用。" }
    ],
    metadataPackage: {
      packageName: "expense_report_p0_metadata.zip",
      ...appMetadataPackage
    }
  },
  app_purchase_request: {
    app: mockApps[2],
    currentVersion: undefined,
    latestPublisherName: undefined,
    createdAt: "2026-05-07 13:20",
    resourceStats: {
      objectCount: 1,
      formCount: 1,
      viewCount: 1,
      workflowCount: 1,
      dashboardCount: 0,
      memberCount: 3,
      recentOperationCount: 3
    },
    resources: [
      {
        resourceId: "object_purchase",
        resourceType: "object",
        resourceName: "采购申请主对象",
        description: "采购标题、供应商、明细、金额和导入导出权限字段。",
        path: "/apps/app_purchase_request/models",
        status: "draft"
      },
      {
        resourceId: "form_purchase_main",
        resourceType: "form",
        resourceName: "采购申请表",
        description: "采购申请录入和供应商 lookup 配置。",
        path: "/apps/app_purchase_request/forms",
        status: "draft"
      },
      {
        resourceId: "workflow_purchase_amount",
        resourceType: "workflow",
        resourceName: "采购金额分支审批",
        description: "按采购金额进入不同审批节点。",
        path: "/apps/app_purchase_request/workflows",
        status: "warning"
      }
    ],
    members: [
      { memberId: "m_purchase_owner", memberName: "赵采购", roleName: "应用所有者", principalType: "user", updatedAt: "2026-05-07 13:20" },
      { memberId: "m_purchase_designer", memberName: "实施顾问", roleName: "应用设计者", principalType: "user", updatedAt: "2026-05-07 13:25" }
    ],
    operationLogs: [
      { logId: "op_purchase_create", action: "create", operatorName: "实施顾问", occurredAt: "2026-05-07 13:20", result: "success", summary: "创建采购申请草稿应用。" },
      { logId: "op_purchase_edit", action: "edit", operatorName: "实施顾问", occurredAt: "2026-05-07 14:10", result: "success", summary: "配置供应商 lookup 和采购金额字段。" }
    ],
    metadataPackage: {
      packageName: "purchase_request_p0_metadata.zip",
      ...appMetadataPackage
    }
  }
} as const;

export const mockRecords = [
  {
    recordId: "rec_contract_001",
    appId: "app_contract_management",
    entityKey: "contract",
    appVersionId: "appver_contract_v1",
    snapshotId: "snap_contract_v1",
    recordVersion: 1,
    businessStatus: "active",
    workflowStatus: "in_approval",
    data: {
      contract_no: "HT-2026-0001",
      contract_name: "年度软件服务合同",
      contract_amount: 128000,
      counterparty: "上海示例科技有限公司",
      archive_status: "待归档"
    }
  },
  {
    recordId: "rec_expense_001",
    appId: "app_expense_report",
    entityKey: "expense_report",
    appVersionId: "appver_expense_v1",
    snapshotId: "snap_expense_v1",
    recordVersion: 1,
    businessStatus: "active",
    workflowStatus: "draft",
    data: {
      title: "客户拜访差旅报销",
      total_amount: 2360,
      department: "产品部"
    }
  },
  {
    recordId: "rec_purchase_001",
    appId: "app_purchase_request",
    entityKey: "purchase_request",
    appVersionId: "appver_purchase_v1",
    snapshotId: "snap_purchase_v1",
    recordVersion: 1,
    businessStatus: "active",
    workflowStatus: "approved",
    data: {
      title: "研发测试服务器采购",
      supplier: "杭州样例供应商有限公司",
      total_amount: 86000
    }
  }
];

export const mockTasks = [
  {
    taskId: "task_contract_legal_001",
    appId: "app_contract_management",
    appName: "合同管理",
    entityKey: "contract",
    recordId: "rec_contract_001",
    workflowInstanceId: "wf_contract_001",
    snapshotId: "snap_contract_v1",
    taskName: "法务审批",
    taskVersion: 1,
    assigneeName: "系统管理员",
    applicantName: "张三",
    status: "todo",
    createdAt: "2026-05-07 09:30",
    completedAt: undefined,
    summary: "年度软件服务合同待法务审批"
  },
  {
    taskId: "task_expense_finance_001",
    appId: "app_expense_report",
    appName: "费用报销",
    entityKey: "expense_report",
    recordId: "rec_expense_001",
    workflowInstanceId: "wf_expense_001",
    snapshotId: "snap_expense_v1",
    taskName: "财务复核",
    taskVersion: 2,
    assigneeName: "系统管理员",
    applicantName: "李四",
    status: "done",
    createdAt: "2026-05-06 14:20",
    completedAt: "2026-05-06 16:10",
    summary: "客户拜访差旅报销已审批通过"
  }
] as const;

export const mockWorkflowTraces = [
  {
    traceId: "trace_contract_submit",
    taskId: "task_contract_legal_001",
    nodeName: "提交申请",
    actionType: "submit",
    operatorName: "张三",
    opinion: "提交合同审批",
    createdAt: "2026-05-07 09:30"
  },
  {
    traceId: "trace_contract_legal",
    taskId: "task_contract_legal_001",
    nodeName: "法务审批",
    actionType: "pending",
    operatorName: "系统管理员",
    opinion: "等待处理",
    createdAt: "2026-05-07 09:31"
  },
  {
    traceId: "trace_expense_submit",
    taskId: "task_expense_finance_001",
    nodeName: "提交申请",
    actionType: "submit",
    operatorName: "李四",
    opinion: "提交报销审批",
    createdAt: "2026-05-06 14:20"
  },
  {
    traceId: "trace_expense_finance",
    taskId: "task_expense_finance_001",
    nodeName: "财务复核",
    actionType: "approve",
    operatorName: "系统管理员",
    opinion: "票据齐全，同意报销",
    createdAt: "2026-05-06 16:10"
  }
] as const;

export const mockReleaseRecords = [
  {
    releaseId: "rel_contract_v1",
    appId: "app_contract_management",
    versionName: "合同管理 v1.0",
    snapshotId: "snap_contract_v1",
    status: "published",
    publisherName: "系统管理员",
    publishedAt: "2026-05-07 10:00",
    changeSummary: "初始化合同台账、合同审批流程和基础权限。"
  },
  {
    releaseId: "rel_expense_v1",
    appId: "app_expense_report",
    versionName: "费用报销 v1.0",
    snapshotId: "snap_expense_v1",
    status: "published",
    publisherName: "系统管理员",
    publishedAt: "2026-05-07 10:15",
    changeSummary: "初始化报销主对象、发票附件和财务审批。"
  }
] as const;

export const mockFiles = [
  {
    fileId: "file_contract_001",
    fileName: "年度软件服务合同.pdf",
    size: 482_304,
    mimeType: "application/pdf",
    boundTo: "rec_contract_001",
    uploaderName: "张三",
    uploadedAt: "2026-05-07 09:20",
    accessStatus: "allowed"
  },
  {
    fileId: "file_expense_invoice_001",
    fileName: "差旅发票.zip",
    size: 1_249_804,
    mimeType: "application/zip",
    boundTo: "rec_expense_001",
    uploaderName: "李四",
    uploadedAt: "2026-05-06 14:05",
    accessStatus: "restricted"
  }
] as const;

export const mockAuditLogs = [
  {
    logId: "audit_release_contract_v1",
    action: "release.publish",
    resourceType: "app",
    resourceName: "合同管理",
    operatorName: "系统管理员",
    result: "success",
    occurredAt: "2026-05-07 10:00",
    requestId: "mock_req_release_contract"
  },
  {
    logId: "audit_workflow_approve_contract",
    action: "workflow.approve",
    resourceType: "workflow_task",
    resourceName: "法务审批",
    operatorName: "系统管理员",
    result: "success",
    occurredAt: "2026-05-07 16:30",
    requestId: "mock_req_workflow_approve"
  },
  {
    logId: "audit_file_preview_contract",
    action: "file.preview",
    resourceType: "file",
    resourceName: "年度软件服务合同.pdf",
    operatorName: "系统管理员",
    result: "success",
    occurredAt: "2026-05-07 16:35",
    requestId: "mock_req_file_preview"
  }
] as const;

export const mockSecurityEvents = [
  {
    eventId: "sec_file_denied_001",
    eventType: "file_access_denied",
    severity: "medium",
    principalName: "访客用户",
    resourceName: "差旅发票.zip",
    status: "open",
    occurredAt: "2026-05-07 15:42",
    description: "用户尝试预览未授权附件，已被 Mock 权限策略拒绝。"
  },
  {
    eventId: "sec_task_conflict_001",
    eventType: "workflow_task_conflict",
    severity: "low",
    principalName: "系统管理员",
    resourceName: "法务审批",
    status: "handled",
    occurredAt: "2026-05-07 16:32",
    description: "审批任务版本变化，前端已提示刷新。"
  }
] as const;

export const mockDiagnostics = [
  {
    itemKey: "runtime_pointer",
    itemName: "运行指针",
    status: "pass",
    checkedAt: "2026-05-07 16:40",
    message: "3 个样板应用运行指针均指向有效快照。"
  },
  {
    itemKey: "snapshot",
    itemName: "快照引用",
    status: "pass",
    checkedAt: "2026-05-07 16:40",
    message: "业务记录与流程实例的 snapshotId 均可解析。"
  },
  {
    itemKey: "file_binding",
    itemName: "附件绑定",
    status: "warning",
    checkedAt: "2026-05-07 16:40",
    message: "发现 1 个受限附件，下载需走文件 API 鉴权。"
  },
  {
    itemKey: "business_index",
    itemName: "业务索引",
    status: "pass",
    checkedAt: "2026-05-07 16:40",
    message: "Mock 记录索引与 data 字段一致。"
  }
] as const;
