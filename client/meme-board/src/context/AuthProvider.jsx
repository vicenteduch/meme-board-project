import { useCallback, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      loadCurrentUser();
    }
  }, [loadCurrentUser]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const userData = res.data.user || res.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data) => {
    const res = await registerUser(data);
    const newUser = res.data.user || res.data;
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
