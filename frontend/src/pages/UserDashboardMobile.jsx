import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BookingStatusDashboard from '../components/BookingStatusDashboard';
import MobileHomeActions from './userdashboard/MobileHomeActions';
import RideBookingFlow from './userdashboard/RideBookingFlow';
import DeliveryBookingFlow from './userdashboard/DeliveryBookingFlow';
import Profile from './userdashboard/Profile';
import BookingHistory from './userdashboard/BookingHistory';
import { Settings, Home, MapPin, Calendar, User, Menu, X, Package } from 'lucide-react';

export default function UserDashboardMobile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeService, setActiveService] = useState('ride');
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/bookings/stats');

      // Mock stats for now
      setStats({
        totalBookings: 24,
        completedBookings: 22,
        cancelledBookings: 2,
        totalSpent: 1850,
        completionRate: 92,
        rideBookings: 18,
        deliveryBookings: 6
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // Important tabs for bottom navigation
  const navigationTabs = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'ride', label: 'Ride', icon: MapPin },
    { id: 'delivery', label: 'Delivery', icon: Package },
    { id: 'history', label: 'History', icon: Calendar },
  ];

  // Menu items for hamburger dropdown
  const hamburgerMenuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentTab = navigationTabs.find(tab => tab.id === activeTab);
  const IconComponent = currentTab?.icon || Home;

  // Handle service selection from home actions
  const handleServiceSelect = (serviceType) => {
    setActiveService(serviceType);
    setActiveTab(serviceType); // Navigate to the specific service tab (ride or delivery)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-5 w-5 text-indigo-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{currentTab?.label}</h1>
                <p className="text-xs text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showHamburgerMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Hamburger Menu Dropdown */}
          {showHamburgerMenu && (
            <div className="mt-3 bg-white border rounded-lg shadow-lg overflow-hidden">
              {hamburgerMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowHamburgerMenu(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-4 w-4 mr-3 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </button>
                );
              })}
              {/* Logout option */}
              <div className="border-t">
                <button
                  onClick={() => {
                    logout();
                    setShowHamburgerMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {activeTab === 'overview' && <MobileHomeActions onServiceSelect={handleServiceSelect} />}

        {activeTab === 'ride' && <RideBookingFlow user={user} />}

        {activeTab === 'delivery' && <DeliveryBookingFlow user={user} />}

        {activeTab === 'history' && <BookingHistory stats={stats} />}

        {activeTab === 'profile' && <Profile user={user} />}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-lg p-3">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="text-center py-6">
              <Settings className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-500 text-xs">Account settings and preferences</p>
              <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
