package com.example.lowcode.diagnostics;

import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import com.example.lowcode.common.web.ResponseFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    private final ResponseFactory responseFactory;

    public HealthController(ResponseFactory responseFactory) {
        this.responseFactory = responseFactory;
    }

    @GetMapping("/api/v1/health")
    public ApiResponse<HealthResponse> health() {
        return responseFactory.ok(new HealthResponse("UP", "lowcode-api"));
    }

    @GetMapping("/api/v1/diagnostics/context")
    public ApiResponse<RequestContext> context() {
        return responseFactory.ok(RequestContextHolder.require());
    }
}
