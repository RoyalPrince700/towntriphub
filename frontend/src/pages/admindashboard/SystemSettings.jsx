import React, { useState } from 'react';
import { 
  FiGlobe, 
  // FiMail, 
  // FiCreditCard, 
  // FiBell, 
  // FiShield, 
  // FiSettings,
  FiSave,
  // FiAlertCircle
} from 'react-icons/fi';

const SystemSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'TownTripHub',
    siteEmail: 'admin@towntriphub.com',
    supportEmail: 'support@towntriphub.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    timezone: 'UTC-5',
    currency: 'USD',
    language: 'English'
  });

  // Email Settings State - COMMENTED OUT FOR NOW
  // const [emailSettings, setEmailSettings] = useState({
  //   smtpHost: 'smtp.gmail.com',
  //   smtpPort: '587',
  //   smtpUser: '',
  //   smtpPassword: '',
  //   fromEmail: 'noreply@towntriphub.com',
  //   fromName: 'TownTripHub'
  // });

  // Booking Settings State - COMMENTED OUT FOR NOW
  // const [bookingSettings, setBookingSettings] = useState({
  //   minBookingTime: '30',
  //   maxBookingDays: '90',
  //   cancellationPeriod: '24',
  //   autoConfirmBookings: true,
  //   requirePaymentUpfront: false,
  //   bookingPrefix: 'TT'
  // });

  // Notification Settings State - COMMENTED OUT FOR NOW
  // const [notificationSettings, setNotificationSettings] = useState({
  //   emailNotifications: true,
  //   smsNotifications: false,
  //   pushNotifications: true,
  //   bookingConfirmation: true,
  //   bookingReminder: true,
  //   paymentConfirmation: true,
  //   driverAssignment: true
  // });

  // Security Settings State - COMMENTED OUT FOR NOW
  // const [securitySettings, setSecuritySettings] = useState({
  //   maintenanceMode: false,
  //   allowRegistration: true,
  //   requireEmailVerification: true,
  //   sessionTimeout: '60',
  //   maxLoginAttempts: '5',
  //   twoFactorAuth: false
  // });

  const handleSaveSettings = async (section) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'general', name: 'General', icon: FiGlobe },
    // COMMENTED OUT FOR NOW - Can be enabled later
    // { id: 'email', name: 'Email', icon: FiMail },
    // { id: 'booking', name: 'Booking', icon: FiCreditCard },
    // { id: 'notifications', name: 'Notifications', icon: FiBell },
    // { id: 'security', name: 'Security', icon: FiShield }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Email
          </label>
          <input
            type="email"
            value={generalSettings.siteEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, siteEmail: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={generalSettings.supportEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={generalSettings.phoneNumber}
            onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={generalSettings.address}
            onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC-12">UTC-12:00</option>
            <option value="UTC-5">UTC-05:00 (EST)</option>
            <option value="UTC-6">UTC-06:00 (CST)</option>
            <option value="UTC-7">UTC-07:00 (MST)</option>
            <option value="UTC-8">UTC-08:00 (PST)</option>
            <option value="UTC+0">UTC+00:00 (GMT)</option>
            <option value="UTC+1">UTC+01:00 (CET)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={generalSettings.currency}
            onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="NGN">NGN - Nigerian Naira</option>
          </select>
        </div>
      </div>
    </div>
  );

  // COMMENTED OUT FOR NOW - Email Settings
  // const renderEmailSettings = () => (
  //   <div className="space-y-6">
  //     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  //       <div className="flex items-start">
  //         <FiAlertCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
  //         <p className="text-sm text-blue-800">
  //           Configure SMTP settings to enable email notifications and communications.
  //         </p>
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           SMTP Host
  //         </label>
  //         <input
  //           type="text"
  //           value={emailSettings.smtpHost}
  //           onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="smtp.gmail.com"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           SMTP Port
  //         </label>
  //         <input
  //           type="text"
  //           value={emailSettings.smtpPort}
  //           onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="587"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           SMTP Username
  //         </label>
  //         <input
  //           type="text"
  //           value={emailSettings.smtpUser}
  //           onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="your-email@gmail.com"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           SMTP Password
  //         </label>
  //         <input
  //           type="password"
  //           value={emailSettings.smtpPassword}
  //           onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="••••••••"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           From Email
  //         </label>
  //         <input
  //           type="email"
  //           value={emailSettings.fromEmail}
  //           onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="noreply@towntriphub.com"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           From Name
  //         </label>
  //         <input
  //           type="text"
  //           value={emailSettings.fromName}
  //           onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           placeholder="TownTripHub"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  // COMMENTED OUT FOR NOW - Booking Settings
  // const renderBookingSettings = () => (
  //   <div className="space-y-6">
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Minimum Booking Time (minutes)
  //         </label>
  //         <input
  //           type="number"
  //           value={bookingSettings.minBookingTime}
  //           onChange={(e) => setBookingSettings({...bookingSettings, minBookingTime: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Max Advance Booking (days)
  //         </label>
  //         <input
  //           type="number"
  //           value={bookingSettings.maxBookingDays}
  //           onChange={(e) => setBookingSettings({...bookingSettings, maxBookingDays: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Cancellation Period (hours)
  //         </label>
  //         <input
  //           type="number"
  //           value={bookingSettings.cancellationPeriod}
  //           onChange={(e) => setBookingSettings({...bookingSettings, cancellationPeriod: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Booking ID Prefix
  //         </label>
  //         <input
  //           type="text"
  //           value={bookingSettings.bookingPrefix}
  //           onChange={(e) => setBookingSettings({...bookingSettings, bookingPrefix: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //     </div>
  //     <div className="space-y-4 pt-4 border-t">
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <p className="font-medium text-gray-900">Auto-confirm Bookings</p>
  //           <p className="text-sm text-gray-500">Automatically confirm bookings without manual approval</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={bookingSettings.autoConfirmBookings}
  //             onChange={(e) => setBookingSettings({...bookingSettings, autoConfirmBookings: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <p className="font-medium text-gray-900">Require Payment Upfront</p>
  //           <p className="text-sm text-gray-500">Require full payment at time of booking</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={bookingSettings.requirePaymentUpfront}
  //             onChange={(e) => setBookingSettings({...bookingSettings, requirePaymentUpfront: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //     </div>
  //   </div>
  // );

  // COMMENTED OUT FOR NOW - Notification Settings
  // const renderNotificationSettings = () => (
  //   <div className="space-y-4">
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Email Notifications</p>
  //         <p className="text-sm text-gray-500">Send notifications via email</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.emailNotifications}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">SMS Notifications</p>
  //         <p className="text-sm text-gray-500">Send notifications via SMS</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.smsNotifications}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Push Notifications</p>
  //         <p className="text-sm text-gray-500">Send push notifications to mobile devices</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.pushNotifications}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <h3 className="text-lg font-semibold text-gray-900 pt-4">Notification Types</h3>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Booking Confirmation</p>
  //         <p className="text-sm text-gray-500">Notify users when booking is confirmed</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.bookingConfirmation}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, bookingConfirmation: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Booking Reminder</p>
  //         <p className="text-sm text-gray-500">Send reminders before scheduled trips</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.bookingReminder}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, bookingReminder: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Payment Confirmation</p>
  //         <p className="text-sm text-gray-500">Notify users when payment is received</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.paymentConfirmation}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, paymentConfirmation: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //     <div className="flex items-center justify-between py-3 border-b">
  //       <div>
  //         <p className="font-medium text-gray-900">Driver Assignment</p>
  //         <p className="text-sm text-gray-500">Notify when a driver is assigned</p>
  //       </div>
  //       <label className="relative inline-flex items-center cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={notificationSettings.driverAssignment}
  //           onChange={(e) => setNotificationSettings({...notificationSettings, driverAssignment: e.target.checked})}
  //           className="sr-only peer"
  //         />
  //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //       </label>
  //     </div>
  //   </div>
  // );

  // COMMENTED OUT FOR NOW - Security Settings
  // const renderSecuritySettings = () => (
  //   <div className="space-y-6">
  //     <div className="space-y-4">
  //       <div className="flex items-center justify-between py-3 border-b">
  //         <div>
  //           <p className="font-medium text-gray-900">Maintenance Mode</p>
  //           <p className="text-sm text-gray-500">Disable site access for maintenance</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={securitySettings.maintenanceMode}
  //             onChange={(e) => setSecuritySettings({...securitySettings, maintenanceMode: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //       <div className="flex items-center justify-between py-3 border-b">
  //         <div>
  //           <p className="font-medium text-gray-900">Allow User Registration</p>
  //           <p className="text-sm text-gray-500">Allow new users to register</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={securitySettings.allowRegistration}
  //             onChange={(e) => setSecuritySettings({...securitySettings, allowRegistration: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //       <div className="flex items-center justify-between py-3 border-b">
  //         <div>
  //           <p className="font-medium text-gray-900">Require Email Verification</p>
  //           <p className="text-sm text-gray-500">Users must verify their email address</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={securitySettings.requireEmailVerification}
  //             onChange={(e) => setSecuritySettings({...securitySettings, requireEmailVerification: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //       <div className="flex items-center justify-between py-3 border-b">
  //         <div>
  //           <p className="font-medium text-gray-900">Two-Factor Authentication</p>
  //           <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={securitySettings.twoFactorAuth}
  //             onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Session Timeout (minutes)
  //         </label>
  //         <input
  //           type="number"
  //           value={securitySettings.sessionTimeout}
  //           onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Max Login Attempts
  //         </label>
  //         <input
  //           type="number"
  //           value={securitySettings.maxLoginAttempts}
  //           onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderContent = () => {
    // Only showing General Settings for now
    // Other sections are commented out and can be enabled later
    return renderGeneralSettings();
    
    // COMMENTED OUT - Enable when other sections are needed
    // switch (activeSection) {
    //   case 'general':
    //     return renderGeneralSettings();
    //   case 'email':
    //     return renderEmailSettings();
    //   case 'booking':
    //     return renderBookingSettings();
    //   case 'notifications':
    //     return renderNotificationSettings();
    //   case 'security':
    //     return renderSecuritySettings();
    //   default:
    //     return renderGeneralSettings();
    // }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* COMMENTED OUT - Tabs Navigation (enable when other sections are needed) */}
        {/* <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex flex-wrap -mb-px">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div> */}

        {/* Content Area */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FiGlobe className="text-blue-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">General Settings</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Configure basic system information and preferences
            </p>
          </div>

          {renderContent()}

          {/* Save Button and Message */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {saveMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                saveMessage.includes('success') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {saveMessage}
              </div>
            )}
            <button
              onClick={() => handleSaveSettings(activeSection)}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FiSave className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
