package com.example.lowcode.record.infrastructure;

import com.example.lowcode.record.application.RuntimeRecordRepository;
import com.example.lowcode.record.application.RuntimeRecordService.RuntimeRecord;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class MemoryRuntimeRecordRepository implements RuntimeRecordRepository {
    private final Map<String, RuntimeRecord> records = new ConcurrentHashMap<>();

    @Override
    public RuntimeRecord save(RuntimeRecord record) {
        records.put(key(record.tenantId(), record.appId(), record.entityKey(), record.id()), record);
        return record;
    }

    @Override
    public Optional<RuntimeRecord> find(String tenantId, String appId, String entityKey, String recordId) {
        return Optional.ofNullable(records.get(key(tenantId, appId, entityKey, recordId)));
    }

    @Override
    public List<RuntimeRecord> list(String tenantId, String appId, String entityKey) {
        return records.values().stream()
                .filter(record -> record.tenantId().equals(tenantId))
                .filter(record -> record.appId().equals(appId))
                .filter(record -> record.entityKey().equals(entityKey))
                .sorted(Comparator.comparing(RuntimeRecord::updatedAt).reversed())
                .toList();
    }

    private static String key(String tenantId, String appId, String entityKey, String recordId) {
        return tenantId + ":" + appId + ":" + entityKey + ":" + recordId;
    }
}
