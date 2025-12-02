import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ArticleList from '../components/article/ArticleList';
import Pagination from '../components/ui/Pagination';
import TagList from '../components/article/TagList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useArticles, useFeed, useFavoriteArticle, useUnfavoriteArticle } from '../hooks/useArticles';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../hooks/useAuthContext';

const ARTICLES_PER_PAGE = 10;

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'global' | 'feed' | 'tag'>('global');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  // 좋아요 Mutation
  const favoriteMutation = useFavoriteArticle();
  const unfavoriteMutation = useUnfavoriteArticle();

  // 전역 피드 또는 태그 필터링된 아티클
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useArticles(
    activeTab === 'global' || activeTab === 'tag'
      ? {
          tag: selectedTag || undefined,
          limit: ARTICLES_PER_PAGE,
          offset,
        }
      : undefined,
    {
      enabled: activeTab === 'global' || activeTab === 'tag',
    }
  );

  // 나의 피드
  const {
    data: feedData,
    isLoading: isLoadingFeed,
    error: feedError,
  } = useFeed(
    {
      limit: ARTICLES_PER_PAGE,
      offset,
    },
    {
      enabled: activeTab === 'feed' && isLoggedIn,
    }
  );

  // 인기 태그
  const { data: tagsData, isLoading: isLoadingTags } = useTags();

  const handleTabChange = (tab: 'global' | 'feed' | 'tag') => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab !== 'tag') {
      setSelectedTag(null);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('tag');
    setCurrentPage(1);
  };

  const handleFavorite = (slug: string) => {
    // 로그인 체크
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // 현재 아티클의 좋아요 상태 확인
    const article = currentData?.articles.find((a) => a.slug === slug);
    if (!article) return;

    // 좋아요 토글
    if (article.favorited) {
      unfavoriteMutation.mutate(slug);
    } else {
      favoriteMutation.mutate(slug);
    }
  };

  // 현재 활성화된 탭의 데이터
  const currentData = activeTab === 'feed' ? feedData : articlesData;
  const isLoading = activeTab === 'feed' ? isLoadingFeed : isLoadingArticles;
  const error = activeTab === 'feed' ? feedError : articlesError;

  const totalPages = currentData?.articlesCount
    ? Math.ceil(currentData.articlesCount / ARTICLES_PER_PAGE)
    : 0;

  return (
    <Layout>
      {/* 히어로 섹션 */}
      <div className="bg-green-600 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">conduit</h1>
          <p className="text-xl text-green-100">A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {/* 탭 메뉴 */}
            <div className="flex border-b border-gray-200 mb-6">
              {isLoggedIn && (
                <button
                  onClick={() => handleTabChange('feed')}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === 'feed'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Your Feed
                </button>
              )}
              <button
                onClick={() => handleTabChange('global')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'global'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Global Feed
              </button>
              {selectedTag && activeTab === 'tag' && (
                <button
                  onClick={() => handleTabChange('tag')}
                  className="px-4 py-3 font-medium text-green-600 border-b-2 border-green-600 flex items-center gap-2"
                >
                  <span className="text-gray-400">#</span>
                  {selectedTag}
                </button>
              )}
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <ErrorMessage>아티클을 불러오는데 실패했습니다.</ErrorMessage>
            )}

            {/* 아티클 목록 */}
            {!isLoading && !error && currentData && (
              <>
                {currentData.articles.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                      {activeTab === 'feed'
                        ? '팔로우한 사용자의 글이 없습니다.'
                        : '등록된 아티클이 없습니다.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <ArticleList
                      articles={currentData.articles}
                      onFavorite={handleFavorite}
                    />
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* 사이드바 - 인기 태그 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              {isLoadingTags ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : tagsData?.tags && tagsData.tags.length > 0 ? (
                <TagList tags={tagsData.tags} onTagClick={handleTagClick} />
              ) : (
                <p className="text-gray-500 text-sm">인기 태그가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
