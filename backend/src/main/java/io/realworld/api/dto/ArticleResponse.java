package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.realworld.domain.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 아티클 응답 DTO
 */
@Getter
@AllArgsConstructor
@JsonRootName("article")
public class ArticleResponse {

    private String slug;
    private String title;
    private String description;
    private String body;
    private List<String> tagList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean favorited;
    private int favoritesCount;
    private AuthorResponse author;

    public static ArticleResponse of(Article article, boolean favorited, int favoritesCount, boolean following) {
        return new ArticleResponse(
                article.getSlug(),
                article.getTitle(),
                article.getDescription(),
                article.getBody(),
                article.getTags().stream()
                        .map(tag -> tag.getName())
                        .toList(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                favorited,
                favoritesCount,
                AuthorResponse.of(article.getAuthor(), following)
        );
    }

    public static ArticleResponse of(Article article) {
        return of(article, false, 0, false);
    }
}
