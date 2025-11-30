import { useState } from 'react';
import Layout from '../components/layout/Layout';
import ArticleList from '../components/article/ArticleList';
import Pagination from '../components/ui/Pagination';
import TagList from '../components/article/TagList';

// 샘플 데이터
const sampleArticles = [
  {
    slug: 'how-to-build-webapps-that-scale',
    title: 'How to build webapps that scale',
    description: 'This is the description for the post.',
    body: 'This is the body of the post.',
    tagList: ['react', 'typescript', 'webdev'],
    createdAt: '2025-11-30T00:00:00.000Z',
    updatedAt: '2025-11-30T00:00:00.000Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake',
      following: false,
    },
  },
  {
    slug: 'introduction-to-realworld',
    title: 'Introduction to RealWorld',
    description: 'Learn about RealWorld and how it works.',
    body: 'RealWorld is a fullstack demo application.',
    tagList: ['realworld', 'demo', 'fullstack'],
    createdAt: '2025-11-29T00:00:00.000Z',
    updatedAt: '2025-11-29T00:00:00.000Z',
    favorited: true,
    favoritesCount: 12,
    author: {
      username: 'john',
      bio: 'Frontend developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      following: true,
    },
  },
  {
    slug: 'mastering-tailwind-css',
    title: 'Mastering Tailwind CSS',
    description: 'Tips and tricks for using Tailwind CSS effectively.',
    body: 'Tailwind CSS is a utility-first CSS framework.',
    tagList: ['tailwind', 'css', 'design'],
    createdAt: '2025-11-28T00:00:00.000Z',
    updatedAt: '2025-11-28T00:00:00.000Z',
    favorited: false,
    favoritesCount: 8,
    author: {
      username: 'sarah',
      bio: 'UI/UX Designer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      following: false,
    },
  },
];

const popularTags = [
  'react',
  'typescript',
  'webdev',
  'tailwind',
  'css',
  'design',
  'realworld',
  'demo',
  'fullstack',
  'javascript',
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'global' | 'feed'>('global');

  const handleFavorite = (slug: string) => {
    console.log('Favorite article:', slug);
    // TODO: API 연동 후 실제 좋아요 기능 구현
  };

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
              <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'global'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Global Feed
              </button>
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'feed'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Your Feed
              </button>
            </div>

            {/* 아티클 목록 */}
            {activeTab === 'global' ? (
              <>
                <ArticleList
                  articles={sampleArticles}
                  onFavorite={handleFavorite}
                />
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  로그인하여 팔로우한 사용자의 글을 확인하세요.
                </p>
              </div>
            )}
          </div>

          {/* 사이드바 - 인기 태그 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <TagList tags={popularTags} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
