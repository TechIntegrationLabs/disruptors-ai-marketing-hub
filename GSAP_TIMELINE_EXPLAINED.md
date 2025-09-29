# 🎬 GSAP Timeline Explained - Simple Guide

## What is GSAP Timeline?

**GSAP Timeline** = A way to create sequences of animations in code
- Think of it like a **video timeline** in video editing software
- But instead of video clips, you're arranging **animations**
- Everything is done in **JavaScript code** (no 3D models)

---

## 🎥 Timeline vs Regular Animation

### Regular Animation (One-at-a-time):
```javascript
// Fade in
gsap.to(".box", { opacity: 1, duration: 1 });

// Then move (but when? how do we sequence?)
gsap.to(".box", { x: 100, duration: 1 });

// Then scale (timing gets messy!)
gsap.to(".box", { scale: 2, duration: 1 });
```
❌ **Problem:** Hard to control sequence and timing

### Timeline (Organized Sequence):
```javascript
// Create a timeline
const tl = gsap.timeline();

// Add animations in order
tl.to(".box", { opacity: 1, duration: 1 })     // Step 1: Fade in
  .to(".box", { x: 100, duration: 1 })         // Step 2: Move
  .to(".box", { scale: 2, duration: 1 });      // Step 3: Scale

// They play in sequence automatically!
```
✅ **Better:** Easy to sequence, time, and control

---

## 🎯 Real-World Analogy

### Timeline = Movie Editing

Imagine editing a movie:

```
00:00 ━━━━━━━━━━━━━━━━━━━━━━━━━ 01:00
      ▼         ▼          ▼
      Fade In   Move      Scale Up
      (0-1s)    (1-2s)    (2-3s)
```

**GSAP Timeline lets you do this with animations!**

---

## 📝 Simple Examples

### Example 1: Hero Section Reveal

```javascript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Create timeline
    const tl = gsap.timeline();

    // Sequence of animations
    tl.from(".hero-title", {
        opacity: 0,
        y: -50,
        duration: 1
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 0.8
      }, "-=0.5") // Start 0.5s before previous ends
      .from(".hero-button", {
        opacity: 0,
        scale: 0.5,
        duration: 0.6
      });

  }, []);

  return (
    <div ref={containerRef}>
      <h1 className="hero-title">Welcome</h1>
      <p className="hero-subtitle">To Disruptors AI</p>
      <button className="hero-button">Get Started</button>
    </div>
  );
}
```

**What happens:**
1. Title fades in from top (1 second)
2. Subtitle fades in from bottom (starts 0.5s before title finishes)
3. Button pops in with scale effect

---

### Example 2: Service Cards Reveal

```javascript
export function ServiceCards() {
  const cardsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate all cards with stagger
    tl.from(".service-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2  // 0.2s delay between each card
    });

  }, []);

  return (
    <div ref={cardsRef} className="grid">
      <div className="service-card">AI Automation</div>
      <div className="service-card">Lead Generation</div>
      <div className="service-card">SEO & GEO</div>
    </div>
  );
}
```

**What happens:**
- Card 1 fades in
- Card 2 fades in 0.2s later
- Card 3 fades in 0.2s after that

---

### Example 3: Scroll-Triggered Timeline

```javascript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1  // Animation tied to scroll position
      }
    });

    // Animations happen as you scroll
    tl.from(".image", { scale: 0.5, duration: 1 })
      .from(".text", { x: -100, opacity: 0, duration: 1 })
      .from(".button", { y: 50, opacity: 0, duration: 1 });

  }, []);

  return (
    <div ref={sectionRef}>
      <img className="image" src="/image.jpg" />
      <p className="text">Description</p>
      <button className="button">Learn More</button>
    </div>
  );
}
```

**What happens:**
- As you scroll down, image scales up
- Then text slides in from left
- Then button fades in from bottom
- **All tied to scroll position!**

---

## 🎨 Timeline Features

### 1. **Position Control**

```javascript
const tl = gsap.timeline();

// Absolute positioning
tl.to(".box1", { x: 100 })          // At 0s
  .to(".box2", { x: 100 }, "1")     // At 1s
  .to(".box3", { x: 100 }, "2");    // At 2s

// Relative positioning
tl.to(".box1", { x: 100 })              // At 0s
  .to(".box2", { x: 100 }, "-=0.5")    // 0.5s before previous ends
  .to(".box3", { x: 100 }, "+=0.5");   // 0.5s after previous ends
```

### 2. **Labels** (Bookmarks in Timeline)

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100 })
  .addLabel("middle")                // Add bookmark
  .to(".box2", { x: 100 })
  .to(".box3", { x: 100 }, "middle"); // Jump to bookmark
```

### 3. **Playback Control**

```javascript
const tl = gsap.timeline({ paused: true });

// Add animations
tl.to(".box", { x: 100 });

// Control playback
tl.play();    // Play
tl.pause();   // Pause
tl.reverse(); // Play backwards
tl.restart(); // Start over
tl.seek(2);   // Jump to 2 seconds
```

---

## 🆚 Spline vs GSAP Timeline

| Feature | Spline | GSAP Timeline |
|---------|--------|---------------|
| **Type** | 3D animations | 2D/DOM animations |
| **Editor** | Visual drag-and-drop | Code-based |
| **Use For** | 3D models, objects | Text, images, divs, SVGs |
| **File Size** | Larger (3D models) | Smaller (just code) |
| **Learning Curve** | Easier (visual) | Requires coding |
| **Performance** | Heavier (3D rendering) | Lighter (2D) |
| **Best For** | Hero 3D scenes | Scroll reveals, UI animations |

---

## 🎯 When to Use Each

### Use **Spline** (3D):
- ✅ Hero sections with 3D objects
- ✅ Product showcases (3D models)
- ✅ Interactive 3D experiences
- ✅ When you want "wow factor"

### Use **GSAP Timeline** (2D):
- ✅ Text reveals and fades
- ✅ Image animations
- ✅ Card/grid animations
- ✅ Scroll-based reveals
- ✅ UI element transitions
- ✅ When you need lightweight animations

---

## 🔥 Complete Working Example

### Hero Section with Timeline:

```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Create master timeline
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.out" }
    });

    // Sequence of animations
    tl.from(".hero-bg", {
        scale: 1.2,
        duration: 2
      })
      .from(".hero-logo", {
        y: -100,
        opacity: 0
      }, "-=1.5")
      .from(".hero-title", {
        y: 50,
        opacity: 0
      }, "-=0.8")
      .from(".hero-subtitle", {
        y: 30,
        opacity: 0
      }, "-=0.5")
      .from(".hero-cta", {
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)"
      }, "-=0.3");

    // Scroll animation for next section
    gsap.from(".features", {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".features",
        start: "top 80%",
        end: "top 50%",
        scrub: 1
      }
    });

  }, []);

  return (
    <div ref={heroRef}>
      {/* Hero Section */}
      <section className="hero relative h-screen">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img src="/logo.svg" className="hero-logo w-32 mb-8" />
          <h1 className="hero-title text-6xl font-bold text-white mb-4">
            Disruptors AI
          </h1>
          <p className="hero-subtitle text-2xl text-white/80 mb-8">
            Marketing Innovation Powered by AI
          </p>
          <button className="hero-cta px-8 py-4 bg-white text-purple-900 rounded-lg font-bold">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section (scroll-triggered) */}
      <section className="features py-20">
        <div className="grid grid-cols-3 gap-8">
          <div className="feature-card">AI Automation</div>
          <div className="feature-card">Lead Generation</div>
          <div className="feature-card">SEO & GEO</div>
        </div>
      </section>
    </div>
  );
}
```

---

## 🛠️ Tools to Create Timelines

### Option 1: Code (What We Use)
```javascript
const tl = gsap.timeline();
// Write animations in code
```
✅ **Pros:** Full control, no extra tools
❌ **Cons:** Requires coding

### Option 2: Visual Tools
- **GreenSock Showcase** (gsap.com) - See examples
- **CodePen** - Test animations online
- **No true "timeline editor"** - but code is visual enough!

---

## 📚 Resources

### Learn GSAP Timeline:
- **Official Docs**: https://gsap.com/docs/v3/GSAP/Timeline/
- **CodePen Examples**: https://codepen.io/GreenSock
- **Cheat Sheet**: https://gsap.com/cheatsheet/

### Your Project:
- **Animation Hooks**: `src/hooks/useScrollAnimation.js`
- **Examples**: `src/components/examples/ScrollAnimationExamples.jsx`
- **Demo**: http://localhost:5177/animations-demo

---

## ✅ Quick Decision Guide

**"Should I use Spline or GSAP Timeline?"**

```
Do you need 3D objects/models?
├── YES → Use Spline
└── NO  → Continue...

Is it mostly text/images/divs?
├── YES → Use GSAP Timeline
└── NO  → Continue...

Do you want drag-and-drop editing?
├── YES → Use Spline
└── NO  → Use GSAP Timeline

Do you have complex 3D requirements?
├── YES → Use Spline
└── NO  → Use GSAP Timeline
```

**Best Approach:** Use BOTH!
- Spline for hero 3D scenes
- GSAP Timeline for everything else

---

## 🚀 Next Steps

1. **For Spline**: Follow `SPLINE_EXPORT_TUTORIAL.md`
2. **For GSAP**: Use the hooks in `src/hooks/useScrollAnimation.js`
3. **See Examples**: Visit http://localhost:5177/animations-demo

Need help creating a specific animation? Let me know!