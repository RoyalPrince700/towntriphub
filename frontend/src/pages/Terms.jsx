import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Terms of <span className="text-indigo-600">Service</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Please read these terms carefully before using TownTripHub services.
            By using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </main>

      {/* Last Updated */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Last updated: January 31, 2026</p>
        </div>
      </section>

      {/* Terms Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Agreement Overview</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              These Terms of Service govern your use of TownTripHub's ride-booking and logistics services
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Terms Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-md mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Agreement</h3>
              <p className="text-gray-600">
                These terms create a legally binding agreement between you and TownTripHub
                for the use of our transportation and logistics services.
              </p>
            </div>

            {/* Terms Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Obligations</h3>
              <p className="text-gray-600">
                All users must comply with our code of conduct, safety guidelines,
                and legal requirements when using our platform.
              </p>
            </div>

            {/* Terms Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Standards</h3>
              <p className="text-gray-600">
                We maintain high standards for safety, reliability, and quality
                in all transportation and logistics services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Acceptance of Terms</h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              By accessing or using TownTripHub services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Your Agreement Includes:</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Our Privacy Policy and how we handle your data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Payment terms and refund policies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Liability limitations and disclaimers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Dispute resolution procedures</span>
                </li>
              </ul>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Account suspension and termination policies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Intellectual property rights and usage</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Changes to terms and service updates</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Governing law and jurisdiction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Eligibility */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">User Eligibility</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Requirements for using TownTripHub services
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Passenger Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-md mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Passengers</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Minimum age of 18 years or legal age in your jurisdiction</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Valid government-issued identification</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Active phone number for verification and communications</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Legal capacity to enter into binding agreements</span>
                </li>
              </ul>
            </div>

            {/* Driver/Logistics Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-md mr-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Drivers & Logistics Personnel</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Valid driver's license appropriate for vehicle type</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Vehicle registration and insurance documentation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Clean criminal background check</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Completion of required training and certification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Usage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Service Usage</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              How to use TownTripHub services properly and responsibly
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Booking Services</h4>
                <p className="text-gray-600">
                  Book rides and deliveries through our platform only. Provide accurate pickup/delivery
                  information and be ready at the designated time.
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h4>
                <p className="text-gray-600">
                  Pay for services as indicated. Cash payments to drivers are made directly.
                  All fares are final once service is completed.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Safety & Conduct</h4>
                <p className="text-gray-600">
                  Maintain respectful behavior toward all users and service providers.
                  Follow all safety guidelines and traffic laws.
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cancellations</h4>
                <p className="text-gray-600">
                  Cancel bookings within reasonable timeframes. Excessive cancellations
                  may result in account restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Prohibited Activities</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Activities that violate our terms of service
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-8 border border-red-200">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
              <h4 className="text-xl font-semibold text-red-800">You May Not:</h4>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use the service for illegal activities or prohibited items</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Harass, threaten, or discriminate against other users</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Share account credentials or allow unauthorized access</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Manipulate ratings, reviews, or booking systems</span>
                </li>
              </ul>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Transport hazardous, illegal, or dangerous materials</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Drive under the influence of alcohol or drugs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Violate traffic laws or endanger public safety</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use the platform for commercial purposes without authorization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & Refunds */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Payment & Refunds</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              How payments work and our refund policies
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Payment Methods</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Cash payments made directly to drivers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Mobile money transfers where available</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Bank transfers for logistics services</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>All payments are non-refundable once service is completed</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-green-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Refund Policy</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Refunds for cancelled bookings before driver arrival</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>No refunds for completed services or no-show cancellations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Disputes handled through our resolution process</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Processing time: 3-5 business days for approved refunds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liability & Disclaimers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Liability & Disclaimers</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Important legal limitations and disclaimers
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-yellow-50 rounded-lg p-8 border border-yellow-200">
              <h4 className="text-lg font-semibold text-yellow-800 mb-4">Service Disclaimers</h4>
              <ul className="space-y-3 text-yellow-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>TownTripHub provides a platform connecting users with service providers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We do not guarantee availability, timeliness, or quality of services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Users are responsible for verifying driver and vehicle credentials</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Platform availability may be affected by technical issues or maintenance</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-8 border border-red-200">
              <h4 className="text-lg font-semibold text-red-800 mb-4">Limitation of Liability</h4>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>TownTripHub is not liable for indirect, incidental, or consequential damages</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Maximum liability limited to the amount paid for the specific service</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Not responsible for loss or damage to personal belongings</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Users assume all risks associated with transportation services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Account Termination</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              How accounts can be suspended or terminated
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-4">Termination by TownTripHub</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Violation of these terms of service</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Fraudulent or illegal activities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Harassment of other users or staff</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Multiple safety or conduct violations</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-4">Termination by User</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Users may delete their account at any time</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Contact support for account deletion assistance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Outstanding payments must be settled</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Completed bookings remain valid</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service or need clarification,
            please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-indigo-100">
              <FileText className="w-5 h-5 mr-2" />
              <span>support@towntriphub.com</span>
            </div>
            <div className="flex items-center text-indigo-100">
              <Shield className="w-5 h-5 mr-2" />
              <span>Legal inquiries: legal@towntriphub.com</span>
            </div>
          </div>
          <p className="text-indigo-200 mt-6 text-sm">
            These terms are governed by the laws of The Gambia
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;