package com.example.lowcode.workflow.application;

import com.example.lowcode.audit.application.AuditLogService;
import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import com.example.lowcode.common.error.BusinessException;
import com.example.lowcode.common.error.ErrorCode;
import com.example.lowcode.common.idempotency.IdempotencyService;
import com.example.lowcode.record.application.RuntimeRecordService.RuntimeRecord;
import com.example.lowcode.workflow.api.CompleteWorkflowTaskRequest;
import com.example.lowcode.workflow.api.WorkflowTaskResponse;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class WorkflowTaskService {
    private final WorkflowTaskRepository repository;
    private final AuditLogService auditLogService;
    private final IdempotencyService idempotencyService;

    public WorkflowTaskService(
            WorkflowTaskRepository repository,
            AuditLogService auditLogService,
            IdempotencyService idempotencyService
    ) {
        this.repository = repository;
        this.auditLogService = auditLogService;
        this.idempotencyService = idempotencyService;
    }

    public WorkflowTaskResponse createSubmitTask(RequestContext context, RuntimeRecord record, String idempotencyKey) {
        WorkflowTask task = new WorkflowTask(
                "task_" + UUID.randomUUID(),
                context.tenantId(),
                record.appId(),
                record.entityKey(),
                record.id(),
                "wfi_" + UUID.randomUUID(),
                record.snapshotId(),
                "主管审批",
                1L,
                "usr_approver",
                context.userId(),
                "todo",
                "运行态记录提交审批",
                idempotencyKey,
                Instant.now(),
                null
        );
        return toResponse(repository.save(task));
    }

    public Optional<WorkflowTaskResponse> findByIdempotencyKey(String tenantId, String idempotencyKey) {
        return repository.findByIdempotencyKey(tenantId, idempotencyKey).map(this::toResponse);
    }

    public List<WorkflowTaskResponse> listMine() {
        RequestContext context = RequestContextHolder.require();
        return repository.listByAssignee(context.tenantId(), context.userId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkflowTaskResponse getMine(String taskId) {
        RequestContext context = RequestContextHolder.require();
        WorkflowTask task = requireMine(context, taskId);
        return toResponse(task);
    }

    public WorkflowTaskResponse approve(String taskId, CompleteWorkflowTaskRequest request) {
        return complete(taskId, request, "approved", "workflow.task.approve");
    }

    public WorkflowTaskResponse reject(String taskId, CompleteWorkflowTaskRequest request) {
        return complete(taskId, request, "rejected", "workflow.task.reject");
    }

    private WorkflowTaskResponse complete(String taskId, CompleteWorkflowTaskRequest request, String nextStatus, String auditAction) {
        RequestContext context = RequestContextHolder.require();
        WorkflowTask existingAction = repository.findByIdempotencyKey(context.tenantId(), request.idempotencyKey()).orElse(null);
        if (existingAction != null) {
            return toResponse(existingAction);
        }

        WorkflowTask task = requireMine(context, taskId);
        if (!"todo".equals(task.status())) {
            throw new BusinessException(ErrorCode.WORKFLOW_TASK_INVALID, "任务已处理，不能重复审批");
        }
        if (request.taskVersion() != task.taskVersion()) {
            throw new BusinessException(ErrorCode.VERSION_CONFLICT, "任务已被他人处理，请刷新后重试");
        }

        String requestHash = taskId + ":" + request.taskVersion() + ":" + nextStatus;
        IdempotencyService.IdempotencyRecord idempotencyRecord = idempotencyService.start(request.idempotencyKey(), requestHash);
        WorkflowTask saved = repository.save(task.withCompletedStatus(nextStatus, request.idempotencyKey(), Instant.now()));
        idempotencyService.complete(idempotencyRecord.idempotencyKey());
        auditLogService.record(auditAction, "workflow_task", saved.id(), "success");
        return toResponse(saved);
    }

    private WorkflowTask requireMine(RequestContext context, String taskId) {
        WorkflowTask task = repository.findById(context.tenantId(), taskId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "流程任务不存在"));
        if (!context.userId().equals(task.assigneeId())) {
            throw new BusinessException(ErrorCode.PERMISSION_DENIED, "无权访问该流程任务");
        }
        return task;
    }

    private WorkflowTaskResponse toResponse(WorkflowTask task) {
        return new WorkflowTaskResponse(
                task.id(),
                task.appId(),
                task.entityKey(),
                task.recordId(),
                task.workflowInstanceId(),
                task.snapshotId(),
                task.taskName(),
                task.taskVersion(),
                task.assigneeId(),
                task.applicantId(),
                task.status(),
                task.summary(),
                task.createdAt(),
                task.completedAt()
        );
    }

    public record WorkflowTask(
            String id,
            String tenantId,
            String appId,
            String entityKey,
            String recordId,
            String workflowInstanceId,
            String snapshotId,
            String taskName,
            long taskVersion,
            String assigneeId,
            String applicantId,
            String status,
            String summary,
            String idempotencyKey,
            Instant createdAt,
            Instant completedAt
    ) {
        public WorkflowTask withCompletedStatus(String status, String idempotencyKey, Instant completedAt) {
            return new WorkflowTask(
                    id,
                    tenantId,
                    appId,
                    entityKey,
                    recordId,
                    workflowInstanceId,
                    snapshotId,
                    taskName,
                    taskVersion + 1,
                    assigneeId,
                    applicantId,
                    status,
                    summary,
                    idempotencyKey,
                    createdAt,
                    completedAt
            );
        }
    }
}
