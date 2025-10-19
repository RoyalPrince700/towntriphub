import React from 'react';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Calendar
} from 'lucide-react';

const BookingHistory = ({ stats }) => {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Total Bookings</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Completion Rate</p>
                <p className="text-lg font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">GMD {stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-600" />
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-600">Avg Rating</p>
                <p className="text-lg font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Ride completed to Serrekunda</p>
              <p className="text-xs text-gray-600">2 hours ago • GMD 75</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Delivery completed to Brikama</p>
              <p className="text-xs text-gray-600">1 day ago • GMD 120</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Booking History</h2>
        <div className="text-center py-6">
          <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">All Bookings</h3>
          <p className="text-gray-500 text-xs">Complete booking history coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
