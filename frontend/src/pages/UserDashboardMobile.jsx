import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BookingStatusDashboard from '../components/BookingStatusDashboard';
import MobileHomeActions from './userdashboard/MobileHomeActions';
import RideBookingFlow from './userdashboard/RideBookingFlow';
import DeliveryBookingFlow from './userdashboard/DeliveryBookingFlow';
import Profile from './userdashboard/Profile';
import Settings from './userdashboard/Settings';
import BookingHistory from './userdashboard/BookingHistory';
import Overview from './userdashboard/Overview';
import SavedPlacesModal from '../components/SavedPlacesModal';
import { Settings as SettingsIcon, Home, MapPin, Calendar, User, Menu, X, Package, LogOut } from 'lucide-react';
import { getBookingStats, getUserBookings } from '../services/bookingService';
import { getDriverProfile } from '../services/driverService';
import { getLogisticsProfile } from '../services/logisticsService';
import towntriphublogo from '../assets/towntriphublogo.png';

export default function UserDashboardMobile() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeService, setActiveService] = useState('ride');
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [logisticsProfile, setLogisticsProfile] = useState(null);
  const [showSavedPlacesModal, setShowSavedPlacesModal] = useState(false);
  const [selectedSavedPlace, setSelectedSavedPlace] = useState(null);

  useEffect(() => {
    fetchUserStats();
    fetchRecentBookings();
    fetchDriverStatus();
    fetchLogisticsStatus();
  }, []);

  // Clear selected saved place when navigating away from ride tab
  useEffect(() => {
    if (activeTab !== 'ride') {
      setSelectedSavedPlace(null);
    }
  }, [activeTab]);

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
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const currentTab = navigationTabs.find(tab => tab.id === activeTab);
  const IconComponent = currentTab?.icon || Home;

  // Handle service selection from home actions
  const handleServiceSelect = (serviceType) => {
    setActiveService(serviceType);
    setActiveTab(serviceType); // Navigate to the specific service tab (ride or delivery)
  };

  // Handle quick action selection from home actions
  const handleQuickActionSelect = (actionType) => {
    if (actionType === 'savedPlaces') {
      // Show saved places modal
      setShowSavedPlacesModal(true);
    } else if (actionType === 'schedule') {
      // Navigate to ride booking for scheduling
      setActiveService('ride');
      setActiveTab('ride');
    }
  };

  // Handle saved place selection from modal
  const handleSavedPlaceSelect = (place) => {
    // Store the selected place and navigate to ride booking
    setSelectedSavedPlace(place);
    setActiveService('ride');
    setActiveTab('ride');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={towntriphublogo}
            alt="TownTripHub Logo"
            className="w-10 h-10 rounded-xl shadow-lg"
          />
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">{currentTab?.label}</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Welcome, {user?.email ? user.email.split('@')[0] : (user?.name ? user.name.split(' ')[0] : 'Hero')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
          className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:text-purple-600 transition-colors"
        >
          {showHamburgerMenu ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Hamburger Dropdown */}
        {showHamburgerMenu && (
          <div className="absolute top-[calc(100%+12px)] right-4 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 space-y-1">
              {hamburgerMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowHamburgerMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-left rounded-2xl hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <item.icon size={18} className="mr-3 text-gray-400" />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
              <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
              <button
                onClick={() => {
                  logout();
                  setShowHamburgerMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 text-left rounded-2xl hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span className="text-sm font-bold">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MobileHomeActions onServiceSelect={handleServiceSelect} onQuickActionSelect={handleQuickActionSelect} />
            <Overview 
              stats={stats} 
              recentBookings={recentBookings} 
              driverProfile={driverProfile}
              logisticsProfile={logisticsProfile}
            />
          </div>
        )}

        {(activeTab === 'ride' || activeTab === 'delivery' || activeTab === 'history' || activeTab === 'profile' || activeTab === 'settings') && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'ride' && (
              <RideBookingFlow
                user={user}
                prefilledPickup={selectedSavedPlace?.type === 'pickup' ? selectedSavedPlace.address : ''}
                prefilledDestination={selectedSavedPlace?.type === 'destination' ? selectedSavedPlace.address : ''}
              />
            )}
            {activeTab === 'delivery' && <DeliveryBookingFlow user={user} />}
            {activeTab === 'history' && <BookingHistory stats={stats} />}
            {activeTab === 'profile' && <Profile user={user} />}
            {activeTab === 'settings' && <Settings />}
          </div>
        )}
      </main>

      {/* Saved Places Modal */}
      <SavedPlacesModal
        isOpen={showSavedPlacesModal}
        onClose={() => setShowSavedPlacesModal(false)}
        onSelectPlace={handleSavedPlaceSelect}
      />

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-gray-900/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 z-50 border border-white/10">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ${
                isActive ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-purple-600 rounded-2xl -z-10 shadow-lg shadow-purple-500/40"></div>
              )}
              <Icon size={20} />
              <span className={`text-[10px] font-black uppercase mt-1 tracking-tighter ${isActive ? 'block' : 'hidden'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
