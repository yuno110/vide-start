import { useForm } from 'react-hook-form';
import Button from '../ui/Button';

interface CommentFormData {
  body: string;
}

interface CommentFormProps {
  onSubmit: (body: string) => void;
  isSubmitting: boolean;
  currentUsername?: string | null;
}

export default function CommentForm({
  onSubmit,
  isSubmitting,
  currentUsername,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>();

  const handleFormSubmit = (data: CommentFormData) => {
    onSubmit(data.body);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="border border-gray-200 rounded-md bg-white">
      <div className="p-4">
        <textarea
          {...register('body', {
            required: '댓글 내용을 입력해주세요.',
          })}
          rows={3}
          placeholder="Write a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUsername || 'guest'}`}
            alt={currentUsername || 'guest'}
            className="w-6 h-6 rounded-full"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
        >
          Post Comment
        </Button>
      </div>
    </form>
  );
}
