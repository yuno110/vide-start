package io.realworld.api.dto;

import io.realworld.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 작성자 정보 응답 DTO
 */
@Getter
@AllArgsConstructor
public class AuthorResponse {

    private String username;
    private String bio;
    private String image;
    private boolean following;

    public static AuthorResponse of(User author, boolean following) {
        return new AuthorResponse(
                author.getUsername(),
                author.getBio(),
                author.getImage(),
                following
        );
    }

    public static AuthorResponse of(User author) {
        return of(author, false);
    }
}
