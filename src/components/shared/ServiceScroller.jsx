
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const services = [
  {
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    link: "solutions-ai-automation",
    image: "/generated/ai-automation-openai-1759158077281.png"
  },
  {
    title: "Social Media Marketing",
    hook: "Build and engage your community",
    link: "solutions-social-media-marketing",
    image: "/generated/social-media-marketing-openai-1759158140830.png"
  },
  {
    title: "SEO & GEO",
    hook: "Get found by your ideal customers",
    link: "solutions-seo-geo",
    image: "/generated/seo-geo-openai-1759158210281.png"
  },
  {
    title: "Lead Generation",
    hook: "Fill your pipeline with qualified prospects",
    link: "solutions-lead-generation",
    image: "/generated/lead-generation-openai-1759158290259.png"
  },
  {
    title: "Paid Advertising",
    hook: "Maximize ROI across all channels",
    link: "solutions-paid-advertising",
    image: "/generated/paid-advertising-openai-1759158359154.png"
  },
  {
    title: "Podcasting",
    hook: "Build authority through audio content",
    link: "solutions-podcasting",
    image: "/generated/podcasting-openai-1759158435195.png"
  },
  {
    title: "Custom Apps",
    hook: "Tailored solutions for your needs",
    link: "solutions-custom-apps",
    image: "/generated/custom-apps-openai-1759158501846.png"
  },
  {
    title: "CRM Management",
    hook: "Organize and nurture your relationships",
    link: "solutions-crm-management",
    image: "/generated/crm-management-openai-1759158571561.png"
  },
  {
    title: "Fractional CMO",
    hook: "Strategic marketing leadership",
    link: "solutions-fractional-cmo",
    image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758737907/disruptors-ai/services/fractional-cmo.png"
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
                    <div className="service-card-shape bg-white/90 backdrop-blur-md shadow-lg border border-gray-200/50 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="service-image-shape mb-6 relative overflow-hidden">
                          <img
                            src={service.image}
                            alt={`${service.title} service illustration`}
                            className="w-full h-full object-cover"
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
        
        .service-card-shape {
          clip-path: polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%);
          border-radius: 20px;
        }
        
        .service-image-shape {
          clip-path: polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%);
          aspect-ratio: 16/9;
        }
      `}</style>
    </section>
  );
}
