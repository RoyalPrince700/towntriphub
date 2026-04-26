import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Shield, MapPin } from 'lucide-react';

const Hero = () => {
  const { user } = useAuth();
  const [mapError, setMapError] = useState(false);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-50/50 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span>Available now across The Gambia</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Your Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
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
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-xl shadow-purple-200 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-xl shadow-purple-200 group"
                  >
                    <span>Book a Ride</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg border border-gray-200 hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
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

          <div className="relative">
            <div className="relative z-10 bg-gradient-to-tr from-purple-100 to-purple-50 rounded-3xl p-2 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
              {/* Hero Map Visualization - Static for landing page (no API calls) */}
              <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[420px] lg:h-[500px] bg-gray-900">
                {!mapError ? (
                  <img
                    src="https://picsum.photos/id/1015/800/500"
                    alt="Map of Serrekunda - Popular hub in The Gambia"
                    className="w-full h-full object-cover"
                    onError={() => setMapError(true)}
                    onLoad={() => setMapError(false)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                    {/* CSS-based map visualization fallback */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/90">
                        <MapPin size={64} className="mx-auto mb-4 opacity-75" />
                        <div className="text-2xl font-bold tracking-widest mb-2">SERREKUNDA</div>
                        <div className="text-sm opacity-75">THE GAMBIA • LIVE TRANSPORT HUB</div>
                        <div className="mt-6 text-[10px] font-mono opacity-50">13.45°N • -16.68°W</div>
                      </div>
                    </div>
                    {/* Decorative map lines */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-white"></div>
                      <div className="absolute top-1/3 left-1/4 w-px h-1/3 bg-white"></div>
                      <div className="absolute bottom-1/4 left-1/3 right-1/3 h-px bg-white rotate-12"></div>
                    </div>
                  </div>
                )}

                {/* Map Overlay Info */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-white/50 max-w-[200px] sm:max-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-700 text-sm">SERREKUNDA</p>
                      <p className="text-[10px] text-emerald-600 -mt-0.5">Popular Transport Hub</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">
                    The commercial heart of The Gambia. High demand for rides, markets, and connections to Banjul, Kololi beaches &amp; tourist areas.
                  </p>
                </div>

                {/* Floating Stats on Map */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-white/50 text-center">
                  <div className="text-emerald-600 text-xs font-mono mb-1">LIVE IN GAMBIA</div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div>
                      <div className="font-bold text-gray-900">13.45°N</div>
                      <div className="text-[10px] text-gray-500">LAT</div>
                    </div>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div>
                      <div className="font-bold text-gray-900">-16.68°W</div>
                      <div className="text-[10px] text-gray-500">LNG</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend - hidden on very small screens to avoid overlap */}
              <div className="hidden sm:flex absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-xs px-4 py-1.5 rounded-full shadow-md items-center gap-2 text-gray-500 border">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Serrekunda (High activity)</span>
                <div className="w-px h-3 bg-gray-300 mx-1"></div>
                <span className="text-emerald-600">Popular rides area</span>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-600/5 rounded-full -z-10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
