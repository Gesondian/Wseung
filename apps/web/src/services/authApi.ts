import { apiClient } from "./apiClient";

export const authApi = {
  login: (loginIdentifier: string, password: string) => apiClient.login({ loginIdentifier, password })
};
