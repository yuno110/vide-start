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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * CommentService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private CommentService commentService;

    private User testUser;
    private User otherUser;
    private Article testArticle;
    private Comment testComment;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .build();

        otherUser = User.builder()
                .username("otheruser")
                .email("other@example.com")
                .password("password")
                .build();

        testArticle = Article.builder()
                .slug("test-article")
                .title("Test Article")
                .description("Test Description")
                .body("Test Body")
                .author(testUser)
                .build();

        testComment = Comment.builder()
                .body("Test Comment")
                .article(testArticle)
                .author(testUser)
                .build();
    }

    @Test
    @DisplayName("댓글을 생성할 수 있다")
    void createCommentSuccess() {
        // given
        String articleSlug = "test-article";
        String body = "New comment";

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(testArticle));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        // when
        Comment created = commentService.createComment(articleSlug, body, testUser);

        // then
        assertThat(created).isNotNull();
        verify(articleRepository).findBySlug(articleSlug);
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    @DisplayName("존재하지 않는 아티클에 댓글 작성 시 예외가 발생한다")
    void createCommentArticleNotFound() {
        // given
        String articleSlug = "non-existent";
        String body = "New comment";

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> commentService.createComment(articleSlug, body, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article not found");
    }

    @Test
    @DisplayName("아티클의 댓글 목록을 조회할 수 있다")
    void getCommentsByArticleSuccess() {
        // given
        String articleSlug = "test-article";
        List<Comment> comments = Arrays.asList(testComment);

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(testArticle));
        when(commentRepository.findByArticleOrderByCreatedAtDesc(testArticle)).thenReturn(comments);

        // when
        List<Comment> found = commentService.getCommentsByArticle(articleSlug);

        // then
        assertThat(found).hasSize(1);
        assertThat(found.get(0)).isEqualTo(testComment);
        verify(articleRepository).findBySlug(articleSlug);
        verify(commentRepository).findByArticleOrderByCreatedAtDesc(testArticle);
    }

    @Test
    @DisplayName("존재하지 않는 아티클의 댓글 조회 시 예외가 발생한다")
    void getCommentsByArticleNotFound() {
        // given
        String articleSlug = "non-existent";

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> commentService.getCommentsByArticle(articleSlug))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article not found");
    }

    @Test
    @DisplayName("댓글 작성자가 댓글을 삭제할 수 있다")
    void deleteCommentSuccess() {
        // given
        String articleSlug = "test-article";
        Long commentId = 1L;

        // Mock 객체로 ID 설정
        Article mockArticle = org.mockito.Mockito.mock(Article.class);
        Comment mockComment = org.mockito.Mockito.mock(Comment.class);
        User mockUser = org.mockito.Mockito.mock(User.class);

        when(mockArticle.getId()).thenReturn(1L);
        when(mockComment.getArticle()).thenReturn(mockArticle);
        when(mockComment.getAuthor()).thenReturn(mockUser);
        when(mockUser.getId()).thenReturn(1L);

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(mockArticle));
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(mockComment));

        // when
        commentService.deleteComment(articleSlug, commentId, mockUser);

        // then
        verify(commentRepository).delete(mockComment);
    }

    @Test
    @DisplayName("존재하지 않는 아티클의 댓글 삭제 시 예외가 발생한다")
    void deleteCommentArticleNotFound() {
        // given
        String articleSlug = "non-existent";
        Long commentId = 1L;

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(articleSlug, commentId, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article not found");
    }

    @Test
    @DisplayName("존재하지 않는 댓글 삭제 시 예외가 발생한다")
    void deleteCommentNotFound() {
        // given
        String articleSlug = "test-article";
        Long commentId = 999L;

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(testArticle));
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(articleSlug, commentId, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Comment not found");
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 댓글 삭제 시 예외가 발생한다")
    void deleteCommentByNonAuthor() {
        // given
        String articleSlug = "test-article";
        Long commentId = 1L;

        // Mock으로 ID 설정
        Article mockArticle = org.mockito.Mockito.mock(Article.class);
        Comment mockComment = org.mockito.Mockito.mock(Comment.class);
        User mockAuthor = org.mockito.Mockito.mock(User.class);
        User mockOtherUser = org.mockito.Mockito.mock(User.class);

        when(mockArticle.getId()).thenReturn(1L);
        when(mockAuthor.getId()).thenReturn(1L);
        when(mockOtherUser.getId()).thenReturn(2L);
        when(mockComment.getArticle()).thenReturn(mockArticle);
        when(mockComment.getAuthor()).thenReturn(mockAuthor);

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(mockArticle));
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(mockComment));

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(articleSlug, commentId, mockOtherUser))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    @DisplayName("다른 아티클의 댓글 삭제 시 예외가 발생한다")
    void deleteCommentFromDifferentArticle() {
        // given
        String articleSlug = "other-article";
        Long commentId = 1L;

        Article otherArticle = Article.builder()
                .slug("other-article")
                .title("Other Article")
                .description("Other Description")
                .body("Other Body")
                .author(otherUser)
                .build();

        // Mock ID 설정
        Article mockArticle = org.mockito.Mockito.mock(Article.class);
        Article mockOtherArticle = org.mockito.Mockito.mock(Article.class);
        Comment mockComment = org.mockito.Mockito.mock(Comment.class);

        when(mockArticle.getId()).thenReturn(1L);
        when(mockOtherArticle.getId()).thenReturn(2L);
        when(mockComment.getArticle()).thenReturn(mockArticle);

        when(articleRepository.findBySlug(articleSlug)).thenReturn(Optional.of(mockOtherArticle));
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(mockComment));

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(articleSlug, commentId, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Comment not found in the specified article");
    }
}
