package io.realworld.api;

import io.realworld.api.dto.ArticleCreateRequest;
import io.realworld.api.dto.ArticleListResponse;
import io.realworld.api.dto.ArticleResponse;
import io.realworld.api.dto.ArticleUpdateRequest;
import io.realworld.domain.Article;
import io.realworld.domain.ArticleService;
import io.realworld.domain.FollowRepository;
import io.realworld.domain.User;
import io.realworld.domain.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 아티클 컨트롤러
 */
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    /**
     * 아티클 목록 조회
     */
    @GetMapping
    public ResponseEntity<ArticleListResponse> getArticles(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String favorited,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUser(userDetails);
        List<Article> articles;

        // 필터링
        if (tag != null) {
            articles = articleService.findByTag(tag);
        } else if (author != null) {
            articles = articleService.findByAuthor(author);
        } else if (favorited != null) {
            articles = articleService.findByFavoritedUser(favorited);
        } else {
            articles = articleService.findAllArticles();
        }

        // 페이지네이션 적용
        List<ArticleResponse> articleResponses = articles.stream()
                .skip(offset)
                .limit(limit)
                .map(article -> toArticleResponse(article, currentUser))
                .toList();

        return ResponseEntity.ok(ArticleListResponse.of(articleResponses));
    }

    /**
     * 아티클 상세 조회
     */
    @GetMapping("/{slug}")
    public ResponseEntity<ArticleResponse> getArticle(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUser(userDetails);
        Article article = articleService.findBySlug(slug);
        ArticleResponse response = toArticleResponse(article, currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * 아티클 작성
     */
    @PostMapping
    public ResponseEntity<ArticleResponse> createArticle(
            @Valid @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ArticleCreateRequest createRequest = extractArticleCreateRequest(request);
        User currentUser = getCurrentUserRequired(userDetails);

        Article article = articleService.createArticle(
                createRequest.getTitle(),
                createRequest.getDescription(),
                createRequest.getBody(),
                createRequest.getTagList(),
                currentUser
        );

        ArticleResponse response = toArticleResponse(article, currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * 아티클 수정
     */
    @PutMapping("/{slug}")
    public ResponseEntity<ArticleResponse> updateArticle(
            @PathVariable String slug,
            @Valid @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ArticleUpdateRequest updateRequest = extractArticleUpdateRequest(request);
        User currentUser = getCurrentUserRequired(userDetails);

        Article article = articleService.updateArticle(
                slug,
                updateRequest.getTitle(),
                updateRequest.getDescription(),
                updateRequest.getBody(),
                currentUser
        );

        ArticleResponse response = toArticleResponse(article, currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * 아티클 삭제
     */
    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deleteArticle(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUserRequired(userDetails);
        articleService.deleteArticle(slug, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Article을 ArticleResponse로 변환
     */
    private ArticleResponse toArticleResponse(Article article, User currentUser) {
        boolean favorited = articleService.isFavorited(article, currentUser);
        int favoritesCount = articleService.getFavoritesCount(article);
        boolean following = isFollowing(article.getAuthor(), currentUser);

        return ArticleResponse.of(article, favorited, favoritesCount, following);
    }

    /**
     * 팔로우 여부 확인
     */
    private boolean isFollowing(User target, User currentUser) {
        if (currentUser == null) {
            return false;
        }
        return followRepository.existsByFollowerAndFollowing(currentUser, target);
    }

    /**
     * 현재 사용자 조회 (Optional)
     */
    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    }

    /**
     * 현재 사용자 조회 (Required)
     */
    private User getCurrentUserRequired(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다"));
    }

    /**
     * ArticleCreateRequest 추출
     */
    private ArticleCreateRequest extractArticleCreateRequest(Map<String, Object> request) {
        Map<String, Object> article = (Map<String, Object>) request.getOrDefault("article", request);
        return new ArticleCreateRequest(
                (String) article.get("title"),
                (String) article.get("description"),
                (String) article.get("body"),
                (List<String>) article.get("tagList")
        );
    }

    /**
     * ArticleUpdateRequest 추출
     */
    private ArticleUpdateRequest extractArticleUpdateRequest(Map<String, Object> request) {
        Map<String, Object> article = (Map<String, Object>) request.getOrDefault("article", request);
        return new ArticleUpdateRequest(
                (String) article.get("title"),
                (String) article.get("description"),
                (String) article.get("body")
        );
    }
}
