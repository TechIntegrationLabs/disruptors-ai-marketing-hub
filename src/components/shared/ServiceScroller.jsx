
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
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4">
          <div className="flex space-x-8 pl-4 sm:pl-6 lg:pl-8">
            {services.map((service, index) => {
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80"
                >
                  <Link
                    to={createPageUrl(service.link)}
                    className="block group h-full"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="mb-6 relative overflow-hidden rounded-lg p-6 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                          <img
                            src={service.image}
                            alt={`${service.title} service illustration`}
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'crisp-edges' }}
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to gradient background with initials if image fails to load
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 hidden items-center justify-center">
                            <div className="text-2xl text-blue-600 font-bold">
                              {service.title.split(' ').map(word => word[0]).join('')}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600">
                          {service.hook}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
