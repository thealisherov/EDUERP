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
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: 'SET_USER',
          payload: { user, token },
        });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authApi.login(credentials);
      const data = response.data;
      
      console.log('Login response:', data); // DEBUG
      
      // Backend response: { token, refreshToken, userId, username, role, branchId?, branchName? }
      // Handling common variations (accessToken, id, roles)
      const token = data.token || data.accessToken;
      const refreshToken = data.refreshToken;

      // Handle roles (could be string or array)
      let role = data.role || data.roles;
      if (Array.isArray(role)) {
        role = role[0]; // Take the first role if array
      }

      const user = {
        id: data.userId || data.id,
        username: data.username,
        role: role,
        branchId: data.branchId,
        branchName: data.branchName,
        email: data.email
      };
      
      console.log('Token:', token); // DEBUG
      console.log('User:', user); // DEBUG
      
      // localStorage'ga saqlash
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        console.log('localStorage updated:', { token: localStorage.getItem('token'), user: localStorage.getItem('user') }); // DEBUG
      } else {
        console.error('Token topilmadi! Response:', data); // DEBUG
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      console.error('Login error:', error); // DEBUG
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Serverga ulanib bo\'lmadi. Iltimos, backend server ishlayotganligini tekshiring.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Username yoki parol noto\'g\'ri';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Noto\'g\'ri ma\'lumotlar kiritildi';
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
      if (state.user && state.user.id) {
          await authApi.logout(state.user.id);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
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