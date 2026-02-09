import React, { useState } from 'react';
import { MapPin, Package, Scale, Clock, CreditCard, Check, Truck, ArrowRight, XCircle, ChevronRight, DollarSign } from 'lucide-react';
import { createDeliveryBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import PhoneNumberModal from '../../components/PhoneNumberModal';

const DeliveryBookingFlow = ({ user }) => {
  const { updateProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [packageValue, setPackageValue] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const deliveryOptions = [
    { id: 'standard', name: 'Standard', time: 'Same day', price: 'GMD 75', icon: <Package size={20} />, color: 'indigo' },
    { id: 'express', name: 'Express', time: '2-4 hours', price: 'GMD 150', icon: <Truck size={20} />, color: 'emerald' },
    { id: 'scheduled', name: 'Scheduled', time: 'Choose time', price: 'GMD 100', icon: <Clock size={20} />, color: 'amber' },
  ];

  const handleSavePhone = async (phoneNumber) => {
    try {
      await updateProfile({ phone: phoneNumber });
      // Phone number is now saved and user data is refreshed automatically
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save phone number');
    }
  };

  const handleBooking = async () => {
    // Check if user has phone number
    if (!user.phone) {
      setShowPhoneModal(true);
      return;
    }

    if (!pickupLocation.trim() || !deliveryLocation.trim() || !packageDescription.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (pickupLocation.trim() === deliveryLocation.trim()) {
      setError('Pickup and delivery locations cannot be the same');
      return;
    }

    const weight = packageWeight ? parseFloat(packageWeight) : undefined;
    const value = packageValue ? parseFloat(packageValue) : undefined;

    if (weight !== undefined && (isNaN(weight) || weight < 0)) {
      setError('Package weight must be a positive number');
      return;
    }

    if (value !== undefined && (isNaN(value) || value < 0)) {
      setError('Package value must be a positive number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const packageDetails = {
        description: packageDescription.trim(),
        weight: weight,
        value: value,
      };

      Object.keys(packageDetails).forEach(key => 
        packageDetails[key] === undefined && delete packageDetails[key]
      );

      const bookingData = {
        pickupLocation: {
          address: pickupLocation.trim(),
        },
        destinationLocation: {
          address: deliveryLocation.trim(),
        },
        packageDetails,
      };

      const response = await createDeliveryBooking(bookingData);
      
      if (response.success) {
        setSuccess(true);
      } else {
        throw new Error(response.message || 'Failed to book delivery');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(', ')
        : err.response?.data?.message || err.message || 'Failed to book delivery';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setPickupLocation('');
    setDeliveryLocation('');
    setPackageDescription('');
    setPackageWeight('');
    setPackageValue('');
    setRecipientName('');
    setRecipientPhone('');
    setDeliveryType('standard');
    setError('');
  };

  if (success) {
    return (
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-100">
            <Check size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Delivery Scheduled!</h2>
          <p className="text-gray-500 font-medium mb-10">Your package request is being processed. We'll assign a carrier soon.</p>

          <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-10 border border-gray-100 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">From</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-gray-100 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">To</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{deliveryLocation}</p>
              </div>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3 group"
          >
            <Package size={20} />
            <span>Send Another Package</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Send a Package</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Fast & secure logistics</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 flex items-center text-rose-600 animate-in fade-in slide-in-from-top-2">
            <XCircle size={20} className="mr-3 shrink-0" />
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup From</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Street address or landmark"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deliver To</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Recipient's address"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Package Info</label>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="What are we delivering?"
                  value={packageDescription}
                  onChange={(e) => setPackageDescription(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                <div className="relative group">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    placeholder="0.0"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value (GMD)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    placeholder="Optional"
                    value={packageValue}
                    onChange={(e) => setPackageValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Delivery Speed</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deliveryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setDeliveryType(option.id)}
                className={`flex flex-col p-5 rounded-[1.5rem] border-2 transition-all text-left ${
                  deliveryType === option.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                    : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  deliveryType === option.id ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'
                }`}>
                  {option.icon}
                </div>
                <p className={`text-sm font-black tracking-tight ${deliveryType === option.id ? 'text-emerald-900' : 'text-gray-900'}`}>{option.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{option.time}</p>
                <p className="text-sm font-black text-emerald-600 mt-2">{option.price}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!pickupLocation || !deliveryLocation || !packageDescription || loading}
          className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-3 ${
            pickupLocation && deliveryLocation && packageDescription && !loading
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Truck size={20} />
              <span>Send Package Now</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSave={handleSavePhone}
        currentPhone={user?.phone || ''}
      />
    </div>
  );
};

export default DeliveryBookingFlow;
