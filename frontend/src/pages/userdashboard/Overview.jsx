import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
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
  XCircle,
  User,
  Phone,
  Info
} from 'lucide-react';
import { getUserRatingStats, getUserReviews, getGivenReviews } from '../../services/reviewService';
import RatingReviewComponent from '../../components/RatingReviewComponent';

const Overview = ({ stats, recentBookings, driverProfile, logisticsProfile }) => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const userId = user?._id || user?.id;
  const [driverRatings, setDriverRatings] = useState({});
  const [driverRecentReviews, setDriverRecentReviews] = useState({});
  const [expandedDriverReview, setExpandedDriverReview] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleGoToDashboard = async (target) => {
    // Refresh user data to get the new role if they were just approved
    await refreshUser();
    if (target === 'logistics') {
      navigate('/logistics/dashboard');
      return;
    }
    navigate('/dashboard');
  };

  const getStatusDisplay = (profile, type) => {
    const status = profile?.status;
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
          message: profile.rejectionReason 
            ? `Unfortunately, your ${label.toLowerCase()} application was not approved. Reason: ${profile.rejectionReason}. You can make adjustments and reapply.`
            : `Unfortunately, your ${label.toLowerCase()} application was not approved. Please contact support for more information or try reapplying with updated information.`,
          label: 'Rejected',
          title: `${label} Application`
        };
      default:
        return null;
    }
  };

  const driverStatusInfo = driverProfile ? getStatusDisplay(driverProfile, 'driver') : null;
  const logisticsStatusInfo = logisticsProfile ? getStatusDisplay(logisticsProfile, 'logistics') : null;

  const activeBookings = recentBookings?.filter(b => 
    ['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit'].includes(b.status)
  ) || [];

  useEffect(() => {
    const loadDriverInsights = async () => {
      const driverIds = Array.from(
        new Set(
          activeBookings
            .map((booking) => booking.driver?.user?._id)
            .filter(Boolean)
        )
      );

      for (const driverUserId of driverIds) {
        if (driverRatings[driverUserId] && driverRecentReviews[driverUserId]) {
          continue;
        }
        try {
          const [statsResponse, reviewsResponse] = await Promise.all([
            getUserRatingStats(driverUserId),
            getUserReviews(driverUserId, { limit: 3, type: 'user_to_driver' })
          ]);

          if (statsResponse?.success) {
            setDriverRatings((prev) => ({ ...prev, [driverUserId]: statsResponse.data }));
          }

          if (reviewsResponse?.success) {
            setDriverRecentReviews((prev) => ({ ...prev, [driverUserId]: reviewsResponse.data }));
          }
        } catch (error) {
          console.error('Failed to load driver review info:', error);
        }
      }
    };

    loadDriverInsights();
  }, [activeBookings, driverRatings, driverRecentReviews]);

  useEffect(() => {
    const fetchReviewed = async () => {
      try {
        const response = await getGivenReviews({ limit: 100 });
        if (response.success) {
          const ids = response.data
            .map((review) => review.booking?._id || review.booking)
            .filter(Boolean);
          setReviewedBookingIds(new Set(ids));
        }
      } catch (error) {
        console.error('Failed to fetch submitted reviews:', error);
      }
    };
    fetchReviewed();
  }, []);

  const openReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const closeReview = () => {
    setSelectedBooking(null);
    setShowReviewModal(false);
  };

  const handleReviewSubmitted = () => {
    if (selectedBooking?._id) {
      setReviewedBookingIds((prev) => {
        const updated = new Set(prev);
        updated.add(selectedBooking._id);
        return updated;
      });
    }
    closeReview();
  };

  const toggleDriverReviews = (driverUserId) => {
    setExpandedDriverReview((prev) => (prev === driverUserId ? null : driverUserId));
  };

  const getBookingOwnerId = (booking) => booking?.user?._id || booking?.user;

  return (
    <div className="space-y-6">
      {/* Active Ride/Delivery - Better UX for Assigned Drivers */}
      {activeBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 px-1 flex items-center">
            <div className="w-2 h-6 bg-indigo-600 rounded-full mr-3 animate-pulse"></div>
            Active Ride Details
          </h2>
          {activeBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 transition-all hover:shadow-2xl">
              <div className="bg-indigo-600 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center text-white">
                  {booking.type === 'ride' ? <Car className="h-5 w-5 mr-2" /> : <Package className="h-5 w-5 mr-2" />}
                  <span className="font-semibold capitalize">{booking.type} in Progress</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                  {booking.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Driver & Car Details */}
                  <div className="space-y-6">
                    {booking.driver ? (
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          {booking.driver.user?.avatarUrl || booking.driver.documents?.profilePhoto ? (
                            <img 
                              src={booking.driver.user?.avatarUrl || booking.driver.documents?.profilePhoto} 
                              alt="Driver" 
                              className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
                            />
                          ) : (
                            <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-indigo-50 shadow-md">
                              <User className="h-10 w-10 text-indigo-400" />
                            </div>
                          )}
                          <div className="absolute -bottom-2 -right-2 bg-green-500 border-2 border-white h-5 w-5 rounded-full shadow-sm"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{booking.driver.user?.name || 'Assigned Driver'}</h3>
                          <div className="flex items-center text-yellow-500 mt-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-bold text-gray-700">
                              {booking.driver.rating?.average?.toFixed(1) 
                                || driverRatings[booking.driver.user?._id]?.averageRating
                                || '5.0'}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{booking.driver.statistics?.completedTrips || 0} trips</span>
                          </div>
                          {booking.driver.user?._id && (
                            <div className="mt-2 flex items-center space-x-2">
                              <button
                                onClick={() => toggleDriverReviews(booking.driver.user._id)}
                                className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                              >
                                {expandedDriverReview === booking.driver.user._id ? 'Hide reviews' : 'View driver reviews'}
                              </button>
                              {driverRatings[booking.driver.user._id] && (
                                <span className="text-xs text-gray-600">
                                  {driverRatings[booking.driver.user._id].averageRating?.toFixed?.(1) || driverRatings[booking.driver.user._id].averageRating || '0.0'} avg • {driverRatings[booking.driver.user._id].totalReviews || 0} reviews
                                </span>
                              )}
                            </div>
                          )}
                          <div className="mt-3 flex space-x-2">
                            <a 
                              href={`tel:${booking.driver.user?.phoneNumber || ''}`}
                              className="flex items-center justify-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mr-4"></div>
                        <p className="text-gray-500 font-medium">Assigning your driver...</p>
                      </div>
                    )}

                    {booking.driver && booking.driver.vehicle && (
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle Details</span>
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            {booking.driver.vehicle.plateNumber}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-lg">
                              {booking.driver.vehicle.year} {booking.driver.vehicle.make} {booking.driver.vehicle.model}
                            </p>
                            <p className="text-gray-500 text-sm capitalize">{booking.driver.vehicle.color} • {booking.driver.vehicle.vehicleType}</p>
                          </div>
                          {booking.driver.documents?.vehiclePhoto && (
                            <img 
                              src={booking.driver.documents.vehiclePhoto} 
                              alt="Car" 
                              className="h-16 w-24 rounded-lg object-cover shadow-sm ml-4"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {expandedDriverReview === booking.driver?.user?._id && (
                      <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">Recent Reviews</h4>
                          <span className="text-xs text-gray-500">
                            Showing latest {driverRecentReviews[booking.driver.user._id]?.length || 0}
                          </span>
                        </div>
                        {driverRecentReviews[booking.driver.user._id]?.length > 0 ? (
                          <div className="space-y-3">
                            {driverRecentReviews[booking.driver.user._id].map((review) => (
                              <div key={review._id} className="border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm font-bold text-gray-800">{review.rating}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                  </span>
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  by {review.reviewer?.name || 'Rider'}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No reviews yet for this driver.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Trip details */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 ml-2"></div>
                        <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-green-500 bg-white z-10"></div>
                        <div className="absolute left-0 bottom-1 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white z-10"></div>
                        
                        <div className="mb-6">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup</p>
                          <p className="text-sm font-semibold text-gray-700 truncate">{booking.pickupLocation.address}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                          <p className="text-sm font-semibold text-gray-700 truncate">{booking.destinationLocation.address}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fare</p>
                          <p className="text-xl font-black text-green-600">GMD {booking.price?.amount || '---'}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                          className="text-indigo-600 text-sm font-bold flex items-center hover:underline"
                        >
                          Full Details <Info className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <p className="text-lg lg:text-xl font-bold text-gray-900">{typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(1) : (stats.avgRating?.average?.toFixed(1) || '0.0')}</p>
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
                {driverProfile.status === 'approved' ? (
                  <button
                    onClick={() => handleGoToDashboard('driver')}
                    className="block w-full mt-2 text-indigo-600 hover:underline"
                  >
                    Go to Dashboard
                  </button>
                ) : driverProfile.status === 'rejected' ? (
                  <button
                    onClick={() => navigate('/driver/register')}
                    className="block w-full mt-2 text-indigo-600 hover:underline font-bold"
                  >
                    Reapply Now
                  </button>
                ) : null}
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
                {logisticsProfile.status === 'approved' ? (
                  <button
                    onClick={() => handleGoToDashboard('logistics')}
                    className="block w-full mt-2 text-indigo-600 hover:underline"
                  >
                    Go to Dashboard
                  </button>
                ) : logisticsProfile.status === 'rejected' ? (
                  <button
                    onClick={() => navigate('/logistics/register')}
                    className="block w-full mt-2 text-indigo-600 hover:underline font-bold"
                  >
                    Reapply Now
                  </button>
                ) : null}
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

      {/* Recent Activity / History */}
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Activity History</h2>
        
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
                      onClick={() => handleGoToDashboard('driver')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Go to Driver Dashboard
                    </button>
                  )}
                  {driverProfile.status === 'rejected' && (
                    <button
                      onClick={() => navigate('/driver/register')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Update & Reapply
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
                      onClick={() => handleGoToDashboard('logistics')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Go to Logistics Dashboard
                    </button>
                  )}
                  {logisticsProfile.status === 'rejected' && (
                    <button
                      onClick={() => navigate('/logistics/register')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Update & Reapply
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {recentBookings && recentBookings.length > 0 ? (
            recentBookings
              .filter(b => !['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit'].includes(b.status))
              .map((booking) => {
                const bookingOwnerId = getBookingOwnerId(booking);
                const isOwnedByCurrentUser =
                  !bookingOwnerId || !userId || bookingOwnerId?.toString?.() === userId?.toString?.();

                return (
                  <div key={booking._id} className="flex items-center p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/bookings/${booking._id}`)}>
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
                        {new Date(booking.createdAt).toLocaleDateString()} • <span className={`capitalize ${
                          booking.status === 'completed' ? 'text-green-600 font-medium' : 
                          booking.status === 'cancelled' ? 'text-red-600 font-medium' : 
                          'text-gray-600'
                        }`}>{booking.status.replace('_', ' ')}</span> • GMD {booking.price?.amount || 0}
                      </p>
                      {booking.status === 'completed' && isOwnedByCurrentUser && (
                        <div className="mt-2">
                          {reviewedBookingIds.has(booking._id) ? (
                            <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              Review submitted
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openReview(booking);
                              }}
                              className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                            >
                              Drop a review
                            </button>
                          )}
                        </div>
                      )}
                      {booking.status === 'completed' && !isOwnedByCurrentUser && (
                        <p className="mt-2 text-[11px] text-red-500">
                          This booking belongs to another user; review not available.
                        </p>
                      )}
                    </div>
                    <div className="ml-2">
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-6">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No recent activity found</p>
            </div>
          )}
        </div>
      </div>

      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-6">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="absolute -top-10 right-0">
              <button
                onClick={closeReview}
                className="text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            <RatingReviewComponent
              booking={selectedBooking}
              onSubmit={handleReviewSubmitted}
              onSkip={closeReview}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
