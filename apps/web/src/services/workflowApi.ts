import { apiClient } from "./apiClient";
import type { WorkflowActionRequest } from "@lowcode/api-client";

export const workflowApi = {
  listTodoTasks: () => apiClient.listTodoTasks(),
  listDoneTasks: () => apiClient.listDoneTasks(),
  getWorkflowTask: (taskId: string) => apiClient.getWorkflowTask(taskId),
  approveTask: (taskId: string, request: WorkflowActionRequest) => apiClient.approveTask(taskId, request),
  rejectTask: (taskId: string, request: WorkflowActionRequest) => apiClient.rejectTask(taskId, request)
};
