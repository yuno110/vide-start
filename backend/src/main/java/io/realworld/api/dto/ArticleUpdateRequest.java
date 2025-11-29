package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 아티클 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonRootName("article")
public class ArticleUpdateRequest {

    private String title;
    private String description;
    private String body;
}
