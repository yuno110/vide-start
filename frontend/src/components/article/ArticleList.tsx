import ArticlePreview from './ArticlePreview';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import type { Article } from '../../types';

interface ArticleListProps {
  articles?: Article[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onFavorite?: (slug: string) => void;
  className?: string;
}

export default function ArticleList({
  articles = [],
  isLoading = false,
  error = null,
  emptyMessage = '아티클이 없습니다.',
  onFavorite,
  className = '',
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="아티클을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage className="my-6">
        {error}
      </ErrorMessage>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {articles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
