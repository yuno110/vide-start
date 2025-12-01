import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCreateArticle, useUpdateArticle, useArticle } from '../hooks/useArticles';
import type { CreateArticleRequest } from '../types';

interface ArticleFormData {
  title: string;
  description: string;
  body: string;
}

export default function Editor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormData>();

  // 수정 모드일 때 기존 아티클 데이터 로드
  const { data: articleData, isLoading: isLoadingArticle } = useArticle(slug || '', {
    enabled: isEditMode && !!slug,
  });

  const createMutation = useCreateArticle({
    onSuccess: (data) => {
      navigate(`/article/${data.article.slug}`);
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || '아티클 생성에 실패했습니다.';
        setGeneralError(errorMessage);
      } else {
        setGeneralError('아티클 생성에 실패했습니다.');
      }
    },
  });

  const updateMutation = useUpdateArticle({
    onSuccess: (data) => {
      navigate(`/article/${data.article.slug}`);
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || '아티클 수정에 실패했습니다.';
        setGeneralError(errorMessage);
      } else {
        setGeneralError('아티클 수정에 실패했습니다.');
      }
    },
  });

  // 권한 체크 (수정 모드)
  useEffect(() => {
    if (isEditMode && articleData) {
      const currentUsername = localStorage.getItem('username');
      const isAuthor = currentUsername === articleData.article.author.username;

      if (!isAuthor) {
        alert('이 아티클을 수정할 권한이 없습니다.');
        navigate('/');
      }
    }
  }, [isEditMode, articleData, navigate]);

  // 수정 모드일 때 폼에 기존 데이터 채우기
  useEffect(() => {
    if (isEditMode && articleData) {
      const { article } = articleData;
      reset({
        title: article.title,
        description: article.description,
        body: article.body,
      });
      // 외부 데이터로부터 상태를 동기화하는 정상적인 패턴
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTags(article.tagList);
    }
  }, [isEditMode, articleData, reset]);

  const onSubmit = (data: ArticleFormData) => {
    setGeneralError('');

    const articlePayload: CreateArticleRequest = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: tags,
      },
    };

    if (isEditMode && slug) {
      updateMutation.mutate({ slug, data: articlePayload });
    } else {
      createMutation.mutate(articlePayload);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = tagInput.trim();

      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 로딩 중
  if (isEditMode && isLoadingArticle) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            {isEditMode ? '아티클 수정' : '새 아티클 작성'}
          </h1>

          {generalError && <ErrorMessage className="mb-4">{generalError}</ErrorMessage>}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <Input
                  type="text"
                  placeholder="Article Title"
                  {...register('title', {
                    required: '제목을 입력해주세요.',
                  })}
                  fullWidth
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              {/* 설명 */}
              <div>
                <Input
                  type="text"
                  placeholder="What's this article about?"
                  {...register('description', {
                    required: '설명을 입력해주세요.',
                  })}
                  fullWidth
                  aria-invalid={errors.description ? 'true' : 'false'}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* 본문 */}
              <div>
                <textarea
                  placeholder="Write your article (in markdown)"
                  {...register('body', {
                    required: '본문을 입력해주세요.',
                  })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-invalid={errors.body ? 'true' : 'false'}
                />
                {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
              </div>

              {/* 태그 입력 */}
              <div>
                <Input
                  type="text"
                  placeholder="Enter tags (press Enter to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  fullWidth
                />
                <p className="mt-1 text-sm text-gray-500">태그를 입력하고 엔터키를 누르세요</p>
              </div>

              {/* 추가된 태그 목록 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* 제출 버튼 */}
              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isPending}>
                {isEditMode ? '아티클 수정' : '아티클 게시'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
