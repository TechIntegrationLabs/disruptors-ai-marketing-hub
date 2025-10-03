import React from 'react';
import { motion } from 'framer-motion';
import ClientLogoMarquee from '../../components/shared/ClientLogoMarquee';
import ReviewsCarousel from '../../components/shared/ReviewsCarousel';
import { Star, Award, Shield, CheckCircle2 } from 'lucide-react';

export default function SocialProofDemo() {
  const caseStudies = [
    {
      company: "TradeWorx USA",
      industry: "Manufacturing",
      result: "300% increase in qualified leads",
      metric1: { label: "Lead Growth", value: "300%" },
      metric2: { label: "Time Saved", value: "35 hrs/wk" },
      metric3: { label: "ROI", value: "450%" },
      quote: "Disruptors AI transformed our entire marketing operation. We're generating more leads than ever with half the effort.",
      author: "John Smith, CEO",
      image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1759268594/disruptors-ai/backgrounds/disruptors-ai/backgrounds/geometric-minimalist.jpg"
    },
    {
      company: "The Wellness Way",
      industry: "Healthcare",
      result: "500+ new patients in 6 months",
      metric1: { label: "New Patients", value: "500+" },
      metric2: { label: "Cost Reduction", value: "60%" },
      metric3: { label: "Conversion Rate", value: "8.2%" },
      quote: "The AI automation has allowed us to focus on patient care while our marketing runs itself.",
      author: "Dr. Sarah Williams",
      image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1759268594/disruptors-ai/backgrounds/disruptors-ai/backgrounds/geometric-minimalist.jpg"
    },
    {
      company: "SegPro Construction",
      industry: "Construction",
      result: "$2M in new contracts secured",
      metric1: { label: "Revenue", value: "$2M+" },
      metric2: { label: "Lead Quality", value: "92%" },
      metric3: { label: "Close Rate", value: "45%" },
      quote: "We've never had this level of consistency in our pipeline. The AI knows our ideal customer better than we do.",
      author: "Mike Johnson, Owner",
      image: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1759268594/disruptors-ai/backgrounds/disruptors-ai/backgrounds/geometric-minimalist.jpg"
    }
  ];

  const trustBadges = [
    { icon: Shield, label: "SOC 2 Certified", desc: "Enterprise Security" },
    { icon: Award, label: "Inc. 5000", desc: "Fastest Growing" },
    { icon: Star, label: "4.9/5 Rating", desc: "500+ Reviews" },
    { icon: CheckCircle2, label: "99.9% Uptime", desc: "Always Available" }
  ];

  const testimonials = [
    {
      text: "Best investment we've made in our business. The ROI is incredible.",
      author: "Jennifer Martinez",
      company: "Granite Paving",
      rating: 5
    },
    {
      text: "Finally, marketing that actually works. Our lead flow is predictable and consistent.",
      author: "David Chen",
      company: "Auto Trim Utah",
      rating: 5
    },
    {
      text: "The team is incredible. They treat your business like it's their own.",
      author: "Lisa Thompson",
      company: "Sound Corrections",
      rating: 5
    },
    {
      text: "We've tried other agencies. Disruptors AI is in a league of their own.",
      author: "Robert Garcia",
      company: "Muscle Works",
      rating: 5
    },
    {
      text: "The AI automation has saved us countless hours while improving our results.",
      author: "Amanda White",
      company: "Neuro Mastery",
      rating: 5
    },
    {
      text: "Professional, responsive, and results-driven. Exactly what we needed.",
      author: "Tom Anderson",
      company: "Timber View Financial",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero with Logo Trust Bar */}
      <section className="bg-gradient-to-br from-gray-900 to-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-500 text-sm font-semibold mb-6">
              TRUSTED BY 500+ COMPANIES
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Join the Companies Already
              <br />
              <span className="text-yellow-500">Dominating Their Markets</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              See why industry leaders trust Disruptors AI to power their growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client Logo Marquee */}
      <section className="bg-gray-900 py-12 overflow-hidden">
        <div className="mb-8 text-center">
          <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">
            Trusted by Industry Leaders
          </p>
        </div>
        <ClientLogoMarquee />
      </section>

      {/* Reviews Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <p className="text-gray-600">4.9/5 average rating from 500+ reviews</p>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* Case Study Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Real Results. Real Companies.
            </h2>
            <p className="text-xl text-gray-600">
              Success stories from businesses just like yours
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-12">
                    <div className="text-yellow-500 text-sm font-bold mb-2">
                      {study.industry.toUpperCase()}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {study.company}
                    </h3>
                    <div className="text-2xl font-bold text-yellow-500 mb-6">
                      {study.result}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {study.metric1.value}
                        </div>
                        <div className="text-sm text-gray-400">
                          {study.metric1.label}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {study.metric2.value}
                        </div>
                        <div className="text-sm text-gray-400">
                          {study.metric2.label}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {study.metric3.value}
                        </div>
                        <div className="text-sm text-gray-400">
                          {study.metric3.label}
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-lg text-gray-300 italic mb-4 border-l-4 border-yellow-500 pl-4">
                      "{study.quote}"
                    </blockquote>
                    <div className="text-gray-400">
                      — {study.author}
                    </div>
                  </div>

                  <div className="relative h-64 md:h-auto">
                    <img
                      src={study.image}
                      alt={study.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              500+ Five-Star Reviews
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <div className="font-bold text-xl text-gray-900 mb-1">
                    {badge.label}
                  </div>
                  <div className="text-gray-600">
                    {badge.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Join 500+ Successful Companies
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            See why industry leaders choose Disruptors AI
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 shadow-2xl">
            Start Your Success Story
          </button>
          <p className="text-gray-400 mt-6 text-sm">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
