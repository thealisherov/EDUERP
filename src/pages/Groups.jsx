import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { teachersApi } from '../api/teachers.api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers, FiClock } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Groups = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [], // Array of strings
    price: '',
    description: ''
  });

  const { data: groups = [], isLoading: loading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await groupsApi.getAll();
      return response.data;
    },
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await teachersApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => groupsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries(['groups']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => groupsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['groups']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => groupsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['groups']),
  });

  const handleOpenModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        teacherId: group.teacherId,
        startTime: group.startTime || '',
        endTime: group.endTime || '',
        daysOfWeek: group.daysOfWeek || [],
        price: group.price || '',
        description: group.description || ''
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
        teacherId: '',
        startTime: '',
        endTime: '',
        daysOfWeek: [],
        price: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
          ...formData,
          price: parseFloat(formData.price),
          teacherId: Number(formData.teacherId)
      };

      if (editingGroup) {
        await updateMutation.mutateAsync({ id: editingGroup.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu guruhni o\'chirmoqchimisiz?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Guruhlar</h1>
          <p className="text-gray-600 mt-1">O'quv guruhlari boshqaruvi</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className=" cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus /> Yangi Guruh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Yuklanmoqda...</div>
        ) : groups.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">Guruhlar topilmadi</div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-purple-600 w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(group)}
                    className="cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{group.description}</p>
              <p className="text-blue-600 font-bold mb-4">{group.price ? group.price.toLocaleString() : 0} UZS</p>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiUsers className="text-gray-400" />
                  <span>O'qituvchi: <span className="font-medium text-gray-900">{group.teacherName || 'Biriktirilmagan'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiClock className="text-gray-400" />
                  <span>Vaqt: {group.startTime} - {group.endTime}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiClock className="text-gray-400" />
                  <span>Kunlar: {group.daysOfWeek ? group.daysOfWeek.join(', ') : ''}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                 <span className="text-gray-500">Studentlar soni:</span>
                 <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{group.studentCount || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? "Guruhni tahrirlash" : "Yangi guruh"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guruh nomi</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narx</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O'qituvchi</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            >
              <option value="">Tanlang</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Boshlanish vaqti (09:00)</label>
                <input
                  type="text"
                  placeholder="HH:mm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tugash vaqti (10:30)</label>
                <input
                  type="text"
                  placeholder="HH:mm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kunlar</label>
             <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32"
                  value={formData.daysOfWeek}
                  onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, daysOfWeek: selectedOptions });
                  }}
                >
                  <option value="MONDAY">Dushanba</option>
                  <option value="TUESDAY">Seshanba</option>
                  <option value="WEDNESDAY">Chorshanba</option>
                  <option value="THURSDAY">Payshanba</option>
                  <option value="FRIDAY">Juma</option>
                  <option value="SATURDAY">Shanba</option>
                  <option value="SUNDAY">Yakshanba</option>
             </select>
             <p className="text-xs text-gray-500 mt-1">Ko'proq tanlash uchun Ctrl tugmasini bosib turing</p>
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

export default Groups;
