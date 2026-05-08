package com.example.lowcode.common.idempotency;

import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRecord;
import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRepository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import javax.sql.DataSource;

public class JdbcIdempotencyRepository implements IdempotencyRepository {
    private static final String DEFAULT_TENANT_ID = "default";

    private final DataSource dataSource;

    public JdbcIdempotencyRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<IdempotencyRecord> find(String idempotencyKey) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select idempotency_key, request_hash, status, created_at
                     from lc_api_idempotency_key
                     where idempotency_key = ?
                     """)) {
            statement.setString(1, idempotencyKey);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(new IdempotencyRecord(
                        resultSet.getString("idempotency_key"),
                        resultSet.getString("request_hash"),
                        resultSet.getString("status"),
                        resultSet.getTimestamp("created_at").toInstant()
                ));
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to find idempotency key", exception);
        }
    }

    @Override
    public void save(IdempotencyRecord record) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     insert into lc_api_idempotency_key (
                         idempotency_key, tenant_id, request_hash, status, created_at, completed_at
                     ) values (?, ?, ?, ?, ?, null)
                     """)) {
            statement.setString(1, record.idempotencyKey());
            statement.setString(2, DEFAULT_TENANT_ID);
            statement.setString(3, record.requestHash());
            statement.setString(4, record.status());
            statement.setTimestamp(5, Timestamp.from(record.createdAt()));
            statement.executeUpdate();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save idempotency key", exception);
        }
    }

    @Override
    public void markCompleted(String idempotencyKey, Instant completedAt) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     update lc_api_idempotency_key
                     set status = 'completed',
                         completed_at = ?
                     where idempotency_key = ?
                     """)) {
            statement.setTimestamp(1, Timestamp.from(completedAt));
            statement.setString(2, idempotencyKey);
            statement.executeUpdate();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to complete idempotency key", exception);
        }
    }
}
