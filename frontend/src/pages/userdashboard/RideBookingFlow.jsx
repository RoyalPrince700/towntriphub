import React, { useState } from 'react';
import { MapPin, Clock, Users, Car, Check, ArrowRight } from 'lucide-react';
import { createRideBooking } from '../../services/bookingService';

const RideBookingFlow = ({ user }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
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
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ride Booked Successfully!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Your booking has been created. The admin will assign a driver soon.</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <div className="text-left space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">From</p>
                    <p className="text-sm font-medium text-gray-900">{pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 rounded-lg p-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</p>
                    <p className="text-sm font-medium text-gray-900">{destination}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Passengers</p>
                    <p className="text-sm font-medium text-gray-900">{passengers} passenger{passengers > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                    <p className="text-sm font-medium text-gray-900">Pending driver assignment</p>
                  </div>
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
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Car className="h-5 w-5" />
              <span>Book Another Ride</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Book a Ride</h2>
          <p className="text-gray-600 text-lg">Get picked up anywhere in Gambia</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="bg-red-100 rounded-lg p-1">
                <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Pickup Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="bg-green-100 rounded-lg p-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="bg-red-100 rounded-lg p-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Number of Passengers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 text-gray-900 bg-gray-50 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Schedule Time (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Schedule for Later (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-900 bg-gray-50"
              />
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!pickupLocation || !destination || loading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
              pickupLocation && destination && !loading
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Booking Ride...</span>
              </>
            ) : (
              <>
                <Car className="h-6 w-6" />
                <span>Book Ride</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center space-x-3 text-sm text-blue-700">
            <div className="bg-blue-100 rounded-lg p-1">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Cash or bank transfer accepted. Price set by admin upon booking.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideBookingFlow;
