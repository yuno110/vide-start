package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 아티클 리포지토리
 */
public interface ArticleRepository extends JpaRepository<Article, Long> {

    /**
     * slug로 아티클 조회 (tags, author eager fetch)
     */
    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.tags LEFT JOIN FETCH a.author WHERE a.slug = :slug")
    Optional<Article> findBySlug(@Param("slug") String slug);

    /**
     * slug 존재 여부 확인
     */
    boolean existsBySlug(String slug);

    /**
     * 작성자로 아티클 목록 조회
     */
    List<Article> findByAuthorOrderByCreatedAtDesc(User author);

    /**
     * 작성자 ID로 아티클 목록 조회
     */
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId ORDER BY a.createdAt DESC")
    List<Article> findByAuthorId(@Param("authorId") Long authorId);

    /**
     * 태그를 포함하는 아티클 목록 조회
     */
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.name = :tagName ORDER BY a.createdAt DESC")
    List<Article> findByTagName(@Param("tagName") String tagName);

    /**
     * 최신 아티클 목록 조회
     */
    List<Article> findAllByOrderByCreatedAtDesc();

    /**
     * 특정 작성자들의 아티클 목록 조회 (피드)
     */
    @Query("SELECT a FROM Article a WHERE a.author IN :authors ORDER BY a.createdAt DESC")
    List<Article> findByAuthorInOrderByCreatedAtDesc(@Param("authors") List<User> authors);
}
