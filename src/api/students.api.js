import api from './axios';

export const studentsApi = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (studentData) => api.post('/students', studentData),
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  delete: (id) => api.delete(`/students/${id}`),
  getPaymentHistory: (id) => api.get(`/students/${id}/payment-history`),
  getGroups: (id) => api.get(`/students/${id}/groups`),
  getUnpaid: (params) => api.get('/students/unpaid', { params }),
  getStatistics: (params) => api.get('/students/statistics', { params }),
  search: (params) => api.get('/students/search', { params }),
  getRecent: (params) => api.get('/students/recent', { params }),
  getByPaymentStatus: (params) => api.get('/students/by-payment-status', { params }),
  getByGroup: (groupId, params) => api.get(`/students/by-group`, { params: { groupId, ...params } }),
};

