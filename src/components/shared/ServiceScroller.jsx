
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const services = [
  {
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    link: "solutions-ai-automation",
    image: "/generated/anachron-lite/ai-automation-icon-anachron-lite.png"
  },
  {
    title: "Social Media Marketing",
    hook: "Build and engage your community",
    link: "solutions-social-media-marketing",
    image: "/generated/anachron-lite/social-media-marketing-icon-anachron-lite.png"
  },
  {
    title: "SEO & GEO",
    hook: "Get found by your ideal customers",
    link: "solutions-seo-geo",
    image: "/generated/anachron-lite/seo-geo-icon-anachron-lite.png"
  },
  {
    title: "Lead Generation",
    hook: "Fill your pipeline with qualified prospects",
    link: "solutions-lead-generation",
    image: "/generated/anachron-lite/lead-generation-icon-anachron-lite.png"
  },
  {
    title: "Paid Advertising",
    hook: "Maximize ROI across all channels",
    link: "solutions-paid-advertising",
    image: "/generated/anachron-lite/paid-advertising-icon-anachron-lite.png"
  },
  {
    title: "Podcasting",
    hook: "Build authority through audio content",
    link: "solutions-podcasting",
    image: "/generated/anachron-lite/podcasting-icon-anachron-lite.png"
  },
  {
    title: "Custom Apps",
    hook: "Tailored solutions for your needs",
    link: "solutions-custom-apps",
    image: "/generated/anachron-lite/custom-apps-icon-anachron-lite.png"
  },
  {
    title: "CRM Management",
    hook: "Organize and nurture your relationships",
    link: "solutions-crm-management",
    image: "/generated/anachron-lite/crm-management-icon-anachron-lite.png"
  },
  {
    title: "Fractional CMO",
    hook: "Strategic marketing leadership",
    link: "solutions-fractional-cmo",
    image: "/generated/anachron-lite/fractional-cmo-icon-anachron-lite.png"
  }
];

export default function ServiceScroller({
  title = "A Solution for Every Challenge"
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-center tracking-tight text-white drop-shadow-lg mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {services.map((service, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            // For second row with 4 items, offset by 0.5 column width
            const isSecondRow = row === 1;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center text-center group ${
                  isSecondRow && col === 4 ? 'lg:col-start-2' : ''
                }`}
                style={isSecondRow && index === 5 ? { gridColumnStart: 2 } : {}}
              >
                <Link
                  to={createPageUrl(service.link)}
                  className="flex flex-col items-center"
                >
                  <div className="mb-6 relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={service.image}
                      alt={`${service.title} service illustration`}
                      className="w-full h-full object-contain filter drop-shadow-lg"
                      style={{ imageRendering: 'crisp-edges' }}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to gradient background with initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full hidden items-center justify-center">
                      <div className="text-3xl text-blue-600 font-black">
                        {service.title.split(' ').map(word => word[0]).join('')}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-blue-400 transition-colors duration-300 mb-2 uppercase tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-300 font-medium">
                    {service.hook}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
