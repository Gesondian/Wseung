package com.example.lowcode.workflow.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CompleteWorkflowTaskRequest(
        @NotNull(message = "taskVersion 不能为空")
        Long taskVersion,

        @NotBlank(message = "idempotencyKey 不能为空")
        String idempotencyKey,

        String comment
) {
}
