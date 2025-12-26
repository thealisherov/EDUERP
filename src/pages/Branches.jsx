import { useState, useEffect } from 'react';
import { branchesApi } from '../api/branches.api';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import Modal from '../components/common/Modal';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchesApi.getAll();
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await branchesApi.update(editingBranch.id, formData);
      } else {
        await branchesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu filialni o\'chirmoqchimisiz?')) {
      try {
        await branchesApi.delete(id);
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Filiallar</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus /> Yangi Filial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Yuklanmoqda...</div>
        ) : branches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">Filiallar topilmadi</div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiMapPin className="text-blue-600 w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(branch)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{branch.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{branch.address}</p>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500">O'quvchilar:</span>
                <span className="font-semibold text-gray-900">{branch.studentCount || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? "Filialni tahrirlash" : "Yangi filial"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filial nomi</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default Branches;
