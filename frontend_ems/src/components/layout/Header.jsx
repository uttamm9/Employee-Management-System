import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { Menu, LogOut, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = ({ onOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Overview';
    if (pathname.startsWith('/employees/add')) return 'Add New Employee';
    if (pathname.includes('/edit')) return 'Edit Employee Record';
    if (pathname.startsWith('/employees/')) return 'Employee Profile Details';
    if (pathname.startsWith('/employees')) return 'Employee Directory';
    if (pathname.startsWith('/profile')) return 'My Personal Profile';
    return 'Workforce System';
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* User Info Pill */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2.5 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-semibold text-gray-900">{user?.name}</p>
            <p className="text-[11px] text-gray-500 capitalize">{user?.role} Account</p>
          </div>
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
