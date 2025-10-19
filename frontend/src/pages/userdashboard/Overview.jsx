import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Car,
  Truck,
  UserPlus
} from 'lucide-react';

const Overview = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">GMD {stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Options */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <UserPlus className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Become a Service Provider</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Join our network and start earning! Register as a driver or delivery personnel to provide services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Register as Driver</h3>
                <p className="text-sm text-gray-600">Provide ride services</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Share rides and earn money by transporting passengers around The Gambia.
            </p>
            <button
              onClick={() => navigate('/driver/register')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Car className="h-4 w-4 mr-2" />
              Register as Driver
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <Truck className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Register as Delivery</h3>
                <p className="text-sm text-gray-600">Provide delivery services</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Deliver packages and earn money by providing logistics services.
            </p>
            <button
              onClick={() => navigate('/logistics/register')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Truck className="h-4 w-4 mr-2" />
              Register as Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
            </div>
            <div className="ml-3 lg:ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Ride completed to Serrekunda</p>
              <p className="text-xs lg:text-sm text-gray-600">2 hours ago • GMD 75</p>
            </div>
          </div>

          <div className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <div className="ml-3 lg:ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Delivery completed to Brikama</p>
              <p className="text-xs lg:text-sm text-gray-600">1 day ago • GMD 120</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
