import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '@/api/entities';
import { Linkedin } from 'lucide-react';
import TwoColumnLayout from '../components/shared/TwoColumnLayout';
import AlternatingLayout from '../components/shared/AlternatingLayout';
import DualCTABlock from '../components/shared/DualCTABlock';

const TeamMemberCard = ({ member, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20"
  >
    <div className="w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
      <img 
        src={member.headshot} 
        alt={member.name} 
        className="w-full h-full object-cover" 
      />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
    <p className="text-indigo-600 font-semibold text-lg mb-4">{member.title}</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-6">{member.bio}</p>
    {member.social_links?.linkedin && (
      <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block text-gray-500 hover:text-indigo-600 transition-colors">
        <Linkedin className="w-6 h-6" />
      </a>
    )}
  </motion.div>
);

export default function About() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const aboutIntroData = [
    {
      kicker: "EMPOWERMENT",
      headline: "We're Not Here to Replace You with AI. We're Here to Empower You With It.",
      body: "Disruptors Media is a team of strategists, creatives, and technologists helping business owners embrace the future without losing their human touch. We're not just another marketing agency. We're a Fractional CMO and AI Infrastructure team built for business owners who want clarity, not complexity.",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
      imageAlt: "Team collaboration and empowerment",
      backgroundColor: "bg-gray-900 text-white backdrop-blur-md"
    },
    {
      kicker: "PARTNERSHIP",
      headline: "Local Salt Lake City Expertise, National Impact",
      body: "We partner with local Salt Lake City businesses and national brands alike to systematize their marketing, simplify operations, and leverage AI as a tool…not a replacement. Our secret? We teach what we build. That means every campaign, automation, and strategy we implement comes with the transparency and education needed to put you in control.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
      imageAlt: "Business collaboration and partnership",
      backgroundColor: "bg-gray-800 text-white backdrop-blur-sm"
    }
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // Fetch team members sorted by display_order
        const members = await TeamMember.list('display_order');
        // Filter only active members
        const activeMembers = members.filter(member => member.is_active);
        setTeam(activeMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div>
      {/* Hero Video Section */}
      <section className="relative w-full bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                poster="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1757280802/dm-abt_rwm0ng.jpg"
              >
                <source src="https://res.cloudinary.com/dvcvxhzmt/video/upload/v1757280802/dm-abt_rwm0ng.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Intro Sections with Alternating Layout */}
      <AlternatingLayout sections={aboutIntroData} />
      
      {/* Section 2: Our Philosophy */}
      <TwoColumnLayout
        reversed
        kicker="Our Philosophy"
        headline={
            <>
              AI Shouldn’t Replace Human Connection.
              <br />
              <span className="text-gray-600">It Should Make It Possible at Scale.</span>
            </>
        }
        body={
            <div className="space-y-4 text-gray-700">
                <p>Technology (when done right) frees us from the robotic so we can do the relational.</p>
                <p>AI shouldn’t automate away your voice.</p>
                <p>Systems shouldn’t remove the soul from your business.</p>
                <p>Marketing shouldn’t feel like manipulation.</p>
                <p className="font-bold text-gray-800">We believe:</p>
                <ul className="space-y-2">
                    <li>🔹 Authentic connection is the greatest marketing advantage</li>
                    <li>🔹 Technology exists to expand your capacity</li>
                    <li>🔹 Your brand is a movement, not a machine</li>
                </ul>
                <p>When you partner with Disruptors Media, you're not outsourcing your growth. You’re gaining a team that aligns with your purpose and executes with precision.</p>
            </div>
        }
        leftContent={
          <img src="https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/services/graphics/hand-robot.png" alt="AI Partnership" className="w-full h-full object-contain"/>
        }
      />
      
      {/* Section 3: Meet the Team (Unchanged) */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Meet the Disruptors</h2>
              <p className="text-lg text-gray-600">The disruptive personalities behind the creative genius of Disruptors Media.</p>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading team members...</p>
            </div>
          ) : team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} delay={index * 0.1} />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-gray-600">No team members available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Call to Action */}
       <section className="relative bg-gray-800 text-white py-20">
         <div className="text-center mb-8">
            <h2 className="text-4xl font-bold">Work with the Disruptors</h2>
            <p className="text-lg text-gray-300 mt-2">We help you scale your business without losing its soul. Start with a free strategy session.</p>
         </div>
         <DualCTABlock 
          title=""
          cta1_text="Book a Free Strategy Session"
          cta1_link="book-strategy-session"
          cta2_text="Get a Free Business Audit"
          cta2_link="free-business-audit"
         />
      </section>
    </div>
  );
}