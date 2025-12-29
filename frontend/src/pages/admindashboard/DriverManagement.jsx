import React, { useEffect, useMemo, useState } from 'react';
import { Eye, AlertCircle, CreditCard, Shield, Star, Truck, User, X, MessageSquare } from 'lucide-react';
import { getAllDrivers, updateDriverApproval } from '../../services/adminService';
import { getUserReviews } from '../../services/reviewService';

const statusOptions = ['all', 'pending_approval', 'approved', 'rejected', 'suspended'];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A');

const ensureDriverArray = (response) => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [documentErrors, setDocumentErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  useEffect(() => {
    if (selectedDriver) {
      console.log('[DriverManagement] selectedDriver set', {
        id: selectedDriver._id,
        keys: Object.keys(selectedDriver || {}),
        user: selectedDriver.user,
        vehicle: selectedDriver.vehicle,
        documents: selectedDriver.documents
      });
    }
  }, [selectedDriver]);

  useEffect(() => {
    console.log('[DriverManagement] showDetailsModal', showDetailsModal);
  }, [showDetailsModal]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getAllDrivers(params);
      const driverList = ensureDriverArray(response);
      console.log('[DriverManagement] fetched drivers', {
        filter,
        apiShape: response ? Object.keys(response) : [],
        count: driverList.length,
        sample: driverList[0]
      });
      setDrivers(driverList);
    } catch (err) {
      setError(err.message || 'Failed to load drivers');
      console.error('[DriverManagement] fetchDrivers error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (driverId, action, reason = '') => {
    try {
      setActionLoading(driverId);
      await updateDriverApproval(driverId, action, reason);
      await fetchDrivers();
      if (selectedDriver?._id === driverId) {
        setShowDetailsModal(false);
        setSelectedDriver(null);
      }
    } catch (err) {
      setError(err.message || `Failed to ${action} driver`);
    } finally {
      setActionLoading(null);
    }
  };

  const closeDetailsModal = () => {
    setSelectedDriver(null);
    setShowDetailsModal(false);
  };

  const fetchDriverReviews = async (driver) => {
    if (!driver?.user?._id) {
      setReviews([]);
      return;
    }
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await getUserReviews(driver.user._id, { limit: 5, type: 'user_to_driver' });
      if (response?.success) {
        setReviews(response.data || []);
      } else if (Array.isArray(response?.data)) {
        setReviews(response.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('[DriverManagement] fetchDriverReviews error', err);
      setReviewsError(err.message || 'Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const openDetailsModal = (driver) => {
    console.log('[DriverManagement] opening details modal', {
      driverId: driver?._id,
      driver
    });
    setSelectedDriver(driver);
    setDocumentErrors({});
    setShowDetailsModal(true);
    fetchDriverReviews(driver);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' },
      active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status || 'Unknown' };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const ratingDisplay = (rating) => {
    const value = typeof rating?.average === 'number' ? rating.average.toFixed(1) : 'N/A';
    const total = rating?.totalRatings || 0;
    return { value, total };
  };

  const driverRows = useMemo(
    () =>
      drivers.map((driver) => {
        const { value: ratingValue, total: ratingTotal } = ratingDisplay(driver.rating);
        return (
          <tr key={driver._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  {driver.documents?.profilePhoto ? (
                    <img className="h-10 w-10 rounded-full object-cover" src={driver.documents.profilePhoto} alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {driver.user?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {driver.user?.email || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {driver.phoneNumber || 'No phone'}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {driver.vehicle?.make || ''} {driver.vehicle?.model || ''}
              </div>
              <div className="text-sm text-gray-500">
                {driver.vehicle?.plateNumber || 'N/A'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStatusBadge(driver.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="text-sm text-gray-900">{ratingValue}</span>
                <Star className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
                <span className="text-sm text-gray-500 ml-1">({ratingTotal})</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openDetailsModal(driver)}
                  className="flex items-center justify-center bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </button>

                {driver.status === 'pending_approval' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprovalAction(driver._id, 'approve')}
                      disabled={actionLoading === driver._id}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 flex-1"
                    >
                      {actionLoading === driver._id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) handleApprovalAction(driver._id, 'reject', reason);
                      }}
                      disabled={actionLoading === driver._id}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 flex-1"
                    >
                      {actionLoading === driver._id ? '...' : 'Reject'}
                    </button>
                  </div>
                )}

                {driver.status === 'approved' && (
                  <button
                    onClick={() => {
                      const reason = prompt('Reason for suspension:');
                      if (reason) handleApprovalAction(driver._id, 'suspend', reason);
                    }}
                    disabled={actionLoading === driver._id}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 disabled:opacity-50 w-full"
                  >
                    {actionLoading === driver._id ? '...' : 'Suspend'}
                  </button>
                )}

                {driver.status === 'suspended' && (
                  <button
                    onClick={() => handleApprovalAction(driver._id, 'reactivate')}
                    disabled={actionLoading === driver._id}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 w-full"
                  >
                    {actionLoading === driver._id ? '...' : 'Reactivate'}
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      }),
    [drivers, actionLoading]
  );

  const documentList = [
    { label: 'Profile Photo', key: 'profilePhoto' },
    { label: 'Vehicle Front', key: 'vehicleFrontPhoto' },
    { label: 'Vehicle Side', key: 'vehicleSidePhoto' },
    { label: 'Vehicle Back', key: 'vehicleBackPhoto' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Driver Management</h2>

      <div className="mb-6">
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Drivers' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

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

      <div className="bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : drivers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{driverRows}</tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No drivers found for the selected filter.</div>
        )}
      </div>

      {showDetailsModal && selectedDriver && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
              aria-hidden="true"
              onClick={closeDetailsModal}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-50">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div className="flex items-center">
                    {selectedDriver.documents?.profilePhoto ? (
                      <img
                        src={selectedDriver.documents.profilePhoto}
                        alt="Profile"
                        className="h-16 w-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                        {selectedDriver.user?.name || 'N/A'}
                      </h3>
                      <div className="flex items-center mt-1">
                        {getStatusBadge(selectedDriver.status)}
                        <span className="ml-3 flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          {selectedDriver.rating?.average?.toFixed(1) || 'N/A'} ({selectedDriver.rating?.totalRatings || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <User className="h-4 w-4 mr-2" /> Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedDriver.user?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{selectedDriver.phoneNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date of Birth:</span>
                        <span className="font-medium">{formatDate(selectedDriver.dateOfBirth)}</span>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-gray-500 mb-1">Emergency Contact:</p>
                        <div className="flex justify-between">
                          <span>
                            {selectedDriver.emergencyContact?.name || 'N/A'} ({selectedDriver.emergencyContact?.relationship || 'N/A'})
                          </span>
                          <span className="font-medium">{selectedDriver.emergencyContact?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <CreditCard className="h-4 w-4 mr-2" /> License Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">License Number:</span>
                        <span className="font-medium">{selectedDriver.licenseNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expiry Date:</span>
                        <span className="font-medium">{formatDate(selectedDriver.licenseExpiryDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <Truck className="h-4 w-4 mr-2" /> Vehicle Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vehicle:</span>
                        <span className="font-medium">
                          {selectedDriver.vehicle?.year || 'N/A'} {selectedDriver.vehicle?.make || ''} {selectedDriver.vehicle?.model || ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plate Number:</span>
                        <span className="font-medium">{selectedDriver.vehicle?.plateNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium capitalize">{selectedDriver.vehicle?.vehicleType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Color:</span>
                        <span className="font-medium">{selectedDriver.vehicle?.color || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Capacity:</span>
                        <span className="font-medium">
                          {selectedDriver.vehicle?.seatingCapacity ? `${selectedDriver.vehicle.seatingCapacity} Seats` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">AC:</span>
                        <span className="font-medium">
                          {selectedDriver.vehicle?.hasAC === undefined ? 'N/A' : selectedDriver.vehicle.hasAC ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <Shield className="h-4 w-4 mr-2" /> Insurance & Registration
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Registration Number:</span>
                        <span className="font-medium">{selectedDriver.vehicle?.registrationNumber || 'N/A'}</span>
                        <span className="text-xs text-gray-400">
                          Expires: {formatDate(selectedDriver.vehicle?.registrationExpiry)}
                        </span>
                      </div>
                      <div className="flex flex-col pt-2 border-t">
                        <span className="text-gray-500">Insurance Number:</span>
                        <span className="font-medium">{selectedDriver.vehicle?.insuranceNumber || 'N/A'}</span>
                        <span className="text-xs text-gray-400">
                          Expires: {formatDate(selectedDriver.vehicle?.insuranceExpiry)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                    Recent Rider Reviews
                  </h4>

                  {reviewsLoading ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <span>Loading reviews...</span>
                    </div>
                  ) : reviewsError ? (
                    <div className="text-sm text-red-600">{reviewsError}</div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-3 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-sm font-semibold text-gray-900">{review.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            By {review.reviewer?.name || 'Rider'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet for this driver.</p>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Submitted Documents</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {documentList.map((doc) => (
                      <div key={doc.key} className="border rounded-lg p-2 flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-2 truncate w-full text-center">{doc.label}</span>
                        {selectedDriver.documents?.[doc.key] ? (
                          <div className="relative w-full h-24 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                            {!documentErrors[doc.key] ? (
                              <>
                                <img
                                  src={selectedDriver.documents[doc.key]}
                                  alt={doc.label}
                                  className="max-w-full max-h-full object-contain"
                                  onError={() => setDocumentErrors((prev) => ({ ...prev, [doc.key]: true }))}
                                />
                                <a
                                  href={selectedDriver.documents[doc.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100"
                                >
                                  <Eye className="h-5 w-5 mr-1" /> Open
                                </a>
                              </>
                            ) : (
                              <a
                                href={selectedDriver.documents[doc.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs bg-gray-100"
                              >
                                <AlertCircle className="h-5 w-5 mb-1 opacity-50" />
                                Preview unavailable
                                <span className="underline mt-1">Open file</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-24 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-400 italic text-xs">
                            <AlertCircle className="h-5 w-5 mb-1 opacity-20" />
                            Not Uploaded
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                {selectedDriver.status === 'pending_approval' && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading === selectedDriver._id}
                      onClick={() => handleApprovalAction(selectedDriver._id, 'approve')}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {actionLoading === selectedDriver._id ? 'Processing...' : 'Approve Driver'}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === selectedDriver._id}
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) handleApprovalAction(selectedDriver._id, 'reject', reason);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {actionLoading === selectedDriver._id ? 'Processing...' : 'Reject Application'}
                    </button>
                  </>
                )}

                {selectedDriver.status === 'approved' && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedDriver._id}
                    onClick={() => {
                      const reason = prompt('Reason for suspension:');
                      if (reason) handleApprovalAction(selectedDriver._id, 'suspend', reason);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading === selectedDriver._id ? 'Processing...' : 'Suspend Driver'}
                  </button>
                )}

                {selectedDriver.status === 'suspended' && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedDriver._id}
                    onClick={() => handleApprovalAction(selectedDriver._id, 'reactivate')}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading === selectedDriver._id ? 'Processing...' : 'Reactivate Driver'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
