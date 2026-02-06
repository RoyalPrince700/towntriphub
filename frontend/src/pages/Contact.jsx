import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Twitter, Instagram, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Contact <span className="text-purple-600">Us</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get in touch with TownTripHub. We're here to help with any questions about our services
            or to connect you with the right transportation solutions across The Gambia.
          </p>
        </div>
      </main>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Get In Touch</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Multiple ways to reach our team for support and inquiries
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Call us directly</p>
              <p className="text-purple-600 font-medium">+220 869 0714</p>
              <p className="text-purple-600 font-medium">+220 869 0715</p>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us an email</p>
              <p className="text-green-600 font-medium">support@towntriphub.com</p>
              <p className="text-green-600 font-medium">business@towntriphub.com</p>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-lg p-6 border border-purple-200 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 mb-2">Visit our office</p>
              <p className="text-purple-600 font-medium">Kairaba Avenue</p>
              <p className="text-purple-600 font-medium">Banjul, The Gambia</p>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-md mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600 mb-2">When we're available</p>
              <p className="text-yellow-600 font-medium">Mon - Fri: 8AM - 6PM</p>
              <p className="text-yellow-600 font-medium">Sat: 9AM - 4PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Find Us</h3>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Kairaba Avenue, Banjul, The Gambia</p>
                  </div>
                </div>
              </div>

              {/* Additional Contact Methods */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Other Ways to Connect</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MessageSquare className="w-6 h-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      <p className="text-gray-600 text-sm">Available on our website during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Facebook className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Social Media</h4>
                      <p className="text-gray-600 text-sm">Follow us for updates and support</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Twitter className="w-6 h-6 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Twitter Support</h4>
                      <p className="text-gray-600 text-sm">@TownTripHub for quick responses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Regional Coverage</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Serving communities across The Gambia with local support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Banjul Office */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Greater Banjul Area</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our main operational hub serving the capital region and surrounding areas.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> +220 869 0714</p>
                <p><strong>Email:</strong> banjul@towntriphub.com</p>
                <p><strong>Hours:</strong> Mon-Fri 8AM-6PM</p>
              </div>
            </div>

            {/* Serrekunda Office */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Serrekunda Region</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Supporting the largest city in The Gambia with dedicated logistics services.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> +220 869 0716</p>
                <p><strong>Email:</strong> serrekunda@towntriphub.com</p>
                <p><strong>Hours:</strong> Mon-Fri 8AM-6PM</p>
              </div>
            </div>

            {/* Brikama Office */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Brikama & Western Region</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Extending our reach to western Gambia with reliable transportation solutions.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> +220 869 0717</p>
                <p><strong>Email:</strong> brikama@towntriphub.com</p>
                <p><strong>Hours:</strong> Mon-Fri 8AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers across The Gambia who trust TownTripHub
            for their transportation and logistics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Book a Ride Now
            </button>
            <button className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-400 transition-colors font-medium border border-purple-400">
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;