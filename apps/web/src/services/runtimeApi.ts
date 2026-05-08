import { apiClient } from "./apiClient";
import type { SaveRuntimeRecordRequest, SubmitRuntimeRecordRequest } from "@lowcode/api-client";

export const runtimeApi = {
  getRuntimeModel: (appId: string) => apiClient.getRuntimeModel(appId),
  listRuntimeRecords: (appId: string, entityKey: string) => apiClient.listRuntimeRecords(appId, entityKey),
  getRuntimeRecord: (appId: string, entityKey: string, recordId: string) => apiClient.getRuntimeRecord(appId, entityKey, recordId),
  createRuntimeRecord: (appId: string, entityKey: string, request: SaveRuntimeRecordRequest) =>
    apiClient.createRuntimeRecord(appId, entityKey, request),
  updateRuntimeRecord: (appId: string, entityKey: string, recordId: string, request: SaveRuntimeRecordRequest) =>
    apiClient.updateRuntimeRecord(appId, entityKey, recordId, request),
  submitRuntimeRecord: (appId: string, entityKey: string, recordId: string, request: SubmitRuntimeRecordRequest) =>
    apiClient.submitRuntimeRecord(appId, entityKey, recordId, request)
};
