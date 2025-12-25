import api from './axios';

export const paymentsApi = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
  getUnpaid: (params) => api.get('/payments/unpaid', { params }),
  getByStudent: (studentId, params) => api.get(`/payments/student/${studentId}`, { params }),
  search: (params) => api.get('/payments/search', { params }),
  getRecent: (params) => api.get('/payments/recent', { params }),
  getByMonth: (params) => api.get('/payments/by-month', { params }),
  getByDateRange: (params) => api.get('/payments/by-date-range', { params }),
};

