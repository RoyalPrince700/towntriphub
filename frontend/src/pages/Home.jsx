import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import RideBookingForm from '../components/RideBookingForm';
import DeliveryBookingForm from '../components/DeliveryBookingForm';
import { Car, Package, CheckCircle, ArrowRight, User, History, MapPin, Star, Settings } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleRideBooking = async (formData) => {
    setBookingLoading(true);
    try {
      console.log('Ride booking data:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBookingSuccess({
        type: 'ride',
        message: 'Ride booked successfully! A driver will be assigned soon.',
        data: formData
      });
    } catch (error) {
      console.error('Ride booking failed:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDeliveryBooking = async (formData) => {
    setBookingLoading(true);
    try {
      console.log('Delivery booking data:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBookingSuccess({
        type: 'delivery',
        message: 'Delivery booked successfully! A driver will be assigned soon.',
        data: formData
      });
    } catch (error) {
      console.error('Delivery booking failed:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(null);
  };

  useEffect(() => {
    if (user) {
      // Keep them on home if they want to book, but many apps redirect to a dedicated dashboard
      // For now, let's keep the Home for booking if authenticated, or redirect to /dashboard
      // navigate('/dashboard', { replace: true });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    );
  }

  // Modernized Booking/Dashboard Interface for authenticated users
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome & Stats Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Hello, <span className="text-indigo-600">{user?.name ? user.name.split(' ')[0] : 'Guest'}!</span>
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Where are we going today? Select a service to get started.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Your Rating</p>
              <p className="text-xl font-bold text-gray-900">4.95 <span className="text-sm font-normal text-gray-400">/ 5</span></p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg shadow-emerald-100">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {bookingSuccess.type === 'ride' ? 'Ride Request Sent!' : 'Delivery Request Sent!'}
                  </h3>
                  <p className="text-gray-600 mt-1">{bookingSuccess.message}</p>
                </div>
              </div>
              <button
                onClick={resetBooking}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center space-x-2"
              >
                <span>Book Another</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Booking Interface */}
        {!bookingSuccess && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Service Selection Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 border border-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Service</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('ride')}
                    className={`w-full group flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                      activeTab === 'ride'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-50'
                        : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-indigo-200 text-gray-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                      activeTab === 'ride' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 group-hover:text-indigo-600'
                    }`}>
                      <Car size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Ride Booking</div>
                      <div className="text-sm opacity-80">Quick city travel</div>
                    </div>
                    <ArrowRight className={`ml-auto transition-transform ${activeTab === 'ride' ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} size={20} />
                  </button>

                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`w-full group flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                      activeTab === 'delivery'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-50'
                        : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-indigo-200 text-gray-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                      activeTab === 'delivery' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 group-hover:text-indigo-600'
                    }`}>
                      <Package size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Delivery Service</div>
                      <div className="text-sm opacity-80">Send packages fast</div>
                    </div>
                    <ArrowRight className={`ml-auto transition-transform ${activeTab === 'delivery' ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-8 border border-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/dashboard" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100 group">
                    <History size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">History</span>
                  </Link>
                  <Link to="/profile" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100 group">
                    <User size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Profile</span>
                  </Link>
                  <Link to="/saved-places" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100 group">
                    <MapPin size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Saved</span>
                  </Link>
                  <Link to="/settings" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100 group">
                    <Settings size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Settings</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking Form Area */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-50 min-h-[600px]">
                {activeTab === 'ride' ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-4 shadow-lg shadow-indigo-100">
                        <Car size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Book a Ride</h2>
                    </div>
                    <RideBookingForm
                      onSubmit={handleRideBooking}
                      loading={bookingLoading}
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-4 shadow-lg shadow-indigo-100">
                        <Package size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Send a Package</h2>
                    </div>
                    <DeliveryBookingForm
                      onSubmit={handleDeliveryBooking}
                      loading={bookingLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity / Driver CTA */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Drive with TownTripHub</h3>
              <p className="text-indigo-100 mb-8 max-w-sm leading-relaxed">
                Join our network of professional drivers. Set your own schedule and earn more with Gambia's top ride platform.
              </p>
              <button 
                onClick={() => navigate('/driver/register')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all duration-300 shadow-xl"
              >
                Become a Driver
              </button>
            </div>
            <Car className="absolute bottom-[-20%] right-[-10%] w-64 h-64 text-white/10 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-50 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need help?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Our support team is available 24/7 to assist you with your rides or deliveries.
            </p>
            <div className="flex space-x-4">
              <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                Contact Support
              </button>
              <button className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-colors border border-gray-100">
                FAQs
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
