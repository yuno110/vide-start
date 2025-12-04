# ====================
# Stage 1: Build
# ====================
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 캐시 최적화: package.json 먼저 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --silent

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# ====================
# Stage 2: Runtime
# ====================
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행 (기본 CMD 사용)
# CMD ["nginx", "-g", "daemon off;"]
