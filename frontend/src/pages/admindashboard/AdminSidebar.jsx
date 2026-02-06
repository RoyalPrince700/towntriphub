import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Car,
  Users,
  Package,
  UserCheck,
  TrendingUp,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  isOpen = false,
  onClose = () => {}
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Dashboard & stats' },
    { id: 'bookings', label: 'Bookings', icon: Car, description: 'Manage all bookings' },
    { id: 'drivers', label: 'Drivers', icon: UserCheck, description: 'Driver management' },
    { id: 'logistics', label: 'Logistics', icon: Package, description: 'Logistics orders' },
    { id: 'logistics-personnel', label: 'Logistics Personnel', icon: Shield, description: 'Delivery personnel' },
    { id: 'users', label: 'Users', icon: Users, description: 'User management' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Reports & insights' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div className={`
        ${isMobile
          ? `fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 flex transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : `${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-full flex relative transition-all duration-300 ease-in-out`
        }
        flex-col
      `}>
        {/* Toggle Button - Desktop Only */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Mobile close button & Admin Badge */}
        {isMobile && (
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              <Shield className="h-3 w-3 mr-1" />
              {user?.email ? user.email.split('@')[0] : 'Admin'}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
          {/* Main Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) onClose();
                  }}
                  className={`w-full flex items-center text-left rounded-lg transition-all duration-300 ${
                    !isMobile && isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-3'
                  } ${
                    activeTab === item.id
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!isMobile && isCollapsed ? item.label : undefined}
                >
                  <IconComponent className={`h-5 w-5 flex-shrink-0 ${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                  {(!isCollapsed || isMobile) && (
                    <div className="opacity-100 transition-opacity duration-300">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Option at Bottom */}
        <div className={`border-t border-gray-100 transition-all duration-300 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-left rounded-lg transition-all duration-300 ${
              !isMobile && isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-3'
            } text-red-600 hover:bg-red-50 hover:text-red-700`}
            title={!isMobile && isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 ${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
            {(!isCollapsed || isMobile) && (
              <div className="opacity-100 transition-opacity duration-300">
                <div className="font-medium">Logout</div>
                <div className="text-xs text-red-400">Sign out of session</div>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
