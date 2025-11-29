package io.realworld.api.dto;

import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * RealWorld API 스펙에 따른 에러 응답
 */
@Getter
public class ErrorResponse {
    private final Map<String, List<String>> errors;

    public ErrorResponse(String field, String message) {
        this.errors = new HashMap<>();
        List<String> messages = new ArrayList<>();
        messages.add(message);
        this.errors.put(field, messages);
    }

    public ErrorResponse(Map<String, List<String>> errors) {
        this.errors = errors;
    }

    public static ErrorResponse of(String field, String message) {
        return new ErrorResponse(field, message);
    }
}
