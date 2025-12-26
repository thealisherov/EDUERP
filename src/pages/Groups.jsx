import React, { useState, useEffect } from 'react';
import { groupsApi } from '../api/groups.api';
import { teachersApi } from '../api/teachers.api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers, FiClock } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    schedule: '',
    subject: ''
  });

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupsApi.getAll();
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await teachersApi.getAll();
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleOpenModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        teacherId: group.teacherId,
        schedule: group.schedule || '',
        subject: group.subject || ''
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
        teacherId: '',
        schedule: '',
        subject: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await groupsApi.update(editingGroup.id, formData);
      } else {
        await groupsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu guruhni o\'chirmoqchimisiz?')) {
      try {
        await groupsApi.delete(id);
        fetchGroups();
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
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
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{group.subject}</p>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiUsers className="text-gray-400" />
                  <span>O'qituvchi: <span className="font-medium text-gray-900">{group.teacherName || 'Biriktirilmagan'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiClock className="text-gray-400" />
                  <span>Vaqt: {group.schedule || 'Belgilanmagan'}</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Fan</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dars vaqti (Masalan: Dushanba-Chorshanba-Juma 14:00)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
