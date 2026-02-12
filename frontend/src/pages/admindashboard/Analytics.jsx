import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/adminService';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, DollarSign, Package, Car, Users, UserCheck } from 'lucide-react';

const COLORS = {
  primary: '#8B5CF6',
  secondary: '#10B981',
  accent: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4'
};

const STATUS_COLORS = {
  pending: '#F59E0B',
  driver_assigned: '#3B82F6',
  driver_en_route: '#06B6D4',
  picked_up: '#8B5CF6',
  in_transit: '#6366F1',
  completed: '#10B981',
  cancelled: '#EF4444'
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getAnalytics(period);
        setAnalytics(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    return `D${value?.toLocaleString() || 0}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.bookingsOverTime.reduce((sum, item) => sum + item.bookings, 0)}
              </p>
            </div>
            <Car className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.revenueOverTime.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.avgBookingValue.length > 0
                  ? formatCurrency(
                      Math.round(
                        analytics.avgBookingValue.reduce((sum, item) => sum + item.avgValue, 0) /
                        analytics.avgBookingValue.length
                      )
                    )
                  : formatCurrency(0)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.bookingsByStatus.find((item) => item.status === 'completed')?.count || 0}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bookings Over Time */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.bookingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
                formatter={(value) => [value, 'Bookings']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Bookings"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.revenueOverTime}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `D${value}`}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.secondary}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Type */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.bookingsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count, percent }) =>
                  `${type === 'ride' ? 'Ride' : 'Delivery'}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.bookingsByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'ride' ? COLORS.primary : COLORS.secondary}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.bookingsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                tickFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Bookings">
                {analytics.bookingsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS.info} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
                formatter={(value) => [value, 'New Users']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="New Users"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Driver & Logistics Growth */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Service Provider Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                data={analytics.driverGrowth}
                stroke={COLORS.accent}
                strokeWidth={2}
                name="Drivers"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                data={analytics.logisticsGrowth}
                stroke={COLORS.secondary}
                strokeWidth={2}
                name="Logistics Personnel"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Booking Value */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Booking Value Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.avgBookingValue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={(value) => `D${value}`}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              labelFormatter={(value) => `Date: ${formatDate(value)}`}
              formatter={(value) => [formatCurrency(value), 'Avg Value']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgValue"
              stroke={COLORS.warning}
              strokeWidth={2}
              name="Average Value"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Drivers */}
      {analytics.topDrivers && analytics.topDrivers.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Drivers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topDrivers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" style={{ fontSize: '12px' }} />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === 'completedBookings' ? value : formatCurrency(value),
                  name === 'completedBookings' ? 'Completed Bookings' : 'Total Revenue'
                ]}
              />
              <Legend />
              <Bar dataKey="completedBookings" name="Completed Bookings" fill={COLORS.primary} />
              <Bar dataKey="totalRevenue" name="Total Revenue" fill={COLORS.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
