import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import RideBookingForm from '../components/RideBookingForm';
import DeliveryBookingForm from '../components/DeliveryBookingForm';
import { Car, Package, CheckCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleRideBooking = async (formData) => {
    setBookingLoading(true);
    try {
      // TODO: Implement API call to create ride booking
      console.log('Ride booking data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setBookingSuccess({
        type: 'ride',
        message: 'Ride booked successfully! A driver will be assigned soon.',
        data: formData
      });
    } catch (error) {
      console.error('Ride booking failed:', error);
      // TODO: Handle error
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDeliveryBooking = async (formData) => {
    setBookingLoading(true);
    try {
      // TODO: Implement API call to create delivery booking
      console.log('Delivery booking data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setBookingSuccess({
        type: 'delivery',
        message: 'Delivery booked successfully! A driver will be assigned soon.',
        data: formData
      });
    } catch (error) {
      console.error('Delivery booking failed:', error);
      // TODO: Handle error
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(null);
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    // Show landing page for non-authenticated users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    );
  }

  // Show booking interface for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Ready to book a ride or send a delivery? Choose your service below.
          </p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-900">
                  {bookingSuccess.type === 'ride' ? 'Ride Booked!' : 'Delivery Booked!'}
                </h3>
                <p className="text-green-700 mt-1">{bookingSuccess.message}</p>
                <button
                  onClick={resetBooking}
                  className="mt-3 text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  Book another {bookingSuccess.type === 'ride' ? 'ride' : 'delivery'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Interface */}
        {!bookingSuccess && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Choose Service
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('ride')}
                    className={`w-full flex items-center p-4 rounded-lg border transition-colors ${
                      activeTab === 'ride'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Car className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Ride Booking</div>
                      <div className="text-sm opacity-75">Get a ride to your destination</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`w-full flex items-center p-4 rounded-lg border transition-colors ${
                      activeTab === 'delivery'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Package className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Delivery Service</div>
                      <div className="text-sm opacity-75">Send packages across Gambia</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              {activeTab === 'ride' ? (
                <RideBookingForm
                  onSubmit={handleRideBooking}
                  loading={bookingLoading}
                />
              ) : (
                <DeliveryBookingForm
                  onSubmit={handleDeliveryBooking}
                  loading={bookingLoading}
                />
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-600">Active Drivers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>

        {/* Become a Driver CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
            <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drive with TownTripHub</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join our network of professional drivers and start earning. Set your own schedule and enjoy competitive rates.
            </p>
            <button
              onClick={() => navigate('/driver/register')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Become a Driver
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
