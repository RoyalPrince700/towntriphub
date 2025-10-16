import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-bold text-indigo-600">
                TownTripHub
              </Link>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </Link>
            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Contact
            </a>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Link 
                  to={user.role === 'driver' ? '/driver' : '/dashboard'} 
                  className="text-indigo-600 hover:text-indigo-700 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
