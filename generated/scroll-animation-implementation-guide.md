# Scroll Animation Implementation Guide for React/GSAP/Framer Motion

## Overview
This guide provides comprehensive implementation patterns for scroll-based animations in your React/Vite application, combining GSAP's powerful animation capabilities with Framer Motion's React-optimized features.

## Architecture Setup

### 1. Dependencies Installation
```bash
npm install gsap @gsap/react framer-motion
npm install --save-dev @types/gsap
```

### 2. GSAP Plugins Registration
```javascript
// src/lib/gsap-setup.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export { gsap, ScrollTrigger };
```

## Core Implementation Patterns

### 1. Scroll Context Provider
```jsx
// src/contexts/ScrollContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ScrollContext = createContext();

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollData = () => {
      const currentScrollY = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      setScrollY(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setScrollProgress(currentScrollY / maxScroll);

      lastScrollY = currentScrollY;
    };

    const throttledUpdate = throttle(updateScrollData, 16); // 60fps
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  return (
    <ScrollContext.Provider value={{
      scrollY,
      scrollDirection,
      scrollProgress
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

// Utility throttle function
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}
```

### 2. GSAP Scroll Animation Hook
```javascript
// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-setup';

export const useScrollAnimation = (animationConfig = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      trigger = element,
      start = 'top 80%',
      end = 'bottom 20%',
      animation = {},
      scrub = false,
      toggleActions = 'play none none reverse',
      ...otherProps
    } = animationConfig;

    // Create animation
    const tl = gsap.timeline({ paused: true });

    // Default animation if none provided
    const animProps = {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...animation
    };

    tl.to(element, animProps);

    // Create ScrollTrigger
    animationRef.current = ScrollTrigger.create({
      trigger,
      start,
      end,
      animation: tl,
      scrub,
      toggleActions,
      ...otherProps
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [animationConfig]);

  return elementRef;
};
```

### 3. Parallax Hook
```javascript
// src/hooks/useParallax.js
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-setup';

export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animation = gsap.to(element, {
      yPercent: direction === 'vertical' ? -50 * speed : 0,
      xPercent: direction === 'horizontal' ? -50 * speed : 0,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    return () => animation.kill();
  }, [speed, direction]);

  return elementRef;
};
```

### 4. Count-Up Animation Hook
```javascript
// src/hooks/useCountUp.js
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-setup';

export const useCountUp = (endValue, duration = 2, startValue = 0) => {
  const elementRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(startValue);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animation = gsap.to({ value: startValue }, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        setCurrentValue(Math.round(this.targets()[0].value));
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reset'
      }
    });

    return () => animation.kill();
  }, [endValue, duration, startValue]);

  return [elementRef, currentValue];
};
```

## React Components

### 1. Scroll Reveal Component
```jsx
// src/components/animations/ScrollReveal.jsx
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const ScrollReveal = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 0.6,
  delay = 0,
  className = '',
  ...props
}) => {
  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { opacity: 0 };
    }
  };

  const elementRef = useScrollAnimation({
    animation: {
      ...getInitialTransform(),
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: 'power2.out'
    }
  });

  return (
    <div
      ref={elementRef}
      className={className}
      style={getInitialTransform()}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
```

### 2. Parallax Container
```jsx
// src/components/animations/ParallaxContainer.jsx
import React from 'react';
import { useParallax } from '../../hooks/useParallax';

const ParallaxContainer = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = ''
}) => {
  const elementRef = useParallax(speed, direction);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ParallaxContainer;
```

### 3. Enhanced Service Scroller with Scroll Animations
```jsx
// src/components/shared/ServiceScrollerAnimated.jsx
import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-setup';
import ScrollReveal from '../animations/ScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';

const ServiceScrollerAnimated = ({ services = [] }) => {
  const containerRef = useRef(null);
  const [statsRef, currentStat] = useCountUp(98, 2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Stagger animation for service cards
    const cards = container.querySelectorAll('.service-card');

    gsap.fromTo(cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Horizontal scroll animation for large screens
    const scrollWidth = container.scrollWidth - container.clientWidth;

    if (scrollWidth > 0) {
      gsap.to(container, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container.parentElement,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
    }

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [services]);

  return (
    <section className="relative py-20 overflow-hidden">
      <ScrollReveal direction="up" className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
        <div className="flex items-center justify-center gap-4">
          <span>Success Rate:</span>
          <span ref={statsRef} className="text-3xl font-bold text-blue-600">
            {currentStat}%
          </span>
        </div>
      </ScrollReveal>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 pb-6 overflow-x-auto lg:overflow-hidden"
          style={{ width: 'max-content' }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card flex-shrink-0 w-80 p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {service.price}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceScrollerAnimated;
```

### 4. Sticky Header with Scroll Animations
```jsx
// src/components/layout/StickyHeader.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap-setup';
import { useScroll } from '../../contexts/ScrollContext';

const StickyHeader = ({ children }) => {
  const headerRef = useRef(null);
  const { scrollY, scrollDirection } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const shouldHide = scrollDirection === 'down' && scrollY > 100;
    const shouldShow = scrollDirection === 'up' || scrollY <= 100;

    if (shouldHide) {
      gsap.to(header, {
        y: -100,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    } else if (shouldShow) {
      gsap.to(header, {
        y: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }

    setIsScrolled(scrollY > 50);
  }, [scrollY, scrollDirection]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {children}
    </header>
  );
};

export default StickyHeader;
```

## Performance Optimizations

### 1. Reduced Motion Support
```css
/* src/styles/animations.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.animate-on-scroll {
  will-change: transform, opacity;
}

.animate-on-scroll.complete {
  will-change: auto;
}
```

### 2. Performance Monitoring Hook
```javascript
// src/hooks/usePerformanceMonitor.js
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fps = useRef(60);

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      frameCount.current++;

      if (now - lastTime.current >= 1000) {
        fps.current = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        frameCount.current = 0;
        lastTime.current = now;

        // Log performance warnings
        if (fps.current < 30) {
          console.warn('Low FPS detected:', fps.current);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);

  return fps.current;
};
```

## Implementation in Your App

### 1. Add to App.jsx
```jsx
// src/App.jsx
import { ScrollProvider } from './contexts/ScrollContext';
import StickyHeader from './components/layout/StickyHeader';
import './lib/gsap-setup'; // Initialize GSAP

function App() {
  return (
    <ScrollProvider>
      <StickyHeader>
        {/* Your header content */}
      </StickyHeader>

      <main>
        {/* Your page content with scroll animations */}
      </main>
    </ScrollProvider>
  );
}

export default App;
```

### 2. Usage Examples
```jsx
// In your page components
import ScrollReveal from '../components/animations/ScrollReveal';
import ParallaxContainer from '../components/animations/ParallaxContainer';
import { useCountUp } from '../hooks/useCountUp';

const HomePage = () => {
  const [counterRef, currentValue] = useCountUp(1000, 2);

  return (
    <div>
      <ParallaxContainer speed={0.3}>
        <div className="hero-background" />
      </ParallaxContainer>

      <ScrollReveal direction="up" delay={0.2}>
        <h1>Welcome to Disruptors AI</h1>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.4}>
        <p>Revolutionary AI solutions...</p>
      </ScrollReveal>

      <div ref={counterRef}>
        <span>{currentValue}</span> satisfied clients
      </div>
    </div>
  );
};
```

## Best Practices Summary

1. **Use `transform` and `opacity`** for best performance
2. **Implement `will-change`** strategically and remove after animations
3. **Throttle scroll events** to 16ms or use `requestAnimationFrame`
4. **Respect `prefers-reduced-motion`** media query
5. **Use GSAP for complex animations**, Framer Motion for React-specific features
6. **Implement proper cleanup** in useEffect hooks
7. **Monitor performance** and adjust animation complexity accordingly
8. **Test on various devices** and connection speeds

This implementation provides a solid foundation for scroll-based animations in your React/Vite application while maintaining performance and accessibility standards.