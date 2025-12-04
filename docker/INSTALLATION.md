# Docker 설치 가이드

RealWorld 애플리케이션을 실행하기 위한 Docker Desktop 설치 방법을 안내합니다.

## 목차

- [자동 설치 (Windows)](#자동-설치-windows)
- [수동 설치](#수동-설치)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux](#linux)
- [설치 확인](#설치-확인)
- [문제 해결](#문제-해결)

---

## 자동 설치 (Windows)

### 방법 1: PowerShell 스크립트 실행

1. **PowerShell을 관리자 권한으로 실행:**
   - 시작 메뉴에서 "PowerShell" 검색
   - 우클릭 → "관리자 권한으로 실행"

2. **실행 정책 변경:**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   ```

3. **프로젝트 디렉토리로 이동:**
   ```powershell
   cd C:\work\vibe\vide-start
   ```

4. **설치 스크립트 실행:**
   ```powershell
   .\docker\install-docker-windows.ps1
   ```

5. **스크립트가 안내하는 대로 진행**

**참고:**
- WSL2 설치 시 시스템 재부팅이 필요할 수 있습니다.
- 재부팅 후 스크립트를 다시 실행하세요.

---

## 수동 설치

### Windows

#### 사전 요구사항

- Windows 10 버전 2004 이상 또는 Windows 11
- 64비트 프로세서
- 4GB 이상의 RAM
- BIOS에서 가상화 활성화 (Intel VT-x 또는 AMD-V)

#### Step 1: WSL2 설치

1. **PowerShell을 관리자 권한으로 실행**

2. **WSL 설치:**
   ```powershell
   wsl --install
   ```

3. **시스템 재부팅**

4. **재부팅 후 WSL2를 기본 버전으로 설정:**
   ```powershell
   wsl --set-default-version 2
   ```

5. **Ubuntu 설치 (선택):**
   ```powershell
   wsl --install -d Ubuntu
   ```

   또는 Microsoft Store에서 "Ubuntu" 검색 후 설치

#### Step 2: Docker Desktop 설치

1. **Docker Desktop 다운로드:**
   - [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)
   - "Docker Desktop for Windows" 다운로드

2. **설치 프로그램 실행:**
   - `Docker Desktop Installer.exe` 실행
   - "Use WSL 2 instead of Hyper-V" 옵션 선택
   - 설치 완료 후 재부팅 (필요 시)

3. **Docker Desktop 시작:**
   - 시작 메뉴에서 "Docker Desktop" 실행
   - 초기 설정 완료 (몇 분 소요)
   - 시스템 트레이에 Docker 아이콘 표시 확인

#### Step 3: 설치 확인

```powershell
docker --version
docker-compose --version
```

**예상 출력:**
```
Docker version 24.x.x, build xxxxxxx
Docker Compose version v2.x.x
```

---

### macOS

#### 사전 요구사항

- macOS 11 (Big Sur) 이상
- 4GB 이상의 RAM

#### Apple Silicon (M1/M2/M3) Mac

1. **Docker Desktop 다운로드:**
   - [https://docs.docker.com/desktop/install/mac-install/](https://docs.docker.com/desktop/install/mac-install/)
   - "Docker Desktop for Mac with Apple silicon" 다운로드

2. **설치:**
   ```bash
   # DMG 파일을 열고 Docker를 Applications 폴더로 드래그
   open Docker.dmg
   ```

3. **Docker Desktop 실행:**
   - Applications 폴더에서 Docker 실행
   - "Open" 클릭하여 보안 경고 승인

#### Intel Mac

1. **Docker Desktop 다운로드:**
   - "Docker Desktop for Mac with Intel chip" 다운로드

2. **나머지는 Apple Silicon과 동일**

#### Homebrew를 통한 설치

```bash
brew install --cask docker
```

#### 설치 확인

```bash
docker --version
docker-compose --version
```

---

### Linux

#### Ubuntu/Debian

1. **기존 Docker 제거 (있는 경우):**
   ```bash
   sudo apt-get remove docker docker-engine docker.io containerd runc
   ```

2. **Docker 저장소 설정:**
   ```bash
   # 패키지 업데이트
   sudo apt-get update

   # 필요한 패키지 설치
   sudo apt-get install -y \
       ca-certificates \
       curl \
       gnupg \
       lsb-release

   # Docker GPG 키 추가
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
       sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

   # Docker 저장소 추가
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
     https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

3. **Docker Engine 설치:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
       docker-buildx-plugin docker-compose-plugin
   ```

4. **Docker 서비스 시작:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

5. **사용자를 docker 그룹에 추가 (sudo 없이 실행):**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

#### CentOS/RHEL/Fedora

1. **Docker 저장소 설정:**
   ```bash
   sudo yum install -y yum-utils
   sudo yum-config-manager --add-repo \
       https://download.docker.com/linux/centos/docker-ce.repo
   ```

2. **Docker Engine 설치:**
   ```bash
   sudo yum install -y docker-ce docker-ce-cli containerd.io \
       docker-buildx-plugin docker-compose-plugin
   ```

3. **Docker 서비스 시작:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

4. **사용자를 docker 그룹에 추가:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

#### 설치 확인

```bash
docker --version
docker compose version
```

---

## 설치 확인

### 1. Docker 버전 확인

```bash
docker --version
docker-compose --version
# 또는
docker compose version
```

### 2. Hello World 실행

```bash
docker run hello-world
```

**예상 출력:**
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### 3. Docker Compose 테스트

```bash
docker compose version
```

---

## 문제 해결

### Windows

#### WSL2 설치 오류

**증상:** "WSL 2 installation is incomplete."

**해결:**
1. Windows 기능 확인:
   - 제어판 → 프로그램 → Windows 기능 켜기/끄기
   - "Linux용 Windows 하위 시스템" 체크
   - "가상 머신 플랫폼" 체크
   - 재부팅

2. WSL2 커널 업데이트:
   - [https://aka.ms/wsl2kernel](https://aka.ms/wsl2kernel) 다운로드
   - 설치 후 재부팅

#### Docker Desktop 시작 실패

**증상:** "Docker Desktop starting..." 무한 로딩

**해결:**
1. Docker Desktop 재시작:
   ```powershell
   # 작업 관리자에서 Docker Desktop 종료
   # 또는
   Stop-Process -Name "Docker Desktop" -Force
   ```

2. WSL2 재시작:
   ```powershell
   wsl --shutdown
   ```

3. Docker Desktop 다시 시작

#### Hyper-V 충돌

**증상:** "Hyper-V is not available"

**해결:**
- Docker Desktop 설정에서 "Use WSL 2 based engine" 활성화
- Hyper-V 대신 WSL2 백엔드 사용

### macOS

#### Rosetta 2 설치 (Apple Silicon)

**증상:** "Rosetta 2 is not installed"

**해결:**
```bash
softwareupdate --install-rosetta
```

#### 권한 오류

**증상:** "permission denied while trying to connect to the Docker daemon"

**해결:**
```bash
sudo chown $USER /var/run/docker.sock
```

### Linux

#### 권한 오류

**증상:** "Got permission denied while trying to connect to the Docker daemon socket"

**해결:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

로그아웃 후 다시 로그인하거나, 다음 명령어 실행:
```bash
su - $USER
```

#### Docker 서비스 미실행

**증상:** "Cannot connect to the Docker daemon"

**해결:**
```bash
sudo systemctl start docker
sudo systemctl status docker
```

---

## 다음 단계

설치가 완료되면 다음 문서를 참조하세요:

- **[docker/README.md](./README.md)** - Docker 사용 가이드
- 프로덕션 환경 실행: `make build && make up`
- 개발 환경 실행: `make dev`

---

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [WSL2 설치 가이드](https://docs.microsoft.com/windows/wsl/install)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Engine (Linux)](https://docs.docker.com/engine/install/)
