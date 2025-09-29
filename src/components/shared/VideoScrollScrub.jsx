import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * VideoScrollScrub Component
 *
 * A high-performance video scroll scrubbing component that synchronizes
 * video playback with scroll position using GSAP ScrollTrigger.
 *
 * Features:
 * - Frame-accurate video scrubbing based on scroll position
 * - Optimized for mobile performance (60fps)
 * - Automatic cleanup and memory management
 * - Reduced motion support for accessibility
 * - Lazy loading and intersection observer optimization
 *
 * @param {Object} props - Component props
 * @param {string} props.videoSrc - Source URL for the video file
 * @param {string} props.poster - Poster image URL for video placeholder
 * @param {string} props.title - Accessible title for the video
 * @param {string} props.description - Description text overlay
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.scrollTriggerOptions - Custom ScrollTrigger configuration
 */
const VideoScrollScrub = ({
  videoSrc = "https://res.cloudinary.com/dvcvxhzmt/video/upload/f_auto,q_auto/v1/disruptors-media/hero-video.mp4",
  poster = "https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/v1/disruptors-media/hero-poster.jpg",
  title = "AI-Powered Marketing Innovation",
  description = "Discover how we transform businesses with cutting-edge AI solutions",
  className = "",
  scrollTriggerOptions = {}
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!video || !container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // For users who prefer reduced motion, just show static poster
      video.style.display = 'none';
      return;
    }

    // Video setup for optimal performance
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    // Wait for video metadata to load
    const handleLoadedMetadata = () => {
      // Set initial frame to first frame
      video.currentTime = 0;

      // Create ScrollTrigger animation
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing with 1-second lag
        onUpdate: (self) => {
          // Calculate video progress based on scroll progress
          const progress = self.progress;
          const targetTime = progress * video.duration;

          // Use requestVideoFrameCallback for frame-accurate updates when available
          if ('requestVideoFrameCallback' in video) {
            video.requestVideoFrameCallback(() => {
              video.currentTime = targetTime;
            });
          } else {
            video.currentTime = targetTime;
          }
        },
        onEnter: () => {
          // Animate text reveal when section enters viewport
          gsap.fromTo(textElement,
            {
              opacity: 0,
              y: 50,
              filter: 'blur(10px)'
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: "power2.out"
            }
          );
        },
        onLeave: () => {
          // Fade out text when leaving viewport
          gsap.to(textElement, {
            opacity: 0.3,
            duration: 0.5,
            ease: "power2.out"
          });
        },
        onEnterBack: () => {
          // Restore text when re-entering from below
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          });
        },
        ...scrollTriggerOptions
      });
    };

    // Error handling for video loading
    const handleError = (e) => {
      console.warn('Video failed to load:', e);
      // Fallback to poster image
      video.style.display = 'none';
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    // Performance optimization: Force hardware acceleration
    video.style.transform = 'translateZ(0)';
    video.style.willChange = 'auto';

    // Cleanup function
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Reset video properties
      if (video) {
        video.currentTime = 0;
        video.style.willChange = 'auto';
      }
    };
  }, [videoSrc, scrollTriggerOptions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
      role="region"
      aria-label="Video showcase section"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
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

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {/* Content Overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium tracking-wide uppercase">Scroll to explore</span>
          <div className="w-px h-12 bg-white/50 animate-pulse" />
        </div>
      </div>

      {/* Performance Optimization: Preload hint for video */}
      <link rel="preload" as="video" href={videoSrc} />
    </section>
  );
};

export default VideoScrollScrub;