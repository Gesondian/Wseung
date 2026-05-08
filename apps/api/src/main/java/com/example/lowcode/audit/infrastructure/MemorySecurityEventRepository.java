package com.example.lowcode.audit.infrastructure;

import com.example.lowcode.audit.application.SecurityEventService.SecurityEventEntry;
import com.example.lowcode.audit.application.SecurityEventService.SecurityEventRepository;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class MemorySecurityEventRepository implements SecurityEventRepository {
    private final List<TenantSecurityEventEntry> entries = new CopyOnWriteArrayList<>();

    @Override
    public void save(String tenantId, SecurityEventEntry entry) {
        entries.add(new TenantSecurityEventEntry(tenantId, entry));
    }

    @Override
    public List<SecurityEventEntry> listLatest(String tenantId) {
        return entries.stream()
                .filter(entry -> entry.tenantId().equals(tenantId))
                .map(TenantSecurityEventEntry::entry)
                .toList();
    }

    private record TenantSecurityEventEntry(String tenantId, SecurityEventEntry entry) {
    }
}
