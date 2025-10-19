import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/adminService';
import {
  Car,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  UserCheck,
  Package
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const recentBookings = stats?.recentBookings || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Car className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{overview.totalBookings || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{stats?.driverStats?.approved || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{overview.pendingApprovals || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">D{overview.totalRevenue || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{overview.totalUsers || 0}</p>
          <p className="text-sm text-gray-600">Registered users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Bookings</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{overview.todaysBookings || 0}</p>
          <p className="text-sm text-gray-600">Bookings today</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {overview.totalBookings > 0
              ? Math.round((overview.completedBookings / overview.totalBookings) * 100)
              : 0}%
          </p>
          <p className="text-sm text-gray-600">Booking completion</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        {recentBookings.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {recentBookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {booking.type === 'ride' ? (
                    <Car className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
                  ) : (
                    <Package className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                  )}
                </div>
                <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} booking
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {booking.user?.name || 'Unknown User'} • {booking.pickupLocation?.address || 'Unknown location'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'driver_assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.price && (
                    <p className="text-sm font-medium text-gray-900">
                      D{booking.price.amount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent bookings to display.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
