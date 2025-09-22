import React from 'react';
import { motion } from 'framer-motion';

const clientLogos = [
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167812/case-studies/case-studies/tradeworxusa_logo.svg", alt: "TradeWorx USA" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167811/case-studies/case-studies/timberviewfinancial_logo.webp", alt: "Timber View Financial" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167810/case-studies/case-studies/thewellnessway_logo.webp", alt: "The Wellness Way" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167809/case-studies/case-studies/soundcorrections_logo.svg", alt: "Sound Corrections" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167808/case-studies/case-studies/segpro_logo.png", alt: "SegPro" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167807/case-studies/case-studies/neuromastery_logo.webp", alt: "Neuro Mastery" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167806/case-studies/case-studies/muscleworks_logo.png", alt: "Muscle Works" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167806/case-studies/case-studies/granitepaving_logo.png", alt: "Granite Paving" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167805/case-studies/case-studies/autotrimutah_logo.png", alt: "Auto Trim Utah" },
];

export default function ClientLogoMarquee({ 
  logos = clientLogos,
  title = "Trusted by Industry Leaders"
}) {
  const allLogos = [...logos, ...logos]; // Duplicate for seamless loop

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <motion.div 
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </motion.div>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-40">
          {allLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 w-64 h-32 flex items-center justify-center">
              {logo.src ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  loading="lazy"
                  className="max-h-24 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="text-xs font-mono text-gray-400 text-center px-2">
                  [{logo.alt}]
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}