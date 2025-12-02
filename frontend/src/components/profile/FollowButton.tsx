import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthContext';
import { useFollowUser, useUnfollowUser } from '../../hooks/useProfile';

interface FollowButtonProps {
  username: string;
  following: boolean;
  className?: string;
}

export default function FollowButton({ username, following, className = '' }: FollowButtonProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const currentUsername = localStorage.getItem('username');

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  // 자기 자신은 팔로우 버튼을 표시하지 않음
  if (isLoggedIn && currentUsername === username) {
    return null;
  }

  const handleFollow = () => {
    // 로그인 체크
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // 팔로우 토글
    if (following) {
      unfollowMutation.mutate(username);
    } else {
      followMutation.mutate(username);
    }
  };

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-4 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
        following
          ? 'bg-gray-600 text-white hover:bg-gray-700'
          : 'border border-gray-400 text-gray-600 hover:bg-gray-100'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={following ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'}
        />
      </svg>
      {following ? 'Unfollow' : 'Follow'} {username}
    </button>
  );
}
