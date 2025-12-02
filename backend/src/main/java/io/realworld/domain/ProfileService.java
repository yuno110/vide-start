package io.realworld.domain;

import io.realworld.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 프로필 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    /**
     * 사용자 이름으로 사용자 조회
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    /**
     * 사용자 팔로우
     */
    @Transactional
    public User followUser(User follower, String username) {
        User following = findByUsername(username);

        // 이미 팔로우 중인지 확인
        if (!followRepository.existsByFollowerAndFollowing(follower, following)) {
            // Follow 엔티티에서 자기 자신 팔로우 방지 검증됨
            Follow follow = new Follow(follower, following);
            followRepository.save(follow);
        }

        return following;
    }

    /**
     * 사용자 언팔로우
     */
    @Transactional
    public User unfollowUser(User follower, String username) {
        User following = findByUsername(username);

        followRepository.findByFollowerAndFollowing(follower, following)
                .ifPresent(followRepository::delete);

        return following;
    }

    /**
     * 팔로우 여부 확인
     */
    public boolean isFollowing(User follower, User following) {
        if (follower == null || following == null) {
            return false;
        }
        return followRepository.existsByFollowerAndFollowing(follower, following);
    }
}
