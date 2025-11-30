import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import type { Profile } from '../../types';

interface ArticleMetaProps {
  author: Profile;
  createdAt: string;
  favorited?: boolean;
  favoritesCount?: number;
  onFavorite?: (e?: React.MouseEvent) => void;
  onFollow?: () => void;
  showActions?: boolean;
  className?: string;
}

export default function ArticleMeta({
  author,
  createdAt,
  favorited = false,
  favoritesCount = 0,
  onFavorite,
  onFollow,
  showActions = true,
  className = '',
}: ArticleMetaProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 작성자 정보 */}
      <Link
        to={`/profile/${author.username}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <img
          src={
            author.image ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`
          }
          alt={author.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-medium text-green-600">{author.username}</span>
          <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
        </div>
      </Link>

      {/* 액션 버튼들 */}
      {showActions && (
        <div className="flex items-center gap-2 ml-auto">
          {/* 팔로우 버튼 */}
          {onFollow && (
            <Button
              variant={author.following ? 'secondary' : 'outline'}
              size="sm"
              onClick={onFollow}
              className="flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill={author.following ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {author.following ? '팔로잉' : '팔로우'}
            </Button>
          )}

          {/* 좋아요 버튼 */}
          {onFavorite && (
            <Button
              variant={favorited ? 'primary' : 'outline'}
              size="sm"
              onClick={onFavorite}
              className="flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill={favorited ? 'currentColor' : 'none'}
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
              {favoritesCount}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
