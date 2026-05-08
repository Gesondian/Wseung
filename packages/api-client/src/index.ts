import {
  mockApps,
  mockAppDetails,
  mockAuditLogs,
  mockDiagnostics,
  mockFiles,
  mockRecords,
  mockReleaseRecords,
  mockRuntimeModels,
  mockSecurityEvents,
  mockTasks,
  mockWorkflowTraces
} from "@lowcode/mock-data";
import type { RuntimeModelStub } from "@lowcode/runtime-contracts";
import type { ApiResponse, PageRequest, PageResponse } from "@lowcode/shared-types";

export interface LoginRequest {
  loginIdentifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginUser {
  id: string;
  username: string;
  displayName: string;
  primaryOrgId: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: LoginUser;
}

export interface AppSummary {
  appId: string;
  appKey: "contract_management" | "expense_report" | "purchase_request" | "asset_archive";
  appName: string;
  description: string;
  status: "published" | "draft" | "disabled";
  defaultEntityKey: string;
  categoryName: string;
  ownerName: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  relation: "managed" | "used" | "created";
}

export interface AppResourceStats {
  objectCount: number;
  formCount: number;
  viewCount: number;
  workflowCount: number;
  dashboardCount: number;
  memberCount: number;
  recentOperationCount: number;
}

export interface AppResourceEntry {
  resourceId: string;
  resourceType: "object" | "form" | "view" | "workflow" | "permission" | "release";
  resourceName: string;
  description: string;
  path: string;
  status: "ready" | "draft" | "warning";
}

export interface AppMemberSummary {
  memberId: string;
  memberName: string;
  roleName: "应用所有者" | "应用管理员" | "应用设计者" | "应用使用者" | "只读者";
  principalType: "user" | "role" | "org";
  updatedAt: string;
}

export interface AppOperationLog {
  logId: string;
  action: "create" | "edit" | "publish" | "stop" | "restore" | "delete" | "export" | "import" | "member_change";
  operatorName: string;
  occurredAt: string;
  result: "success" | "failed";
  summary: string;
}

export interface AppDetail {
  app: AppSummary;
  currentVersion?: string;
  latestPublisherName?: string;
  createdAt: string;
  resourceStats: AppResourceStats;
  resources: AppResourceEntry[];
  members: AppMemberSummary[];
  operationLogs: AppOperationLog[];
  metadataPackage: {
    packageName: string;
    version: string;
    includes: string[];
    excludes: string[];
  };
}

export interface RuntimeRecord {
  recordId: string;
  appId: string;
  entityKey: string;
  appVersionId: string;
  snapshotId: string;
  recordVersion: number;
  businessStatus: string;
  workflowStatus: string;
  data: Record<string, unknown>;
}

export interface SaveRuntimeRecordRequest {
  recordVersion?: number;
  data: Record<string, unknown>;
}

export interface SubmitRuntimeRecordRequest {
  recordVersion: number;
  idempotencyKey: string;
}

export interface WorkflowTask {
  taskId: string;
  appId: string;
  appName: string;
  entityKey: string;
  recordId: string;
  workflowInstanceId: string;
  snapshotId: string;
  taskName: string;
  taskVersion: number;
  assigneeName: string;
  applicantName: string;
  status: "todo" | "done";
  createdAt: string;
  completedAt?: string;
  summary: string;
}

export interface WorkflowTrace {
  traceId: string;
  taskId: string;
  nodeName: string;
  actionType: "submit" | "pending" | "approve" | "reject";
  operatorName: string;
  opinion: string;
  createdAt: string;
}

export interface WorkflowTaskDetail {
  task: WorkflowTask;
  record: RuntimeRecord;
  runtimeModel: RuntimeModelStub;
  traces: WorkflowTrace[];
}

export interface WorkflowActionRequest {
  taskVersion: number;
  workflowInstanceId: string;
  recordId: string;
  recordVersion: number;
  snapshotId: string;
  opinion: string;
  idempotencyKey: string;
}

export interface ReleaseRecord {
  releaseId: string;
  appId: string;
  versionName: string;
  snapshotId: string;
  status: "draft" | "published" | "rolled_back";
  publisherName: string;
  publishedAt: string;
  changeSummary: string;
}

export interface FileObjectSummary {
  fileId: string;
  fileName: string;
  size: number;
  mimeType: string;
  boundTo: string;
  uploaderName: string;
  uploadedAt: string;
  accessStatus: "allowed" | "restricted";
}

export interface AuditLogSummary {
  logId: string;
  action: string;
  resourceType: string;
  resourceName: string;
  operatorName: string;
  result: "success" | "failed";
  occurredAt: string;
  requestId: string;
}

export interface SecurityEventSummary {
  eventId: string;
  eventType: string;
  severity: "low" | "medium" | "high";
  principalName: string;
  resourceName: string;
  status: "open" | "handled";
  occurredAt: string;
  description: string;
}

export interface DiagnosticCheckItem {
  itemKey: string;
  itemName: string;
  status: "pass" | "warning" | "failed";
  checkedAt: string;
  message: string;
}

export interface LowcodeApiClient {
  login(request: LoginRequest): Promise<ApiResponse<LoginResponse>>;
  listApps(): Promise<ApiResponse<AppSummary[]>>;
  getApp(appId: string): Promise<ApiResponse<AppSummary>>;
  getAppDetail(appId: string): Promise<ApiResponse<AppDetail>>;
  getRuntimeModel(appId: string): Promise<ApiResponse<RuntimeModelStub>>;
  listRuntimeRecords(
    appId: string,
    entityKey: string,
    page?: Partial<PageRequest>
  ): Promise<ApiResponse<PageResponse<RuntimeRecord>>>;
  getRuntimeRecord(appId: string, entityKey: string, recordId: string): Promise<ApiResponse<RuntimeRecord>>;
  createRuntimeRecord(appId: string, entityKey: string, request: SaveRuntimeRecordRequest): Promise<ApiResponse<RuntimeRecord>>;
  updateRuntimeRecord(
    appId: string,
    entityKey: string,
    recordId: string,
    request: SaveRuntimeRecordRequest
  ): Promise<ApiResponse<RuntimeRecord>>;
  submitRuntimeRecord(
    appId: string,
    entityKey: string,
    recordId: string,
    request: SubmitRuntimeRecordRequest
  ): Promise<ApiResponse<WorkflowTask>>;
  listTodoTasks(): Promise<ApiResponse<WorkflowTask[]>>;
  listDoneTasks(): Promise<ApiResponse<WorkflowTask[]>>;
  getWorkflowTask(taskId: string): Promise<ApiResponse<WorkflowTaskDetail>>;
  approveTask(taskId: string, request: WorkflowActionRequest): Promise<ApiResponse<WorkflowTaskDetail>>;
  rejectTask(taskId: string, request: WorkflowActionRequest): Promise<ApiResponse<WorkflowTaskDetail>>;
  listReleases(appId: string): Promise<ApiResponse<ReleaseRecord[]>>;
  listFiles(): Promise<ApiResponse<FileObjectSummary[]>>;
  listAuditLogs(): Promise<ApiResponse<AuditLogSummary[]>>;
  listSecurityEvents(): Promise<ApiResponse<SecurityEventSummary[]>>;
  listDiagnostics(): Promise<ApiResponse<DiagnosticCheckItem[]>>;
}

const ok = <T>(data: T): ApiResponse<T> => ({
  success: true,
  code: "OK",
  message: "success",
  data,
  requestId: "mock_req_001",
  traceId: "mock_trace_001"
});

const notFound = <T>(message: string): ApiResponse<T> => ({
  success: false,
  code: "RESOURCE_NOT_FOUND",
  message,
  requestId: "mock_req_404",
  traceId: "mock_trace_404"
});

const taskConflict = <T>(message: string): ApiResponse<T> => ({
  success: false,
  code: "VERSION_CONFLICT_TASK",
  message,
  requestId: "mock_req_task_conflict",
  traceId: "mock_trace_task_conflict"
});

const completedTask = <T>(message: string): ApiResponse<T> => ({
  success: false,
  code: "TASK_ALREADY_COMPLETED",
  message,
  requestId: "mock_req_task_completed",
  traceId: "mock_trace_task_completed"
});

const recordConflict = <T>(message: string): ApiResponse<T> => ({
  success: false,
  code: "VERSION_CONFLICT",
  message,
  requestId: "mock_req_record_conflict",
  traceId: "mock_trace_record_conflict"
});

export function createMockApiClient(): LowcodeApiClient {
  const runtimeRecords = mockRecords.map((record) => ({ ...record, data: { ...record.data } })) as RuntimeRecord[];
  const workflowTasks = mockTasks.map((task) => ({ ...task })) as WorkflowTask[];
  const workflowTraces = mockWorkflowTraces.map((trace) => ({ ...trace })) as WorkflowTrace[];
  const createTaskDetail = (task: WorkflowTask): WorkflowTaskDetail | undefined => {
    const record = runtimeRecords.find((item) => item.appId === task.appId && item.recordId === task.recordId);
    const runtimeModel = mockRuntimeModels[task.appId];

    if (!record || !runtimeModel) {
      return undefined;
    }

    return {
      task,
      record,
      runtimeModel,
      traces: workflowTraces.filter((trace) => trace.taskId === task.taskId)
    };
  };

  return {
    async login(request) {
      if (request.loginIdentifier !== "admin" || request.password !== "admin123") {
        return {
          success: false,
          code: "UNAUTHORIZED",
          message: "用户名或密码错误",
          requestId: "mock_req_login_failed",
          traceId: "mock_trace_login_failed"
        };
      }

      return ok({
        accessToken: "mock_access_token",
        tokenType: "Bearer",
        expiresIn: 7200,
        user: {
          id: "usr_admin",
          username: "admin",
          displayName: "系统管理员",
          primaryOrgId: "org_headquarters",
          roles: ["system_admin"]
        }
      });
    },

    async listApps() {
      return ok([...mockApps]);
    },

    async getApp(appId) {
      const app = mockApps.find((item) => item.appId === appId);
      return app ? ok(app) : notFound("应用不存在");
    },

    async getAppDetail(appId) {
      const detail = (mockAppDetails as unknown as Record<string, AppDetail>)[appId];
      return detail ? ok(detail) : notFound("应用详情不存在");
    },

    async getRuntimeModel(appId) {
      const model = mockRuntimeModels[appId];
      return model ? ok(model) : notFound("运行态模型不存在");
    },

    async listRuntimeRecords(appId, entityKey, page = {}) {
      const allRecords = runtimeRecords.filter((record) => record.appId === appId && record.entityKey === entityKey);
      const pageNo = page.page ?? 1;
      const pageSize = page.pageSize ?? 20;
      const start = (pageNo - 1) * pageSize;

      return ok({
        items: allRecords.slice(start, start + pageSize),
        page: pageNo,
        pageSize,
        total: allRecords.length,
        hasNext: start + pageSize < allRecords.length
      });
    },

    async getRuntimeRecord(appId, entityKey, recordId) {
      const record = runtimeRecords.find(
        (item) => item.appId === appId && item.entityKey === entityKey && item.recordId === recordId
      );
      return record ? ok(record) : notFound("业务记录不存在");
    },

    async createRuntimeRecord(appId, entityKey, request) {
      const model = mockRuntimeModels[appId];
      const entity = model?.entities?.find((item) => item.entityKey === entityKey);
      if (!model || !entity) {
        return notFound("运行态实体不存在");
      }

      const record: RuntimeRecord = {
        recordId: `rec_${entityKey}_${runtimeRecords.length + 1}` ,
        appId,
        entityKey,
        appVersionId: `appver_${appId}_mock`,
        snapshotId: model.snapshotId,
        recordVersion: 1,
        businessStatus: "active",
        workflowStatus: "draft",
        data: { ...request.data }
      };
      runtimeRecords.unshift(record);
      return ok(record);
    },

    async updateRuntimeRecord(appId, entityKey, recordId, request) {
      const record = runtimeRecords.find(
        (item) => item.appId === appId && item.entityKey === entityKey && item.recordId === recordId
      );
      if (!record) {
        return notFound("业务记录不存在");
      }
      if (request.recordVersion !== record.recordVersion) {
        return recordConflict("记录已被他人修改，请刷新后重试");
      }

      record.data = { ...record.data, ...request.data };
      record.recordVersion += 1;
      return ok(record);
    },

    async submitRuntimeRecord(appId, entityKey, recordId, request) {
      const record = runtimeRecords.find(
        (item) => item.appId === appId && item.entityKey === entityKey && item.recordId === recordId
      );
      if (!record) {
        return notFound("业务记录不存在");
      }
      if (request.recordVersion !== record.recordVersion) {
        return recordConflict("记录已被他人修改，请刷新后重试");
      }

      record.workflowStatus = "in_approval";
      record.recordVersion += 1;

      const app = mockApps.find((item) => item.appId === appId);
      const task: WorkflowTask = {
        taskId: `task_${entityKey}_${recordId}_${workflowTasks.length + 1}`,
        appId,
        appName: app?.appName ?? appId,
        entityKey,
        recordId,
        workflowInstanceId: `wf_${recordId}`,
        snapshotId: record.snapshotId,
        taskName: "审批处理",
        taskVersion: 1,
        assigneeName: "系统管理员",
        applicantName: "系统管理员",
        status: "todo",
        createdAt: "2026-05-07 17:00",
        summary: "运行态记录提交审批"
      };
      workflowTasks.unshift(task);
      workflowTraces.push({
        traceId: `trace_${task.taskId}_submit`,
        taskId: task.taskId,
        nodeName: "提交申请",
        actionType: "submit",
        operatorName: "系统管理员",
        opinion: request.idempotencyKey,
        createdAt: task.createdAt
      });

      return ok(task);
    },

    async listTodoTasks() {
      return ok(workflowTasks.filter((task) => task.status === "todo"));
    },

    async listDoneTasks() {
      return ok(workflowTasks.filter((task) => task.status === "done"));
    },

    async getWorkflowTask(taskId) {
      const task = workflowTasks.find((item) => item.taskId === taskId);
      if (!task) {
        return notFound("审批任务不存在");
      }

      const detail = createTaskDetail(task);
      return detail ? ok(detail) : notFound("审批任务关联数据不存在");
    },

    async approveTask(taskId, request) {
      const task = workflowTasks.find((item) => item.taskId === taskId);
      if (!task) {
        return notFound("审批任务不存在");
      }
      if (task.status !== "todo") {
        return completedTask("任务状态已变化，请刷新后重试");
      }
      if (task.taskVersion !== request.taskVersion) {
        return taskConflict("任务版本已变化，请刷新后重试");
      }

      task.status = "done";
      task.completedAt = "2026-05-07 16:30";
      task.taskVersion += 1;
      workflowTraces.push({
        traceId: `trace_${task.taskId}_approve`,
        taskId,
        nodeName: task.taskName,
        actionType: "approve",
        operatorName: task.assigneeName,
        opinion: request.opinion,
        createdAt: task.completedAt
      });

      const detail = createTaskDetail(task);
      return detail ? ok({ ...detail, traces: workflowTraces.filter((trace) => trace.taskId === taskId) }) : notFound("审批任务关联数据不存在");
    },

    async rejectTask(taskId, request) {
      const task = workflowTasks.find((item) => item.taskId === taskId);
      if (!task) {
        return notFound("审批任务不存在");
      }
      if (task.status !== "todo") {
        return completedTask("任务状态已变化，请刷新后重试");
      }
      if (task.taskVersion !== request.taskVersion) {
        return taskConflict("任务版本已变化，请刷新后重试");
      }

      task.status = "done";
      task.completedAt = "2026-05-07 16:30";
      task.taskVersion += 1;
      workflowTraces.push({
        traceId: `trace_${task.taskId}_reject`,
        taskId,
        nodeName: task.taskName,
        actionType: "reject",
        operatorName: task.assigneeName,
        opinion: request.opinion,
        createdAt: task.completedAt
      });

      const detail = createTaskDetail(task);
      return detail ? ok({ ...detail, traces: workflowTraces.filter((trace) => trace.taskId === taskId) }) : notFound("审批任务关联数据不存在");
    },

    async listReleases(appId) {
      return ok(mockReleaseRecords.filter((release) => release.appId === appId));
    },

    async listFiles() {
      return ok([...mockFiles]);
    },

    async listAuditLogs() {
      return ok([...mockAuditLogs]);
    },

    async listSecurityEvents() {
      return ok([...mockSecurityEvents]);
    },

    async listDiagnostics() {
      return ok([...mockDiagnostics]);
    }
  };
}

export const apiClient = createMockApiClient();
