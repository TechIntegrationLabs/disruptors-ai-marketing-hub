import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AlternatingLayout({ sections = [] }) {
  return (
    <div className="relative">
      {sections.map((section, index) => {
        const isEven = index % 2 === 0;
        const isReversed = !isEven;

        return (
          <section
            key={index}
            className={`min-h-screen flex items-center py-8 sm:py-12 ${
              section.backgroundColor || (index % 3 === 0 ? 'bg-gray-900 text-white backdrop-blur-md' : index % 3 === 1 ? 'bg-gray-800 text-white backdrop-blur-sm' : 'bg-gray-900 text-white')
            }`}
          >
            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center min-h-[80vh] ${
                isReversed ? 'lg:grid-flow-col-dense' : ''
              }`}>

                {/* Text Content - Larger Typography */}
                <motion.div
                  className={`space-y-8 ${isReversed ? 'lg:col-start-2' : ''} ${
                    isReversed ? 'lg:pl-8' : 'lg:pr-8'
                  }`}
                  initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, margin: "-10%" }}
                >
                  {section.kicker && (
                    <motion.p
                      className="text-base font-bold uppercase tracking-widest text-indigo-300 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      {section.kicker}
                    </motion.p>
                  )}

                  {section.headline && (
                    <motion.h2
                      className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight mb-8 text-white drop-shadow-lg`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      {section.headline}
                    </motion.h2>
                  )}

                  {section.body && (
                    <motion.div
                      className={`text-xl sm:text-2xl lg:text-3xl leading-relaxed font-light mb-12 text-gray-100`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      {section.body}
                    </motion.div>
                  )}

                  {section.cta && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="text-lg px-8 py-4 h-auto font-semibold"
                      >
                        <Link to={createPageUrl(section.cta.link)}>
                          {section.cta.label}
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Image Content - Larger, More Impactful */}
                <motion.div
                  className={`relative ${isReversed ? 'lg:col-start-1' : ''} ${
                    isReversed ? 'lg:pr-8' : 'lg:pl-8'
                  }`}
                  initial={{ opacity: 0, x: isReversed ? -60 : 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <div className="relative group">
                    {/* Modern geometric clip-path container */}
                    <div className={`relative overflow-hidden ${getShapeClass(index)} transition-transform duration-700 group-hover:scale-[1.02]`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {section.image ? (
                        <img
                          src={section.image}
                          alt={section.imageAlt || section.headline || 'Section image'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                              </svg>
                            </div>
                            <p className="text-lg font-medium">Premium Image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Floating accent elements */}
                    <motion.div
                      className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500 rounded-full opacity-20 blur-2xl"
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-500 rounded-full opacity-15 blur-3xl"
                      animate={{
                        y: [0, 10, 0],
                        scale: [1, 0.9, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </div>
                </motion.div>

              </div>
            </div>
          </section>
        );
      })}

      <style>{`
        .modern-shape-1 {
          clip-path: polygon(0% 0%, 85% 0%, 100% 25%, 100% 100%, 15% 100%, 0% 75%);
          aspect-ratio: 4/3;
          min-height: 500px;
        }

        .modern-shape-2 {
          clip-path: polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%);
          aspect-ratio: 4/3;
          min-height: 500px;
        }

        .modern-shape-3 {
          clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%, 0% 25%);
          aspect-ratio: 4/3;
          min-height: 500px;
        }

        .modern-shape-4 {
          clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%);
          aspect-ratio: 4/3;
          min-height: 500px;
        }

        .modern-shape-5 {
          clip-path: polygon(0% 0%, 75% 0%, 100% 25%, 100% 100%, 25% 100%, 0% 75%);
          aspect-ratio: 4/3;
          min-height: 500px;
        }
      `}</style>
    </div>
  );
}

function getShapeClass(index) {
  const shapes = [
    'modern-shape-1',
    'modern-shape-2',
    'modern-shape-3',
    'modern-shape-4',
    'modern-shape-5'
  ];
  return shapes[index % shapes.length];
}