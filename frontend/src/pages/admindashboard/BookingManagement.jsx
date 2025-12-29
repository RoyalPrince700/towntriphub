import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  assignDriver,
  getAvailableDrivers
} from '../../services/adminService';
import { FaStar, FaMapMarkerAlt, FaPhone, FaCar, FaSearch, FaFilter } from 'react-icons/fa';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [price, setPrice] = useState({ amount: '', currency: 'GMD' });
  const [driverSearch, setDriverSearch] = useState('');
  const [driverFilter, setDriverFilter] = useState('all'); // all, ride, delivery

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  // Filter drivers based on search and filter criteria
  useEffect(() => {
    let filtered = [...availableDrivers];

    // Filter by type (ride/delivery)
    if (driverFilter !== 'all') {
      filtered = filtered.filter(driver => {
        if (driverFilter === 'ride') return driver.preferences?.acceptsRides;
        if (driverFilter === 'delivery') return driver.preferences?.acceptsDeliveries;
        return true;
      });
    }

    // Filter by search term
    if (driverSearch.trim()) {
      const searchTerm = driverSearch.toLowerCase();
      filtered = filtered.filter(driver =>
        driver.user?.name?.toLowerCase().includes(searchTerm) ||
        driver.user?.email?.toLowerCase().includes(searchTerm) ||
        driver.vehicle?.make?.toLowerCase().includes(searchTerm) ||
        driver.vehicle?.model?.toLowerCase().includes(searchTerm) ||
        driver.vehicle?.plateNumber?.toLowerCase().includes(searchTerm) ||
        driver.currentLocation?.address?.toLowerCase().includes(searchTerm) ||
        driver.serviceAreas?.some(area => area.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredDrivers(filtered);
  }, [availableDrivers, driverSearch, driverFilter]);

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
        type: booking.type,
      };
      const response = await getAvailableDrivers(params);
      setAvailableDrivers(response.data);
      setFilteredDrivers(response.data); // Initialize filtered drivers
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
      await assignDriver(selectedBooking._id, selectedDriver._id, price);
      await fetchBookings(); // Refresh bookings
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedDriver(null);
      setPrice({ amount: '', currency: 'GMD' });
      setDriverSearch('');
      setDriverFilter('all');
    } catch (err) {
      setError(err.message || 'Failed to assign driver');
    } finally {
      setActionLoading(null);
    }
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
    setSelectedDriver(null);
    setPrice({ amount: '', currency: 'GMD' });
    setDriverSearch('');
    setDriverFilter('all');
    fetchAvailableDrivers(booking);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedBooking(null);
    setSelectedDriver(null);
    setPrice({ amount: '', currency: 'GMD' });
    setDriverSearch('');
    setDriverFilter('all');
  };

  const selectDriver = (driver) => {
    setSelectedDriver(selectedDriver && selectedDriver._id === driver._id ? null : driver);
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
                        {booking.price?.amount ? `D${booking.price.amount}` : 'Not set'}
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

      {/* Full-Screen Assign Driver Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-4 min-h-screen bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Assign Driver to Booking #{selectedBooking._id.slice(-8)}
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)} from {selectedBooking.pickupLocation?.address} to {selectedBooking.destinationLocation?.address}
                </p>
              </div>
              <button
                onClick={closeAssignModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Search and Filter */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search drivers by name, email, vehicle, location..."
                        value={driverSearch}
                        onChange={(e) => setDriverSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-400" />
                    <select
                      value={driverFilter}
                      onChange={(e) => setDriverFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Drivers</option>
                      <option value="ride">Ride Only</option>
                      <option value="delivery">Delivery Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Drivers List */}
              <div className="mb-6">
                {driversLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading available drivers...</span>
                  </div>
                ) : filteredDrivers.length > 0 ? (
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {filteredDrivers.map((driver) => (
                      <div
                        key={driver._id}
                        onClick={() => selectDriver(driver)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedDriver && selectedDriver._id === driver._id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {/* Driver Photo */}
                            <div className="flex-shrink-0">
                              {driver.documents?.profilePhoto ? (
                                <img
                                  src={driver.documents.profilePhoto}
                                  alt="Driver"
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-500 text-xl font-semibold">
                                    {driver.user?.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Driver Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-lg font-semibold text-gray-900">{driver.user?.name}</h4>
                                <div className="flex items-center text-yellow-500">
                                  <FaStar className="w-4 h-4 fill-current" />
                                  <span className="ml-1 text-sm font-medium">
                                    {driver.rating?.average?.toFixed(1) || 'N/A'}
                                  </span>
                                  <span className="text-gray-500 text-sm ml-1">
                                    ({driver.rating?.totalRatings || 0} reviews)
                                  </span>
                                </div>
                              </div>

                              <p className="text-gray-600 text-sm mb-2">{driver.user?.email}</p>

                              {/* Vehicle Info */}
                              <div className="flex items-center text-gray-700 mb-2">
                                <FaCar className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm">
                                  {driver.vehicle?.make} {driver.vehicle?.model} ({driver.vehicle?.year})
                                  - {driver.vehicle?.color} {driver.vehicle?.vehicleType}
                                </span>
                              </div>

                              {/* Location Info */}
                              <div className="flex items-center text-gray-700 mb-2">
                                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm">
                                  {driver.currentLocation?.address || 'Location not available'}
                                </span>
                              </div>

                              {/* Contact & Service Areas */}
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center">
                                  <FaPhone className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{driver.phoneNumber}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Service Areas:</span>{' '}
                                  {driver.serviceAreas?.join(', ') || 'Not specified'}
                                </div>
                              </div>

                              {/* Statistics */}
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Completed Trips:</span> {driver.statistics?.completedTrips || 0} |
                                <span className="font-medium ml-2">Total Distance:</span> {driver.statistics?.totalDistance?.toFixed(1) || 0} km
                              </div>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          <div className="flex-shrink-0">
                            {selectedDriver && selectedDriver._id === driver._id ? (
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaCar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {driverSearch || driverFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No approved drivers are currently available for this booking type.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Input and Actions */}
              {selectedDriver && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Price (GMD) *
                    </label>
                    <input
                      type="number"
                      value={price.amount}
                      onChange={(e) => setPrice({ ...price, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price for this booking"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeAssignModal}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignDriver}
                      disabled={actionLoading === selectedBooking._id || !price.amount}
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === selectedBooking._id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Assigning...
                        </div>
                      ) : (
                        'Assign Driver'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
