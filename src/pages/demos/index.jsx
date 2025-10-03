import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, TrendingUp, Zap, Target, Award } from 'lucide-react';

export default function DemosIndex() {
  const demos = [
    {
      id: 'hero-focus',
      title: 'Hero-First Focus',
      description: 'Full-screen video background with massive hero section. Minimal copy, maximum visual impact.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      features: ['Full-screen video', 'Single CTA focus', 'Social proof ticker']
    },
    {
      id: 'benefits-driven',
      title: 'Benefits-Driven',
      description: 'Problem/solution framework with benefits grid. Before/after comparisons that convert.',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      features: ['8-benefit grid', 'Before/after', 'Results testimonials']
    },
    {
      id: 'social-proof',
      title: 'Social Proof Heavy',
      description: 'Client logos, testimonials, and case studies. Build trust through demonstrated success.',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      features: ['Logo marquee', 'Case studies', '500+ reviews']
    },
    {
      id: 'interactive',
      title: 'Interactive Storytelling',
      description: 'GSAP scroll-triggered animations tell your brand story. Engaging parallax experience.',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      features: ['Scroll animations', 'Interactive cards', 'Story-driven']
    },
    {
      id: 'conversion',
      title: 'Conversion Optimized',
      description: 'Multi-step forms, countdown timers, and exit-intent popups. Engineered to capture leads.',
      icon: TrendingUp,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      features: ['Multi-step form', 'Urgency elements', 'Exit intent']
    },
    {
      id: 'best-of-all',
      title: 'Perfect Hybrid',
      description: 'The best of all 5 concepts combined into one powerful landing page. Recommended starting point.',
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      features: ['All-in-one', 'Best practices', 'Production ready'],
      recommended: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <img
              src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
              alt="Disruptors AI"
              className="h-24 mx-auto mb-8"
            />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Landing Page
              <br />
              <span className="text-yellow-500">Demo Gallery</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Explore 6 different landing page concepts. Each designed for specific conversion goals.
            </p>
          </motion.div>

          {/* Demo Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demos.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Link to={`/demos/${demo.id}`}>
                    <div className={`relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 ${demo.recommended ? 'ring-2 ring-yellow-500' : ''}`}>
                      {/* Recommended Badge */}
                      {demo.recommended && (
                        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                          Recommended
                        </div>
                      )}

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${demo.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-500 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {demo.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {demo.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${demo.color}`}></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-semibold group-hover:underline">
                          View Demo
                        </span>
                        <ArrowRight className="w-5 h-5 text-yellow-500 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">
                Need a Custom Landing Page?
              </h3>
              <p className="text-gray-400 mb-6">
                We can build a custom landing page tailored to your exact needs
              </p>
              <Link
                to="/book-strategy-session"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
              >
                Schedule a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choosing the Right Demo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-500">
                For Visual Brands
              </h3>
              <p className="text-gray-400">
                Choose <strong>Hero-First Focus</strong> if your brand relies on stunning visuals and video content.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-500">
                For Trust Building
              </h3>
              <p className="text-gray-400">
                Choose <strong>Social Proof Heavy</strong> if you have strong testimonials and case studies to showcase.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-500">
                For Lead Generation
              </h3>
              <p className="text-gray-400">
                Choose <strong>Conversion Optimized</strong> if your primary goal is capturing as many leads as possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
