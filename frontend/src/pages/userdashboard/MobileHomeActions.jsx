import React from 'react';
import { Car, Package, MapPin, Clock, Star } from 'lucide-react';

const MobileHomeActions = ({ onServiceSelect }) => {
  return (
    <div className="space-y-4">
      {/* Quick Service Selection */}
      <div className="grid grid-cols-1 gap-4">
        {/* Ride Booking Card */}
        <div
          onClick={() => onServiceSelect && onServiceSelect('ride')}
          className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow border-l-4 border-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Car className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Book a Ride</h3>
                <p className="text-xs text-gray-600">Get picked up anywhere in Gambia</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">From</div>
              <div className="text-sm font-bold text-indigo-600">GMD 50</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              2-5 min wait
            </span>
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              4.8 rating
            </span>
          </div>
        </div>

        {/* Delivery Service Card */}
        <div
          onClick={() => onServiceSelect && onServiceSelect('delivery')}
          className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Send Package</h3>
                <p className="text-xs text-gray-600">Reliable delivery across Gambia</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">From</div>
              <div className="text-sm font-bold text-green-600">GMD 75</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Same day delivery
            </span>
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Door to door
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MapPin className="h-5 w-5 text-indigo-600 mb-1" />
            <span className="text-xs font-medium text-gray-900">Saved Places</span>
          </button>
          <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Clock className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs font-medium text-gray-900">Schedule Ride</span>
          </button>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-indigo-500 to-green-500 rounded-lg p-4 text-white">
        <h3 className="text-sm font-semibold mb-2">Why Choose TownTripHub?</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
            <span>Verified Drivers</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
            <span>Real-time Tracking</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
            <span>Cash & Transfer</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeActions;
