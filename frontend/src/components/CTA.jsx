import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  const { user } = useAuth();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-purple-600 rounded-[3rem] px-8 py-16 md:px-16 md:py-24 shadow-2xl shadow-purple-200">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/30 text-purple-100 text-sm font-medium mb-8 border border-white/10">
              <Sparkles size={16} />
              <span>Join the revolution</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
              Ready to experience the <span className="text-purple-200">difference?</span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied customers and professional drivers who trust TownTripHub for their daily transportation needs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-purple-600 font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-xl"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-indigo-600 font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-xl group"
                  >
                    <span>Get Started Today</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link 
                    to="/about"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-purple-700/50 text-white font-bold text-lg border border-white/20 hover:bg-purple-700 transition-all duration-300"
                  >
                    <span>Learn More</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
