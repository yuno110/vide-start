package io.realworld.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * TagService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    private Tag tag1;
    private Tag tag2;
    private Tag tag3;

    @BeforeEach
    void setUp() {
        tag1 = Tag.builder().name("dragons").build();
        tag2 = Tag.builder().name("training").build();
        tag3 = Tag.builder().name("coding").build();
    }

    @Test
    @DisplayName("모든 태그를 조회할 수 있다")
    void findAllTagsSuccess() {
        // given
        List<Tag> tags = Arrays.asList(tag1, tag2, tag3);

        when(tagRepository.findAll()).thenReturn(tags);

        // when
        List<String> result = tagService.findAllTags();

        // then
        assertThat(result).hasSize(3);
        assertThat(result).containsExactlyInAnyOrder("coding", "dragons", "training");
        verify(tagRepository).findAll();
    }

    @Test
    @DisplayName("태그가 없을 경우 빈 리스트를 반환한다")
    void findAllTagsEmpty() {
        // given
        when(tagRepository.findAll()).thenReturn(Collections.emptyList());

        // when
        List<String> result = tagService.findAllTags();

        // then
        assertThat(result).isEmpty();
        verify(tagRepository).findAll();
    }

    @Test
    @DisplayName("태그 목록이 정렬되어 반환된다")
    void findAllTagsSorted() {
        // given
        Tag tagZ = Tag.builder().name("zebra").build();
        Tag tagA = Tag.builder().name("apple").build();
        Tag tagM = Tag.builder().name("mango").build();
        List<Tag> tags = Arrays.asList(tagZ, tagA, tagM);

        when(tagRepository.findAll()).thenReturn(tags);

        // when
        List<String> result = tagService.findAllTags();

        // then
        assertThat(result).containsExactly("apple", "mango", "zebra");
    }

    @Test
    @DisplayName("중복된 태그 이름이 제거된다")
    void findAllTagsDistinct() {
        // given
        Tag duplicate1 = Tag.builder().name("dragons").build();
        Tag duplicate2 = Tag.builder().name("dragons").build();
        Tag unique = Tag.builder().name("training").build();
        List<Tag> tags = Arrays.asList(duplicate1, duplicate2, unique);

        when(tagRepository.findAll()).thenReturn(tags);

        // when
        List<String> result = tagService.findAllTags();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly("dragons", "training");
    }

    @Test
    @DisplayName("인기 태그를 조회할 수 있다")
    void findPopularTagsSuccess() {
        // given
        List<Tag> popularTags = Arrays.asList(tag1, tag2);

        when(tagRepository.findPopularTags()).thenReturn(popularTags);

        // when
        List<String> result = tagService.findPopularTags();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly("dragons", "training");
        verify(tagRepository).findPopularTags();
    }

    @Test
    @DisplayName("인기 태그가 없을 경우 빈 리스트를 반환한다")
    void findPopularTagsEmpty() {
        // given
        when(tagRepository.findPopularTags()).thenReturn(Collections.emptyList());

        // when
        List<String> result = tagService.findPopularTags();

        // then
        assertThat(result).isEmpty();
        verify(tagRepository).findPopularTags();
    }
}
