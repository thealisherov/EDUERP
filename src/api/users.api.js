import api from './axios';

export const usersApi = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getByBranch: (branchId) => api.get(`/users/branch/${branchId}`),
};

