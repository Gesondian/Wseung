package com.example.lowcode.audit.infrastructure;

import com.example.lowcode.audit.application.AuditLogService.AuditLogEntry;
import com.example.lowcode.audit.application.AuditLogService.AuditLogRepository;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class MemoryAuditLogRepository implements AuditLogRepository {
    private final List<TenantAuditLogEntry> entries = new CopyOnWriteArrayList<>();

    @Override
    public void save(String tenantId, AuditLogEntry entry) {
        entries.add(new TenantAuditLogEntry(tenantId, entry));
    }

    @Override
    public List<AuditLogEntry> listLatest(String tenantId) {
        return entries.stream()
                .filter(entry -> entry.tenantId().equals(tenantId))
                .map(TenantAuditLogEntry::entry)
                .toList();
    }

    private record TenantAuditLogEntry(String tenantId, AuditLogEntry entry) {
    }
}
