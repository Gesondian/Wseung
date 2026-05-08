package com.example.lowcode.workflow.infrastructure;

import com.example.lowcode.workflow.application.WorkflowTaskRepository;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class WorkflowPersistenceConfiguration {
    @Bean
    @ConditionalOnMissingBean(WorkflowTaskRepository.class)
    WorkflowTaskRepository memoryWorkflowTaskRepository() {
        return new MemoryWorkflowTaskRepository();
    }

    @Bean
    @Profile("db")
    WorkflowTaskRepository jdbcWorkflowTaskRepository(DataSource dataSource) {
        return new JdbcWorkflowTaskRepository(dataSource);
    }
}
