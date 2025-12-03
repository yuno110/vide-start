package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 좋아요 리포지토리
 */
public interface FavoriteRepository extends JpaRepository<Favorite, Favorite.FavoriteId> {

    /**
     * 사용자와 아티클로 좋아요 조회
     */
    Optional<Favorite> findByUserAndArticle(User user, Article article);

    /**
     * 좋아요 존재 여부 확인
     */
    boolean existsByUserAndArticle(User user, Article article);

    /**
     * 아티클의 좋아요 수 조회
     */
    long countByArticle(Article article);

    /**
     * 사용자가 좋아요한 아티클 목록 조회 (article, author eager fetch)
     */
    @Query("SELECT f FROM Favorite f JOIN FETCH f.article a LEFT JOIN FETCH a.author WHERE f.user = :user")
    List<Favorite> findByUser(@Param("user") User user);

    /**
     * 아티클의 모든 좋아요 조회
     */
    List<Favorite> findByArticle(Article article);
}
