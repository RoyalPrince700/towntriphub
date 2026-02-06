import React, { useState, useEffect } from 'react';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Calendar,
  Package,
  Car,
  Clock,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { getUserBookings } from '../../services/bookingService';
import { getGivenReviews } from '../../services/reviewService';
import RatingReviewComponent from '../../components/RatingReviewComponent';

const BookingHistory = ({ stats }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  useEffect(() => {
    const fetchReviewed = async () => {
      try {
        const response = await getGivenReviews({ limit: 100 });
        if (response.success) {
          const reviewedIds = response.data
            .map((review) => review.booking?._id || review.booking)
            .filter(Boolean);
          setReviewedBookingIds(new Set(reviewedIds));
        }
      } catch (error) {
        console.error('Failed to fetch submitted reviews:', error);
      }
    };
    fetchReviewed();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.type = filter;
      
      const response = await getUserBookings(params);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    if (selectedBooking?._id) {
      setReviewedBookingIds((prev) => {
        const updated = new Set(prev);
        updated.add(selectedBooking._id);
        return updated;
      });
    }
    setShowReviewModal(false);
    setSelectedBooking(null);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trip History</h2>
          <p className="text-gray-500 font-medium">Review your past journeys and deliveries</p>
        </div>
        
        <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl w-fit">
          {['all', 'ride', 'delivery'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === type 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-xl">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-bold tracking-tight">Fetching your history...</p>
          </div>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-purple-100/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm ${
                    booking.type === 'ride' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {booking.type === 'ride' ? <Car size={28} /> : <Package size={28} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${getStatusStyle(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(booking.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                      {booking.type === 'ride' ? 'Ride' : 'Delivery'} to {booking.destinationLocation.address.split(',')[0]}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 font-medium">
                      <MapPin size={14} className="mr-2 text-purple-600" />
                      <span className="truncate max-w-[200px] md:max-w-md">{booking.pickupLocation.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">GMD {booking.price?.amount || 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {booking.status === 'completed' && !reviewedBookingIds.has(booking._id) && (
                      <button
                        onClick={() => handleOpenReview(booking)}
                        className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
                      >
                        Review
                      </button>
                    )}
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-purple-600 group-hover:bg-purple-50 transition-all">
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-xl">
            <Calendar size={64} className="text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No trips found</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm">
              Your travel history is currently empty. Ready to book your first trip?
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <XCircle size={24} />
            </button>
            <RatingReviewComponent
              booking={selectedBooking}
              onSubmit={handleReviewSubmitted}
              onSkip={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
