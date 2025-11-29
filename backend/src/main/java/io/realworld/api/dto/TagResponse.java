package io.realworld.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 태그 목록 응답 DTO
 */
@Getter
@AllArgsConstructor
public class TagResponse {

    private List<String> tags;

    public static TagResponse of(List<String> tags) {
        return new TagResponse(tags);
    }
}
