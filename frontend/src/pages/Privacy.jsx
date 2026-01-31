import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText, Users, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Privacy <span className="text-indigo-600">Policy</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information
            when you use TownTripHub services.
          </p>
        </div>
      </main>

      {/* Last Updated */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Last updated: January 31, 2026</p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Commitment to Privacy</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              At TownTripHub, we are committed to protecting your privacy and ensuring transparency
              in how we handle your personal information.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Privacy Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-md mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Protection</h3>
              <p className="text-gray-600">
                We implement robust security measures to protect your personal information
                from unauthorized access, alteration, or disclosure.
              </p>
            </div>

            {/* Privacy Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We clearly explain what information we collect, why we collect it,
                and how we use it to provide our services.
              </p>
            </div>

            {/* Privacy Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600">
                You have control over your personal information and can access,
                update, or delete your data at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Information We Collect</h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              We collect information to provide, maintain, and improve our services. Here's what we collect:
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-md mr-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Name, email address, phone number, and profile picture</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Payment information and transaction history</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Driver and logistics personnel verification documents</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Communication preferences and feedback</span>
                </li>
              </ul>
            </div>

            {/* Location and Usage Data */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-md mr-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Location & Usage Data</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>GPS location for ride booking and delivery services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Trip history, routes, and destination information</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Device information and app usage analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>IP address and browser information for security</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How We Use Your Information</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We use the information we collect to provide and improve our services
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h4>
                <p className="text-gray-600">
                  Connecting you with drivers and logistics personnel, processing payments,
                  and facilitating communication between all parties involved.
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Safety & Security</h4>
                <p className="text-gray-600">
                  Verifying user identities, preventing fraud, ensuring compliance with
                  our terms of service, and maintaining platform security.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Platform Improvement</h4>
                <p className="text-gray-600">
                  Analyzing usage patterns to improve our services, develop new features,
                  and enhance the user experience across our platform.
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Communication</h4>
                <p className="text-gray-600">
                  Sending service-related notifications, updates, and responding to
                  your inquiries and support requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Information Sharing</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We do not sell your personal information. Here's when we may share it:
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-4">We Share With:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Other users (name, rating) for ride/delivery matching</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Payment processors for transaction processing</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Service providers (cloud storage, email services)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Legal authorities when required by law</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-4">We Don't Share With:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Third-party advertisers or marketing companies</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Data brokers or aggregators</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Social media companies for targeted advertising</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Any entity for commercial purposes without consent</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Your Rights & Choices</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              You have several rights regarding your personal information
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Access Your Data</h4>
              <p className="text-gray-600">
                Request a copy of all personal information we have collected about you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Correct Information</h4>
              <p className="text-gray-600">
                Update or correct any inaccurate or incomplete personal information.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Delete Your Data</h4>
              <p className="text-gray-600">
                Request deletion of your personal information, subject to legal requirements.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Portability</h4>
              <p className="text-gray-600">
                Receive your data in a structured, machine-readable format.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 border border-pink-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Withdraw Consent</h4>
              <p className="text-gray-600">
                Withdraw consent for data processing where applicable.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Object to Processing</h4>
              <p className="text-gray-600">
                Object to certain types of data processing in specific circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or our data practices,
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-indigo-100">
              <Mail className="w-5 h-5 mr-2" />
              <span>privacy@towntriphub.com</span>
            </div>
            <div className="flex items-center text-indigo-100">
              <Shield className="w-5 h-5 mr-2" />
              <span>Available 24/7 for privacy inquiries</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;