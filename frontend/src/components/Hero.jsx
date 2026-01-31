import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Shield, Car, MapPin } from 'lucide-react';

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>Available now across The Gambia</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Your Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
              Experience the future of transportation in The Gambia. Reliable, safe, and professional rides at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-200 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-200 group"
                  >
                    <span>Book a Ride</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300"
                  >
                    <span>Become a Driver</span>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">50k+</span>
                <span className="text-sm text-gray-500">Total Trips</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">10k+</span>
                <span className="text-sm text-gray-500">Verified Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">4.9/5</span>
                <span className="text-sm text-gray-500">Avg. Rating</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-3xl p-2 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Reliable Ride" 
                className="rounded-2xl object-cover w-full h-[500px]"
              />
              
              {/* Floating Cards */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 animate-float">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Safety First</p>
                    <p className="text-xs text-gray-500">All drivers are verified & vetted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background elements for image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/5 rounded-full -z-10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
