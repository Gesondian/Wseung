package com.example.lowcode.audit.application;

import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SecurityEventService {
    private final SecurityEventRepository repository;

    public SecurityEventService(SecurityEventRepository repository) {
        this.repository = repository;
    }

    public void record(String eventType, String principal, String description) {
        RequestContext context = RequestContextHolder.require();
        repository.save(context.tenantId(), new SecurityEventEntry(eventType, principal, description, context.requestId(), context.traceId(), Instant.now()));
    }

    public List<SecurityEventEntry> list() {
        RequestContext context = RequestContextHolder.require();
        return repository.listLatest(context.tenantId());
    }

    public interface SecurityEventRepository {
        void save(String tenantId, SecurityEventEntry entry);

        List<SecurityEventEntry> listLatest(String tenantId);
    }

    public record SecurityEventEntry(
            String eventType,
            String principal,
            String description,
            String requestId,
            String traceId,
            Instant occurredAt
    ) {
    }
}
