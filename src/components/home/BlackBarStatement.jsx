import React from 'react';

export default function BlackBarStatement({ children }) {
  return (
    <div className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg sm:text-2xl font-medium">{children}</p>
      </div>
    </div>
  );
}