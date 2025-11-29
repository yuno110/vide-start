package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.realworld.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사용자 응답 DTO
 */
@Getter
@AllArgsConstructor
@JsonRootName("user")
public class UserResponse {

    private String email;
    private String token;
    private String username;
    private String bio;
    private String image;

    public static UserResponse of(User user, String token) {
        return new UserResponse(
                user.getEmail(),
                token,
                user.getUsername(),
                user.getBio(),
                user.getImage()
        );
    }
}
