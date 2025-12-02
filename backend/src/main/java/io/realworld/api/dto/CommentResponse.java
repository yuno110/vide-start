package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.realworld.domain.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 댓글 응답 DTO
 */
@Getter
@AllArgsConstructor
@JsonRootName("comment")
public class CommentResponse {

    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String body;
    private AuthorResponse author;

    public static CommentResponse of(Comment comment, boolean following) {
        return new CommentResponse(
                comment.getId(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getBody(),
                AuthorResponse.of(comment.getAuthor(), following)
        );
    }

    public static CommentResponse of(Comment comment) {
        return of(comment, false);
    }
}
