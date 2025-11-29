package io.realworld.api.exception;

/**
 * 이메일 중복 예외
 */
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
