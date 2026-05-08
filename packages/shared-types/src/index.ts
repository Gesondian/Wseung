export type Id = string;

export type ErrorCode =
  | "OK"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "PERMISSION_DENIED"
  | "RESOURCE_NOT_FOUND"
  | "CONFLICT"
  | "VERSION_CONFLICT"
  | "VERSION_CONFLICT_TASK"
  | "IDEMPOTENCY_CONFLICT"
  | "VALIDATION_FAILED"
  | "DSL_SCHEMA_INVALID"
  | "DEPENDENCY_BROKEN"
  | "FIELD_PERMISSION_DENIED"
  | "DATA_PERMISSION_DENIED"
  | "WORKFLOW_TASK_INVALID"
  | "TASK_ALREADY_COMPLETED"
  | "SNAPSHOT_NOT_FOUND"
  | "APP_NOT_PUBLISHED"
  | "FILE_ACCESS_DENIED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiErrorDetail {
  field?: string;
  reason: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: ErrorCode;
  message: string;
  data?: T;
  details?: ApiErrorDetail[];
  requestId: string;
  traceId: string;
}

export interface PageRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  keyword?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
}

export interface RequestContext {
  tenantId: string;
  userId: string;
  primaryOrgId?: string;
  roleIds: string[];
  requestId: string;
  traceId: string;
}
