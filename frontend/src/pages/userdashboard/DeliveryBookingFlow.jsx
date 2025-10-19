import React, { useState } from 'react';
import { MapPin, Package, Scale, Clock, CreditCard, Check, Truck } from 'lucide-react';

const DeliveryBookingFlow = ({ user }) => {
  const [bookingStep, setBookingStep] = useState('form');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [packageValue, setPackageValue] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: 'Same day', price: 'GMD 75', icon: '📦' },
    { id: 'express', name: 'Express Delivery', time: '2-4 hours', price: 'GMD 150', icon: '⚡' },
    { id: 'scheduled', name: 'Scheduled Delivery', time: 'Choose time', price: 'GMD 100', icon: '📅' },
  ];

  const handleBooking = () => {
    // Simulate booking process
    setBookingStep('confirming');
    setTimeout(() => {
      setBookingStep('confirmed');
    }, 2000);
  };

  const resetForm = () => {
    setBookingStep('form');
    setPickupLocation('');
    setDeliveryLocation('');
    setPackageDescription('');
    setPackageWeight('');
    setPackageValue('');
    setRecipientName('');
    setRecipientPhone('');
    setDeliveryType('standard');
  };

  if (bookingStep === 'confirmed') {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Booked Successfully!</h2>
        <p className="text-gray-600 mb-4">Your package is being prepared for delivery</p>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>From:</strong> {pickupLocation}</p>
            <p><strong>To:</strong> {deliveryLocation}</p>
            <p><strong>Package:</strong> {packageDescription}</p>
            <p><strong>Delivery:</strong> {deliveryOptions.find(d => d.id === deliveryType)?.name}</p>
            <p><strong>Recipient:</strong> {recipientName}</p>
          </div>
        </div>
        <button
          onClick={resetForm}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Send Another Package
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Send Package</h2>
        <p className="text-gray-600 text-sm">Reliable delivery across Gambia</p>
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
              placeholder="Where should we pick up the package?"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Delivery Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Where should we deliver the package?"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Description</label>
            <div className="relative">
              <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="What's inside?"
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <div className="relative">
              <Scale className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="0.0"
                step="0.1"
                value={packageWeight}
                onChange={(e) => setPackageWeight(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Package Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Value (Optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400 font-medium">GMD</span>
            <input
              type="number"
              placeholder="Enter value for insurance"
              value={packageValue}
              onChange={(e) => setPackageValue(e.target.value)}
              className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Recipient Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
            <input
              type="text"
              placeholder="Recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
            <input
              type="tel"
              placeholder="+220 XXX XXXX"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Delivery Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Type</label>
          <div className="space-y-3">
            {deliveryOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setDeliveryType(option.id)}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  deliveryType === option.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{option.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!pickupLocation || !deliveryLocation || !packageDescription || !recipientName || !recipientPhone || bookingStep === 'confirming'}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            pickupLocation && deliveryLocation && packageDescription && recipientName && recipientPhone && bookingStep !== 'confirming'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {bookingStep === 'confirming' ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Booking Delivery...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Send Package - {deliveryOptions.find(d => d.id === deliveryType)?.price || 'Select type'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeliveryBookingFlow;
