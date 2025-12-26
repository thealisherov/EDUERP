import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import { FiUsers, FiUserCheck, FiCreditCard, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Jami O\'quvchilar',
      value: stats?.totalStudents || '0',
      icon: FiUsers,
      bgColor: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'O\'qituvchilar',
      value: stats?.totalTeachers || '0',
      icon: FiUserCheck,
      bgColor: 'from-purple-500 to-purple-600',
      change: '+5%',
    },
    {
      title: 'Oylik To\'lovlar',
      value: `${stats?.monthlyRevenue?.toLocaleString() || '0'} UZS`,
      icon: FiCreditCard,
      bgColor: 'from-green-500 to-green-600',
      change: '+18%',
    },
    {
      title: 'Umumiy Daromad',
      value: `${stats?.totalRevenue?.toLocaleString() || '0'} UZS`,
      icon: FiTrendingUp,
      bgColor: 'from-orange-500 to-orange-600',
      change: '+24%',
    },
  ];

  const quickActions = [
    { label: 'Yangi O\'quvchi', path: '/students', icon: FiPlus },
    { label: 'Yangi Guruh', path: '/groups', icon: FiPlus },
    { label: 'To\'lov Qabul Qilish', path: '/payments', icon: FiCreditCard },
    { label: 'Hisobot Ko\'rish', path: '/reports', icon: FiTrendingUp },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tizim ko'rsatkichlari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </h3>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {card.change} from last month
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            So'nggi Faoliyat
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Yangi o'quvchi qo'shildi
                  </p>
                  <p className="text-xs text-gray-500">{i} soat oldin</p>
                </div>
              </div>
            ))}
             <p className="text-center text-gray-400 text-sm mt-4">Ko'proq ma'lumotlar yaqinda...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Tez Harakatlar
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-center"
              >
                <action.icon className="h-6 w-6 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
