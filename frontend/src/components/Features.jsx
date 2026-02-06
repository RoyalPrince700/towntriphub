import React from 'react';
import { Zap, ShieldCheck, Banknote, Clock, Map, PhoneCall } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Fast & Reliable",
      description: "Get picked up within minutes with our network of verified drivers across The Gambia.",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Verified Drivers",
      description: "All our drivers are thoroughly vetted and approved to ensure your safety and security.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50"
    },
    {
      title: "Affordable Pricing",
      description: "Competitive rates with transparent pricing. No hidden fees or surprise charges.",
      icon: <Banknote className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50"
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help you with any queries or issues.",
      icon: <PhoneCall className="w-6 h-6 text-rose-600" />,
      color: "bg-rose-50"
    },
    {
      title: "Live Tracking",
      description: "Track your ride in real-time and share your trip status with friends and family.",
      icon: <Map className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Scheduled Rides",
      description: "Plan ahead by scheduling your rides for a future time and date.",
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-purple-600 font-semibold tracking-wide uppercase text-sm mb-2">Features</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Why Choose TownTripHub?
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            We're building the most reliable transportation network in The Gambia, 
            focused on safety, speed, and comfort.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-purple-100 hover:shadow-2xl hover:shadow-purple-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50"></div>
    </section>
  );
};

export default Features;
