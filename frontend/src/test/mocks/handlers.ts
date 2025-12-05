import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8080/api';

// 모킹할 API 핸들러들
export const handlers = [
  // 로그인 API
  http.post(`${API_URL}/users/login`, async () => {
    return HttpResponse.json({
      user: {
        email: 'test@example.com',
        token: 'fake-jwt-token',
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
      },
    });
  }),

  // 회원가입 API
  http.post(`${API_URL}/users`, async () => {
    return HttpResponse.json({
      user: {
        email: 'newuser@example.com',
        token: 'fake-jwt-token-new',
        username: 'newuser',
        bio: '',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
      },
    });
  }),

  // 현재 사용자 정보 조회
  http.get(`${API_URL}/user`, async () => {
    return HttpResponse.json({
      user: {
        email: 'test@example.com',
        token: 'fake-jwt-token',
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
      },
    });
  }),

  // 아티클 목록 조회
  http.get(`${API_URL}/articles`, async () => {
    return HttpResponse.json({
      articles: [
        {
          slug: 'test-article-1',
          title: 'Test Article 1',
          description: 'This is test article 1',
          body: 'Content of test article 1',
          tagList: ['test', 'article'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'testuser',
            bio: 'Test bio',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
            following: false,
          },
        },
      ],
      articlesCount: 1,
    });
  }),

  // 아티클 상세 조회
  http.get(`${API_URL}/articles/:slug`, async ({ params }) => {
    const { slug } = params;
    return HttpResponse.json({
      article: {
        slug,
        title: 'Test Article',
        description: 'This is a test article',
        body: 'Content of test article',
        tagList: ['test', 'article'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
          following: false,
        },
      },
    });
  }),

  // 아티클 생성
  http.post(`${API_URL}/articles`, async () => {
    return HttpResponse.json({
      article: {
        slug: 'new-test-article',
        title: 'New Test Article',
        description: 'This is a new test article',
        body: 'Content of new test article',
        tagList: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
          following: false,
        },
      },
    });
  }),

  // 댓글 목록 조회
  http.get(`${API_URL}/articles/:slug/comments`, async () => {
    return HttpResponse.json({
      comments: [
        {
          id: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          body: 'This is a test comment',
          author: {
            username: 'testuser',
            bio: 'Test bio',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
            following: false,
          },
        },
      ],
    });
  }),

  // 태그 목록 조회
  http.get(`${API_URL}/tags`, async () => {
    return HttpResponse.json({
      tags: ['test', 'article', 'mock', 'frontend'],
    });
  }),

  // 프로필 조회
  http.get(`${API_URL}/profiles/:username`, async ({ params }) => {
    const { username } = params;
    return HttpResponse.json({
      profile: {
        username,
        bio: 'Test bio',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        following: false,
      },
    });
  }),
];
