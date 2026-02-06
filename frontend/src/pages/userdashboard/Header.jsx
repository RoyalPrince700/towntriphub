import React from 'react';
import { Bell, LogOut, Menu, Shield, RefreshCw, Car, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import towntriphublogo from '../../assets/towntriphublogo.png';

const Header = ({ user, logout, onMenuClick }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleDriverClick = () => {
    navigate('/dashboard');
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>

            <div className="hidden sm:flex items-center space-x-2">
              <img
                src={towntriphublogo}
                alt="TownTripHub Logo"
                className="w-8 h-8 rounded-lg"
              />
           
            </div>
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
            
           
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Action Buttons */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {user?.role === 'admin' && (
                <button
                  onClick={handleAdminClick}
                  className="hidden md:flex items-center px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all"
                >
                  <Shield size={16} className="mr-2" />
                  <span>Admin</span>
                </button>
              )}

              {user?.role === 'driver' && (
                <button
                  onClick={handleDriverClick}
                  className="hidden md:flex items-center px-3 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-bold hover:bg-green-100 transition-all"
                >
                  <Car size={16} className="mr-2" />
                  <span>Driver Mode</span>
                </button>
              )}

              <button
                onClick={handleRefreshUser}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>

              <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200"></div>

            {/* Profile Dropdown Simulation */}
            <div className="flex items-center space-x-3 pl-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {user?.email ? user.email.split('@')[0] : (user?.name || 'User')}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                  {user?.email ? user.email.split('@')[0] : (user?.role || 'Rider')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold shadow-sm">
                {user?.email ? user.email[0].toUpperCase() : (user?.name ? user.name[0].toUpperCase() : <User size={20} />)}
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
