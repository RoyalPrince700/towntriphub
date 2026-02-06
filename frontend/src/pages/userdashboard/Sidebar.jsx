import React from 'react';
import {
  User,
  MapPin,
  Calendar,
  LayoutDashboard,
  Settings,
  Car,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import towntriphublogo from '../../assets/towntriphublogo.png';

const Sidebar = ({
  user,
  activeTab,
  setActiveTab,
  activeService,
  setActiveService,
  isMobile = false,
  isCollapsed = false,
  isOpen = false,
  setIsCollapsed = () => {},
  onClose = () => {}
}) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Stats & Activity' },
    { id: 'ride', label: 'Book a Ride', icon: Car, description: 'Request transport' },
    { id: 'delivery', label: 'Send Package', icon: Package, description: 'Fast logistics' },
    { id: 'history', label: 'History', icon: Calendar, description: 'Your past trips' },
  ];

  const secondaryItems = [
    { id: 'payments', label: 'Payments', icon: CreditCard, description: 'Wallet & Cards' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, description: 'Get assistance' },
  ];

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Account details' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <aside className={`
        ${isMobile
          ? `fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : `${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-100 h-full sticky top-16 transition-all duration-300 ease-in-out`
        }
        flex flex-col
      `}>
        {/* Toggle Button - Desktop Only */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 z-20 bg-white border border-gray-100 rounded-full p-1.5 shadow-sm hover:shadow-md hover:text-purple-600 transition-all flex items-center justify-center group"
          >
            {isCollapsed ? (
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            )}
          </button>
        )}

        {/* Header - Mobile Only */}
        {isMobile && (
          <div className="flex justify-between items-center p-6 border-b border-gray-50">
            <div className="flex items-center space-x-2">
              <img
                src={towntriphublogo}
                alt="TownTripHub Logo"
                className="w-8 h-8 rounded-lg"
              />
            
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-8 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
          {/* Main Navigation */}
          <nav className="space-y-1.5">
            {(!isCollapsed || isMobile) && (
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) onClose();
                  }}
                  className={`w-full group flex items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-purple-600'
                  } ${!isMobile && isCollapsed ? 'p-3 justify-center' : 'px-4 py-3'}`}
                  title={!isMobile && isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className={`${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                  {(!isCollapsed || isMobile) && (
                    <div className="flex flex-col items-start overflow-hidden whitespace-nowrap">
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary Links */}
          <nav className="space-y-1.5">
            {(!isCollapsed || isMobile) && (
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Platform</p>
            )}
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) onClose();
                  }}
                  className={`w-full group flex items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-purple-600'
                  } ${!isMobile && isCollapsed ? 'p-3 justify-center' : 'px-4 py-3'}`}
                >
                  <Icon size={20} className={`${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account Section */}
          <nav className="space-y-1.5">
            {(!isCollapsed || isMobile) && (
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account</p>
            )}
            {accountItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) onClose();
                  }}
                  className={`w-full group flex items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-purple-600'
                  } ${!isMobile && isCollapsed ? 'p-3 justify-center' : 'px-4 py-3'}`}
                >
                  <Icon size={20} className={`${!isMobile && isCollapsed ? '' : 'mr-3'}`} />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - User Badge */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 mt-auto border-t border-gray-50">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-purple-600 font-bold">
                {user?.email ? user.email[0].toUpperCase() : (user?.name?.[0].toUpperCase() || <User size={20} />)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.email ? user.email.split('@')[0] : (user?.name || 'User')}
                </p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Verified {user?.email ? user.email.split('@')[0] : user?.role}</p>
              </div>
              {user?.role === 'admin' && (
                <Shield size={16} className="text-red-500" />
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
