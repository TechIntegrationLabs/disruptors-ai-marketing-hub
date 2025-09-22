import React from 'react';
import Hero from '../components/shared/Hero';
import TwoColumnLayout from '../components/shared/TwoColumnLayout';
import ClientLogoMarquee from '../components/shared/ClientLogoMarquee';
import ThreePillars from '../components/shared/ThreePillars';
import ReviewsCarousel from '../components/shared/ReviewsCarousel';
import ServiceScroller from '../components/shared/ServiceScroller';
import DualCTABlock from '../components/shared/DualCTABlock';

export default function Home() {
  return (
    <div className="text-gray-800">
      <Hero />

      {/* 1.1 Black Bar Statement */}
      <section className="py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-lg sm:text-2xl font-medium text-gray-700">
                We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.
            </p>
        </div>
      </section>

      {/* 1.2 "More than a Marketing Agency..." */}
      <TwoColumnLayout
        kicker="Just Added"
        headline="More than a Marketing Agency. Your Growth Partner."
        body="We help companies generate leads, streamline operations, and scale using AI-powered systems—all with transparency so you are in control."
        rightContent={
          <img src="https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-abt.png" alt="Growth Partner Graphic" className="w-full h-full object-contain"/>
        }
      />

      {/* 1.3 Client Logos Marquee */}
      <div className="relative py-12 bg-black">
        <ClientLogoMarquee />
      </div>

      {/* 1.4 Our Approach (3 Pillars) */}
      <section className="relative bg-gray-800 text-white py-24 sm:py-32">
        <ThreePillars />
      </section>

      {/* 1.5 Reviews */}
      <ReviewsCarousel />

      {/* 1.6 Services / Solutions */}
      <div className="relative py-12">
        <ServiceScroller />
      </div>
      
      {/* 1.7 Mission (2-Column, Image Left) */}
      <TwoColumnLayout
        reversed
        kicker="Our Mission"
        headline="To Be Your Partner In AI."
        body="The purpose of ALL technologies (AI included) is to free humankind from menial, repetitive tasks. We leverage AI to free you from monotony so you can focus on what ONLY YOU can do: connect with the people you serve."
        leftContent={
           <img src="https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/hand-robot.png" alt="AI Partnership Graphic" className="w-full h-full object-contain"/>
        }
        cta={{
          label: 'Work With Us',
          link: 'book-strategy-session'
        }}
      />

      {/* 1.8 CTA Block */}
       <section className="relative bg-gray-800 text-white py-20">
         <DualCTABlock />
       </section>
    </div>
  );
}