import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  updateUserStatus
} from '../../services/adminService';
import { CheckCircle, XCircle, Search, Users as UsersIcon } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await getAllUsers(params);
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      setActionLoading(userId);
      await updateUserStatus(userId, newStatus);

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, isEmailVerified: newStatus === 'verified' }
            : user
        )
      );
    } catch (err) {
      setError(err.message || `Failed to ${newStatus} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (isVerified) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
        isVerified
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isVerified ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Unverified
          </>
        )}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { color: 'bg-blue-100 text-blue-800', label: 'User' },
      driver: { color: 'bg-green-100 text-green-800', label: 'Driver' },
      logistics: { color: 'bg-purple-100 text-purple-800', label: 'Logistics' },
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
    };

    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', label: role };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex space-x-2">
              {['all', 'verified', 'unverified'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <div className="flex space-x-2">
              {['all', 'user', 'driver', 'logistics'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    roleFilter === role
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
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

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isEmailVerified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.isEmailVerified ? (
                        <button
                          onClick={() => handleStatusUpdate(user._id, 'unverified')}
                          disabled={actionLoading === user._id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          title="Mark as unverified"
                        >
                          {actionLoading === user._id ? '...' : 'Unverify'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(user._id, 'verified')}
                          disabled={actionLoading === user._id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Mark as verified"
                        >
                          {actionLoading === user._id ? '...' : 'Verify'}
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
            <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
