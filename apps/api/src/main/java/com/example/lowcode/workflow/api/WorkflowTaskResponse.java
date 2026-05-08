package com.example.lowcode.workflow.api;

import java.time.Instant;

public record WorkflowTaskResponse(
        String taskId,
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
        Instant createdAt,
        Instant completedAt
) {
}
