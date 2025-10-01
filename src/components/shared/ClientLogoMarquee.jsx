import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const clientLogos = [
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167812/case-studies/case-studies/tradeworxusa_logo.svg", alt: "TradeWorx USA", slug: "work-tradeworx-usa" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167811/case-studies/case-studies/timberviewfinancial_logo.webp", alt: "Timber View Financial", slug: "work-timber-view-financial" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167810/case-studies/case-studies/thewellnessway_logo.webp", alt: "The Wellness Way", slug: "work-the-wellness-way" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167809/case-studies/case-studies/soundcorrections_logo.svg", alt: "Sound Corrections", slug: "work-sound-corrections" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167808/case-studies/case-studies/segpro_logo.png", alt: "SegPro", slug: "work-segpro" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167807/case-studies/case-studies/neuromastery_logo.webp", alt: "Neuro Mastery", slug: "work-neuro-mastery" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167806/case-studies/case-studies/muscleworks_logo.png", alt: "Muscle Works", slug: "work-muscle-works" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167806/case-studies/case-studies/granitepaving_logo.png", alt: "Granite Paving", slug: "work-granite-paving" },
  { src: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167805/case-studies/case-studies/autotrimutah_logo.png", alt: "Auto Trim Utah", slug: "work-auto-trim-utah" },
];

export default function ClientLogoMarquee({
  logos = clientLogos,
  title = "Trusted by Industry Leaders"
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const dragStartPos = useRef(0);
  const allLogos = [...logos, ...logos, ...logos]; // Triple for smoother dragging

  const handleDragStart = (event, info) => {
    setIsPaused(true);
    dragStartPos.current = info.point.x;
  };

  const handleDragEnd = (event, info) => {
    setIsPaused(false);
    const dragDistance = Math.abs(info.point.x - dragStartPos.current);
    setIsDragging(dragDistance > 5); // Consider it a drag if moved more than 5px

    // Reset dragging state after a short delay
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleLogoClick = (e, slug) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <section className="py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
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

      <div
        ref={constraintsRef}
        className="relative flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`whitespace-nowrap flex items-center space-x-40 ${!isPaused ? 'animate-marquee-fast' : ''}`}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {allLogos.map((logo, index) => (
            <Link
              key={index}
              to={createPageUrl(logo.slug)}
              onClick={(e) => handleLogoClick(e, logo.slug)}
              className="flex-shrink-0 w-96 h-64 flex items-center justify-center group"
            >
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-48 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                  draggable="false"
                />
              ) : (
                <div className="text-xs font-mono text-gray-400 text-center px-2">
                  [{logo.alt}]
                </div>
              )}
            </Link>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-fast {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}