import { useQuery } from '@tanstack/react-query';
import { getTags } from '../api/articles';

/**
 * 인기 태그 목록 조회 훅
 */
export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 1000 * 60 * 10, // 10분
  });
};
