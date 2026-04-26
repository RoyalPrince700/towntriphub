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
  Info,
  ArrowRight,
  Shield,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { getUserRatingStats, getUserReviews, getGivenReviews } from '../../services/reviewService';
import RatingReviewComponent from '../../components/RatingReviewComponent';
import MapWithDirections from '../../components/MapWithDirections';
import { useGoogleMaps } from '../../context/GoogleMapsContext.jsx';

const Overview = ({ stats, recentBookings, driverProfile, logisticsProfile }) => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { isLoaded: mapsLoaded } = useGoogleMaps();
  const userId = user?._id || user?.id;
  const [driverRatings, setDriverRatings] = useState({});
  const [driverRecentReviews, setDriverRecentReviews] = useState({});
  const [expandedDriverReview, setExpandedDriverReview] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleGoToDashboard = async (target) => {
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
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          icon: Clock,
          message: `Your ${label.toLowerCase()} application is under review.`,
          label: 'Pending Approval',
        };
      case 'approved':
        return {
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100',
          icon: CheckCircle,
          message: `Your ${label.toLowerCase()} application is approved!`,
          label: 'Approved',
        };
      case 'rejected':
        return {
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
          icon: XCircle,
          message: profile.rejectionReason || `Application rejected. Contact support.`,
          label: 'Rejected',
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
    <div className="space-y-10 animate-fade-in">
      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
              <span className="w-2 h-8 bg-purple-600 rounded-full mr-4"></span>
              Current Trip
            </h2>
            <div className="flex items-center space-x-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
              <span>Live Tracking</span>
            </div>
          </div>
          
          {activeBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100/50 overflow-hidden border border-purple-50/50">
              <div className="bg-purple-600 p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4">
                    {booking.type === 'ride' ? <Car size={24} /> : <Package size={24} />}
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs font-bold uppercase tracking-widest">Active {booking.type}</p>
                    <h3 className="text-xl font-bold capitalize">{booking.status.replace('_', ' ')}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                   <button 
                     onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                     className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                   >
                     <MapPin size={16} />
                     View Live Map
                   </button>
                   <button className="bg-white text-purple-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 hover:bg-purple-50 transition-all">
                    Safety Center
                   </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Driver Column */}
                  <div className="space-y-8">
                    {booking.driver ? (
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <img
                            src={booking.driver.user?.avatarUrl || booking.driver.documents?.profilePhoto || 'https://picsum.photos/id/64/150/150'}
                            alt="Driver"
                            className="h-24 w-24 rounded-3xl object-cover border-4 border-purple-50 shadow-xl"
                            onError={(e) => {
                              e.target.src = 'https://picsum.photos/id/64/150/150';
                            }}
                          />
                          <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white h-7 w-7 rounded-full shadow-lg"></div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="text-2xl font-black text-gray-900">{booking.driver.user?.name || 'Your Driver'}</h4>
                            <div className="flex items-center mt-1 space-x-3">
                              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                                <Star size={14} fill="currentColor" className="mr-1" />
                                <span className="text-xs font-black">4.9</span>
                              </div>
                              <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">5,000+ Trips</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <a href={`tel:${booking.driver.user?.phoneNumber}`} className="flex-1 flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-2xl hover:bg-gray-800 transition-all group">
                              <Phone size={18} />
                              <span className="font-bold text-sm">Call</span>
                            </a>
                            <button className="flex-1 flex items-center justify-center space-x-2 bg-purple-50 text-purple-600 py-3 rounded-2xl hover:bg-purple-100 transition-all group">
                              <MessageSquare size={18} />
                              <span className="font-bold text-sm">Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-2xl mr-4"></div>
                        <p className="text-gray-400 font-bold tracking-tight">Assigning your driver...</p>
                      </div>
                    )}

                    {booking.driver?.vehicle && (
                      <div className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Vehicle</p>
                          <h5 className="text-lg font-bold text-gray-900">
                            {booking.driver.vehicle.year} {booking.driver.vehicle.make} {booking.driver.vehicle.model}
                          </h5>
                          <p className="text-sm text-gray-500 font-medium capitalize">{booking.driver.vehicle.color} • {booking.driver.vehicle.vehicleType}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-lg font-black tracking-tighter shadow-sm">
                            {booking.driver.vehicle.plateNumber}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Route Column */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-8">
                      <div className="relative pl-10">
                        <div className="absolute left-[1.125rem] top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-500 via-purple-200 to-purple-600"></div>
                        <div className="absolute left-0 top-1 w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="absolute left-0 bottom-1 w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm">
                          <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                        </div>
                        
                        <div className="mb-10">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pickup Point</p>
                          <p className="text-base font-bold text-gray-800 leading-snug">{booking.pickupLocation.address}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Destination</p>
                          <p className="text-base font-bold text-gray-800 leading-snug">{booking.destinationLocation.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Fare</p>
                        <p className="text-3xl font-black text-emerald-600">GMD {booking.price?.amount || '---'}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                        className="flex items-center space-x-2 text-purple-600 font-black text-sm uppercase tracking-tighter hover:translate-x-1 transition-transform"
                      >
                        <span>Details</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Route Map for User */}
                {mapsLoaded && booking.pickupLocation?.coordinates && booking.destinationLocation?.coordinates && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="font-semibold text-gray-900">Live Route • Real-time Navigation</p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Serrekunda → Kololi Area</span>
                    </div>
                    <MapWithDirections
                      pickupCoords={booking.pickupLocation.coordinates}
                      destinationCoords={booking.destinationLocation.coordinates}
                      driverLocation={booking.driverLocation || (booking.driver?.location)}
                      className="h-80 w-full rounded-3xl shadow-inner border border-gray-100 overflow-hidden"
                    />
                    <p className="text-center text-[10px] text-gray-400 mt-3">
                      Blue route shows your trip • Blue dot shows driver location (updates live)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Trips', value: stats.totalBookings, icon: MapPin, color: 'indigo' },
            { label: 'Completion', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'emerald' },
            { label: 'Total Spent', value: `GMD ${stats.totalSpent}`, icon: DollarSign, color: 'blue' },
            { label: 'Avg Rating', value: (typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(1) : (stats.avgRating?.average?.toFixed(1) || '0.0')), icon: Star, color: 'amber' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/20 group hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modern CTAs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Driver CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-[2.5rem] p-10 text-white group shadow-2xl shadow-purple-100">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
              <Car size={12} />
              <span>Earn Extra</span>
            </div>
            <h3 className="text-3xl font-black leading-tight">Become a <br />TownTrip Driver</h3>
            <p className="text-purple-100 text-sm max-w-xs leading-relaxed">
              Join our elite network of drivers. Set your own hours and get the best rates in The Gambia.
            </p>
            
            <div className="pt-4">
              {driverProfile ? (
                <div className={`inline-flex flex-col space-y-2 p-4 rounded-2xl border ${driverStatusInfo?.bgColor} ${driverStatusInfo?.borderColor} text-gray-900`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className={driverStatusInfo?.color} />
                    <span className="font-bold text-sm">{driverStatusInfo?.label}</span>
                  </div>
                  {driverProfile.status === 'approved' && (
                    <button onClick={() => handleGoToDashboard('driver')} className="text-purple-600 text-xs font-black uppercase tracking-tighter hover:underline">Go to Dashboard</button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/driver/register')}
                  className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl hover:bg-purple-50 transition-all flex items-center space-x-2"
                >
                  <span>Register Now</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
          <Car className="absolute bottom-[-10%] right-[-10%] w-64 h-64 text-white/10 rotate-[-20deg] group-hover:rotate-0 transition-transform duration-700" />
        </div>

        {/* Logistics CTA */}
        <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-gray-100 group">
          <div className="relative z-10 space-y-6">
             <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              <Truck size={12} />
              <span>Logistics</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">Partner as <br />Delivery Hero</h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Fast-track your income with our delivery network. Send packages and earn per mile.
            </p>
            
            <div className="pt-4">
              {logisticsProfile ? (
                 <div className={`inline-flex flex-col space-y-2 p-4 rounded-2xl border ${logisticsStatusInfo?.bgColor} ${logisticsStatusInfo?.borderColor} text-gray-900`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className={logisticsStatusInfo?.color} />
                    <span className="font-bold text-sm">{logisticsStatusInfo?.label}</span>
                  </div>
                  {logisticsProfile.status === 'approved' && (
                    <button onClick={() => handleGoToDashboard('logistics')} className="text-emerald-600 text-xs font-black uppercase tracking-tighter hover:underline">Go to Dashboard</button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/logistics/register')}
                  className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl hover:bg-gray-800 transition-all flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
          <Package className="absolute bottom-[-10%] right-[-10%] w-64 h-64 text-gray-50 rotate-[-20deg] group-hover:rotate-0 transition-transform duration-700" />
        </div>
      </div>

      {/* Recent History Table-like view */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-100/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center">
             <Calendar size={28} className="mr-4 text-purple-600" />
             Recent Activity
          </h2>
          <button onClick={() => navigate('/history')} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-purple-600 transition-colors">
            View All Trips
          </button>
        </div>

        <div className="space-y-4">
          {recentBookings && recentBookings.length > 0 ? (
            recentBookings
              .filter(b => !['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit'].includes(b.status))
              .map((booking) => (
                <div key={booking._id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 hover:bg-white border border-transparent hover:border-purple-100 hover:shadow-xl hover:shadow-purple-100/20 transition-all cursor-pointer" onClick={() => navigate(`/bookings/${booking._id}`)}>
                  <div className="flex items-center space-x-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      booking.type === 'ride' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {booking.type === 'ride' ? <Car size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-none mb-1 capitalize">
                        {booking.type} to {booking.destinationLocation.address.split(',')[0]}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center justify-between md:space-x-12">
                    <div className="text-left md:text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        booking.status === 'completed' ? 'text-emerald-500' : 
                        booking.status === 'cancelled' ? 'text-rose-500' : 'text-gray-400'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </p>
                      <p className="text-lg font-black text-gray-900 tracking-tighter">GMD {booking.price?.amount || 0}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                       {booking.status === 'completed' && !reviewedBookingIds.has(booking._id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openReview(booking);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
                        >
                          Review
                        </button>
                      )}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 group-hover:border-purple-100 transition-colors">
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <Clock size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold tracking-tight">No recent activity to show.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 animate-scale-in">
            <button
              onClick={closeReview}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <XCircle size={24} />
            </button>
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
