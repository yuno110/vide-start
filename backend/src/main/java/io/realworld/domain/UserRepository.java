package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 사용자 리포지토리
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(String email);

    /**
     * 사용자명으로 사용자 조회
     */
    Optional<User> findByUsername(String username);

    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);

    /**
     * 사용자명 존재 여부 확인
     */
    boolean existsByUsername(String username);
}
