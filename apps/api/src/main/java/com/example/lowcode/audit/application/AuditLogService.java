package com.example.lowcode.audit.application;

import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void record(String action, String resourceType, String resourceId, String result) {
        RequestContext context = RequestContextHolder.require();
        repository.save(context.tenantId(), new AuditLogEntry(action, resourceType, resourceId, result, context.userId(), context.requestId(), context.traceId(), Instant.now()));
    }

    public List<AuditLogEntry> list() {
        RequestContext context = RequestContextHolder.require();
        return repository.listLatest(context.tenantId());
    }

    public interface AuditLogRepository {
        void save(String tenantId, AuditLogEntry entry);

        List<AuditLogEntry> listLatest(String tenantId);
    }

    public record AuditLogEntry(
            String action,
            String resourceType,
            String resourceId,
            String result,
            String operatorId,
            String requestId,
            String traceId,
            Instant occurredAt
    ) {
    }
}
