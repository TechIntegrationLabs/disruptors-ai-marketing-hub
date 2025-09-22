
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#1A1A1A] text-white min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <Frown className="w-20 h-20 text-[#FFD700] mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-[#C7C7C7] text-lg mb-8">We couldn’t find that page. Try one of these instead.</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-[#0E0E0E] font-semibold hover:bg-[#EAEAEA] rounded-xl">
            <Link to={createPageUrl("")}>Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-[#2A2A2A] text-white hover:bg-[#0E0E0E] hover:text-white rounded-xl">
            <Link to={createPageUrl("Solutions")}>Solutions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
