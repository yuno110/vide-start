# ====================
# Stage 1: Build
# ====================
FROM gradle:8-jdk17-alpine AS builder

WORKDIR /app

# Gradle 캐시 최적화: 의존성 먼저 다운로드
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

# 의존성 다운로드 (캐시 레이어)
RUN gradle dependencies --no-daemon

# 소스 코드 복사 및 빌드
COPY src ./src
COPY config ./config

# 빌드 실행 (테스트 제외)
RUN gradle bootJar --no-daemon -x test

# ====================
# Stage 2: Runtime
# ====================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 애플리케이션 사용자 생성 (보안)
RUN addgroup -S spring && adduser -S spring -G spring

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 데이터 디렉토리 생성
RUN mkdir -p /app/data && chown -R spring:spring /app

# 사용자 전환
USER spring

# 포트 노출
EXPOSE 8080

# 헬스체크 (Spring Boot Actuator 사용 시)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# 애플리케이션 실행
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
