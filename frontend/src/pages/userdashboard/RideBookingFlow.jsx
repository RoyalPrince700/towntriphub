import React, { useState } from 'react';
import { MapPin, Clock, Users, Car, CreditCard, Check } from 'lucide-react';

const RideBookingFlow = ({ user }) => {
  const [bookingStep, setBookingStep] = useState('form');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const vehicleOptions = [
    { id: 'standard', name: 'Standard Car', capacity: '4 passengers', price: 'GMD 50', icon: '🚗' },
    { id: 'premium', name: 'Premium SUV', capacity: '6 passengers', price: 'GMD 75', icon: '🚙' },
    { id: 'van', name: 'Van/Minibus', capacity: '12 passengers', price: 'GMD 120', icon: '🚐' },
  ];

  const handleBooking = () => {
    // Simulate booking process
    setBookingStep('confirming');
    setTimeout(() => {
      setBookingStep('confirmed');
    }, 2000);
  };

  if (bookingStep === 'confirmed') {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Ride Booked Successfully!</h2>
        <p className="text-gray-600 mb-4">Your driver is on the way</p>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>From:</strong> {pickupLocation}</p>
            <p><strong>To:</strong> {destination}</p>
            <p><strong>Vehicle:</strong> {vehicleOptions.find(v => v.id === selectedVehicle)?.name}</p>
            <p><strong>Passengers:</strong> {passengers}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setBookingStep('form');
            setPickupLocation('');
            setDestination('');
            setPassengers(1);
            setSelectedVehicle('');
            setScheduledTime('');
          }}
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Book Another Ride
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Book a Ride</h2>
        <p className="text-gray-600 text-sm">Get picked up anywhere in Gambia</p>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Pickup Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <div className="flex items-center space-x-3">
            <Users className="h-4 w-4 text-gray-400" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Time (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule for later (Optional)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Choose Vehicle</label>
          <div className="space-y-3">
            {vehicleOptions.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.name}</h4>
                      <p className="text-sm text-gray-600">{vehicle.capacity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">{vehicle.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!pickupLocation || !destination || !selectedVehicle || bookingStep === 'confirming'}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            pickupLocation && destination && selectedVehicle && bookingStep !== 'confirming'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {bookingStep === 'confirming' ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Confirming Ride...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Book Ride - {vehicleOptions.find(v => v.id === selectedVehicle)?.price || 'Select vehicle'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default RideBookingFlow;
