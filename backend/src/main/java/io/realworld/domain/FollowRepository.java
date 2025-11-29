package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 팔로우 리포지토리
 */
public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {

    /**
     * 팔로워와 팔로잉으로 팔로우 조회
     */
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    /**
     * 팔로우 존재 여부 확인
     */
    boolean existsByFollowerAndFollowing(User follower, User following);

    /**
     * 특정 사용자가 팔로우하는 사용자 목록 조회
     */
    List<Follow> findByFollower(User follower);

    /**
     * 특정 사용자를 팔로우하는 사용자 목록 조회
     */
    List<Follow> findByFollowing(User following);

    /**
     * 팔로워 수 조회
     */
    long countByFollowing(User following);

    /**
     * 팔로잉 수 조회
     */
    long countByFollower(User follower);
}
