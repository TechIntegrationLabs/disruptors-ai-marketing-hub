import React from 'react';
import Hero from '../components/shared/Hero';
import VideoScrollScrub from '../components/shared/VideoScrollScrub';
import SplineScrollAnimationEnhanced from '../components/shared/SplineScrollAnimationEnhanced';
import AlternatingLayout from '../components/shared/AlternatingLayout';
import ClientLogoMarquee from '../components/shared/ClientLogoMarquee';
import ThreePillars from '../components/shared/ThreePillars';
import ReviewsCarousel from '../components/shared/ReviewsCarousel';
import ServiceScroller from '../components/shared/ServiceScroller';
import DualCTABlock from '../components/shared/DualCTABlock';

export default function Home() {
  const alternatingData = [
    {
      kicker: "REVOLUTION",
      headline: "Transform Your Business with AI",
      body: "We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies that scale your business beyond current limitations.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
      imageAlt: "AI Technology Transformation",
      backgroundColor: "bg-white",
      cta: {
        label: "Start Your Transformation",
        link: "book-strategy-session"
      }
    },
    {
      kicker: "PARTNERSHIP",
      headline: "More Than an Agency. Your Growth Partner.",
      body: "We help companies generate leads, streamline operations, and scale using AI-powered systems—all with complete transparency so you stay in control of your growth journey.",
      image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-abt.png",
      imageAlt: "Growth Partnership Visualization",
      backgroundColor: "bg-gray-50"
    },
    {
      kicker: "INNOVATION",
      headline: "Cutting-Edge AI Solutions",
      body: "From automated lead generation to intelligent customer insights, we deploy the latest AI technologies to give your business a competitive edge in the digital marketplace.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
      imageAlt: "AI Innovation Technology",
      backgroundColor: "bg-gray-900"
    },
    {
      kicker: "RESULTS",
      headline: "Proven Success Stories",
      body: "Our clients see average growth increases of 300% within the first 6 months. We don't just promise results—we deliver measurable outcomes that transform businesses.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80",
      imageAlt: "Business Growth Analytics",
      backgroundColor: "bg-white"
    },
    {
      kicker: "MISSION",
      headline: "Your Partner in AI Excellence",
      body: "Technology should free you from repetitive tasks. We leverage AI to eliminate monotony so you can focus on what only you can do: connect with the people you serve and grow your impact.",
      image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/hand-robot.png",
      imageAlt: "Human-AI Partnership",
      backgroundColor: "bg-gray-900",
      cta: {
        label: "Partner With Us",
        link: "book-strategy-session"
      }
    }
  ];

  return (
    <div className="text-gray-800">
      <Hero />

      {/* Video Scroll Scrub Section */}
      <VideoScrollScrub
        title="Transforming Business with AI"
        description="Experience the power of artificial intelligence as we help companies generate leads, streamline operations, and scale beyond their current limitations."
      />

      {/* Interactive 3D Spline Section with Scroll Animation */}
      <SplineScrollAnimationEnhanced
        scene="https://prod.spline.design/lylivpxHMsRXq3dw/scene.splinecode"
        title="Innovation Powered by Intelligence"
        description="Experience the future of AI-driven marketing. Scroll to explore our interactive 3D world."
        animationPreset="spiral"
        customAnimations={{
          radius: 2,
          height: 3,
          frequency: 2,
          amplitude: 1.5
        }}
        enableMobileOptimization={true}
        scrollTriggerOptions={{
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1.5,
          markers: false
        }}
        showPerformanceIndicator={false}
        onLoad={(splineApp) => {
          console.log('🎨 Your full animation loaded successfully!', splineApp);
        }}
        onError={(error) => {
          console.error('Animation failed to load:', error);
        }}
      />

      {/* Modern Alternating Layout Sections */}
      <AlternatingLayout sections={alternatingData} />

      {/* Client Logos Marquee */}
      <div className="relative py-16 bg-black">
        <ClientLogoMarquee />
      </div>

      {/* Our Approach (3 Pillars) */}
      <section className="relative bg-gray-800 text-white py-24 sm:py-32">
        <ThreePillars />
      </section>

      {/* Reviews */}
      <ReviewsCarousel />

      {/* Services / Solutions */}
      <div className="relative py-16">
        <ServiceScroller />
      </div>

      {/* CTA Block */}
       <section className="relative bg-gray-800 text-white py-20">
         <DualCTABlock />
       </section>
    </div>
  );
}