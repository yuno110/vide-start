import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getArticles, getFeed } from '../api/articles';
import type { GetArticlesParams } from '../api/articles';
import type { ArticlesResponse } from '../types';

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
