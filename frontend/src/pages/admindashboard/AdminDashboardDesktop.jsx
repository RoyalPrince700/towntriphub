import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import BookingManagement from './BookingManagement';
import DriverManagement from './DriverManagement';
import LogisticsManagement from './LogisticsManagement';
import LogisticsPersonnelManagement from './LogisticsPersonnelManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import SystemSettings from './SystemSettings';

const AdminDashboardDesktop = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'bookings':
        return <BookingManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'logistics':
        return <LogisticsManagement />;
      case 'logistics-personnel':
        return <LogisticsPersonnelManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Desktop Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <AdminHeader user={user} onMenuClick={() => setIsMobileSidebarOpen(true)} />
      </div>

      {/* Mobile Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={true}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Fixed Desktop Sidebar */}
      <div className="fixed left-0 top-20 bottom-0 z-30 hidden lg:block">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main Content - Scrollable area */}
      <div className={`mt-20 min-h-screen transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } ml-0`}>
        <div className="p-6 overflow-y-auto h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardDesktop;
