import { test, expect } from '@playwright/test';

test.describe('네비게이션', () => {
  test('홈페이지가 로드됨', async ({ page }) => {
    await page.goto('/');

    // 헤더가 표시되는지 확인
    await expect(page.getByText('conduit')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('비로그인 상태에서 올바른 메뉴가 표시됨', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // 비로그인 메뉴 확인
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();

    // 로그인 메뉴가 표시되지 않는지 확인
    await expect(page.getByText('New Article')).not.toBeVisible();
    await expect(page.getByText('Settings')).not.toBeVisible();
  });

  test('로그인 상태에서 올바른 메뉴가 표시됨', async ({ page }) => {
    // 로그인 상태 설정
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('username', 'testuser');
    });
    await page.reload();

    // 로그인 메뉴 확인
    await expect(page.getByText('New Article')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();

    // 비로그인 메뉴가 표시되지 않는지 확인
    await expect(page.getByRole('link', { name: 'Sign in' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).not.toBeVisible();
  });

  test('로고 클릭 시 홈으로 이동', async ({ page }) => {
    await page.goto('/login');

    // 로고 클릭
    await page.getByText('conduit').click();

    // 홈으로 이동했는지 확인
    await expect(page).toHaveURL('/');
  });

  test('Home 링크 클릭 시 홈으로 이동', async ({ page }) => {
    await page.goto('/login');

    // Home 링크 클릭
    await page.getByRole('link', { name: 'Home' }).click();

    // 홈으로 이동했는지 확인
    await expect(page).toHaveURL('/');
  });
});
