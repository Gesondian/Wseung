package com.example.lowcode.record.api;

import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.web.ResponseFactory;
import com.example.lowcode.record.application.RuntimeRecordService;
import com.example.lowcode.workflow.api.WorkflowTaskResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/runtime/apps/{appId}/entities/{entityKey}/records")
public class RuntimeRecordController {
    private final RuntimeRecordService runtimeRecordService;
    private final ResponseFactory responseFactory;

    public RuntimeRecordController(RuntimeRecordService runtimeRecordService, ResponseFactory responseFactory) {
        this.runtimeRecordService = runtimeRecordService;
        this.responseFactory = responseFactory;
    }

    @GetMapping
    public ApiResponse<List<RuntimeRecordResponse>> list(@PathVariable String appId, @PathVariable String entityKey) {
        return responseFactory.ok(runtimeRecordService.list(appId, entityKey));
    }

    @GetMapping("/{recordId}")
    public ApiResponse<RuntimeRecordResponse> get(
            @PathVariable String appId,
            @PathVariable String entityKey,
            @PathVariable String recordId
    ) {
        return responseFactory.ok(runtimeRecordService.get(appId, entityKey, recordId));
    }

    @PostMapping
    public ApiResponse<RuntimeRecordResponse> create(
            @PathVariable String appId,
            @PathVariable String entityKey,
            @Valid @RequestBody SaveRuntimeRecordRequest request
    ) {
        return responseFactory.ok(runtimeRecordService.create(appId, entityKey, request));
    }

    @PutMapping("/{recordId}")
    public ApiResponse<RuntimeRecordResponse> update(
            @PathVariable String appId,
            @PathVariable String entityKey,
            @PathVariable String recordId,
            @Valid @RequestBody SaveRuntimeRecordRequest request
    ) {
        return responseFactory.ok(runtimeRecordService.update(appId, entityKey, recordId, request));
    }

    @PostMapping("/{recordId}/submit")
    public ApiResponse<WorkflowTaskResponse> submit(
            @PathVariable String appId,
            @PathVariable String entityKey,
            @PathVariable String recordId,
            @Valid @RequestBody SubmitRuntimeRecordRequest request
    ) {
        return responseFactory.ok(runtimeRecordService.submit(appId, entityKey, recordId, request));
    }
}
