import apiClient from './client';
import type {
  ArticlesResponse,
  ArticleResponse,
  TagsResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '../types';

export interface GetArticlesParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

/**
 * 전역 아티클 목록 조회
 */
export const getArticles = async (params?: GetArticlesParams): Promise<ArticlesResponse> => {
  const response = await apiClient.get<ArticlesResponse>('/articles', { params });
  return response.data;
};

/**
 * 팔로우한 사용자의 아티클 목록 조회 (나의 피드)
 */
export const getFeed = async (params?: { limit?: number; offset?: number }): Promise<ArticlesResponse> => {
  const response = await apiClient.get<ArticlesResponse>('/articles/feed', { params });
  return response.data;
};

/**
 * 인기 태그 목록 조회
 */
export const getTags = async (): Promise<TagsResponse> => {
  const response = await apiClient.get<TagsResponse>('/tags');
  return response.data;
};

/**
 * 아티클 좋아요
 */
export const favoriteArticle = async (slug: string): Promise<void> => {
  await apiClient.post(`/articles/${slug}/favorite`);
};

/**
 * 아티클 좋아요 취소
 */
export const unfavoriteArticle = async (slug: string): Promise<void> => {
  await apiClient.delete(`/articles/${slug}/favorite`);
};

/**
 * 아티클 상세 조회
 */
export const getArticle = async (slug: string): Promise<ArticleResponse> => {
  const response = await apiClient.get<ArticleResponse>(`/articles/${slug}`);
  return response.data;
};

/**
 * 아티클 삭제
 */
export const deleteArticle = async (slug: string): Promise<void> => {
  await apiClient.delete(`/articles/${slug}`);
};

/**
 * 아티클 생성
 */
export const createArticle = async (data: CreateArticleRequest): Promise<ArticleResponse> => {
  const response = await apiClient.post<ArticleResponse>('/articles', data);
  return response.data;
};

/**
 * 아티클 수정
 */
export const updateArticle = async (
  slug: string,
  data: UpdateArticleRequest
): Promise<ArticleResponse> => {
  const response = await apiClient.put<ArticleResponse>(`/articles/${slug}`, data);
  return response.data;
};
