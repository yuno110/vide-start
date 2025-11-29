package io.realworld.domain;

import io.realworld.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.regex.Pattern;

/**
 * 아티클 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final String SLUG_SEPARATOR = "-";

    /**
     * 아티클 생성
     */
    @Transactional
    public Article createArticle(String title, String description, String body, List<String> tagList, User author) {
        String slug = generateSlug(title);

        Article article = Article.builder()
                .slug(slug)
                .title(title)
                .description(description)
                .body(body)
                .author(author)
                .build();

        // 태그 처리
        if (tagList != null && !tagList.isEmpty()) {
            for (String tagName : tagList) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                article.addTag(tag);
            }
        }

        return articleRepository.save(article);
    }

    /**
     * Slug로 아티클 조회
     */
    public Article findBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + slug));
    }

    /**
     * 모든 아티클 조회 (최신순)
     */
    public List<Article> findAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * 작성자로 아티클 필터링
     */
    public List<Article> findByAuthor(String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return articleRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    /**
     * 태그로 아티클 필터링
     */
    public List<Article> findByTag(String tagName) {
        return articleRepository.findByTagName(tagName);
    }

    /**
     * 좋아요한 사용자로 아티클 필터링
     */
    public List<Article> findByFavoritedUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Favorite> favorites = favoriteRepository.findByUser(user);
        return favorites.stream()
                .map(Favorite::getArticle)
                .toList();
    }

    /**
     * 아티클 수정
     */
    @Transactional
    public Article updateArticle(String slug, String title, String description, String body, User currentUser) {
        Article article = findBySlug(slug);

        // 작성자 확인
        if (!article.getAuthor().getUsername().equals(currentUser.getUsername())) {
            throw new AccessDeniedException("작성자만 수정할 수 있습니다");
        }

        // 제목이 변경되었으면 slug도 업데이트
        if (title != null && !title.equals(article.getTitle())) {
            String newSlug = generateSlug(title);
            article.updateSlug(newSlug);
        }

        // 아티클 정보 업데이트
        article.update(
                title != null ? title : article.getTitle(),
                description != null ? description : article.getDescription(),
                body != null ? body : article.getBody()
        );

        return articleRepository.save(article);
    }

    /**
     * 아티클 삭제
     */
    @Transactional
    public void deleteArticle(String slug, User currentUser) {
        Article article = findBySlug(slug);

        // 작성자 확인
        if (!article.getAuthor().getUsername().equals(currentUser.getUsername())) {
            throw new AccessDeniedException("작성자만 삭제할 수 있습니다");
        }

        articleRepository.delete(article);
    }

    /**
     * 사용자가 아티클을 좋아요했는지 확인
     */
    public boolean isFavorited(Article article, User user) {
        if (user == null) {
            return false;
        }
        return favoriteRepository.existsByUserAndArticle(user, article);
    }

    /**
     * 아티클의 좋아요 수 조회
     */
    public int getFavoritesCount(Article article) {
        return (int) favoriteRepository.countByArticle(article);
    }

    /**
     * Slug 생성 (URL-friendly)
     */
    public String generateSlug(String title) {
        String slug = toSlug(title);

        // 중복 확인 및 고유 slug 생성
        if (articleRepository.existsBySlug(slug)) {
            slug = slug + SLUG_SEPARATOR + generateRandomString(6);
        }

        return slug;
    }

    /**
     * 문자열을 URL-friendly slug로 변환
     */
    private String toSlug(String input) {
        String noWhitespace = WHITESPACE.matcher(input).replaceAll(SLUG_SEPARATOR);
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH)
                .replaceAll(SLUG_SEPARATOR + "{2,}", SLUG_SEPARATOR)
                .replaceAll("^" + SLUG_SEPARATOR + "|" + SLUG_SEPARATOR + "$", "");
    }

    /**
     * 랜덤 문자열 생성
     */
    private String generateRandomString(int length) {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
