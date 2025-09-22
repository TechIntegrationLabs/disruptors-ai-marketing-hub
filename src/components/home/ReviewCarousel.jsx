import React from 'react';
import Placeholder from '../shared/Placeholder';

export default function ReviewCarousel() {
  const reviews = Array(5).fill(0);
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0,3).map((_, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 p-8 rounded-3xl">
              <Placeholder type="audio" label="[PLACEHOLDER REVIEW: Quote, Name, Star Rating, Source]" className="aspect-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}