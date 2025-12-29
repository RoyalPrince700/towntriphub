import React, { useMemo } from 'react';
import { DollarSign, Star, Package, Clock, AlertCircle } from 'lucide-react';

const Overview = ({ stats, assignments = [], loading, error }) => {
  const completedDeliveries = stats?.completedBookings ?? stats?.completedDeliveries ?? 0;
  const totalEarnings = stats?.totalEarnings ?? stats?.earnings?.total ?? 0;
  const avgDeliveryTime = stats?.averageDeliveryTime ?? stats?.avgDeliveryTime ?? 0;
  const averageRating = stats?.averageRating ?? stats?.rating?.average ?? 0;
  const displayRating = typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0';

  const recentAssignments = useMemo(
    () => (assignments || []).slice(0, 3),
    [assignments]
  );

  return (
    <div className="space-y-6">
      {/* Logistics Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Package className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Deliveries Completed</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{completedDeliveries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">GMD {totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Delivery Time</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{avgDeliveryTime || 0} min</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{displayRating}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Deliveries</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>

        {error && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {recentAssignments.length === 0 && !loading ? (
          <p className="text-sm text-gray-600">No deliveries yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAssignments.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {delivery.destinationLocation?.address || 'Delivery'}
                    </p>
                    <p className="text-xs text-gray-600">
                      From {delivery.pickupLocation?.address || 'N/A'} • {delivery.status?.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {delivery.status?.replace('_', ' ') || 'pending'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(delivery.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
