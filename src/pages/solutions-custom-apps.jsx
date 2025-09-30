import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'Custom Apps',
  h2: 'Turn Your Ideas Into Tools.',
  descriptivePhrase: 'Create Custom Software & Applications',
  overview: 'With AI, turning ideas into tools has never been faster-we can take a concept, workflow, or software idea and bring it to life quickly and effectively. From custom calculators to AI-powered content machines, and even fully functional games, we have already built tools that solve real problems. Whatever your business needs, we can create a custom app or system that makes your work easier, smarter, and more scalable.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/after-phone-sec.png',
  outcomes: [
    {
      title: 'Faster Development',
      description: 'Build custom solutions in weeks instead of months using AI-accelerated development workflows.'
    },
    {
      title: 'Tailored Solutions',
      description: 'Get exactly what your business needs-no forcing your workflow into off-the-shelf software.'
    },
    {
      title: 'Competitive Advantage',
      description: 'Gain unique tools and systems that differentiate you from competitors stuck with generic solutions.'
    }
  ],
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function CustomApps() {
  return <SolutionPageLayout service={service} />;
}