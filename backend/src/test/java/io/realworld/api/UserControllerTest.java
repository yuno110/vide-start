package io.realworld.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.realworld.api.dto.RegisterRequest;
import io.realworld.api.dto.UpdateUserRequest;
import io.realworld.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 사용자 컨트롤러 통합 테스트
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("현재 사용자 정보를 조회할 수 있다")
    void getCurrentUserSuccess() throws Exception {
        // 회원가입하고 토큰 받기
        RegisterRequest registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        MvcResult result = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn();

        String token = extractToken(result);

        // 현재 사용자 정보 조회
        mockMvc.perform(get("/api/user")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.token").value(notNullValue()));
    }

    @Test
    @DisplayName("인증 없이 사용자 정보 조회 시 403 에러가 발생한다")
    void getCurrentUserUnauthorized() throws Exception {
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("사용자 정보를 수정할 수 있다")
    void updateUserSuccess() throws Exception {
        // 회원가입하고 토큰 받기
        RegisterRequest registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        MvcResult result = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn();

        String token = extractToken(result);

        // 사용자 정보 수정
        UpdateUserRequest updateRequest = new UpdateUserRequest(
                "newemail@example.com",
                "newusername",
                null,
                "Updated bio",
                "http://example.com/image.jpg"
        );

        mockMvc.perform(put("/api/user")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("newemail@example.com"))
                .andExpect(jsonPath("$.user.username").value("newusername"))
                .andExpect(jsonPath("$.user.bio").value("Updated bio"))
                .andExpect(jsonPath("$.user.image").value("http://example.com/image.jpg"))
                .andExpect(jsonPath("$.user.token").value(notNullValue()));
    }

    private String extractToken(MvcResult result) throws Exception {
        String response = result.getResponse().getContentAsString();
        return objectMapper.readTree(response).get("user").get("token").asText();
    }
}
