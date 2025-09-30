import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Fractional CMO',
  h2: 'Strategic Leadership on Demand.',
  descriptivePhrase: 'Executive Level Marketing, at a Fraction of the Cost',
  overview: 'Get the benefit of a seasoned Chief Marketing Officer without the full-time executive salary. Our Fractional CMO service provides the high-level strategy, team leadership, and data-driven insights you need to scale your marketing efforts effectively. We work as an extension of your team to guide your marketing vision, manage execution, and ensure every initiative is aligned with your business objectives.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/services-img.png',
  outcomes: [
    {
      title: 'Strategic Direction',
      description: 'Get clear, actionable marketing strategy from someone who's built and scaled marketing departments.'
    },
    {
      title: 'Team Alignment',
      description: 'Unite your marketing efforts under cohesive leadership that keeps everyone moving toward the same goals.'
    },
    {
      title: 'Executive Experience',
      description: 'Access senior-level expertise and decision-making without the $200K+ salary and equity.'
    }
  ],
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function FractionalCmo() {
  return <SolutionPageLayout service={service} />;
}