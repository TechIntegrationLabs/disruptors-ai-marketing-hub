import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, Shield, Clock, Users, BarChart3, Sparkles } from 'lucide-react';

export default function BenefitsDrivenDemo() {
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Automation",
      description: "Deploy AI systems that work 24/7, processing tasks in milliseconds instead of hours",
      stat: "10x faster"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Reach your ideal customers with AI-powered audience segmentation and personalization",
      stat: "85% accuracy"
    },
    {
      icon: TrendingUp,
      title: "Exponential Growth",
      description: "Scale your operations without scaling your team through intelligent automation",
      stat: "300% ROI"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with SOC 2, GDPR, and industry standards",
      stat: "99.99% uptime"
    },
    {
      icon: Clock,
      title: "Time Savings",
      description: "Reclaim 20+ hours per week by automating repetitive marketing tasks",
      stat: "20+ hrs/week"
    },
    {
      icon: Users,
      title: "Customer Insights",
      description: "Understand your audience better with AI-powered analytics and predictions",
      stat: "360° view"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track performance metrics and optimize campaigns with live dashboards",
      stat: "Live data"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Content",
      description: "Generate high-quality marketing content that converts at scale",
      stat: "100+ pieces/day"
    }
  ];

  const beforeAfter = {
    before: [
      "Spending 40+ hours/week on manual tasks",
      "Generic marketing that doesn't convert",
      "Difficulty tracking ROI and metrics",
      "Limited reach and inconsistent results"
    ],
    after: [
      "Automated workflows running 24/7",
      "Personalized campaigns for every segment",
      "Real-time dashboards showing clear ROI",
      "10x reach with predictable growth"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-500 text-sm font-semibold mb-6">
              BENEFITS-DRIVEN APPROACH
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Stop Struggling with Marketing.
              <br />
              <span className="text-yellow-500">Start Dominating.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your business with AI-powered marketing that delivers measurable results
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105">
              Get Started Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-red-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            The Problem with Traditional Marketing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're burning time and money on marketing tactics that don't scale.
            Manual processes, guesswork strategies, and generic campaigns are holding you back.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Disruptors AI?
            </h2>
            <p className="text-xl text-gray-600">
              Real benefits that transform your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-sm font-bold text-yellow-600 mb-2">
                    {benefit.stat}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Before & After Disruptors AI
            </h2>
            <p className="text-xl text-gray-400">
              See the transformation our clients experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-900/20 border-2 border-red-500 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-red-500 text-white rounded-full font-bold mb-4">
                  Before
                </div>
                <h3 className="text-2xl font-bold">The Old Way</h3>
              </div>
              <ul className="space-y-4">
                {beforeAfter.before.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">✗</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-green-900/20 border-2 border-green-500 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-green-500 text-white rounded-full font-bold mb-4">
                  After
                </div>
                <h3 className="text-2xl font-bold">The Disruptors Way</h3>
              </div>
              <ul className="space-y-4">
                {beforeAfter.after.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results-Focused Testimonial */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <img
              src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
              alt="Client"
              className="h-16 mx-auto mb-6 opacity-60"
            />
          </div>
          <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 mb-6">
            "We went from spending 50 hours a week on marketing to just 10 hours,
            while <span className="text-yellow-600 font-bold">tripling our lead generation</span>.
            This isn't just automation—it's transformation."
          </blockquote>
          <div className="text-gray-600">
            <div className="font-bold text-lg">Sarah Johnson</div>
            <div>CEO, TradeWorx USA</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Join 500+ companies already growing with Disruptors AI
          </p>
          <button className="bg-black hover:bg-gray-900 text-white px-12 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 shadow-2xl">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
