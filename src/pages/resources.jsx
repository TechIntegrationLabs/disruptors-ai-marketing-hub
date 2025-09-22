import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, BookOpen, Bot, FileText, Search, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DualCTABlock from '../components/shared/DualCTABlock';
import GeometricSeparator from '../components/shared/GeometricSeparator';

const aiEmployees = [
  {
    title: "Content Curator AI Employee",
    roleDescription: "Automatically discovers, curates, and schedules industry-relevant content across all your social media platforms.",
    workflowProcess: "This AI employee monitors industry publications, filters content based on your brand guidelines, creates engaging captions, and schedules posts at optimal times for maximum engagement.",
    installationTutorial: "Connect your social accounts, define your content preferences, set posting schedules, and activate. The AI will begin curating content within 24 hours.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2070&auto=format&fit=crop",
    slug: "content-curator-ai"
  },
  {
    title: "Lead Nurturer AI Employee", 
    roleDescription: "Manages personalized follow-up sequences across email and social media to warm up inbound leads automatically.",
    workflowProcess: "Tracks lead behavior, segments prospects based on engagement patterns, sends personalized follow-ups, schedules calls, and maintains consistent touchpoints until conversion.",
    installationTutorial: "Integrate with your CRM, upload lead lists, customize message templates, set follow-up intervals, and launch. The AI handles all nurturing workflows automatically.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop",
    slug: "lead-nurturer-ai"
  },
  {
    title: "Customer Support AI Employee",
    roleDescription: "Provides 24/7 customer support, handles common inquiries, and escalates complex issues to human team members.",
    workflowProcess: "Monitors support channels, categorizes incoming requests, provides instant responses using your knowledge base, tracks resolution times, and seamlessly hands off to humans when needed.",
    installationTutorial: "Upload your FAQ database, connect support channels, train the AI on your brand voice, set escalation rules, and go live. Immediate 24/7 support coverage activated.",
    image: "https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=2070&auto=format&fit=crop",
    slug: "customer-support-ai"
  },
  {
    title: "Sales Qualifier AI Employee",
    roleDescription: "Pre-qualifies incoming leads, books discovery calls, and ensures your sales team only speaks with high-intent prospects.",
    workflowProcess: "Engages with new leads instantly, asks qualifying questions, scores prospects based on your criteria, schedules appropriate next steps, and provides detailed lead summaries to your sales team.",
    installationTutorial: "Define your qualification criteria, set up lead scoring rules, connect your calendar system, customize conversation flows, and activate. High-quality leads flow directly to your calendar.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    slug: "sales-qualifier-ai"
  },
  {
    title: "Data Analysis AI Employee",
    roleDescription: "Continuously monitors your business metrics, identifies trends, and provides actionable insights for strategic decision-making.",
    workflowProcess: "Connects to all your business systems, analyzes performance data in real-time, identifies opportunities and risks, generates automated reports, and alerts you to significant changes.",
    installationTutorial: "Connect your analytics tools, define KPIs to monitor, set alert thresholds, customize reporting frequency, and deploy. Instant business intelligence at your fingertips.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    slug: "data-analysis-ai"
  },
  {
    title: "Content Writer AI Employee",
    roleDescription: "Creates blog posts, social content, email campaigns, and marketing copy that matches your brand voice perfectly.",
    workflowProcess: "Studies your existing content, learns your brand voice, researches trending topics, creates content calendars, writes engaging copy, and optimizes for SEO and conversions.",
    installationTutorial: "Upload brand guidelines, provide content samples, set content goals, define publishing schedule, and launch. Professional content creation on autopilot.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
    slug: "content-writer-ai"
  }
];

const AIEmployeeCard = ({ employee, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={employee.image} 
          alt={employee.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded-full">AI Employee</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{employee.title}</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Role:</h4>
            <p className="text-gray-600 text-sm">{employee.roleDescription}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">How It Works:</h4>
            <p className="text-gray-600 text-sm">{employee.workflowProcess}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Setup:</h4>
            <p className="text-gray-600 text-sm">{employee.installationTutorial}</p>
          </div>
        </div>
        
        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          <Link to={createPageUrl('book-strategy-session')}>
            Deploy This AI Employee
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = aiEmployees.filter(employee =>
    employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-4">AI Resources</h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6">AI Employees to Assist Your Every Effort</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                The future of work is shifting fast. High-level investors are already pushing for ratios of 10 AI employees to every 1 human employee! Businesses that fail to integrate AI into their operations will be easily outperformed by competitors who do. That's why we're constantly developing new AI employee workflows that you can plug directly into your business, giving you scalable systems that work tirelessly to keep you ahead.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tons of search topics"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 bg-white/90"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resource */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full">Featured Foundation</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">Build Your Own Business Brain</h3>
            <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
              The comprehensive framework for creating an AI-powered central nervous system for your entire business operation.
            </p>
            <p className="text-indigo-200 mb-8 max-w-3xl mx-auto">
              This foundational resource walks you through building a unified AI system that connects all your business functions, automates decision-making processes, and creates predictable growth patterns. Perfect for businesses ready to scale beyond traditional limitations.
            </p>
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
              <Link to={createPageUrl('book-strategy-session')}>Get Early Access</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* AI Employees Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEmployees.map((employee, index) => (
              <AIEmployeeCard key={employee.slug} employee={employee} index={index} />
            ))}
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No AI employees match your search. Try a different term!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Block */}
      <section className="relative bg-gray-800 text-white py-20">
         <GeometricSeparator type="top" className="text-white" />
         <DualCTABlock 
           title="Ready to Deploy Your AI Team?"
           cta1_text="Book a Strategy Session"
           cta1_link="book-strategy-session"
           cta2_text="Get Custom AI Solutions"
           cta2_link="contact"
         />
      </section>
    </div>
  );
}