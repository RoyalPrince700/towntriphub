import React, { useState } from 'react';
import { MapPin, Clock, Users, Navigation } from 'lucide-react';

const RideBookingForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    pickupLocation: {
      address: '',
      coordinates: { latitude: null, longitude: null }
    },
    destinationLocation: {
      address: '',
      coordinates: { latitude: null, longitude: null }
    }
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        address: value
      }
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickupLocation.address.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!formData.destinationLocation.address.trim()) {
      newErrors.destinationLocation = 'Destination is required';
    }

    if (formData.pickupLocation.address === formData.destinationLocation.address &&
        formData.pickupLocation.address.trim()) {
      newErrors.destinationLocation = 'Pickup and destination cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Navigation className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">Book a Ride</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.pickupLocation.address}
              onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
              placeholder="Enter pickup address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.pickupLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.pickupLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
          )}
        </div>

        {/* Destination Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.destinationLocation.address}
              onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
              placeholder="Enter destination address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.destinationLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.destinationLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.destinationLocation}</p>
          )}
        </div>

        {/* Quick Location Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('pickupLocation', 'Banjul')}
            className="flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Banjul
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('pickupLocation', 'Serrekunda')}
            className="flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Serrekunda
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Finding Driver...
            </>
          ) : (
            <>
              <Navigation className="h-5 w-5 mr-2" />
              Book Ride
            </>
          )}
        </button>
      </form>

      {/* Estimated Fare Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Estimated fare: GMD 50 - 150 (depending on distance)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Users className="h-4 w-4 mr-2" />
          <span>Cash or bank transfer accepted</span>
        </div>
      </div>
    </div>
  );
};

export default RideBookingForm;
