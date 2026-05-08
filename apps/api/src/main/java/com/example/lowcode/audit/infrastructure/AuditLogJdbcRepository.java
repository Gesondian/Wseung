package com.example.lowcode.audit.infrastructure;

import com.example.lowcode.audit.application.AuditLogService.AuditLogEntry;
import com.example.lowcode.audit.application.AuditLogService.AuditLogRepository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.sql.DataSource;

public class AuditLogJdbcRepository implements AuditLogRepository {
    private final DataSource dataSource;

    public AuditLogJdbcRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(String tenantId, AuditLogEntry entry) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     insert into lc_audit_log (
                         id, tenant_id, action, resource_type, resource_id, result,
                         operator_id, request_id, trace_id, occurred_at
                     ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     """)) {
            statement.setString(1, UUID.randomUUID().toString());
            statement.setString(2, tenantId);
            statement.setString(3, entry.action());
            statement.setString(4, entry.resourceType());
            statement.setString(5, entry.resourceId());
            statement.setString(6, entry.result());
            statement.setString(7, entry.operatorId());
            statement.setString(8, entry.requestId());
            statement.setString(9, entry.traceId());
            statement.setTimestamp(10, Timestamp.from(entry.occurredAt()));
            statement.executeUpdate();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save audit log", exception);
        }
    }

    @Override
    public List<AuditLogEntry> listLatest(String tenantId) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select action, resource_type, resource_id, result,
                            operator_id, request_id, trace_id, occurred_at
                     from lc_audit_log
                     where tenant_id = ?
                     order by occurred_at desc
                     """)) {
            statement.setString(1, tenantId);
            try (ResultSet resultSet = statement.executeQuery()) {
            List<AuditLogEntry> entries = new ArrayList<>();
            while (resultSet.next()) {
                Instant occurredAt = resultSet.getTimestamp("occurred_at").toInstant();
                entries.add(new AuditLogEntry(
                        resultSet.getString("action"),
                        resultSet.getString("resource_type"),
                        resultSet.getString("resource_id"),
                        resultSet.getString("result"),
                        resultSet.getString("operator_id"),
                        resultSet.getString("request_id"),
                        resultSet.getString("trace_id"),
                        occurredAt
                ));
            }
            return entries;
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to list audit logs", exception);
        }
    }
}
