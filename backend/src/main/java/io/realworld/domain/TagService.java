package io.realworld.domain;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 태그 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    /**
     * 모든 태그 조회
     */
    public List<String> findAllTags() {
        return tagRepository.findAll().stream()
                .map(Tag::getName)
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * 인기 태그 조회
     */
    public List<String> findPopularTags() {
        return tagRepository.findPopularTags().stream()
                .map(Tag::getName)
                .toList();
    }
}
