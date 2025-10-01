import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Spline from '@splinetool/react-spline';

gsap.registerPlugin(ScrollTrigger);

/**
 * ServicesHandScroll Component
 *
 * Scroll-triggered Spline hand animation for the services/solutions page.
 * Animates hand imagery and service graphics based on scroll position using GSAP.
 *
 * Scene Objects:
 * - hand-srv.png: Main hand image
 * - services-img.png: Service graphics
 * - Text: Text element
 * - srv-cont-bg.e12b85655a1a0b7c9fde.jpg: Background image
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Hero title text
 * @param {string} props.description - Hero description text
 */
const ServicesHandScroll = ({
  className = "",
  title = "Our Services",
  description = "Transform your business with AI-powered solutions"
}) => {
  const containerRef = useRef(null);
  const splineRef = useRef(null);
  const textRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Spline scene load handler
  const handleSplineLoad = useCallback((splineApp) => {
    console.log('✅ Services hand scene loaded');
    setIsLoading(false);
    setHasError(false);
    splineRef.current = splineApp;

    // Setup scroll animations after scene loads
    setTimeout(() => setupScrollAnimations(splineApp), 100);
  }, []);

  // Spline scene error handler
  const handleSplineError = useCallback((error) => {
    console.error('❌ Spline scene failed:', error);
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Setup GSAP ScrollTrigger animations
  const setupScrollAnimations = useCallback((splineApp) => {
    const container = containerRef.current;
    if (!container || !splineApp) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Find scene objects
    let handObject, servicesObject, textObject, bgObject, cameraObject;

    try {
      handObject = splineApp.findObjectByName('hand-srv.png');
      servicesObject = splineApp.findObjectByName('services-img.png');
      textObject = splineApp.findObjectByName('Text');
      bgObject = splineApp.findObjectByName('srv-cont-bg.e12b85655a1a0b7c9fde.jpg');
      cameraObject = splineApp.findObjectByName('Camera');

      console.log('🎯 Objects found:', {
        hand: !!handObject,
        services: !!servicesObject,
        text: !!textObject,
        background: !!bgObject,
        camera: !!cameraObject
      });
    } catch (error) {
      console.warn('⚠️ Error finding objects:', error);
    }

    // Store initial positions
    const initialPositions = {
      hand: handObject ? { ...handObject.position } : null,
      services: servicesObject ? { ...servicesObject.position } : null,
      camera: cameraObject ? { ...cameraObject.position } : null,
      bg: bgObject ? { ...bgObject.position } : null
    };

    const initialRotations = {
      hand: handObject ? { ...handObject.rotation } : null,
      services: servicesObject ? { ...servicesObject.rotation } : null
    };

    // Main scroll trigger
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        try {
          // Animate hand - rotate and move
          if (handObject && initialPositions.hand && initialRotations.hand) {
            // Smooth rotation based on scroll
            handObject.rotation.z = initialRotations.hand.z + (progress * Math.PI * 0.3);
            handObject.rotation.y = initialRotations.hand.y + (Math.sin(progress * Math.PI) * 0.2);

            // Subtle position shift
            handObject.position.y = initialPositions.hand.y + (Math.sin(progress * Math.PI) * 50);
            handObject.position.x = initialPositions.hand.x + (progress * 30);

            // Scale animation
            const scale = 1 + (Math.sin(progress * Math.PI) * 0.15);
            handObject.scale.set(scale, scale, scale);
          }

          // Animate services image - parallax effect
          if (servicesObject && initialPositions.services) {
            servicesObject.position.y = initialPositions.services.y - (progress * 80);
            servicesObject.position.x = initialPositions.services.x + (Math.sin(progress * Math.PI * 2) * 20);

            // Rotation
            servicesObject.rotation.z = initialRotations.services.z - (progress * Math.PI * 0.2);

            // Fade in/out
            if (servicesObject.material) {
              servicesObject.material.opacity = 0.3 + (Math.sin(progress * Math.PI) * 0.7);
            }
          }

          // Animate background - slow parallax
          if (bgObject && initialPositions.bg) {
            bgObject.position.y = initialPositions.bg.y + (progress * 100);
            bgObject.position.x = initialPositions.bg.x - (progress * 30);
          }

          // Camera movement for depth
          if (cameraObject && initialPositions.camera) {
            cameraObject.position.y = initialPositions.camera.y - (progress * 50);
            cameraObject.position.z = initialPositions.camera.z + (progress * 30);
          }

          // Text fade based on scroll position
          if (textObject) {
            const textOpacity = 1 - (progress * 1.5);
            if (textObject.material) {
              textObject.material.opacity = Math.max(0, textOpacity);
            }
          }

        } catch (error) {
          console.warn('⚠️ Animation error:', error);
        }
      },
      onEnter: () => {
        // Fade in overlay text
        gsap.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
      },
      onLeave: () => {
        // Fade out overlay text
        gsap.to(textRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.6,
          ease: "power2.out"
        });
      },
      onEnterBack: () => {
        // Restore text when scrolling back
        gsap.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });

    // Additional entrance animation
    gsap.fromTo(textRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3
      }
    );

    // Reduced scrub on mobile for better performance
    if (isMobile) {
      scrollTriggerRef.current.vars.scrub = 2;
    }

  }, [isMobile]);

  // Cleanup
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
      className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-gray-50 ${className}`}
      role="region"
      aria-label="Services hero section with 3D animation"
    >
      {/* Spline 3D Scene */}
      {!hasError && (
        <div className="absolute inset-0 w-full h-full">
          <Spline
            scene="https://prod.spline.design/XBh0IU16gBCVNZ0V/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent'
            }}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading experience...</p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-center px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-600">{description}</p>
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 pointer-events-none"
        style={{ zIndex: 10, opacity: 0 }}
      >
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center space-y-2 text-gray-700">
          <span className="text-sm font-medium tracking-wide uppercase">Scroll to explore</span>
          <div className="w-px h-12 bg-gray-700/50 animate-pulse"></div>
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none"></div>
    </section>
  );
};

export default ServicesHandScroll;
