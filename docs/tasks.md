# RealWorld 앱 구현 작업 목록

> **버전**: 1.0
> **작성일**: 2025-11-11
> **기반 문서**: RealWorld-PRD.md, https://realworld-docs.netlify.app/

이 문서는 RealWorld 앱(Medium.com 클론)을 Spring Boot(백엔드) + React(프론트엔드) + SQLite(데이터베이스)로 구현하기 위한 상세 작업 목록입니다.

---

## 📋 목차

1. [프로젝트 초기 설정](#1-프로젝트-초기-설정)
2. [데이터베이스 설계 및 마이그레이션](#2-데이터베이스-설계-및-마이그레이션)
3. [백엔드 구현 (Spring Boot)](#3-백엔드-구현-spring-boot)
4. [프론트엔드 구현 (React)](#4-프론트엔드-구현-react)
5. [Docker 및 배포 설정](#5-docker-및-배포-설정)
6. [테스트 및 검증](#6-테스트-및-검증)
7. [문서화 및 최종 점검](#7-문서화-및-최종-점검)

---

## 1. 프로젝트 초기 설정

### 1.1 저장소 구조 설정
- [ ] 모노레포 디렉토리 구조 생성
  ```
  vide-start/
  ├── backend/          # Spring Boot 애플리케이션
  ├── frontend/         # React 애플리케이션
  ├── docs/             # 프로젝트 문서
  ├── docker/           # Docker 관련 파일
  ├── .gitignore
  ├── docker-compose.yml
  ├── Makefile
  └── README.md
  ```
- [ ] `.gitignore` 파일 업데이트 (백엔드/프론트엔드 각각)
- [ ] GitHub 이슈 템플릿 생성 (선택 사항)

**예상 소요 시간**: 30분

---

## 2. 데이터베이스 설계 및 마이그레이션

### 2.1 ERD 설계
- [ ] 데이터베이스 스키마 설계
  - User (사용자)
  - Article (아티클)
  - Comment (댓글)
  - Tag (태그)
  - ArticleTag (아티클-태그 관계)
  - Favorite (좋아요)
  - Follow (팔로우)

### 2.2 SQLite 설정 및 드라이버 추가
- [ ] build.gradle.kts에 SQLite JDBC 드라이버 추가
- [ ] build.gradle.kts에 Hibernate Community Dialects 추가 (SQLite 방언)
- [ ] application.yml에 SQLite 데이터베이스 설정 추가
  - JDBC URL: `jdbc:sqlite:data/realworld.db`
  - Hibernate dialect: `org.hibernate.community.dialect.SQLiteDialect`

### 2.3 Flyway 마이그레이션 스크립트 작성 (SQLite 문법)
- [ ] `V1__create_users_table.sql` - 사용자 테이블
- [ ] `V2__create_articles_table.sql` - 아티클 테이블
- [ ] `V3__create_comments_table.sql` - 댓글 테이블
- [ ] `V4__create_tags_table.sql` - 태그 테이블
- [ ] `V5__create_article_tags_table.sql` - 아티클-태그 관계 테이블
- [ ] `V6__create_favorites_table.sql` - 좋아요 테이블
- [ ] `V7__create_follows_table.sql` - 팔로우 테이블
- [ ] `V8__add_indexes.sql` - 성능 최적화를 위한 인덱스 추가

**주의사항**:
- SQLite는 `BIGSERIAL` 대신 `INTEGER PRIMARY KEY AUTOINCREMENT` 사용
- `TIMESTAMP` 대신 `DATETIME` 또는 `TEXT` 사용
- `DEFAULT CURRENT_TIMESTAMP` 지원
- 일부 제약조건은 SQLite에서 제한적으로 지원됨

**예상 소요 시간**: 3시간

---

## 3. 백엔드 구현 (Spring Boot)

### 3.1 프로젝트 초기 설정

#### 3.1.1 Spring Boot 프로젝트 생성
- [ ] Spring Initializr로 프로젝트 생성 (Spring Boot 3.x, Java 17+)
- [ ] 필수 의존성 추가
  - Spring Web
  - Spring Security
  - Spring Data JPA
  - SQLite Driver (org.xerial:sqlite-jdbc)
  - Flyway Migration
  - Hibernate Community Dialects (SQLite 지원)
  - JWT Library (jjwt)
  - Validation
  - Lombok
  - Spring Doc OpenAPI (Swagger)

#### 3.1.2 기본 설정 파일 작성
- [ ] `application.yml` 작성
  - 데이터베이스 연결 설정
  - JPA 설정
  - Flyway 설정
  - JWT 설정
  - CORS 설정
- [ ] `application-dev.yml`, `application-prod.yml` 환경별 설정

**예상 소요 시간**: 1시간

---

### 3.2 도메인 모델 및 엔티티 구현

#### 3.2.1 엔티티 클래스 작성
- [ ] `User` 엔티티
  - id, username, email, password, bio, image
  - 생성/수정 시간 (BaseTimeEntity)
- [ ] `Article` 엔티티
  - id, slug, title, description, body, author
  - 생성/수정 시간
- [ ] `Comment` 엔티티
  - id, body, article, author, 생성/수정 시간
- [ ] `Tag` 엔티티
  - id, name
- [ ] `ArticleTag` 엔티티 (조인 테이블)
- [ ] `Favorite` 엔티티 (복합 키: userId, articleId)
- [ ] `Follow` 엔티티 (복합 키: followerId, followingId)

#### 3.2.2 리포지토리 인터페이스 작성
- [ ] `UserRepository`
- [ ] `ArticleRepository`
- [ ] `CommentRepository`
- [ ] `TagRepository`
- [ ] `FavoriteRepository`
- [ ] `FollowRepository`

**예상 소요 시간**: 3시간

---

### 3.3 보안 및 JWT 인증 구현

#### 3.3.1 Spring Security 설정
- [ ] `SecurityConfig` 클래스 작성
  - CORS 설정
  - CSRF 비활성화 (JWT 사용)
  - 인증 제외 엔드포인트 설정 (로그인, 회원가입, 공개 읽기)
  - JWT 필터 설정

#### 3.3.2 JWT 유틸리티 구현
- [ ] `JwtTokenProvider` 클래스
  - 토큰 생성
  - 토큰 검증
  - 토큰에서 사용자 정보 추출
- [ ] `JwtAuthenticationFilter` 클래스
  - 요청 헤더에서 JWT 토큰 추출
  - 토큰 검증 및 SecurityContext 설정

#### 3.3.3 비밀번호 암호화
- [ ] `PasswordEncoder` 빈 설정 (BCrypt)

**예상 소요 시간**: 3시간

---

### 3.4 API 엔드포인트 구현

#### 3.4.1 인증 관련 API
- [ ] `POST /api/users/login` - 로그인
  - 이메일/비밀번호 검증
  - JWT 토큰 발급
- [ ] `POST /api/users` - 회원가입
  - 입력 검증 (이메일/사용자명 중복 체크)
  - 비밀번호 암호화
  - 사용자 생성 및 JWT 토큰 발급
- [ ] `GET /api/user` - 현재 사용자 정보 조회 (인증 필요)
- [ ] `PUT /api/user` - 사용자 정보 수정 (인증 필요)

#### 3.4.2 프로필 관련 API
- [ ] `GET /api/profiles/:username` - 프로필 조회
- [ ] `POST /api/profiles/:username/follow` - 팔로우 (인증 필요)
- [ ] `DELETE /api/profiles/:username/follow` - 언팔로우 (인증 필요)

#### 3.4.3 아티클 관련 API
- [ ] `GET /api/articles` - 아티클 목록 조회
  - 페이지네이션 (limit, offset)
  - 필터링 (tag, author, favorited)
  - 정렬 (최신순)
- [ ] `GET /api/articles/feed` - 팔로우한 사용자의 아티클 피드 (인증 필요)
- [ ] `GET /api/articles/:slug` - 아티클 상세 조회
- [ ] `POST /api/articles` - 아티클 작성 (인증 필요)
  - Slug 자동 생성 (URL-friendly)
- [ ] `PUT /api/articles/:slug` - 아티클 수정 (작성자만)
  - 제목 변경 시 Slug 업데이트
- [ ] `DELETE /api/articles/:slug` - 아티클 삭제 (작성자만)

#### 3.4.4 댓글 관련 API
- [ ] `GET /api/articles/:slug/comments` - 댓글 목록 조회
- [ ] `POST /api/articles/:slug/comments` - 댓글 작성 (인증 필요)
- [ ] `DELETE /api/articles/:slug/comments/:id` - 댓글 삭제 (작성자만)

#### 3.4.5 좋아요 관련 API
- [ ] `POST /api/articles/:slug/favorite` - 아티클 좋아요 (인증 필요)
- [ ] `DELETE /api/articles/:slug/favorite` - 아티클 좋아요 취소 (인증 필요)

#### 3.4.6 태그 관련 API
- [ ] `GET /api/tags` - 태그 목록 조회

**예상 소요 시간**: 8시간

---

### 3.5 서비스 레이어 구현
- [ ] `UserService` - 사용자 관리 로직
- [ ] `ArticleService` - 아티클 관리 로직
- [ ] `CommentService` - 댓글 관리 로직
- [ ] `TagService` - 태그 관리 로직
- [ ] `ProfileService` - 프로필 및 팔로우 로직
- [ ] `FavoriteService` - 좋아요 관리 로직

**예상 소요 시간**: 4시간

---

### 3.6 DTO 및 요청/응답 객체 작성
- [ ] 요청 DTO (LoginRequest, RegisterRequest, ArticleCreateRequest 등)
- [ ] 응답 DTO (UserResponse, ArticleResponse, CommentResponse 등)
- [ ] 에러 응답 DTO (ErrorResponse)

**예상 소요 시간**: 2시간

---

### 3.7 예외 처리 및 검증
- [ ] 글로벌 예외 핸들러 (`@ControllerAdvice`)
- [ ] 커스텀 예외 클래스 (ResourceNotFoundException, UnauthorizedException 등)
- [ ] 입력 검증 (`@Valid`, `@Validated`)
- [ ] 에러 메시지 표준화

**예상 소요 시간**: 2시간

---

### 3.8 OpenAPI 문서화
- [ ] SpringDoc 설정
- [ ] API 문서 주석 추가 (`@Operation`, `@ApiResponse`)
- [ ] Swagger UI 접근 (`/swagger-ui.html`)

**예상 소요 시간**: 1시간

---

## 4. 프론트엔드 구현 (React)

### 4.1 프로젝트 초기 설정

#### 4.1.1 React + Vite 프로젝트 생성
- [ ] Vite로 React + TypeScript 프로젝트 생성
- [ ] 필수 의존성 설치
  - React Router v6
  - TanStack Query (React Query)
  - Axios
  - React Hook Form
  - React Markdown
  - Tailwind CSS
  - Heroicons 또는 Lucide React

#### 4.1.2 Tailwind CSS 설정
- [ ] `tailwind.config.js` 작성
- [ ] 기본 스타일 설정 (`index.css`)

#### 4.1.3 환경 변수 설정
- [ ] `.env` 파일 생성
  - `VITE_API_URL=http://localhost:8080/api`

**예상 소요 시간**: 1시간

---

### 4.2 라우팅 구조 설정

#### 4.2.1 React Router 설정
- [ ] 라우트 정의
  - `/` - 홈 페이지
  - `/login` - 로그인 페이지
  - `/register` - 회원가입 페이지
  - `/settings` - 설정 페이지 (인증 필요)
  - `/editor` - 아티클 작성 페이지 (인증 필요)
  - `/editor/:slug` - 아티클 수정 페이지 (인증 필요)
  - `/article/:slug` - 아티클 상세 페이지
  - `/profile/:username` - 프로필 페이지
  - `/profile/:username/favorites` - 좋아요한 아티클 페이지

#### 4.2.2 라우트 가드 구현
- [ ] `ProtectedRoute` 컴포넌트 (인증된 사용자만 접근)
- [ ] `PublicRoute` 컴포넌트 (비로그인 사용자만 접근)

**예상 소요 시간**: 2시간

---

### 4.3 상태 관리 설정

#### 4.3.1 TanStack Query 설정
- [ ] `QueryClient` 설정
- [ ] API 에러 핸들링
- [ ] 캐시 설정

#### 4.3.2 인증 상태 관리
- [ ] LocalStorage에 JWT 토큰 저장/조회/삭제
- [ ] 인증 Context 또는 커스텀 훅 (`useAuth`)
- [ ] Axios 인터셉터로 Authorization 헤더 자동 추가

**예상 소요 시간**: 2시간

---

### 4.4 API 클라이언트 구현

#### 4.4.1 Axios 인스턴스 설정
- [ ] Base URL 설정
- [ ] 요청 인터셉터 (JWT 토큰 추가)
- [ ] 응답 인터셉터 (에러 핸들링)

#### 4.4.2 API 함수 작성
- [ ] 인증 API (`login`, `register`, `getCurrentUser`, `updateUser`)
- [ ] 프로필 API (`getProfile`, `followUser`, `unfollowUser`)
- [ ] 아티클 API (`getArticles`, `getFeed`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`)
- [ ] 댓글 API (`getComments`, `createComment`, `deleteComment`)
- [ ] 좋아요 API (`favoriteArticle`, `unfavoriteArticle`)
- [ ] 태그 API (`getTags`)

**예상 소요 시간**: 3시간

---

### 4.5 공통 컴포넌트 구현

#### 4.5.1 레이아웃 컴포넌트
- [ ] `Header` - 상단 네비게이션
  - 로그인/비로그인 상태별 메뉴
  - 로고, 홈, 로그인/회원가입/프로필/글쓰기 링크
- [ ] `Footer` - 하단 푸터 (선택 사항)

#### 4.5.2 UI 컴포넌트
- [ ] `Button` - 재사용 가능한 버튼 컴포넌트
- [ ] `Input` - 입력 필드 컴포넌트
- [ ] `Textarea` - 텍스트 영역 컴포넌트
- [ ] `ErrorMessage` - 에러 메시지 표시
- [ ] `LoadingSpinner` - 로딩 인디케이터
- [ ] `Pagination` - 페이지네이션 컴포넌트

#### 4.5.3 아티클 관련 컴포넌트
- [ ] `ArticlePreview` - 아티클 미리보기 카드
- [ ] `ArticleList` - 아티클 목록
- [ ] `ArticleMeta` - 아티클 메타 정보 (작성자, 날짜, 팔로우/좋아요 버튼)
- [ ] `TagList` - 태그 목록 표시

**예상 소요 시간**: 4시간

---

### 4.6 페이지 컴포넌트 구현

#### 4.6.1 홈 페이지 (`/`)
- [ ] 전역 피드 탭
- [ ] 나의 피드 탭 (인증된 사용자만)
- [ ] 인기 태그 사이드바
- [ ] 태그 필터링 기능
- [ ] 페이지네이션

#### 4.6.2 로그인 페이지 (`/login`)
- [ ] 이메일 입력
- [ ] 비밀번호 입력
- [ ] 로그인 버튼
- [ ] 회원가입 링크
- [ ] 에러 메시지 표시

#### 4.6.3 회원가입 페이지 (`/register`)
- [ ] 사용자명 입력
- [ ] 이메일 입력
- [ ] 비밀번호 입력
- [ ] 회원가입 버튼
- [ ] 로그인 링크
- [ ] 에러 메시지 표시

#### 4.6.4 설정 페이지 (`/settings`)
- [ ] 프로필 이미지 URL 입력
- [ ] 사용자명 수정
- [ ] 자기소개 입력
- [ ] 이메일 수정
- [ ] 비밀번호 변경
- [ ] 로그아웃 버튼

#### 4.6.5 프로필 페이지 (`/profile/:username`)
- [ ] 사용자 정보 표시
- [ ] 팔로우/언팔로우 버튼 (다른 사용자)
- [ ] 설정 버튼 (본인)
- [ ] 나의 아티클 탭
- [ ] 좋아요한 아티클 탭

#### 4.6.6 아티클 작성/수정 페이지 (`/editor`)
- [ ] 제목 입력
- [ ] 설명 입력
- [ ] 본문 입력 (마크다운)
- [ ] 태그 입력
- [ ] 게시 버튼
- [ ] 에러 처리

#### 4.6.7 아티클 상세 페이지 (`/article/:slug`)
- [ ] 아티클 메타 정보 (작성자, 날짜, 팔로우/좋아요 버튼)
- [ ] 수정/삭제 버튼 (작성자만)
- [ ] 아티클 본문 (마크다운 렌더링)
- [ ] 태그 목록
- [ ] 댓글 섹션
  - 댓글 작성 폼 (인증 필요)
  - 댓글 목록
  - 댓글 삭제 버튼 (작성자만)

**예상 소요 시간**: 12시간

---

### 4.7 React Query 훅 구현
- [ ] `useLogin` - 로그인
- [ ] `useRegister` - 회원가입
- [ ] `useCurrentUser` - 현재 사용자 조회
- [ ] `useUpdateUser` - 사용자 정보 수정
- [ ] `useArticles` - 아티클 목록 조회
- [ ] `useFeed` - 피드 조회
- [ ] `useArticle` - 아티클 상세 조회
- [ ] `useCreateArticle` - 아티클 작성
- [ ] `useUpdateArticle` - 아티클 수정
- [ ] `useDeleteArticle` - 아티클 삭제
- [ ] `useComments` - 댓글 목록 조회
- [ ] `useCreateComment` - 댓글 작성
- [ ] `useDeleteComment` - 댓글 삭제
- [ ] `useFavorite` - 좋아요/좋아요 취소
- [ ] `useProfile` - 프로필 조회
- [ ] `useFollow` - 팔로우/언팔로우
- [ ] `useTags` - 태그 목록 조회

**예상 소요 시간**: 4시간

---

### 4.8 스타일링 및 UX 개선
- [ ] Tailwind CSS로 전체 레이아웃 스타일링
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
- [ ] 로딩 상태 표시
- [ ] 에러 상태 표시
- [ ] 빈 상태 표시 (Empty State)
- [ ] 성공 메시지 토스트 (선택 사항)

**예상 소요 시간**: 4시간

---

## 5. Docker 및 배포 설정

### 5.1 Dockerfile 작성

#### 5.1.1 백엔드 Dockerfile
- [ ] Multi-stage build 설정
  - 빌드 스테이지 (Gradle)
  - 런타임 스테이지 (JRE)
- [ ] 포트 8080 노출
- [ ] 헬스체크 설정

#### 5.1.2 프론트엔드 Dockerfile
- [ ] Multi-stage build 설정
  - 빌드 스테이지 (Node.js + Vite)
  - 런타임 스테이지 (Nginx)
- [ ] Nginx 설정 파일 복사
- [ ] 포트 80 노출

**예상 소요 시간**: 2시간

---

### 5.2 Docker Compose 설정

#### 5.2.1 docker-compose.yml 작성
- [ ] 서비스 정의
  - `backend` (Spring Boot + SQLite)
  - `frontend` (Nginx + React)
- [ ] 환경 변수 설정
- [ ] 볼륨 설정 (SQLite 데이터베이스 파일 영속성)
- [ ] 네트워크 설정
- [ ] 의존성 설정 (depends_on)

#### 5.2.2 개발 환경 docker-compose
- [ ] `docker-compose.dev.yml` 작성
  - 볼륨 마운트 (Hot Reload)
  - 개발 환경 환경 변수

**예상 소요 시간**: 2시간

---

### 5.3 환경 변수 관리
- [ ] `.env.example` 파일 작성
- [ ] `.env` 파일 생성 (git에서 제외)
- [ ] 환경 변수 문서화

**예상 소요 시간**: 30분

---

### 5.4 Makefile 작성
- [ ] 공통 명령어 정의
  - `make build` - 빌드
  - `make up` - 실행
  - `make down` - 종료
  - `make logs` - 로그 확인
  - `make test` - 테스트 실행
  - `make clean` - 정리

**예상 소요 시간**: 1시간

---

## 6. 테스트 및 검증

### 6.1 백엔드 테스트

#### 6.1.1 단위 테스트
- [ ] 서비스 레이어 테스트
- [ ] 리포지토리 테스트
- [ ] JWT 유틸리티 테스트

#### 6.1.2 통합 테스트
- [ ] API 엔드포인트 테스트 (MockMvc)
- [ ] 데이터베이스 트랜잭션 테스트
- [ ] 인증/권한 테스트

#### 6.1.3 테스트 데이터베이스 설정
- [ ] 인메모리 SQLite 데이터베이스 설정 (`:memory:`)
- [ ] 통합 테스트 환경 구성

**예상 소요 시간**: 6시간

---

### 6.2 프론트엔드 테스트

#### 6.2.1 컴포넌트 테스트
- [ ] 주요 컴포넌트 단위 테스트
- [ ] React Testing Library 사용

#### 6.2.2 E2E 테스트 (선택 사항)
- [ ] Playwright 또는 Cypress 설정
- [ ] 주요 사용자 플로우 테스트
  - 회원가입 → 로그인 → 글 작성 → 댓글 작성

**예상 소요 시간**: 4시간

---

### 6.3 수동 테스트 및 검증
- [ ] 공식 RealWorld API 스펙 준수 확인
- [ ] 모든 페이지 및 기능 동작 확인
- [ ] 반응형 디자인 테스트
- [ ] 에러 핸들링 테스트

**예상 소요 시간**: 3시간

---

## 7. 문서화 및 최종 점검

### 7.1 README 작성
- [ ] 프로젝트 개요
- [ ] 기술 스택
- [ ] 설치 및 실행 방법
- [ ] 환경 변수 설정
- [ ] API 문서 링크
- [ ] 스크린샷 (선택 사항)

**예상 소요 시간**: 2시간

---

### 7.2 API 문서화
- [ ] Swagger UI 활성화 확인
- [ ] 모든 엔드포인트 문서화 검증
- [ ] Postman 컬렉션 작성 (선택 사항)

**예상 소요 시간**: 1시간

---

### 7.3 배포 가이드 작성
- [ ] 프로덕션 배포 절차
- [ ] 환경 변수 설정 가이드
- [ ] 트러블슈팅 가이드

**예상 소요 시간**: 1시간

---

### 7.4 최종 점검
- [ ] 코드 리뷰 및 리팩토링
- [ ] 린터 및 포매터 실행 (ESLint, Prettier, Checkstyle)
- [ ] 불필요한 주석 및 console.log 제거
- [ ] Git 커밋 히스토리 정리 (필요 시)

**예상 소요 시간**: 2시간

---

## 📊 전체 예상 소요 시간

| 섹션 | 예상 시간 |
|------|-----------|
| 1. 프로젝트 초기 설정 | 30분 |
| 2. 데이터베이스 설계 및 마이그레이션 | 2시간 |
| 3. 백엔드 구현 | 26시간 |
| 4. 프론트엔드 구현 | 32시간 |
| 5. Docker 및 배포 설정 | 5.5시간 |
| 6. 테스트 및 검증 | 13시간 |
| 7. 문서화 및 최종 점검 | 6시간 |
| **총계** | **약 85시간** |

---

## 📌 구현 우선순위

### Phase 1: 핵심 기능 (우선순위 높음)
1. 프로젝트 초기 설정 및 데이터베이스 스키마
2. 백엔드 인증 시스템 (JWT)
3. 아티클 CRUD API
4. 프론트엔드 라우팅 및 기본 레이아웃
5. 로그인/회원가입 페이지
6. 홈 페이지 (아티클 목록)
7. 아티클 상세 페이지
8. 아티클 작성/수정 페이지

### Phase 2: 소셜 기능 (우선순위 중간)
1. 댓글 기능 (백엔드 + 프론트엔드)
2. 아티클 좋아요 기능
3. 사용자 팔로우 기능
4. 피드 기능
5. 프로필 페이지

### Phase 3: 고급 기능 및 최적화 (우선순위 낮음)
1. 페이지네이션 개선
2. 태그 시스템
3. 검색 및 필터링 최적화
4. 성능 최적화
5. 보안 강화

### Phase 4: 테스트 및 배포
1. 단위/통합 테스트 작성
2. E2E 테스트 작성
3. Docker 설정
4. 문서화
5. 배포

---

## 🔗 참고 자료

- **공식 문서**: https://realworld-docs.netlify.app/
- **GitHub 저장소**: https://github.com/gothinkster/realworld
- **라이브 데모**: https://demo.realworld.io
- **API 데모**: https://api.realworld.io/api-docs/
- **PRD 문서**: `docs/RealWorld-PRD.md`

---

## ✅ 작업 진행 상황 추적

이 문서의 체크박스를 활용하여 작업 진행 상황을 추적하세요.

- [ ] = 미완료
- [x] = 완료

**현재 진행률**: 0% (0/총 작업 수)

---

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**작성자**: Claude Code
