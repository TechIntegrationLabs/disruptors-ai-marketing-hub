# 🎨 Spline Animation Export & Integration Guide

## Quick Start: Export from Spline.dev

### Step 1: Export Your Animation

#### Method A: Download File (Recommended)
1. Open your animation in Spline.dev
2. Click **"Export"** (top right corner)
3. Select **"Download (.splinecode)"**
4. Save the file (e.g., `my-animation.splinecode`)

#### Method B: Get Public Link
1. Click **"Export"** → **"Publish"**
2. Copy the generated URL
3. Use URL directly in your component

---

### Step 2: Add to Your Project

#### Using Downloaded File:
```bash
# 1. Place file in public folder
public/animations/my-animation.splinecode

# 2. Reference in component
scene="/animations/my-animation.splinecode"
```

#### Using Public URL:
```jsx
scene="https://prod.spline.design/xxx-xxx-xxx/scene.splinecode"
```

---

### Step 3: Use in React Component

#### Basic Usage:
```jsx
import SplineScrollAnimationEnhanced from '@/components/shared/SplineScrollAnimationEnhanced';

export function MyPage() {
  return (
    <SplineScrollAnimationEnhanced
      scene="/animations/my-animation.splinecode"
      title="Interactive 3D Experience"
      description="Scroll to explore"
    />
  );
}
```

#### With Custom Animations:
```jsx
<SplineScrollAnimationEnhanced
  scene="/animations/my-animation.splinecode"
  title="Innovation in Motion"
  description="Experience AI-powered marketing"

  // Choose animation preset
  animationPreset="spiral"  // Options: rotate, scale, float, spiral, bounce

  // Target specific objects from your Spline scene
  targetObjects={[
    "MainObject",
    "CameraTarget",
    "DirectionalLight"
  ]}

  // Custom animation parameters
  customAnimations={{
    radius: 2,
    height: 3,
    frequency: 2,
    amplitude: 1.5
  }}

  // Scroll trigger settings
  scrollTriggerOptions={{
    start: "top 20%",
    end: "bottom 80%",
    scrub: 1.5
  }}

  // Performance optimization
  enableMobileOptimization={true}
  showPerformanceIndicator={false}
/>
```

---

## 🎭 Animation Presets

Your component supports 5 built-in animation presets:

### 1. **Rotate** (Default)
```jsx
animationPreset="rotate"
```
- Smooth rotation based on scroll
- X, Y, Z axis rotation
- Perfect for product showcases

### 2. **Scale**
```jsx
animationPreset="scale"
```
- Dynamic scaling with bounce
- Great for attention-grabbing

### 3. **Float**
```jsx
animationPreset="float"
```
- Wave-like floating motion
- Ideal for organic movement

### 4. **Spiral**
```jsx
animationPreset="spiral"
customAnimations={{ radius: 2, height: 3 }}
```
- Complex spiral motion path
- Excellent for hero sections

### 5. **Bounce**
```jsx
animationPreset="bounce"
```
- Physics-like bouncing
- Perfect for playful interactions

---

## 🎯 Finding Object Names in Spline

To target specific objects for animation:

### In Spline Editor:
1. Select an object in your scene
2. Look at the **"Layers"** panel (left side)
3. The object name is shown there
4. Use exact names in `targetObjects` array

### Example:
If your Spline scene has objects named:
- "Cube"
- "Sphere"
- "MainCamera"
- "PointLight"

Use them like this:
```jsx
targetObjects={[
  "Cube",
  "Sphere",
  "MainCamera",
  "PointLight"
]}
```

---

## 🔧 Advanced Configuration

### Custom Object Animations
```jsx
<SplineScrollAnimationEnhanced
  scene="/your-scene.splinecode"
  animationPreset="custom"
  targetObjects={["MainObject"]}

  onLoad={(splineApp) => {
    // Get reference to your object
    const mainObj = splineApp.findObjectByName("MainObject");

    // Create custom GSAP animation
    gsap.to(mainObj.position, {
      x: 100,
      y: 50,
      z: 0,
      scrollTrigger: {
        trigger: ".container",
        start: "top center",
        end: "bottom center",
        scrub: true
      }
    });
  }}
/>
```

### Multiple Objects with Different Animations
```jsx
targetObjects={["Object1", "Object2", "Object3"]}

onLoad={(splineApp) => {
  const obj1 = splineApp.findObjectByName("Object1");
  const obj2 = splineApp.findObjectByName("Object2");
  const obj3 = splineApp.findObjectByName("Object3");

  // Different animation for each
  gsap.to(obj1.rotation, { x: Math.PI * 2, scrollTrigger: {...} });
  gsap.to(obj2.scale, { x: 2, y: 2, z: 2, scrollTrigger: {...} });
  gsap.to(obj3.position, { y: 100, scrollTrigger: {...} });
}}
```

---

## 📱 Mobile Optimization

The component automatically optimizes for mobile:

```jsx
// Enable automatic mobile optimization
enableMobileOptimization={true}
```

**What it does:**
- Reduces animation complexity
- Lowers rendering quality
- Checks battery level
- Monitors network speed
- Adjusts frame rate

**Manual Control:**
```jsx
<SplineScrollAnimationEnhanced
  enableMobileOptimization={true}

  // Force specific quality settings
  onLoad={(splineApp) => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Reduce quality for mobile
      splineApp.setQuality('low');
    }
  }}
/>
```

---

## 🐛 Troubleshooting

### Issue: Animation Not Loading

**Check:**
1. ✅ File path is correct
2. ✅ File is in `public/` folder
3. ✅ Path starts with `/` (e.g., `/my-animation.splinecode`)

```jsx
// ✅ Correct
scene="/animations/my-scene.splinecode"

// ❌ Incorrect
scene="animations/my-scene.splinecode"  // Missing leading /
scene="../public/my-scene.splinecode"   // Wrong path
```

### Issue: Objects Not Animating

**Check:**
1. ✅ Object names match exactly (case-sensitive)
2. ✅ Objects exist in Spline scene
3. ✅ `targetObjects` array is correct

```jsx
// Check exact names in Spline "Layers" panel
targetObjects={["Cube", "Camera"]}  // Must match exactly
```

### Issue: Poor Performance

**Solutions:**
```jsx
// 1. Enable mobile optimization
enableMobileOptimization={true}

// 2. Reduce number of animated objects
targetObjects={["MainObject"]}  // Animate fewer objects

// 3. Increase scrub value (slower = better performance)
scrollTriggerOptions={{ scrub: 2 }}

// 4. Simplify Spline scene
// - Reduce polygon count
// - Optimize textures
// - Remove unnecessary objects
```

---

## 🎬 Alternative: Creating Animations with GSAP Timeline

If you want to create **code-based animations** instead of Spline 3D:

### Using GSAP Timeline Directly:
```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CustomAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1
      }
    });

    // Add animations to timeline
    tl.to(".box", { x: 100, duration: 1 })
      .to(".box", { y: 100, duration: 1 })
      .to(".box", { rotation: 360, duration: 1 });

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="box">Animated Element</div>
    </div>
  );
}
```

---

## 📚 Resources

- **Spline Documentation**: https://docs.spline.design/
- **GSAP ScrollTrigger**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Your Integration Guide**: `src/components/shared/SplineIntegrationGuide.md`
- **Animation Hooks**: `src/hooks/useScrollAnimation.js`

---

## ✅ Quick Checklist

Before deploying your Spline animation:

- [ ] Exported `.splinecode` file from Spline
- [ ] Placed file in `public/` folder
- [ ] Used correct file path (starts with `/`)
- [ ] Checked object names in Spline editor
- [ ] Tested on mobile devices
- [ ] Enabled mobile optimization
- [ ] Verified performance (60fps target)
- [ ] Added fallback images for errors

---

**Need help?** Check `SplineIntegrationGuide.md` for more details!