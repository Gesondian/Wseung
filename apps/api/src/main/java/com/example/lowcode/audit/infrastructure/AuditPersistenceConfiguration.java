package com.example.lowcode.audit.infrastructure;

import com.example.lowcode.audit.application.AuditLogService.AuditLogRepository;
import com.example.lowcode.audit.application.SecurityEventService.SecurityEventRepository;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class AuditPersistenceConfiguration {
    @Bean
    @ConditionalOnMissingBean(AuditLogRepository.class)
    AuditLogRepository memoryAuditLogRepository() {
        return new MemoryAuditLogRepository();
    }

    @Bean
    @ConditionalOnMissingBean(SecurityEventRepository.class)
    SecurityEventRepository memorySecurityEventRepository() {
        return new MemorySecurityEventRepository();
    }

    @Bean
    @Profile("db")
    AuditLogRepository jdbcAuditLogRepository(DataSource dataSource) {
        return new AuditLogJdbcRepository(dataSource);
    }

    @Bean
    @Profile("db")
    SecurityEventRepository jdbcSecurityEventRepository(DataSource dataSource) {
        return new SecurityEventJdbcRepository(dataSource);
    }
}
