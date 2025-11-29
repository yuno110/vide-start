package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 댓글 리포지토리
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 아티클의 모든 댓글 조회
     */
    List<Comment> findByArticleOrderByCreatedAtDesc(Article article);

    /**
     * 아티클 ID로 모든 댓글 조회
     */
    @Query("SELECT c FROM Comment c WHERE c.article.id = :articleId ORDER BY c.createdAt DESC")
    List<Comment> findByArticleId(@Param("articleId") Long articleId);

    /**
     * 아티클의 댓글 수 조회
     */
    long countByArticle(Article article);
}
