# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 필수 규칙 (CRITICAL RULES)

### 언어 사용
**모든 커뮤니케이션과 문서화는 반드시 한글을 사용합니다.**

- ✅ 사용자와의 대화: 한글
- ✅ 커밋 메시지: 한글
- ✅ 이슈 생성: 한글
- ✅ PR 설명: 한글
- ✅ 코드 주석: 한글
- ✅ 문서 작성: 한글
- ❌ 영어 사용 금지 (코드 자체 제외)

**예외:**
- 코드 내 변수명, 함수명, 클래스명 등은 영어 사용 가능
- 외부 라이브러리나 프레임워크 관련 기술 용어는 원어 사용 가능

---

## 프로젝트 개요

RealWorld 앱은 Medium.com 클론으로, Spring Boot(백엔드) + React(프론트엔드) + PostgreSQL(데이터베이스)로 구현하는 풀스택 소셜 블로깅 플랫폼입니다.

### 기술 스택

**백엔드 (backend/)**
- Java 17+ 또는 Kotlin
- Spring Boot 3.x
- Spring Security + JWT 인증
- Spring Data JPA
- PostgreSQL 14+
- Flyway 마이그레이션
- Gradle 빌드

**프론트엔드 (frontend/)**
- TypeScript
- React 18+ + Vite
- TanStack Query (React Query)
- React Router v6
- Tailwind CSS
- Axios

**인프라**
- Docker + Docker Compose
- Nginx (프론트엔드 서빙)

---

## 개발 환경 설정 및 명령어

### 전체 스택 실행 (Docker Compose)
```bash
# 전체 스택 빌드 및 실행
docker-compose up -d

# 전체 스택 종료
docker-compose down

# 로그 확인
docker-compose logs -f
```

### 백엔드 개발 (backend/)
```bash
cd backend

# PostgreSQL 실행 (Docker)
docker-compose up -d db

# 애플리케이션 실행
./gradlew bootRun

# 테스트 실행
./gradlew test

# 특정 테스트 클래스 실행
./gradlew test --tests UserServiceTest

# 통합 테스트 실행
./gradlew integrationTest

# 빌드 (JAR 생성)
./gradlew build
```

### 프론트엔드 개발 (frontend/)
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# E2E 테스트
npm run test:e2e

# 린트 검사
npm run lint
```

---

## 아키텍처 개요

### 백엔드 레이어드 아키텍처

```
backend/src/main/java/io/realworld/
├── api/                     # Presentation Layer
│   ├── controller/          # REST 컨트롤러 (@RestController)
│   ├── dto/                 # 요청/응답 DTO
│   └── exception/           # 글로벌 예외 핸들러
├── domain/                  # Domain Layer
│   ├── user/
│   │   ├── User.java        # Entity (@Entity)
│   │   ├── UserRepository.java  # Repository (@Repository)
│   │   └── UserService.java     # Service (@Service)
│   ├── article/
│   │   ├── Article.java
│   │   ├── ArticleRepository.java
│   │   └── ArticleService.java
│   └── ...
├── security/                # Infrastructure Layer
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── SecurityConfig.java
└── config/                  # Configuration
    ├── WebConfig.java
    └── OpenApiConfig.java
```

**레이어별 책임:**
- **Controller**: HTTP 요청/응답 처리, 입력 검증
- **Service**: 비즈니스 로직, 트랜잭션 관리
- **Repository**: 데이터베이스 접근 (Spring Data JPA)
- **Entity**: 도메인 모델 (테이블 매핑)
- **DTO**: 계층 간 데이터 전송

### 프론트엔드 컴포넌트 구조

```
frontend/src/
├── components/              # 재사용 가능한 컴포넌트
│   ├── common/              # 공통 UI 컴포넌트
│   ├── article/             # 아티클 관련 컴포넌트
│   └── comment/             # 댓글 관련 컴포넌트
├── pages/                   # 페이지 컴포넌트
├── api/                     # API 클라이언트 (Axios)
├── hooks/                   # 커스텀 훅 (React Query 훅)
├── context/                 # Context API (인증 상태 등)
├── types/                   # TypeScript 타입 정의
└── utils/                   # 유틸리티 함수
```

**상태 관리 전략:**
- 로컬 상태: useState (컴포넌트 내부)
- 전역 상태: Context API (인증 정보)
- 서버 상태: TanStack Query (API 데이터, 캐싱)

### 인증 흐름 (JWT)

1. 사용자가 이메일/비밀번호로 로그인 (`POST /api/users/login`)
2. 백엔드가 비밀번호 검증 (BCrypt) 후 JWT 토큰 발급
3. 프론트엔드가 LocalStorage에 토큰 저장
4. 이후 모든 API 요청에 `Authorization: Token {jwt-token}` 헤더 추가
5. 백엔드의 JwtAuthenticationFilter가 토큰 검증 및 SecurityContext 설정

---

## 데이터베이스 스키마

### 주요 테이블
- **users**: 사용자 정보 (id, username, email, password, bio, image)
- **articles**: 아티클 (id, slug, title, description, body, author_id)
- **comments**: 댓글 (id, body, article_id, author_id)
- **tags**: 태그 (id, name)
- **article_tags**: 아티클-태그 관계 (article_id, tag_id)
- **favorites**: 아티클 좋아요 (user_id, article_id)
- **follows**: 사용자 팔로우 (follower_id, following_id)

### 관계
- User → Article: 1:N (한 사용자는 여러 아티클 작성)
- User → Comment: 1:N (한 사용자는 여러 댓글 작성)
- Article → Comment: 1:N (한 아티클에 여러 댓글)
- Article ↔ Tag: N:M (다대다)
- User ↔ Article (Favorite): N:M (다대다)
- User ↔ User (Follow): N:M (자기참조 다대다)

상세 스키마는 `docs/design.md` 참조

---

## API 엔드포인트

### 인증
- `POST /api/users/login` - 로그인
- `POST /api/users` - 회원가입
- `GET /api/user` - 현재 사용자 조회 (인증 필요)
- `PUT /api/user` - 사용자 정보 수정 (인증 필요)

### 프로필
- `GET /api/profiles/:username` - 프로필 조회
- `POST /api/profiles/:username/follow` - 팔로우 (인증 필요)
- `DELETE /api/profiles/:username/follow` - 언팔로우 (인증 필요)

### 아티클
- `GET /api/articles` - 아티클 목록 (필터링: tag, author, favorited)
- `GET /api/articles/feed` - 팔로우 피드 (인증 필요)
- `GET /api/articles/:slug` - 아티클 상세
- `POST /api/articles` - 아티클 작성 (인증 필요)
- `PUT /api/articles/:slug` - 아티클 수정 (작성자만)
- `DELETE /api/articles/:slug` - 아티클 삭제 (작성자만)

### 댓글
- `GET /api/articles/:slug/comments` - 댓글 목록
- `POST /api/articles/:slug/comments` - 댓글 작성 (인증 필요)
- `DELETE /api/articles/:slug/comments/:id` - 댓글 삭제 (작성자만)

### 좋아요/태그
- `POST /api/articles/:slug/favorite` - 좋아요 (인증 필요)
- `DELETE /api/articles/:slug/favorite` - 좋아요 취소 (인증 필요)
- `GET /api/tags` - 태그 목록

완전한 API 스펙: https://realworld-docs.netlify.app/specifications/backend/endpoints/

---

## 작업 방식

### 개발 원칙

#### TDD (Test-Driven Development)
**백엔드와 코어 로직 구현 시 반드시 TDD 방식으로 개발합니다.**

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 개선 및 리팩토링

**적용 범위:**
- 도메인 로직 (Service Layer)
- 비즈니스 규칙 검증
- Repository 쿼리 로직
- 유틸리티 함수

**예시 워크플로우:**
```java
// 1. 테스트 먼저 작성 (Red)
@Test
void 사용자_생성_시_비밀번호가_암호화되어야_한다() {
    // given
    UserCreateRequest request = new UserCreateRequest("user@example.com", "password123");

    // when
    User user = userService.createUser(request);

    // then
    assertThat(user.getPassword()).isNotEqualTo("password123");
    assertThat(passwordEncoder.matches("password123", user.getPassword())).isTrue();
}

// 2. 테스트를 통과하는 구현 (Green)
public User createUser(UserCreateRequest request) {
    String encodedPassword = passwordEncoder.encode(request.getPassword());
    User user = new User(request.getEmail(), encodedPassword);
    return userRepository.save(user);
}

// 3. 리팩토링 (Refactor)
```

#### SOLID 원칙
**모든 백엔드 코드는 SOLID 원칙을 준수합니다.**

1. **SRP (Single Responsibility Principle)**: 단일 책임 원칙
   - 각 클래스는 하나의 책임만 가짐
   - Service는 비즈니스 로직만, Repository는 데이터 접근만

2. **OCP (Open-Closed Principle)**: 개방-폐쇄 원칙
   - 확장에는 열려있고 수정에는 닫혀있음
   - 인터페이스와 추상화 활용

3. **LSP (Liskov Substitution Principle)**: 리스코프 치환 원칙
   - 하위 타입은 상위 타입을 대체 가능

4. **ISP (Interface Segregation Principle)**: 인터페이스 분리 원칙
   - 클라이언트가 사용하지 않는 인터페이스에 의존하지 않음

5. **DIP (Dependency Inversion Principle)**: 의존성 역전 원칙
   - 구체화가 아닌 추상화에 의존
   - 의존성 주입(DI) 활용

#### Clean Architecture
**레이어 간 의존성 방향을 명확히 하고 도메인 중심 설계를 따릅니다.**

```
의존성 방향: Presentation → Application → Domain ← Infrastructure
```

**핵심 규칙:**
- **Domain Layer**: 외부 의존성 없음 (순수 비즈니스 로직)
- **Application Layer**: Domain을 조합하여 Use Case 구현
- **Infrastructure Layer**: 외부 시스템과의 통신 (DB, 외부 API)
- **Presentation Layer**: HTTP 요청/응답 처리

**예시:**
```java
// ❌ 잘못된 예: Service가 Controller에 의존
public class ArticleService {
    public ArticleResponse getArticle(HttpServletRequest request) { ... }
}

// ✅ 올바른 예: 도메인 중심 설계
public class ArticleService {
    public Article getArticle(String slug, Long currentUserId) { ... }
}
```

### 커밋 및 이슈 관리

#### 커밋 규칙
- 관련 이슈가 있으면 이슈 번호를 커밋 메시지에 포함 (예: `사용자 인증 기능 구현 (#5)`)
- 관련 이슈가 없으면 새로 생성 후 번호 포함
- 변경사항이 많으면 연관된 항목끼리 묶어서 순차적으로 커밋
- **각 커밋은 빌드 가능하고 테스트가 통과하는 상태여야 함**

#### 작업 완료 확인 프로세스
**모든 커밋 시점마다 다음을 확인하고 관련 이슈에 커멘트를 남깁니다.**

1. **커밋 전 체크리스트**
   - [ ] 모든 테스트 통과 (`./gradlew test` 또는 `npm test`)
   - [ ] 빌드 성공 (`./gradlew build` 또는 `npm run build`)
   - [ ] Lint 검사 통과
   - [ ] 코드 리뷰 자가 점검 (SOLID 원칙, Clean Architecture 준수)

2. **이슈 커멘트 작성**
   - 커밋 후 해당 이슈에 작업 완료 내용을 커멘트로 기록
   - 인수 조건(Acceptance Criteria) 달성 여부 명시

**커멘트 템플릿:**
```markdown
## 작업 완료: [작업 내용 요약]

### 커밋 정보
- 커밋 해시: `abc1234`
- 커밋 메시지: 사용자 인증 기능 구현 (#5)

### 구현 내용
- [x] User 엔티티 생성
- [x] UserRepository 작성
- [x] UserService TDD로 구현
- [x] 비밀번호 암호화 로직 추가

### 테스트 결과
- 단위 테스트: ✅ 통과 (15개)
- 통합 테스트: ✅ 통과 (3개)
- 빌드: ✅ 성공

### 인수 조건 확인
- [x] 사용자 생성 시 비밀번호가 암호화됨
- [x] 중복 이메일 검증
- [x] 유효성 검증 (이메일 형식, 비밀번호 최소 길이)

### 다음 작업
- JWT 토큰 생성 로직 구현
```
### Husky를 사용한 Git Hook 설정
##### 프로젝트의 코드 품질을 유지하기 위해 Husky를 사용하여 pre-commit 시점에 lint, build, test를 자동 실행합니다.




3. **작업 완료 시 이슈 업데이트**
   - 체크박스 업데이트
   - 진행 상황 코멘트 추가
   - 모든 인수 조건 달성 시 이슈 닫기

### 문서화
- README, 기술 문서, 설계 문서 모두 한글로 작성
- 명확하고 이해하기 쉬운 설명 제공
- 코드 주석은 "왜(Why)"를 설명 ("무엇(What)"은 코드로 표현)

### 구현 우선순위
상세한 작업 목록은 `docs/tasks.md` 참조

**Phase 1: 핵심 기능**
1. 프로젝트 초기 설정 및 데이터베이스 스키마
2. 백엔드 JWT 인증 시스템
3. 아티클 CRUD API
4. 프론트엔드 라우팅 및 레이아웃
5. 로그인/회원가입 페이지
6. 홈 페이지 (아티클 목록)
7. 아티클 상세/작성/수정 페이지

**Phase 2: 소셜 기능**
1. 댓글 기능
2. 아티클 좋아요
3. 사용자 팔로우
4. 개인화된 피드
5. 프로필 페이지

**Phase 3: 고급 기능 및 최적화**
1. 페이지네이션 개선
2. 태그 시스템
3. 검색/필터링 최적화
4. 성능 최적화
5. 보안 강화

---

## 참고 문서

- **프로젝트 설계**: `docs/design.md` - 전체 시스템 아키텍처, ERD, API 설계
- **작업 목록**: `docs/tasks.md` - 단계별 구현 체크리스트
- **제품 요구사항**: `docs/RealWorld-PRD.md` - 상세 기능 명세
- **RealWorld 공식 문서**: https://realworld-docs.netlify.app/
- **라이브 데모**: https://demo.realworld.io

---

**이 규칙은 모든 작업에서 최우선으로 준수되어야 합니다.**
