import { useCallback, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, setAuthToken } from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        setAuthToken(storedToken);
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      if (storedToken) {
        const res = await getCurrentUser();
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('❌ Error loading current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const { user: userData, token: newToken } = res.data;

    setUser(userData);
    setToken(newToken);
    setAuthToken(newToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);

    return userData;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    const { user: newUser, token: newToken } = res.data;

    setUser(newUser);
    setToken(newToken);
    setAuthToken(newToken);

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);

    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
