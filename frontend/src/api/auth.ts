import apiClient from './client';
import type { LoginRequest, RegisterRequest, UserResponse } from '../types';

/**
 * 로그인 API
 */
export async function login(email: string, password: string): Promise<UserResponse> {
  const requestData: LoginRequest = {
    user: {
      email,
      password,
    },
  };

  const response = await apiClient.post<UserResponse>('/users/login', requestData);
  return response.data;
}

/**
 * 회원가입 API
 */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<UserResponse> {
  const requestData: RegisterRequest = {
    user: {
      username,
      email,
      password,
    },
  };

  const response = await apiClient.post<UserResponse>('/users', requestData);
  return response.data;
}

/**
 * 현재 사용자 정보 조회 API
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/user');
  return response.data;
}
