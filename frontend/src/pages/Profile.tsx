import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ArticleList from '../components/article/ArticleList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useProfile, useFollowUser, useUnfollowUser } from '../hooks/useProfile';
import { useCurrentUser } from '../hooks/useUser';
import { useArticles, useFavoriteArticle, useUnfavoriteArticle } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuthContext';

type TabType = 'my' | 'favorited';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('my');

  // 프로필 정보 조회
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useProfile(username || '', {
    enabled: !!username,
  });

  // 현재 로그인한 사용자 정보
  const { data: currentUserData } = useCurrentUser({
    enabled: isLoggedIn,
  });

  // 팔로우/언팔로우 Mutation
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  // 좋아요 Mutation
  const favoriteMutation = useFavoriteArticle();
  const unfavoriteMutation = useUnfavoriteArticle();

  // 본인 여부 확인
  const isOwnProfile = currentUserData?.user.username === username;

  // 아티클 목록 조회
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useArticles(
    activeTab === 'my'
      ? { author: username }
      : { favorited: username }
  );

  // 팔로우/언팔로우 핸들러
  const handleFollowToggle = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!username) return;

    if (profileData?.profile.following) {
      unfollowMutation.mutate(username);
    } else {
      followMutation.mutate(username);
    }
  };

  // 좋아요 핸들러
  const handleFavorite = (slug: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const article = articlesData?.articles.find((a) => a.slug === slug);
    if (!article) return;

    if (article.favorited) {
      unfavoriteMutation.mutate(slug);
    } else {
      favoriteMutation.mutate(slug);
    }
  };

  if (isLoadingProfile) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (profileError || !profileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage>프로필을 불러오는데 실패했습니다.</ErrorMessage>
        </div>
      </Layout>
    );
  }

  const { profile } = profileData;

  return (
    <Layout>
      {/* 프로필 헤더 */}
      <div className="bg-gray-100 py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          {/* 프로필 이미지 */}
          <img
            src={profile.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
            alt={profile.username}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
          />

          {/* 사용자명 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>

          {/* 자기소개 */}
          {profile.bio && (
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">{profile.bio}</p>
          )}

          {/* 버튼 */}
          <div className="flex justify-center gap-3">
            {isOwnProfile ? (
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Edit Profile Settings
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  profile.following
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="container mx-auto px-4 py-8">
        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'my'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Articles
          </button>
          <button
            onClick={() => setActiveTab('favorited')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'favorited'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Favorited Articles
          </button>
        </div>

        {/* 로딩 상태 */}
        {isLoadingArticles && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* 에러 상태 */}
        {articlesError && (
          <ErrorMessage>아티클을 불러오는데 실패했습니다.</ErrorMessage>
        )}

        {/* 아티클 목록 */}
        {!isLoadingArticles && !articlesError && articlesData && (
          <>
            {articlesData.articles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  {activeTab === 'my'
                    ? '작성한 아티클이 없습니다.'
                    : '좋아요한 아티클이 없습니다.'}
                </p>
              </div>
            ) : (
              <ArticleList
                articles={articlesData.articles}
                onFavorite={handleFavorite}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
