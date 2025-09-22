import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Paid Advertising',
  h2: 'Maximize Your Ad Spend ROI.',
  descriptivePhrase: 'Paid Campaigns that Convert on Search & Social',
  overview: 'Our team has managed millions in ad spend across search and social platforms, giving us the experience to know what works, and what doesn’t. We study proven ads from successful competitors, elevate their ad creative to a higher level, then rapidly test countless variations until we uncover the winner. With the speed and efficiency of AI behind every step, we scale campaigns that book calls on your calendar and generate sales for your business.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-bx-2.png',
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function PaidAdvertising() {
  return <SolutionPageLayout service={service} />;
}