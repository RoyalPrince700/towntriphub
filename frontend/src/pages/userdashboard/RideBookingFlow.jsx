import React, { useState } from 'react';
import { MapPin, Clock, Users, Car, Check, ArrowRight, XCircle, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { createRideBooking } from '../../services/bookingService';
import { createSavedPlace } from '../../services/savedPlacesService';
import { useAuth } from '../../context/AuthContext';
import PhoneNumberModal from '../../components/PhoneNumberModal';

const RideBookingFlow = ({ user, prefilledPickup = '', prefilledDestination = '' }) => {
  const { updateProfile } = useAuth();
  const [pickupLocation, setPickupLocation] = useState(prefilledPickup);
  const [destination, setDestination] = useState(prefilledDestination);
  const [passengers, setPassengers] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSavePickupDialog, setShowSavePickupDialog] = useState(false);
  const [showSaveDestinationDialog, setShowSaveDestinationDialog] = useState(false);
  const [savePlaceName, setSavePlaceName] = useState('');
  const [savingPlace, setSavingPlace] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleSavePhone = async (phoneNumber) => {
    try {
      await updateProfile({ phone: phoneNumber });
      // Phone number is now saved and user data is refreshed automatically
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save phone number');
    }
  };

  const handleSavePlace = async (type) => {
    if (!savePlaceName.trim()) {
      setError('Please enter a name for this saved place');
      return;
    }

    setSavingPlace(true);
    setError('');

    try {
      const placeData = {
        name: savePlaceName.trim(),
        address: type === 'pickup' ? pickupLocation : destination,
        type,
      };

      await createSavedPlace(placeData);

      // Close the dialog and reset form
      if (type === 'pickup') {
        setShowSavePickupDialog(false);
      } else {
        setShowSaveDestinationDialog(false);
      }
      setSavePlaceName('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save place');
    } finally {
      setSavingPlace(false);
    }
  };

  const handleBooking = async () => {
    // Check if user has phone number
    if (!user.phone) {
      setShowPhoneModal(true);
      return;
    }

    if (!pickupLocation.trim() || !destination.trim()) {
      setError('Please enter both pickup location and destination');
      return;
    }

    if (pickupLocation.trim() === destination.trim()) {
      setError('Pickup and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        pickupLocation: {
          address: pickupLocation,
          coordinates: { latitude: null, longitude: null }
        },
        destinationLocation: {
          address: destination,
          coordinates: { latitude: null, longitude: null }
        },
        passengers,
        scheduledTime: scheduledTime || null
      };

      await createRideBooking(bookingData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-100">
            <Check size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Ride Request Sent!</h2>
          <p className="text-gray-500 font-medium mb-10">We've received your request. A driver will be assigned to you shortly.</p>

          <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-10 border border-gray-100 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-gray-100 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{destination}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSuccess(false);
              setPickupLocation('');
              setDestination('');
              setPassengers(1);
              setScheduledTime('');
              setError('');
            }}
            className="w-full bg-purple-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center space-x-3 group"
          >
            <Car size={20} />
            <span>Book Another Ride</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
            <Car size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Book a Ride</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Safe & reliable transport</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 flex items-center text-rose-600 animate-in fade-in slide-in-from-top-2">
            <XCircle size={20} className="mr-3 shrink-0" />
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6 md:col-span-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Where should we pick you up?"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-sm font-bold"
                />
                {pickupLocation.trim() && (
                  <button
                    onClick={() => setShowSavePickupDialog(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                    title="Save this location"
                  >
                    <Bookmark size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Where are you heading?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
                />
                {destination.trim() && (
                  <button
                    onClick={() => setShowSaveDestinationDialog(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Save this location"
                  >
                    <Bookmark size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passengers</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 rotate-90" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Schedule (Optional)</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!pickupLocation || !destination || loading}
          className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-3 ${
            pickupLocation && destination && !loading
              ? 'bg-purple-600 text-white shadow-xl shadow-purple-100 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Car size={20} />
              <span>Request Ride Now</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>

        <div className="mt-10 p-6 bg-purple-50/50 rounded-[2rem] border border-purple-50 flex items-center space-x-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
            <Check size={20} />
          </div>
          <p className="text-xs font-bold text-purple-900/60 leading-relaxed">
            Payment can be made via cash or bank transfer after the trip. Prices are estimated and final fare will be provided.
          </p>
        </div>
      </div>

      {/* Save Pickup Location Dialog */}
      {showSavePickupDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Save Pickup Location</h3>
              <button
                onClick={() => {
                  setShowSavePickupDialog(false);
                  setSavePlaceName('');
                  setError('');
                }}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{pickupLocation}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Save as</label>
                <input
                  type="text"
                  placeholder="e.g., Home, Office, Mall"
                  value={savePlaceName}
                  onChange={(e) => setSavePlaceName(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all text-sm font-bold"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSavePickupDialog(false);
                    setSavePlaceName('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePlace('pickup')}
                  disabled={!savePlaceName.trim() || savingPlace}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {savingPlace ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <BookmarkCheck size={16} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Destination Location Dialog */}
      {showSaveDestinationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Save Destination Location</h3>
              <button
                onClick={() => {
                  setShowSaveDestinationDialog(false);
                  setSavePlaceName('');
                  setError('');
                }}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</p>
                <p className="text-sm font-bold text-gray-700 leading-snug">{destination}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Save as</label>
                <input
                  type="text"
                  placeholder="e.g., Work, Gym, Restaurant"
                  value={savePlaceName}
                  onChange={(e) => setSavePlaceName(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSaveDestinationDialog(false);
                    setSavePlaceName('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePlace('destination')}
                  disabled={!savePlaceName.trim() || savingPlace}
                  className="flex-1 bg-purple-600 text-white py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {savingPlace ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <BookmarkCheck size={16} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default RideBookingFlow;
