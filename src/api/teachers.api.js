import api from './axios';

export const teachersApi = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (teacherData) => api.post('/teachers', teacherData),
  update: (id, teacherData) => api.put(`/teachers/${id}`, teacherData),
  delete: (id) => api.delete(`/teachers/${id}`),
  search: (params) => api.get('/teachers/search', { params }),
  getBySalaryType: (params) => api.get('/teachers/by-salary-type', { params }),
};

