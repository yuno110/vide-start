import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

// MSW 서버 설정
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterAll(() => {
  server.close()
})

// 각 테스트 후 자동으로 cleanup 실행 및 핸들러 리셋
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
