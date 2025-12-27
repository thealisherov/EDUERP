// import api from './axios';

// export const expensesApi = {
//   getAll: (params) => api.get('/expenses', { params }),
//   getById: (id) => api.get(`/expenses/${id}`),
//   create: (expenseData) => api.post('/expenses', expenseData),
//   update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
//   delete: (id) => api.delete(`/expenses/${id}`),
//   getMonthly: (params) => api.get('/expenses/monthly', { params }),
//   getMonthlyTotal: (params) => api.get('/expenses/monthly/total', { params }),
//   getMonthlySummary: (params) => api.get('/expenses/monthly/summary', { params }),
//   getDaily: (params) => api.get('/expenses/daily', { params }),
//   getDailyTotal: (params) => api.get('/expenses/daily/total', { params }),
//   getDailySummary: (params) => api.get('/expenses/daily/summary', { params }),
// };

export const expensesApi = {
  getAll: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses', { params: { branchId, ...params } });
  },
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expenseData) => {
    const branchId = getUserBranchId();
    return api.post('/expenses', { ...expenseData, branchId });
  },
  update: (id, expenseData) => {
    const branchId = getUserBranchId();
    return api.put(`/expenses/${id}`, { ...expenseData, branchId });
  },
  delete: (id) => api.delete(`/expenses/${id}`),
  getMonthly: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/monthly', { params: { branchId, ...params } });
  },
  getMonthlyTotal: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/monthly/total', { params: { branchId, ...params } });
  },
  getMonthlySummary: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/monthly/summary', { params: { branchId, ...params } });
  },
  getDaily: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/daily', { params: { branchId, ...params } });
  },
  getDailyTotal: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/daily/total', { params: { branchId, ...params } });
  },
  getDailySummary: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/expenses/daily/summary', { params: { branchId, ...params } });
  },
};
