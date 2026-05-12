import React, { useEffect, useRef, useState } from 'react';
import { Settings, User, Mail, Shield, Calendar, Bell, ShieldCheck, ArrowRight, Camera, Phone, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PhoneNumberModal from '../../components/PhoneNumberModal';
import api from '../../services/api';

const Profile = ({ user }) => {
  const { user: authUser, updateProfile, refreshUser } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageUploadSuccess, setImageUploadSuccess] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const currentUser = authUser || user;

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleSavePhone = async (phoneNumber) => {
    try {
      await updateProfile({ phone: phoneNumber });
      // Phone number is now saved and user data is refreshed automatically
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save phone number');
    }
  };

  const handleProfileImageClick = () => {
    if (uploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setImageUploadError('Image must be 1MB or smaller');
      setImageUploadSuccess('');
      event.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError('Only JPEG, PNG, GIF, and WebP images are allowed');
      setImageUploadSuccess('');
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(previewUrl);

    setSelectedImageFile(file);
    setImageUploadSuccess('');
    setImageUploadError('');
    event.target.value = '';
  };

  const handleSaveProfileImage = async () => {
    if (!selectedImageFile) return;

    setUploadingImage(true);
    setImageUploadError('');
    setImageUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);

      const response = await api.post('/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await refreshUser();
      const uploadedAvatarUrl = response.data?.data?.avatarUrl;
      if (uploadedAvatarUrl) {
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl);
        }
        setLocalPreviewUrl(uploadedAvatarUrl);
      }
      setSelectedImageFile(null);
      setImageUploadSuccess('Profile picture updated successfully');
    } catch (error) {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl('');
      setImageUploadError(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-purple-100 flex items-center justify-center text-purple-600 text-5xl font-black shadow-xl border-4 border-white overflow-hidden">
              {(localPreviewUrl || currentUser?.avatarUrl) ? (
                <img
                  src={localPreviewUrl || currentUser?.avatarUrl}
                  alt={`${currentUser?.name || 'User'} profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.name?.[0].toUpperCase() || <User size={64} />
              )}
            </div>
            <button
              type="button"
              onClick={handleProfileImageClick}
              disabled={uploadingImage}
              className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              title="Upload profile picture"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{currentUser?.name || 'Your Name'}</h2>
                <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} className="mr-1.5" />
                  Verified {currentUser?.role}
                </div>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2 flex items-center justify-center md:justify-start">
                <Mail size={14} className="mr-2" />
                {currentUser?.email}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all">
                Edit Profile
              </button>
              <button className="px-8 py-3 bg-gray-50 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-gray-100 transition-all border border-gray-100">
                Security
              </button>
            </div>
            {uploadingImage && (
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Uploading image...</p>
            )}
            {selectedImageFile && !uploadingImage && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveProfileImage}
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-purple-700 transition-all"
                >
                  Save Photo
                </button>
                <span className="text-[11px] text-gray-500 font-medium truncate max-w-[200px]">{selectedImageFile.name}</span>
              </div>
            )}
            {imageUploadSuccess && (
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{imageUploadSuccess}</p>
            )}
            {imageUploadError && (
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">{imageUploadError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-10 border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
              <User size={24} className="mr-3 text-purple-600" />
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { label: 'Full Name', value: currentUser?.name, icon: User },
                { label: 'Email Address', value: currentUser?.email, icon: Mail },
                { label: 'Phone Number', value: currentUser?.phone, icon: Phone },
                { label: 'Account Type', value: currentUser?.role, icon: Shield, capitalize: true },
                { label: 'Member Since', value: 'January 2024', icon: Calendar },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{field.label}</p>
                  <div className={`flex items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-purple-100 transition-colors ${field.label === 'Phone Number' ? 'cursor-pointer' : ''}`}
                       onClick={field.label === 'Phone Number' ? () => setShowPhoneModal(true) : undefined}>
                    <field.icon size={18} className="mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    <span className={`text-gray-900 font-bold ${field.capitalize ? 'capitalize' : ''} flex-1`}>
                      {field.value || (field.label === 'Phone Number' ? 'Add phone number' : 'Not set')}
                    </span>
                    {field.label === 'Phone Number' && (
                      <Edit size={16} className="text-gray-400 group-hover:text-purple-600 transition-colors ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-10 border border-gray-50 h-full">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
              <Bell size={24} className="mr-3 text-purple-600" />
              Notifications
            </h3>
            
            <div className="space-y-6">
              {[
                { title: 'Email Alerts', desc: 'Ride & delivery updates', active: true },
                { title: 'SMS Notifications', desc: 'Critical trip info', active: false },
                { title: 'Marketing', desc: 'Offers and news', active: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-50">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-all relative ${item.active ? 'bg-purple-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.active ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline flex items-center justify-center mx-auto">
                Advanced Settings <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSave={handleSavePhone}
        currentPhone={currentUser?.phone || ''}
      />
    </div>
  );
};

export default Profile;
