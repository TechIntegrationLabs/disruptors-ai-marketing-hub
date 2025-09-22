import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Lead Generation',
  h2: 'Fill Your Pipeline, Fast.',
  descriptivePhrase: 'Cold Outbound Systems That Convert',
  overview: 'We send millions of cold emails and social media DMs every month, which means we’ve mastered the art of starting conversations that turn into opportunities. If you’re in the B2B space, cold outbound is the fastest and most affordable way to fill your pipeline with qualified prospects. We handle everything—targeting, copywriting, and automation—so you can focus on closing deals while we keep the conversations flowing.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-bx-1.png',
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function LeadGeneration() {
  return <SolutionPageLayout service={service} />;
}