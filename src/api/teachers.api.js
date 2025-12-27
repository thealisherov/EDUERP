// import api from './axios';
import { getUserBranchId } from './helpers';

export const teachersApi = {
  getAll: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/teachers', { params: { branchId, ...params } });
  },
  getById: (id) => api.get(`/teachers/${id}`),
  create: (teacherData) => {
    const branchId = getUserBranchId();
    // Use branchId from localStorage if not present in teacherData
    // But prefer teacherData.branchId if provided (e.g. by Super Admin)
    const finalBranchId = teacherData.branchId || branchId;
    return api.post('/teachers', { ...teacherData, branchId: finalBranchId });
  },
  update: (id, teacherData) => {
    const branchId = getUserBranchId();
    const finalBranchId = teacherData.branchId || branchId;
    return api.put(`/teachers/${id}`, { ...teacherData, branchId: finalBranchId });
  },
  delete: (id) => api.delete(`/teachers/${id}`),
  search: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/teachers/search', { params: { branchId, ...params } });
  },
  getBySalaryType: (params = {}) => {
    const branchId = getUserBranchId();
    return api.get('/teachers/by-salary-type', { params: { branchId, ...params } });
  },
};