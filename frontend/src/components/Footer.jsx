import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import towntriphublogo from '../assets/towntriphublogo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={towntriphublogo}
                alt="TownTripHub Logo"
                className="w-8 h-8 rounded-lg"
              />
              
            </Link>
            <p className="text-gray-500 leading-relaxed">
              Connecting communities across The Gambia with safe, reliable, and professional transportation services.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Our Fleet', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Services</h3>
            <ul className="space-y-4">
              {['Ride Booking', 'Package Delivery', 'Corporate Travel', 'Airport Transfer'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-500">
                <MapPin className="text-indigo-600 shrink-0" size={18} />
                <span>123 Serrekunda, Kairaba Avenue, The Gambia</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <Phone className="text-indigo-600 shrink-0" size={18} />
                <span>+220 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <Mail className="text-indigo-600 shrink-0" size={18} />
                <span>hello@towntriphub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
          <p>© {currentYear} TownTripHub. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-indigo-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
