import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'AI Automation & Infrastructure',
  h2: 'Build Your AI-Powered Future.',
  descriptivePhrase: 'Streamline. Automate. Scale.',
  overview: 'Our AI automation services help businesses streamline operations, generate leads, and scale with efficiency by integrating advanced tools like GoHighLevel, n8n, and custom AI systems. We design tailored solutions that eliminate repetitive tasks, enhance customer engagement, and drive measurable ROI. Whether you need automated marketing, CRM workflows, or AI-powered content systems, we create scalable infrastructure that grows with your business.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/hand-human.png',
  outcomes: [
    {
      title: 'Eliminate Repetitive Tasks',
      description: 'Automate workflows that drain time and resources, freeing your team to focus on high-value strategic work.'
    },
    {
      title: 'Scale Operations Efficiently',
      description: 'Handle increased volume without proportional cost increases through intelligent automation systems.'
    },
    {
      title: 'Measurable ROI',
      description: 'Track clear metrics showing time saved, costs reduced, and revenue generated through automation.'
    }
  ],
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function AiAutomation() {
  return <SolutionPageLayout service={service} />;
}