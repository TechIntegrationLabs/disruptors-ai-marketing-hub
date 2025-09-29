// Enhanced Scroll Animation Components for Disruptors AI Marketing Hub
// Based on analysis of modern scroll animation patterns and best practices

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Enhanced Video Scroll Scrub with Multiple Animation Layers
 * Builds upon your existing VideoScrollScrub component with additional features
 */
export const EnhancedVideoScrollScrub = ({
  videoSrc = "https://res.cloudinary.com/dvcvxhzmt/video/upload/v1759116522/full-animation_online-video-cutter.com_zzpok1.mp4",
  poster = "https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/v1/disruptors-media/hero-poster.jpg",
  title = "AI-Powered Marketing Innovation",
  description = "Discover how we transform businesses with cutting-edge AI solutions",
  stats = [
    { value: 250, label: "Clients Served", suffix: "+" },
    { value: 98, label: "Success Rate", suffix: "%" },
    { value: 500, label: "Projects Completed", suffix: "+" }
  ],
  className = ""
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const statsRef = useRef(null);
  const parallaxBgRef = useRef(null);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const titleElement = titleRef.current;
    const descriptionElement = descriptionRef.current;
    const statsElement = statsRef.current;
    const parallaxBg = parallaxBgRef.current;

    if (!video || !container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.style.display = 'none';
      return;
    }

    // Video setup
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const handleLoadedMetadata = () => {
      video.currentTime = 0;

      // Main video scroll scrubbing
      const videoScrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetTime = progress * video.duration;

          if ('requestVideoFrameCallback' in video) {
            video.requestVideoFrameCallback(() => {
              video.currentTime = targetTime;
            });
          } else {
            video.currentTime = targetTime;
          }
        }
      });

      // Parallax background effect
      const parallaxTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(parallaxBg, {
            yPercent: -30 * progress
          });
        }
      });

      // Title entrance animation with split text effect
      const titleChars = titleElement.textContent.split('');
      titleElement.innerHTML = titleChars.map(char =>
        char === ' ' ? ' ' : `<span class="inline-block">${char}</span>`
      ).join('');

      const titleSpans = titleElement.querySelectorAll('span');

      const titleTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.fromTo(titleSpans,
            {
              opacity: 0,
              y: 100,
              rotationX: 90,
              transformOrigin: "bottom center"
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1.2,
              stagger: 0.03,
              ease: "back.out(1.7)"
            }
          );
        }
      });

      // Description fade-in with typewriter effect
      const descriptionTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top 70%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.fromTo(descriptionElement,
            {
              opacity: 0,
              y: 50,
              filter: 'blur(10px)'
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.5,
              delay: 0.5,
              ease: "power2.out"
            }
          );
        }
      });

      // Animated statistics counter
      const statsTrigger = ScrollTrigger.create({
        trigger: statsElement,
        start: "top 80%",
        toggleActions: "play none none reset",
        onEnter: () => {
          stats.forEach((stat, index) => {
            gsap.to({ value: 0 }, {
              value: stat.value,
              duration: 2,
              delay: index * 0.2,
              ease: "power2.out",
              onUpdate: function() {
                setAnimatedStats(prev => {
                  const newStats = [...prev];
                  newStats[index] = Math.round(this.targets()[0].value);
                  return newStats;
                });
              }
            });
          });

          // Stats container animation
          gsap.fromTo(statsElement.children,
            {
              opacity: 0,
              y: 30,
              scale: 0.8
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.7)"
            }
          );
        }
      });

      // Cleanup function
      return () => {
        videoScrollTrigger.kill();
        parallaxTrigger.kill();
        titleTrigger.kill();
        descriptionTrigger.kill();
        statsTrigger.kill();
      };
    };

    const handleError = (e) => {
      console.warn('Video failed to load:', e);
      video.style.display = 'none';
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [stats]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
      role="region"
      aria-label="Video showcase section"
    >
      {/* Parallax Background Layer */}
      <div
        ref={parallaxBgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          muted
          playsInline
          preload="metadata"
          aria-label={title}
        >
          <source src={videoSrc} type="video/mp4" />
          <p className="text-white text-center p-8">
            Your browser does not support the video tag.
            <img src={poster} alt={title} className="w-full h-full object-cover" />
          </p>
        </video>
      </div>

      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Content Layers */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 z-10">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight perspective-1000"
        >
          {title}
        </h1>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed mb-12"
        >
          {description}
        </p>

        {/* Animated Statistics */}
        <div
          ref={statsRef}
          className="flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                <span className="tabular-nums">
                  {animatedStats[index]?.toLocaleString() || 0}
                </span>
                <span className="text-blue-400">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator with Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70 z-20">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium tracking-wide uppercase animate-pulse">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 w-full h-2 bg-white/80 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Service Cards with Magnetic Hover and Scroll Reveals
 */
export const MagneticServiceCards = ({ services = [] }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;

    if (!container || !cards.length) return;

    // Scroll-triggered entrance animation
    const entranceTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 70%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        gsap.fromTo(cards,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationY: 15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.7)"
          }
        );
      }
    });

    // Magnetic hover effect for each card
    cards.forEach((card, index) => {
      if (!card) return;

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        gsap.to(card, {
          x: deltaX,
          y: deltaY,
          rotationY: deltaX * 0.1,
          rotationX: -deltaY * 0.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      entranceTrigger.kill();
    };
  }, [services]);

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              ref={el => cardsRef.current[index] = el}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu perspective-1000 cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {service.price}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Parallax Hero Section with Layered Animation
 */
export const ParallaxHeroSection = ({
  backgroundImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3",
  title = "Transform Your Business with AI",
  subtitle = "Revolutionary solutions for the modern enterprise",
  ctaText = "Get Started",
  onCtaClick = () => {}
}) => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    const particles = particlesRef.current;

    if (!container) return;

    // Parallax background
    const bgParallax = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(bg, {
          yPercent: -50 * progress
        });
      }
    });

    // Content fade out on scroll
    const contentFade = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(content, {
          opacity: 1 - progress,
          yPercent: -30 * progress
        });
      }
    });

    // Floating particles animation
    const particleElements = particles.children;
    Array.from(particleElements).forEach((particle, index) => {
      gsap.to(particle, {
        y: `random(-20, 20)`,
        x: `random(-10, 10)`,
        rotation: `random(-180, 180)`,
        duration: `random(3, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.1
      });
    });

    return () => {
      bgParallax.kill();
      contentFade.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center text-center z-10"
      >
        <div className="max-w-4xl px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <button
            onClick={onCtaClick}
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
};

// Additional utility components and hooks would go here...

export default {
  EnhancedVideoScrollScrub,
  MagneticServiceCards,
  ParallaxHeroSection
};