import api from './axios';

export const reportsApi = {
  getFinancial: (params) => api.get('/reports/financial', { params }),
  getStudents: (params) => api.get('/reports/students', { params }),
  getTeachers: (params) => api.get('/reports/teachers', { params }),
  getGroups: (params) => api.get('/reports/groups', { params }),
  getExpenses: (params) => api.get('/reports/expenses', { params }),
};

