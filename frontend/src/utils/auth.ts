// JWT 토큰 저장
export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

// JWT 토큰 조회
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// JWT 토큰 삭제
export function removeToken(): void {
  localStorage.removeItem('token');
}

// 로그인 여부 확인
export function isAuthenticated(): boolean {
  return !!getToken();
}
