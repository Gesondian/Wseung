package com.example.lowcode.audit.api;

import com.example.lowcode.audit.application.AuditLogService;
import com.example.lowcode.audit.application.SecurityEventService;
import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.web.ResponseFactory;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {
    private final AuditLogService auditLogService;
    private final SecurityEventService securityEventService;
    private final ResponseFactory responseFactory;

    public AuditController(AuditLogService auditLogService, SecurityEventService securityEventService, ResponseFactory responseFactory) {
        this.auditLogService = auditLogService;
        this.securityEventService = securityEventService;
        this.responseFactory = responseFactory;
    }

    @GetMapping("/logs")
    public ApiResponse<List<AuditLogService.AuditLogEntry>> logs() {
        return responseFactory.ok(auditLogService.list());
    }

    @GetMapping("/security-events")
    public ApiResponse<List<SecurityEventService.SecurityEventEntry>> securityEvents() {
        return responseFactory.ok(securityEventService.list());
    }
}
