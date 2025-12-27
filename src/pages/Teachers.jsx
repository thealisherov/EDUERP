import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teacherSalariesApi } from '../api/teacher-salaries.api';
import { getUserBranchId } from '../api/helpers';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Teachers = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'salaries'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    salaryType: 'FIXED', // FIXED, PERCENTAGE, MIXED
    baseSalary: '',
    paymentPercentage: '',
  });

  // Salary Modal State
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedTeacherForSalary, setSelectedTeacherForSalary] = useState(null);
  const [salaryFormData, setSalaryFormData] = useState({
    amount: '',
    description: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const { data: teachers = [], isLoading: loading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await teachersApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => teachersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => teachersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => teachersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  });

  const salaryPaymentMutation = useMutation({
    mutationFn: (data) => teacherSalariesApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      queryClient.invalidateQueries(['teacherSalaries']);
    },
  });

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        phoneNumber: teacher.phoneNumber,
        salaryType: teacher.salaryType || 'FIXED',
        baseSalary: teacher.baseSalary || '',
        paymentPercentage: teacher.paymentPercentage || ''
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        salaryType: 'FIXED',
        baseSalary: '',
        paymentPercentage: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        baseSalary: formData.baseSalary ? parseFloat(formData.baseSalary) : 0,
        paymentPercentage: formData.paymentPercentage ? parseFloat(formData.paymentPercentage) : 0,
        branchId: getUserBranchId()
      };

      if (payload.branchId) {
          payload.branchId = Number(payload.branchId);
      }

      if (editingTeacher) {
        await updateMutation.mutateAsync({ id: editingTeacher.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving teacher:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Xatolik yuz berdi';
      alert(`Xatolik: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  // Salary Handling
  const handleOpenSalaryModal = (teacher) => {
    setSelectedTeacherForSalary(teacher);
    const today = new Date();
    setSalaryFormData({
      amount: '',
      description: `Salary for ${teacher.firstName} ${teacher.lastName}`,
      year: today.getFullYear(),
      month: today.getMonth() + 1
    });
    setIsSalaryModalOpen(true);
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    try {
      const branchId = getUserBranchId();
      await salaryPaymentMutation.mutateAsync({
        teacherId: selectedTeacherForSalary.id,
        amount: parseFloat(salaryFormData.amount),
        description: salaryFormData.description,
        year: parseInt(salaryFormData.year),
        month: parseInt(salaryFormData.month),
        branchId: branchId ? Number(branchId) : null
      });
      setIsSalaryModalOpen(false);
      alert('To\'lov muvaffaqiyatli amalga oshirildi');
    } catch (error) {
      console.error('Error paying salary:', error);
      alert('Xatolik yuz berdi');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">O'qituvchilar</h1>
          <p className="text-gray-600 mt-1">O'qituvchilar va ularning maoshlari</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className=" cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus /> Yangi O'qituvchi
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`cursor-pointer px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Ro'yxat
        </button>
        <button
          className={` cursor-pointer px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'salaries'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('salaries')}
        >
          Maoshlar Tarixi
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ism Familiya</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Telefon</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Maosh Turi</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Maosh</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Foiz</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Yuklanmoqda...</td>
                  </tr>
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">O'qituvchilar topilmadi</td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{teacher.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          teacher.salaryType === 'FIXED' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {teacher.salaryType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {teacher.baseSalary ? `${teacher.baseSalary.toLocaleString()} UZS` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {teacher.paymentPercentage ? `${teacher.paymentPercentage}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenSalaryModal(teacher)}
                            className="cursor-pointer p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Maosh to'lash"
                          >
                            <FiDollarSign />
                          </button>
                          <button
                            onClick={() => handleOpenModal(teacher)}
                            className="cursor-pointer p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="cursor-pointer p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <SalaryHistory />
      )}

      {/* Teacher Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maosh Turi</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.salaryType}
                onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
              >
                <option value="FIXED">Fixed (Oylik)</option>
                <option value="PERCENTAGE">Percentage (Foiz)</option>
                <option value="MIXED">Mixed (Aralash)</option>
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asosiy Maosh (UZS)</label>
              <input
                type="number"
                disabled={formData.salaryType === 'PERCENTAGE'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foiz (%)</label>
              <input
                type="number"
                disabled={formData.salaryType === 'FIXED'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                value={formData.paymentPercentage}
                onChange={(e) => setFormData({ ...formData, paymentPercentage: e.target.value })}
              />
            </div>
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

      {/* Salary Payment Modal */}
      <Modal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        title={`Maosh to'lash: ${selectedTeacherForSalary?.name}`}
      >
        <form onSubmit={handleSalarySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summa (UZS)</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={salaryFormData.amount}
              onChange={(e) => setSalaryFormData({ ...salaryFormData, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={salaryFormData.description}
              onChange={(e) => setSalaryFormData({ ...salaryFormData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yil</label>
                <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={salaryFormData.year}
                onChange={(e) => setSalaryFormData({ ...salaryFormData, year: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oy</label>
                <input
                type="number"
                required
                min="1"
                max="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={salaryFormData.month}
                onChange={(e) => setSalaryFormData({ ...salaryFormData, month: e.target.value })}
                />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsSalaryModalOpen(false)}
              className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              To'lash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SalaryHistory = () => {
  // Simple placeholder for salary history. In a real app, this would fetch data from teacherSalariesApi
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
      Maoshlar tarixi ushbu qismda ko'rinadi.
    </div>
  );
};

export default Teachers;
