import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  getArticles,
  getFeed,
  getArticle,
  deleteArticle,
  createArticle,
  updateArticle,
  favoriteArticle,
  unfavoriteArticle,
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

/**
 * 아티클 좋아요 훅
 */
export const useFavoriteArticle = (
  options?: Omit<UseMutationOptions<ArticleResponse, Error, string, { previousArticle?: ArticleResponse }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<ArticleResponse, Error, string, { previousArticle?: ArticleResponse }>({
    mutationFn: favoriteArticle,
    onMutate: async (slug) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['article', slug] });
      await queryClient.cancelQueries({ queryKey: ['articles'] });

      // 이전 데이터 백업
      const previousArticle = queryClient.getQueryData<ArticleResponse>(['article', slug]);

      // Optimistic Update - 상세 페이지
      if (previousArticle) {
        queryClient.setQueryData<ArticleResponse>(['article', slug], {
          ...previousArticle,
          article: {
            ...previousArticle.article,
            favorited: true,
            favoritesCount: previousArticle.article.favoritesCount + 1,
          },
        });
      }

      // Optimistic Update - 목록 페이지
      queryClient.setQueriesData<ArticlesResponse>({ queryKey: ['articles'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          articles: old.articles.map((article) =>
            article.slug === slug
              ? { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 }
              : article
          ),
        };
      });

      return { previousArticle };
    },
    onError: (_err, slug, context) => {
      // 에러 발생 시 롤백
      if (context?.previousArticle) {
        queryClient.setQueryData(['article', slug], context.previousArticle);
      }
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(['article', data.article.slug], data);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    ...options,
  });
};

/**
 * 아티클 좋아요 취소 훅
 */
export const useUnfavoriteArticle = (
  options?: Omit<UseMutationOptions<ArticleResponse, Error, string, { previousArticle?: ArticleResponse }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<ArticleResponse, Error, string, { previousArticle?: ArticleResponse }>({
    mutationFn: unfavoriteArticle,
    onMutate: async (slug) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['article', slug] });
      await queryClient.cancelQueries({ queryKey: ['articles'] });

      // 이전 데이터 백업
      const previousArticle = queryClient.getQueryData<ArticleResponse>(['article', slug]);

      // Optimistic Update - 상세 페이지
      if (previousArticle) {
        queryClient.setQueryData<ArticleResponse>(['article', slug], {
          ...previousArticle,
          article: {
            ...previousArticle.article,
            favorited: false,
            favoritesCount: Math.max(0, previousArticle.article.favoritesCount - 1),
          },
        });
      }

      // Optimistic Update - 목록 페이지
      queryClient.setQueriesData<ArticlesResponse>({ queryKey: ['articles'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          articles: old.articles.map((article) =>
            article.slug === slug
              ? { ...article, favorited: false, favoritesCount: Math.max(0, article.favoritesCount - 1) }
              : article
          ),
        };
      });

      return { previousArticle };
    },
    onError: (_err, slug, context) => {
      // 에러 발생 시 롤백
      if (context?.previousArticle) {
        queryClient.setQueryData(['article', slug], context.previousArticle);
      }
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(['article', data.article.slug], data);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    ...options,
  });
};
