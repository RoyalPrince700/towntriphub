import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BookingStatusDashboard from '../components/BookingStatusDashboard';
import Sidebar from './userdashboard/Sidebar';
import Header from './userdashboard/Header';
import Overview from './userdashboard/Overview';
import RideBookingFlow from './userdashboard/RideBookingFlow';
import DeliveryBookingFlow from './userdashboard/DeliveryBookingFlow';
import Profile from './userdashboard/Profile';
import Settings from './userdashboard/Settings';
import BookingHistory from './userdashboard/BookingHistory';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      const response = await getDriverProfile();
      if (response.success) {
        setDriverProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch driver status:', error);
    }
  };

  const fetchLogisticsStatus = async () => {
    try {
      const response = await getLogisticsProfile();
      if (response.success) {
        setLogisticsProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch logistics status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Header */}
      <Header user={user} logout={logout} onMenuClick={() => setIsMobileSidebarOpen(true)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeService={activeService}
            setActiveService={setActiveService}
            isMobile={false}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeService={activeService}
          setActiveService={setActiveService}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out`}>
          <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
            {activeTab === 'overview' && (
              <Overview 
                stats={stats} 
                recentBookings={recentBookings} 
                driverProfile={driverProfile}
                logisticsProfile={logisticsProfile}
              />
            )}

            {activeTab === 'ride' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <RideBookingFlow user={user} />
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DeliveryBookingFlow user={user} />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BookingHistory stats={stats} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Profile user={user} />
              </div>
            )}

            {activeTab === 'settings' && (
              <Settings />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
