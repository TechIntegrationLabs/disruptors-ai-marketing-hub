
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gray-100 flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/ui/backgrounds/loader-lft.jpg)',
              filter: 'grayscale(100%)'
            }}
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full h-full flex">
            
            {/* Left Side - Disruptors Logo */}
            <div className="flex-1 flex items-center justify-center">
              <motion.img
                src="https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/brand/logos/logo.svg"
                alt="Disruptors Media"
                className="h-16 opacity-60"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Right Side - Progress and Text */}
            <div className="flex-1 flex flex-col items-center justify-center text-right pr-16">
              
              {/* Progress Percentage */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.span
                  className="text-8xl sm:text-9xl font-black text-gray-900 leading-none"
                  key={Math.floor(progress)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </motion.div>

              {/* Loading Text */}
              <motion.div
                className="text-center max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                  YOUR
                </h2>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                  EXPERIENCE IS
                </h2>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-wider">
                  <span className="border-b-4 border-gray-900">LOADING</span>
                </h2>
              </motion.div>

            </div>
          </div>

          {/* Animated progress bar at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gray-900"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
