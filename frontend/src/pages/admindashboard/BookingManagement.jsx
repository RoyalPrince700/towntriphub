import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  assignDriver,
  getAvailableDrivers
} from '../../services/adminService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [price, setPrice] = useState({ amount: '', currency: 'GMD' });

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getAllBookings(params);
      setBookings(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async (booking) => {
    try {
      setDriversLoading(true);
      const params = {
        pickupLocation: booking.pickupLocation?.address,
        type: booking.type,
      };
      const response = await getAvailableDrivers(params);
      setAvailableDrivers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load available drivers');
    } finally {
      setDriversLoading(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedBooking || !selectedDriver || !price.amount) {
      setError('Please select a driver and enter a price');
      return;
    }

    try {
      setActionLoading(selectedBooking._id);
      await assignDriver(selectedBooking._id, selectedDriver, price);
      await fetchBookings(); // Refresh bookings
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedDriver('');
      setPrice({ amount: '', currency: 'GMD' });
    } catch (err) {
      setError(err.message || 'Failed to assign driver');
    } finally {
      setActionLoading(null);
    }
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
    fetchAvailableDrivers(booking);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      driver_assigned: { color: 'bg-blue-100 text-blue-800', label: 'Driver Assigned' },
      driver_en_route: { color: 'bg-purple-100 text-purple-800', label: 'En Route' },
      picked_up: { color: 'bg-indigo-100 text-indigo-800', label: 'Picked Up' },
      in_transit: { color: 'bg-cyan-100 text-cyan-800', label: 'In Transit' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Management</h2>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2 flex-wrap">
          {['all', 'pending', 'driver_assigned', 'in_transit', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg mb-2 ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{booking._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        From: {booking.pickupLocation?.address || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        To: {booking.destinationLocation?.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.price ? `D${booking.price.amount}` : 'Not set'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => openAssignModal(booking)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Assign Driver
                        </button>
                      )}
                      {booking.driver && (
                        <div className="text-sm text-gray-900">
                          {booking.driver.user?.name || 'Assigned'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No bookings found for the selected filter.
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Driver to Booking #{selectedBooking._id.slice(-8)}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                {driversLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a driver...</option>
                    {availableDrivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.user?.name} - {driver.vehicle?.make} {driver.vehicle?.model} ({driver.vehicle?.plateNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (GMD)
                </label>
                <input
                  type="number"
                  value={price.amount}
                  onChange={(e) => setPrice({ ...price, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                    setSelectedDriver('');
                    setPrice({ amount: '', currency: 'GMD' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignDriver}
                  disabled={actionLoading === selectedBooking._id || !selectedDriver || !price.amount}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading === selectedBooking._id ? 'Assigning...' : 'Assign Driver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
