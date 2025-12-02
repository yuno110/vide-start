import apiClient from './client';
import type { ProfileResponse } from '../types';

/**
 * 프로필 조회
 */
export const getProfile = async (username: string): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>(`/profiles/${username}`);
  return response.data;
};

/**
 * 사용자 팔로우
 */
export const followUser = async (username: string): Promise<ProfileResponse> => {
  const response = await apiClient.post<ProfileResponse>(`/profiles/${username}/follow`);
  return response.data;
};

/**
 * 사용자 언팔로우
 */
export const unfollowUser = async (username: string): Promise<ProfileResponse> => {
  const response = await apiClient.delete<ProfileResponse>(`/profiles/${username}/follow`);
  return response.data;
};
