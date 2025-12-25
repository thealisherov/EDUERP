import api from './axios';

export const expensesApi = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expenseData) => api.post('/expenses', expenseData),
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  delete: (id) => api.delete(`/expenses/${id}`),
  getMonthly: (params) => api.get('/expenses/monthly', { params }),
  getMonthlyTotal: (params) => api.get('/expenses/monthly/total', { params }),
  getMonthlySummary: (params) => api.get('/expenses/monthly/summary', { params }),
  getDaily: (params) => api.get('/expenses/daily', { params }),
  getDailyTotal: (params) => api.get('/expenses/daily/total', { params }),
  getDailySummary: (params) => api.get('/expenses/daily/summary', { params }),
};

