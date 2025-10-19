import React, { useState } from 'react';
import { Package, MapPin, Weight, DollarSign, AlertTriangle } from 'lucide-react';

const DeliveryBookingForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    pickupLocation: {
      address: '',
      coordinates: { latitude: null, longitude: null }
    },
    destinationLocation: {
      address: '',
      coordinates: { latitude: null, longitude: null }
    },
    packageDetails: {
      description: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      value: '',
      isFragile: false,
      specialInstructions: ''
    }
  });

  const [errors, setErrors] = useState({});

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        address: value
      }
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePackageChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      packageDetails: {
        ...prev.packageDetails,
        [field]: value
      }
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData(prev => ({
      ...prev,
      packageDetails: {
        ...prev.packageDetails,
        dimensions: {
          ...prev.packageDetails.dimensions,
          [dimension]: value
        }
      }
    }));
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

    if (!formData.packageDetails.description.trim()) {
      newErrors.description = 'Package description is required';
    }

    if (!formData.packageDetails.weight || formData.packageDetails.weight <= 0) {
      newErrors.weight = 'Valid package weight is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Convert string values to numbers
    const submitData = {
      ...formData,
      packageDetails: {
        ...formData.packageDetails,
        weight: parseFloat(formData.packageDetails.weight),
        value: formData.packageDetails.value ? parseFloat(formData.packageDetails.value) : undefined,
        dimensions: {
          length: formData.packageDetails.dimensions.length ? parseFloat(formData.packageDetails.dimensions.length) : undefined,
          width: formData.packageDetails.dimensions.width ? parseFloat(formData.packageDetails.dimensions.width) : undefined,
          height: formData.packageDetails.dimensions.height ? parseFloat(formData.packageDetails.dimensions.height) : undefined,
        }
      }
    };

    onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">Book Delivery</h3>
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
              onChange={(e) => handleLocationChange('pickupLocation', e.target.value)}
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
            Delivery Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.destinationLocation.address}
              onChange={(e) => handleLocationChange('destinationLocation', e.target.value)}
              placeholder="Enter delivery address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.destinationLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.destinationLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.destinationLocation}</p>
          )}
        </div>

        {/* Package Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Description
          </label>
          <textarea
            value={formData.packageDetails.description}
            onChange={(e) => handlePackageChange('description', e.target.value)}
            placeholder="Describe what's being delivered (e.g., electronics, documents, food)"
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Package Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.packageDetails.weight}
                onChange={(e) => handlePackageChange('weight', e.target.value)}
                placeholder="0.5"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value (GMD) - Optional
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.packageDetails.value}
                onChange={(e) => handlePackageChange('value', e.target.value)}
                placeholder="100.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dimensions (cm) - Optional
          </label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.packageDetails.dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="Length"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.packageDetails.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="Width"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.packageDetails.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="Height"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Fragile Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="fragile"
            checked={formData.packageDetails.isFragile}
            onChange={(e) => handlePackageChange('isFragile', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="fragile" className="ml-2 flex items-center text-sm text-gray-700">
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            This package contains fragile items
          </label>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions - Optional
          </label>
          <textarea
            value={formData.packageDetails.specialInstructions}
            onChange={(e) => handlePackageChange('specialInstructions', e.target.value)}
            placeholder="Any special handling instructions..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
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
              <Package className="h-5 w-5 mr-2" />
              Book Delivery
            </>
          )}
        </button>
      </form>

      {/* Estimated Cost Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>Delivery fee starts from GMD 25 (based on distance and package details)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Package className="h-4 w-4 mr-2" />
          <span>Cash or bank transfer accepted</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBookingForm;
