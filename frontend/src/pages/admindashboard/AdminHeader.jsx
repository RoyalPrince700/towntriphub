import React from 'react';
import { Bell, Shield } from 'lucide-react';

const AdminHeader = ({ user }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">TownTripHub</h1>
              <p className="mt-1 text-xs lg:text-sm text-gray-600">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Admin badge */}
            <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
