import React, { useState, useEffect } from 'react';
import { Users, Navigation, Loader, DollarSign } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import MapWithDirections from './MapWithDirections';
import { useFareCalculator } from '../hooks/useFareCalculator';

const RideBookingForm = ({ onSubmit, loading }) => {
  const { fareData, loading: fareLoading, error: fareError, calculateFare } = useFareCalculator();

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

  useEffect(() => {
    const { pickupLocation, destinationLocation } = formData;
    const pLat = pickupLocation?.coordinates?.latitude;
    const pLng = pickupLocation?.coordinates?.longitude;
    const dLat = destinationLocation?.coordinates?.latitude;
    const dLng = destinationLocation?.coordinates?.longitude;

    if (pLat && pLng && dLat && dLng) {
      calculateFare(pickupLocation.coordinates, destinationLocation.coordinates);
    }
  }, [
    formData.pickupLocation?.coordinates?.latitude,
    formData.pickupLocation?.coordinates?.longitude,
    formData.destinationLocation?.coordinates?.latitude,
    formData.destinationLocation?.coordinates?.longitude
  ]);

  const handleLocationChange = (field, locationData) => {
    setFormData(prev => ({
      ...prev,
      [field]: locationData
    }));

    // Clear error when user selects a location
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickupLocation.address || !formData.pickupLocation.coordinates?.latitude || !formData.pickupLocation.coordinates?.longitude) {
      newErrors.pickupLocation = 'Please select a valid pickup location from the suggestions';
    }

    if (!formData.destinationLocation.address || !formData.destinationLocation.coordinates?.latitude || !formData.destinationLocation.coordinates?.longitude) {
      newErrors.destinationLocation = 'Please select a valid destination from the suggestions';
    }

    if (formData.pickupLocation.address === formData.destinationLocation.address &&
        formData.pickupLocation.address &&
        formData.destinationLocation.address) {
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
        <LocationAutocomplete
          label="Pickup Location"
          placeholder="Enter pickup address"
          value={formData.pickupLocation}
          onChange={(location) => handleLocationChange('pickupLocation', location)}
          error={errors.pickupLocation}
          required
        />

        {/* Destination Location */}
        <LocationAutocomplete
          label="Destination"
          placeholder="Enter destination address"
          value={formData.destinationLocation}
          onChange={(location) => handleLocationChange('destinationLocation', location)}
          error={errors.destinationLocation}
          required
        />

        {/* Fare Display */}
        {fareLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Calculating fare...</span>
          </div>
        )}

        {fareData && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center mb-3">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Estimated Fare</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Distance:</span>
                <span className="ml-2 font-medium">{fareData.breakdown?.distance}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{fareData.breakdown?.duration}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Fare:</span>
                <span className="text-xl font-bold text-green-600">
                  {fareData.totals?.finalTotal} {fareData.currency}
                </span>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Includes base fare ({fareData.components?.baseFare} GMD) + distance ({fareData.components?.distanceCost} GMD) + time ({fareData.components?.timeCost} GMD)
              </div>
            </div>
          </div>
        )}

        {fareError && (
          <p className="text-sm text-amber-600">{fareError}</p>
        )}

        {/* Route Preview Map */}
        {fareData && formData.pickupLocation?.coordinates && formData.destinationLocation?.coordinates && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Route Preview</h4>
            <MapWithDirections
              pickupCoords={formData.pickupLocation.coordinates}
              destinationCoords={formData.destinationLocation.coordinates}
            />
          </div>
        )}

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

      {/* Payment Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>Cash or bank transfer accepted</span>
        </div>
      </div>
    </div>
  );
};

export default RideBookingForm;
