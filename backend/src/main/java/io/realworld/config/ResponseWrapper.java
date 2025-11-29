package io.realworld.config;

import io.realworld.api.dto.UserResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 응답을 자동으로 wrapping하는 Advice
 */
@RestControllerAdvice(basePackages = "io.realworld.api")
public class ResponseWrapper implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(
            MethodParameter returnType,
            Class<? extends HttpMessageConverter<?>> converterType
    ) {
        // UserResponse 타입이거나 ResponseEntity<UserResponse> 타입인 경우 지원
        Class<?> paramType = returnType.getParameterType();
        if (paramType == UserResponse.class) {
            return true;
        }
        // ResponseEntity의 제네릭 타입 확인
        if (returnType.getGenericParameterType() != null) {
            String typeName = returnType.getGenericParameterType().getTypeName();
            return typeName.contains("UserResponse");
        }
        return false;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {
        if (body instanceof UserResponse) {
            Map<String, Object> wrapped = new HashMap<>();
            wrapped.put("user", body);
            return wrapped;
        }
        return body;
    }
}
