import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import TagList from '../components/article/TagList';
import { useArticle, useDeleteArticle } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuthContext';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const currentUsername = localStorage.getItem('username');

  const { data, isLoading, error } = useArticle(slug || '', {
    enabled: !!slug,
  });

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      navigate('/');
    },
  });

  if (!slug) {
    return (
      <Layout>
        <ErrorMessage>잘못된 접근입니다.</ErrorMessage>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <ErrorMessage>아티클을 불러오는데 실패했습니다.</ErrorMessage>
      </Layout>
    );
  }

  const { article } = data;
  const isAuthor = isLoggedIn && currentUsername === article.author.username;

  const handleDelete = () => {
    if (window.confirm('정말로 이 아티클을 삭제하시겠습니까?')) {
      deleteMutation.mutate(slug);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      {/* 아티클 헤더 */}
      <div className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

          {/* 작성자 메타 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/profile/${article.author.username}`}>
                <img
                  src={
                    article.author.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.username}`
                  }
                  alt={article.author.username}
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <div>
                <Link
                  to={`/profile/${article.author.username}`}
                  className="text-white hover:underline font-medium"
                >
                  {article.author.username}
                </Link>
                <p className="text-gray-400 text-sm">{formatDate(article.createdAt)}</p>
              </div>
            </div>

            {/* 작성자 액션 버튼 */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/editor/${slug}`}
                  className="px-4 py-2 text-sm border border-gray-400 text-gray-400 hover:bg-gray-700 hover:border-gray-300 hover:text-gray-300 rounded transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Article
                  </span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Article'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 아티클 본문 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 본문 내용 */}
          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>

          {/* 태그 목록 */}
          {article.tagList.length > 0 && (
            <div className="mb-8">
              <TagList tags={article.tagList} />
            </div>
          )}

          {/* 구분선 */}
          <hr className="my-8 border-gray-200" />

          {/* 하단 작성자 정보 */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Link to={`/profile/${article.author.username}`}>
                <img
                  src={
                    article.author.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.username}`
                  }
                  alt={article.author.username}
                  className="w-12 h-12 rounded-full"
                />
              </Link>
              <div>
                <Link
                  to={`/profile/${article.author.username}`}
                  className="text-green-600 hover:text-green-700 font-medium text-lg"
                >
                  {article.author.username}
                </Link>
                {article.author.bio && (
                  <p className="text-gray-600 text-sm mt-1">{article.author.bio}</p>
                )}
              </div>
            </div>

            {/* 작성자 액션 버튼 (하단) */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/editor/${slug}`}
                  className="px-4 py-2 text-sm border border-gray-400 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Article
                  </span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Article'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
