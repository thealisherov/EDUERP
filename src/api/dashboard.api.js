import api from './axios';

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentPayments: () => api.get('/dashboard/recent-payments'),
  getRecentStudents: () => api.get('/dashboard/recent-students'),
  getChartData: (period) => api.get('/dashboard/chart', { params: { period } }),
};

