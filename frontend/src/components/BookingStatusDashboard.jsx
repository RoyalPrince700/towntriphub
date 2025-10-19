import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Car,
  Phone,
  DollarSign,
  Navigation,
  Package,
  AlertCircle
} from 'lucide-react';

const BookingStatusDashboard = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/bookings?status=pending,driver_assigned,driver_en_route,picked_up,in_transit');

      // Mock data for now
      const mockBookings = [
        {
          _id: '1',
          type: 'ride',
          status: 'driver_assigned',
          pickupLocation: { address: 'Banjul Market' },
          destinationLocation: { address: 'Serrekunda' },
          driver: {
            user: { name: 'John Driver', email: 'john@example.com', avatarUrl: null },
            vehicleMake: 'Toyota',
            vehicleModel: 'Corolla',
            vehiclePlate: 'BJL 1234',
            onlineStatus: 'online'
          },
          price: { amount: 75, currency: 'GMD' },
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          driverAssignedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        },
        {
          _id: '2',
          type: 'delivery',
          status: 'pending',
          pickupLocation: { address: 'Bakau Shop' },
          destinationLocation: { address: 'Brikama' },
          packageDetails: {
            description: 'Electronic items',
            weight: 2.5
          },
          createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        }
      ];

      setBookings(mockBookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Finding Driver'
      },
      driver_assigned: {
        color: 'bg-blue-100 text-blue-800',
        icon: User,
        text: 'Driver Assigned'
      },
      driver_en_route: {
        color: 'bg-indigo-100 text-indigo-800',
        icon: Navigation,
        text: 'Driver En Route'
      },
      picked_up: {
        color: 'bg-purple-100 text-purple-800',
        icon: Car,
        text: 'Picked Up'
      },
      in_transit: {
        color: 'bg-orange-100 text-orange-800',
        icon: Navigation,
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeElapsed = (date) => {
    const now = new Date();
    const bookingTime = new Date(date);
    const diffMinutes = Math.floor((now - bookingTime) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      // TODO: Implement cancel booking API call
      console.log('Cancelling booking:', bookingId);

      // Remove from local state for now
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bookings</h3>
          <p className="text-gray-500 mb-6">You don't have any active bookings at the moment.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book a Ride or Delivery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Bookings</h2>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {booking.type === 'ride' ? (
                      <Car className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <Package className="h-5 w-5 text-indigo-600 mr-2" />
                    )}
                    <span className="font-medium text-gray-900 capitalize">
                      {booking.type} Booking
                    </span>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {statusConfig.text}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      From: {booking.pickupLocation.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      To: {booking.destinationLocation.address}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Booked: {getTimeElapsed(booking.createdAt)}
                    </div>
                    {booking.price && (
                      <div className="flex items-center justify-end text-lg font-semibold text-green-600 mt-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {booking.price.amount} {booking.price.currency}
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Details for Deliveries */}
                {booking.type === 'delivery' && booking.packageDetails && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <div className="text-sm text-gray-700">
                      <strong>Package:</strong> {booking.packageDetails.description}
                      {booking.packageDetails.weight && ` (${booking.packageDetails.weight}kg)`}
                    </div>
                  </div>
                )}

                {/* Driver Information */}
                {booking.driver && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Your Driver</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="font-medium">{booking.driver.user.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Car className="h-4 w-4 mr-2" />
                          {booking.driver.vehicleMake} {booking.driver.vehicleModel}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="font-medium mr-2">Plate:</span>
                          {booking.driver.vehiclePlate}
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Driver
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Booking ID: {booking._id}
                  </div>
                  <div className="flex space-x-3">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Rate & Review
                      </button>
                    )}
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStatusDashboard;
