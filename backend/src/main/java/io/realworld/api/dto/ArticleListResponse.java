package io.realworld.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 아티클 목록 응답 DTO
 */
@Getter
@AllArgsConstructor
public class ArticleListResponse {

    private List<ArticleResponse> articles;
    private int articlesCount;

    public static ArticleListResponse of(List<ArticleResponse> articles) {
        return new ArticleListResponse(articles, articles.size());
    }
}
