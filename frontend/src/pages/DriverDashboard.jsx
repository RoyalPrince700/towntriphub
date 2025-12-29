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
  Users,
  TrendingUp,
  AlertCircle,
  Power,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { getUserReviews } from '../services/reviewService';

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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [driverReviews, setDriverReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'driver') {
      navigate('/');
      return;
    }
    fetchDriverData();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'reviews' && driverProfile) {
      fetchDriverReviews();
    }
  }, [activeTab, driverProfile]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);

      const authData = JSON.parse(localStorage.getItem('tth_auth') || '{}');
      const token = authData.token;

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch driver profile
      const profileResponse = await fetch('/api/drivers/profile', { headers });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch driver profile');
      }

      const profileData = await profileResponse.json();
      setDriverProfile(profileData.data);

      // Fetch assignments (all relevant statuses)
      const assignmentsResponse = await fetch('/api/drivers/assignments?status=driver_assigned,driver_en_route,picked_up,in_transit,completed,cancelled', { headers });

      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.data);
      }

      // Fetch statistics
      const statsResponse = await fetch('/api/drivers/statistics', { headers });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data);
      }

      // Fetch earnings
      const earningsResponse = await fetch('/api/drivers/earnings', { headers });

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

  const fetchDriverReviews = async () => {
    if (!driverProfile) return;

    const revieweeId = driverProfile.user?._id || driverProfile.user;
    if (!revieweeId) return;

    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await getUserReviews(revieweeId, { type: 'user_to_driver', limit: 20 });
      if (response.success) {
        setDriverReviews(response.data);
      } else {
        setReviewsError(response.message || 'Unable to load reviews');
      }
    } catch (err) {
      console.error('Error fetching driver reviews:', err);
      setReviewsError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const updateAvailabilityStatus = async (status) => {
    try {
      const authData = JSON.parse(localStorage.getItem('tth_auth') || '{}');
      const token = authData.token;

      const response = await fetch('/api/drivers/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  const updateTripStatus = async (bookingId, status) => {
    try {
      const authData = JSON.parse(localStorage.getItem('tth_auth') || '{}');
      const token = authData.token;

      const response = await fetch(`/api/drivers/assignments/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update status');
      }

      // Refresh data
      fetchDriverData();

    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.message);
    }
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelLoading(true);
      const authData = JSON.parse(localStorage.getItem('tth_auth') || '{}');
      const token = authData.token;

      const response = await fetch(`/api/bookings/${cancellingBooking._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setShowCancelModal(false);
      setCancellingBooking(null);
      setCancelReason('');
      fetchDriverData();

    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.message);
    } finally {
      setCancelLoading(false);
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
      },
      driver_assigned: {
        color: 'bg-blue-100 text-blue-800',
        icon: Car,
        text: 'Driver Assigned'
      },
      driver_en_route: {
        color: 'bg-purple-100 text-purple-800',
        icon: Navigation,
        text: 'En Route'
      },
      picked_up: {
        color: 'bg-indigo-100 text-indigo-800',
        icon: MapPin,
        text: 'Picked Up'
      },
      in_transit: {
        color: 'bg-cyan-100 text-cyan-800',
        icon: Car,
        text: 'In Transit'
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Completed'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        text: 'Cancelled'
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

  const assignedRides = assignments.filter(a => a.status === 'driver_assigned');
  const pendingRides = assignments.filter(a => ['driver_en_route', 'picked_up', 'in_transit'].includes(a.status));
  const completedRides = assignments.filter(a => a.status === 'completed');
  const cancelledRides = assignments.filter(a => a.status === 'cancelled');
  
  // Check if there's an ongoing ride (already accepted)
  const ongoingRide = assignments.find(a => ['driver_en_route', 'picked_up', 'in_transit'].includes(a.status));
  
  const activeAssignment = ongoingRide || assignments.find(a => a.status === 'driver_assigned');

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
              <div className="flex items-center mt-2">
                <p className="text-gray-600">
                  Welcome back, {user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0]}
                </p>
                {user?.role === 'driver' && (
                  <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    Driver
                  </span>
                )}
              </div>
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
        <div className="mb-8 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'assigned', label: 'Assigned Ride', icon: Car },
              { id: 'pending', label: 'Accepted Rides', icon: Navigation },
              { id: 'completed', label: 'Completed Rides', icon: CheckCircle },
              { id: 'cancelled', label: 'Cancelled Rides', icon: XCircle },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'profile', label: 'Profile', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
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
                
                {/* Recent Trips Mini List */}
                <div className="sm:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('completed')}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[...completedRides, ...cancelledRides]
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                      .slice(0, 3)
                      .map((trip) => (
                      <div key={trip._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${trip.status === 'completed' ? 'bg-green-50' : 'bg-red-50'}`}>
                            {trip.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{trip.type} to {trip.destinationLocation?.address.split(',')[0]}</p>
                            <p className="text-xs text-gray-500">{new Date(trip.updatedAt || trip.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${trip.status === 'completed' ? 'text-gray-900' : 'text-red-400'}`}>
                          {trip.status === 'completed' ? (trip.price?.amount !== undefined ? `GMD ${trip.price.amount}` : 'GMD 0') : 'Cancelled'}
                        </p>
                      </div>
                    ))}
                    {completedRides.length === 0 && cancelledRides.length === 0 && (
                      <p className="text-center py-4 text-gray-500 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current/Ongoing Ride Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {ongoingRide ? 'Ongoing Ride' : 'Next Assignment'}
                  </h3>
                  {activeAssignment ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusConfig(activeAssignment.status).color}`}>
                          {getStatusConfig(activeAssignment.status).text}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{activeAssignment.pickupLocation?.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{activeAssignment.destinationLocation?.address}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="text-sm font-bold text-gray-900">{activeAssignment.user?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Fare</p>
                          <p className="text-lg font-bold text-green-600">GMD {activeAssignment.price?.amount || 'TBD'}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveTab(ongoingRide ? 'pending' : 'assigned')}
                        className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        {ongoingRide ? 'Manage Ongoing Ride' : 'View Assignment'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No active ride</p>
                    </div>
                  )}
                </div>

                {/* Quick Availability Toggle (Small Version) */}
                <div className="bg-indigo-900 rounded-lg shadow p-6 text-white">
                  <h3 className="text-sm font-bold mb-4 opacity-80">Online Status</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['offline', 'available', 'busy'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateAvailabilityStatus(status)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                          driverProfile?.availabilityStatus === status
                            ? 'bg-white text-indigo-900 shadow-md transform scale-105'
                            : 'bg-indigo-800 text-indigo-300 hover:bg-indigo-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Ride Tab */}
          {activeTab === 'assigned' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">New Assignments</h3>
                  {ongoingRide && (
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Complete current ride to accept new ones
                    </span>
                  )}
                </div>
                {assignedRides.length > 0 ? (
                  <div className="space-y-4">
                    {assignedRides.map((assignment) => (
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
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              To: {assignment.destinationLocation?.address}
                            </div>
                            {assignment.passengers && (
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Users className="h-4 w-4 mr-1" />
                                Passengers: {assignment.passengers}
                              </div>
                            )}
                            {assignment.scheduledTime && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Scheduled: {new Date(assignment.scheduledTime).toLocaleString()}
                              </div>
                            )}
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
                          <button 
                            onClick={() => updateTripStatus(assignment._id, 'driver_en_route')}
                            disabled={!!ongoingRide}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                              ongoingRide 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            Accept & Start
                          </button>
                          <button 
                            onClick={() => {
                              setCancellingBooking(assignment);
                              setShowCancelModal(true);
                            }}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No new assignments at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accepted Rides (Pending) Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted & Ongoing Rides</h3>
                {pendingRides.length > 0 ? (
                  <div className="space-y-6">
                    {pendingRides.map((ride) => (
                      <div key={ride._id} className="border border-indigo-100 bg-indigo-50/30 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Navigation className="h-6 w-6 text-indigo-600 mr-2" />
                            <span className="font-bold text-gray-900">Ride in Progress</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(ride.status).color}`}>
                            {getStatusConfig(ride.status).text}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                          <div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pickup</p>
                                <p className="text-sm text-gray-900 font-medium mt-1">{ride.pickupLocation?.address}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</p>
                                <p className="text-sm text-gray-900 font-medium mt-1">{ride.destinationLocation?.address}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Details</p>
                            <p className="text-sm font-bold text-gray-900">{ride.user?.name}</p>
                            <p className="text-sm text-indigo-600 mt-1">{ride.user?.phoneNumber || 'N/A'}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm font-bold text-green-600 text-xl">GMD {ride.price?.amount || '0'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Trip Actions */}
                        <div className="flex flex-wrap gap-4">
                          {ride.status === 'driver_assigned' && (
                            <button 
                              onClick={() => updateTripStatus(ride._id, 'driver_en_route')}
                              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-md"
                            >
                              Start Trip
                            </button>
                          )}
                          {ride.status === 'driver_en_route' && (
                            <button 
                              onClick={() => updateTripStatus(ride._id, 'picked_up')}
                              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bold shadow-md"
                            >
                              Picked Up Passenger
                            </button>
                          )}
                          {ride.status === 'picked_up' && (
                            <button 
                              onClick={() => updateTripStatus(ride._id, 'in_transit')}
                              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold shadow-md"
                            >
                              Start Journey
                            </button>
                          )}
                          {ride.status === 'in_transit' && (
                            <button 
                              onClick={() => updateTripStatus(ride._id, 'completed')}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md"
                            >
                              Complete Trip
                            </button>
                          )}
                          
                          {['driver_assigned', 'driver_en_route'].includes(ride.status) && (
                            <button 
                              onClick={() => {
                                setCancellingBooking(ride);
                                setShowCancelModal(true);
                              }}
                              className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                            >
                              Cancel Ride
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No active rides at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Rides Tab */}
          {activeTab === 'completed' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Rides</h3>
              {completedRides.length > 0 ? (
                <div className="space-y-4">
                  {completedRides.map((trip) => (
                    <div key={trip._id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg mr-3 bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 capitalize">{trip.type} - Completed</p>
                            <p className="text-xs text-gray-500">{new Date(trip.updatedAt || trip.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">GMD {trip.price?.amount || 0}</p>
                          <p className="text-xs text-gray-500">Earned</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p className="truncate"><span className="font-medium text-gray-400 mr-1">From:</span> {trip.pickupLocation?.address}</p>
                        <p className="truncate"><span className="font-medium text-gray-400 mr-1">To:</span> {trip.destinationLocation?.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No completed rides yet</p>
                </div>
              )}
            </div>
          )}

          {/* Cancelled Rides Tab */}
          {activeTab === 'cancelled' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancelled Rides</h3>
              {cancelledRides.length > 0 ? (
                <div className="space-y-4">
                  {cancelledRides.map((trip) => (
                    <div key={trip._id} className="border border-red-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg mr-3 bg-red-100">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 capitalize">{trip.type} - Cancelled</p>
                            <p className="text-xs text-gray-500">{new Date(trip.updatedAt || trip.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {trip.cancellation?.reason && (
                          <div className="text-right">
                            <span className="inline-block px-2 py-1 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                              REASON: {trip.cancellation.reason}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 opacity-60">
                        <p className="truncate"><span className="font-medium mr-1">From:</span> {trip.pickupLocation?.address}</p>
                        <p className="truncate"><span className="font-medium mr-1">To:</span> {trip.destinationLocation?.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No cancelled rides</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Driver Reviews</h3>
                  <p className="text-sm text-gray-500">
                    See what riders are saying about your completed trips.
                  </p>
                </div>
                {driverProfile?.rating && (
                  <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                    <Star className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-bold">
                        {driverProfile.rating.average?.toFixed(1) || '0.0'}
                      </p>
                      <p className="text-[11px] text-yellow-700">
                        {driverProfile.rating.totalRatings || 0} reviews
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {reviewsLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="py-8 text-center text-red-600 text-sm">
                  {reviewsError}
                </div>
              ) : driverReviews.length > 0 ? (
                <div className="space-y-4">
                  {driverReviews.map((review) => (
                    <div key={review._id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-bold text-gray-900">{review.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      )}
                      <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                        <span>Rider: {review.reviewer?.name || 'Anonymous'}</span>
                        {review.booking?.destinationLocation?.address && (
                          <span className="text-right line-clamp-1">
                            Trip to {review.booking.destinationLocation.address}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 text-sm">
                  No reviews yet. Complete trips to start collecting feedback.
                </div>
              )}
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

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cancel Ride</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Please provide a reason for cancelling this ride. This will be shared with the admin.
                </p>
                <form onSubmit={handleCancelBooking}>
                  <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="4"
                    placeholder="Enter cancellation reason..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCancelModal(false);
                        setCancellingBooking(null);
                        setCancelReason('');
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={cancelLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {cancelLoading ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;


