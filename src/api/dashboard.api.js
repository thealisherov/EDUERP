// import api from './axios';

// export const dashboardApi = {
//   getStats: () => api.get('/dashboard/stats'),
// };

import api from './axios';

export const dashboardApi = {
  getStats: () => {
    // User ma'lumotlarini localStorage'dan olish
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Agar branchId mavjud bo'lsa, parametr sifatida yuborish
    const params = user?.branchId ? { branchId: user.branchId } : {};
    
    return api.get('/dashboard/stats', { params });
  },
};