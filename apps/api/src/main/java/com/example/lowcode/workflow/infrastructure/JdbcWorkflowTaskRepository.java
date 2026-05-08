package com.example.lowcode.workflow.infrastructure;

import com.example.lowcode.workflow.application.WorkflowTaskRepository;
import com.example.lowcode.workflow.application.WorkflowTaskService.WorkflowTask;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;

public class JdbcWorkflowTaskRepository implements WorkflowTaskRepository {
    private final DataSource dataSource;

    public JdbcWorkflowTaskRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public WorkflowTask save(WorkflowTask task) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     insert into lc_workflow_task (
                         id, tenant_id, app_id, entity_key, record_id, workflow_instance_id,
                         snapshot_id, task_name, task_version, assignee_id, applicant_id,
                         status, summary, idempotency_key, created_at, completed_at
                     ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     on conflict (id) do update set
                         task_version = excluded.task_version,
                         status = excluded.status,
                         idempotency_key = excluded.idempotency_key,
                         completed_at = excluded.completed_at
                     """)) {
            statement.setString(1, task.id());
            statement.setString(2, task.tenantId());
            statement.setString(3, task.appId());
            statement.setString(4, task.entityKey());
            statement.setString(5, task.recordId());
            statement.setString(6, task.workflowInstanceId());
            statement.setString(7, task.snapshotId());
            statement.setString(8, task.taskName());
            statement.setLong(9, task.taskVersion());
            statement.setString(10, task.assigneeId());
            statement.setString(11, task.applicantId());
            statement.setString(12, task.status());
            statement.setString(13, task.summary());
            statement.setString(14, task.idempotencyKey());
            statement.setTimestamp(15, Timestamp.from(task.createdAt()));
            statement.setTimestamp(16, task.completedAt() == null ? null : Timestamp.from(task.completedAt()));
            statement.executeUpdate();
            return findById(task.tenantId(), task.id()).orElse(task);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save workflow task", exception);
        }
    }

    @Override
    public List<WorkflowTask> listByAssignee(String tenantId, String assigneeId) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select id, tenant_id, app_id, entity_key, record_id, workflow_instance_id,
                            snapshot_id, task_name, task_version, assignee_id, applicant_id,
                            status, summary, idempotency_key, created_at, completed_at
                     from lc_workflow_task
                     where tenant_id = ?
                       and assignee_id = ?
                     order by created_at desc
                     """)) {
            statement.setString(1, tenantId);
            statement.setString(2, assigneeId);
            try (ResultSet resultSet = statement.executeQuery()) {
                List<WorkflowTask> tasks = new ArrayList<>();
                while (resultSet.next()) {
                    tasks.add(toTask(resultSet));
                }
                return tasks;
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to list workflow tasks", exception);
        }
    }

    @Override
    public Optional<WorkflowTask> findById(String tenantId, String taskId) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select id, tenant_id, app_id, entity_key, record_id, workflow_instance_id,
                            snapshot_id, task_name, task_version, assignee_id, applicant_id,
                            status, summary, idempotency_key, created_at, completed_at
                     from lc_workflow_task
                     where tenant_id = ?
                       and id = ?
                     """)) {
            statement.setString(1, tenantId);
            statement.setString(2, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(toTask(resultSet));
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to find workflow task", exception);
        }
    }

    @Override
    public Optional<WorkflowTask> findByIdempotencyKey(String tenantId, String idempotencyKey) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     select id, tenant_id, app_id, entity_key, record_id, workflow_instance_id,
                            snapshot_id, task_name, task_version, assignee_id, applicant_id,
                            status, summary, idempotency_key, created_at, completed_at
                     from lc_workflow_task
                     where tenant_id = ?
                       and idempotency_key = ?
                     """)) {
            statement.setString(1, tenantId);
            statement.setString(2, idempotencyKey);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(toTask(resultSet));
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to find workflow task", exception);
        }
    }

    private WorkflowTask toTask(ResultSet resultSet) throws Exception {
        Timestamp completedAt = resultSet.getTimestamp("completed_at");
        return new WorkflowTask(
                resultSet.getString("id"),
                resultSet.getString("tenant_id"),
                resultSet.getString("app_id"),
                resultSet.getString("entity_key"),
                resultSet.getString("record_id"),
                resultSet.getString("workflow_instance_id"),
                resultSet.getString("snapshot_id"),
                resultSet.getString("task_name"),
                resultSet.getLong("task_version"),
                resultSet.getString("assignee_id"),
                resultSet.getString("applicant_id"),
                resultSet.getString("status"),
                resultSet.getString("summary"),
                resultSet.getString("idempotency_key"),
                resultSet.getTimestamp("created_at").toInstant(),
                completedAt == null ? null : completedAt.toInstant()
        );
    }
}
