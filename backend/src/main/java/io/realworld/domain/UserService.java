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
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * 회원가입
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

        // 사용자명 중복 체크
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUsernameException("Username already exists");
        }

        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getUsername(),
                null
        );
        String token = jwtTokenProvider.generateToken(authentication);

        return UserResponse.of(savedUser, token);
    }

    /**
     * 로그인
     */
    public UserResponse login(LoginRequest request) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // 인증 처리 및 JWT 토큰 생성
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.getPassword()
                )
        );
        String token = jwtTokenProvider.generateToken(authentication);

        return UserResponse.of(user, token);
    }

    /**
     * 현재 사용자 정보 조회
     */
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 새로운 JWT 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                null
        );
        String token = jwtTokenProvider.generateToken(authentication);

        return UserResponse.of(user, token);
    }

    /**
     * 사용자 정보 수정
     */
    @Transactional
    public UserResponse updateUser(String username, UpdateUserRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 이메일 중복 체크 (자신의 이메일이 아닌 경우)
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateEmailException("Email already exists");
            }
        }

        // 사용자명 중복 체크 (자신의 사용자명이 아닌 경우)
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new DuplicateUsernameException("Username already exists");
            }
        }

        // 사용자 정보 업데이트
        user.updateProfile(
                request.getEmail(),
                request.getUsername(),
                request.getBio(),
                request.getImage()
        );

        // 비밀번호 업데이트 (제공된 경우)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.updatePassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        // 새로운 JWT 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                updatedUser.getUsername(),
                null
        );
        String token = jwtTokenProvider.generateToken(authentication);

        return UserResponse.of(updatedUser, token);
    }
}
