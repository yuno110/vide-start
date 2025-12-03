import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { getCurrentUser, updateUser } from '../api/auth';
import type { UserResponse, UpdateUserRequest } from '../types';

/**
 * 현재 사용자 정보 조회 훅
 */
export const useCurrentUser = (
  options?: Omit<UseQueryOptions<UserResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
    ...options,
  });
};

/**
 * 사용자 정보 수정 훅
 */
export const useUpdateUser = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, UpdateUserRequest, { previousUser?: UserResponse }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UpdateUserRequest, { previousUser?: UserResponse }>({
    mutationFn: updateUser,
    onMutate: async (updateData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });

      // 이전 데이터 백업
      const previousUser = queryClient.getQueryData<UserResponse>(['currentUser']);

      // Optimistic Update
      if (previousUser) {
        queryClient.setQueryData<UserResponse>(['currentUser'], {
          user: {
            ...previousUser.user,
            ...updateData.user,
          },
        });
      }

      return { previousUser };
    },
    onError: (_err, _updateData, context) => {
      // 에러 발생 시 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(['currentUser'], context.previousUser);
      }
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(['currentUser'], data);

      // 프로필 쿼리도 무효화 (프로필 페이지에서 수정된 정보가 반영되도록)
      queryClient.invalidateQueries({ queryKey: ['profile', data.user.username] });
    },
    ...options,
  });
};
