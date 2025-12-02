import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { getProfile, followUser, unfollowUser } from '../api/profiles';
import type { ProfileResponse } from '../types';

/**
 * 프로필 조회 훅
 */
export const useProfile = (
  username: string,
  options?: Omit<UseQueryOptions<ProfileResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username),
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};

/**
 * 사용자 팔로우 훅
 */
export const useFollowUser = (
  options?: Omit<UseMutationOptions<ProfileResponse, Error, string, { previousProfile?: ProfileResponse }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, string, { previousProfile?: ProfileResponse }>({
    mutationFn: followUser,
    onMutate: async (username) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['profile', username] });

      // 이전 데이터 백업
      const previousProfile = queryClient.getQueryData<ProfileResponse>(['profile', username]);

      // Optimistic Update
      if (previousProfile) {
        queryClient.setQueryData<ProfileResponse>(['profile', username], {
          ...previousProfile,
          profile: {
            ...previousProfile.profile,
            following: true,
          },
        });
      }

      return { previousProfile };
    },
    onError: (_err, username, context) => {
      // 에러 발생 시 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', username], context.previousProfile);
      }
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(['profile', data.profile.username], data);
    },
    ...options,
  });
};

/**
 * 사용자 언팔로우 훅
 */
export const useUnfollowUser = (
  options?: Omit<UseMutationOptions<ProfileResponse, Error, string, { previousProfile?: ProfileResponse }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, string, { previousProfile?: ProfileResponse }>({
    mutationFn: unfollowUser,
    onMutate: async (username) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['profile', username] });

      // 이전 데이터 백업
      const previousProfile = queryClient.getQueryData<ProfileResponse>(['profile', username]);

      // Optimistic Update
      if (previousProfile) {
        queryClient.setQueryData<ProfileResponse>(['profile', username], {
          ...previousProfile,
          profile: {
            ...previousProfile.profile,
            following: false,
          },
        });
      }

      return { previousProfile };
    },
    onError: (_err, username, context) => {
      // 에러 발생 시 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', username], context.previousProfile);
      }
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(['profile', data.profile.username], data);
    },
    ...options,
  });
};
