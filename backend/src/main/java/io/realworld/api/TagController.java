package io.realworld.api;

import io.realworld.api.dto.TagResponse;
import io.realworld.domain.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 태그 컨트롤러
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * 태그 목록 조회
     */
    @GetMapping
    public ResponseEntity<TagResponse> getTags() {
        List<String> tags = tagService.findAllTags();
        return ResponseEntity.ok(TagResponse.of(tags));
    }
}
