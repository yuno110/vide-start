package io.realworld.api;

import io.realworld.api.dto.ProfileResponse;
import io.realworld.domain.ProfileService;
import io.realworld.domain.User;
import io.realworld.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 프로필 컨트롤러
 */
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    /**
     * 프로필 조회
     */
    @GetMapping("/{username}")
    public ResponseEntity<ProfileResponse> getProfile(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUser(userDetails);
        User profile = profileService.findByUsername(username);
        boolean following = profileService.isFollowing(currentUser, profile);
        return ResponseEntity.ok(ProfileResponse.of(profile, following));
    }

    /**
     * 사용자 팔로우
     */
    @PostMapping("/{username}/follow")
    public ResponseEntity<ProfileResponse> followUser(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUserRequired(userDetails);
        User profile = profileService.followUser(currentUser, username);
        return ResponseEntity.ok(ProfileResponse.of(profile, true));
    }

    /**
     * 사용자 언팔로우
     */
    @DeleteMapping("/{username}/follow")
    public ResponseEntity<ProfileResponse> unfollowUser(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUserRequired(userDetails);
        User profile = profileService.unfollowUser(currentUser, username);
        return ResponseEntity.ok(ProfileResponse.of(profile, false));
    }

    /**
     * 현재 사용자 조회 (Optional)
     */
    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    }

    /**
     * 현재 사용자 조회 (Required)
     */
    private User getCurrentUserRequired(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다"));
    }
}
