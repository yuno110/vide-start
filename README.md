# RealWorld 앱 - Vibe 코딩 스타터킷

> **"실제 세계의 애플리케이션을 만들어보세요"**
>
> Medium.com을 모델로 한 풀스택 소셜 블로깅 플랫폼 구현 프로젝트

[![RealWorld](https://img.shields.io/badge/RealWorld-Project-green.svg)](https://realworld.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 프로젝트 소개

이 프로젝트는 [RealWorld](https://github.com/gothinkster/realworld) 사양을 따라 **바이브(Vibe) 코딩 기법**과 **현대적인 기술 스택**을 활용하여 실제 프로덕션 수준의 소셜 블로깅 플랫폼을 구현하는 것을 목표로 합니다.

### 🎯 프로젝트 목적

1. **바이브 코딩 기법 학습 및 실습**
   - AI 기반 개발 도구를 활용한 생산적인 코딩 경험
   - 반복적이고 점진적인 개발 프로세스
   - 실시간 피드백을 통한 빠른 개발 사이클

2. **현대적 기술 스택 마스터하기**
   - 실무에서 널리 사용되는 검증된 기술 조합
   - 타입 안정성과 개발 경험을 우선시하는 도구 선택
   - 확장 가능하고 유지보수하기 쉬운 아키텍처

3. **실제 애플리케이션 개발 경험**
   - 단순한 "투두 앱"을 넘어선 실제 프로덕션 수준의 앱 구축
   - CRUD, 인증, 라우팅, 페이지네이션 등 실무 필수 기능 구현
   - 프론트엔드와 백엔드의 완전한 분리 및 모듈화

---

## 🌍 RealWorld 앱이란?

**RealWorld**는 다양한 프레임워크와 기술 스택으로 동일한 애플리케이션을 구현하는 오픈소스 프로젝트입니다.

### 핵심 개념

- **통일된 사양**: 모든 구현체가 동일한 API 스펙을 준수
- **실제 사용 가능한 기능**: Medium.com 스타일의 소셜 블로깅 플랫폼
- **상호 운용성**: 어떤 프론트엔드든 어떤 백엔드와도 연동 가능
- **학습 목적**: 프레임워크의 베스트 프랙티스를 학습할 수 있는 표준 예제

### 주요 기능

- ✍️ 아티클 작성, 수정, 삭제 (CRUD)
- 👤 사용자 인증 및 프로필 관리 (JWT 기반)
- 💬 댓글 시스템
- ❤️ 아티클 좋아요 (Favorite)
- 👥 사용자 팔로우/언팔로우
- 📰 개인화된 피드
- 🏷️ 태그 기반 필터링
- 📄 페이지네이션

### 공식 자료

- 🌐 [RealWorld 공식 사이트](https://realworld.io)
- 📚 [RealWorld 문서](https://realworld-docs.netlify.app/)
- 💻 [GitHub 저장소](https://github.com/gothinkster/realworld)
- 🎨 [라이브 데모](https://demo.realworld.io)

---

## 🛠️ 기술 스택

이 프로젝트는 타입 안정성, 개발 경험(DX), 그리고 생산성을 중심으로 선택된 현대적인 기술 스택을 사용합니다.

### 백엔드

- **언어**: Java 17+ (또는 Kotlin)
- **프레임워크**: Spring Boot 3.x
- **보안**: Spring Security + JWT
- **데이터 접근**: Spring Data JPA
- **데이터베이스**: PostgreSQL 14+
- **마이그레이션**: Flyway
- **빌드 도구**: Gradle
- **문서화**: SpringDoc OpenAPI (Swagger)

### 프론트엔드

- **언어**: TypeScript
- **프레임워크**: React 18+
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **상태 관리**: TanStack Query (React Query)
- **라우팅**: React Router v6
- **HTTP 클라이언트**: Axios
- **폼 관리**: React Hook Form
- **마크다운**: React Markdown

### 인프라 & 도구

- **컨테이너화**: Docker & Docker Compose
- **데이터베이스**: PostgreSQL
- **웹서버**: Nginx (프론트엔드 서빙)
- **개발 도구**: ESLint, Prettier

---

## 🚀 시작하기

### 사전 요구사항

- **Docker** 및 **Docker Compose** 설치
- **Git** 설치
- (선택) **Node.js** 18+ (로컬 프론트엔드 개발)
- (선택) **Java 17+** 및 **Gradle** (로컬 백엔드 개발)

### 빠른 시작

```bash
# 저장소 클론
git clone https://github.com/yuno110/vide-start.git
cd vide-start

# Docker Compose로 전체 스택 실행
docker-compose up -d

# 애플리케이션 접속
# 프론트엔드: http://localhost:3000
# 백엔드 API: http://localhost:8080/api
# API 문서: http://localhost:8080/swagger-ui.html
```

### 로컬 개발 환경 설정

#### 백엔드 개발

```bash
cd backend

# PostgreSQL 실행 (Docker)
docker-compose up -d db

# 애플리케이션 실행
./gradlew bootRun

# 테스트 실행
./gradlew test
```

#### 프론트엔드 개발

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm test
```

---

## 📁 프로젝트 구조

```
vide-start/
├── backend/              # Spring Boot 백엔드 애플리케이션
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/     # Java 소스 코드
│   │   │   └── resources/ # 설정 파일 및 마이그레이션
│   │   └── test/         # 백엔드 테스트
│   ├── build.gradle      # Gradle 빌드 설정
│   └── Dockerfile
│
├── frontend/             # React 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── api/          # API 클라이언트
│   │   ├── hooks/        # 커스텀 훅
│   │   └── App.tsx       # 앱 진입점
│   ├── package.json
│   └── Dockerfile
│
├── docs/                 # 프로젝트 문서
│   ├── RealWorld-PRD.md  # 제품 요구사항 정의서
│   └── tasks.md          # 상세 작업 목록
│
├── docker/               # Docker 관련 파일
│
├── docker-compose.yml    # Docker Compose 설정
├── Makefile              # 공통 명령어 단축키
├── CLAUDE.md             # Claude Code 작업 규칙
└── README.md             # 이 파일
```

---

## 📚 문서

- **[제품 요구사항 정의서 (PRD)](docs/RealWorld-PRD.md)** - 상세 기능 명세 및 요구사항
- **[작업 목록 (Tasks)](docs/tasks.md)** - 단계별 구현 작업 목록 및 체크리스트
- **[RealWorld 공식 문서](https://realworld-docs.netlify.app/)** - API 스펙 및 구현 가이드
- **[API 문서](http://localhost:8080/swagger-ui.html)** - OpenAPI 기반 API 문서 (서버 실행 후)

---

## 🗺️ 구현 로드맵

### Phase 1: 핵심 기능 ✅
- [ ] 프로젝트 초기 설정
- [ ] 데이터베이스 스키마 설계
- [ ] 사용자 인증 (JWT)
- [ ] 아티클 CRUD
- [ ] 기본 페이지 구조

### Phase 2: 소셜 기능 🚧
- [ ] 댓글 시스템
- [ ] 아티클 좋아요
- [ ] 사용자 팔로우
- [ ] 개인화된 피드

### Phase 3: 고급 기능 📅
- [ ] 페이지네이션 및 필터링
- [ ] 태그 시스템
- [ ] 프로필 페이지
- [ ] 검색 기능

### Phase 4: 최적화 및 배포 📅
- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 테스트 작성
- [ ] 프로덕션 배포

자세한 작업 목록은 **[docs/tasks.md](docs/tasks.md)**를 참조하세요.

---

## 🧪 테스트

### 백엔드 테스트

```bash
cd backend

# 전체 테스트 실행
./gradlew test

# 특정 테스트 클래스 실행
./gradlew test --tests UserServiceTest

# 통합 테스트 실행
./gradlew integrationTest
```

### 프론트엔드 테스트

```bash
cd frontend

# 단위 테스트
npm test

# E2E 테스트
npm run test:e2e

# 커버리지 확인
npm run test:coverage
```

---

## 🤝 기여 방법

이 프로젝트는 학습 목적으로 만들어졌습니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🙏 감사의 말

- [RealWorld](https://github.com/gothinkster/realworld) - 표준화된 풀스택 앱 사양 제공
- [Armin Ronacher](https://lucumr.pocoo.org/) - 현대적인 웹 개발 철학과 기술 스택 인사이트
- [Vibe Coding](https://claude.com/claude-code) - AI 기반 생산적 코딩 경험

---

## 📞 연락처

프로젝트 링크: [https://github.com/yuno110/vide-start](https://github.com/yuno110/vide-start)

---

**Happy Coding! 🚀**
