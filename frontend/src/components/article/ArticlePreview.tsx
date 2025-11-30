import { Link } from 'react-router-dom';
import ArticleMeta from './ArticleMeta';
import TagList from './TagList';

interface Author {
  username: string;
  bio?: string;
  image?: string;
  following?: boolean;
}

interface Article {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt?: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

interface ArticlePreviewProps {
  article: Article;
  onFavorite?: (slug: string) => void;
  className?: string;
}

export default function ArticlePreview({
  article,
  onFavorite,
  className = '',
}: ArticlePreviewProps) {
  const handleFavorite = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (onFavorite) {
      onFavorite(article.slug);
    }
  };

  return (
    <article
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}
    >
      {/* 상단: 작성자 정보 및 좋아요 버튼 */}
      <div className="mb-4">
        <ArticleMeta
          author={article.author}
          createdAt={article.createdAt}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          onFavorite={handleFavorite}
          showActions={false}
        />
      </div>

      {/* 아티클 내용 */}
      <Link to={`/article/${article.slug}`} className="block group">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {article.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
      </Link>

      {/* 하단: 더 보기 링크 및 태그 */}
      <div className="flex items-center justify-between">
        <Link
          to={`/article/${article.slug}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          더 읽기...
        </Link>
        <TagList tags={article.tagList} />
      </div>

      {/* 좋아요 버튼 (모바일) */}
      <div className="mt-4 flex justify-end sm:hidden">
        <button
          onClick={handleFavorite}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            article.favorited
              ? 'bg-green-600 text-white'
              : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={article.favorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {article.favoritesCount}
        </button>
      </div>
    </article>
  );
}
