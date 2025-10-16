import React from 'react';

const Features = () => {
  return (
    <div className="mt-20">
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-gray-900">
          Why Choose TownTripHub?
        </h3>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Experience the future of transportation in The Gambia
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-md mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Fast & Reliable</h4>
          <p className="text-gray-500">
            Get picked up within minutes with our network of verified drivers across The Gambia.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Verified Drivers</h4>
          <p className="text-gray-500">
            All our drivers are thoroughly vetted and approved to ensure your safety and security.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-md mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Affordable Pricing</h4>
          <p className="text-gray-500">
            Competitive rates with transparent pricing. No hidden fees or surprise charges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
