package com.example.lowcode.common.idempotency;

import com.example.lowcode.common.error.BusinessException;
import com.example.lowcode.common.error.ErrorCode;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class IdempotencyService {
    private final IdempotencyRepository repository;

    public IdempotencyService(IdempotencyRepository repository) {
        this.repository = repository;
    }

    public IdempotencyRecord start(String idempotencyKey, String requestHash) {
        IdempotencyRecord existing = repository.find(idempotencyKey).orElse(null);
        if (existing != null && !existing.requestHash().equals(requestHash)) {
            throw new BusinessException(ErrorCode.IDEMPOTENCY_CONFLICT, "幂等键已被不同请求使用");
        }
        if (existing != null) {
            return existing;
        }

        IdempotencyRecord record = new IdempotencyRecord(idempotencyKey, requestHash, "processing", Instant.now());
        repository.save(record);
        return record;
    }

    public void complete(String idempotencyKey) {
        repository.markCompleted(idempotencyKey, Instant.now());
    }

    public interface IdempotencyRepository {
        Optional<IdempotencyRecord> find(String idempotencyKey);

        void save(IdempotencyRecord record);

        void markCompleted(String idempotencyKey, Instant completedAt);
    }

    public record IdempotencyRecord(String idempotencyKey, String requestHash, String status, Instant createdAt) {
    }
}
