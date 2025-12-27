import api from './axios';
import { getUserBranchId } from './helpers';
import { API_ENDPOINTS } from '../utils/constants';

export const usersApi = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => {
      // Create user logic might be different from register.
      // If the backend expects registration to create users, we use that.
      // However, usually "Create User" endpoint exists for Admins.
      // The snippet provided earlier says: UpdateUserRequest ...
      // But it doesn't explicitly show CreateUserRequest.
      // But based on common patterns and "Super Admin Branch yaratadi User yaratadi",
      // it is likely handled by an endpoint.
      // If we assume standard registration is for public or specific flow.
      // Let's assume there is a POST /users or similar if not Register.
      // BUT, the user explicitly said "Super Admin ... User yaratadi".
      // Let's try to use the auth register endpoint if no other is apparent, OR assume POST /api/users.
      // Given the list of controllers, there isn't a "create user" in UserController.
      // Wait, let me check the UserController snippet again.
      // It has `getAllUsers`, `getUsersByBranch`, `getUserById`, `deleteUser`, `updateUser`.
      // It DOES NOT have `createUser`.
      // So User creation must be done via AuthController's /register or similar (which is not in the snippet provided)
      // OR I missed it.
      // The user provided snippets for AuthController: login, refresh, logout. NO register.
      // BUT `UpdateUserRequest` exists.
      // Maybe I should look at `src/utils/constants.js`. It has `REGISTER: '/auth/register'`.
      // So likely it is `/auth/register`.
      return api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
  update: (id, userData) => {
    // If not super admin, ensure branchId is preserved or added if missing
    // But typically update request should include branchId
    return api.put(`/users/${id}`, userData);
  },
  delete: (id) => api.delete(`/users/${id}`),
  getByBranch: (branchId) => api.get(`/users/branch/${branchId}`),
  // Helper for admin to get users of their own branch
  getMyBranchUsers: () => {
    const branchId = getUserBranchId();
    return api.get(`/users/branch/${branchId}`);
  }
};

