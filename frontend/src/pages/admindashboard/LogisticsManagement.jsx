import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  assignLogisticsPersonnel,
  getAvailableLogisticsPersonnel
} from '../../services/adminService';
import { FaStar, FaMapMarkerAlt, FaPhone, FaSearch, FaFilter, FaTruck, FaBox } from 'react-icons/fa';

const LogisticsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [availablePersonnel, setAvailablePersonnel] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personnelLoading, setPersonnelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [price, setPrice] = useState({ amount: '', currency: 'GMD' });
  const [personnelSearch, setPersonnelSearch] = useState('');

  useEffect(() => {
    fetchLogisticsBookings();
  }, [filter]);

  // Filter personnel based on search criteria
  useEffect(() => {
    let filtered = [...availablePersonnel];

    if (personnelSearch.trim()) {
      const searchTerm = personnelSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm) ||
        p.user?.email?.toLowerCase().includes(searchTerm) ||
        p.businessName?.toLowerCase().includes(searchTerm) ||
        p.services?.some(s => s.toLowerCase().includes(searchTerm)) ||
        p.serviceAreas?.some(area => area.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredPersonnel(filtered);
  }, [availablePersonnel, personnelSearch]);

  const fetchLogisticsBookings = async () => {
    try {
      setLoading(true);
      const params = { type: 'delivery' };
      if (filter !== 'all') params.status = filter;
      
      const response = await getAllBookings(params);
      setBookings(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load logistics orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePersonnel = async () => {
    try {
      setPersonnelLoading(true);
      const response = await getAvailableLogisticsPersonnel();
      setAvailablePersonnel(response.data);
      setFilteredPersonnel(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load available personnel');
    } finally {
      setPersonnelLoading(false);
    }
  };

  const handleAssignPersonnel = async () => {
    if (!selectedBooking || !selectedPersonnel || !price.amount) {
      setError('Please select personnel and enter a price');
      return;
    }

    try {
      setActionLoading(selectedBooking._id);
      await assignLogisticsPersonnel(selectedBooking._id, selectedPersonnel._id, price);
      await fetchLogisticsBookings();
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedPersonnel(null);
      setPrice({ amount: '', currency: 'GMD' });
      setPersonnelSearch('');
    } catch (err) {
      setError(err.message || 'Failed to assign personnel');
    } finally {
      setActionLoading(null);
    }
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
    setSelectedPersonnel(null);
    setPrice({ amount: '', currency: 'GMD' });
    setPersonnelSearch('');
    fetchAvailablePersonnel();
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedBooking(null);
    setSelectedPersonnel(null);
    setPrice({ amount: '', currency: 'GMD' });
    setPersonnelSearch('');
  };

  const selectPersonnel = (p) => {
    setSelectedPersonnel(selectedPersonnel && selectedPersonnel._id === p._id ? null : p);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      driver_assigned: { color: 'bg-blue-100 text-blue-800', label: 'Personnel Assigned' },
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logistics Order Management</h2>

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
              {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
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
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.packageDetails?.description || 'No description'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.packageDetails?.weight ? `${booking.packageDetails.weight}kg` : ''}
                        {booking.packageDetails?.isFragile ? ' | Fragile' : ''}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                        From: {booking.pickupLocation?.address}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        To: {booking.destinationLocation?.address}
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
                          Assign Personnel
                        </button>
                      )}
                      {(booking.logisticsPersonnel || booking.driver) && (
                        <div className="text-sm text-gray-900">
                          {booking.logisticsPersonnel?.user?.name || booking.driver?.user?.name || 'Assigned'}
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
            No logistics orders found for the selected filter.
          </div>
        )}
      </div>

      {/* Assign Personnel Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-4 min-h-screen bg-white">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Assign Logistics Personnel to Order #{selectedBooking._id.slice(-8)}
                </h3>
                <p className="text-gray-600 mt-1">
                  Delivery from {selectedBooking.pickupLocation?.address} to {selectedBooking.destinationLocation?.address}
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
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search personnel by name, email, business, location..."
                    value={personnelSearch}
                    onChange={(e) => setPersonnelSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                {personnelLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredPersonnel.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredPersonnel.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => selectPersonnel(p)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPersonnel && selectedPersonnel._id === p._id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{p.businessName}</h4>
                            <p className="text-sm text-gray-600">{p.user?.name}</p>
                            <div className="flex items-center mt-1 text-yellow-500">
                              <FaStar className="w-3 h-3" />
                              <span className="ml-1 text-xs">{p.rating?.average?.toFixed(1) || '0.0'}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {p.services?.slice(0, 2).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                  {s.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPersonnel && selectedPersonnel._id === p._id
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedPersonnel && selectedPersonnel._id === p._id && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FaTruck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No personnel found</h3>
                  </div>
                )}
              </div>

              {selectedPersonnel && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Delivery Price (GMD) *
                    </label>
                    <input
                      type="number"
                      value={price.amount}
                      onChange={(e) => setPrice({ ...price, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price for this delivery"
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
                      onClick={handleAssignPersonnel}
                      disabled={actionLoading === selectedBooking._id || !price.amount}
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {actionLoading === selectedBooking._id ? 'Assigning...' : 'Assign Personnel'}
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

export default LogisticsManagement;
