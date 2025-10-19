import React from 'react';
import { Package, MapPin, Clock, CheckCircle, Truck, Search, Eye } from 'lucide-react';

const PackageTracking = () => {
  const packages = [
    {
      id: 'PKG001',
      trackingNumber: 'TT-2025-001234',
      status: 'in_transit',
      sender: 'John Doe',
      recipient: 'Jane Smith',
      pickupLocation: 'Kairaba Avenue',
      deliveryLocation: 'Serrekunda',
      weight: '2.5 kg',
      estimatedDelivery: '2025-10-17 18:00',
      currentLocation: 'En route to Serrekunda',
      lastUpdate: '2025-10-17 16:45'
    },
    {
      id: 'PKG002',
      trackingNumber: 'TT-2025-001235',
      status: 'delivered',
      sender: 'Business Corp',
      recipient: 'Retail Store',
      pickupLocation: 'Brikama Market',
      deliveryLocation: 'Bakau',
      weight: '15 kg',
      estimatedDelivery: '2025-10-17 14:00',
      currentLocation: 'Delivered',
      lastUpdate: '2025-10-17 13:30'
    },
    {
      id: 'PKG003',
      trackingNumber: 'TT-2025-001236',
      status: 'picked_up',
      sender: 'Online Shop',
      recipient: 'Customer',
      pickupLocation: 'Airport Road',
      deliveryLocation: 'Kololi',
      weight: '1.2 kg',
      estimatedDelivery: '2025-10-18 10:00',
      currentLocation: 'Picked up from sender',
      lastUpdate: '2025-10-17 15:20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'picked_up':
        return 'Picked Up';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Package Tracking</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking number..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All packages</option>
              <option>Picked up</option>
              <option>In transit</option>
              <option>Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Area</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All areas</option>
              <option>Serrekunda</option>
              <option>Brikama</option>
              <option>Bakau</option>
              <option>Kololi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Package List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{pkg.trackingNumber}</h3>
                      <p className="text-sm text-gray-600">Package ID: {pkg.id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                        {getStatusText(pkg.status)}
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-2" />
                      {pkg.weight}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      From: {pkg.pickupLocation}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-red-600" />
                      To: {pkg.deliveryLocation}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      ETA: {new Date(pkg.estimatedDelivery).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Sender</p>
                      <p className="font-medium text-gray-900">{pkg.sender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipient</p>
                      <p className="font-medium text-gray-900">{pkg.recipient}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Current Status:</span> {pkg.currentLocation}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(pkg.lastUpdate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700">
            Showing 1 to 3 of 24 packages
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

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Delivered Today</h3>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">In Transit</h3>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Package className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Picked Up</h3>
            <p className="text-2xl font-bold text-yellow-600">5</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Avg Delivery Time</h3>
            <p className="text-2xl font-bold text-purple-600">32 min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTracking;
