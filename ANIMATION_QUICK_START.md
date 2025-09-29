# 🎬 Animation System Quick Start

## 📍 How to Access

### Demo Page
Visit the demo page to see all animations in action:

```
http://localhost:5173/animations-demo
```

Or in production:
```
https://your-domain.com/animations-demo
```

This page shows 8+ different animation examples you can copy and customize.

---

## 🎯 How to Use in Your Components

### Method 1: Import the Hook Directly

```javascript
import { useFadeInUp } from '@/hooks/useScrollAnimation';

export function MyComponent() {
  const ref = useFadeInUp();

  return (
    <div ref={ref} className="my-content">
      This fades in on scroll
    </div>
  );
}
```

### Method 2: Use in Existing Components

**Example: Animate Hero Section**
```javascript
// src/pages/Home.jsx
import { useFadeInUp } from '@/hooks/useScrollAnimation';
import Hero from '@/components/shared/Hero';

export default function Home() {
  const heroRef = useFadeInUp({ duration: 1.5 });

  return (
    <div>
      <div ref={heroRef}>
        <Hero />
      </div>
      {/* rest of page */}
    </div>
  );
}
```

**Example: Animate Service Cards**
```javascript
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';

export function Services() {
  const gridRef = useStaggerAnimation({ stagger: 0.2 });

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-6">
      <ServiceCard title="AI Automation" />
      <ServiceCard title="Lead Generation" />
      <ServiceCard title="SEO & GEO" />
    </div>
  );
}
```

---

## 📚 Available Animations

Quick reference of all available hooks:

| Hook | Use Case | Import |
|------|----------|--------|
| `useFadeInUp()` | Basic reveals | `import { useFadeInUp } from '@/hooks/useScrollAnimation'` |
| `useStaggerAnimation()` | Lists, grids | `import { useStaggerAnimation } from '@/hooks/useScrollAnimation'` |
| `useParallax()` | Backgrounds | `import { useParallax } from '@/hooks/useScrollAnimation'` |
| `useScaleOnScroll()` | Images, cards | `import { useScaleOnScroll } from '@/hooks/useScrollAnimation'` |
| `useSlideIn()` | Side reveals | `import { useSlideIn } from '@/hooks/useScrollAnimation'` |
| `useRevealAnimation()` | Clip reveals | `import { useRevealAnimation } from '@/hooks/useScrollAnimation'` |
| `useCounterAnimation()` | Stats | `import { useCounterAnimation } from '@/hooks/useScrollAnimation'` |
| `usePinElement()` | Pin sections | `import { usePinElement } from '@/hooks/useScrollAnimation'` |
| `useCustomScrollAnimation()` | Advanced | `import { useCustomScrollAnimation } from '@/hooks/useScrollAnimation'` |

---

## 🔥 Most Common Use Cases

### 1. Fade In Any Section
```javascript
import { useFadeInUp } from '@/hooks/useScrollAnimation';

const ref = useFadeInUp();
return <section ref={ref}>Content</section>;
```

### 2. Animate List Items Sequentially
```javascript
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';

const ref = useStaggerAnimation({ stagger: 0.15 });
return (
  <div ref={ref}>
    {items.map(item => <div key={item.id}>{item.title}</div>)}
  </div>
);
```

### 3. Slide Content From Sides
```javascript
import { useSlideIn } from '@/hooks/useScrollAnimation';

const leftRef = useSlideIn({ direction: "left" });
const rightRef = useSlideIn({ direction: "right" });

return (
  <div className="grid grid-cols-2">
    <div ref={leftRef}>Slides from left</div>
    <div ref={rightRef}>Slides from right</div>
  </div>
);
```

### 4. Animated Statistics
```javascript
import { useCounterAnimation } from '@/hooks/useScrollAnimation';

const counterRef = useCounterAnimation({
  from: 0,
  to: 500,
  suffix: "+"
});

return <span ref={counterRef}>0+</span>;
```

---

## 🎨 Customization Options

All hooks accept options to customize the animation:

```javascript
const ref = useFadeInUp({
  distance: 60,        // How far to travel (px)
  duration: 1.2,       // How long (seconds)
  start: "top 80%",    // When to start
  end: "top 50%",      // When to end
  scrub: 1,            // Smooth scrubbing
  markers: false       // Debug markers
});
```

**Enable debug markers:**
```javascript
const ref = useFadeInUp({ markers: true });
// Shows visual indicators for trigger points
```

---

## 📂 File Locations

- **Animation Hooks**: `src/hooks/useScrollAnimation.js`
- **Demo Page**: `src/components/examples/ScrollAnimationExamples.jsx`
- **Full Documentation**: `SCROLL_ANIMATIONS_GUIDE.md`
- **Route Config**: `src/pages/index.jsx` (line 79, 161, 266)

---

## 🚀 Quick Test

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:5173/animations-demo`

3. Scroll down to see all animations

4. Copy any example you like and use it in your components

---

## 🛠️ Common Patterns

### Pattern: Hero Section
```javascript
const ref = useStaggerAnimation({ stagger: 0.3 });

return (
  <section ref={ref}>
    <h1>Heading</h1>
    <p>Subheading</p>
    <button>CTA</button>
  </section>
);
```

### Pattern: Feature Grid
```javascript
const ref = useStaggerAnimation({
  stagger: 0.15,
  childSelector: ".feature-card"
});

return (
  <div ref={ref} className="grid">
    <div className="feature-card">Feature 1</div>
    <div className="feature-card">Feature 2</div>
    <div className="feature-card">Feature 3</div>
  </div>
);
```

### Pattern: Alternating Content
```javascript
const leftRef = useSlideIn({ direction: "left" });
const rightRef = useSlideIn({ direction: "right" });

return (
  <>
    <div className="flex">
      <div ref={leftRef}>Text</div>
      <div ref={rightRef}>Image</div>
    </div>
    <div className="flex">
      <div ref={rightRef}>Image</div>
      <div ref={leftRef}>Text</div>
    </div>
  </>
);
```

---

## 🐛 Troubleshooting

**Animation not triggering?**
- Check that GSAP is installed: `npm list gsap`
- Verify the element is in viewport when scrolling
- Enable markers: `{ markers: true }`

**Animation too fast/slow?**
- Adjust `duration` prop
- Adjust `scrub` value (higher = smoother)

**Animation triggers too early/late?**
- Adjust `start` prop (e.g., "top 80%" → "top 60%")
- Use markers to visualize trigger points

---

## 📖 Need More Help?

- **Full Documentation**: `SCROLL_ANIMATIONS_GUIDE.md`
- **GSAP Docs**: https://gsap.com/docs/v3/
- **ScrollTrigger Docs**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

---

**Ready to animate? Start at `/animations-demo` and see the magic! ✨**