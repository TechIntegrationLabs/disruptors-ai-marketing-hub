
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DualCTABlock({
  title = "Ready to grow?",
  cta1_text = "Book a Free Strategy Session",
  cta1_link = "book-strategy-session",
  cta2_text = "Get a Free Business Audit",
  cta2_link = "free-business-audit",
  className = ""
}) {
  return (
    <div className={`text-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8">{title}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-3 bg-white text-gray-900 hover:bg-gray-200">
              <Link to={createPageUrl(cta1_link)}>{cta1_text}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-white/50 text-white hover:bg-white hover:text-gray-900">
              <Link to={createPageUrl(cta2_link)}>{cta2_text}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
