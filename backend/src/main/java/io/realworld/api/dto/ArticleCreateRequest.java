package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 아티클 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonRootName("article")
public class ArticleCreateRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "설명은 필수입니다")
    private String description;

    @NotBlank(message = "본문은 필수입니다")
    private String body;

    private List<String> tagList;
}
