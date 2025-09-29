# 📦 Spline Export Tutorial - Step by Step

## What You Need to Know First

**Spline** = 3D animation tool (like Blender but easier, web-based)
**Your animation in Spline** = A 3D scene with objects, cameras, lights, and animations

---

## 🎯 How to Export from Spline.dev

### **Method 1: Download File (RECOMMENDED)**

#### Step 1: Open Your Animation
1. Go to https://spline.design
2. Open your animation project

#### Step 2: Export the File
1. Look at the **top right** corner
2. Click the **"Export"** button (looks like an upload icon ⬆️)
3. You'll see a dropdown menu with options

#### Step 3: Choose Download Option
```
Export Menu Options:
├── 📥 Download
│   ├── .splinecode (React/Web) ← USE THIS ONE ✅
│   ├── .spline (For Spline Editor)
│   └── Image/Video
├── 🔗 Get Code (For developers)
└── 📤 Publish (For public sharing)
```

4. Click **"Download"** → **".splinecode (React/Web)"**
5. Your file will download (e.g., `scene.splinecode`)
6. Rename it to something descriptive (e.g., `hero-animation.splinecode`)

#### Step 4: Add to Your Project
```bash
# Move the file to your project's public folder
C:\Users\Will\OneDrive\Documents\Projects\dm4\disruptors-ai-marketing-hub\public\

# Example file path:
public/hero-animation.splinecode
```

#### Step 5: Use in Your Code
```jsx
import SplineScrollAnimationEnhanced from '@/components/shared/SplineScrollAnimationEnhanced';

function HeroSection() {
  return (
    <SplineScrollAnimationEnhanced
      scene="/hero-animation.splinecode"
      title="Your Animation Title"
      animationPreset="spiral"
    />
  );
}
```

---

### **Method 2: Get Public Link (EASIER but slower)**

#### Step 1: Publish to Spline Cloud
1. In Spline editor, click **"Export"**
2. Click **"Publish"** or **"Get Link"**
3. Spline will generate a public URL

#### Step 2: Copy the URL
You'll get a URL like:
```
https://prod.spline.design/abc123xyz/scene.splinecode
```

#### Step 3: Use URL Directly
```jsx
<SplineScrollAnimationEnhanced
  scene="https://prod.spline.design/abc123xyz/scene.splinecode"
  title="Your Animation"
/>
```

**Pros:** No file management
**Cons:** Depends on Spline servers, slower loading

---

### **Method 3: Embed Code (For Simple Cases)**

#### Step 1: Get Embed Code
1. Click **"Export"** → **"Get Code"**
2. Choose **"React"**
3. Copy the code snippet

#### Step 2: It Looks Like This:
```jsx
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <Spline scene="https://prod.spline.design/abc123xyz/scene.splinecode" />
  );
}
```

#### Step 3: Use Our Enhanced Version Instead
```jsx
// DON'T use the basic Spline component
// USE our enhanced version with scroll animations:

import SplineScrollAnimationEnhanced from '@/components/shared/SplineScrollAnimationEnhanced';

<SplineScrollAnimationEnhanced
  scene="https://prod.spline.design/abc123xyz/scene.splinecode"
  animationPreset="spiral"
/>
```

---

## 🎭 What Each Export Format Does

| Export Type | What It Is | When to Use |
|------------|------------|-------------|
| **.splinecode** | Compressed 3D scene for web | ✅ **Use this for React** |
| **.spline** | Editable project file | Only for reopening in Spline editor |
| **Get Code** | React/HTML embed code | Quick embed, but basic |
| **Publish** | Public URL to scene | Sharing, no file downloads |
| **Image/Video** | Static export | Fallbacks, thumbnails |

---

## 📝 Important Notes

### File Naming
```bash
# ✅ Good names
hero-animation.splinecode
product-showcase.splinecode
floating-objects.splinecode

# ❌ Avoid
scene.splinecode (too generic)
animation 1.splinecode (spaces cause issues)
```

### File Location
```bash
# ✅ Correct location
public/hero-animation.splinecode

# ❌ Wrong locations
src/hero-animation.splinecode (won't work)
public/animations/hero.splinecode (needs matching path in code)
```

### Usage in Code
```jsx
// If file is: public/hero-animation.splinecode
scene="/hero-animation.splinecode"  // ✅ Correct

// If file is: public/animations/hero-animation.splinecode
scene="/animations/hero-animation.splinecode"  // ✅ Correct

// Wrong paths
scene="hero-animation.splinecode"  // ❌ Missing leading /
scene="../public/hero.splinecode"  // ❌ Wrong path style
```

---

## 🔍 Finding Object Names in Your Spline Scene

When you want to animate specific objects:

### In Spline Editor:
1. Look at the **left sidebar** (Layers panel)
2. You'll see a list of all objects in your scene:
   ```
   📦 Scene
   ├── 🎯 MainObject
   ├── 📷 Camera
   ├── 💡 DirectionalLight
   ├── ⭕ Sphere
   └── 📦 Cube
   ```

3. Use these exact names in your code:
   ```jsx
   targetObjects={[
     "MainObject",
     "Camera",
     "DirectionalLight",
     "Sphere",
     "Cube"
   ]}
   ```

**Important:** Names are **case-sensitive**!
- "Cube" ✅
- "cube" ❌
- "CUBE" ❌

---

## 🎬 Complete Working Example

### Your Spline Scene:
- File: `hero-animation.splinecode`
- Objects: "Logo", "Camera", "PointLight"

### Your React Code:
```jsx
import SplineScrollAnimationEnhanced from '@/components/shared/SplineScrollAnimationEnhanced';

export function Hero() {
  return (
    <div className="hero-section">
      <SplineScrollAnimationEnhanced
        scene="/hero-animation.splinecode"
        title="Welcome to Disruptors AI"
        description="Scroll to explore our innovation"

        // Animate these specific objects
        targetObjects={[
          "Logo",
          "Camera",
          "PointLight"
        ]}

        // Choose animation style
        animationPreset="spiral"

        // Custom spiral settings
        customAnimations={{
          radius: 2,
          height: 3
        }}

        // Scroll behavior
        scrollTriggerOptions={{
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1.5
        }}

        // Optimize for mobile
        enableMobileOptimization={true}
      />
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Problem: "Scene failed to load"
**Solution:**
1. Check file path starts with `/`
2. Verify file is in `public/` folder
3. Check browser console for errors
4. Try using public URL instead

### Problem: "Objects not animating"
**Solution:**
1. Check object names match exactly (case-sensitive)
2. Look in Spline Layers panel for exact names
3. Verify objects exist in your scene

### Problem: "Slow loading"
**Solution:**
1. Optimize your Spline scene (reduce polygons)
2. Compress textures in Spline
3. Use `.splinecode` format (not `.spline`)
4. Enable mobile optimization

---

## 📚 Quick Reference

### File Extensions Explained
- `.splinecode` = Compressed web format (USE THIS) ✅
- `.spline` = Editable project file (DON'T USE for web)
- `.glb/.gltf` = Not available from Spline currently

### Where Files Go
```
your-project/
├── public/
│   ├── hero-animation.splinecode ← YOUR FILE HERE
│   └── product-showcase.splinecode
├── src/
│   └── components/
│       └── Hero.jsx ← USE FILE HERE
```

### How to Reference
```jsx
// File: public/hero-animation.splinecode
scene="/hero-animation.splinecode"

// File: public/animations/hero.splinecode
scene="/animations/hero.splinecode"
```

---

## ✅ Checklist Before Using

- [ ] Exported `.splinecode` file from Spline
- [ ] Renamed file to something descriptive
- [ ] Placed file in `public/` folder
- [ ] Used correct path in `scene` prop (starts with `/`)
- [ ] Noted object names from Layers panel
- [ ] Added object names to `targetObjects` array
- [ ] Tested loading in browser

---

## 🚀 What's Next?

After exporting:
1. Visit `http://localhost:5177` to test
2. Check browser console for any errors
3. Adjust animation settings as needed
4. Optimize for performance

Need help with a specific step? Let me know!