
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const placeholderReviews = [
  {
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechCorp Inc.",
    quote: "Disruptors Media transformed our lead generation process, bringing in a significant increase in qualified leads within the first quarter.",
    rating: 5,
    source: "Google",
    videoUrl: null
  },
  {
    name: "Michael Chen",
    role: "Marketing Director", 
    company: "GrowthCo",
    quote: "Their AI automation saved us countless hours on repetitive tasks. The team is incredibly knowledgeable and responsive.",
    rating: 5,
    source: "LinkedIn",
    videoUrl: null
  },
  {
    name: "Emily Rodriguez",
    role: "Founder",
    company: "StartupXYZ",
    quote: "Working with Disruptors Media was a game-changer. They don't just implement solutions, they truly understand your business.",
    rating: 5,
    source: "Google",
    videoUrl: null
  }
];

export default function ReviewsCarousel({ 
  reviews = placeholderReviews,
  title = "What Our Clients Say" 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
        </motion.div>

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {reviews.length > 0 ? (
                <div>
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < reviews[currentIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                    "{reviews[currentIndex].quote}"
                  </blockquote>
                  
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-gray-900">{reviews[currentIndex].name}</div>
                    <div className="text-gray-600">{reviews[currentIndex].role}, {reviews[currentIndex].company}</div>
                  </div>
                </div>
              ) : (
                 <div className="text-center py-12 text-gray-500">
                    Loading reviews...
                  </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all text-gray-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all text-gray-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
