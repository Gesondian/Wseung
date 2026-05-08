import { apiClient } from "./apiClient";

export const appApi = {
  listApps: () => apiClient.listApps(),
  getApp: (appId: string) => apiClient.getApp(appId),
  getAppDetail: (appId: string) => apiClient.getAppDetail(appId)
};
