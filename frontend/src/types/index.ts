// 사용자 타입
export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

// 아티클 타입
export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

// 프로필 타입
export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

// 댓글 타입
export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

// API 응답 타입
export interface UserResponse {
  user: User;
}

export interface ArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CommentResponse {
  comment: Comment;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface ProfileResponse {
  profile: Profile;
}

export interface TagsResponse {
  tags: string[];
}

// API 요청 타입
export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface UpdateUserRequest {
  user: {
    email?: string;
    username?: string;
    password?: string;
    bio?: string;
    image?: string;
  };
}

// 에러 응답 타입
export interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
