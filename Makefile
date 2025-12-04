.PHONY: help build up down restart logs logs-backend logs-frontend ps clean
.PHONY: dev dev-down dev-logs dev-restart
.PHONY: test shell-backend shell-frontend

# 기본 타겟
.DEFAULT_GOAL := help

# ====================
# 도움말
# ====================
help: ## 사용 가능한 명령어 목록 표시
	@echo "RealWorld Docker 명령어:"
	@echo ""
	@echo "프로덕션 환경:"
	@echo "  make build         - Docker 이미지 빌드"
	@echo "  make up            - 컨테이너 시작 (백그라운드)"
	@echo "  make down          - 컨테이너 정지 및 삭제"
	@echo "  make restart       - 컨테이너 재시작"
	@echo "  make logs          - 모든 서비스 로그 출력"
	@echo "  make logs-backend  - 백엔드 로그만 출력"
	@echo "  make logs-frontend - 프론트엔드 로그만 출력"
	@echo ""
	@echo "개발 환경:"
	@echo "  make dev           - 개발 환경 시작 (Hot Reload)"
	@echo "  make dev-down      - 개발 환경 정지"
	@echo "  make dev-logs      - 개발 환경 로그"
	@echo "  make dev-restart   - 개발 환경 재시작"
	@echo ""
	@echo "유틸리티:"
	@echo "  make ps            - 실행 중인 컨테이너 상태"
	@echo "  make test          - 테스트 실행"
	@echo "  make shell-backend - 백엔드 컨테이너 셸 접속"
	@echo "  make shell-frontend- 프론트엔드 컨테이너 셸 접속"
	@echo "  make clean         - 모든 컨테이너/볼륨/이미지 삭제"

# ====================
# 프로덕션 환경
# ====================
build: ## Docker 이미지 빌드
	docker-compose build

up: ## 컨테이너 시작 (백그라운드)
	docker-compose up -d

down: ## 컨테이너 정지 및 삭제
	docker-compose down

restart: ## 컨테이너 재시작
	docker-compose restart

logs: ## 모든 서비스 로그 출력
	docker-compose logs -f

logs-backend: ## 백엔드 로그만 출력
	docker-compose logs -f backend

logs-frontend: ## 프론트엔드 로그만 출력
	docker-compose logs -f frontend

ps: ## 실행 중인 컨테이너 상태
	docker-compose ps

# ====================
# 개발 환경
# ====================
dev: ## 개발 환경 시작 (Hot Reload)
	docker-compose -f docker-compose.dev.yml up

dev-down: ## 개발 환경 정지
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## 개발 환경 로그
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart: ## 개발 환경 재시작
	docker-compose -f docker-compose.dev.yml restart

# ====================
# 유틸리티
# ====================
test: ## 테스트 실행
	@echo "백엔드 테스트 실행..."
	cd backend && ./gradlew test
	@echo "프론트엔드 테스트 실행..."
	cd frontend && npm run test

shell-backend: ## 백엔드 컨테이너 셸 접속
	docker-compose exec backend sh

shell-frontend: ## 프론트엔드 컨테이너 셸 접속
	docker-compose exec frontend sh

clean: ## 모든 컨테이너/볼륨/이미지 삭제
	@echo "경고: 모든 Docker 리소스를 삭제합니다."
	@read -p "계속하시겠습니까? (y/N) " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose down -v; \
		docker-compose -f docker-compose.dev.yml down -v; \
		docker system prune -af --volumes; \
	else \
		echo "취소되었습니다."; \
	fi
