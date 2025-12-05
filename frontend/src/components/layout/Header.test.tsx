import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import Header from './Header';

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// useNavigate mock
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header 컴포넌트', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('로고가 렌더링됨', () => {
    render(<Header />);
    expect(screen.getByText('conduit')).toBeInTheDocument();
  });

  it('Home 링크가 렌더링됨', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  describe('비로그인 상태', () => {
    beforeEach(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    });

    it('Sign in 링크가 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('Sign up 링크가 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('New Article 링크가 표시되지 않음', () => {
      render(<Header />);
      expect(screen.queryByText('New Article')).not.toBeInTheDocument();
    });

    it('Settings 링크가 표시되지 않음', () => {
      render(<Header />);
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('Logout 버튼이 표시되지 않음', () => {
      render(<Header />);
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  describe('로그인 상태', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('username', 'testuser');
    });

    it('New Article 링크가 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('New Article')).toBeInTheDocument();
    });

    it('Settings 링크가 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('사용자 이름이 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('사용자 아바타가 표시됨', () => {
      render(<Header />);
      const avatar = screen.getByAltText('testuser');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', expect.stringContaining('testuser'));
    });

    it('Logout 버튼이 표시됨', () => {
      render(<Header />);
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('Sign in 링크가 표시되지 않음', () => {
      render(<Header />);
      expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    });

    it('Sign up 링크가 표시되지 않음', () => {
      render(<Header />);
      expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
    });

    it('Logout 버튼 클릭 시 로그아웃됨', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      // localStorage에서 토큰과 사용자명이 제거되었는지 확인
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();

      // 홈으로 리다이렉트되었는지 확인
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('링크 동작', () => {
    it('로고 클릭 시 홈으로 이동', () => {
      render(<Header />);
      const logo = screen.getByText('conduit');
      expect(logo).toHaveAttribute('href', '/');
    });

    it('Home 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('Sign in 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const signInLink = screen.getByText('Sign in');
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('Sign up 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const signUpLink = screen.getByText('Sign up');
      expect(signUpLink).toHaveAttribute('href', '/register');
    });
  });

  describe('로그인 상태 링크', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('username', 'testuser');
    });

    it('New Article 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const newArticleLink = screen.getByText('New Article');
      expect(newArticleLink).toHaveAttribute('href', '/editor');
    });

    it('Settings 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const settingsLink = screen.getByText('Settings');
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });

    it('프로필 링크가 올바른 경로를 가짐', () => {
      render(<Header />);
      const profileLink = screen.getByText('testuser');
      expect(profileLink).toHaveAttribute('href', '/profile/testuser');
    });
  });
});
