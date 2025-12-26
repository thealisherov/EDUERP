import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../api/payments.api';
import { studentsApi } from '../api/students.api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    type: 'CASH', // CASH, CARD, etc.
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsApi.getAll();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentsApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        studentId: payment.studentId,
        amount: payment.amount,
        type: payment.type || 'CASH',
        description: payment.description || '',
        date: payment.date ? payment.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setEditingPayment(null);
      setFormData({
        studentId: '',
        amount: '',
        type: 'CASH',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingPayment) {
        await paymentsApi.update(editingPayment.id, payload);
      } else {
        await paymentsApi.create(payload);
      }
      setIsModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu to\'lovni o\'chirmoqchimisiz?')) {
      try {
        await paymentsApi.delete(id);
        fetchPayments();
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus /> Yangi To'lov
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sana</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summa</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Turi</th>
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
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.studentName || 'O\'chirilgan student'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      {payment.amount?.toLocaleString()} UZS
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {payment.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(payment)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              <option value="">Tanlang</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To'lov Turi</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="CASH">Naqd</option>
              <option value="CARD">Karta</option>
              <option value="BANK_TRANSFER">Bank O'tkazmasi</option>
            </select>
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

export default Payments;
