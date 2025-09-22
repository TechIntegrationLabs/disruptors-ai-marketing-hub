import React from 'react';
import SolutionPageLayout from '../components/solutions/SolutionPageLayout';

const service = {
  title: 'SEO & GEO',
  h2: 'Be Seen Where It Matters Most.',
  descriptivePhrase: 'Search Engine and Generative Engine Optimization',
  overview: 'The game of getting seen online has changed—AI is reshaping how people search, discover, and choose businesses. It’s no longer just about ranking on Google, but about showing up in AI platforms and conversations that shape decisions. We build strategies that position your brand where attention is moving, making sure you’re visible, trusted, and chosen in the new search era.',
  image: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/what-we-do-bx.png',
  cta_label: 'Book a Strategy Session',
  cta_link: 'book-strategy-session'
};

export default function SeoGeo() {
  return <SolutionPageLayout service={service} />;
}