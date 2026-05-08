package com.example.lowcode.record.application;

import com.example.lowcode.audit.application.AuditLogService;
import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import com.example.lowcode.common.error.BusinessException;
import com.example.lowcode.common.error.ErrorCode;
import com.example.lowcode.common.idempotency.IdempotencyService;
import com.example.lowcode.record.api.RuntimeRecordResponse;
import com.example.lowcode.record.api.SaveRuntimeRecordRequest;
import com.example.lowcode.record.api.SubmitRuntimeRecordRequest;
import com.example.lowcode.workflow.application.WorkflowTaskService;
import com.example.lowcode.workflow.api.WorkflowTaskResponse;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class RuntimeRecordService {
    private static final String DEFAULT_APP_VERSION_ID_PREFIX = "appver_";
    private static final String DEFAULT_SNAPSHOT_ID_PREFIX = "snapshot_";

    private final RuntimeRecordRepository repository;
    private final AuditLogService auditLogService;
    private final IdempotencyService idempotencyService;
    private final WorkflowTaskService workflowTaskService;

    public RuntimeRecordService(
            RuntimeRecordRepository repository,
            AuditLogService auditLogService,
            IdempotencyService idempotencyService,
            WorkflowTaskService workflowTaskService
    ) {
        this.repository = repository;
        this.auditLogService = auditLogService;
        this.idempotencyService = idempotencyService;
        this.workflowTaskService = workflowTaskService;
    }

    public List<RuntimeRecordResponse> list(String appId, String entityKey) {
        RequestContext context = RequestContextHolder.require();
        return repository.list(context.tenantId(), appId, entityKey).stream()
                .map(this::toResponse)
                .toList();
    }

    public RuntimeRecordResponse get(String appId, String entityKey, String recordId) {
        RequestContext context = RequestContextHolder.require();
        return repository.find(context.tenantId(), appId, entityKey, recordId)
                .map(this::toResponse)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "业务记录不存在"));
    }

    public RuntimeRecordResponse create(String appId, String entityKey, SaveRuntimeRecordRequest request) {
        RequestContext context = RequestContextHolder.require();
        RuntimeRecord record = new RuntimeRecord(
                "rec_" + UUID.randomUUID(),
                context.tenantId(),
                appId,
                entityKey,
                DEFAULT_SNAPSHOT_ID_PREFIX + appId,
                DEFAULT_APP_VERSION_ID_PREFIX + appId,
                1L,
                "active",
                "draft",
                request.data(),
                Instant.now(),
                Instant.now()
        );
        RuntimeRecord saved = repository.save(record);
        auditLogService.record("runtime.record.create", "runtime_record", saved.id(), "success");
        return toResponse(saved);
    }

    public RuntimeRecordResponse update(String appId, String entityKey, String recordId, SaveRuntimeRecordRequest request) {
        RequestContext context = RequestContextHolder.require();
        RuntimeRecord existing = repository.find(context.tenantId(), appId, entityKey, recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "业务记录不存在"));
        if (request.recordVersion() == null || request.recordVersion() != existing.recordVersion()) {
            throw new BusinessException(ErrorCode.VERSION_CONFLICT, "记录已被他人修改，请刷新后重试");
        }

        RuntimeRecord updated = existing.withData(request.data(), Instant.now());
        RuntimeRecord saved = repository.save(updated);
        auditLogService.record("runtime.record.update", "runtime_record", saved.id(), "success");
        return toResponse(saved);
    }

    public WorkflowTaskResponse submit(String appId, String entityKey, String recordId, SubmitRuntimeRecordRequest request) {
        RequestContext context = RequestContextHolder.require();
        WorkflowTaskResponse existingTask = workflowTaskService.findByIdempotencyKey(context.tenantId(), request.idempotencyKey()).orElse(null);
        if (existingTask != null) {
            return existingTask;
        }

        RuntimeRecord existing = repository.find(context.tenantId(), appId, entityKey, recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "业务记录不存在"));
        if (request.recordVersion() != existing.recordVersion()) {
            throw new BusinessException(ErrorCode.VERSION_CONFLICT, "记录已被他人修改，请刷新后重试");
        }

        String requestHash = appId + ":" + entityKey + ":" + recordId + ":" + request.recordVersion();
        IdempotencyService.IdempotencyRecord idempotencyRecord = idempotencyService.start(request.idempotencyKey(), requestHash);
        RuntimeRecord submitted = repository.save(existing.withWorkflowStatus("submitted", Instant.now()));
        WorkflowTaskResponse task = workflowTaskService.createSubmitTask(context, submitted, request.idempotencyKey());
        idempotencyService.complete(idempotencyRecord.idempotencyKey());
        auditLogService.record("runtime.record.submit", "runtime_record", submitted.id(), "success");
        return task;
    }

    private RuntimeRecordResponse toResponse(RuntimeRecord record) {
        return new RuntimeRecordResponse(
                record.id(),
                record.appId(),
                record.entityKey(),
                record.appVersionId(),
                record.snapshotId(),
                record.recordVersion(),
                record.businessStatus(),
                record.workflowStatus(),
                record.data()
        );
    }

    public record RuntimeRecord(
            String id,
            String tenantId,
            String appId,
            String entityKey,
            String snapshotId,
            String appVersionId,
            long recordVersion,
            String businessStatus,
            String workflowStatus,
            JsonNode data,
            Instant createdAt,
            Instant updatedAt
    ) {
        public RuntimeRecord withData(JsonNode nextData, Instant updatedAt) {
            return new RuntimeRecord(
                    id,
                    tenantId,
                    appId,
                    entityKey,
                    snapshotId,
                    appVersionId,
                    recordVersion + 1,
                    businessStatus,
                    workflowStatus,
                    nextData,
                    createdAt,
                    updatedAt
            );
        }

        public RuntimeRecord withWorkflowStatus(String workflowStatus, Instant updatedAt) {
            return new RuntimeRecord(
                    id,
                    tenantId,
                    appId,
                    entityKey,
                    snapshotId,
                    appVersionId,
                    recordVersion + 1,
                    businessStatus,
                    workflowStatus,
                    data,
                    createdAt,
                    updatedAt
            );
        }
    }
}
