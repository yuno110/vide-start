package io.realworld.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * 태그 리포지토리
 */
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 이름으로 태그 조회
     */
    Optional<Tag> findByName(String name);

    /**
     * 이름 존재 여부 확인
     */
    boolean existsByName(String name);

    /**
     * 사용 빈도가 높은 태그 목록 조회
     */
    @Query("SELECT t FROM Tag t JOIN t.articles a GROUP BY t ORDER BY COUNT(a) DESC")
    List<Tag> findPopularTags();
}
