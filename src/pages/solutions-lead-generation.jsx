import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Lead Generation',
  h2: 'Fill Your Pipeline, Fast.',
  descriptivePhrase: 'Cold Outbound Systems That Convert',
  overview: 'We send millions of cold emails and social media DMs every month, which means we have mastered the art of starting conversations that turn into opportunities. If you are in the B2B space, cold outbound is the fastest and most affordable way to fill your pipeline with qualified prospects. We handle everything-targeting, copywriting, and automation-so you can focus on closing deals while we keep the conversations flowing.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-bx-1.png',
  outcomes: [
    {
      title: 'Qualified Prospects',
      description: 'Fill your calendar with decision-makers who match your ideal customer profile, not tire-kickers.'
    },
    {
      title: 'Predictable Pipeline',
      description: 'Know exactly how many leads you will generate each month with tested outbound systems.'
    },
    {
      title: 'Fast Market Entry',
      description: 'Start conversations with prospects immediately-no waiting months for SEO or content to work.'
    }
  ],
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function LeadGeneration() {
  return <SolutionPageLayout service={service} />;
}