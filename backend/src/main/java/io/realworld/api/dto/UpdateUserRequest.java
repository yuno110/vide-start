package io.realworld.api.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonRootName("user")
public class UpdateUserRequest {

    @Email(message = "Email should be valid")
    private String email;

    private String username;
    private String password;
    private String bio;
    private String image;
}
