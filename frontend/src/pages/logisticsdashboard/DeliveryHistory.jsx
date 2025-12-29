import React from 'react';
import { Package, MapPin, Clock, DollarSign, Star, Calendar, AlertCircle } from 'lucide-react';

const DeliveryHistory = ({ assignments = [], loading, earnings }) => {
  const completed = assignments || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Delivery History</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>

        {earnings?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700">GMD {earnings.summary.total || 0}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed Deliveries</p>
              <p className="text-2xl font-bold text-blue-700">{completed.length}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Delivery</p>
              <p className="text-2xl font-bold text-yellow-700">GMD {earnings.summary.average || 0}</p>
            </div>
          </div>
        )}

        {completed.length === 0 && !loading ? (
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            No completed deliveries yet.
          </div>
        ) : (
          <div className="space-y-4">
            {completed.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Delivery {delivery._id}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {delivery.status?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {delivery.completedAt
                          ? new Date(delivery.completedAt).toLocaleString()
                          : new Date(delivery.createdAt).toLocaleString()}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        {delivery.packageType || 'Package'}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {delivery.duration || '—'}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        GMD {delivery.price?.amount || delivery.fare || 0}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Pickup</p>
                        <p className="font-medium text-gray-900">{delivery.pickupLocation?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dropoff</p>
                        <p className="font-medium text-gray-900">{delivery.destinationLocation?.address || 'N/A'}</p>
                      </div>
                    </div>

                    {delivery.rating && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          Rating: {delivery.rating}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;

