package io.realworld.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.realworld.api.dto.LoginRequest;
import io.realworld.api.dto.RegisterRequest;
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
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 인증 컨트롤러 통합 테스트
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class AuthControllerTest {

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
    @DisplayName("회원가입이 성공적으로 수행된다")
    void registerSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.token").value(notNullValue()));
    }

    @Test
    @DisplayName("중복된 이메일로 회원가입 시 422 에러가 발생한다")
    void registerDuplicateEmail() throws Exception {
        RegisterRequest firstRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        // 첫 번째 회원가입
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRequest)));

        // 중복 이메일로 두 번째 회원가입 시도
        RegisterRequest secondRequest = new RegisterRequest(
                "anotheruser",
                "test@example.com",
                "password456"
        );

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondRequest)))
                .andDo(print())
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("로그인이 성공적으로 수행된다")
    void loginSuccess() throws Exception {
        // 먼저 회원가입
        RegisterRequest registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // 로그인
        LoginRequest loginRequest = new LoginRequest(
                "test@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.token").value(notNullValue()));
    }

    @Test
    @DisplayName("잘못된 비밀번호로 로그인 시 401 에러가 발생한다")
    void loginInvalidPassword() throws Exception {
        // 먼저 회원가입
        RegisterRequest registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // 잘못된 비밀번호로 로그인
        LoginRequest loginRequest = new LoginRequest(
                "test@example.com",
                "wrongpassword"
        );

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errors.credentials").exists());
    }
}
