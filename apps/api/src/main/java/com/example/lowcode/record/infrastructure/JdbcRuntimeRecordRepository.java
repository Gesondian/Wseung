package com.example.lowcode.record.infrastructure;

import com.example.lowcode.record.application.RuntimeRecordRepository;
import com.example.lowcode.record.application.RuntimeRecordService.RuntimeRecord;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;

public class JdbcRuntimeRecordRepository implements RuntimeRecordRepository {
    private final DataSource dataSource;
    private final ObjectMapper objectMapper;

    public JdbcRuntimeRecordRepository(DataSource dataSource, ObjectMapper objectMapper) {
        this.dataSource = dataSource;
        this.objectMapper = objectMapper;
    }

    @Override
    public RuntimeRecord save(RuntimeRecord record) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     insert into lc_business_record (
                         id, tenant_id, app_id, entity_key, snapshot_id, record_version,
                         business_status, workflow_status, data_json, created_at, updated_at
                     ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     on conflict (id) do update set
                         record_version = excluded.record_version,
                         business_status = excluded.business_status,
                         workflow_status = excluded.workflow_status,
                         data_json = excluded.data_json,
                         updated_at = excluded.updated_at
                     """)) {
            statement.setString(1, record.id());
            statement.setString(2, record.tenantId());
            statement.setString(3, record.appId());
            statement.setString(4, record.entityKey());
            statement.setString(5, record.snapshotId());
            statement.setLong(6, record.recordVersion());
            statement.setString(7, record.businessStatus());
            statement.setString(8, record.workflowStatus());
            statement.setObject(9, objectMapper.writeValueAsString(record.data()), Types.OTHER);
            statement.setTimestamp(10, Timestamp.from(record.createdAt()));
            statement.setTimestamp(11, Timestamp.from(record.updatedAt()));
            statement.executeUpdate();
            return record;
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save runtime record", exception);
        }
    }

    @Override
    public Optional<RuntimeRecord> find(String tenantId, String appId, String entityKey, String recordId) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select id, tenant_id, app_id, entity_key, snapshot_id, record_version,
                            business_status, workflow_status, data_json, created_at, updated_at
                     from lc_business_record
                     where tenant_id = ?
                       and app_id = ?
                       and entity_key = ?
                       and id = ?
                     """)) {
            statement.setString(1, tenantId);
            statement.setString(2, appId);
            statement.setString(3, entityKey);
            statement.setString(4, recordId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(toRecord(resultSet));
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to find runtime record", exception);
        }
    }

    @Override
    public List<RuntimeRecord> list(String tenantId, String appId, String entityKey) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select id, tenant_id, app_id, entity_key, snapshot_id, record_version,
                            business_status, workflow_status, data_json, created_at, updated_at
                     from lc_business_record
                     where tenant_id = ?
                       and app_id = ?
                       and entity_key = ?
                     order by updated_at desc
                     """)) {
            statement.setString(1, tenantId);
            statement.setString(2, appId);
            statement.setString(3, entityKey);
            try (ResultSet resultSet = statement.executeQuery()) {
                List<RuntimeRecord> records = new ArrayList<>();
                while (resultSet.next()) {
                    records.add(toRecord(resultSet));
                }
                return records;
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to list runtime records", exception);
        }
    }

    private RuntimeRecord toRecord(ResultSet resultSet) throws Exception {
        JsonNode data = objectMapper.readTree(resultSet.getString("data_json"));
        return new RuntimeRecord(
                resultSet.getString("id"),
                resultSet.getString("tenant_id"),
                resultSet.getString("app_id"),
                resultSet.getString("entity_key"),
                resultSet.getString("snapshot_id"),
                "appver_" + resultSet.getString("app_id"),
                resultSet.getLong("record_version"),
                resultSet.getString("business_status"),
                resultSet.getString("workflow_status"),
                data,
                resultSet.getTimestamp("created_at").toInstant(),
                resultSet.getTimestamp("updated_at").toInstant()
        );
    }

}
