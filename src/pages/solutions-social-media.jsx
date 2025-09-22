import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Social Media Marketing',
  h2: 'Content That Connects and Converts.',
  descriptivePhrase: 'Social Media Content - Smarter With AI',
  overview: 'We help businesses create systems to consistently share their message in the places it matters most through short-form and long-form video, newsletters, carousels, written content, and more. Our team handles the strategy, creation, and distribution so your voice shows up consistently across every platform. The result is content that doesn’t just get seen, but builds trust, momentum, and growth.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/phone.png',
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function SocialMedia() {
  return <SolutionPageLayout service={service} />;
}