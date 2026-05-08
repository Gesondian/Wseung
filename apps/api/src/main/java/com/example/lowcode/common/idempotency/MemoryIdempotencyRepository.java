package com.example.lowcode.common.idempotency;

import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRecord;
import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRepository;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class MemoryIdempotencyRepository implements IdempotencyRepository {
    private final Map<String, IdempotencyRecord> records = new ConcurrentHashMap<>();

    @Override
    public Optional<IdempotencyRecord> find(String idempotencyKey) {
        return Optional.ofNullable(records.get(idempotencyKey));
    }

    @Override
    public void save(IdempotencyRecord record) {
        records.put(record.idempotencyKey(), record);
    }

    @Override
    public void markCompleted(String idempotencyKey, Instant completedAt) {
        records.computeIfPresent(idempotencyKey, (key, record) ->
                new IdempotencyRecord(key, record.requestHash(), "completed", record.createdAt()));
    }
}
