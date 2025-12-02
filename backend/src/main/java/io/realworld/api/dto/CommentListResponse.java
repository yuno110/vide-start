package io.realworld.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 댓글 목록 응답 DTO
 */
@Getter
@AllArgsConstructor
public class CommentListResponse {

    private List<CommentResponse> comments;

    public static CommentListResponse of(List<CommentResponse> comments) {
        return new CommentListResponse(comments);
    }
}
