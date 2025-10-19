import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CTA = () => {
  const { user } = useAuth();

  return (
    <div className="mt-20 bg-indigo-700 rounded-lg">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to experience the difference?
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Join thousands of satisfied customers who trust TownTripHub for their transportation needs.
        </p>
        {user ? (
          <Link 
            to={'/dashboard'}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link 
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors duration-200"
          >
            Get Started Today
          </Link>
        )}
      </div>
    </div>
  );
};

export default CTA;
