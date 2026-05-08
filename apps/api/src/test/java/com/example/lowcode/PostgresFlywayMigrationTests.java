package com.example.lowcode;

import com.example.lowcode.audit.application.AuditLogService.AuditLogEntry;
import com.example.lowcode.audit.application.SecurityEventService.SecurityEventEntry;
import com.example.lowcode.audit.infrastructure.AuditLogJdbcRepository;
import com.example.lowcode.audit.infrastructure.SecurityEventJdbcRepository;
import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRecord;
import com.example.lowcode.common.idempotency.JdbcIdempotencyRepository;
import com.example.lowcode.record.application.RuntimeRecordService.RuntimeRecord;
import com.example.lowcode.record.infrastructure.JdbcRuntimeRecordRepository;
import com.example.lowcode.workflow.application.WorkflowTaskService.WorkflowTask;
import com.example.lowcode.workflow.infrastructure.JdbcWorkflowTaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.postgresql.ds.PGSimpleDataSource;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers(disabledWithoutDocker = true)
class PostgresFlywayMigrationTests {
    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void appliesP0FoundationMigrationToPostgres() throws Exception {
        migrate();

        try (Connection connection = DriverManager.getConnection(
                postgres.getJdbcUrl(),
                postgres.getUsername(),
                postgres.getPassword()
        ); Statement statement = connection.createStatement()) {
            assertTableExists(statement, "lc_audit_log");
            assertTableExists(statement, "lc_security_event");
            assertTableExists(statement, "lc_api_idempotency_key");
            assertTableExists(statement, "lc_metadata_snapshot");
            assertTableExists(statement, "lc_app_runtime_pointer");
            assertTableExists(statement, "lc_business_record");
            assertTableExists(statement, "lc_workflow_task");
            assertJsonbColumn(statement, "lc_business_record", "data_json");
        }
    }

    @Test
    void auditLogRepositoryPersistsToPostgres() {
        migrate();

        AuditLogJdbcRepository repository = new AuditLogJdbcRepository(postgresDataSource());
        repository.save("default", new AuditLogEntry(
                "audit.test",
                "diagnostics",
                "diag_001",
                "success",
                "usr_admin",
                "req_test_repo",
                "trace_test_repo",
                Instant.parse("2026-05-07T09:00:00Z")
        ));

        List<AuditLogEntry> entries = repository.listLatest("default");

        assertThat(entries).anySatisfy(entry -> {
            assertThat(entry.action()).isEqualTo("audit.test");
            assertThat(entry.resourceType()).isEqualTo("diagnostics");
            assertThat(entry.requestId()).isEqualTo("req_test_repo");
            assertThat(entry.traceId()).isEqualTo("trace_test_repo");
        });
    }

    @Test
    void securityEventRepositoryPersistsToPostgres() {
        migrate();

        SecurityEventJdbcRepository repository = new SecurityEventJdbcRepository(postgresDataSource());
        repository.save("default", new SecurityEventEntry(
                "security.test",
                "usr_admin",
                "repository smoke test",
                "req_test_security_repo",
                "trace_test_security_repo",
                Instant.parse("2026-05-07T09:10:00Z")
        ));

        List<SecurityEventEntry> entries = repository.listLatest("default");

        assertThat(entries).anySatisfy(entry -> {
            assertThat(entry.eventType()).isEqualTo("security.test");
            assertThat(entry.principal()).isEqualTo("usr_admin");
            assertThat(entry.requestId()).isEqualTo("req_test_security_repo");
        });
    }

    @Test
    void idempotencyRepositoryPersistsToPostgres() {
        migrate();

        JdbcIdempotencyRepository repository = new JdbcIdempotencyRepository(postgresDataSource());
        repository.save(new IdempotencyRecord(
                "idem_test_001",
                "hash_001",
                "processing",
                Instant.parse("2026-05-07T09:20:00Z")
        ));

        assertThat(repository.find("idem_test_001"))
                .hasValueSatisfying(record -> {
                    assertThat(record.requestHash()).isEqualTo("hash_001");
                    assertThat(record.status()).isEqualTo("processing");
                });

        repository.markCompleted("idem_test_001", Instant.parse("2026-05-07T09:21:00Z"));

        assertThat(repository.find("idem_test_001"))
                .hasValueSatisfying(record -> assertThat(record.status()).isEqualTo("completed"));
    }

    @Test
    void runtimeRecordRepositoryPersistsToPostgres() throws Exception {
        migrate();

        ObjectMapper objectMapper = new ObjectMapper();
        JdbcRuntimeRecordRepository repository = new JdbcRuntimeRecordRepository(postgresDataSource(), objectMapper);
        RuntimeRecord record = new RuntimeRecord(
                "rec_test_001",
                "default",
                "app_contract",
                "contract",
                "snapshot_app_contract",
                "appver_app_contract",
                1,
                "active",
                "draft",
                objectMapper.readTree("""
                        {"title":"数据库合同","amount":3000}
                        """),
                Instant.parse("2026-05-07T09:30:00Z"),
                Instant.parse("2026-05-07T09:30:00Z")
        );

        repository.save(record);

        assertThat(repository.find("default", "app_contract", "contract", "rec_test_001"))
                .hasValueSatisfying(saved -> {
                    assertThat(saved.data().get("title").asText()).isEqualTo("数据库合同");
                    assertThat(saved.recordVersion()).isEqualTo(1);
                });

        RuntimeRecord updated = record.withData(objectMapper.readTree("""
                {"title":"数据库合同-更新","amount":3600}
                """), Instant.parse("2026-05-07T09:31:00Z"));
        repository.save(updated);

        assertThat(repository.list("default", "app_contract", "contract"))
                .anySatisfy(saved -> {
                    assertThat(saved.id()).isEqualTo("rec_test_001");
                    assertThat(saved.recordVersion()).isEqualTo(2);
                    assertThat(saved.data().get("amount").asInt()).isEqualTo(3600);
                });
    }

    @Test
    void workflowTaskRepositoryPersistsToPostgres() {
        migrate();

        JdbcWorkflowTaskRepository repository = new JdbcWorkflowTaskRepository(postgresDataSource());
        WorkflowTask task = new WorkflowTask(
                "task_test_001",
                "default",
                "app_contract",
                "contract",
                "rec_test_001",
                "wfi_test_001",
                "snapshot_app_contract",
                "主管审批",
                1,
                "usr_approver",
                "usr_admin",
                "todo",
                "提交审批测试",
                "idem_task_001",
                Instant.parse("2026-05-07T09:40:00Z"),
                null
        );

        repository.save(task);

        assertThat(repository.findByIdempotencyKey("default", "idem_task_001"))
                .hasValueSatisfying(saved -> {
                    assertThat(saved.id()).isEqualTo("task_test_001");
                    assertThat(saved.recordId()).isEqualTo("rec_test_001");
                    assertThat(saved.status()).isEqualTo("todo");
                });

        assertThat(repository.listByAssignee("default", "usr_approver"))
                .anySatisfy(saved -> assertThat(saved.id()).isEqualTo("task_test_001"));

        repository.save(task.withCompletedStatus(
                "approved",
                "idem_task_approve_001",
                Instant.parse("2026-05-07T09:41:00Z")
        ));

        assertThat(repository.findById("default", "task_test_001"))
                .hasValueSatisfying(saved -> {
                    assertThat(saved.status()).isEqualTo("approved");
                    assertThat(saved.taskVersion()).isEqualTo(2);
                    assertThat(saved.completedAt()).isEqualTo(Instant.parse("2026-05-07T09:41:00Z"));
                });
    }

    private static void migrate() {
        Flyway.configure()
                .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
                .locations("classpath:db/migration")
                .load()
                .migrate();
    }

    private static PGSimpleDataSource postgresDataSource() {
        PGSimpleDataSource dataSource = new PGSimpleDataSource();
        dataSource.setUrl(postgres.getJdbcUrl());
        dataSource.setUser(postgres.getUsername());
        dataSource.setPassword(postgres.getPassword());
        return dataSource;
    }

    private static void assertTableExists(Statement statement, String tableName) throws Exception {
        try (ResultSet resultSet = statement.executeQuery("""
                select exists (
                    select 1
                    from information_schema.tables
                    where table_schema = 'public'
                      and table_name = '%s'
                )
                """.formatted(tableName))) {
            assertThat(resultSet.next()).isTrue();
            assertThat(resultSet.getBoolean(1)).isTrue();
        }
    }

    private static void assertJsonbColumn(Statement statement, String tableName, String columnName) throws Exception {
        try (ResultSet resultSet = statement.executeQuery("""
                select udt_name
                from information_schema.columns
                where table_schema = 'public'
                  and table_name = '%s'
                  and column_name = '%s'
                """.formatted(tableName, columnName))) {
            assertThat(resultSet.next()).isTrue();
            assertThat(resultSet.getString("udt_name")).isEqualTo("jsonb");
        }
    }
}
