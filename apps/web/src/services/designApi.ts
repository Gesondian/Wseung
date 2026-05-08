import type { RuntimeEntity, RuntimeField, RuntimeModelStub } from "@lowcode/runtime-contracts";

import { appApi } from "./appApi";
import { runtimeApi } from "./runtimeApi";

interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  requestId: string;
  traceId: string;
}

export interface DesignAppOverview {
  appId: string;
  appName: string;
  status: "published" | "draft" | "disabled";
  defaultEntityKey: string;
  snapshotId: string;
  entityCount: number;
  fieldCount: number;
  viewCount: number;
  actionCount: number;
}

export interface FormCanvasSection {
  sectionKey: string;
  sectionName: string;
  fields: RuntimeField[];
}

export interface WorkflowNode {
  nodeKey: string;
  nodeName: string;
  nodeType: "start" | "approval" | "condition" | "end";
  assigneeRule: string;
  status: "configured" | "pending";
}

export interface PermissionRoleMatrix {
  roleKey: string;
  roleName: string;
  fieldVisible: string[];
  fieldEditable: string[];
  actions: string[];
}

const ok = <T>(data: T): ApiResponse<T> => ({
  success: true,
  code: "OK",
  message: "success",
  data,
  requestId: "mock_req_design",
  traceId: "mock_trace_design"
});

const notFound = <T>(message: string): ApiResponse<T> => ({
  success: false,
  code: "RESOURCE_NOT_FOUND",
  message,
  requestId: "mock_req_design_404",
  traceId: "mock_trace_design_404"
});

function getPrimaryEntity(model: RuntimeModelStub): RuntimeEntity | undefined {
  return model.entities?.[0];
}

function splitFormSections(entity: RuntimeEntity): FormCanvasSection[] {
  const fields = entity.fields;
  const mainFields = fields.filter((field) => field.fieldType !== "attachment" && field.fieldType !== "subtable");
  const detailFields = fields.filter((field) => field.fieldType === "subtable" || field.fieldType === "attachment");

  return [
    {
      sectionKey: "basic",
      sectionName: "基础信息",
      fields: mainFields.slice(0, Math.max(3, Math.ceil(mainFields.length / 2)))
    },
    {
      sectionKey: "business",
      sectionName: "业务信息",
      fields: mainFields.slice(Math.max(3, Math.ceil(mainFields.length / 2)))
    },
    {
      sectionKey: "attachments",
      sectionName: "明细与附件",
      fields: detailFields
    }
  ].filter((section) => section.fields.length > 0);
}

function createWorkflowNodes(entity: RuntimeEntity): WorkflowNode[] {
  const amountField = entity.fields.find((field) => field.fieldType === "money" || field.fieldKey.includes("amount"));
  return [
    {
      nodeKey: "start",
      nodeName: "提交申请",
      nodeType: "start",
      assigneeRule: "发起人",
      status: "configured"
    },
    {
      nodeKey: "approval_manager",
      nodeName: "部门负责人审批",
      nodeType: "approval",
      assigneeRule: "发起人所属部门负责人",
      status: "configured"
    },
    {
      nodeKey: "condition_amount",
      nodeName: amountField ? `${amountField.fieldName}条件分支` : "金额条件分支",
      nodeType: "condition",
      assigneeRule: "大额单据进入二级审批",
      status: "pending"
    },
    {
      nodeKey: "end",
      nodeName: "流程结束",
      nodeType: "end",
      assigneeRule: "系统自动归档",
      status: "configured"
    }
  ];
}

function createPermissionMatrix(entity: RuntimeEntity): PermissionRoleMatrix[] {
  const allFields = entity.fields.map((field) => field.fieldKey);
  const editableFields = entity.fields.filter((field) => !field.readonly).map((field) => field.fieldKey);
  const readonlyFields = entity.fields.filter((field) => field.readonly).map((field) => field.fieldKey);

  return [
    {
      roleKey: "system_admin",
      roleName: "系统管理员",
      fieldVisible: allFields,
      fieldEditable: editableFields,
      actions: ["create", "edit", "submit", "approve", "reject", "download"]
    },
    {
      roleKey: "app_designer",
      roleName: "应用设计员",
      fieldVisible: allFields,
      fieldEditable: editableFields,
      actions: ["create", "edit", "submit"]
    },
    {
      roleKey: "runtime_viewer",
      roleName: "运行态查看员",
      fieldVisible: readonlyFields.length > 0 ? readonlyFields : allFields.slice(0, 2),
      fieldEditable: [],
      actions: ["download"]
    }
  ];
}

export const designApi = {
  async getOverview(appId: string): Promise<ApiResponse<DesignAppOverview>> {
    const [appResponse, modelResponse] = await Promise.all([appApi.getApp(appId), runtimeApi.getRuntimeModel(appId)]);
    const app = appResponse.data;
    const model = modelResponse.data;
    if (!appResponse.success || !modelResponse.success || !app || !model) {
      return notFound("应用设计态模型不存在");
    }

    return ok({
      appId,
      appName: app.appName,
      status: app.status,
      defaultEntityKey: app.defaultEntityKey,
      snapshotId: model.snapshotId,
      entityCount: model.entities?.length ?? 0,
      fieldCount: model.entities?.reduce((sum, entity) => sum + entity.fields.length, 0) ?? 0,
      viewCount: model.views?.length ?? 0,
      actionCount: model.actions?.length ?? 0
    });
  },

  async getModel(appId: string): Promise<ApiResponse<RuntimeModelStub>> {
    const response = await runtimeApi.getRuntimeModel(appId);
    return response.success && response.data ? ok(response.data) : notFound("应用设计态模型不存在");
  },

  async listFormSections(appId: string): Promise<ApiResponse<FormCanvasSection[]>> {
    const response = await runtimeApi.getRuntimeModel(appId);
    const entity = response.data ? getPrimaryEntity(response.data) : undefined;
    return entity ? ok(splitFormSections(entity)) : notFound("表单模型不存在");
  },

  async listWorkflowNodes(appId: string): Promise<ApiResponse<WorkflowNode[]>> {
    const response = await runtimeApi.getRuntimeModel(appId);
    const entity = response.data ? getPrimaryEntity(response.data) : undefined;
    return entity ? ok(createWorkflowNodes(entity)) : notFound("流程模型不存在");
  },

  async listPermissionMatrix(appId: string): Promise<ApiResponse<PermissionRoleMatrix[]>> {
    const response = await runtimeApi.getRuntimeModel(appId);
    const entity = response.data ? getPrimaryEntity(response.data) : undefined;
    return entity ? ok(createPermissionMatrix(entity)) : notFound("权限模型不存在");
  }
};
