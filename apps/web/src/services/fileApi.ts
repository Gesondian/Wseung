import { apiClient } from "./apiClient";

export const fileApi = {
  listFiles: () => apiClient.listFiles()
};
