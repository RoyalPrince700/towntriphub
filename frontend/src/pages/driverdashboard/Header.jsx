import React from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';

const Header = ({ user, logout, onMenuClick }) => {
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
              <p className="mt-1 text-xs lg:text-sm text-gray-600">
                Driver Dashboard - Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
