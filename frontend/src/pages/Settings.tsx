import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useCurrentUser, useUpdateUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuthContext';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 현재 사용자 정보 조회
  const { data: currentUserData, isLoading, error } = useCurrentUser();

  // 사용자 정보 수정 Mutation
  const updateMutation = useUpdateUser({
    onSuccess: (data) => {
      // localStorage에 사용자명 저장 (Header에서 사용)
      localStorage.setItem('username', data.user.username);
      // 프로필 페이지로 이동
      navigate(`/profile/${data.user.username}`);
    },
  });

  // 현재 사용자 데이터로 초기 폼 데이터 구성
  const initialFormData = useMemo(() => {
    if (currentUserData?.user) {
      return {
        image: currentUserData.user.image || '',
        username: currentUserData.user.username,
        bio: currentUserData.user.bio || '',
        email: currentUserData.user.email,
        password: '',
      };
    }
    return {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    };
  }, [currentUserData]);

  // 폼 상태
  const [formData, setFormData] = useState(initialFormData);

  // 에러 상태
  const [formError, setFormError] = useState<string>('');

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // 기본 검증
    if (!formData.username.trim()) {
      setFormError('사용자명은 필수입니다.');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('이메일은 필수입니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 업데이트할 데이터 구성
    const updateData: {
      user: {
        email: string;
        username: string;
        bio?: string;
        image?: string;
        password?: string;
      };
    } = {
      user: {
        email: formData.email,
        username: formData.username,
        bio: formData.bio || undefined,
        image: formData.image || undefined,
      },
    };

    // 비밀번호가 입력된 경우에만 포함
    if (formData.password) {
      updateData.user.password = formData.password;
    }

    try {
      await updateMutation.mutateAsync(updateData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필 업데이트에 실패했습니다.';
      setFormError(errorMessage);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('username');
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage>사용자 정보를 불러오는데 실패했습니다.</ErrorMessage>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Settings</h1>

        {/* 에러 메시지 */}
        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{formError}</p>
          </div>
        )}

        {/* 설정 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 프로필 이미지 URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="URL of profile picture"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 사용자명 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short bio about you"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (leave blank to keep current)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              비밀번호를 변경하지 않으려면 비워두세요
            </p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Settings'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Or click here to logout
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
