import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Placeholder from '../shared/Placeholder';

export default function HeroNew() {
  return (
    <section className="relative bg-white pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <Placeholder type="video" label="[PLACEHOLDER VIDEO: Abstract AI-texture loop — replace with original hero video when provided]" className="w-full h-full" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
          AI-Powered Marketing Agency
        </h1>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to={createPageUrl('book-strategy-session')}>Book a Free Strategy Session</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}