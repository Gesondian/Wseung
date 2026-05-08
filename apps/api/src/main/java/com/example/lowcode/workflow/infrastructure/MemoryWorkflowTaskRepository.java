package com.example.lowcode.workflow.infrastructure;

import com.example.lowcode.workflow.application.WorkflowTaskRepository;
import com.example.lowcode.workflow.application.WorkflowTaskService.WorkflowTask;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class MemoryWorkflowTaskRepository implements WorkflowTaskRepository {
    private final Map<String, WorkflowTask> tasksById = new ConcurrentHashMap<>();
    private final Map<String, WorkflowTask> tasksByIdempotencyKey = new ConcurrentHashMap<>();

    @Override
    public WorkflowTask save(WorkflowTask task) {
        tasksById.put(key(task.tenantId(), task.id()), task);
        tasksByIdempotencyKey.put(key(task.tenantId(), task.idempotencyKey()), task);
        return task;
    }

    @Override
    public List<WorkflowTask> listByAssignee(String tenantId, String assigneeId) {
        return tasksById.values().stream()
                .filter(task -> tenantId.equals(task.tenantId()))
                .filter(task -> assigneeId.equals(task.assigneeId()))
                .sorted(Comparator.comparing(WorkflowTask::createdAt).reversed())
                .toList();
    }

    @Override
    public Optional<WorkflowTask> findById(String tenantId, String taskId) {
        return Optional.ofNullable(tasksById.get(key(tenantId, taskId)));
    }

    @Override
    public Optional<WorkflowTask> findByIdempotencyKey(String tenantId, String idempotencyKey) {
        return Optional.ofNullable(tasksByIdempotencyKey.get(key(tenantId, idempotencyKey)));
    }

    private static String key(String tenantId, String idempotencyKey) {
        return tenantId + ":" + idempotencyKey;
    }
}
