import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({
  h1 = "AI-Powered Marketing Agency",
  lead = "We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.",
}) {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-transparent py-12">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1737579300/disruptors-ai/backgrounds/hero-background.jpg"
          alt="Abstract AI neural network background"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content Container - Constrained Width */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Text Content - Same Width as Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black mb-6">
            {h1}
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 leading-relaxed mx-auto">
            {lead}
          </p>
        </motion.div>

        {/* Video Container with Centered Logo and Irregular Shape */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full"
        >
          <div className="relative hero-video-shape overflow-hidden shadow-2xl rounded-3xl">
            <video
              src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1758645813/Website_Demo_Reel_edited_udorcp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Centered Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
                alt="Disruptors Media Gold Logo"
                className="h-32 sm:h-40 md:h-48 lg:h-56"
              />
            </div>
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
        .hero-video-shape {
          clip-path: polygon(0% 0%, 90% 0%, 100% 20%, 100% 100%, 10% 100%, 0% 80%);
          aspect-ratio: 16/9;
          min-height: 400px;
        }
      `}</style>
    </section>
  );
}