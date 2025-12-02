import { Link } from 'react-router-dom';
import type { Comment } from '../../types';

interface CommentItemProps {
  comment: Comment;
  currentUsername?: string | null;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function CommentItem({
  comment,
  currentUsername,
  onDelete,
  isDeleting,
}: CommentItemProps) {
  const isAuthor = currentUsername === comment.author.username;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border border-gray-200 rounded-md bg-white">
      {/* 댓글 본문 */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap">{comment.body}</p>
      </div>

      {/* 댓글 푸터 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${comment.author.username}`}>
            <img
              src={
                comment.author.image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`
              }
              alt={comment.author.username}
              className="w-6 h-6 rounded-full"
            />
          </Link>
          <Link
            to={`/profile/${comment.author.username}`}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {comment.author.username}
          </Link>
          <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
        </div>

        {/* 삭제 버튼 (작성자에게만 표시) */}
        {isAuthor && (
          <button
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
