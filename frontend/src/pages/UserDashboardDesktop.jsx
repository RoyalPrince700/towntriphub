import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BookingStatusDashboard from '../components/BookingStatusDashboard';
import Sidebar from './userdashboard/Sidebar';
import Header from './userdashboard/Header';
import Overview from './userdashboard/Overview';
import RideBookingFlow from './userdashboard/RideBookingFlow';
import DeliveryBookingFlow from './userdashboard/DeliveryBookingFlow';
import Profile from './userdashboard/Profile';
import BookingHistory from './userdashboard/BookingHistory';
import { Settings } from 'lucide-react';

export default function UserDashboardDesktop() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeService, setActiveService] = useState('ride');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Desktop Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header user={user} logout={logout} />
      </div>

      {/* Fixed Desktop Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 z-30">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeService={activeService}
          setActiveService={setActiveService}
          isMobile={false}
        />
      </div>

      {/* Main Content - Scrollable area */}
      <div className="ml-80 mt-16 min-h-screen">
        <div className="p-6 overflow-y-auto h-full">
          {activeTab === 'overview' && <Overview stats={stats} />}

          {activeTab === 'ride' && <RideBookingFlow user={user} />}

          {activeTab === 'delivery' && <DeliveryBookingFlow user={user} />}

          {activeTab === 'history' && <BookingHistory stats={stats} />}

          {activeTab === 'profile' && <Profile user={user} />}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-500 text-sm">Account settings and preferences</p>
                <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
