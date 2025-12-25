import { useReducer, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './AuthReducer';
import { authApi } from '../api/auth.api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token bor bo'lsa, authenticated deb belgilash
      // Agar backend'dan user ma'lumotlari kerak bo'lsa, boshqa endpoint ishlatilishi mumkin
      dispatch({
        type: 'SET_USER',
        payload: { token },
      });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Serverga ulanib bo\'lmadi. Iltimos, backend server ishlayotganligini tekshiring.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

