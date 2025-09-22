import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'CRM Management',
  h2: 'Your CRM, Reimagined.',
  descriptivePhrase: 'Turn Your CRM into a Powerful Asset',
  overview: 'We’re experts in CRM design and builds, creating systems that actually work the way you do. Our team can integrate your CRM with the software, tools, and AI systems you rely on, turning it into a seamless and effective part of your business. The result is a streamlined hub that keeps your data, workflows, and communication aligned—so your CRM becomes an asset, not a headache.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-bx-3.png',
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function CrmManagement() {
  return <SolutionPageLayout service={service} />;
}