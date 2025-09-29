# GSAP Scroll Animations Implementation Guide

## Overview

This guide documents the scroll-based animations from the original Disruptors Media site (info.disruptorsmedia.com) and how to implement them in the new React + Vite application.

## Technology Stack

### Old Site
- **GSAP 3.12.5** with plugins:
  - ScrollTrigger
  - Observer
  - ScrambleTextPlugin
- React (Create React App)

### New Site
- **GSAP 3.13.0** (already installed ✅)
- React 18 + Vite
- Framer Motion (for page transitions)

## Quick Start

### 1. Import and Use Animations

```javascript
import { useFadeInUp, useStaggerAnimation } from '@/hooks/useScrollAnimation';

export function MyComponent() {
  // Simple fade in animation
  const fadeRef = useFadeInUp();

  // Stagger animation for lists
  const staggerRef = useStaggerAnimation({ stagger: 0.2 });

  return (
    <div>
      <div ref={fadeRef}>This fades in on scroll</div>

      <div ref={staggerRef}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
    </div>
  );
}
```

### 2. View Examples

To see all animations in action:

```bash
# Add a route to your router for the demo page
# In src/pages/index.jsx or your router config
import ScrollAnimationDemo from '@/components/examples/ScrollAnimationExamples';

// Then navigate to the demo route to see all animations
```

## Available Animation Hooks

### 1. `useFadeInUp()` - Basic Scroll Reveal
Fades element in from below as it enters viewport.

```javascript
const ref = useFadeInUp({
  distance: 50,        // Distance to travel (px)
  duration: 1,         // Animation duration (seconds)
  start: "top 80%",    // When to start
  end: "top 50%",      // When to end
  scrub: 1,            // Smooth scrubbing (true/false/number)
  markers: false       // Debug markers
});
```

**Use Cases:**
- Hero sections
- Text blocks
- Card reveals

---

### 2. `useStaggerAnimation()` - Sequential Reveals
Animates children sequentially with delay between each.

```javascript
const ref = useStaggerAnimation({
  stagger: 0.2,              // Delay between children
  distance: 30,              // Distance to travel
  duration: 0.8,             // Animation duration
  start: "top 75%",          // Start position
  childSelector: "> *"       // CSS selector for children
});
```

**Use Cases:**
- Service cards
- Feature lists
- Gallery items
- Team members

---

### 3. `useParallax()` - Parallax Effect
Creates depth by moving elements at different speeds.

```javascript
const ref = useParallax({
  speed: 0.5,    // Speed multiplier (0.5 = half speed)
  markers: false
});
```

**Use Cases:**
- Background images
- Decorative elements
- Hero backgrounds

---

### 4. `useScaleOnScroll()` - Scale Animation
Scales element from small to full size.

```javascript
const ref = useScaleOnScroll({
  fromScale: 0.8,
  toScale: 1,
  duration: 1,
  start: "top 80%",
  end: "top 30%",
  scrub: 1
});
```

**Use Cases:**
- Featured images
- Important content blocks
- Logo reveals

---

### 5. `useSlideIn()` - Directional Slides
Slides element in from any direction.

```javascript
const ref = useSlideIn({
  direction: "left",   // left, right, top, bottom
  distance: 100,       // Distance to travel
  duration: 1,
  start: "top 80%",
  end: "top 50%",
  scrub: 1
});
```

**Use Cases:**
- Two-column layouts
- Alternating content blocks
- Sidebar reveals

---

### 6. `useRevealAnimation()` - Clip-Path Reveal
Reveals element using clip-path animation.

```javascript
const ref = useRevealAnimation({
  direction: "bottom",  // bottom, top, left, right
  duration: 1.2,
  start: "top 70%"
});
```

**Use Cases:**
- Image reveals
- Hero images
- Video containers

---

### 7. `useCounterAnimation()` - Number Counting
Animates numbers counting up.

```javascript
const ref = useCounterAnimation({
  from: 0,
  to: 100,
  duration: 2,
  start: "top 80%",
  decimals: 0,
  suffix: "+"
});
```

**Use Cases:**
- Statistics sections
- Achievement metrics
- Impact numbers

---

### 8. `usePinElement()` - Pin While Scrolling
Pins element in place during scroll.

```javascript
const ref = usePinElement({
  start: "top top",
  end: "bottom bottom",
  pin: true
});
```

**Use Cases:**
- Navigation bars
- Section headers
- Interactive elements

---

### 9. `useCustomScrollAnimation()` - Advanced Timelines
For complex multi-step animations.

```javascript
const ref = useCustomScrollAnimation(
  (element, gsap) => {
    const tl = gsap.timeline();

    tl.from(".heading", { scale: 0, duration: 0.8 })
      .from(".text", { x: -50, opacity: 0 }, "-=0.3")
      .from(".button", { y: 30, opacity: 0 });

    return tl;
  },
  {
    start: "top 70%",
    toggleActions: "play none none reverse"
  },
  [] // dependencies
);
```

**Use Cases:**
- Complex hero animations
- Multi-step reveals
- Coordinated sequences

## Common Patterns from Old Site

### Pattern 1: Hero Section with Stagger
```javascript
export function Hero() {
  const containerRef = useStaggerAnimation({ stagger: 0.3 });

  return (
    <section ref={containerRef} className="hero">
      <h1>Main Heading</h1>
      <p>Description text</p>
      <button>CTA Button</button>
    </section>
  );
}
```

### Pattern 2: Service Grid
```javascript
export function Services() {
  const gridRef = useStaggerAnimation({
    stagger: 0.15,
    childSelector: ".service-card"
  });

  return (
    <div ref={gridRef} className="grid">
      {services.map(service => (
        <div className="service-card" key={service.id}>
          {/* card content */}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Alternating Content Blocks
```javascript
export function Features() {
  const leftRef = useSlideIn({ direction: "left" });
  const rightRef = useSlideIn({ direction: "right" });

  return (
    <>
      <div className="feature-row">
        <div ref={leftRef}>Text content</div>
        <div ref={rightRef}>Image</div>
      </div>
      <div className="feature-row">
        <div ref={rightRef}>Image</div>
        <div ref={leftRef}>Text content</div>
      </div>
    </>
  );
}
```

### Pattern 4: Stats Section with Counters
```javascript
export function Stats() {
  const counter1 = useCounterAnimation({ to: 500, suffix: "+" });
  const counter2 = useCounterAnimation({ to: 98, suffix: "%", decimals: 1 });

  return (
    <div className="stats-grid">
      <div>
        <span ref={counter1}>0+</span>
        <p>Clients</p>
      </div>
      <div>
        <span ref={counter2}>0%</span>
        <p>Success Rate</p>
      </div>
    </div>
  );
}
```

## Integration with Existing Components

### Home Page Example
```javascript
// src/pages/Home.jsx
import { useFadeInUp, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import Hero from '@/components/shared/Hero';
import ServiceScroller from '@/components/shared/ServiceScroller';

export default function Home() {
  const heroRef = useFadeInUp({ duration: 1.5 });
  const servicesRef = useStaggerAnimation({ stagger: 0.2 });

  return (
    <div>
      <div ref={heroRef}>
        <Hero />
      </div>

      <div ref={servicesRef}>
        <ServiceScroller />
      </div>
    </div>
  );
}
```

### Wrapping Existing Components
```javascript
// Before
<AlternatingLayout sections={sections} />

// After - with animation
function AnimatedAlternatingLayout({ sections }) {
  const containerRef = useStaggerAnimation({
    stagger: 0.3,
    childSelector: ".section"
  });

  return (
    <div ref={containerRef}>
      <AlternatingLayout sections={sections} />
    </div>
  );
}
```

## Performance Tips

### 1. Use `will-change` for Animated Elements
```css
.animated-element {
  will-change: transform, opacity;
}
```

### 2. Batch Animations
Group similar animations together rather than creating individual ScrollTriggers.

### 3. Use `scrub` for Smooth Scrolling
```javascript
// Smooth scrubbing tied to scroll position
scrub: 1  // or true for instant

// Traditional trigger (not scrubbed)
scrub: false
```

### 4. Clean Up Properly
The hooks automatically clean up ScrollTrigger instances on unmount. No additional cleanup needed.

### 5. Debug with Markers
```javascript
const ref = useFadeInUp({ markers: true });
```

## Debugging

### Enable ScrollTrigger Markers
```javascript
// Temporarily enable markers to see trigger points
const ref = useFadeInUp({
  markers: true,  // Shows visual markers
  start: "top 80%",
  end: "top 50%"
});
```

### Check GSAP in DevTools
```javascript
// In browser console
console.log(gsap.version);  // Should show 3.13.0
console.log(ScrollTrigger);  // Should be defined
```

## Migration Checklist

- [x] GSAP 3.13.0 installed
- [x] ScrollTrigger available
- [x] Animation hooks created
- [x] Example components created
- [ ] Apply to Home page
- [ ] Apply to About page
- [ ] Apply to Services pages
- [ ] Apply to Work pages
- [ ] Test on mobile devices
- [ ] Performance optimization
- [ ] Remove debug markers

## Next Steps

1. **View the demo page** to see all animations
2. **Identify specific pages** that need animations
3. **Apply animations incrementally** to existing components
4. **Test performance** on mobile devices
5. **Fine-tune timing and easing** to match old site

## Resources

- [GSAP Documentation](https://gsap.com/docs/v3/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Easing Visualizer](https://gsap.com/docs/v3/Eases)
- Old Site: https://info.disruptorsmedia.com

## Need Help?

If you need to recreate specific animations from the old site:

1. **Record the animation** - Use screen recording
2. **Identify the pattern** - Match to one of the hooks above
3. **Use GSAP Master MCP** - For AI-powered animation generation
4. **Customize timing** - Adjust duration, easing, and delays

---

**Created**: 2025-09-29
**Based on**: Disruptors Media site archive (GSAP 3.12.5 analysis)
**Status**: Ready for implementation