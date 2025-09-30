import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, Clock, Users, ArrowRight, Target, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const caseData = {
  title: "SegPro Marketing Automation Suite",
  client: "SegPro",
  meta: { industry: "Marketing Technology", services: "AI Strategy, Content Production, Digital Transformation" },
  overview: "Developed a comprehensive marketing automation platform that enables SegPro to deliver personalized campaigns at scale with AI-driven insights.",
  challenge: "Fragmented marketing tools, manual campaign management, and inability to personalize at scale were limiting growth potential and efficiency.",
  approach: "Built an integrated marketing automation suite with AI-powered segmentation, automated content delivery, and comprehensive analytics dashboard.",
  results: [
    { icon: TrendingUp, value: "+450%", label: "Campaign ROI" },
    { icon: Clock, value: "-85%", label: "Setup Time" },
    { icon: Users, value: "+300%", label: "Lead Quality" },
    { icon: CheckCircle, value: "97%", label: "Automation Success" }
  ],
  services: [
    { icon: Globe, name: "Marketing Platform" },
    { icon: Zap, name: "AI Segmentation" },
    { icon: Target, name: "Content Automation" }
  ],
  testimonial: "The automation suite has been a game-changer. Our campaigns are more targeted and effective than ever.",
  clientLogo: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1758167808/case-studies/case-studies/segpro_logo.png",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
};

export default function WorkSegPro() {
  return (
    <div className="bg-transparent text-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-transparent py-24 sm:py-32 -mt-20">
        <img src={caseData.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative pt-20">
          <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.6 }}>
            <img src={caseData.clientLogo} alt={caseData.client} className="h-16 mx-auto mb-6 filter brightness-0 invert" />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{caseData.title}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">{caseData.overview}</p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
          
          {/* Metrics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {caseData.results.map((item, i) => (
              <motion.div key={item.label} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{duration:0.5, delay: i * 0.1}} viewport={{once: true}}>
                <div className="w-16 h-16 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#FFD700]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white">{item.value}</p>
                <p className="text-sm text-[#9CA3AF] mt-1">{item.label}</p>
              </motion.div>
            ))}
          </section>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Section title="The Challenge" content={caseData.challenge} />
            <Section title="Our Approach" content={caseData.approach} />
          </div>

          {/* Services Provided */}
          <Section title="Services Provided">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
              {caseData.services.map(service => (
                <div key={service.name} className="flex flex-col items-center text-center p-6 bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl hover:border-[#FFD700]/30 transition-colors">
                  <div className="w-12 h-12 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <p className="font-semibold text-white">{service.name}</p>
                </div>
              ))}
            </div>
          </Section>
          
          {/* Visual Mockup */}
          <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.8}} viewport={{once:true}}>
            <div className="aspect-[16/9] bg-[#0E0E0E] p-4 rounded-2xl border border-[#2A2A2A]">
               <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" alt="Project Mockup" className="rounded-xl w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Testimonial */}
          <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-8 sm:p-12 text-center">
            <p className="text-xl sm:text-2xl italic text-white mb-4">"{caseData.testimonial}"</p>
            <p className="text-[#C7C7C7]">- {caseData.client}</p>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Ready for similar results?</h3>
            <Button asChild size="lg" className="bg-[#FFD700] text-black font-semibold hover:bg-[#E0B200] rounded-xl px-8 py-3">
              <Link to={createPageUrl("contact")}>Start Your Project <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, content, children }) => (
  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{duration:0.6}} viewport={{once: true}}>
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    {content && <p className="text-[#C7C7C7] leading-relaxed">{content}</p>}
    {children}
  </motion.div>
);