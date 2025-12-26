import api from './axios';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

export const authApi = {
  login: (credentials) => {
    // 401 xatolikda global interceptor sahifani yangilamasligi uchun alohida so'rov
    const baseURL = api.defaults.baseURL || 'https://bigideaslc-production.up.railway.app/api';
    return axios.post(`${baseURL}${API_ENDPOINTS.AUTH.LOGIN}`, credentials);
  },
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  refreshToken: (refreshToken) => api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};
