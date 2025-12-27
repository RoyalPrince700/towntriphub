import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Car,
  Truck,
  UserPlus,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Overview = ({ stats, recentBookings, driverProfile, logisticsProfile }) => {
  const navigate = useNavigate();

  const getStatusDisplay = (status, type) => {
    const label = type === 'driver' ? 'Driver' : 'Logistics';
    switch (status) {
      case 'pending_approval':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Clock,
          message: `Your ${label.toLowerCase()} application is currently being reviewed by our team. We will notify you once it is approved.`,
          label: 'Pending Review',
          title: `${label} Application`
        };
      case 'approved':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          message: `Congratulations! Your ${label.toLowerCase()} application has been approved. You can now access the ${label.toLowerCase()} dashboard.`,
          label: 'Approved',
          title: `${label} Application`
        };
      case 'rejected':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: XCircle,
          message: `Unfortunately, your ${label.toLowerCase()} application was not approved. Please contact support for more information.`,
          label: 'Rejected',
          title: `${label} Application`
        };
      default:
        return null;
    }
  };

  const driverStatusInfo = driverProfile ? getStatusDisplay(driverProfile.status, 'driver') : null;
  const logisticsStatusInfo = logisticsProfile ? getStatusDisplay(logisticsProfile.status, 'logistics') : null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">GMD {stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{stats.avgRating || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Options */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <UserPlus className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Become a Service Provider</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Join our network and start earning! Register as a driver or delivery personnel to provide services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Register as Driver</h3>
                <p className="text-sm text-gray-600">Provide ride services</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Share rides and earn money by transporting passengers around The Gambia.
            </p>
            {driverProfile ? (
              <div className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center ${
                driverProfile.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                driverProfile.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                Application {driverProfile.status.replace('_', ' ')}
                {driverProfile.status === 'approved' && (
                  <button
                    onClick={() => navigate('/driver/dashboard')}
                    className="block w-full mt-2 text-indigo-600 hover:underline"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/driver/register')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Car className="h-4 w-4 mr-2" />
                Register as Driver
              </button>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <Truck className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Register as Delivery</h3>
                <p className="text-sm text-gray-600">Provide delivery services</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Deliver packages and earn money by providing logistics services.
            </p>
            {logisticsProfile ? (
              <div className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center ${
                logisticsProfile.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                logisticsProfile.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                Application {logisticsProfile.status.replace('_', ' ')}
                {logisticsProfile.status === 'approved' && (
                  <button
                    onClick={() => navigate('/logistics/dashboard')}
                    className="block w-full mt-2 text-indigo-600 hover:underline"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/logistics/register')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Truck className="h-4 w-4 mr-2" />
                Register as Delivery
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        <div className="space-y-3 lg:space-y-4">
          {/* Driver Application Status */}
          {driverStatusInfo && (
            <div className={`p-4 rounded-lg border ${driverStatusInfo.bgColor} ${driverStatusInfo.borderColor} mb-4`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <driverStatusInfo.icon className={`h-5 w-5 ${driverStatusInfo.color}`} />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-bold ${driverStatusInfo.color}`}>
                    {driverStatusInfo.title}: {driverStatusInfo.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700">
                    {driverStatusInfo.message}
                  </p>
                  {driverProfile.status === 'approved' && (
                    <button
                      onClick={() => navigate('/driver/dashboard')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Go to Driver Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Logistics Application Status */}
          {logisticsStatusInfo && (
            <div className={`p-4 rounded-lg border ${logisticsStatusInfo.bgColor} ${logisticsStatusInfo.borderColor} mb-4`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <logisticsStatusInfo.icon className={`h-5 w-5 ${logisticsStatusInfo.color}`} />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-bold ${logisticsStatusInfo.color}`}>
                    {logisticsStatusInfo.title}: {logisticsStatusInfo.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700">
                    {logisticsStatusInfo.message}
                  </p>
                  {logisticsProfile.status === 'approved' && (
                    <button
                      onClick={() => navigate('/logistics/dashboard')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Go to Logistics Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {recentBookings && recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
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
                    {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} to {booking.destinationLocation.address}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {new Date(booking.createdAt).toLocaleDateString()} • {booking.status} • GMD {booking.price?.amount || 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No recent bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
