import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ 
  h1 = "AI-Powered Marketing Agency",
  lead = "We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.",
}) {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-transparent">
      {/* Content Container */}
      <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <img
            src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
            alt="Disruptors Media Gold Logo"
            className="h-20 sm:h-24 md:h-28 mb-8 mx-auto"
          />
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 text-shadow-lg">
            {h1}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto text-shadow">
            {lead}
          </p>
        </motion.div>

        {/* Video Container - Larger Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-7xl mx-auto"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
            <video
              src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1758645813/Website_Demo_Reel_edited_udorcp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

       <style>{`
        .text-shadow-lg {
          text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
        }
        .text-shadow {
          text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
}