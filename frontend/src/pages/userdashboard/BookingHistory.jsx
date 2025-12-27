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
  Filter
} from 'lucide-react';
import { getUserBookings } from '../../services/bookingService';

const BookingHistory = ({ stats }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, ride, delivery

  useEffect(() => {
    fetchHistory();
  }, [filter]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
      case 'picked_up':
      case 'driver_assigned':
      case 'driver_en_route': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</p>
                <p className="text-xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">GMD {stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</p>
                <p className="text-xl font-bold text-gray-900">{stats.avgRating || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Booking History</h2>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('ride')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filter === 'ride' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rides
              </button>
              <button 
                onClick={() => setFilter('delivery')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filter === 'delivery' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Deliveries
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Loading your history...</p>
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="p-4 lg:p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      booking.type === 'ride' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {booking.type === 'ride' ? <Car className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(booking.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {booking.type === 'ride' ? 'Ride' : 'Delivery'} to {booking.destinationLocation.address}
                      </h3>
                      
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{booking.pickupLocation.address}</span>
                        </div>
                        {booking.driver && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Star className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>Driver: {booking.driver.user?.name || 'Assigned'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end justify-between h-full">
                    <div className="font-bold text-gray-900">
                      GMD {booking.price?.amount || 0}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors mt-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start your first journey today!" 
                  : `You don't have any ${filter} history yet.`}
              </p>
            </div>
          )}
        </div>
        
        {!loading && bookings.length > 0 && (
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Show more history
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
