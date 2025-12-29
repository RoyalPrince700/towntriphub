import React, { useMemo } from 'react';
import { MapPin, Navigation, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const RouteManagement = ({ assignments = [], loading }) => {
  const routes = useMemo(() => {
    const map = new Map();
    assignments.forEach((a) => {
      const start = a.pickupLocation?.address || 'Unknown start';
      const end = a.destinationLocation?.address || 'Unknown destination';
      const key = `${start}-${end}`;
      if (!map.has(key)) {
        map.set(key, { id: key, startPoint: start, endPoint: end, deliveries: 0 });
      }
      map.get(key).deliveries += 1;
    });
    return Array.from(map.values());
  }, [assignments]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Route Management</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Active Routes</h3>
            <p className="text-2xl font-bold text-green-600">{routes.length}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Total Assignments</h3>
            <p className="text-2xl font-bold text-blue-600">{assignments.length}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Completed</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {assignments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Routes</h2>
        {routes.length === 0 && !loading ? (
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
            No routes yet. Routes will appear once deliveries are assigned.
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{route.startPoint} → {route.endPoint}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        From: {route.startPoint}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-600" />
                        To: {route.endPoint}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="h-4 w-4 mr-2" />
                        Deliveries: {route.deliveries}
                      </div>
                    </div>
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

export default RouteManagement;
