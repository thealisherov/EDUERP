import React, { useState, useEffect } from 'react';
import { reportsApi } from '../api/reports.api';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('financial'); // financial, payments, expenses
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Date Range Filters
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        let response;
        const params = { startDate, endDate };

        if (activeTab === 'financial') {
          response = await reportsApi.getFinancialSummaryRange(params);
        } else if (activeTab === 'payments') {
          response = await reportsApi.getPaymentsRange(params);
        } else if (activeTab === 'expenses') {
          response = await reportsApi.getExpensesRange(params);
        }

        setReportData(response?.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [activeTab, startDate, endDate]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hisobotlar</h1>
        <p className="text-gray-600 mt-1">Moliya, to'lovlar va xarajatlar tahlili</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {['financial', 'payments', 'expenses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'financial' && 'Moliya'}
              {tab === 'payments' && 'To\'lovlar'}
              {tab === 'expenses' && 'Xarajatlar'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1 md:flex-none">
             <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'financial' && reportData && (
            <FinancialReport data={reportData} />
          )}
          {activeTab === 'payments' && reportData && (
            <PaymentsReport data={reportData} />
          )}
          {activeTab === 'expenses' && reportData && (
            <ExpensesReport data={reportData} />
          )}
        </div>
      )}
    </div>
  );
};

const FinancialReport = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-medium">Jami Kirim</h3>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FiTrendingUp className="text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{data.totalIncome?.toLocaleString() || 0} UZS</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-medium">Jami Chiqim</h3>
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FiTrendingDown className="text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{data.totalExpense?.toLocaleString() || 0} UZS</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-medium">Sof Foyda</h3>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiDollarSign className="text-blue-600" />
          </div>
        </div>
        <p className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {data.netProfit?.toLocaleString() || 0} UZS
        </p>
      </div>
    </div>
  );
};

const PaymentsReport = ({ data }) => {
  // Assuming data is an array of payments or has a list property
  const list = Array.isArray(data) ? data : data.payments || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-700">To'lovlar Ro'yxati</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sana</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">O'quvchi</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summa</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Turi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.length === 0 ? (
               <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Ma'lumot topilmadi</td>
              </tr>
            ) : (
              list.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.studentName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">+{item.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExpensesReport = ({ data }) => {
  const list = Array.isArray(data) ? data : data.expenses || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-700">Xarajatlar Ro'yxati</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sana</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kategoriya</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summa</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Izoh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
             {list.length === 0 ? (
               <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Ma'lumot topilmadi</td>
              </tr>
            ) : (
              list.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">-{item.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
