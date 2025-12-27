import React from 'react';
import { Bell, LogOut, Menu, Shield, RefreshCw, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
      // Optionally show a success message or reload the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 mr-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">TownTripHub</h1>
              <div className="flex items-center mt-1">
                <p className="text-xs lg:text-sm text-gray-600">
                  Welcome back, {user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0]}
                </p>
                {user?.role === 'driver' && (
                  <span className="ml-2 bg-green-100 text-green-800 text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Driver
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Admin button - only show for admin users */}
            {user?.role === 'admin' && (
              <button
                onClick={handleAdminClick}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Driver button - only show for driver users */}
            {user?.role === 'driver' && (
              <button
                onClick={handleDriverClick}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Driver Dashboard"
              >
                <Car className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Driver</span>
              </button>
            )}

            {/* Refresh user data button */}
            <button
              onClick={handleRefreshUser}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Refresh user data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="h-6 w-6" />
            </button>
            <button
              onClick={logout}
              className="hidden sm:flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
            {/* Mobile logout button */}
            <button
              onClick={logout}
              className="sm:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
