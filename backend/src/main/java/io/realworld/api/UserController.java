package io.realworld.api;

import io.realworld.api.dto.UpdateUserRequest;
import io.realworld.api.dto.UserResponse;
import io.realworld.domain.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 사용자 컨트롤러
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserResponse response = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 정보 수정
     */
    @PutMapping
    public ResponseEntity<UserResponse> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody Map<String, Object> request
    ) {
        UpdateUserRequest updateRequest = extractUpdateUserRequest(request);
        UserResponse response = userService.updateUser(userDetails.getUsername(), updateRequest);
        return ResponseEntity.ok(response);
    }

    private UpdateUserRequest extractUpdateUserRequest(Map<String, Object> request) {
        Map<String, Object> user = (Map<String, Object>) request.getOrDefault("user", request);
        return new UpdateUserRequest(
                (String) user.get("email"),
                (String) user.get("username"),
                (String) user.get("password"),
                (String) user.get("bio"),
                (String) user.get("image")
        );
    }
}
