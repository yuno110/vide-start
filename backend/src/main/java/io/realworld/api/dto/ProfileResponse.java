package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.realworld.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 프로필 응답 DTO
 */
@Getter
@AllArgsConstructor
@JsonRootName("profile")
public class ProfileResponse {

    private String username;
    private String bio;
    private String image;
    private boolean following;

    public static ProfileResponse of(User user, boolean following) {
        return new ProfileResponse(
                user.getUsername(),
                user.getBio(),
                user.getImage(),
                following
        );
    }

    public static ProfileResponse of(User user) {
        return of(user, false);
    }
}
