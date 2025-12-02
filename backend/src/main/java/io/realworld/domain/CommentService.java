package io.realworld.domain;

import io.realworld.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 댓글 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    /**
     * 댓글 생성
     */
    @Transactional
    public Comment createComment(String articleSlug, String body, User author) {
        Article article = articleRepository.findBySlug(articleSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + articleSlug));

        Comment comment = Comment.builder()
                .body(body)
                .article(article)
                .author(author)
                .build();

        return commentRepository.save(comment);
    }

    /**
     * 아티클의 댓글 목록 조회
     */
    public List<Comment> getCommentsByArticle(String articleSlug) {
        Article article = articleRepository.findBySlug(articleSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + articleSlug));

        return commentRepository.findByArticleOrderByCreatedAtDesc(article);
    }

    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(String articleSlug, Long commentId, User user) {
        // 아티클 존재 확인
        Article article = articleRepository.findBySlug(articleSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + articleSlug));

        // 댓글 존재 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // 댓글이 해당 아티클의 것인지 확인
        if (!comment.getArticle().getId().equals(article.getId())) {
            throw new ResourceNotFoundException("Comment not found in the specified article");
        }

        // 작성자 본인 확인
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("댓글 작성자만 삭제할 수 있습니다");
        }

        commentRepository.delete(comment);
    }
}
