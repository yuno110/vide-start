import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  getArticles,
  getFeed,
  getArticle,
  deleteArticle,
  createArticle,
  updateArticle,
} from '../api/articles';
import type { GetArticlesParams } from '../api/articles';
import type {
  ArticlesResponse,
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '../types';

/**
 * 전역 아티클 목록 조회 훅
 */
export const useArticles = (
  params?: GetArticlesParams,
  options?: Omit<UseQueryOptions<ArticlesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};

/**
 * 나의 피드 조회 훅
 */
export const useFeed = (
  params?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<ArticlesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: () => getFeed(params),
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};

/**
 * 아티클 상세 조회 훅
 */
export const useArticle = (
  slug: string,
  options?: Omit<UseQueryOptions<ArticleResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(slug),
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};

/**
 * 아티클 삭제 훅
 */
export const useDeleteArticle = (
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      // 아티클 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    ...options,
  });
};

/**
 * 아티클 생성 훅
 */
export const useCreateArticle = (
  options?: Omit<UseMutationOptions<ArticleResponse, Error, CreateArticleRequest>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      // 아티클 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    ...options,
  });
};

/**
 * 아티클 수정 훅
 */
export const useUpdateArticle = (
  options?: Omit<
    UseMutationOptions<ArticleResponse, Error, { slug: string; data: UpdateArticleRequest }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => updateArticle(slug, data),
    onSuccess: (data) => {
      // 아티클 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      // 해당 아티클 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['article', data.article.slug] });
    },
    ...options,
  });
};
