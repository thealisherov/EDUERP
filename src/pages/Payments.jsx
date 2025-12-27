import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments.api';
import { studentsApi } from '../api/students.api';
import { getUserBranchId } from '../api/helpers';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Payments = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [formData, setFormData] = useState({
    studentId: '',
    groupId: '',
    amount: '',
    description: '',
    paymentYear: new Date().getFullYear(),
    paymentMonth: new Date().getMonth() + 1
  });

  const { data: payments = [], isLoading: loading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await paymentsApi.getAll();
      return response.data;
    },
  });

  // Fetch groups for the selected student
  const [studentGroups, setStudentGroups] = useState([]);
  const handleStudentChange = async (studentId) => {
      setFormData(prev => ({ ...prev, studentId, groupId: '' }));
      if (studentId) {
          try {
              const response = await studentsApi.getGroups(studentId);
              setStudentGroups(response.data || []);

              // If student has only one group, select it automatically
              if (response.data && response.data.length === 1) {
                   setFormData(prev => ({ ...prev, groupId: response.data[0].id }));
              }
          } catch (error) {
              console.error("Error fetching student groups", error);
              setStudentGroups([]);
          }
      } else {
          setStudentGroups([]);
      }
  };

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await studentsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => paymentsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => paymentsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => paymentsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        studentId: payment.studentId,
        groupId: payment.groupId,
        amount: payment.amount,
        description: payment.description || '',
        paymentYear: payment.paymentYear || new Date().getFullYear(),
        paymentMonth: payment.paymentMonth || new Date().getMonth() + 1
      });
      // Trigger group fetch for existing payment if needed, or prefill if available
      if (payment.studentId) {
          handleStudentChange(payment.studentId);
          // Wait for state update is not possible here directly, but handleStudentChange sets groups.
          // However, we might need to set groupId after groups are fetched.
          // For simplicity, let's assume groups are fetched and user might need to reselect if editing,
          // or we trust the ID. But editing creates a complexity.
          // Actually, UpdatePaymentRequest ONLY allows updating amount.
          // So if editing, we only show Amount field effectively?
          // Let's keep it simple.
      }
    } else {
      setEditingPayment(null);
      setFormData({
        studentId: '',
        groupId: '',
        amount: '',
        description: '',
        paymentYear: new Date().getFullYear(),
        paymentMonth: new Date().getMonth() + 1
      });
      setStudentGroups([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) {
         // UpdatePaymentRequest only has amount
         const payload = {
             amount: parseFloat(formData.amount)
         };
         await updateMutation.mutateAsync({ id: editingPayment.id, data: payload });
      } else {
         const payload = {
             ...formData,
             amount: parseFloat(formData.amount),
             studentId: Number(formData.studentId),
             groupId: Number(formData.groupId),
             paymentYear: Number(formData.paymentYear),
             paymentMonth: Number(formData.paymentMonth),
             branchId: getUserBranchId()
         };
         if (payload.branchId) {
             payload.branchId = Number(payload.branchId);
         }
         await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu to\'lovni o\'chirmoqchimisiz?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">To'lovlar</h1>
          <p className="text-gray-600 mt-1">Barcha to'lovlar tarixi</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus /> Yangi To'lov
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Davr</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Guruh</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summa</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Izoh</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Yuklanmoqda...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">To'lovlar topilmadi</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.paymentMonth}/{payment.paymentYear}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.studentName || 'O\'chirilgan student'}
                    </td>
                     <td className="px-6 py-4 text-sm text-gray-500">
                      {payment.groupName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      {payment.amount?.toLocaleString()} UZS
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {payment.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(payment)}
                          className="cursor-pointer p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayment ? "To'lovni tahrirlash" : "Yangi to'lov"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O'quvchi</label>
            <select
              required
              disabled={!!editingPayment}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
              value={formData.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              <option value="">Tanlang</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guruh</label>
            <select
              required
              disabled={!!editingPayment}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            >
              <option value="">Tanlang</option>
              {studentGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yil</label>
                <input
                type="number"
                required
                disabled={!!editingPayment}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                value={formData.paymentYear}
                onChange={(e) => setFormData({ ...formData, paymentYear: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oy</label>
                <input
                type="number"
                required
                min="1"
                max="12"
                disabled={!!editingPayment}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                value={formData.paymentMonth}
                onChange={(e) => setFormData({ ...formData, paymentMonth: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summa (UZS)</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
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

export default Payments;
