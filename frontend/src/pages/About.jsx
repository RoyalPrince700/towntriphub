import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Users, Shield, Truck, Car, Award, Heart, Star, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            About <span className="text-purple-600">TownTripHub</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connecting The Gambia, one ride at a time. We're revolutionizing transportation
            and logistics across the country through technology and trust.
          </p>
        </div>
      </main>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Mission</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              To create a seamless, safe, and affordable transportation ecosystem that connects
              Gambians across the nation while empowering local drivers and logistics providers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Mission Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting Communities</h3>
              <p className="text-gray-600">
                Breaking down geographical barriers and connecting people across all regions of The Gambia
                through reliable transportation solutions.
              </p>
            </div>

            {/* Mission Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Ensuring every ride and delivery is conducted by verified, trained professionals
                with comprehensive safety protocols in place.
              </p>
            </div>

            {/* Mission Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Empowering Locals</h3>
              <p className="text-gray-600">
                Creating economic opportunities for Gambian drivers and logistics personnel,
                fostering entrepreneurship and community development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  TownTripHub was born from a simple observation: The Gambia needed a modern,
                  reliable transportation platform that puts safety, trust, and community first.
                </p>
                <p>
                  We noticed that while transportation services existed, they often lacked the
                  technological infrastructure to ensure reliability, safety, and fair pricing.
                  Drivers struggled to find consistent work, and passengers faced uncertainty
                  in booking rides.
                </p>
                <p>
                  Today, we're proud to serve thousands of Gambians daily, connecting verified
                  drivers with passengers and businesses with logistics solutions. Our platform
                  combines cutting-edge technology with deep understanding of local needs.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-gray-600">Verified Drivers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-gray-600">Rides Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">What We Offer</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive transportation and logistics solutions for The Gambia
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Ride Services */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mr-4">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ride Services</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Verified drivers with proper licensing</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Real-time GPS tracking and ETA</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Cash and digital payment options</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>

            {/* Logistics Services */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mr-4">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Logistics & Delivery</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Package tracking and delivery confirmation</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Secure handling of goods and documents</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Door-to-door delivery across Gambia</span>
                </li>
                <li className="flex items-center">
                  <Award className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Flexible scheduling and priority options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Values</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety</h3>
              <p className="text-gray-600 text-sm">
                Every interaction on our platform prioritizes safety and security
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                Building stronger communities through reliable transportation
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Maintaining the highest standards in service and technology
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600 text-sm">
                Building lasting relationships based on transparency and reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Get in Touch</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Have questions or need assistance? We're here to help.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 border border-purple-200 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-4">
                Call us anytime for support, bookings, or inquiries
              </p>
              <a
                href="tel:+2208690714"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                +220 869 0714
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Join the TownTripHub Community
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Whether you're a passenger, driver, or business owner, TownTripHub connects
            you to reliable transportation solutions across The Gambia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Book a Ride
            </button>
            <button className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-400 transition-colors font-medium border border-purple-400">
              Become a Driver
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;