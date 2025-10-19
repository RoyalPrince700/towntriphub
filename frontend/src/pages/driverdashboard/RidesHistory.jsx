import React from 'react';
import { MapPin, Clock, DollarSign, Star, Calendar, Filter } from 'lucide-react';

const RidesHistory = () => {
  const rides = [
    {
      id: 'R001',
      date: '2025-10-17',
      time: '14:30',
      pickup: 'Kairaba Avenue',
      dropoff: 'Serrekunda',
      distance: '8.5 km',
      duration: '25 min',
      fare: 75,
      rating: 4.8,
      status: 'completed'
    },
    {
      id: 'R002',
      date: '2025-10-17',
      time: '12:15',
      pickup: 'Brikama Market',
      dropoff: 'Bakau',
      distance: '12.3 km',
      duration: '35 min',
      fare: 120,
      rating: 4.9,
      status: 'completed'
    },
    {
      id: 'R003',
      date: '2025-10-16',
      time: '18:45',
      pickup: 'Airport Road',
      dropoff: 'Kololi',
      distance: '15.7 km',
      duration: '42 min',
      fare: 150,
      rating: 4.7,
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Ride History</h2>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All rides</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Highest fare</option>
              <option>Lowest fare</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ride List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Ride {ride.id}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {ride.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {ride.date} at {ride.time}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {ride.distance}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {ride.duration}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      {ride.rating}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                      <div>
                        <span className="font-medium">From:</span> {ride.pickup}
                      </div>
                    </div>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-red-600" />
                      <div>
                        <span className="font-medium">To:</span> {ride.dropoff}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end mt-4 lg:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">GMD {ride.fare}</p>
                    <p className="text-sm text-gray-500">Total earnings</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700">
            Showing 1 to 3 of 47 rides
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RidesHistory;
