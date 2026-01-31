import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut, User, LayoutDashboard, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>
                TownTrip<span className="text-indigo-600">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all duration-200"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 transform ${
          isMobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              <span>{link.name}</span>
              <ChevronRight size={16} />
            </Link>
          ))}
          
          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-2 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {user.name?.[0] || <User size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-200"
                >
                  <LayoutDashboard size={18} />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
