import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  Wallet,
  Smartphone,
  Mail,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: true
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your preferences and account security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Settings Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Payment Preferences */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 md:p-10 border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center">
              <Wallet size={24} className="mr-3 text-purple-600" />
              Payment Preferences
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Select your preferred payment method for rides and deliveries.</p>
              
              <div 
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-100 bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    paymentMethod === 'cash' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className={`font-bold ${paymentMethod === 'cash' ? 'text-purple-900' : 'text-gray-700'}`}>Cash Payment</p>
                    <p className="text-xs text-gray-400 font-medium">Pay directly to the driver</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'border-purple-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cash' && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('transfer')}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'transfer' 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-100 bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    paymentMethod === 'transfer' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className={`font-bold ${paymentMethod === 'transfer' ? 'text-purple-900' : 'text-gray-700'}`}>Bank Transfer</p>
                    <p className="text-xs text-gray-400 font-medium">Send proof of payment</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'transfer' ? 'border-purple-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'transfer' && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 md:p-10 border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center">
              <Shield size={24} className="mr-3 text-purple-600" />
              Security
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
                <div className="flex items-center">
                  <Lock size={18} className="mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <span className="font-bold text-gray-700 group-hover:text-gray-900">Change Password</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
                <div className="flex items-center">
                  <Smartphone size={18} className="mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <span className="font-bold text-gray-700 group-hover:text-gray-900">Two-Factor Authentication</span>
                </div>
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest mr-2">Soon</span>
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Notifications */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center">
              <Bell size={24} className="mr-3 text-purple-600" />
              Notifications
            </h3>
            
            <div className="space-y-6">
              {[
                { key: 'email', title: 'Email Alerts', desc: 'Ride & delivery updates', icon: Mail },
                { key: 'sms', title: 'SMS Notifications', desc: 'Critical trip info', icon: Smartphone },
                { key: 'marketing', title: 'Marketing', desc: 'Offers and news', icon: Bell }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* <item.icon size={16} className="mr-3 text-gray-400" /> */}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification(item.key)}
                    className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key] ? 'bg-purple-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${notifications[item.key] ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Legal */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 border border-gray-50">
             <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center">
              <HelpCircle size={24} className="mr-3 text-purple-600" />
              Support
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-600 hover:text-purple-600 transition-colors">
                Help Center
              </button>
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </button>
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={logout}
            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center border border-red-100"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
