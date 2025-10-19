import React from 'react';
import { Settings, Truck, Package, FileText, Phone, Mail } from 'lucide-react';

const Profile = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Logistics Profile</h2>
        <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">+220 123 4567</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Logistics License Information */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Logistics License Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">LOG-2024-005678</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Delivery Personnel</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">March 2026</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Valid
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-green-600" />
            Delivery Vehicle Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Motorcycle</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Honda CB300R</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">DEL 456 G</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Red</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">2021</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">50kg</p>
            </div>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-purple-600" />
            Delivery Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Areas</label>
              <div className="space-y-1">
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Serrekunda</p>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Kairaba Avenue</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Areas</label>
              <div className="space-y-1">
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Brikama</p>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Bakau</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Preferences */}
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
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Delivery Request Alerts</span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Jane Smith</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">+220 987 6543</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
