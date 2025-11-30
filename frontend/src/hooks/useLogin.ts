import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { setToken } from '../utils/auth';
import type { UserResponse, ErrorResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const navigate = useNavigate();

  return useMutation<UserResponse, Error, LoginCredentials>({
    mutationFn: async ({ email, password }) => {
      return await login(email, password);
    },
    onSuccess: (data) => {
      // JWT 토큰 저장
      setToken(data.user.token);

      // 사용자 정보 저장 (선택사항)
      localStorage.setItem('username', data.user.username);

      // 홈 페이지로 리다이렉트
      navigate('/');

      // Header 업데이트를 위해 새로고침
      window.location.reload();
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });
}

/**
 * API 에러에서 사용자 친화적인 메시지 추출
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ErrorResponse } };
    const errorData = axiosError.response?.data;

    if (errorData?.errors) {
      const messages = Object.values(errorData.errors).flat();
      return messages.join(', ');
    }
  }

  return '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
}
