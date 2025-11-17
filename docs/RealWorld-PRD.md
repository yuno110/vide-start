# RealWorld App - Product Requirements Document (PRD)

## 1. 프로젝트 개요

### 1.1 프로젝트 정의
RealWorld는 Medium.com을 모델로 한 소셜 블로깅 플랫폼입니다. 이 프로젝트는 실제 프로덕션 수준의 애플리케이션을 다양한 기술 스택으로 구현하는 방법을 학습하기 위한 표준화된 데모 애플리케이션입니다.

### 1.2 프로젝트 목표
- 실제 사용 가능한 소셜 블로깅 플랫폼 구축
- 프론트엔드와 백엔드의 완전한 분리 및 모듈화
- 표준화된 API 스펙을 통한 상호 운용성 보장
- 프로덕션 수준의 개발 패턴 학습 및 적용

### 1.3 타겟 사용자
- 블로그 콘텐츠를 작성하고 공유하려는 사용자
- 다른 사용자의 콘텐츠를 읽고 소비하는 독자
- 관심 있는 작가를 팔로우하고 소통하려는 커뮤니티 멤버

---

## 2. 핵심 기능 요구사항

### 2.1 인증 및 사용자 관리

#### 2.1.1 사용자 회원가입
- **기능**: 새로운 사용자가 계정을 생성할 수 있어야 함
- **필수 정보**: 사용자명, 이메일, 비밀번호
- **인증 방식**: JWT (JSON Web Token) 기반 인증
- **비즈니스 규칙**:
  - 이메일 주소는 유일해야 함
  - 사용자명은 유일해야 함
  - 비밀번호는 안전하게 암호화되어 저장되어야 함

#### 2.1.2 사용자 로그인
- **기능**: 기존 사용자가 인증을 통해 시스템에 접근
- **인증 정보**: 이메일, 비밀번호
- **응답**: JWT 토큰 발급
- **토큰 관리**:
  - 로컬 스토리지 또는 쿠키에 저장
  - API 요청 시 Authorization 헤더에 포함

#### 2.1.3 사용자 로그아웃
- **기능**: 현재 인증된 사용자의 세션 종료
- **위치**: 설정 페이지에 로그아웃 버튼 제공
- **동작**: 클라이언트 측 토큰 삭제

#### 2.1.4 사용자 프로필 관리 (CRU- 작업)
- **조회 (Read)**: 자신 및 다른 사용자의 프로필 조회
- **생성 (Create)**: 회원가입 시 프로필 자동 생성
- **수정 (Update)**: 설정 페이지에서 프로필 정보 수정
  - 사용자명
  - 이메일
  - 비밀번호
  - 프로필 이미지 URL
  - 자기소개 (bio)
- **삭제 (Delete)**: 사용자 삭제 기능은 요구사항에서 제외

### 2.2 아티클 관리

#### 2.2.1 아티클 생성 (Create)
- **기능**: 인증된 사용자가 새 아티클 작성
- **필수 정보**:
  - 제목 (title)
  - 설명 (description)
  - 본문 (body)
  - 태그 목록 (tags)
- **자동 생성 정보**:
  - 슬러그 (URL-friendly 제목)
  - 작성 시간
  - 작성자 정보

#### 2.2.2 아티클 조회 (Read)
- **개별 조회**: 특정 아티클의 상세 정보 표시
- **목록 조회**:
  - 페이지네이션된 아티클 목록
  - 필터링 옵션:
    - 태그별 필터링
    - 작성자별 필터링
    - 팔로우한 작성자의 아티클만 보기 (피드)
    - 좋아요한 아티클 목록
- **정렬**: 최신순 정렬

#### 2.2.3 아티클 수정 (Update)
- **권한**: 아티클 작성자만 수정 가능
- **수정 가능 항목**: 제목, 설명, 본문, 태그
- **수정 불가 항목**: 작성자, 작성 시간

#### 2.2.4 아티클 삭제 (Delete)
- **권한**: 아티클 작성자만 삭제 가능
- **동작**: 아티클 및 연관된 모든 댓글 삭제

#### 2.2.5 아티클 좋아요 (Favorite)
- **기능**: 사용자가 관심 있는 아티클을 즐겨찾기
- **동작**:
  - 좋아요 추가/제거 토글
  - 좋아요 수 카운트 표시
- **권한**: 인증된 사용자만 가능

### 2.3 댓글 관리

#### 2.3.1 댓글 작성 (Create)
- **기능**: 아티클에 댓글 작성
- **필수 정보**: 댓글 본문 (body)
- **권한**: 인증된 사용자만 가능
- **자동 생성 정보**:
  - 작성 시간
  - 작성자 정보

#### 2.3.2 댓글 조회 (Read)
- **기능**: 특정 아티클의 모든 댓글 조회
- **정렬**: 시간순 정렬
- **표시 정보**:
  - 댓글 내용
  - 작성자 정보 (이름, 프로필 이미지)
  - 작성 시간

#### 2.3.3 댓글 삭제 (Delete)
- **권한**: 댓글 작성자만 삭제 가능
- **주의**: 댓글 수정 기능은 요구사항에서 제외

### 2.4 소셜 기능

#### 2.4.1 사용자 팔로우/언팔로우
- **기능**: 다른 사용자를 팔로우하여 그들의 콘텐츠 추적
- **동작**: 팔로우/언팔로우 토글
- **권한**: 인증된 사용자만 가능
- **제한**: 자기 자신은 팔로우할 수 없음

#### 2.4.2 피드 기능
- **기능**: 팔로우한 사용자들의 아티클만 표시
- **권한**: 인증된 사용자만 접근 가능
- **페이지네이션**: 필수

---

## 3. 페이지 구조 및 라우팅

### 3.1 홈 페이지 (/)
- **전역 피드**: 모든 아티클 목록 (페이지네이션)
- **나의 피드**: 팔로우한 사용자의 아티클 (인증된 사용자만)
- **인기 태그**: 자주 사용되는 태그 목록
- **태그 필터**: 특정 태그로 필터링된 아티클 목록

### 3.2 로그인 페이지 (/login)
- 이메일 입력 필드
- 비밀번호 입력 필드
- 로그인 버튼
- 회원가입 페이지 링크

### 3.3 회원가입 페이지 (/register)
- 사용자명 입력 필드
- 이메일 입력 필드
- 비밀번호 입력 필드
- 회원가입 버튼
- 로그인 페이지 링크

### 3.4 설정 페이지 (/settings)
- **권한**: 인증된 사용자만 접근
- 프로필 이미지 URL 입력
- 사용자명 수정
- 자기소개 입력
- 이메일 수정
- 비밀번호 변경
- 로그아웃 버튼

### 3.5 프로필 페이지 (/profile/:username)
- 사용자 정보 표시 (프로필 이미지, 이름, 자기소개)
- 팔로우/언팔로우 버튼 (다른 사용자의 프로필일 경우)
- 설정 버튼 (본인 프로필일 경우)
- 탭:
  - **나의 아티클**: 해당 사용자가 작성한 아티클 목록
  - **좋아요한 아티클**: 해당 사용자가 좋아요한 아티클 목록

### 3.6 아티클 작성/수정 페이지 (/editor, /editor/:slug)
- **권한**: 인증된 사용자만 접근
- 제목 입력 필드
- 설명 입력 필드
- 본문 입력 필드 (마크다운 지원)
- 태그 입력 필드
- 게시 버튼

### 3.7 아티클 상세 페이지 (/article/:slug)
- 아티클 메타 정보:
  - 작성자 프로필 이미지
  - 작성자 이름
  - 작성 날짜
  - 팔로우 버튼 (다른 사용자의 아티클일 경우)
  - 좋아요 버튼
  - 수정/삭제 버튼 (본인 아티클일 경우)
- 아티클 본문 (마크다운 렌더링)
- 태그 목록
- 댓글 섹션:
  - 댓글 작성 폼 (인증된 사용자만)
  - 댓글 목록
  - 댓글 삭제 버튼 (댓글 작성자만)

---

## 4. API 사양

### 4.1 인증
- **방식**: JWT (JSON Web Token)
- **토큰 전달**: HTTP Authorization 헤더
- **형식**: `Authorization: Token {jwt-token}`

### 4.2 API 엔드포인트 카테고리

#### 4.2.1 인증 관련
- `POST /api/users/login` - 로그인
- `POST /api/users` - 회원가입
- `GET /api/user` - 현재 사용자 정보 조회
- `PUT /api/user` - 사용자 정보 수정

#### 4.2.2 프로필 관련
- `GET /api/profiles/:username` - 프로필 조회
- `POST /api/profiles/:username/follow` - 팔로우
- `DELETE /api/profiles/:username/follow` - 언팔로우

#### 4.2.3 아티클 관련
- `GET /api/articles` - 아티클 목록 조회 (페이지네이션, 필터링)
- `GET /api/articles/feed` - 팔로우한 사용자의 아티클 피드
- `GET /api/articles/:slug` - 특정 아티클 조회
- `POST /api/articles` - 아티클 작성
- `PUT /api/articles/:slug` - 아티클 수정
- `DELETE /api/articles/:slug` - 아티클 삭제
- `POST /api/articles/:slug/favorite` - 아티클 좋아요
- `DELETE /api/articles/:slug/favorite` - 아티클 좋아요 취소

#### 4.2.4 댓글 관련
- `GET /api/articles/:slug/comments` - 댓글 목록 조회
- `POST /api/articles/:slug/comments` - 댓글 작성
- `DELETE /api/articles/:slug/comments/:id` - 댓글 삭제

#### 4.2.5 태그 관련
- `GET /api/tags` - 모든 태그 목록 조회

### 4.3 API 응답 형식
- **Content-Type**: `application/json`
- **성공 응답**: 2xx 상태 코드와 함께 JSON 데이터
- **에러 응답**: 4xx/5xx 상태 코드와 함께 에러 메시지

### 4.4 CORS 설정
- 프론트엔드와 백엔드가 다른 도메인에서 실행될 수 있으므로 CORS 활성화 필수

---

## 5. 기술 스택 및 요구사항

### 5.1 백엔드 기술 스택

#### 5.1.1 언어 및 프레임워크
- **언어**: Java 17 LTS (또는 Kotlin 1.9+)
  - Java 공식 문서: https://docs.oracle.com/en/java/javase/17/
  - OpenJDK 17 다운로드: https://adoptium.net/
- **프레임워크**: Spring Boot 3.4.1
  - 공식 문서: https://spring.io/projects/spring-boot
  - 시작 가이드: https://spring.io/guides/gs/spring-boot/
- **빌드 도구**: Gradle 8.x (권장) 또는 Maven 3.9+
  - Gradle 공식 문서: https://docs.gradle.org/
  - Maven 공식 문서: https://maven.apache.org/guides/

#### 5.1.2 주요 라이브러리
- **Spring Security**: JWT 기반 인증 및 권한 관리
- **Spring Data JPA**: 데이터베이스 접근 계층 (또는 Plain JDBC/QueryDSL)
- **Spring Validation**: 입력 데이터 검증
- **Spring Web**: REST API 컨트롤러

#### 5.1.3 데이터베이스
- **DBMS**: PostgreSQL 16.10 (LTS)
  - 공식 문서: https://www.postgresql.org/docs/16/
  - 다운로드: https://www.postgresql.org/download/
  - 시작 가이드: https://www.postgresql.org/docs/16/tutorial.html
- **드라이버**: PostgreSQL JDBC Driver 42.7+
  - GitHub: https://github.com/pgjdbc/pgjdbc
- **마이그레이션**: Flyway 10.x 또는 Liquibase 4.x
  - Flyway 문서: https://flywaydb.org/documentation/
  - Liquibase 문서: https://docs.liquibase.com/
- **연결 풀**: HikariCP (Spring Boot 기본)
  - GitHub: https://github.com/brettwooldridge/HikariCP

#### 5.1.4 보안
- **인증 방식**: JWT (JSON Web Token)
- **비밀번호 암호화**: BCryptPasswordEncoder
- **CORS**: Spring Security CORS 설정
- **보안 헤더**: Spring Security 기본 보안 헤더 활성화

#### 5.1.5 기타 도구
- **로깅**: SLF4J 2.x + Logback 1.5+
  - SLF4J 문서: https://www.slf4j.org/manual.html
  - Logback 문서: https://logback.qos.ch/manual/
- **문서화**: SpringDoc OpenAPI 2.x (Swagger UI)
  - GitHub: https://github.com/springdoc/springdoc-openapi
  - 문서: https://springdoc.org/
- **테스트**: JUnit 5.11+, MockMvc, Testcontainers 1.20+
  - JUnit 5 문서: https://junit.org/junit5/docs/current/user-guide/
  - Testcontainers 문서: https://testcontainers.com/guides/getting-started-with-testcontainers-for-java/

### 5.2 프론트엔드 기술 스택

#### 5.2.1 언어 및 프레임워크
- **런타임**: Node.js 20 LTS
  - 공식 문서: https://nodejs.org/docs/latest-v20.x/api/
  - 다운로드: https://nodejs.org/
- **언어**: TypeScript 5.7+
  - 공식 문서: https://www.typescriptlang.org/docs/
  - 핸드북: https://www.typescriptlang.org/docs/handbook/intro.html
- **프레임워크**: React 18.3.1
  - 공식 문서: https://react.dev/
  - 시작 가이드: https://react.dev/learn
  - API 레퍼런스: https://react.dev/reference/react
- **빌드 도구**: Vite 5.4+
  - 공식 문서: https://vite.dev/
  - 시작 가이드: https://vite.dev/guide/

#### 5.2.2 주요 라이브러리
- **스타일링**: Tailwind CSS 3.4+
  - 공식 문서: https://tailwindcss.com/docs
  - 설치 가이드 (Vite): https://tailwindcss.com/docs/guides/vite
- **상태 관리**: TanStack Query (React Query) 5.84+
  - 공식 문서: https://tanstack.com/query/latest
  - React 가이드: https://tanstack.com/query/latest/docs/framework/react/overview
- **라우팅**: React Router 6.28+
  - 공식 문서: https://reactrouter.com/
  - 튜토리얼: https://reactrouter.com/start/tutorial
- **폼 관리**: React Hook Form 7.x (선택)
  - 공식 문서: https://react-hook-form.com/
- **HTTP 클라이언트**: Axios 1.7+ 또는 Fetch API
  - Axios 문서: https://axios-http.com/docs/intro

#### 5.2.3 UI/UX
- **디자인 시스템**: Tailwind CSS 기반 커스텀 컴포넌트
- **아이콘**: Heroicons 2.x 또는 Lucide React 0.x
  - Heroicons: https://heroicons.com/
  - Lucide React: https://lucide.dev/guide/packages/lucide-react
- **마크다운 렌더링**: React Markdown 9.x
  - GitHub: https://github.com/remarkjs/react-markdown

#### 5.2.4 개발 도구
- **패키지 관리자**: npm 10.x (Node.js 20 LTS 포함) 또는 pnpm 9.x
  - pnpm 문서: https://pnpm.io/
- **린터**: ESLint 9.x
  - 공식 문서: https://eslint.org/docs/latest/
- **포매터**: Prettier 3.x
  - 공식 문서: https://prettier.io/docs/en/
- **타입 체킹**: TypeScript Compiler (tsc)

### 5.3 실행 환경 (Docker)

#### 5.3.1 Docker 컨테이너 구성
- **백엔드 컨테이너**: Spring Boot 애플리케이션
  - Base Image: eclipse-temurin:17-jre-alpine 또는 amazoncorretto:17-alpine
  - 포트: 8080
  - Docker Hub: https://hub.docker.com/_/eclipse-temurin

- **프론트엔드 컨테이너**: Nginx + React 정적 빌드
  - Base Image: nginx:1.27-alpine
  - 포트: 3000 또는 80
  - Docker Hub: https://hub.docker.com/_/nginx

- **데이터베이스 컨테이너**: PostgreSQL
  - Base Image: postgres:16-alpine
  - 포트: 5432
  - 볼륨: 데이터 영속성을 위한 named volume
  - Docker Hub: https://hub.docker.com/_/postgres

#### 5.3.2 Docker Compose 설정
- 3개 서비스 정의 (backend, frontend, database)
- 환경 변수 관리 (.env 파일)
- 네트워크: 커스텀 bridge network
- 헬스체크 설정
- 의존성 관리 (depends_on)

#### 5.3.3 개발 환경 설정
- **Hot Reload**:
  - 백엔드: Spring Boot DevTools + Volume Mount
  - 프론트엔드: Vite Dev Server + Volume Mount
- **데이터베이스 초기화**: init.sql 스크립트 또는 Flyway 마이그레이션

### 5.4 개발 도구 및 관행

#### 5.4.1 빌드 및 자동화
- **Makefile**: 공통 명령어 단축 (docker-compose up, build, test 등)
- **Shell Scripts**: 초기화 및 배포 스크립트

#### 5.4.2 환경 변수 관리
```
# Backend
DATABASE_URL=postgresql://postgres:password@db:5432/realworld
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Frontend
VITE_API_URL=http://localhost:8080/api
```

#### 5.4.3 로그 관리
- 백엔드: application.log (컨테이너 볼륨 마운트 또는 stdout)
- 프론트엔드: Nginx access.log, error.log
- 데이터베이스: PostgreSQL 로그

#### 5.4.4 코드 품질
- 단순하고 명확한 코드 작성
- 명시적인 에러 처리
- 적절한 주석 및 문서화
- 일관된 코드 스타일

### 5.5 데이터 모델

#### User (사용자)
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- bio
- image
- created_at
- updated_at

#### Article (아티클)
- id (PK)
- slug (unique, URL-friendly)
- title
- description
- body
- author_id (FK → User)
- created_at
- updated_at

#### Comment (댓글)
- id (PK)
- body
- article_id (FK → Article)
- author_id (FK → User)
- created_at
- updated_at

#### Tag (태그)
- id (PK)
- name (unique)

#### ArticleTag (아티클-태그 관계)
- article_id (FK → Article)
- tag_id (FK → Tag)

#### Favorite (좋아요)
- user_id (FK → User)
- article_id (FK → Article)

#### Follow (팔로우)
- follower_id (FK → User)
- following_id (FK → User)

---

## 6. 비기능적 요구사항

### 6.1 성능
- 페이지 로드 시간: 3초 이내
- API 응답 시간: 평균 200ms 이내
- 페이지네이션을 통한 효율적인 데이터 로딩

### 6.2 보안
- HTTPS 사용 권장
- JWT 토큰 만료 시간 설정
- 비밀번호 암호화
- XSS 및 CSRF 공격 방지

### 6.3 사용성
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 직관적인 UI/UX
- 명확한 에러 메시지 표시

### 6.4 확장성
- 프론트엔드와 백엔드의 독립적 배포 가능
- 다양한 프론트엔드와 백엔드 조합 지원
- API 버저닝 고려

---

## 7. 테스트 요구사항

### 7.1 프론트엔드 테스트
- 컴포넌트 단위 테스트
- E2E 테스트 (주요 사용자 플로우)
- 크로스 브라우저 테스트

### 7.2 백엔드 테스트
- API 엔드포인트 테스트
- 인증 및 권한 테스트
- 데이터베이스 트랜잭션 테스트

---

## 8. 구현 우선순위

### Phase 1: 핵심 기능
1. 사용자 인증 (회원가입, 로그인, 로그아웃)
2. 아티클 CRUD
3. 기본 페이지 구조 및 라우팅

### Phase 2: 소셜 기능
1. 댓글 기능
2. 아티클 좋아요
3. 사용자 팔로우

### Phase 3: 고급 기능
1. 페이지네이션 및 필터링
2. 태그 시스템
3. 프로필 페이지

### Phase 4: 최적화 및 테스트
1. 성능 최적화
2. 보안 강화
3. 테스트 작성 및 검증

---

## 9. 참고 자료

- 공식 문서: https://realworld-docs.netlify.app/
- GitHub 저장소: https://github.com/gothinkster/realworld
- 라이브 데모: https://demo.realworld.io
- API 데모: https://api.realworld.io/api-docs/

---

## 10. 프로젝트 범위 제외 사항

- 사용자 계정 삭제 기능
- 댓글 수정 기능
- 실시간 알림 기능
- 이메일 인증 기능
- 소셜 로그인 (OAuth)
- 다크 모드
- 다국어 지원

---

## 문서 버전
- **버전**: 1.1
- **작성일**: 2025-11-10
- **최종 수정일**: 2025-11-10
- **작성자**: Claude Code
- **용도**: Vibe 코딩 학습을 위한 RealWorld 앱 구현 프로젝트

### 변경 이력
- **v1.1** (2025-11-10): 기술 스택 구체화 (Spring Boot, PostgreSQL, Docker, React + Vite + Tailwind)
- **v1.0** (2025-11-10): 초기 PRD 문서 작성
