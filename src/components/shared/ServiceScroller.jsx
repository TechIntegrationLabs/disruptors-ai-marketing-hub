
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { customClient } from '@/lib/custom-sdk';

// Fallback hardcoded services (used if database fetch fails)
const FALLBACK_SERVICES = [
  {
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    slug: "solutions-ai-automation",
    image: "/generated/anachron-lite/ai-automation-icon-anachron-lite.png"
  },
  {
    title: "Social Media Marketing",
    hook: "Build and engage your community",
    slug: "solutions-social-media",
    image: "/generated/anachron-lite/social-media-marketing-icon-anachron-lite.png"
  },
  {
    title: "SEO & GEO",
    hook: "Get found by your ideal customers",
    slug: "solutions-seo-geo",
    image: "/generated/anachron-lite/seo-geo-icon-anachron-lite.png"
  },
  {
    title: "Lead Generation",
    hook: "Fill your pipeline with qualified prospects",
    slug: "solutions-lead-generation",
    image: "/generated/anachron-lite/lead-generation-icon-anachron-lite.png"
  },
  {
    title: "Paid Advertising",
    hook: "Maximize ROI across all channels",
    slug: "solutions-paid-advertising",
    image: "/generated/anachron-lite/paid-advertising-icon-anachron-lite.png"
  },
  {
    title: "Podcasting",
    hook: "Build authority through audio content",
    slug: "solutions-podcasting",
    image: "/generated/anachron-lite/podcasting-icon-anachron-lite.png"
  },
  {
    title: "Custom Apps",
    hook: "Tailored solutions for your needs",
    slug: "solutions-custom-apps",
    image: "/generated/anachron-lite/custom-apps-icon-anachron-lite.png"
  },
  {
    title: "CRM Management",
    hook: "Organize and nurture your relationships",
    slug: "solutions-crm-management",
    image: "/generated/anachron-lite/crm-management-icon-anachron-lite.png"
  },
  {
    title: "Fractional CMO",
    hook: "Strategic marketing leadership",
    slug: "solutions-fractional-cmo",
    image: "/generated/anachron-lite/fractional-cmo-icon-anachron-lite.png"
  }
];

export default function ServiceScroller({
  title = "A Solution for Every Challenge"
}) {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [isLoading, setIsLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      // Attempt to load services from database
      const dbServices = await customClient.entities.Service.list('display_order', 100);

      if (dbServices && dbServices.length > 0) {
        // Map database fields to component format
        const mappedServices = dbServices
          .filter(svc => svc.is_active !== false) // Only show active services
          .map(svc => ({
            title: svc.title,
            hook: svc.hook || svc.description || '',
            slug: svc.slug,
            image: svc.image || '/generated/anachron-lite/default-service-icon.png'
          }));

        setServices(mappedServices);
        setUseDatabase(true);
        console.log(`✓ Loaded ${mappedServices.length} services from database`);
      } else {
        console.log('⚠ No services found in database, using fallback data');
        setServices(FALLBACK_SERVICES);
      }
    } catch (error) {
      console.warn('⚠ Failed to load services from database:', error.message);
      console.log('Using fallback hardcoded services');
      setServices(FALLBACK_SERVICES);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-gray-900 text-sm sm:text-base font-bold uppercase tracking-wider">
              Comprehensive Solutions
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-gray-900 text-lg sm:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Tailored strategies that scale with your business
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                to={createPageUrl(service.slug)}
                className="block h-full"
              >
                <div className="relative h-full bg-white rounded-2xl p-8 border border-gray-200 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="mb-6 relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    <img
                      src={service.image}
                      alt={`${service.title} service illustration`}
                      className="relative w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      style={{ imageRendering: 'crisp-edges' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl hidden items-center justify-center">
                      <div className="text-2xl text-white font-black">
                        {service.title.split(' ').map(word => word[0]).join('')}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 tracking-tight">
                      {service.title}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {service.hook}
                    </p>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
