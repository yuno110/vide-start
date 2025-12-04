package io.realworld.domain;

import io.realworld.api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * ProfileService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FollowRepository followRepository;

    @InjectMocks
    private ProfileService profileService;

    private User follower;
    private User following;

    @BeforeEach
    void setUp() {
        follower = User.builder()
                .username("follower")
                .email("follower@example.com")
                .password("password")
                .build();
        ReflectionTestUtils.setField(follower, "id", 1L);

        following = User.builder()
                .username("following")
                .email("following@example.com")
                .password("password")
                .build();
        ReflectionTestUtils.setField(following, "id", 2L);
    }

    @Test
    @DisplayName("사용자 이름으로 사용자를 조회할 수 있다")
    void findByUsernameSuccess() {
        // given
        String username = "following";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(following));

        // when
        User found = profileService.findByUsername(username);

        // then
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo(username);
        verify(userRepository).findByUsername(username);
    }

    @Test
    @DisplayName("존재하지 않는 사용자 이름으로 조회 시 예외가 발생한다")
    void findByUsernameNotFound() {
        // given
        String username = "nonexistent";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> profileService.findByUsername(username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("사용자를 팔로우할 수 있다")
    void followUserSuccess() {
        // given
        String username = "following";
        Follow mockFollow = org.mockito.Mockito.mock(Follow.class);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(following));
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(false);
        when(followRepository.save(any(Follow.class))).thenReturn(mockFollow);

        // when
        User result = profileService.followUser(follower, username);

        // then
        assertThat(result).isEqualTo(following);
        verify(followRepository).save(any(Follow.class));
    }

    @Test
    @DisplayName("이미 팔로우 중인 사용자를 팔로우하면 중복 저장하지 않는다")
    void followUserAlreadyFollowing() {
        // given
        String username = "following";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(following));
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(true);

        // when
        User result = profileService.followUser(follower, username);

        // then
        assertThat(result).isEqualTo(following);
        verify(followRepository, org.mockito.Mockito.never()).save(any(Follow.class));
    }

    @Test
    @DisplayName("존재하지 않는 사용자를 팔로우하면 예외가 발생한다")
    void followUserNotFound() {
        // given
        String username = "nonexistent";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> profileService.followUser(follower, username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("사용자를 언팔로우할 수 있다")
    void unfollowUserSuccess() {
        // given
        String username = "following";
        Follow mockFollow = org.mockito.Mockito.mock(Follow.class);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(following));
        when(followRepository.findByFollowerAndFollowing(follower, following))
                .thenReturn(Optional.of(mockFollow));

        // when
        User result = profileService.unfollowUser(follower, username);

        // then
        assertThat(result).isEqualTo(following);
        verify(followRepository).delete(mockFollow);
    }

    @Test
    @DisplayName("팔로우하지 않은 사용자를 언팔로우하면 오류 없이 처리된다")
    void unfollowUserNotFollowing() {
        // given
        String username = "following";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(following));
        when(followRepository.findByFollowerAndFollowing(follower, following))
                .thenReturn(Optional.empty());

        // when
        User result = profileService.unfollowUser(follower, username);

        // then
        assertThat(result).isEqualTo(following);
        verify(followRepository, org.mockito.Mockito.never()).delete(any(Follow.class));
    }

    @Test
    @DisplayName("존재하지 않는 사용자를 언팔로우하면 예외가 발생한다")
    void unfollowUserNotFound() {
        // given
        String username = "nonexistent";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> profileService.unfollowUser(follower, username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("팔로우 여부를 확인할 수 있다")
    void isFollowingTrue() {
        // given
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(true);

        // when
        boolean result = profileService.isFollowing(follower, following);

        // then
        assertThat(result).isTrue();
        verify(followRepository).existsByFollowerAndFollowing(follower, following);
    }

    @Test
    @DisplayName("팔로우하지 않으면 false를 반환한다")
    void isFollowingFalse() {
        // given
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(false);

        // when
        boolean result = profileService.isFollowing(follower, following);

        // then
        assertThat(result).isFalse();
        verify(followRepository).existsByFollowerAndFollowing(follower, following);
    }

    @Test
    @DisplayName("팔로워가 null이면 false를 반환한다")
    void isFollowingNullFollower() {
        // when
        boolean result = profileService.isFollowing(null, following);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("팔로잉 대상이 null이면 false를 반환한다")
    void isFollowingNullFollowing() {
        // when
        boolean result = profileService.isFollowing(follower, null);

        // then
        assertThat(result).isFalse();
    }
}
