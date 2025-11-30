import { useState } from 'react';
import { setToken, getToken, removeToken, isAuthenticated } from '../utils/auth';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const login = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
    getToken,
  };
}
