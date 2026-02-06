import React from 'react';
import { Car, Package, MapPin, Clock, Star, ArrowRight, Bookmark, Calendar } from 'lucide-react';

const MobileHomeActions = ({ onServiceSelect, onQuickActionSelect }) => {
  return (
    <div className="space-y-8">
      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Ride Card */}
        <button
          onClick={() => onServiceSelect && onServiceSelect('ride')}
          className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-gray-100 shadow-xl shadow-purple-100/20 group active:scale-[0.98] transition-all"
        >
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <Car size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Book a Ride</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">GMD 50 • 2-5 min</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-purple-600 transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>
          <Car className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-gray-50/50 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </button>

        {/* Delivery Card */}
        <button
          onClick={() => onServiceSelect && onServiceSelect('delivery')}
          className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-gray-100 shadow-xl shadow-emerald-100/20 group active:scale-[0.98] transition-all"
        >
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Send Package</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">GMD 75 • Fast Delivery</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-emerald-600 transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>
          <Package className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-gray-50/50 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </button>
      </div>

      {/* Quick Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onQuickActionSelect && onQuickActionSelect('savedPlaces')}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-3">
            <Bookmark size={20} />
          </div>
          <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Saved Places</span>
        </button>
        <button
          onClick={() => onQuickActionSelect && onQuickActionSelect('schedule')}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3">
            <Calendar size={20} />
          </div>
          <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Schedule</span>
        </button>
      </div>
    </div>
  );
};

export default MobileHomeActions;
