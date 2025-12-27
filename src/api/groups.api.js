// import api from './axios';

// export const groupsApi = {
//   getAll: (params) => api.get('/groups', { params }),
//   getById: (id) => api.get(`/groups/${id}`),
//   create: (groupData) => api.post('/groups', groupData),
//   update: (id, groupData) => api.put(`/groups/${id}`, groupData),
//   delete: (id) => api.delete(`/groups/${id}`),
//   addStudent: (groupId, studentId) => api.post(`/groups/${groupId}/students/${studentId}`),
//   removeStudent: (groupId, studentId) => api.delete(`/groups/${groupId}/students/${studentId}`),
//   getUnpaidStudents: (id, params) => api.get(`/groups/${id}/unpaid-students`, { params }),
//   search: (params) => api.get('/groups/search', { params }),
//   getByTeacher: (teacherId, params) => api.get('/groups/by-teacher', { params: { teacherId, ...params } }),
// };

// groups.api.js
export const groupsApi = {
  getAll: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/groups', { params: { branchId, ...params } });
  },
  getById: (id) => api.get(`/groups/${id}`),
  create: (groupData) => {
    const branchId = getUserBranchId();
    return api.post('/groups', { ...groupData, branchId });
  },
  update: (id, groupData) => {
    const branchId = getUserBranchId();
    return api.put(`/groups/${id}`, { ...groupData, branchId });
  },
  delete: (id) => api.delete(`/groups/${id}`),
  addStudent: (groupId, studentId) => api.post(`/groups/${groupId}/students/${studentId}`),
  removeStudent: (groupId, studentId) => api.delete(`/groups/${groupId}/students/${studentId}`),
  getUnpaidStudents: (id, params = {}) => api.get(`/groups/${id}/unpaid-students`, { params }),
  search: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/groups/search', { params: { branchId, ...params } });
  },
  getByTeacher: (teacherId, params = {}) => {
    return api.get('/groups/by-teacher', { params: { teacherId, ...params } });
  },
};