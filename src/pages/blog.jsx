import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Calendar, User } from 'lucide-react';
import DualCTABlock from '../components/shared/DualCTABlock';
import GeometricSeparator from '../components/shared/GeometricSeparator';

const placeholderPosts = [
  {
    title: "The Ultimate Guide to AI-Powered SEO in 2025",
    excerpt: "Discover how generative engines are changing search and what you need to do to stay ahead of the curve. This is the new SEO.",
    author: "Tyler Gordon",
    date: "October 15, 2024",
    image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop",
    category: "SEO & GEO",
    slug: "ai-powered-seo-2025"
  },
  {
    title: "5 Cold Email Templates That Actually Get Replies",
    excerpt: "We send millions of cold emails. Steal our top-performing templates and start filling your pipeline with qualified leads today.",
    author: "Kyle Painter",
    date: "October 10, 2024",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop",
    category: "Lead Generation",
    slug: "cold-email-templates"
  },
  {
    title: "How We Built a Custom AI App in 48 Hours",
    excerpt: "A behind-the-scenes look at our rapid development process and how you can turn ideas into functional tools faster than ever.",
    author: "Will Welsh",
    date: "October 05, 2024",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
    category: "Custom Apps",
    slug: "building-ai-app"
  }
];

const PostCard = ({ post, isFeatured = false }) => (
  <motion.div 
    className={`bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg group ${isFeatured ? 'col-span-1 md:col-span-2 lg:col-span-3 grid lg:grid-cols-2 gap-0' : 'flex flex-col'}`}
    whileHover={{ y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className={`relative ${isFeatured ? 'h-full' : 'h-48'}`}>
        <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30"></div>
    </div>
    <div className="p-8 flex flex-col justify-between flex-grow">
        <div>
            <p className="text-sm font-semibold text-indigo-600 mb-2">{post.category}</p>
            <h3 className={`font-bold text-gray-900 mb-4 ${isFeatured ? 'text-3xl' : 'text-xl'}`}>{post.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{post.excerpt}</p>
        </div>
        <div>
            <div className="flex items-center text-xs text-gray-500 mb-6">
                <div className="flex items-center mr-4"><User className="w-3 h-3 mr-1.5"/> {post.author}</div>
                <div className="flex items-center"><Calendar className="w-3 h-3 mr-1.5"/> {post.date}</div>
            </div>
            <Link to={'#'} className="font-semibold text-indigo-600 flex items-center group-hover:text-indigo-800">
                Read More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    </div>
  </motion.div>
);


export default function Blog() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-3xl mx-auto"
            >
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6">The Disruptors Blog</h1>
                <p className="text-lg sm:text-xl text-gray-600">
                  Actionable insights, proven strategies, and a behind-the-scenes look at how we build AI-powered growth systems.
                </p>
            </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {placeholderPosts.map((post, index) => (
                    <PostCard key={post.slug} post={post} isFeatured={index === 0}/>
                ))}
                 {/* Adding more non-featured posts for a better grid look */}
                {placeholderPosts.slice(1).map((post, index) => (
                    <PostCard key={`${post.slug}-${index}`} post={{...post, slug: `${post.slug}-${index}`}} />
                ))}
            </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="relative bg-gray-800 text-white py-20">
         <GeometricSeparator type="top" className="text-white" />
         <DualCTABlock 
            title="Get Insights Delivered"
            cta1_text="Subscribe to Newsletter"
            cta1_link="#"
            cta2_text="Book a Strategy Session"
            cta2_link="book-strategy-session"
         />
      </section>
    </div>
  );
}