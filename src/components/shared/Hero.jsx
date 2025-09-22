import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ 
  h1 = "AI-Powered Marketing Agency",
  lead = "We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.",
}) {
  return (
    <section className="relative pt-40 pb-28 overflow-hidden flex items-center justify-center bg-gray-900">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video
          src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1758170556/dm-abt_ypkipj.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <img 
            src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
            alt="Disruptors Media Gold Logo"
            className="h-20 sm:h-24 md:h-28 mb-8"
          />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 text-shadow-lg">
            {h1}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto text-shadow">
            {lead}
          </p>
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