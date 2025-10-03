import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroFocusDemo() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full-Screen Hero with Video Background */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
            src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1758645813/Website_Demo_Reel_edited_udorcp.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.img
              src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
              alt="Disruptors AI"
              className="h-24 sm:h-32 lg:h-40 mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 tracking-tight">
              The Future of Marketing
              <br />
              <span className="text-yellow-500">Powered by AI</span>
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              Transform your business with intelligent automation that drives real results
            </p>

            {/* Single Prominent CTA */}
            <motion.button
              className="group relative inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Transformation
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>

            {/* Secondary Action */}
            <div className="mt-8">
              <button className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Ticker */}
      <section className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400 text-sm">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">500+</div>
              <div className="text-xs sm:text-sm">Clients Transformed</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">300%</div>
              <div className="text-xs sm:text-sm">Average Growth</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-xs sm:text-sm">AI-Powered Support</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">$50M+</div>
              <div className="text-xs sm:text-sm">Revenue Generated</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Minimal Content Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Stop Wasting Time on Manual Tasks
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Let AI handle the repetitive work while you focus on growing your business
          </p>
          <button className="inline-flex items-center gap-2 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 rounded-full font-semibold transition-all">
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
