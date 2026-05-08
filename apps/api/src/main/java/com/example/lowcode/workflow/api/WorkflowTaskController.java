package com.example.lowcode.workflow.api;

import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.web.ResponseFactory;
import com.example.lowcode.workflow.application.WorkflowTaskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workflow/tasks")
public class WorkflowTaskController {
    private final WorkflowTaskService workflowTaskService;
    private final ResponseFactory responseFactory;

    public WorkflowTaskController(WorkflowTaskService workflowTaskService, ResponseFactory responseFactory) {
        this.workflowTaskService = workflowTaskService;
        this.responseFactory = responseFactory;
    }

    @GetMapping
    public ApiResponse<List<WorkflowTaskResponse>> list() {
        return responseFactory.ok(workflowTaskService.listMine());
    }

    @GetMapping("/{taskId}")
    public ApiResponse<WorkflowTaskResponse> get(@PathVariable String taskId) {
        return responseFactory.ok(workflowTaskService.getMine(taskId));
    }

    @PostMapping("/{taskId}/approve")
    public ApiResponse<WorkflowTaskResponse> approve(
            @PathVariable String taskId,
            @Valid @RequestBody CompleteWorkflowTaskRequest request
    ) {
        return responseFactory.ok(workflowTaskService.approve(taskId, request));
    }

    @PostMapping("/{taskId}/reject")
    public ApiResponse<WorkflowTaskResponse> reject(
            @PathVariable String taskId,
            @Valid @RequestBody CompleteWorkflowTaskRequest request
    ) {
        return responseFactory.ok(workflowTaskService.reject(taskId, request));
    }
}
