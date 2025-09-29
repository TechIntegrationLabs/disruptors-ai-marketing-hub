
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cpu, Share2, Search, Filter, DollarSign, Mic, AppWindow, Users, Briefcase, ArrowRight } from 'lucide-react';
import AlternatingLayout from '../components/shared/AlternatingLayout';
import DualCTABlock from '../components/shared/DualCTABlock';

const services = [
  { title: "AI Automation", hook: "Automate repetitive tasks and workflows", link: "solutions-ai-automation", icon: "Cpu" },
  { title: "Social Media Marketing", hook: "Build and engage your community", link: "solutions-social-media", icon: "Share2" },
  { title: "SEO & GEO", hook: "Get found by your ideal customers", link: "solutions-seo-geo", icon: "Search" },
  { title: "Lead Generation", hook: "Fill your pipeline with qualified prospects", link: "solutions-lead-generation", icon: "Filter" },
  { title: "Paid Advertising", hook: "Maximize ROI across all channels", link: "solutions-paid-advertising", icon: "DollarSign" },
  { title: "Podcasting", hook: "Build authority through audio content", link: "solutions-podcasting", icon: "Mic" },
  { title: "Custom Apps", hook: "Tailored solutions for your needs", link: "solutions-custom-apps", icon: "AppWindow" },
  { title: "CRM Management", hook: "Organize and nurture your relationships", link: "solutions-crm-management", icon: "Users" },
  { title: "Fractional CMO", hook: "Strategic marketing leadership", link: "solutions-fractional-cmo", icon: "Briefcase" }
];

const iconMap = { Cpu, Share2, Search, Filter, DollarSign, Mic, AppWindow, Users, Briefcase };

const ServiceCard = ({ service, index }) => {
    const Icon = iconMap[service.icon];
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
        >
            <Link to={createPageUrl(service.link)} className="block group h-full">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 h-full border border-gray-200/50 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col">
                    {Icon && <Icon className="w-10 h-10 text-blue-600 mb-6" />}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 flex-grow">{service.hook}</p>
                    <div className="flex items-center text-blue-600 font-semibold">
                        Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function Solutions() {
  const solutionsHeroData = [
    {
      kicker: "SOLUTIONS",
      headline: "AI-Powered Marketing Solutions",
      body: "A complete suite of AI-powered marketing and automation services designed to drive growth, efficiency, and real business results. From automation to custom apps, we help you leverage technology to scale without losing your human touch.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80",
      imageAlt: "Business solutions and strategy",
      backgroundColor: "bg-white"
    }
  ];

  return (
    <div>
      {/* Enhanced Hero Section */}
      <AlternatingLayout sections={solutionsHeroData} />

      {/* Services Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <ServiceCard key={service.link} service={service} index={index} />
                ))}
            </div>
        </div>
      </section>
      
      {/* CTA Block */}
      <section className="relative bg-gray-800 text-white py-20">
         <DualCTABlock />
      </section>
    </div>
  );
}
