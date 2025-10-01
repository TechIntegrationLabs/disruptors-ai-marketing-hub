
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
  },
  {
    name: "David Park",
    role: "VP of Marketing",
    company: "InnovateTech",
    quote: "The ROI we've seen from their AI-powered campaigns has exceeded all expectations. Truly transformative work.",
    rating: 5,
    source: "LinkedIn",
    videoUrl: null
  },
  {
    name: "Lisa Martinez",
    role: "Founder & CEO",
    company: "NextGen Solutions",
    quote: "Finally, an agency that actually understands both marketing and technology. Their strategic approach is unmatched.",
    rating: 5,
    source: "Google",
    videoUrl: null
  }
];

export default function ReviewsCarousel({
  reviews = placeholderReviews,
  title = "What Our Clients Say"
}) {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current) return;

    const scrollInterval = setInterval(() => {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.testimonial-card')?.offsetWidth || 0;
      const gap = 24; // 1.5rem gap
      const scrollAmount = cardWidth + gap;

      const maxScroll = container.scrollWidth - container.clientWidth;
      const nextScroll = container.scrollLeft + scrollAmount;

      if (nextScroll >= maxScroll) {
        // Reset to start with smooth scroll
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setActiveIndex(0);
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setActiveIndex(prev => Math.min(prev + 1, reviews.length - 1));
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(scrollInterval);
  }, [isPaused, reviews.length]);

  // Update active index on manual scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.testimonial-card')?.offsetWidth || 0;
    const gap = 24;
    const newIndex = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveIndex(newIndex);
  };

  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.testimonial-card')?.offsetWidth || 0;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="testimonial-card flex-shrink-0 w-[85vw] sm:w-[450px] snap-center"
            >
              <div className="h-full bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100/50 relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

                {/* Quote icon */}
                <div className="mb-6 flex items-start justify-between">
                  <Quote className="w-10 h-10 text-blue-500/30" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10 min-h-[120px]">
                  "{review.quote}"
                </blockquote>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                    <div className="text-sm text-gray-500">{review.company}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium px-3 py-1 bg-gray-100 rounded-full">
                    {review.source}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? 'w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
