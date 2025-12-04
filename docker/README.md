# Docker 설정 가이드

RealWorld 애플리케이션을 Docker로 실행하는 방법을 안내합니다.

## 목차

- [사전 준비](#사전-준비)
- [프로덕션 환경 실행](#프로덕션-환경-실행)
- [개발 환경 실행](#개발-환경-실행)
- [Makefile 명령어](#makefile-명령어)
- [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 1. Docker 설치

**Windows:**
1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) 다운로드
2. WSL2 또는 Hyper-V 활성화
3. Docker Desktop 실행 및 로그인

**macOS:**
```bash
brew install --cask docker
```

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 2. 설치 확인

```bash
docker --version
docker-compose --version
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

필요한 경우 `.env` 파일 수정 (JWT 시크릿, 포트 등).

---

## 프로덕션 환경 실행

### 1. 이미지 빌드

```bash
make build
# 또는
docker-compose build
```

**빌드 시간:**
- 백엔드: 약 5-10분 (Gradle 의존성 다운로드)
- 프론트엔드: 약 2-5분 (npm 의존성 다운로드)

### 2. 컨테이너 시작

```bash
make up
# 또는
docker-compose up -d
```

### 3. 상태 확인

```bash
make ps
# 또는
docker-compose ps
```

**예상 출력:**
```
NAME                   IMAGE                    STATUS              PORTS
realworld-backend      realworld-backend        Up (healthy)        0.0.0.0:8080->8080/tcp
realworld-frontend     realworld-frontend       Up                  0.0.0.0:3000->80/tcp
```

### 4. 로그 확인

```bash
# 모든 서비스 로그
make logs

# 백엔드만
make logs-backend

# 프론트엔드만
make logs-frontend
```

### 5. 접속 테스트

**백엔드 API:**
```bash
curl http://localhost:8080/actuator/health
```

**프론트엔드:**
```bash
curl http://localhost:3000
```

브라우저에서 접속:
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

### 6. 정지

```bash
make down
# 또는
docker-compose down
```

---

## 개발 환경 실행

개발 환경에서는 소스 코드 변경 시 자동으로 재로드됩니다 (Hot Reload).

### 1. 개발 환경 시작

```bash
make dev
# 또는
docker-compose -f docker-compose.dev.yml up
```

**포트:**
- 백엔드: http://localhost:8080
- 프론트엔드: http://localhost:5173 (Vite dev server)

### 2. 개발 환경 특징

**백엔드:**
- Gradle bootRun으로 실행
- 소스 코드 볼륨 마운트
- 코드 변경 시 자동 재컴파일

**프론트엔드:**
- Vite dev server 실행
- 소스 코드 볼륨 마운트
- HMR (Hot Module Replacement) 지원

### 3. 개발 환경 정지

```bash
make dev-down
# 또는
docker-compose -f docker-compose.dev.yml down
```

---

## Makefile 명령어

| 명령어 | 설명 |
|--------|------|
| `make help` | 사용 가능한 명령어 목록 |
| `make build` | Docker 이미지 빌드 |
| `make up` | 컨테이너 시작 (백그라운드) |
| `make down` | 컨테이너 정지 및 삭제 |
| `make restart` | 컨테이너 재시작 |
| `make logs` | 모든 서비스 로그 출력 |
| `make logs-backend` | 백엔드 로그만 출력 |
| `make logs-frontend` | 프론트엔드 로그만 출력 |
| `make ps` | 실행 중인 컨테이너 상태 |
| `make dev` | 개발 환경 시작 |
| `make dev-down` | 개발 환경 정지 |
| `make dev-logs` | 개발 환경 로그 |
| `make test` | 테스트 실행 |
| `make shell-backend` | 백엔드 컨테이너 셸 접속 |
| `make shell-frontend` | 프론트엔드 컨테이너 셸 접속 |
| `make clean` | 모든 컨테이너/볼륨/이미지 삭제 |

---

## 트러블슈팅

### 1. 포트 충돌

**증상:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**해결:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8080
kill -9 <PID>
```

또는 `.env` 파일에서 포트 변경:
```
BACKEND_PORT=8081
FRONTEND_PORT=3001
```

### 2. 빌드 실패

**증상:** Gradle 또는 npm 빌드 오류

**해결:**
```bash
# 캐시 삭제 후 재빌드
docker-compose down -v
docker-compose build --no-cache
```

### 3. 백엔드 헬스체크 실패

**증상:** `backend is unhealthy`

**해결:**
```bash
# 로그 확인
make logs-backend

# Actuator 엔드포인트 확인
curl http://localhost:8080/actuator/health
```

**가능한 원인:**
- Actuator 의존성 누락 → `build.gradle.kts` 확인
- DB 연결 실패 → 볼륨 마운트 확인
- 포트 충돌

### 4. 프론트엔드 API 호출 실패

**증상:** `CORS error` 또는 `Network error`

**해결:**
1. 백엔드가 정상 실행 중인지 확인
2. Nginx 설정 확인 (`frontend/docker/nginx.conf`)
3. 환경 변수 확인 (`.env`)

### 5. 볼륨 권한 문제 (Linux)

**증상:** `Permission denied` 오류

**해결:**
```bash
# 소유권 변경
sudo chown -R $USER:$USER backend/data
sudo chown -R $USER:$USER frontend/node_modules

# 또는 Docker를 루트 없이 실행
sudo usermod -aG docker $USER
```

### 6. WSL2 메모리 부족 (Windows)

**증상:** 빌드가 매우 느리거나 멈춤

**해결:**
`.wslconfig` 파일 생성 (`C:\Users\<username>\.wslconfig`):
```
[wsl2]
memory=4GB
processors=2
```

WSL2 재시작:
```bash
wsl --shutdown
```

---

## 아키텍처

```
┌─────────────────┐
│   Frontend      │
│  (Nginx:80)     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Backend       │
│  (Spring:8080)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SQLite DB     │
│  (Volume)       │
└─────────────────┘
```

**네트워크:**
- `app-network`: 내부 브릿지 네트워크

**볼륨:**
- `backend-data`: SQLite DB 파일 영속성
- `gradle-cache`: Gradle 캐시 (개발 환경)

---

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `BACKEND_PORT` | 백엔드 포트 | 8080 |
| `FRONTEND_PORT` | 프론트엔드 포트 | 3000 (prod), 5173 (dev) |
| `JWT_SECRET` | JWT 서명 키 | (기본값, 운영 환경에서 변경 필수) |
| `JWT_EXPIRATION` | JWT 만료 시간 (ms) | 86400000 (24시간) |
| `SPRING_PROFILES_ACTIVE` | Spring 프로파일 | prod |

---

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [Spring Boot Docker 가이드](https://spring.io/guides/gs/spring-boot-docker/)
- [Vite Docker 가이드](https://vitejs.dev/guide/build.html)
