# ====================
# Docker Desktop 자동 설치 스크립트 (Windows)
# ====================
#
# 이 스크립트는 관리자 권한으로 실행되어야 합니다.
#
# 사용 방법:
# 1. PowerShell을 관리자 권한으로 실행
# 2. Set-ExecutionPolicy Bypass -Scope Process -Force
# 3. .\docker\install-docker-windows.ps1
#

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Docker Desktop 설치 스크립트" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 관리자 권한 확인
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ 오류: 이 스크립트는 관리자 권한으로 실행되어야 합니다." -ForegroundColor Red
    Write-Host ""
    Write-Host "PowerShell을 관리자 권한으로 다시 실행해주세요:" -ForegroundColor Yellow
    Write-Host "  1. 시작 메뉴에서 'PowerShell' 검색" -ForegroundColor Yellow
    Write-Host "  2. 우클릭 → '관리자 권한으로 실행'" -ForegroundColor Yellow
    Write-Host "  3. 이 스크립트를 다시 실행" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 관리자 권한 확인 완료" -ForegroundColor Green
Write-Host ""

# Step 1: WSL2 설치 확인
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Step 1: WSL2 확인 및 설치" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$wslStatus = wsl --status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "WSL이 설치되어 있지 않습니다. 설치를 시작합니다..." -ForegroundColor Yellow
    Write-Host ""

    # WSL 기능 활성화
    Write-Host "Windows 기능 활성화 중..." -ForegroundColor Yellow
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

    Write-Host ""
    Write-Host "⚠️  시스템 재부팅이 필요합니다." -ForegroundColor Yellow
    Write-Host "재부팅 후 이 스크립트를 다시 실행해주세요." -ForegroundColor Yellow
    Write-Host ""
    $reboot = Read-Host "지금 재부팅하시겠습니까? (Y/N)"
    if ($reboot -eq "Y" -or $reboot -eq "y") {
        Restart-Computer
    }
    exit 0
}

Write-Host "✅ WSL이 설치되어 있습니다." -ForegroundColor Green
Write-Host ""

# Step 2: WSL2를 기본 버전으로 설정
Write-Host "WSL2를 기본 버전으로 설정 중..." -ForegroundColor Yellow
wsl --set-default-version 2

# Step 3: Ubuntu 설치 확인
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Step 2: Ubuntu 배포판 확인" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$distributions = wsl --list --quiet 2>&1
if ($distributions.Length -eq 0 -or $distributions -match "설치된 배포가 없습니다") {
    Write-Host "Linux 배포판이 설치되어 있지 않습니다." -ForegroundColor Yellow
    Write-Host "Ubuntu를 설치합니다..." -ForegroundColor Yellow
    Write-Host ""

    wsl --install -d Ubuntu

    Write-Host ""
    Write-Host "✅ Ubuntu 설치가 완료되었습니다." -ForegroundColor Green
    Write-Host "Ubuntu를 처음 실행하면 사용자 이름과 비밀번호를 설정해야 합니다." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ Linux 배포판이 이미 설치되어 있습니다." -ForegroundColor Green
    Write-Host ""
}

# Step 4: Docker Desktop 설치
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Step 3: Docker Desktop 설치" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Docker가 이미 설치되어 있는지 확인
$dockerPath = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerPath) {
    Write-Host "✅ Docker Desktop이 이미 설치되어 있습니다." -ForegroundColor Green
    Write-Host ""
    docker --version
    Write-Host ""
} else {
    Write-Host "Docker Desktop을 설치합니다..." -ForegroundColor Yellow
    Write-Host "이 작업은 몇 분이 걸릴 수 있습니다..." -ForegroundColor Yellow
    Write-Host ""

    # winget으로 설치
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Docker Desktop 설치가 완료되었습니다." -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Docker Desktop을 시작해주세요:" -ForegroundColor Yellow
        Write-Host "  1. 시작 메뉴에서 'Docker Desktop' 실행" -ForegroundColor Yellow
        Write-Host "  2. Docker Desktop이 시작될 때까지 대기 (수 분 소요)" -ForegroundColor Yellow
        Write-Host "  3. 시스템 트레이에 Docker 아이콘이 나타나면 준비 완료" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Docker Desktop 설치에 실패했습니다." -ForegroundColor Red
        Write-Host ""
        Write-Host "수동 설치를 진행해주세요:" -ForegroundColor Yellow
        Write-Host "  1. https://docs.docker.com/desktop/install/windows-install/ 방문" -ForegroundColor Yellow
        Write-Host "  2. Docker Desktop Installer 다운로드" -ForegroundColor Yellow
        Write-Host "  3. 설치 프로그램 실행" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "설치 완료!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Green
Write-Host "  1. Docker Desktop이 실행되고 있는지 확인" -ForegroundColor White
Write-Host "  2. 프로젝트 디렉토리에서 다음 명령어 실행:" -ForegroundColor White
Write-Host ""
Write-Host "     make build    # 이미지 빌드" -ForegroundColor Yellow
Write-Host "     make up       # 컨테이너 시작" -ForegroundColor Yellow
Write-Host "     make logs     # 로그 확인" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. 브라우저에서 http://localhost:3000 접속" -ForegroundColor White
Write-Host ""
Write-Host "상세한 사용 방법은 docker/README.md를 참조하세요." -ForegroundColor Cyan
Write-Host ""
