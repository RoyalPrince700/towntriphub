import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Car, Package, MapPin, Clock, DollarSign, Users, CheckCircle, Phone, Mail } from 'lucide-react';

const Career = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Professional Driver',
      type: 'Full-time',
      location: 'Banjul & Greater Banjul Area',
      description: 'Join our team of professional drivers providing safe and reliable transportation services across The Gambia.',
      requirements: [
        'Valid driver\'s license',
        'Clean driving record',
        'Smartphone with GPS capabilities',
        'Good communication skills',
        'Commitment to customer service'
      ],
      benefits: [
        'Competitive earnings',
        'Flexible working hours',
        'Weekly payments',
        'Vehicle maintenance support',
        'Training and support'
      ],
      icon: Car
    },
    {
      id: 2,
      title: 'Logistics Personnel',
      type: 'Full-time',
      location: 'Banjul & Regional Areas',
      description: 'Be part of our delivery network ensuring packages reach their destinations safely and on time.',
      requirements: [
        'Valid driver\'s license',
        'Experience with package handling',
        'Reliable transportation',
        'Customer service orientation',
        'Knowledge of local areas'
      ],
      benefits: [
        'Competitive compensation',
        'Flexible scheduling',
        'Regular deliveries',
        'Growth opportunities',
        'Support team assistance'
      ],
      icon: Package
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Earnings',
      description: 'Earn more with our competitive rates and bonus programs'
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Set your own schedule and work when it suits you best'
    },
    {
      icon: Users,
      title: 'Support Team',
      description: 'Dedicated support team available 24/7 to assist you'
    },
    {
      icon: MapPin,
      title: 'Local Opportunities',
      description: 'Work in your local area and build lasting customer relationships'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our Team at{' '}
            <span className="text-purple-600">TownTripHub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Be part of The Gambia's leading transportation and logistics platform.
            Drive with purpose, deliver with pride, and grow your career with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#jobs"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
            >
              View Open Positions
            </a>
            <a
              href="#contact"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Active Drivers</div>
              <div className="text-sm text-gray-500 mt-1">Growing every day</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Deliveries Monthly</div>
              <div className="text-sm text-gray-500 mt-1">Across The Gambia</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
              <div className="text-sm text-gray-500 mt-1">Always here to help</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TownTripHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than just a platform – we're a community of professionals
              dedicated to providing exceptional service across The Gambia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="jobs" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing team and be part of The Gambia's transportation revolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mr-4">
                      <job.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-purple-600 font-medium">{job.type}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{job.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{job.location}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#contact"
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-center block"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Apply
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Joining TownTripHub is simple. Follow these steps to start your journey with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Application</h3>
              <p className="text-gray-600">
                Contact us with your details, experience, and availability.
                We'll review your application within 24 hours.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Background Check</h3>
              <p className="text-gray-600">
                We'll verify your credentials, driving record, and conduct
                a background check to ensure safety and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Driving</h3>
              <p className="text-gray-600">
                Once approved, complete our training program and start
                accepting rides and deliveries immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Contact our recruitment team to learn more about opportunities at TownTripHub.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Call Us</h3>
              </div>
              <p className="text-gray-600 mb-4">Speak directly with our recruitment team</p>
              <p className="text-2xl font-bold text-purple-600">+220 869 0714</p>
              <p className="text-sm text-gray-500 mt-2">Mon - Fri, 9AM - 6PM GMT</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Email Us</h3>
              </div>
              <p className="text-gray-600 mb-4">Send us your resume and details</p>
              <p className="text-lg font-semibold text-purple-600">careers@towntriphub.com</p>
              <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Application</h3>
            <form className="text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Interested In
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Select a position</option>
                  <option value="driver">Professional Driver</option>
                  <option value="logistics">Logistics Personnel</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about your experience and why you'd like to join TownTripHub"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;