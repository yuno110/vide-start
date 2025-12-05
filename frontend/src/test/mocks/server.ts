import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSW 테스트 서버 설정
export const server = setupServer(...handlers);
