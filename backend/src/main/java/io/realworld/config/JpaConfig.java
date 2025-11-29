package io.realworld.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA 설정
 * JPA Auditing 활성화 (BaseTimeEntity의 @CreatedDate, @LastModifiedDate 자동 처리)
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
