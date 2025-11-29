package io.realworld.api.exception;

/**
 * 리소스를 찾을 수 없는 예외
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
