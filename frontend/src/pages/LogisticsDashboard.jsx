import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './logisticsdashboard/Header';
import Sidebar from './logisticsdashboard/Sidebar';
import Overview from './logisticsdashboard/Overview';
import PackageTracking from './logisticsdashboard/PackageTracking';
import RouteManagement from './logisticsdashboard/RouteManagement';
import DeliveryHistory from './logisticsdashboard/DeliveryHistory';
import Profile from './logisticsdashboard/Profile';
import {
  getLogisticsAssignments,
  getLogisticsStatistics,
  getLogisticsProfile,
  getLogisticsEarnings,
  updateLogisticsAssignmentStatus,
} from '../services/logisticsService';

const LogisticsDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect away if the current user is not logistics personnel
  useEffect(() => {
    if (user && user.role !== 'logistics') {
      navigate('/');
    }
  }, [user, navigate]);

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const [statsRes, assignmentsRes, profileRes, earningsRes] = await Promise.all([
        getLogisticsStatistics(token),
        getLogisticsAssignments(token, { status: 'driver_assigned,driver_en_route,picked_up,in_transit,completed,cancelled' }),
        getLogisticsProfile(token),
        getLogisticsEarnings(token).catch(() => null),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (assignmentsRes?.success) setAssignments(assignmentsRes.data || []);
      if (profileRes?.success) setProfile(profileRes.data);
      if (earningsRes?.success) setEarnings(earningsRes.data);
    } catch (err) {
      console.error('Failed to load logistics dashboard data:', err);
      setError(err.message || 'Unable to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const response = await updateLogisticsAssignmentStatus(token, bookingId, { status });
      if (response.success) {
        await loadData(); // Refresh all data
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      setError(err.message || 'Failed to update status');
      return false;
    }
  };

  const activeAssignments = useMemo(
    () =>
      (assignments || []).filter(a =>
        ['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit'].includes(a.status)
      ),
    [assignments]
  );

  const completedAssignments = useMemo(
    () => (assignments || []).filter(a => ['completed', 'cancelled'].includes(a.status)),
    [assignments]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} assignments={assignments} loading={loading} error={error} />;
      case 'deliveries':
        return <PackageTracking assignments={activeAssignments} loading={loading} onUpdateStatus={handleUpdateStatus} />;
      case 'routes':
        return <RouteManagement assignments={assignments} loading={loading} />;
      case 'earnings':
        return <DeliveryHistory assignments={completedAssignments} loading={loading} earnings={earnings} />;
      case 'profile':
        return <Profile user={user} profile={profile} loading={loading} />;
      case 'settings':
        return <Profile user={user} profile={profile} loading={loading} />;
      default:
        return <Overview stats={stats} assignments={assignments} loading={loading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} logout={logout} onMenuClick={() => setIsMobileSidebarOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex">
          {/* Desktop sidebar */}
          <div className="hidden lg:block mr-6">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeService={null}
              setActiveService={() => {}}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Mobile sidebar trigger */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Open Menu
              </button>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <Sidebar
          isMobile
          onClose={() => setIsMobileSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          activeService={null}
          setActiveService={() => {}}
        />
      )}
    </div>
  );
};

export default LogisticsDashboard;

