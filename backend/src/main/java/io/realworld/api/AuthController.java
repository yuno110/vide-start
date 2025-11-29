package io.realworld.api;

import io.realworld.api.dto.LoginRequest;
import io.realworld.api.dto.RegisterRequest;
import io.realworld.api.dto.UserResponse;
import io.realworld.domain.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 인증 컨트롤러
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * 회원가입
     */
    @PostMapping
    public ResponseEntity<UserResponse> register(@Valid @RequestBody Map<String, Object> request) {
        RegisterRequest registerRequest = extractRegisterRequest(request);
        UserResponse response = userService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody Map<String, Object> request) {
        LoginRequest loginRequest = extractLoginRequest(request);
        UserResponse response = userService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    private RegisterRequest extractRegisterRequest(Map<String, Object> request) {
        Map<String, Object> user = (Map<String, Object>) request.getOrDefault("user", request);
        return new RegisterRequest(
                (String) user.get("username"),
                (String) user.get("email"),
                (String) user.get("password")
        );
    }

    private LoginRequest extractLoginRequest(Map<String, Object> request) {
        Map<String, Object> user = (Map<String, Object>) request.getOrDefault("user", request);
        return new LoginRequest(
                (String) user.get("email"),
                (String) user.get("password")
        );
    }
}
