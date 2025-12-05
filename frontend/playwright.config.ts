import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // 각 테스트의 최대 실행 시간
  timeout: 30 * 1000,

  // 각 테스트를 병렬로 실행
  fullyParallel: true,

  // CI 환경에서 실패 시 재시도 안 함
  forbidOnly: !!process.env.CI,

  // CI 환경에서만 재시도
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행할 워커 수
  workers: process.env.CI ? 1 : undefined,

  // 테스트 리포터
  reporter: 'html',

  // 모든 테스트에 적용되는 설정
  use: {
    // 각 액션의 최대 실행 시간
    actionTimeout: 0,

    // 베이스 URL
    baseURL: 'http://localhost:5173',

    // 실패 시 스크린샷 촬영
    screenshot: 'only-on-failure',

    // 실패 시 비디오 녹화
    video: 'retain-on-failure',

    // 트레이스 수집 (디버깅용)
    trace: 'on-first-retry',
  },

  // 테스트할 브라우저 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 필요시 다른 브라우저도 추가 가능
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // 개발 서버 설정 (테스트 실행 전 자동으로 시작)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
