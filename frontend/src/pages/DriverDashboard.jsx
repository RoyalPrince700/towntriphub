import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Car,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Star,
  TrendingUp,
  AlertCircle,
  Power,
  Settings,
  BarChart3,
  Calendar
} from 'lucide-react';

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [driverProfile, setDriverProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'driver') {
      navigate('/');
      return;
    }
    fetchDriverData();
  }, [user, navigate]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);

      // Fetch driver profile
      const profileResponse = await fetch('/api/drivers/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch driver profile');
      }

      const profileData = await profileResponse.json();
      setDriverProfile(profileData.data);

      // Fetch assignments
      const assignmentsResponse = await fetch('/api/drivers/assignments?status=pending,driver_assigned,driver_en_route,picked_up,in_transit', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.data);
      }

      // Fetch statistics
      const statsResponse = await fetch('/api/drivers/statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data);
      }

      // Fetch earnings
      const earningsResponse = await fetch('/api/drivers/earnings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData.data);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching driver data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailabilityStatus = async (status) => {
    try {
      const response = await fetch('/api/drivers/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ availabilityStatus: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      // Update local state
      setDriverProfile(prev => ({
        ...prev,
        availabilityStatus: status,
      }));

    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Failed to update availability status');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Pending Approval'
      },
      approved: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Approved'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        text: 'Rejected'
      },
      suspended: {
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        text: 'Suspended'
      },
      offline: {
        color: 'bg-gray-100 text-gray-800',
        icon: Power,
        text: 'Offline'
      },
      available: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Available'
      },
      busy: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Busy'
      },
      on_trip: {
        color: 'bg-blue-100 text-blue-800',
        icon: Navigation,
        text: 'On Trip'
      }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mr-4" />
          <span className="text-red-600">{error}</span>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingAssignments = assignments.filter(a => a.status === 'driver_assigned');
  const activeAssignment = assignments.find(a => ['driver_en_route', 'picked_up', 'in_transit'].includes(a.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>

            {/* Availability Toggle */}
            {driverProfile && driverProfile.status === 'approved' && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex space-x-2">
                  {['offline', 'available', 'busy'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAvailabilityStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        driverProfile.availabilityStatus === status
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Driver Status Badge */}
          {driverProfile && (() => {
            const statusConfig = getStatusConfig(driverProfile.status);
            return (
              <div className="mt-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                  <statusConfig.icon className="h-4 w-4 mr-1" />
                  {statusConfig.text}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'assignments', label: 'Assignments', icon: MapPin },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'profile', label: 'Profile', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statistics && (
                  <>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <MapPin className="h-8 w-8 text-indigo-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Trips</p>
                          <p className="text-2xl font-bold text-gray-900">{statistics.totalTrips}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">{statistics.completionRate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <Star className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Rating</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {statistics.rating?.average?.toFixed(1) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-900">
                            GMD {earnings?.summary?.thisMonth || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Active Assignment */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignment</h3>
                {activeAssignment ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusConfig(activeAssignment.status).color}`}>
                        {getStatusConfig(activeAssignment.status).text}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">From: {activeAssignment.pickupLocation?.address}</p>
                      <p className="text-gray-600">To: {activeAssignment.destinationLocation?.address}</p>
                    </div>
                    {activeAssignment.price && (
                      <p className="text-lg font-semibold text-green-600">
                        GMD {activeAssignment.price.amount}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No active assignment</p>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              {/* Pending Assignments */}
              {pendingAssignments.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">New Assignments</h3>
                  <div className="space-y-4">
                    {pendingAssignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Car className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="font-medium text-gray-900 capitalize">
                              {assignment.type} Request
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            GMD {assignment.price?.amount || 'TBD'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              From: {assignment.pickupLocation?.address}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              To: {assignment.destinationLocation?.address}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Customer: {assignment.user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {assignment.user?.phoneNumber || 'Phone not available'}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Accept Assignment
                          </button>
                          <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Assignment Management */}
              {activeAssignment && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Trip</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Navigation className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">Trip in Progress</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusConfig(activeAssignment.status).color}`}>
                        {getStatusConfig(activeAssignment.status).text}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer: {activeAssignment.user?.name}</p>
                        <p className="text-sm text-gray-600">Phone: {activeAssignment.user?.phoneNumber || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          GMD {activeAssignment.price?.amount}
                        </p>
                      </div>
                    </div>

                    {/* Trip Actions */}
                    <div className="flex flex-wrap gap-3">
                      {activeAssignment.status === 'driver_assigned' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Start Trip (En Route)
                        </button>
                      )}
                      {activeAssignment.status === 'driver_en_route' && (
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                          Picked Up Passenger
                        </button>
                      )}
                      {activeAssignment.status === 'picked_up' && (
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                          Start Journey
                        </button>
                      )}
                      {activeAssignment.status === 'in_transit' && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Complete Trip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Trips */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trips</h3>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Trip history coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {earnings && (
                <>
                  {/* Earnings Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-gray-900">GMD {earnings.summary.total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-900">GMD {earnings.summary.thisMonth}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Pending Payout</p>
                          <p className="text-2xl font-bold text-gray-900">GMD {earnings.summary.pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Breakdown */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
                    <div className="space-y-3">
                      {earnings.breakdown.map((month, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="font-medium">
                              {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long'
                              })}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">GMD {month.totalEarnings}</p>
                            <p className="text-sm text-gray-600">{month.tripCount} trips</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Driver Profile</h3>

              {driverProfile && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{user?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{driverProfile.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{driverProfile.licenseNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">
                          {driverProfile.vehicle.make} {driverProfile.vehicle.model} ({driverProfile.vehicle.year})
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{driverProfile.vehicle.plateNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{driverProfile.vehicle.color}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                        <p className="text-gray-900 p-2 bg-gray-50 rounded">{driverProfile.vehicle.seatingCapacity} seats</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Service Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {driverProfile.serviceAreas.map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  {driverProfile.rating && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Rating</h4>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-2 text-lg font-semibold">
                          {driverProfile.rating.average.toFixed(1)}
                        </span>
                        <span className="ml-1 text-gray-600">
                          ({driverProfile.rating.totalRatings} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DriverDashboard;