import React from 'react';
import { MapPin, Navigation, Clock, TrendingUp, Plus, Settings } from 'lucide-react';

const RouteManagement = () => {
  const routes = [
    {
      id: 'R001',
      name: 'Serrekunda Express',
      startPoint: 'Kairaba Avenue',
      endPoint: 'Serrekunda',
      distance: '8.5 km',
      avgTime: '25 min',
      deliveries: 15,
      efficiency: 92,
      status: 'active'
    },
    {
      id: 'R002',
      name: 'Brikama Route',
      startPoint: 'Brikama Market',
      endPoint: 'Bakau',
      distance: '12.3 km',
      avgTime: '35 min',
      deliveries: 8,
      efficiency: 88,
      status: 'active'
    },
    {
      id: 'R003',
      name: 'Airport Corridor',
      startPoint: 'Airport Road',
      endPoint: 'Kololi',
      distance: '15.7 km',
      avgTime: '42 min',
      deliveries: 12,
      efficiency: 85,
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Route Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Route Management</h2>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add New Route
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Active Routes</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Avg Delivery Time</h3>
            <p className="text-2xl font-bold text-blue-600">32 min</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Route Efficiency</h3>
            <p className="text-2xl font-bold text-yellow-600">89%</p>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Routes</h2>
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {route.status}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Settings className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
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
                      {route.distance}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Avg: {route.avgTime}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Deliveries Today</p>
                      <p className="text-lg font-semibold text-gray-900">{route.deliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Efficiency Rate</p>
                      <p className="text-lg font-semibold text-green-600">{route.efficiency}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Optimization */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Optimization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fuel Efficiency</span>
                <span className="font-medium text-blue-600">8.5 km/L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Load Factor</span>
                <span className="font-medium text-purple-600">78%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Optimization Suggestions</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Consider combining Serrekunda and Brikama routes for better efficiency.
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Peak hours routing could reduce delivery time by 15%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManagement;
