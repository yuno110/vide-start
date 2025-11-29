package io.realworld.domain;

import io.realworld.api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * ArticleService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private ArticleService articleService;

    private User testUser;
    private Article testArticle;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .build();

        testArticle = Article.builder()
                .slug("test-article")
                .title("Test Article")
                .description("Test Description")
                .body("Test Body")
                .author(testUser)
                .build();
    }

    @Test
    @DisplayName("아티클 생성 시 slug가 자동으로 생성된다")
    void createArticle() {
        // given
        String title = "How to train your dragon";
        String description = "Ever wonder how?";
        String body = "It takes a Jacobian";
        List<String> tagList = Arrays.asList("dragons", "training");

        when(articleRepository.existsBySlug(anyString())).thenReturn(false);
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);
        when(tagRepository.findByName(anyString())).thenReturn(Optional.empty());
        when(tagRepository.save(any(Tag.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Article created = articleService.createArticle(title, description, body, tagList, testUser);

        // then
        verify(articleRepository).save(any(Article.class));
        assertThat(created).isNotNull();
    }

    @Test
    @DisplayName("slug로 아티클을 조회할 수 있다")
    void findBySlug() {
        // given
        String slug = "test-article";
        when(articleRepository.findBySlug(slug)).thenReturn(Optional.of(testArticle));

        // when
        Article found = articleService.findBySlug(slug);

        // then
        assertThat(found).isNotNull();
        assertThat(found.getSlug()).isEqualTo(slug);
    }

    @Test
    @DisplayName("존재하지 않는 slug로 조회 시 예외가 발생한다")
    void findBySlugNotFound() {
        // given
        String slug = "non-existent";
        when(articleRepository.findBySlug(slug)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> articleService.findBySlug(slug))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("최신 아티클 목록을 조회할 수 있다")
    void findAllArticles() {
        // given
        List<Article> articles = Arrays.asList(testArticle);
        when(articleRepository.findAllByOrderByCreatedAtDesc()).thenReturn(articles);

        // when
        List<Article> found = articleService.findAllArticles();

        // then
        assertThat(found).hasSize(1);
        assertThat(found.get(0)).isEqualTo(testArticle);
    }

    @Test
    @DisplayName("작성자로 아티클을 필터링할 수 있다")
    void findByAuthor() {
        // given
        String username = "testuser";
        List<Article> articles = Arrays.asList(testArticle);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(articleRepository.findByAuthorOrderByCreatedAtDesc(testUser)).thenReturn(articles);

        // when
        List<Article> found = articleService.findByAuthor(username);

        // then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getAuthor()).isEqualTo(testUser);
    }

    @Test
    @DisplayName("태그로 아티클을 필터링할 수 있다")
    void findByTag() {
        // given
        String tagName = "dragons";
        List<Article> articles = Arrays.asList(testArticle);
        when(articleRepository.findByTagName(tagName)).thenReturn(articles);

        // when
        List<Article> found = articleService.findByTag(tagName);

        // then
        assertThat(found).hasSize(1);
    }

    @Test
    @DisplayName("아티클 작성자가 아티클을 수정할 수 있다")
    void updateArticle() {
        // given
        String slug = "test-article";
        String newTitle = "Updated Title";
        String newDescription = "Updated Description";
        String newBody = "Updated Body";

        when(articleRepository.findBySlug(slug)).thenReturn(Optional.of(testArticle));
        when(articleRepository.existsBySlug(anyString())).thenReturn(false);
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

        // when
        Article updated = articleService.updateArticle(slug, newTitle, newDescription, newBody, testUser);

        // then
        verify(articleRepository).save(any(Article.class));
        assertThat(updated).isNotNull();
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 아티클 수정 시 예외가 발생한다")
    void updateArticleByNonAuthor() {
        // given
        String slug = "test-article";
        User otherUser = User.builder()
                .username("otheruser")
                .email("other@example.com")
                .password("password")
                .build();

        when(articleRepository.findBySlug(slug)).thenReturn(Optional.of(testArticle));

        // when & then
        assertThatThrownBy(() -> articleService.updateArticle(slug, "New Title", "New Desc", "New Body", otherUser))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    @DisplayName("아티클 작성자가 아티클을 삭제할 수 있다")
    void deleteArticle() {
        // given
        String slug = "test-article";
        when(articleRepository.findBySlug(slug)).thenReturn(Optional.of(testArticle));

        // when
        articleService.deleteArticle(slug, testUser);

        // then
        verify(articleRepository).delete(testArticle);
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 아티클 삭제 시 예외가 발생한다")
    void deleteArticleByNonAuthor() {
        // given
        String slug = "test-article";
        User otherUser = User.builder()
                .username("otheruser")
                .email("other@example.com")
                .password("password")
                .build();

        when(articleRepository.findBySlug(slug)).thenReturn(Optional.of(testArticle));

        // when & then
        assertThatThrownBy(() -> articleService.deleteArticle(slug, otherUser))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    @DisplayName("제목에서 slug를 생성할 수 있다")
    void generateSlug() {
        // given
        String title = "How to train your dragon";

        when(articleRepository.existsBySlug(anyString())).thenReturn(false);

        // when
        String slug = articleService.generateSlug(title);

        // then
        assertThat(slug).isNotNull();
        assertThat(slug).matches("[a-z0-9-]+");
        assertThat(slug).contains("how-to-train-your-dragon");
    }

    @Test
    @DisplayName("중복된 slug가 있을 경우 랜덤 접미사를 추가한다")
    void generateUniqueSlug() {
        // given
        String title = "Test Article";
        when(articleRepository.existsBySlug(anyString())).thenReturn(true, false);

        // when
        String slug = articleService.generateSlug(title);

        // then
        assertThat(slug).startsWith("test-article-");
        assertThat(slug.length()).isGreaterThan("test-article-".length());
    }
}
