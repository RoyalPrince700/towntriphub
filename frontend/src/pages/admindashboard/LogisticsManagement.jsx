import React, { useState, useEffect } from 'react';
import {
  getAllLogisticsPersonnel,
  updateLogisticsApproval
} from '../../services/adminService';
import { Star } from 'lucide-react';

const LogisticsManagement = () => {
  const [logisticsPersonnel, setLogisticsPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchLogisticsPersonnel();
  }, [filter]);

  const fetchLogisticsPersonnel = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getAllLogisticsPersonnel(params);
      setLogisticsPersonnel(response.data);
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
    } catch (err) {
      setError(err.message || `Failed to ${action} logistics personnel`);
    } finally {
      setActionLoading(null);
    }
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logistics Personnel Management</h2>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['all', 'pending_approval', 'approved', 'rejected', 'suspended'].map((status) => (
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
                {logisticsPersonnel.map((personnel) => (
                  <tr key={personnel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
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
                        {personnel.services?.join(', ') || 'No services'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(personnel.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {personnel.rating?.average?.toFixed(1) || 'N/A'}
                        </span>
                        <Star className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
                        <span className="text-sm text-gray-500 ml-1">
                          ({personnel.rating?.totalRatings || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {personnel.status === 'pending_approval' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprovalAction(personnel._id, 'approve')}
                            disabled={actionLoading === personnel._id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === personnel._id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection:');
                              if (reason) handleApprovalAction(personnel._id, 'reject', reason);
                            }}
                            disabled={actionLoading === personnel._id}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
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
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 disabled:opacity-50"
                        >
                          {actionLoading === personnel._id ? '...' : 'Suspend'}
                        </button>
                      )}
                      {personnel.status === 'suspended' && (
                        <button
                          onClick={() => handleApprovalAction(personnel._id, 'reactivate')}
                          disabled={actionLoading === personnel._id}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoading === personnel._id ? '...' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No logistics personnel found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsManagement;
