import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Car, Package, DollarSign, Clock, CheckCircle, XCircle, Navigation, ArrowLeft, User, Phone, Image, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getBookingDetails } from '../services/bookingService';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  driver_assigned: { color: 'bg-blue-100 text-blue-800', label: 'Driver Assigned' },
  driver_en_route: { color: 'bg-purple-100 text-purple-800', label: 'Driver En Route' },
  picked_up: { color: 'bg-indigo-100 text-indigo-800', label: 'Picked Up' },
  in_transit: { color: 'bg-cyan-100 text-cyan-800', label: 'In Transit' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhotoModal, setProfilePhotoModal] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getBookingDetails(id);
        if (response.success) {
          setBooking(response.data);
        } else {
          setError(response.message || 'Failed to load booking');
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const statusBadge = statusConfig[booking?.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3" />
            <p className="text-gray-600">Loading booking...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-red-600">
            {error}
          </div>
        ) : booking ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {booking.type === 'ride' ? 'Ride' : 'Delivery'} details
                </h1>
                <p className="text-gray-600">
                  Booking ID: <span className="font-mono text-sm">{booking._id}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Fare</p>
                <p className="text-2xl font-bold text-green-600">GMD {booking.price?.amount || '—'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mr-3">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-gray-500">Pickup</p>
                    <p className="text-sm font-medium text-gray-900">{booking.pickupLocation?.address}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-3">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-gray-500">Destination</p>
                    <p className="text-sm font-medium text-gray-900">{booking.destinationLocation?.address}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600 mr-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-gray-500">Scheduled</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-3">
                    {booking.type === 'ride' ? <Car className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{booking.type}</p>
                  </div>
                </div>

                {booking.passengers && (
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600 mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-semibold text-gray-500">Passengers</p>
                      <p className="text-sm font-medium text-gray-900">{booking.passengers}</p>
                    </div>
                  </div>
                )}

                {booking.packageDetails && booking.type === 'delivery' && (
                  <div className="text-sm text-gray-700">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-1">Package</p>
                    {booking.packageDetails.description && <p>{booking.packageDetails.description}</p>}
                    {booking.packageDetails.weight && <p>Weight: {booking.packageDetails.weight} kg</p>}
                  </div>
                )}
              </div>
            </div>

            {booking.driver && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mr-3">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-semibold text-gray-500">Driver</p>
                      <p className="text-sm font-bold text-gray-900">{booking.driver.user?.name || 'Assigned driver'}</p>
                      {(() => {
                        const phone =
                          booking.driver.user?.phoneNumber ||
                          booking.driver.phoneNumber ||
                          booking.driver.profile?.phoneNumber;
                        if (!phone) {
                          return <p className="text-xs text-gray-500 mt-1">Phone number not available</p>;
                        }
                        return (
                          <a
                            href={`tel:${phone}`}
                            className="text-xs text-indigo-600 flex items-center mt-1"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {phone}
                          </a>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {booking.driver.documents?.profilePhoto && (
                      <img
                        src={booking.driver.documents.profilePhoto}
                        alt="Driver profile"
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm cursor-pointer"
                        onClick={() => setProfilePhotoModal(booking.driver.documents.profilePhoto)}
                      />
                    )}
                    {booking.driver.rating?.average && (
                      <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                        <StarRating value={booking.driver.rating.average} total={booking.driver.rating.totalRatings} />
                      </div>
                    )}
                  </div>
                </div>

                {booking.driver.vehicle && (
                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>Vehicle: <span className="font-semibold">{booking.driver.vehicle.make} {booking.driver.vehicle.model}</span></div>
                    <div>Plate: <span className="font-semibold">{booking.driver.vehicle.plateNumber}</span></div>
                    <div>Color: <span className="font-semibold capitalize">{booking.driver.vehicle.color}</span></div>
                    <div>Seats: <span className="font-semibold">{booking.driver.vehicle.seatingCapacity}</span></div>
                  </div>
                )}

                {/* Vehicle photos */}
                {(booking.driver.documents?.vehicleFrontPhoto ||
                  booking.driver.documents?.vehicleSidePhoto ||
                  booking.driver.documents?.vehicleBackPhoto) && (
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Image className="h-4 w-4 text-gray-500" />
                      <h4 className="text-sm font-semibold text-gray-900">Vehicle Photos</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {booking.driver.documents?.vehicleFrontPhoto && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500">Front view</p>
                          <img
                            src={booking.driver.documents.vehicleFrontPhoto}
                            alt="Vehicle front"
                            className="w-full h-40 object-cover rounded-lg border border-gray-100 shadow-sm"
                          />
                        </div>
                      )}
                      {booking.driver.documents?.vehicleSidePhoto && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500">Side view</p>
                          <img
                            src={booking.driver.documents.vehicleSidePhoto}
                            alt="Vehicle side"
                            className="w-full h-40 object-cover rounded-lg border border-gray-100 shadow-sm"
                          />
                        </div>
                      )}
                      {booking.driver.documents?.vehicleBackPhoto && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500">Back view</p>
                          <img
                            src={booking.driver.documents.vehicleBackPhoto}
                            alt="Vehicle back"
                            className="w-full h-40 object-cover rounded-lg border border-gray-100 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Payment status: <strong className="text-gray-900">{booking.payment?.status || 'pending'}</strong></span>
              </div>
              {booking.status === 'cancelled' && booking.cancellationReason && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>Cancelled because: {booking.cancellationReason}</span>
                </div>
              )}
              {booking.status === 'completed' && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ride completed</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <Footer />

      {/* Driver profile photo modal */}
      {profilePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
          onClick={() => setProfilePhotoModal(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
              aria-label="Close"
              onClick={() => setProfilePhotoModal(null)}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <img
              src={profilePhotoModal}
              alt="Driver profile full view"
              className="w-full h-full max-h-[80vh] object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const StarRating = ({ value, total }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L0.49 6.91l6.568-.955L10 0l2.942 5.955 6.568.955-4.755 4.635 1.123 6.545z" />
        </svg>
      </div>
      <span className="ml-1 text-sm font-semibold text-gray-900">{Number(value).toFixed(1)}</span>
      <span className="ml-2 text-xs text-gray-500">({total || 0})</span>
    </div>
  );
};

