import React from 'react';
import Placeholder from '../shared/Placeholder';

const services = [
  "AI Automation", "Social Media Marketing", "SEO & GEO", "Lead Generation", 
  "Paid Advertising", "Podcasting", "Custom Apps", "CRM Management", "Fractional CMO"
];

export default function ServiceScroller() {
  return (
    <section className="py-16 sm:py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold">A Solution for Every Challenge</h2>
      </div>
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-scroll group-hover:pause">
          {services.concat(services).map((service, index) => (
            <div key={index} className="flex-shrink-0 w-80 mx-4">
              <div className="bg-gray-800 rounded-3xl p-6 h-full border border-gray-700">
                <Placeholder type="image" label={`[PLACEHOLDER SERVICE IMAGE: ${service}]`} className="aspect-video mb-4" />
                <h3 className="text-xl font-bold text-center">{service}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
       <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}