package io.realworld.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * JwtTokenProvider 테스트
 */
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        String secret = "realworld-secret-key-for-jwt-token-signing-minimum-256-bits-required";
        long expiration = 3600000L; // 1시간
        jwtTokenProvider = new JwtTokenProvider(secret, expiration);
    }

    @Test
    @DisplayName("JWT 토큰을 생성할 수 있다")
    void generateToken() {
        // given
        String username = "testuser";
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new User(username, "password", new ArrayList<>()),
                null,
                new ArrayList<>()
        );

        // when
        String token = jwtTokenProvider.generateToken(authentication);

        // then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("JWT 토큰에서 사용자 이름을 추출할 수 있다")
    void getUsernameFromToken() {
        // given
        String username = "testuser";
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new User(username, "password", new ArrayList<>()),
                null,
                new ArrayList<>()
        );
        String token = jwtTokenProvider.generateToken(authentication);

        // when
        String extractedUsername = jwtTokenProvider.getUsernameFromToken(token);

        // then
        assertThat(extractedUsername).isEqualTo(username);
    }

    @Test
    @DisplayName("유효한 JWT 토큰을 검증할 수 있다")
    void validateTokenValidToken() {
        // given
        String username = "testuser";
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new User(username, "password", new ArrayList<>()),
                null,
                new ArrayList<>()
        );
        String token = jwtTokenProvider.generateToken(authentication);

        // when
        boolean isValid = jwtTokenProvider.validateToken(token);

        // then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("잘못된 JWT 토큰은 검증에 실패한다")
    void validateTokenInvalidToken() {
        // given
        String invalidToken = "invalid.jwt.token";

        // when
        boolean isValid = jwtTokenProvider.validateToken(invalidToken);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("만료된 JWT 토큰은 검증에 실패한다")
    void validateTokenExpiredToken() throws InterruptedException {
        // given
        String secret = "realworld-secret-key-for-jwt-token-signing-minimum-256-bits-required";
        long shortExpiration = 1L; // 1밀리초 (즉시 만료)
        JwtTokenProvider shortExpirationProvider = new JwtTokenProvider(secret, shortExpiration);

        String username = "testuser";
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new User(username, "password", new ArrayList<>()),
                null,
                new ArrayList<>()
        );
        String token = shortExpirationProvider.generateToken(authentication);

        // 토큰이 만료될 때까지 대기
        Thread.sleep(10);

        // when
        boolean isValid = shortExpirationProvider.validateToken(token);

        // then
        assertThat(isValid).isFalse();
    }
}
