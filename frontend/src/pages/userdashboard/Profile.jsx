import React from 'react';
import { Settings } from 'lucide-react';

const Profile = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Profile Settings</h2>
        <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{user?.role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">January 2024</p>
          </div>
        </div>

        {/* Additional profile sections can be added here */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Account Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
