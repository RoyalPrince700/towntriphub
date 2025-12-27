import React from 'react';
import {
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Settings,
  Car,
  Package,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  setActiveTab,
  activeService,
  setActiveService,
  isMobile = false,
  isCollapsed = false,
  setIsCollapsed = () => {},
  onClose = () => {}
}) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, description: 'Dashboard & stats' },
    { id: 'ride', label: 'Book a Ride', icon: Car, description: 'Get picked up anywhere' },
    { id: 'delivery', label: 'Send Package', icon: Package, description: 'Reliable delivery service' },
    { id: 'history', label: 'History', icon: Calendar, description: 'Past bookings & activity' },
  ];

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your account' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'App preferences' },
  ];

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
          : `${isCollapsed ? 'w-16' : 'w-80'} bg-white shadow-lg h-full flex relative transition-all duration-300 ease-in-out`
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

        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
          {/* Unified Navigation */}
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
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!isMobile && isCollapsed ? item.label : undefined}
                >
                  <IconComponent className={`h-5 w-5 flex-shrink-0 ${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                  {(!isCollapsed || isMobile) && (
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account Section */}
          <div className={`border-t mt-4 ${!isMobile && isCollapsed ? 'pt-2' : 'pt-4'}`}>
            <nav className="space-y-2">
              {accountItems.map((item) => {
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
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={!isMobile && isCollapsed ? item.label : undefined}
                  >
                    <IconComponent className={`h-5 w-5 flex-shrink-0 ${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                    {(!isCollapsed || isMobile) && (
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
