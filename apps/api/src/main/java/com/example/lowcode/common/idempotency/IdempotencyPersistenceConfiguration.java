package com.example.lowcode.common.idempotency;

import com.example.lowcode.common.idempotency.IdempotencyService.IdempotencyRepository;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class IdempotencyPersistenceConfiguration {
    @Bean
    @ConditionalOnMissingBean(IdempotencyRepository.class)
    IdempotencyRepository memoryIdempotencyRepository() {
        return new MemoryIdempotencyRepository();
    }

    @Bean
    @Profile("db")
    IdempotencyRepository jdbcIdempotencyRepository(DataSource dataSource) {
        return new JdbcIdempotencyRepository(dataSource);
    }
}
