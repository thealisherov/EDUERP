import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiUserCheck, 
  FiGrid, 
  FiCreditCard, 
  FiDollarSign, 
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/students', label: 'O\'quvchilar', icon: FiUsers },
    { path: '/teachers', label: 'O\'qituvchilar', icon: FiUserCheck },
    { path: '/groups', label: 'Guruhlar', icon: FiGrid },
    { path: '/payments', label: 'To\'lovlar', icon: FiCreditCard },
    { path: '/expenses', label: 'Xarajatlar', icon: FiDollarSign },
    { path: '/reports', label: 'Hisobotlar', icon: FiBarChart2 },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">B</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Big Ideas LC</h2>
            <p className="text-xs text-gray-400">ERP System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-r-4 border-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
        >
          <FiLogOut className="h-5 w-5" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;