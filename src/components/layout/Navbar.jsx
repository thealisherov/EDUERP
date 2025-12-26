import { FiBell, FiSettings, FiUser, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <FiMenu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {/* Dynamic Title could go here based on route */}
            Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <FiBell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSettings className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
