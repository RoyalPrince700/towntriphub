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
import { getBookingStats, getUserBookings } from '../services/bookingService';
import { getDriverProfile } from '../services/driverService';
import { getLogisticsProfile } from '../services/logisticsService';

export default function UserDashboardDesktop() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeService, setActiveService] = useState('ride');
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [logisticsProfile, setLogisticsProfile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchUserStats();
    fetchRecentBookings();
    fetchDriverStatus();
    fetchLogisticsStatus();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await getBookingStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await getUserBookings({ limit: 5 });
      if (response.success) {
        setRecentBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent bookings:', error);
    }
  };

  const fetchDriverStatus = async () => {
    try {
      const response = await getDriverProfile(token);
      if (response.success) {
        setDriverProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch driver status:', error);
    }
  };

  const fetchLogisticsStatus = async () => {
    try {
      const response = await getLogisticsProfile(token);
      if (response.success) {
        setLogisticsProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch logistics status:', error);
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
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content - Scrollable area */}
      <div className={`mt-16 min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-16' : 'ml-80'
      }`}>
        <div className="p-6 overflow-y-auto h-full">
          {activeTab === 'overview' && (
            <Overview 
              stats={stats} 
              recentBookings={recentBookings} 
              driverProfile={driverProfile}
              logisticsProfile={logisticsProfile}
            />
          )}

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
