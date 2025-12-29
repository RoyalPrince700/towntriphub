import React, { useEffect, useMemo, useState } from 'react';
import {
  getAllLogisticsPersonnel,
  updateLogisticsApproval
} from '../../services/adminService';
import { Star, Eye, X, User, Phone, Mail, Calendar, CreditCard, Truck, Shield, AlertCircle, CheckCircle2, Briefcase, MapPin } from 'lucide-react';

const statusOptions = ['all', 'pending_approval', 'approved', 'rejected', 'suspended'];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A');

const ensurePersonnelArray = (response) => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const ratingDisplay = (rating) => {
  const value = typeof rating?.average === 'number' ? rating.average.toFixed(1) : 'N/A';
  const total = rating?.totalRatings || 0;
  return { value, total };
};

const LogisticsPersonnelManagement = () => {
  const [logisticsPersonnel, setLogisticsPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [documentErrors, setDocumentErrors] = useState({});

  useEffect(() => {
    fetchLogisticsPersonnel();
  }, [filter]);

  useEffect(() => {
    if (selectedPersonnel) {
      console.log('[LogisticsPersonnel] selectedPersonnel set', {
        id: selectedPersonnel._id,
        keys: Object.keys(selectedPersonnel || {}),
        user: selectedPersonnel.user,
        documents: selectedPersonnel.documents
      });
    }
  }, [selectedPersonnel]);

  useEffect(() => {
    console.log('[LogisticsPersonnel] showDetailsModal', showDetailsModal);
  }, [showDetailsModal]);

  const fetchLogisticsPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getAllLogisticsPersonnel(params);
      const personnelList = ensurePersonnelArray(response);
      console.log('[LogisticsPersonnel] fetched personnel', {
        filter,
        apiShape: response ? Object.keys(response) : [],
        count: personnelList.length,
        sample: personnelList[0]
      });
      setLogisticsPersonnel(personnelList);
    } catch (err) {
      setError(err.message || 'Failed to load logistics personnel');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (personnelId, action, reason = '') => {
    try {
      setActionLoading(personnelId);
      await updateLogisticsApproval(personnelId, action, reason);
      // Refresh the personnel list
      await fetchLogisticsPersonnel();
      // If we are in the modal, we might want to update the selected personnel too
      if (selectedPersonnel && selectedPersonnel._id === personnelId) {
        setShowDetailsModal(false);
        setSelectedPersonnel(null);
      }
    } catch (err) {
      setError(err.message || `Failed to ${action} logistics personnel`);
    } finally {
      setActionLoading(null);
    }
  };

  const openDetailsModal = (personnel) => {
    console.log('[LogisticsPersonnel] opening details modal', {
      personnelId: personnel?._id,
      personnel
    });
    setSelectedPersonnel(personnel);
    setDocumentErrors({});
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedPersonnel(null);
    setShowDetailsModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' },
      active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const personnelRows = useMemo(
    () =>
      logisticsPersonnel.map((personnel) => {
        const servicesList = safeArray(personnel.services);
        const { value: ratingValue, total: ratingTotal } = ratingDisplay(personnel.rating);
        return (
          <tr key={personnel._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  {personnel.documents?.profilePhoto ? (
                    <img className="h-10 w-10 rounded-full object-cover" src={personnel.documents.profilePhoto} alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {personnel.user?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {personnel.user?.email || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {personnel.phoneNumber || 'No phone'}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {personnel.businessName}
              </div>
              <div className="text-sm text-gray-500">
                {personnel.businessType}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {servicesList.length ? servicesList.join(', ') : 'No services'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStatusBadge(personnel.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="text-sm text-gray-900">
                  {ratingValue}
                </span>
                <Star className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
                <span className="text-sm text-gray-500 ml-1">
                  ({ratingTotal})
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openDetailsModal(personnel)}
                  className="flex items-center justify-center bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </button>

                {personnel.status === 'pending_approval' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprovalAction(personnel._id, 'approve')}
                      disabled={actionLoading === personnel._id}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 flex-1"
                    >
                      {actionLoading === personnel._id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) handleApprovalAction(personnel._id, 'reject', reason);
                      }}
                      disabled={actionLoading === personnel._id}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 flex-1"
                    >
                      {actionLoading === personnel._id ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
                {personnel.status === 'approved' && (
                  <button
                    onClick={() => {
                      const reason = prompt('Reason for suspension:');
                      if (reason) handleApprovalAction(personnel._id, 'suspend', reason);
                    }}
                    disabled={actionLoading === personnel._id}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 disabled:opacity-50 w-full"
                  >
                    {actionLoading === personnel._id ? '...' : 'Suspend'}
                  </button>
                )}
                {personnel.status === 'suspended' && (
                  <button
                    onClick={() => handleApprovalAction(personnel._id, 'reactivate')}
                    disabled={actionLoading === personnel._id}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 w-full"
                  >
                    {actionLoading === personnel._id ? '...' : 'Reactivate'}
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      }),
    [logisticsPersonnel, actionLoading]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logistics Personnel Management</h2>

      {/* Filters */}
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
              {status === 'all' ? 'All Personnel' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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

      {/* Logistics Personnel List */}
      <div className="bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : logisticsPersonnel.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {personnelRows}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No logistics personnel found for the selected filter.
          </div>
        )}
      </div>

      {/* Logistics Personnel Details Modal */}
      {showDetailsModal && selectedPersonnel && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40" aria-hidden="true" onClick={closeDetailsModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-50">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div className="flex items-center">
                    {selectedPersonnel.documents?.profilePhoto ? (
                      <img
                        src={selectedPersonnel.documents.profilePhoto}
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
                        {selectedPersonnel.user?.name || 'N/A'}
                      </h3>
                      <div className="flex items-center mt-1">
                        {getStatusBadge(selectedPersonnel.status)}
                        <span className="ml-3 flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          {ratingDisplay(selectedPersonnel.rating).value} ({ratingDisplay(selectedPersonnel.rating).total} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailsModal}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <Briefcase className="h-4 w-4 mr-2" /> Business Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Business Name:</span>
                        <span className="font-medium">{selectedPersonnel.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Business Type:</span>
                        <span className="font-medium capitalize">{selectedPersonnel.businessType?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedPersonnel.user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{selectedPersonnel.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="font-medium text-right">{selectedPersonnel.businessAddress?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Services & Capabilities */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <Truck className="h-4 w-4 mr-2" /> Services & Capabilities
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">Services:</span>
                        <div className="flex flex-wrap gap-1">
                          {safeArray(selectedPersonnel.services).map(service => (
                            <span key={service} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {service.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Special Capabilities:</span>
                        <div className="flex flex-wrap gap-1">
                          {safeArray(selectedPersonnel.specialCapabilities).map(cap => (
                            <span key={cap} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                              {cap.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Max Weight:</span>
                          <span className="font-medium">{selectedPersonnel.maxPackageWeight} kg</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">Fleet Size:</span>
                          <span className="font-medium">{selectedPersonnel.fleetSize} vehicles</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal & Emergency */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <User className="h-4 w-4 mr-2" /> Personal & Emergency
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date of Birth:</span>
                        <span className="font-medium">{formatDate(selectedPersonnel.dateOfBirth)}</span>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-gray-500 mb-1 font-semibold">Emergency Contact:</p>
                        <div className="flex justify-between">
                          <span>{selectedPersonnel.emergencyContact?.name} ({selectedPersonnel.emergencyContact?.relationship})</span>
                          <span className="font-medium">{selectedPersonnel.emergencyContact?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center text-md font-semibold text-gray-800 mb-3">
                      <Calendar className="h-4 w-4 mr-2" /> Operations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service Radius:</span>
                        <span className="font-medium">{selectedPersonnel.serviceRadius} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Operating Hours:</span>
                        <span className="font-medium">{selectedPersonnel.operatingHours?.start} - {selectedPersonnel.operatingHours?.end}</span>
                      </div>
                      <div className="flex flex-col pt-2 border-t">
                        <span className="text-gray-500 mb-1">Service Areas:</span>
                        <div className="flex flex-wrap gap-1">
                          {safeArray(selectedPersonnel.serviceAreas).map(area => (
                            <span key={area} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">{area}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Submitted Documents</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Business License', key: 'businessLicense' },
                      { label: 'Vehicle Reg.', key: 'vehicleRegistration' },
                      { label: 'Vehicle Front', key: 'vehicleFrontPhoto' },
                      { label: 'Vehicle Side', key: 'vehicleSidePhoto' },
                      { label: 'Vehicle Back', key: 'vehicleBackPhoto' },
                      { label: 'Profile Photo', key: 'profilePhoto' },
                    ].map((doc) => (
                      <div key={doc.key} className="border rounded-lg p-2 flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-2 truncate w-full text-center">{doc.label}</span>
                        {selectedPersonnel.documents?.[doc.key] ? (
                          <div className="relative w-full h-24 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                            {!documentErrors[doc.key] ? (
                              <>
                                <img
                                  src={selectedPersonnel.documents[doc.key]}
                                  alt={doc.label}
                                  className="max-w-full max-h-full object-contain"
                                  onError={() => setDocumentErrors((prev) => ({ ...prev, [doc.key]: true }))}
                                />
                                <a
                                  href={selectedPersonnel.documents[doc.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100"
                                >
                                  <Eye className="h-5 w-5 mr-1" /> Open
                                </a>
                              </>
                            ) : (
                              <a
                                href={selectedPersonnel.documents[doc.key]}
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

              {/* Modal Footer Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                {selectedPersonnel.status === 'pending_approval' && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading === selectedPersonnel._id}
                      onClick={() => handleApprovalAction(selectedPersonnel._id, 'approve')}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {actionLoading === selectedPersonnel._id ? 'Processing...' : 'Approve Personnel'}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === selectedPersonnel._id}
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) handleApprovalAction(selectedPersonnel._id, 'reject', reason);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {actionLoading === selectedPersonnel._id ? 'Processing...' : 'Reject Application'}
                    </button>
                  </>
                )}

                {selectedPersonnel.status === 'approved' && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedPersonnel._id}
                    onClick={() => {
                      const reason = prompt('Reason for suspension:');
                      if (reason) handleApprovalAction(selectedPersonnel._id, 'suspend', reason);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading === selectedPersonnel._id ? 'Processing...' : 'Suspend Personnel'}
                  </button>
                )}

                {selectedPersonnel.status === 'suspended' && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedPersonnel._id}
                    onClick={() => handleApprovalAction(selectedPersonnel._id, 'reactivate')}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading === selectedPersonnel._id ? 'Processing...' : 'Reactivate Personnel'}
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

export default LogisticsPersonnelManagement;

