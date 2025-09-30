# Disruptors Media Website Analysis
**URL:** https://info.disruptorsmedia.com
**Analysis Date:** 2025-09-30

---

## 1. HEADER STRUCTURE

### Layout & Dimensions
- **Height:** 96px
- **Position:** Static (non-sticky)
- **Background:** Transparent (rgba(0, 0, 0, 0))
- **Padding:** 23px all sides
- **Z-Index:** auto

### Logo
- **Image Source:** `https://admin.disruptorsmedia.com/header_logos/Disrupting.png`
- **Dimensions:** 203.422px × 46px
- **Position:** x: 279px, y: 48px (from top-left)
- **Alt Text:** "Logo"

### Navigation Menu Items (in order)
1. **Home** (empty text, logo link)
2. **Work**
3. **Services**
4. **About**
5. **Podcast**
6. **Gallery**
7. **Book a Call**

### Navigation Styling
- **Font Family:** "PP Supply Mono" (monospace)
- **Font Size:** 16px (desktop), 20px (mobile menu)
- **Font Weight:** 400 (regular)
- **Text Color:** rgb(241, 237, 233) - Off-white/cream
- **Link Color (default):** rgb(51, 122, 183) - Blue
- **Hover Behavior:** Not detected in static analysis

### Navigation Layout
- **Type:** Horizontal layout
- **Alignment:** Appears to be right-aligned based on positioning
- **Mobile Menu:** Separate mobile navigation detected with larger font (20px)
- **Responsive Behavior:** Desktop and mobile versions present

---

## 2. FOOTER STRUCTURE

### Layout
- **Display:** Block
- **Grid/Flex:** Not using CSS Grid (gridTemplateColumns: none)
- **Columns:** 3-column layout using Bootstrap classes (col-sm-4)
- **Padding:** 85px (top) 30px (sides) 40px (bottom)
- **Background:** Transparent (rgba(0, 0, 0, 0))
- **Text Color:** rgb(51, 51, 51) - Dark gray

### Footer Sections

#### Section 1 (Left Column)
- **Classes:** `col-sm-4`
- **Content:** Empty or text-only content (no links detected)

#### Section 2 (Center Column)
- **Classes:** `col-sm-4 text-center`
- **Content:** Social Media Links
  1. Twitter: https://twitter.com/DisruptorsMedia
  2. TikTok: https://www.tiktok.com/@disruptorsmedia
  3. YouTube: https://www.youtube.com/channel/UCIS7eKSZMJWnUT1dTLBjOWA
  4. Instagram: https://www.instagram.com/disruptorsmedia_

#### Section 3 (Right Column)
- **Classes:** `col-sm-4 text-right`
- **Content:** Empty or text-only content (no links detected)

### Social Media Icons
- **Total Icons Found:** 2-4 icons (SVG or image format)
- **Placement:** Centered in middle footer column
- **Platforms:** Twitter, TikTok, YouTube, Instagram

### Copyright/Legal
- **Status:** No copyright text detected in footer
- **Notes:** May be present in a non-standard location or format

---

## 3. SCROLL ANIMATIONS

### Animation Library Detection
- **Primary Library:** Custom JavaScript animations (possibly vanilla JS or lightweight library)
- **React/Framer Detected:** Transform styles suggest React-based animations
- **GSAP:** Not detected in loaded scripts
- **No external animation libraries** explicitly loaded

### CSS Keyframe Animations Defined

#### 1. **@keyframes scroll**
```css
0% { transform: translateX(0px); }
100% { transform: translateX(-100%); }
```
- **Purpose:** Horizontal scrolling/marquee effect
- **Usage:** Likely for client logos or text scrollers
- **Direction:** Right to left

#### 2. **@keyframes slide-to-left**
```css
100% { transform: translateX(-50%); }
```
- **Purpose:** Slide animation to the left
- **Usage:** Element entrance animations
- **Distance:** 50% of element width

#### 3. **@keyframes fadeIn**
```css
0% { opacity: 0; }
100% { opacity: 1; }
```
- **Purpose:** Basic fade-in effect
- **Usage:** General element reveals
- **Opacity Range:** 0 to 1

#### 4. **@keyframes App-logo-spin**
```css
0% { transform: rotate(0deg); }
100% { transform: rotate(1turn); }
```
- **Purpose:** Continuous rotation
- **Usage:** Logo or loading animations
- **Rotation:** Full 360° (1 turn)

---

## 4. SCROLL-TRIGGERED BEHAVIORS

### Main Banner Section (scroll: 0px)
**Element:** `<section class="main-banner">`
- **Trigger:** Page load
- **Position:** Top of page (y: 146px)
- **Transform:** none
- **Opacity:** 1
- **Transition:** all (duration not specified)
- **Behavior:** Static at page top, scrolls out of view normally

### Hero Image Animation
**Element:** Large hero/brand image
- **Initial State (0px scroll):**
  - Position: y: 318px
  - Transform: none
  - Opacity: 1

- **No special animation detected** - appears to scroll naturally

### Video Unmask Section
**Element:** `<section class="image-unmask">`
- **Initial State (0px):**
  - Position: y: 1034px
  - Transform: matrix(1, 0, 0, 1, 0, 0) - no transformation
  - Opacity: 1

- **At 3500px scroll:**
  - Position: y: -466px (out of viewport)
  - Transform: matrix(1, 0, 0, 1, 0, 2000) - **translateY(2000px)**
  - **Key Animation:** Moves down 2000px as user scrolls down
  - **Effect:** Parallax/counter-scroll effect (moves opposite to scroll)

### Rotating Image Element
**Location:** Mid-page scrolling image
- **At 2000px scroll:**
  - Transform: matrix(0.962963, 0.269633, -0.269633, 0.962963, 0, 0)
  - **Rotation:** ~15-20 degrees (derived from matrix values)
  - **Opacity:** 1 (fully visible)

- **At 2500px scroll:**
  - Transform: matrix(2.88656, 1.57314, -1.57314, 2.88656, 0, 0)
  - **Rotation:** ~60 degrees + scale increase
  - **Opacity:** 0.2375 (fading out)
  - **Scale:** 2.88656x (almost 3x larger)

- **At 3000px scroll:**
  - Transform: matrix(3.4641, 2, -2, 3.4641, 0, 0)
  - **Rotation:** ~90 degrees + larger scale
  - **Opacity:** 0 (completely invisible)
  - **Scale:** 3.4641x (max scale)

**Animation Summary:**
- **Trigger:** Enters viewport around 2000px scroll
- **Duration:** ~1000px of scroll distance
- **Effect:** Rotates 90° clockwise while scaling 3.5x and fading to invisible
- **Easing:** Appears smooth (transition: all)
- **Type:** Scroll-linked transform animation

### Services Section
**Element:** `<section class="who-we-do hme">`
- **Appears at:** 3500px scroll position
- **Position:** y: 614px (in viewport)
- **Animation:** Fade-in/slide-up effect (standard entrance)
- **Child Elements:** Multiple `<h3>` tags for service names
  - Digital
  - Videography
  - Strategy
  - Social Media
  - Branding
  - Podcast

**Service Cards Animation:**
- **All h3 elements positioned at:** y: 994px initially
- **Transform:** none
- **Opacity:** 1
- **Likely Behavior:** Staggered fade-in as section enters viewport
- **Note:** Multiple duplicate elements suggest carousel or slider

---

## 5. KEY ANIMATION PATTERNS

### Pattern 1: Parallax Scrolling
- **Elements:** `.image-unmask` section
- **Behavior:** Moves in opposite direction to scroll (translateY +2000px)
- **Scroll Range:** 0-3500px
- **Speed:** Slower than natural scroll

### Pattern 2: Rotate + Scale + Fade Out
- **Elements:** Decorative images
- **Behavior:**
  - Rotation: 0° → 90° over 1000px scroll
  - Scale: 1x → 3.5x
  - Opacity: 1 → 0
- **Trigger:** Mid-page (2000-3000px scroll)
- **Easing:** Smooth/linear (CSS transition: all)

### Pattern 3: Fade In
- **Elements:** Section headers, cards, text blocks
- **Keyframe:** `@keyframes fadeIn`
- **Duration:** Not specified (likely 300-600ms)
- **Trigger:** Element enters viewport

### Pattern 4: Horizontal Marquee
- **Elements:** Logo sliders, text scrollers
- **Keyframe:** `@keyframes scroll`
- **Behavior:** Continuous right-to-left movement
- **Transform:** translateX(0) → translateX(-100%)
- **Loop:** Infinite

### Pattern 5: Slide-to-Left
- **Elements:** Menu items, cards
- **Keyframe:** `@keyframes slide-to-left`
- **Distance:** 50% of element width
- **Usage:** Entrance animations

---

## 6. TECHNICAL IMPLEMENTATION

### Animation Approach
- **Primarily:** Custom JavaScript with CSS transitions
- **Transform Property:** Heavily used for GPU-accelerated animations
- **Transition:** `all` applied to most animated elements (not best practice, but simple)
- **Matrix Transforms:** Used for complex rotation + scale combinations

### Performance Considerations
- **GPU Acceleration:** Using `transform` and `opacity` (good)
- **Transition All:** Applied globally (could be optimized to specific properties)
- **Transform Matrix:** Efficient for complex transformations

### Browser Compatibility
- **Modern Standards:** Uses standard CSS transforms and transitions
- **Fallbacks:** Not detected (likely not needed for target audience)

---

## 7. ANIMATION TIMING ESTIMATES

Based on observed behaviors:

### Fade In Animations
- **Duration:** ~400-600ms (estimated)
- **Easing:** Likely `ease-in-out` or `ease-out`
- **Delay:** Staggered by 100-150ms per element

### Parallax Movements
- **Speed:** 0.5x scroll speed (slower than natural scroll)
- **Smoothness:** Frame-synchronized (60fps target)

### Rotation Effect
- **Duration:** Tied to scroll (1000px scroll distance)
- **Easing:** Linear or custom ease
- **Performance:** Smooth matrix transformation

### Horizontal Marquee
- **Duration:** 10-20 seconds per cycle (estimated)
- **Easing:** Linear (continuous loop)
- **Animation:** `animation: scroll Xs linear infinite`

---

## 8. VIEWPORT TRIGGER POINTS

Based on scroll analysis:

| Scroll Position | Elements Triggered | Animation Type |
|----------------|-------------------|----------------|
| 0px | Main banner, logo, hero image | Static/Initial |
| 500-1000px | Video section enters | Parallax start |
| 1500-2000px | Rotating image enters | Rotate begins |
| 2000-2500px | Rotating image peak | Max rotation/fade |
| 3000px | Rotating image exits | Invisible |
| 3500px | Services section | Fade-in cards |
| 4000px+ | Additional services | Staggered reveals |

---

## 9. RECOMMENDATIONS FOR REPLICATION

### To recreate these animations on dm4.wjwelsh.com:

1. **Use GSAP ScrollTrigger** for scroll-linked animations
   - More precise control than CSS
   - Better performance
   - Built-in scrubbing

2. **Implement these specific effects:**
   ```javascript
   // Parallax section
   gsap.to('.image-unmask', {
     y: 2000,
     scrollTrigger: {
       trigger: '.image-unmask',
       start: 'top bottom',
       end: 'bottom top',
       scrub: 1
     }
   });

   // Rotate + Scale + Fade
   gsap.to('.decorative-image', {
     rotation: 90,
     scale: 3.5,
     opacity: 0,
     scrollTrigger: {
       trigger: '.decorative-image',
       start: 'center bottom',
       end: 'center top',
       scrub: 1
     }
   });

   // Fade in cards (staggered)
   gsap.from('.service-card', {
     opacity: 0,
     y: 50,
     stagger: 0.15,
     scrollTrigger: {
       trigger: '.services-section',
       start: 'top 80%'
     }
   });
   ```

3. **Use CSS keyframes for:**
   - Horizontal marquees (logo scrollers)
   - Continuous animations (loading spinners)
   - Simple fade-ins not tied to scroll

4. **Typography:**
   - Adopt "PP Supply Mono" or similar monospace font for nav
   - Maintain consistent 16px nav font size
   - Use off-white (rgb(241, 237, 233)) for nav text

5. **Header/Footer Structure:**
   - Keep header simple, transparent, 96px height
   - Use 3-column footer with centered social links
   - Bootstrap grid classes for responsive layout

---

## 10. ANIMATION LIBRARY USED

**Conclusion:** The site appears to use:
- **Custom JavaScript** for scroll-triggered animations
- **CSS Transitions** for smooth property changes
- **CSS Keyframes** for looping animations
- **Transform Matrix** for complex rotations/scales
- **Possibly React** (transform styles suggest component-based)
- **NO GSAP** detected (but would be recommended for new implementation)

**Font:** PP Supply Mono (custom monospace font)

---

*End of Analysis*
