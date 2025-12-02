import apiClient from './client';
import type { CommentsResponse, CommentResponse, CreateCommentRequest } from '../types';

/**
 * 댓글 목록 조회
 */
export const getComments = async (slug: string): Promise<CommentsResponse> => {
  const response = await apiClient.get<CommentsResponse>(`/articles/${slug}/comments`);
  return response.data;
};

/**
 * 댓글 작성
 */
export const createComment = async (
  slug: string,
  data: CreateCommentRequest
): Promise<CommentResponse> => {
  const response = await apiClient.post<CommentResponse>(`/articles/${slug}/comments`, data);
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (slug: string, id: number): Promise<void> => {
  await apiClient.delete(`/articles/${slug}/comments/${id}`);
};
