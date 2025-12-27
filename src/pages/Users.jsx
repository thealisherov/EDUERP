import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { getUserBranchId } from '../api/helpers';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    role: 'ADMIN',
    password: '',
    branchId: ''
  });

  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await usersApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        role: user.role,
        password: '', // Don't show password
        branchId: user.branchId
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        role: 'ADMIN',
        password: '',
        branchId: getUserBranchId() || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };

      // Ensure branchId is set if not provided (e.g. for admin)
      if (!dataToSubmit.branchId) {
        dataToSubmit.branchId = getUserBranchId();
      }
      // Ensure branchId is number
      if (dataToSubmit.branchId) {
        dataToSubmit.branchId = Number(dataToSubmit.branchId);
      }

      if (editingUser) {
        // Only send password if it's changed
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }
        await updateMutation.mutateAsync({ id: editingUser.id, data: dataToSubmit });
      } else {
        await createMutation.mutateAsync(dataToSubmit);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu foydalanuvchini o\'chirmoqchimisiz?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Foydalanuvchilar</h1>
        {isSuperAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className=" cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <FiPlus /> Yangi Foydalanuvchi
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Branch</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Yuklanmoqda...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Foydalanuvchilar topilmadi</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.branchName || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {/* Only Super Admin can edit/delete users usually, or Admin can edit staff? User requirement: Admin cannot create users. Assuming Admin cannot edit other users too. */}
                        {isSuperAdmin && (
                            <>
                                <button
                                onClick={() => handleOpenModal(user)}
                                className="cursor-pointer p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                <FiEdit2 />
                                </button>
                                <button
                                onClick={() => handleDelete(user.id)}
                                className="cursor-pointer p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                <FiTrash2 />
                                </button>
                            </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="ADMIN">Admin</option>
            </select>
          </div>

           {isSuperAdmin && (
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Branch ID</label>
               <input
                 type="number"
                 required
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                 value={formData.branchId || ''}
                 onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
               />
            </div>
           )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parol {editingUser && <span className="text-gray-400 font-normal">(o'zgartirish uchun kiriting)</span>}
            </label>
            <input
              type="password"
              required={!editingUser}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
