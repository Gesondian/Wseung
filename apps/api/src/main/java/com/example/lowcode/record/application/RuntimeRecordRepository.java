package com.example.lowcode.record.application;

import com.example.lowcode.record.application.RuntimeRecordService.RuntimeRecord;
import java.util.List;
import java.util.Optional;

public interface RuntimeRecordRepository {
    RuntimeRecord save(RuntimeRecord record);

    Optional<RuntimeRecord> find(String tenantId, String appId, String entityKey, String recordId);

    List<RuntimeRecord> list(String tenantId, String appId, String entityKey);
}
