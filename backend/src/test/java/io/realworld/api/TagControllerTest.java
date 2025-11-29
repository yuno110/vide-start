package io.realworld.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.realworld.domain.Article;
import io.realworld.domain.ArticleRepository;
import io.realworld.domain.Tag;
import io.realworld.domain.TagRepository;
import io.realworld.domain.User;
import io.realworld.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 태그 컨트롤러 통합 테스트
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class TagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        articleRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();

        // 테스트 사용자 생성
        User testUser = userRepository.save(User.builder()
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .build());

        // 테스트 태그 생성
        Tag tag1 = tagRepository.save(Tag.builder().name("dragons").build());
        Tag tag2 = tagRepository.save(Tag.builder().name("training").build());
        Tag tag3 = tagRepository.save(Tag.builder().name("coding").build());

        // 아티클에 태그 추가
        Article article = articleRepository.save(Article.builder()
                .slug("test-article")
                .title("Test Article")
                .description("Test Description")
                .body("Test Body")
                .author(testUser)
                .build());

        article.addTag(tag1);
        article.addTag(tag2);
        articleRepository.save(article);
    }

    @Test
    @DisplayName("태그 목록 조회가 성공적으로 수행된다")
    void getTags() throws Exception {
        mockMvc.perform(get("/api/tags"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tags", hasSize(3)))
                .andExpect(jsonPath("$.tags", containsInAnyOrder("coding", "dragons", "training")));
    }

    @Test
    @DisplayName("태그가 없을 경우 빈 배열이 반환된다")
    void getTagsEmpty() throws Exception {
        articleRepository.deleteAll();
        tagRepository.deleteAll();

        mockMvc.perform(get("/api/tags"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tags", hasSize(0)));
    }
}
