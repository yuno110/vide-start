import { test, expect } from '@playwright/test';

test.describe('인증 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 전 로컬스토리지 클리어
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('회원가입 → 로그인 플로우', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // Sign up 링크 클릭
    await page.getByRole('link', { name: 'Sign up' }).click();

    // 회원가입 페이지인지 확인
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

    // 회원가입 폼 입력
    const timestamp = Date.now();
    await page.getByPlaceholder(/username/i).fill(`testuser${timestamp}`);
    await page.getByPlaceholder(/email/i).fill(`test${timestamp}@example.com`);
    await page.getByPlaceholder(/password/i).fill('testpassword123');

    // 회원가입 버튼 클릭
    await page.getByRole('button', { name: /sign up/i }).click();

    // 회원가입 성공 후 홈으로 리다이렉트되는지 확인 (실제 백엔드 연결 시)
    // await expect(page).toHaveURL('/');

    // 로그인된 상태의 헤더 확인 (실제 백엔드 연결 시)
    // await expect(page.getByText('New Article')).toBeVisible();
  });

  test('로그인 플로우', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // Sign in 링크 클릭
    await page.getByRole('link', { name: 'Sign in' }).click();

    // 로그인 페이지인지 확인
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    // 로그인 폼 입력
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('testpassword123');

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: /sign in/i }).click();

    // 로그인 성공 후 홈으로 리다이렉트되는지 확인 (실제 백엔드 연결 시)
    // await expect(page).toHaveURL('/');

    // 로그인된 상태의 헤더 확인 (실제 백엔드 연결 시)
    // await expect(page.getByText('New Article')).toBeVisible();
  });

  test('로그아웃 플로우', async ({ page }) => {
    // 로그인된 상태로 시작 (localStorage에 토큰 설정)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('username', 'testuser');
    });

    // 페이지 새로고침하여 로그인 상태 반영
    await page.reload();

    // 로그인된 상태 확인
    await expect(page.getByText('Logout')).toBeVisible();

    // 로그아웃 버튼 클릭
    await page.getByRole('button', { name: 'Logout' }).click();

    // 홈으로 리다이렉트되는지 확인
    await expect(page).toHaveURL('/');

    // 로그아웃된 상태의 헤더 확인
    await expect(page.getByText('Sign in')).toBeVisible();
    await expect(page.getByText('Sign up')).toBeVisible();
  });
});
