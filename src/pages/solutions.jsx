
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cpu, Share2, Search, Filter, DollarSign, Mic, AppWindow, Users, Briefcase, ArrowRight } from 'lucide-react';
import ServicesHandScroll from '../components/shared/ServicesHandScroll';
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
    const gradients = [
        'from-blue-500/10 to-indigo-500/10',
        'from-purple-500/10 to-pink-500/10',
        'from-teal-500/10 to-cyan-500/10',
        'from-orange-500/10 to-red-500/10',
        'from-green-500/10 to-emerald-500/10',
        'from-violet-500/10 to-purple-500/10',
        'from-rose-500/10 to-pink-500/10',
        'from-sky-500/10 to-blue-500/10',
        'from-amber-500/10 to-yellow-500/10'
    ];
    const gradient = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
        >
            <Link to={createPageUrl(service.link)} className="block group h-full">
                <div className={`relative bg-gradient-to-br ${gradient} backdrop-blur-md rounded-3xl p-8 h-full border-2 border-white/40 hover:border-blue-500/60 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden group-hover:-translate-y-2`}>
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>

                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>

                    <div className="relative z-10">
                        {/* Icon container with animated background */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 w-fit">
                                {Icon && <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{service.title}</h3>
                        <p className="text-gray-700 text-lg mb-6 flex-grow leading-relaxed">{service.hook}</p>

                        {/* Enhanced CTA */}
                        <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-bold group-hover:text-blue-700 transition-colors duration-300">
                                Learn More
                            </span>
                            <div className="bg-blue-600 group-hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 group-hover:scale-110">
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function Solutions() {
  return (
    <div>
      {/* Interactive 3D Hero Section with Scroll Animation */}
      <ServicesHandScroll
        title="AI-Powered Marketing Solutions"
        description="Transform your business with cutting-edge automation and intelligent marketing strategies"
      />

      {/* Services Grid */}
      <section className="pb-24 sm:pb-32 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">OUR SERVICES</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Choose Your Path to Growth</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Select the services that align with your business goals. Mix and match to create your perfect growth strategy.</p>
            </motion.div>

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
