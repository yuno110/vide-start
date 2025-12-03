package io.realworld.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 프로필 응답 래퍼
 */
@Getter
@AllArgsConstructor
public class ProfileResponseWrapper {
    private ProfileResponse profile;

    public static ProfileResponseWrapper of(ProfileResponse profileResponse) {
        return new ProfileResponseWrapper(profileResponse);
    }
}
