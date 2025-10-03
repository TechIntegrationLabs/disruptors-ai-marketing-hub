import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap, TrendingUp, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveDemo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const services = [
    {
      icon: Zap,
      title: "AI Automation",
      description: "Intelligent systems that work while you sleep",
      color: "bg-[#FFD700]",
      image: "/generated/anachron-lite/ai-automation-icon-anachron-lite.png"
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      description: "Data-driven plans that scale your business",
      color: "bg-[#FFD700]",
      image: "/generated/anachron-lite/seo-geo-icon-anachron-lite.png"
    },
    {
      icon: Users,
      title: "Lead Generation",
      description: "Fill your pipeline with qualified prospects",
      color: "bg-[#FFD700]",
      image: "/generated/anachron-lite/lead-generation-icon-anachron-lite.png"
    },
    {
      icon: Sparkles,
      title: "Content Creation",
      description: "AI-powered content that converts",
      color: "bg-[#FFD700]",
      image: "/generated/anachron-lite/social-media-marketing-icon-anachron-lite.png"
    }
  ];

  useEffect(() => {
    // Story reveal animations
    const storyCards = gsap.utils.toArray('.story-card');
    storyCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Parallax backgrounds
    gsap.utils.toArray('.parallax-bg').forEach((bg) => {
      gsap.to(bg, {
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none'
      });
    });

    // Service cards hover reveal
    gsap.utils.toArray('.service-card').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white overflow-x-hidden" ref={containerRef}>
      {/* Hero with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
            src="https://res.cloudinary.com/dvcvxhzmt/video/upload/c_fill,ar_4:3,g_auto/v1759259179/social_u4455988764_httpss.mj.runEsrFEq0BgZA_make_the_hands_coming_to_2f5e7702-c919-4da3-812d-ebd2789c493e_0_bpisoz.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <motion.div
          className="relative z-10 text-center px-4"
          style={{ opacity }}
        >
          <motion.img
            src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png"
            alt="Disruptors AI"
            className="h-32 mx-auto mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Marketing That
            <br />
            <span className="text-[#FFD700]">Tells Your Story</span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-[#EAEAEA] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Scroll to explore how AI transforms your business
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#FFD700] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#FFD700] rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Story Section 1: The Problem */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="story-card bg-gradient-to-r from-red-900/40 to-transparent border-l-4 border-[#FFD700] p-12 rounded-2xl">
            <div className="max-w-3xl">
              <div className="text-[#FFD700] text-sm font-bold mb-4">CHAPTER 1: THE STRUGGLE</div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                You're Working Too Hard
              </h2>
              <p className="text-xl text-[#EAEAEA] leading-relaxed">
                Every day starts the same. You're buried in tasks that should be automated.
                Your marketing feels like guesswork. You know there's a better way,
                but you're too busy to find it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 2: The Discovery */}
      <section className="py-32 relative bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="story-card bg-gradient-to-l from-blue-900/40 to-transparent border-r-4 border-blue-500 p-12 rounded-2xl ml-auto">
            <div className="max-w-3xl ml-auto text-right">
              <div className="text-[#FFD700] text-sm font-bold mb-4">CHAPTER 2: THE BREAKTHROUGH</div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                What If AI Could Do It All?
              </h2>
              <p className="text-xl text-[#EAEAEA] leading-relaxed">
                Imagine waking up to new leads in your inbox. Campaigns running themselves.
                Content created while you sleep. This isn't fantasy—it's what AI automation
                makes possible today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service Cards */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              The Tools That Power Your Story
            </h2>
            <p className="text-xl text-[#C7C7C7]">
              Hover to explore each service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className="service-card group relative bg-[#0E0E0E] rounded-3xl p-8 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold mb-4 group-hover:text-[#FFD700] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-[#C7C7C7] text-lg mb-6">
                      {service.description}
                    </p>

                    {/* Service icon image */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${service.color} opacity-5 rounded-bl-full`}></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section 3: The Transformation */}
      <section className="py-32 relative bg-gradient-to-b from-green-900/20 to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="story-card bg-gradient-to-r from-green-900/40 to-transparent border-l-4 border-[#FFD700] p-12 rounded-2xl">
            <div className="max-w-3xl">
              <div className="text-[#FFD700] text-sm font-bold mb-4">CHAPTER 3: THE RESULTS</div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Your Business, Transformed
              </h2>
              <p className="text-xl text-[#EAEAEA] leading-relaxed mb-8">
                Three months from now, you're not the same business owner. Your marketing
                runs itself. Your leads are qualified. Your growth is predictable.
                You finally have time to focus on what matters.
              </p>

              {/* Results Grid */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#FFD700] mb-2">300%</div>
                  <div className="text-[#C7C7C7]">Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#FFD700] mb-2">20+</div>
                  <div className="text-[#C7C7C7]">Hours Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#FFD700] mb-2">$2M+</div>
                  <div className="text-[#C7C7C7]">Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Animation */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold mb-8">
              Ready to Write Your
              <br />
              <span className="text-[#FFD700]">Success Story?</span>
            </h2>
            <p className="text-xl text-[#C7C7C7] mb-12">
              Join 500+ companies already transforming their marketing with AI
            </p>
            <motion.button
              className="bg-[#FFD700] hover:bg-[#E0B200] text-black px-16 py-6 rounded-full text-2xl font-bold shadow-2xl"
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(234, 179, 8, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Transformation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
