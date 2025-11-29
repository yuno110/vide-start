package io.realworld.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.realworld.domain.ArticleRepository;
import io.realworld.domain.TagRepository;
import io.realworld.domain.User;
import io.realworld.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 아티클 컨트롤러 통합 테스트
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String authToken;
    private User testUser;

    @BeforeEach
    void setUp() throws Exception {
        articleRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();

        // 테스트 사용자 생성 및 로그인
        testUser = userRepository.save(User.builder()
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .build());

        // 로그인하여 토큰 획득
        Map<String, Object> loginRequest = new HashMap<>();
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");
        loginRequest.put("user", user);

        String response = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        authToken = objectMapper.readTree(response).get("user").get("token").asText();
    }

    @Test
    @DisplayName("아티클 생성이 성공적으로 수행된다")
    void createArticle() throws Exception {
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> article = new HashMap<>();
        article.put("title", "How to train your dragon");
        article.put("description", "Ever wonder how?");
        article.put("body", "It takes a Jacobian");
        article.put("tagList", List.of("dragons", "training"));
        request.put("article", article);

        mockMvc.perform(post("/api/articles")
                        .header("Authorization", "Token " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.article.slug").value(notNullValue()))
                .andExpect(jsonPath("$.article.title").value("How to train your dragon"))
                .andExpect(jsonPath("$.article.description").value("Ever wonder how?"))
                .andExpect(jsonPath("$.article.body").value("It takes a Jacobian"))
                .andExpect(jsonPath("$.article.tagList", hasSize(2)))
                .andExpect(jsonPath("$.article.author.username").value("testuser"));
    }

    @Test
    @DisplayName("아티클 목록 조회가 성공적으로 수행된다")
    void getArticles() throws Exception {
        // 아티클 생성
        createTestArticle("Test Article 1", "Description 1", "Body 1");
        createTestArticle("Test Article 2", "Description 2", "Body 2");

        mockMvc.perform(get("/api/articles"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.articles", hasSize(2)))
                .andExpect(jsonPath("$.articlesCount").value(2));
    }

    @Test
    @DisplayName("slug로 아티클 상세 조회가 성공적으로 수행된다")
    void getArticle() throws Exception {
        String slug = createTestArticle("Test Article", "Description", "Body");

        mockMvc.perform(get("/api/articles/" + slug))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.article.slug").value(slug))
                .andExpect(jsonPath("$.article.title").value("Test Article"));
    }

    @Test
    @DisplayName("아티클 수정이 성공적으로 수행된다")
    void updateArticle() throws Exception {
        String slug = createTestArticle("Original Title", "Original Description", "Original Body");

        Map<String, Object> request = new HashMap<>();
        Map<String, Object> article = new HashMap<>();
        article.put("title", "Updated Title");
        article.put("description", "Updated Description");
        article.put("body", "Updated Body");
        request.put("article", article);

        mockMvc.perform(put("/api/articles/" + slug)
                        .header("Authorization", "Token " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.article.title").value("Updated Title"))
                .andExpect(jsonPath("$.article.description").value("Updated Description"))
                .andExpect(jsonPath("$.article.body").value("Updated Body"));
    }

    @Test
    @DisplayName("아티클 삭제가 성공적으로 수행된다")
    void deleteArticle() throws Exception {
        String slug = createTestArticle("Test Article", "Description", "Body");

        mockMvc.perform(delete("/api/articles/" + slug)
                        .header("Authorization", "Token " + authToken))
                .andDo(print())
                .andExpect(status().isNoContent());

        // 삭제 확인
        mockMvc.perform(get("/api/articles/" + slug))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("인증 없이 아티클 작성 시 403 에러가 발생한다")
    void createArticleWithoutAuth() throws Exception {
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> article = new HashMap<>();
        article.put("title", "Test");
        article.put("description", "Test");
        article.put("body", "Test");
        request.put("article", article);

        mockMvc.perform(post("/api/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    /**
     * 테스트 아티클 생성 헬퍼 메서드
     */
    private String createTestArticle(String title, String description, String body) throws Exception {
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> article = new HashMap<>();
        article.put("title", title);
        article.put("description", description);
        article.put("body", body);
        request.put("article", article);

        String response = mockMvc.perform(post("/api/articles")
                        .header("Authorization", "Token " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("article").get("slug").asText();
    }
}
