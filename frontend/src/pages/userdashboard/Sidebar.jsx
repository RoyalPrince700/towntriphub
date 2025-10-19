import React from 'react';
import {
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Settings,
  Car,
  Package,
  X
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  setActiveTab,
  activeService,
  setActiveService,
  isMobile = false,
  onClose = () => {}
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div className={`
        ${isMobile
          ? 'fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex'
          : 'w-80 bg-white shadow-lg h-full flex'
        }
        flex-col
      `}>
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {/* Unified Navigation */}
          <nav className="space-y-2">
            {/* Overview/Home */}
            <button
              onClick={() => {
                setActiveTab('overview');
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">Overview</div>
                <div className="text-xs text-gray-500">Dashboard & stats</div>
              </div>
            </button>

            {/* Ride Booking */}
            <button
              onClick={() => setActiveTab('ride')}
              className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'ride'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Car className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">Book a Ride</div>
                <div className="text-xs text-gray-500">Get picked up anywhere</div>
              </div>
            </button>

            {/* Package Delivery */}
            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'delivery'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">Send Package</div>
                <div className="text-xs text-gray-500">Reliable delivery service</div>
              </div>
            </button>

            {/* Booking History */}
            <button
              onClick={() => {
                setActiveTab('history');
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">History</div>
                <div className="text-xs text-gray-500">Past bookings & activity</div>
              </div>
            </button>
          </nav>

          {/* Account Section */}
          <div className="border-t pt-4">
            <nav className="space-y-2">
              {/* Profile */}
              <button
                onClick={() => {
                  setActiveTab('profile');
                  if (isMobile) onClose();
                }}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium">Profile</div>
                  <div className="text-xs text-gray-500">Manage your account</div>
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  setActiveTab('settings');
                  if (isMobile) onClose();
                }}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-gray-500">App preferences</div>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
