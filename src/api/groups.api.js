import api from './axios';

export const groupsApi = {
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  create: (groupData) => api.post('/groups', groupData),
  update: (id, groupData) => api.put(`/groups/${id}`, groupData),
  delete: (id) => api.delete(`/groups/${id}`),
  addStudent: (groupId, studentId) => api.post(`/groups/${groupId}/students/${studentId}`),
  removeStudent: (groupId, studentId) => api.delete(`/groups/${groupId}/students/${studentId}`),
  getUnpaidStudents: (id, params) => api.get(`/groups/${id}/unpaid-students`, { params }),
  search: (params) => api.get('/groups/search', { params }),
  getByTeacher: (teacherId, params) => api.get('/groups/by-teacher', { params: { teacherId, ...params } }),
};

