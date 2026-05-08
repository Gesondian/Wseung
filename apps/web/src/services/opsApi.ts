import { apiClient } from "./apiClient";

export const opsApi = {
  listReleases: (appId: string) => apiClient.listReleases(appId),
  listAuditLogs: () => apiClient.listAuditLogs(),
  listSecurityEvents: () => apiClient.listSecurityEvents(),
  listDiagnostics: () => apiClient.listDiagnostics()
};
