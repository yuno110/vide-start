import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { getComments, createComment, deleteComment } from '../api/comments';
import type { CommentsResponse, CommentResponse, CreateCommentRequest } from '../types';

/**
 * 댓글 목록 조회 훅
 */
export const useComments = (
  slug: string,
  options?: Omit<UseQueryOptions<CommentsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['comments', slug],
    queryFn: () => getComments(slug),
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};

/**
 * 댓글 작성 훅
 */
export const useCreateComment = (
  options?: Omit<
    UseMutationOptions<CommentResponse, Error, { slug: string; data: CreateCommentRequest }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => createComment(slug, data),
    onSuccess: (_, variables) => {
      // 해당 아티클의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', variables.slug] });
    },
    ...options,
  });
};

/**
 * 댓글 삭제 훅
 */
export const useDeleteComment = (
  options?: Omit<
    UseMutationOptions<void, Error, { slug: string; id: number }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, id }) => deleteComment(slug, id),
    onSuccess: (_, variables) => {
      // 해당 아티클의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', variables.slug] });
    },
    ...options,
  });
};
