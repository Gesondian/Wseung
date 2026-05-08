package com.example.lowcode.workflow.application;

import com.example.lowcode.workflow.application.WorkflowTaskService.WorkflowTask;
import java.util.List;
import java.util.Optional;

public interface WorkflowTaskRepository {
    WorkflowTask save(WorkflowTask task);

    List<WorkflowTask> listByAssignee(String tenantId, String assigneeId);

    Optional<WorkflowTask> findById(String tenantId, String taskId);

    Optional<WorkflowTask> findByIdempotencyKey(String tenantId, String idempotencyKey);
}
