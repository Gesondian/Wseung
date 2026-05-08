package com.example.lowcode.audit.infrastructure;

import com.example.lowcode.audit.application.SecurityEventService.SecurityEventEntry;
import com.example.lowcode.audit.application.SecurityEventService.SecurityEventRepository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.sql.DataSource;

public class SecurityEventJdbcRepository implements SecurityEventRepository {
    private final DataSource dataSource;

    public SecurityEventJdbcRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(String tenantId, SecurityEventEntry entry) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     insert into lc_security_event (
                         id, tenant_id, event_type, principal, description,
                         request_id, trace_id, occurred_at
                     ) values (?, ?, ?, ?, ?, ?, ?, ?)
                     """)) {
            statement.setString(1, UUID.randomUUID().toString());
            statement.setString(2, tenantId);
            statement.setString(3, entry.eventType());
            statement.setString(4, entry.principal());
            statement.setString(5, entry.description());
            statement.setString(6, entry.requestId());
            statement.setString(7, entry.traceId());
            statement.setTimestamp(8, Timestamp.from(entry.occurredAt()));
            statement.executeUpdate();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save security event", exception);
        }
    }

    @Override
    public List<SecurityEventEntry> listLatest(String tenantId) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select event_type, principal, description, request_id, trace_id, occurred_at
                     from lc_security_event
                     where tenant_id = ?
                     order by occurred_at desc
                     """)) {
            statement.setString(1, tenantId);
            try (ResultSet resultSet = statement.executeQuery()) {
                List<SecurityEventEntry> entries = new ArrayList<>();
                while (resultSet.next()) {
                    Instant occurredAt = resultSet.getTimestamp("occurred_at").toInstant();
                    entries.add(new SecurityEventEntry(
                            resultSet.getString("event_type"),
                            resultSet.getString("principal"),
                            resultSet.getString("description"),
                            resultSet.getString("request_id"),
                            resultSet.getString("trace_id"),
                            occurredAt
                    ));
                }
                return entries;
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to list security events", exception);
        }
    }
}
