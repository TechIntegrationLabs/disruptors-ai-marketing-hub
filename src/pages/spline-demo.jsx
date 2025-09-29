import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Spline Demo Page
 *
 * Demonstrates the spline-viewer web component with advanced scroll animations
 * using GSAP ScrollTrigger for smooth, production-ready 3D interactions.
 *
 * Features:
 * - Native spline-viewer web component integration
 * - Scroll-triggered 3D transformations
 * - Parallax effects with text overlay
 * - Mobile-responsive design
 * - Accessibility support
 * - Performance optimizations
 */
export default function SplineDemo() {
  const containerRef = useRef(null);
  const splineContainerRef = useRef(null);
  const textRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Spline viewer script dynamically
    const loadSplineViewer = () => {
      // Check if spline-viewer is already loaded
      if (customElements.get('spline-viewer')) {
        console.log('✅ Spline viewer already loaded');
        initializeScene();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.71/build/spline-viewer.js';

      script.onload = () => {
        console.log('✅ Spline viewer script loaded successfully');
        initializeScene();
      };

      script.onerror = (error) => {
        console.error('❌ Failed to load Spline viewer script:', error);
        setHasError(true);
      };

      document.head.appendChild(script);
    };

    const initializeScene = () => {
      if (!splineContainerRef.current) return;

      // Create spline-viewer element
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', 'https://prod.spline.design/lylivpxHMsRXq3dw/scene.splinecode');
      splineViewer.style.width = '100%';
      splineViewer.style.height = '100%';
      splineViewer.style.background = 'transparent';

      // Handle load event
      splineViewer.addEventListener('load', () => {
        console.log('🎨 Spline scene loaded successfully');
        setIsLoaded(true);
        setupScrollAnimations();
      });

      // Handle error event
      splineViewer.addEventListener('error', (e) => {
        console.error('❌ Spline scene failed to load:', e);
        setHasError(true);
      });

      // Clear and append
      splineContainerRef.current.innerHTML = '';
      splineContainerRef.current.appendChild(splineViewer);
    };

    const setupScrollAnimations = () => {
      const container = containerRef.current;
      const splineContainer = splineContainerRef.current;
      const text = textRef.current;
      const scrollIndicator = scrollIndicatorRef.current;

      if (!container || !splineContainer || !text) return;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preferred - disabling animations');
        return;
      }

      // Main scroll animation - 3D scene rotation and scale
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;

          // Rotate the entire 3D container
          const rotationY = progress * 360;
          const scale = 0.8 + (progress * 0.4); // Scale from 0.8 to 1.2

          gsap.set(splineContainer, {
            rotationY: rotationY,
            scale: scale,
            transformOrigin: 'center center',
            force3D: true
          });
        }
      });

      // Text fade and parallax effect
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'center center',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          gsap.set(text, {
            opacity: 1 - progress,
            y: progress * 100,
            filter: `blur(${progress * 10}px)`
          });
        }
      });

      // Fade out scroll indicator
      if (scrollIndicator) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'top center',
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(scrollIndicator, {
              opacity: 1 - self.progress
            });
          }
        });
      }

      // Entrance animation for text
      gsap.from(text, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5
      });

      console.log('✨ Scroll animations initialized');
    };

    // Initialize
    loadSplineViewer();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Hero Section with Spline */}
      <section
        ref={containerRef}
        className="relative w-full min-h-[200vh] overflow-hidden"
        role="region"
        aria-label="Interactive 3D Spline Demo"
      >
        {/* Fixed 3D Container */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {/* Spline Viewer Container */}
          <div
            ref={splineContainerRef}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: isLoaded && !hasError ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out'
            }}
          />

          {/* Loading State */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-white text-xl font-light">Loading 3D Experience...</p>
                <p className="text-gray-400 text-sm mt-2">Powered by Spline</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center px-4">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">Unable to Load 3D Scene</h2>
                <p className="text-gray-400 mb-6">The Spline viewer failed to initialize</p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

          {/* Content Overlay */}
          <div
            ref={textRef}
            className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10"
          >
            <div className="max-w-4xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Innovation Powered by{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed mb-8">
                Experience the future of AI-driven marketing through immersive 3D visualization.
                Scroll to explore our interactive world.
              </p>

              {isLoaded && !hasError && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/book-strategy-session"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    to="/solutions"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-semibold transition-all border border-white/20"
                  >
                    Explore Solutions
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
          >
            <div className="flex flex-col items-center space-y-3">
              <span className="text-sm font-medium tracking-wider uppercase">
                Scroll to Explore
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>

          {/* Performance Hint - Preconnect */}
          <link rel="preconnect" href="https://prod.spline.design" />
          <link rel="dns-prefetch" href="https://unpkg.com" />
        </div>
      </section>

      {/* Info Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              This page demonstrates the power of native Spline web components
              integrated with GSAP ScrollTrigger for buttery-smooth 3D animations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-4">Native Web Components</h3>
              <p className="text-gray-400">
                Using spline-viewer web component for optimal performance and
                seamless browser integration.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">Scroll Animations</h3>
              <p className="text-gray-400">
                GSAP ScrollTrigger powers smooth 3D rotations and transformations
                as you scroll through the page.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4">Optimized Performance</h3>
              <p className="text-gray-400">
                Lazy loading, reduced motion support, and efficient rendering
                ensure smooth experiences on all devices.
              </p>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4">Technical Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Web Component</h4>
                <code className="text-sm bg-black/30 px-3 py-1 rounded block overflow-x-auto">
                  &lt;spline-viewer url="..."&gt;&lt;/spline-viewer&gt;
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Script Source</h4>
                <code className="text-sm bg-black/30 px-3 py-1 rounded block overflow-x-auto">
                  @splinetool/viewer@1.10.71
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Animation Library</h4>
                <code className="text-sm bg-black/30 px-3 py-1 rounded block overflow-x-auto">
                  GSAP ScrollTrigger
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Scene URL</h4>
                <code className="text-sm bg-black/30 px-3 py-1 rounded block overflow-x-auto text-xs">
                  lylivpxHMsRXq3dw
                </code>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}