# CLAUDE.md

Claude Code 작업 가이드

---

## 🚨 필수 규칙

### 언어 사용
**모든 커뮤니케이션과 문서화는 반드시 한글을 사용합니다.**

- ✅ 사용자 대화, 커밋 메시지, 이슈, PR, 코드 주석, 문서: 한글
- ✅ 변수명/함수명/클래스명: 영어
- ✅ 기술 용어: 원어 그대로 사용 가능

---

## 프로젝트 개요

**RealWorld 앱**: Medium.com 클론 - 풀스택 소셜 블로깅 플랫폼

### 기술 스택

**백엔드**
- Java 17 + Spring Boot 3.x + Gradle
- Spring Security + JWT
- Spring Data JPA + SQLite
- Flyway Migration

**프론트엔드**
- TypeScript + React 18 + Vite
- TanStack Query + React Router
- Tailwind CSS

**인프라**
- Docker + Docker Compose

### 아키텍처

**백엔드 (레이어드 아키텍처)**
```
api/         - Controller, DTO, Exception Handler
domain/      - Entity, Repository, Service
security/    - JWT, Security Config
config/      - Application Configuration
```

**프론트엔드**
```
components/  - 재사용 컴포넌트
pages/       - 페이지 컴포넌트
api/         - API 클라이언트
hooks/       - React Query 훅
```

**참고**: 상세 아키텍처는 `docs/design.md` 참조

---

## 개발 원칙

### TDD (Test-Driven Development)
백엔드 코어 로직은 TDD로 개발:
1. Red: 실패하는 테스트 작성
2. Green: 테스트 통과하는 최소 코드
3. Refactor: 코드 개선

**적용 범위**: Service Layer, Repository 쿼리, 비즈니스 규칙

### SOLID 원칙
- **SRP**: 각 클래스는 하나의 책임만
- **OCP**: 확장에 열려있고 수정에 닫혀있음
- **DIP**: 추상화에 의존, 의존성 주입 활용

### Clean Architecture
```
의존성 방향: Presentation → Application → Domain ← Infrastructure
```

---

## 작업 완료 기준 및 검증 프로세스

### ⚠️ 중요: 작업 완료 전 필수 체크리스트

**모든 이슈는 다음 순서로 진행되어야 합니다:**

1. **작업 시작 전**
   - [ ] 이슈의 인수 조건(AC)을 꼼꼼히 읽기
   - [ ] AC를 기반으로 검증 가능한 체크리스트 작성
   - [ ] 어떻게 테스트할지 계획 수립

2. **구현 중**
   - [ ] 코드 작성
   - [ ] 단위 기능별로 동작 확인

3. **구현 완료 후 - 필수 검증 단계**

   **백엔드:**
   - [ ] 테스트 작성 및 실행 (`./gradlew test`)
   - [ ] 빌드 성공 확인 (`./gradlew build`)
   - [ ] Checkstyle 통과 확인
   - [ ] API 엔드포인트 실제 호출 테스트 (Postman/curl)
   - [ ] 각 인수 조건(AC) 하나씩 검증

   **프론트엔드:**
   - [ ] TypeScript 컴파일 성공 (`npm run build`)
   - [ ] ESLint 통과 (`npm run lint`)
   - [ ] **개발 서버 실행 (`npm run dev`)**
   - [ ] **브라우저에서 실제 동작 확인**
   - [ ] 각 인수 조건(AC) 하나씩 브라우저에서 검증
   - [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)

4. **모든 AC 통과 확인 후**
   - [ ] 이슈 체크박스 체크
   - [ ] 사용자에게 테스트 방법과 함께 완료 보고

### 인수 조건(AC) 검증 방법

**잘못된 예시:**
```
❌ 컴포넌트 파일만 생성 → 빌드 성공 → 완료 처리
❌ API 엔드포인트만 구현 → 테스트 통과 → 완료 처리
```

**올바른 예시:**
```
✅ 컴포넌트 구현 → 페이지에 적용 → dev 서버 실행
   → 브라우저에서 각 AC 확인 → 완료 처리

✅ API 구현 → 테스트 작성 → 실제 HTTP 요청 테스트
   → 각 AC 확인 → 완료 처리
```

### AC 검증 예시

**이슈: "Header가 로그인 상태에 따라 다른 메뉴를 표시함"**

검증 절차:
1. `npm run dev` 실행
2. 브라우저에서 `/` 접속
3. 비로그인 상태: "Sign in", "Sign up" 메뉴 표시 확인 ✅
4. `/login`에서 로그인
5. 로그인 상태: "New Article", "Settings", "Profile", "Logout" 메뉴 표시 확인 ✅
6. 모두 확인 후 AC 체크 ✅

**중요**: 코드만 작성하고 실제 동작을 확인하지 않으면 AC를 충족한 것이 아닙니다.

---

## Git 작업 방식

### 커밋 규칙
- 이슈 번호 포함: `사용자 인증 기능 구현 (#5)`
- 각 커밋은 빌드 가능하고 테스트 통과 상태여야 함
- 변경사항이 많으면 의미 단위로 분리하여 순차 커밋
- **커밋과 푸시는 사용자가 직접 수행** (자동으로 하지 않음)

### 이슈 관리 방식

**⚠️ 중요 규칙:**
1. **절대로 이슈에 댓글(comment)을 달지 않습니다**
2. **이슈 본문(body)만 직접 수정합니다**

#### 작업 시작
1. 이슈 본문의 체크박스 확인
2. 작업 진행하면서 완료된 항목 체크

#### 작업 진행 중
```bash
# 이슈 본문 읽기
gh issue view [number] --json body -q .body

# 이슈 본문 업데이트 (체크박스 체크)
gh issue edit [number] --body "$(cat updated-issue.md)"
```

#### 작업 완료 시
1. 모든 체크박스를 체크하여 이슈 본문 업데이트
2. 사용자가 직접 커밋 및 푸시 수행

**주의**: 작업이 완료되어도 사용자가 커밋하기 전까지는 이슈를 닫지 않습니다.

### Git Hook (Husky)
Pre-commit 시점에 자동 실행:
- Frontend: ESLint, TypeScript 체크, Build, Test
- Backend: Checkstyle, Build, Test

---

## 작업 우선순위

**Phase 1: 핵심 기능**
1. 프로젝트 초기 설정 및 DB 스키마
2. JWT 인증 시스템
3. 아티클 CRUD API
4. 프론트엔드 라우팅 및 기본 페이지

**Phase 2: 소셜 기능**
- 댓글, 좋아요, 팔로우, 피드, 프로필

**Phase 3: 고급 기능**
- 페이지네이션, 태그, 검색, 성능 최적화

상세 작업 목록: `docs/tasks.md`

---
## 참고 문서

- **설계 문서**: `docs/design.md` - 아키텍처, ERD, API 설계
- **작업 목록**: `docs/tasks.md` - 단계별 체크리스트
- **요구사항**: `docs/RealWorld-PRD.md` - 기능 명세
- **공식 문서**: https://realworld-docs.netlify.app/
- **데모**: https://demo.realworld.io

---

**이 규칙은 모든 작업에서 최우선으로 준수되어야 합니다.**
