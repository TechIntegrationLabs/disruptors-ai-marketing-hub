import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 max-w-lg">
        <HelpCircle className="w-16 h-16 mx-auto text-indigo-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQ Coming Soon</h1>
        <p className="text-gray-600">
          We are compiling a list of frequently asked questions to help you better. This section will be available shortly.
        </p>
      </div>
    </div>
  );
}