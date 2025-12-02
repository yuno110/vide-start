import { useComments, useCreateComment, useDeleteComment } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface CommentListProps {
  articleSlug: string;
}

export default function CommentList({ articleSlug }: CommentListProps) {
  const { isLoggedIn } = useAuth();
  const currentUsername = localStorage.getItem('username');

  const { data, isLoading, error } = useComments(articleSlug);
  const createMutation = useCreateComment();
  const deleteMutation = useDeleteComment();

  const handleCreateComment = (body: string) => {
    createMutation.mutate({
      slug: articleSlug,
      data: {
        comment: { body },
      },
    });
  };

  const handleDeleteComment = (id: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate({ slug: articleSlug, id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage>댓글을 불러오는데 실패했습니다.</ErrorMessage>;
  }

  const comments = data?.comments || [];

  return (
    <div className="space-y-4">
      {/* 댓글 작성 폼 (로그인한 사용자에게만 표시) */}
      {isLoggedIn && (
        <CommentForm
          onSubmit={handleCreateComment}
          isSubmitting={createMutation.isPending}
          currentUsername={currentUsername}
        />
      )}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUsername={currentUsername}
              onDelete={handleDeleteComment}
              isDeleting={
                deleteMutation.isPending && deleteMutation.variables?.id === comment.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
