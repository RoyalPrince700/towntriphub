import React from 'react';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Car,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Overview = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Driver Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">GMD {stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Car className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Rides Completed</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.completedRides}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Online Hours</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.onlineHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Status & Availability */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Available</h3>
            <p className="text-sm text-gray-600">Ready to accept rides</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Vehicle Status</h3>
            <p className="text-sm text-gray-600">Vehicle verified</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Documents</h3>
            <p className="text-sm text-gray-600">All documents verified</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Trips</h2>
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
            </div>
            <div className="ml-3 lg:ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Trip to Serrekunda</p>
              <p className="text-xs lg:text-sm text-gray-600">2 hours ago • GMD 75 • 4.8 rating</p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
            <div className="ml-3 lg:ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Trip to Brikama</p>
              <p className="text-xs lg:text-sm text-gray-600">1 day ago • GMD 120 • 4.9 rating</p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Weekly Earnings</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">This Week</span>
            <span className="font-medium text-gray-900">GMD 450</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Last Week</span>
            <span className="font-medium text-gray-900">GMD 380</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Change</span>
            <span className="font-medium text-green-600">+GMD 70 (+18%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
