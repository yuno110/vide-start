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
- Spring Data JPA + PostgreSQL
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

## Git 작업 방식

### 커밋 규칙
- 이슈 번호 포함: `사용자 인증 기능 구현 (#5)`
- 각 커밋은 빌드 가능하고 테스트 통과 상태여야 함
- 변경사항이 많으면 의미 단위로 분리하여 순차 커밋

### 이슈 관리 방식

**⚠️ 중요: 이슈에 답글을 달지 말고, 이슈 본문을 직접 업데이트합니다.**

#### 작업 시작
1. 이슈 본문의 체크박스 확인
2. 작업 진행하면서 완료된 항목 체크

#### 작업 진행 중
```bash
# 이슈 본문 읽기
gh issue view [number] --json body -q .body

# 이슈 본문 업데이트
gh issue edit [number] --body "$(cat updated-issue.md)"
```

#### 작업 완료 시
1. 모든 체크박스 완료 확인
2. 이슈 본문 하단에 "작업 완료" 섹션 추가:
```markdown
---

## ✅ 작업 완료

**커밋**: `abc1234`
**완료 일시**: 2025-11-29

### 구현 내용
- 주요 구현 사항 요약

### 테스트 결과
- ✅ 빌드 성공
- ✅ 테스트 통과
```
3. 이슈 닫기

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
