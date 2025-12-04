package io.realworld.domain;

import io.realworld.api.dto.LoginRequest;
import io.realworld.api.dto.RegisterRequest;
import io.realworld.api.dto.UpdateUserRequest;
import io.realworld.api.dto.UserResponse;
import io.realworld.api.exception.DuplicateEmailException;
import io.realworld.api.exception.DuplicateUsernameException;
import io.realworld.api.exception.InvalidCredentialsException;
import io.realworld.api.exception.ResourceNotFoundException;
import io.realworld.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * UserService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private String testToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        testToken = "test.jwt.token";
    }

    @Test
    @DisplayName("회원가입이 성공적으로 수행된다")
    void registerSuccess() {
        // given
        RegisterRequest request = new RegisterRequest(
                "newuser",
                "new@example.com",
                "password123"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.register(request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(response.getUsername()).isEqualTo(testUser.getUsername());
        assertThat(response.getToken()).isEqualTo(testToken);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("중복된 이메일로 회원가입 시 예외가 발생한다")
    void registerDuplicateEmail() {
        // given
        RegisterRequest request = new RegisterRequest(
                "newuser",
                "existing@example.com",
                "password123"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    @DisplayName("중복된 사용자명으로 회원가입 시 예외가 발생한다")
    void registerDuplicateUsername() {
        // given
        RegisterRequest request = new RegisterRequest(
                "existinguser",
                "new@example.com",
                "password123"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(DuplicateUsernameException.class)
                .hasMessageContaining("Username already exists");
    }

    @Test
    @DisplayName("로그인이 성공적으로 수행된다")
    void loginSuccess() {
        // given
        LoginRequest request = new LoginRequest(
                "test@example.com",
                "password123"
        );

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                testUser.getUsername(),
                request.getPassword()
        );

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(request.getPassword(), testUser.getPassword())).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn(testToken);

        // when
        UserResponse response = userService.login(request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(response.getUsername()).isEqualTo(testUser.getUsername());
        assertThat(response.getToken()).isEqualTo(testToken);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("존재하지 않는 이메일로 로그인 시 예외가 발생한다")
    void loginEmailNotFound() {
        // given
        LoginRequest request = new LoginRequest(
                "nonexistent@example.com",
                "password123"
        );

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("잘못된 비밀번호로 로그인 시 예외가 발생한다")
    void loginInvalidPassword() {
        // given
        LoginRequest request = new LoginRequest(
                "test@example.com",
                "wrongpassword"
        );

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(request.getPassword(), testUser.getPassword())).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("현재 사용자 정보를 조회할 수 있다")
    void getCurrentUserSuccess() {
        // given
        String username = "testuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.getCurrentUser(username);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(response.getUsername()).isEqualTo(testUser.getUsername());
        assertThat(response.getToken()).isEqualTo(testToken);
    }

    @Test
    @DisplayName("존재하지 않는 사용자 조회 시 예외가 발생한다")
    void getCurrentUserNotFound() {
        // given
        String username = "nonexistent";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.getCurrentUser(username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("사용자 정보를 수정할 수 있다")
    void updateUserSuccess() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                "newemail@example.com",
                "newusername",
                "newpassword",
                "Updated bio",
                "http://example.com/image.jpg"
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.updateUser(username, request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(testToken);
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode(request.getPassword());
    }

    @Test
    @DisplayName("사용자 정보 수정 시 중복된 이메일이면 예외가 발생한다")
    void updateUserDuplicateEmail() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                "existing@example.com",
                null,
                null,
                null,
                null
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.updateUser(username, request))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    @DisplayName("사용자 정보 수정 시 중복된 사용자명이면 예외가 발생한다")
    void updateUserDuplicateUsername() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                null,
                "existingusername",
                null,
                null,
                null
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.updateUser(username, request))
                .isInstanceOf(DuplicateUsernameException.class)
                .hasMessageContaining("Username already exists");
    }

    @Test
    @DisplayName("사용자 정보 수정 시 자신의 이메일은 중복 체크하지 않는다")
    void updateUserSameEmail() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                testUser.getEmail(), // 동일한 이메일
                null,
                null,
                "Updated bio",
                null
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.updateUser(username, request);

        // then
        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 정보 수정 시 자신의 사용자명은 중복 체크하지 않는다")
    void updateUserSameUsername() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                null,
                testUser.getUsername(), // 동일한 사용자명
                null,
                "Updated bio",
                null
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.updateUser(username, request);

        // then
        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 정보 수정 시 비밀번호가 null이면 비밀번호는 수정하지 않는다")
    void updateUserWithoutPassword() {
        // given
        String username = "testuser";
        UpdateUserRequest request = new UpdateUserRequest(
                null,
                null,
                null, // 비밀번호 null
                "Updated bio",
                null
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(testToken);

        // when
        UserResponse response = userService.updateUser(username, request);

        // then
        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder, org.mockito.Mockito.never()).encode(anyString());
    }
}
