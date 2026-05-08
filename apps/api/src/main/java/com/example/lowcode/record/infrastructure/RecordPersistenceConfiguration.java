package com.example.lowcode.record.infrastructure;

import com.example.lowcode.record.application.RuntimeRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class RecordPersistenceConfiguration {
    @Bean
    @ConditionalOnMissingBean(RuntimeRecordRepository.class)
    RuntimeRecordRepository memoryRuntimeRecordRepository() {
        return new MemoryRuntimeRecordRepository();
    }

    @Bean
    @Profile("db")
    RuntimeRecordRepository jdbcRuntimeRecordRepository(DataSource dataSource, ObjectMapper objectMapper) {
        return new JdbcRuntimeRecordRepository(dataSource, objectMapper);
    }
}
