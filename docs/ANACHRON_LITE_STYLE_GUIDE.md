# ANACHRON Lite Style Guide
## Minimal Vector Icons & Graphics System

**Version:** 1.0
**Last Updated:** 2025-09-29
**Purpose:** Lightweight visual system for icons, badges, dividers, and UI graphics that harmonize with ANACHRON fine-art style through simplified, geometric, Greco-Roman inspired design.

---

## Table of Contents

1. [Visual DNA](#visual-dna)
2. [Core Principles](#core-principles)
3. [Color System](#color-system)
4. [Grid & Stroke Standards](#grid--stroke-standards)
5. [Ancient Icon Library](#ancient-icon-library)
6. [Composition Rules](#composition-rules)
7. [Prompt Templates](#prompt-templates)
8. [Example Prompts](#example-prompts)
9. [Usage Guidelines](#usage-guidelines)
10. [Technical Specifications](#technical-specifications)

---

## Visual DNA

**At a glance:**
- **Geometry:** Sacred geometry roots (circle, triangle, square), golden ratio (φ), 1:√2 ratios, 24px base grid
- **Line:** Rounded caps/joins, uniform **2px stroke weight**, aligned to even pixels
- **Fill:** Minimal—rely on linework + limited flat fills with subtle texture
- **Palette:** Ivory, ink black, terracotta, lapis/azure, verdigris bronze, muted gold
- **Motifs:** Greek key (meander), laurel, acanthus, columns, amphora, astrolabe, scroll, wave, sun ray, mosaic tesserae, circuit patterns
- **Texture:** Subtle paper/fresco grain, faint gold-leaf sheen (optional)
- **Background:** Always transparent unless explicitly specified otherwise

---

## Core Principles

### 1. Vector Simplicity
- **Uniform 2px stroke** across all elements
- Rounded caps (`stroke-linecap: round`)
- Rounded joins (`stroke-linejoin: round`)
- Balanced geometric construction
- Align to pixel grid to avoid blur

### 2. Ancient Motif Vocabulary
Draw from Greco-Roman visual language:
- **Laurel** - achievement, honor
- **Meander (Greek key)** - continuity, connection
- **Columns** - foundation, strength
- **Amphora** - storage, tradition
- **Astrolabe** - navigation, precision
- **Scroll** - knowledge, documentation
- **Oracle Eye** - vision, intelligence
- **Waves** - flow, adaptability
- **Mosaic Tesserae** - data, composition
- **Circuit Meander** - technology, systems

### 3. Sacred Geometry
- Central symmetry preferred
- Circles, squares, triangles as foundational shapes
- Golden ratio (φ ≈ 1.618) proportions
- 12/24px grid system
- Balanced negative space

### 4. Restricted Palette
Use **1-2 accent colors** maximum per icon:
- **Ivory** for backgrounds (when not transparent)
- **Ink** for primary linework
- **One accent** from: terracotta, lapis, verdigris, or gold

### 5. Minimal Surface Treatment
- Rely on clean linework first
- Optional: subtle fresco/paper grain texture
- Tasteful: 1-2 tiny gold-leaf accent nodes
- No gradients, no 3D rendering, no photorealism

### 6. Transparent Backgrounds
Unless explicitly creating a badge or emblem with background:
- Always specify transparent background
- Export with alpha channel
- PNG or SVG format

### 7. Emblematic Tone
- Solemn, timeless, dignified
- No parody, no kitsch
- No modern brand aesthetics
- Keep forms calm and geometric

---

## Color System

### Color Tokens

| Token | Hex | RGB | Usage |
|---|---|---|---|
| **Ivory** | `#F3EFE6` | `243, 239, 230` | Backgrounds, paper base |
| **Ink** | `#1F1B17` | `31, 27, 23` | Primary linework, strokes |
| **Terracotta** | `#C96F4C` | `201, 111, 76` | Warm accents, fills |
| **Lapis** | `#2C6BAA` | `44, 107, 170` | Cool accents, links |
| **Verdigris** | `#3C7A6A` | `60, 122, 106` | Secondary accent, aged bronze |
| **Gold** | `#C9A53B` | `201, 165, 59` | Gilded highlights (minimal use) |
| **Shadow** | `#877F73` | `135, 127, 115` | Soft shadows, aging effects |

### Color Usage Rules

**Do:**
- Use ink (#1F1B17) for all primary strokes
- Select ONE accent color per icon (terracotta, lapis, or verdigris)
- Add gold sparingly (1-2 small nodes maximum)
- Maintain AA contrast (≥3:1) against backgrounds

**Don't:**
- Mix multiple accent colors in single icon
- Use neon or oversaturated colors
- Apply gradients or color transitions
- Add complex color overlays

### Dark Mode Adaptation
For dark backgrounds:
- Invert: ivory ↔ ink
- Keep accent colors at 80-90% opacity
- Maintain contrast ratios
- Test against `#1F1B17` background

---

## Grid & Stroke Standards

### Base Grid System
- **Primary grid:** 24×24 px
- **Scaling factors:** 2x (48px), 3x (64px), 4x (96px), 8x (192px)
- **Stroke weight:** Always 2px (do not scale stroke when scaling canvas)
- **Corner radii:** 2px increments only
- **Alignment:** Endpoints on even pixels to prevent blur

### Stroke Standards
```css
stroke: var(--ink); /* #1F1B17 */
stroke-width: 2;
stroke-linecap: round;
stroke-linejoin: round;
fill: none; /* default, add fills selectively */
```

### Canvas Sizes

| Use Case | Canvas | Stroke | Export |
|---|---|---|---|
| Tiny UI icon | 24×24px | 2px | 1x, 2x |
| Small icon | 48×48px | 2px | 1x, 2x |
| Standard icon | 64×64px | 2px | 1x, 2x, 3x |
| Large icon | 128×128px | 2px | 1x, 2x |
| Feature icon | 256×256px | 2px | 1x, 2x |
| Divider | 1024×128px | 2px | 1x, 2x |

---

## Ancient Icon Library

### Core Motifs & Meanings

#### 1. **Laurel / Wreath**
- **Meaning:** Achievement, success, honor, victory
- **Use cases:** Awards, certifications, achievements, premium features
- **Form:** Circular or semi-circular arrangement of stylized leaves
- **Accent:** Terracotta leaves with ink outline

#### 2. **Meander (Greek Key)**
- **Meaning:** Continuity, connection, eternal flow, structure
- **Use cases:** Dividers, borders, navigation elements, process flows
- **Form:** Interlocking rectangular spiral pattern
- **Accent:** Lapis or terracotta against ink

#### 3. **Column (Doric/Ionic)**
- **Meaning:** Foundation, strength, architecture, stability
- **Use cases:** Infrastructure, foundations, core services
- **Form:** Capital (top) or full column in profile
- **Accent:** Verdigris or terracotta for fluting

#### 4. **Amphora**
- **Meaning:** Storage, containment, preservation, tradition
- **Use cases:** Database, storage, archive, resources
- **Form:** Classic two-handled vessel silhouette
- **Accent:** Lapis stripe or terracotta body

#### 5. **Astrolabe**
- **Meaning:** Navigation, discovery, precision, astronomy
- **Use cases:** Analytics, exploration, targeting, strategic planning
- **Form:** Concentric rings with pointer
- **Accent:** Gold pointer with lapis rings

#### 6. **Scroll**
- **Meaning:** Knowledge, documentation, wisdom, records
- **Use cases:** Documentation, blogs, articles, knowledge base
- **Form:** Rolled papyrus with visible rods
- **Accent:** Terracotta rods with ink outlines

#### 7. **Oracle Eye**
- **Meaning:** Vision, insight, intelligence, AI, foresight
- **Use cases:** AI features, insights, analytics, vision
- **Form:** Stylized eye with geometric iris
- **Accent:** Gold iris with ink outline

#### 8. **Wave / Sea Pattern**
- **Meaning:** Flow, adaptability, natural process, rhythm
- **Use cases:** Workflows, processes, adaptability features
- **Form:** Stylized Greek wave motif
- **Accent:** Lapis waves with ink outline

#### 9. **Mosaic Tessera Grid**
- **Meaning:** Data, pixels, composition, individual units forming whole
- **Use cases:** Data visualization, dashboards, grids, collections
- **Form:** 3×3 or 4×4 grid of small squares
- **Accent:** Terracotta and lapis tiles alternating

#### 10. **Handshake (Human + Automaton)**
- **Meaning:** Partnership, collaboration, human-AI interaction
- **Use cases:** Partnerships, integrations, collaborations
- **Form:** Two hands clasping, one human, one stylized robotic
- **Accent:** Terracotta human, lapis automaton

#### 11. **Obsidian Slab**
- **Meaning:** Interface, screen, portal, gateway
- **Use cases:** Interfaces, dashboards, screens, portals
- **Form:** Rounded rectangle with inner frame
- **Accent:** Lapis or verdigris inner glow effect

#### 12. **Circuit Meander**
- **Meaning:** Technology, connectivity, systems, networks
- **Use cases:** Technology features, connections, APIs, networks
- **Form:** Greek key pattern with node dots at corners
- **Accent:** Lapis lines with terracotta nodes

---

## Composition Rules

### Geometric Framework

**Sacred Geometry Base:**
- Start with circle, square, or triangle
- Use phi ratio (1:1.618) for proportions
- Maintain central symmetry where possible
- Balance positive and negative space equally

**Grid Alignment:**
- Snap anchor points to 24px grid
- Align stroke edges to even pixels
- Use 2px, 4px, 6px, 8px increments for spacing
- Keep minimum clearance of 4px from canvas edges

**Visual Weight:**
- Balance stroke density across canvas
- Avoid clustering all detail in one quadrant
- Use symmetry to distribute visual weight
- Leave breathing room (negative space)

### Stroke Application

**Line Quality:**
```css
stroke-width: 2px;
stroke-linecap: round;
stroke-linejoin: round;
vector-effect: non-scaling-stroke; /* keeps 2px at all scales */
```

**Do:**
- Maintain consistent 2px throughout single icon
- Use rounded caps for all line endings
- Use rounded joins for all corners
- Align strokes to pixel boundaries

**Don't:**
- Mix stroke weights (1px, 2px, 3px) in same icon
- Use square or butt caps
- Use miter joins (creates sharp points)
- Allow anti-aliased blur from misalignment

### Fill Strategy

**Minimal Fill Approach:**
1. **Primary:** Linework only (no fill)
2. **Secondary:** Strategic fills in 1-2 areas
3. **Tertiary:** Tiny accent nodes/dots

**Fill Rules:**
- Use flat colors only (no gradients)
- Limit to 1-2 filled areas per icon
- Maintain stroke visibility on filled shapes
- Keep fills lighter or darker than stroke for contrast

---

## Prompt Templates

### Standard Icon Prompt
```
Minimal ancient-style icon of a {motif}, drawn with consistent 2px ink (#1F1B17) stroke on 24px grid, rounded caps and joins, {accent color} fill/accent, centered composition with sacred geometry symmetry, flat vector illustration style, subtle ivory paper texture (#F3EFE6), transparent background, clean edges, high contrast, emblematic and timeless, 1:1 aspect ratio. Ancient Greco-Roman aesthetic, geometric simplicity, no text, professional icon design.

Negative: neon, plastic, modern logos, 3D render, gradients, photorealism, cartoon, oversaturation, noisy background, complex scene, text
```

### Badge Prompt
```
Circular badge of a {motif} with meander border pattern, 2px ink stroke, {color1} + {color2} accents, flat vector illustration, transparent background, sacred geometry symmetry, centered composition, ancient emblematic style, subtle fresco texture, 1:1 aspect ratio.

Negative: neon, modern branding, 3D effects, gradients, text, watermark
```

### Divider Prompt
```
Horizontal Greek key meander divider pattern, consistent 2px ink (#1F1B17) stroke, {accent color} highlights at intersections, ivory paper background with subtle texture, transparent edges, minimal flat vector style, geometric precision, 8:1 aspect ratio.

Negative: noisy background, 3D depth, gradients, uneven strokes, modern style
```

### Emblem Prompt
```
{Motif} emblem with laurel wreath accents, 2px ink stroke, {color} strategic fills, circular or shield composition, sacred geometry foundation, transparent background, flat ancient icon style, subtle gold-leaf accent nodes (1-2 max), emblematic and dignified, 1:1 aspect ratio.

Negative: cartoon, modern logos, plastic, neon, complex scene, gradients
```

---

## Example Prompts

### Example 1: AI Service Icon (Oracle Eye)
```
**Logline:** Oracle eye icon representing AI insight and intelligence

**Context:**
- Purpose: Service icon for AI features
- Concept: Vision, intelligence, foresight
- Motif: Oracle eye with geometric iris
- Size: 64px
- Placement: Feature grid on services page

**Final Prompt:**
Minimal ancient-style icon of an oracle eye, 2px ink (#1F1B17) stroke with gold (#C9A53B) geometric iris accent, centered on 24px grid, rounded caps and joins, sacred geometry circle foundation, flat vector illustration, subtle paper texture, transparent background, clean edges, emblematic style, 1:1 aspect ratio. Single stylized eye with triangular or geometric iris pattern, simple and iconic, Ancient Greco-Roman aesthetic.

**Negative:** neon, plastic, modern logos, 3D render, gradients, photorealism, cartoon, complex details, multiple eyes, text

**Render Controls:**
- Aspect: 1:1
- Size: 64×64px
- Style: Flat vector, transparent PNG with alpha
```

### Example 2: Knowledge Base Icon (Scroll)
```
**Logline:** Scroll icon for documentation and knowledge resources

**Context:**
- Purpose: Navigation icon for docs section
- Concept: Knowledge, wisdom, documentation
- Motif: Rolled scroll with terracotta rods
- Size: 48px
- Placement: Navigation menu

**Final Prompt:**
Minimal ancient-style icon of a rolled papyrus scroll, 2px ink (#1F1B17) stroke with terracotta (#C96F4C) accent rods on ends, centered on 24px grid, rounded caps and joins, flat vector illustration, transparent background, sacred geometry rectangular composition, clean edges, 1:1 aspect ratio. Simple scroll shape showing top and bottom rods, emblematic ancient motif.

**Negative:** neon, modern style, 3D effects, text content, gradients, complex details, photorealism

**Render Controls:**
- Aspect: 1:1
- Size: 48×48px
- Style: Flat vector, transparent PNG
```

### Example 3: Technology Feature Icon (Circuit Meander)
```
**Logline:** Circuit-style Greek key representing technology and connectivity

**Context:**
- Purpose: Technology feature marker
- Concept: Connectivity, systems, digital infrastructure
- Motif: Greek key pattern with circuit nodes
- Size: 64px
- Placement: Feature section icons

**Final Prompt:**
Greek key meander pattern styled as circuit traces, 2px lapis (#2C6BAA) stroke with small terracotta (#C96F4C) circular nodes at pattern corners, drawn on 24px grid with rounded caps and joins, flat vector illustration, transparent background, sacred geometry grid, clean geometric pattern, 1:1 aspect ratio. Ancient meander motif reimagined as technology schematic, minimal and iconic.

**Negative:** neon, modern PCB style, 3D depth, gradients, complex circuitry, text labels, photorealism

**Render Controls:**
- Aspect: 1:1
- Size: 64×64px
- Style: Flat vector, transparent PNG
```

### Example 4: Section Divider (Horizontal Meander)
```
**Logline:** Greek key horizontal divider for section separation

**Context:**
- Purpose: Visual divider between page sections
- Concept: Continuity, structure, flow
- Motif: Greek key meander pattern
- Size: 1024×128px
- Placement: Between homepage sections

**Final Prompt:**
Horizontal Greek key meander divider pattern, consistent 2px ink (#1F1B17) stroke, repeating geometric pattern across width, centered vertically, ivory paper background (#F3EFE6) with subtle texture, transparent top/bottom edges, flat vector style, clean geometric precision, 8:1 aspect ratio. Ancient border motif, minimal and elegant.

**Negative:** noisy background, 3D effects, gradients, uneven stroke weight, modern styling, text

**Render Controls:**
- Aspect: 8:1
- Size: 1024×128px
- Style: Flat vector, PNG with transparency on edges
```

### Example 5: Partnership Badge (Handshake)
```
**Logline:** Human-AI handshake emblem for partnership features

**Context:**
- Purpose: Partnership/collaboration badge
- Concept: Human-AI cooperation
- Motif: Handshake with human + automaton hands
- Size: 128px
- Placement: Partnership page hero

**Final Prompt:**
Circular badge with meander border, center shows minimal handshake between human hand and stylized automaton hand, 2px ink (#1F1B17) stroke, terracotta (#C96F4C) for human hand, lapis (#2C6BAA) for automaton hand, flat vector illustration, transparent background, sacred geometry circle composition, subtle paper texture, emblematic ancient style, 1:1 aspect ratio. Two hands clasping in center, simple geometric forms.

**Negative:** neon, modern branding, 3D render, photorealistic hands, complex details, gradients, text

**Render Controls:**
- Aspect: 1:1
- Size: 128×128px
- Style: Flat vector, transparent PNG
```

### Example 6: Data Visualization Icon (Mosaic Tessera)
```
**Logline:** Mosaic tile grid representing data and composition

**Context:**
- Purpose: Data visualization feature icon
- Concept: Data, individual pieces forming whole
- Motif: 3×3 mosaic tessera grid
- Size: 64px
- Placement: Analytics dashboard

**Final Prompt:**
Minimal 3×3 grid of mosaic tesserae tiles, 2px ink (#1F1B17) stroke outlines, alternating terracotta (#C96F4C) and lapis (#2C6BAA) flat fills, centered on 24px grid, flat vector illustration, transparent background, sacred geometry square foundation, clean edges, geometric precision, 1:1 aspect ratio. Simple tile pattern, emblematic ancient mosaic motif.

**Negative:** neon, 3D tiles, shadows, gradients, complex patterns, photorealism, modern pixel aesthetic

**Render Controls:**
- Aspect: 1:1
- Size: 64×64px
- Style: Flat vector, transparent PNG
```

---

## Usage Guidelines

### When to Use ANACHRON Lite

**Perfect for:**
- ✅ Service icons in feature grids
- ✅ Navigation menu icons
- ✅ Section dividers and decorative borders
- ✅ Badge and emblem graphics
- ✅ UI accent elements
- ✅ Feature markers and indicators
- ✅ Small decorative graphics (< 256px)

**Not suitable for:**
- ❌ Hero images or large storytelling scenes
- ❌ Photographs or realistic imagery
- ❌ Complex illustrations with figures
- ❌ Detailed environmental scenes
- ❌ Marketing banners (use ANACHRON Full)

### Size Recommendations

| Context | Recommended Size | Stroke | Notes |
|---|---|---|---|
| Navigation icon | 24×24px | 2px | Tiny, clear silhouette required |
| Service icon | 48×48px | 2px | Standard UI icon size |
| Feature icon | 64×64px | 2px | Most common use case |
| Large icon | 128×128px | 2px | Feature pages, detailed view |
| Hero emblem | 256×256px | 2px | Large decorative element |
| Divider | 1024×128px | 2px | Section separation |

### Accessibility Standards

**Contrast:**
- Minimum 3:1 contrast ratio for strokes against backgrounds
- Test ink (#1F1B17) against ivory (#F3EFE6): 8.9:1 ✓
- Test ink against white (#FFFFFF): 12.6:1 ✓

**Size:**
- Minimum functional size: 16×16px
- Recommended minimum: 24×24px
- Ideal target size: 44×44px (for touch targets)

**Clarity:**
- Shape should be recognizable from silhouette alone
- No crucial information conveyed only by color
- Maintain readability when scaled down

### Do's and Don'ts

**✅ Do:**
- Keep forms geometric and calm
- Use 1-2 accent colors maximum
- Apply meander borders to frame complex compositions
- Use negative space generously
- Align to pixel grid for crispness
- Export with transparent backgrounds
- Test at target display size
- Provide 1x, 2x, 3x exports for retina displays

**❌ Don't:**
- Mix multiple stroke weights in one icon
- Use neon gradients or glossy effects
- Add modern brand logos or glyphs
- Create dense, complex patterns
- Tell stories (keep emblematic, not narrative)
- Add unnecessary detail
- Use mismatched geometry styles
- Forget transparent background requirement

---

## Technical Specifications

### File Formats

**Primary: SVG**
```svg
<svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Color variables -->
    <style>
      :root {
        --ink: #1F1B17;
        --terracotta: #C96F4C;
        --lapis: #2C6BAA;
        --gold: #C9A53B;
      }
    </style>
    <!-- Optional paper texture filter -->
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feComposite in="SourceGraphic" in2="noise" operator="over" result="composite"/>
      <feBlend in="SourceGraphic" in2="composite" mode="multiply" opacity="0.05"/>
    </filter>
  </defs>

  <!-- Icon content -->
  <g stroke="var(--ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Icon paths here -->
  </g>
</svg>
```

**Secondary: PNG with Alpha**
- Export at 1x, 2x, 3x for retina support
- Transparent background (alpha channel)
- 24-bit color depth minimum
- Optimize with tools like TinyPNG

### CSS Integration

```css
/* Icon base styles */
.anachron-icon {
  stroke: var(--ink, #1F1B17);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  width: 64px;
  height: 64px;
}

/* Accent variations */
.anachron-icon--terracotta {
  fill: var(--terracotta, #C96F4C);
}

.anachron-icon--lapis {
  fill: var(--lapis, #2C6BAA);
}

.anachron-icon--verdigris {
  fill: var(--verdigris, #3C7A6A);
}

.anachron-icon--gold {
  fill: var(--gold, #C9A53B);
}

/* Responsive sizing */
.anachron-icon--small { width: 24px; height: 24px; }
.anachron-icon--medium { width: 48px; height: 48px; }
.anachron-icon--large { width: 128px; height: 128px; }
```

### React Component Example

```jsx
import React from 'react';

export const AnachronIcon = ({
  icon = 'laurel',
  size = 64,
  accent = 'terracotta',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`anachron-icon anachron-icon--${accent} ${className}`}
      aria-label={`${icon} icon`}
      role="img"
    >
      <use href={`#anachron-${icon}`} />
    </svg>
  );
};
```

### Generation Settings

**OpenAI gpt-image-1:**
```javascript
{
  model: 'gpt-image-1',
  size: '1024x1024', // always square for icons
  quality: 'high',
  prompt: '[ANACHRON Lite prompt]',
  response_format: 'b64_json' // for transparent backgrounds
}
```

**Google Gemini 2.5 Flash Image:**
```javascript
{
  model: 'gemini-2.5-flash-image-preview',
  aspectRatio: '1:1',
  contents: '[ANACHRON Lite prompt with explicit transparent background requirement]'
}
```

**Replicate Flux 1.1 Pro:**
```javascript
{
  model: 'black-forest-labs/flux-1.1-pro',
  aspect_ratio: '1:1',
  num_outputs: 1,
  guidance_scale: 3.5, // lower for flat vector style
  num_inference_steps: 40,
  prompt: '[ANACHRON Lite prompt]'
}
```

---

## Quick Reference Card

**Formula:**
```
2px stroke + rounded caps/joins + sacred geometry +
ancient motif + 1-2 accents + transparent background +
flat vector style + minimal detail
```

**Essential Vocab:**
`2px stroke`, `rounded caps and joins`, `flat vector`, `transparent background`, `sacred geometry`, `ancient motif`, `minimal`, `geometric`, `emblematic`, `centered`, `1:1 aspect`

**Key Negatives:**
`neon`, `3D render`, `gradients`, `photorealism`, `modern logos`, `plastic`, `complex scene`, `noisy background`, `text`

**Color Codes:**
- Ink: `#1F1B17`
- Terracotta: `#C96F4C`
- Lapis: `#2C6BAA`
- Gold: `#C9A53B`
- Ivory: `#F3EFE6`

**Sizes:**
- Tiny: 24px
- Small: 48px
- Standard: 64px
- Large: 128px
- Hero: 256px

---

## Roadmap

### Phase 1: Core Icon Set (Current)
- 16 essential icons covering primary use cases
- Documentation and prompt templates
- Integration with ANACHRON agent

### Phase 2: Expanded Library
- 32 additional icons for comprehensive coverage
- Animated variants (CSS/GSAP)
- Sacred-geometry loading spinner
- Icon sprite sheet system

### Phase 3: Spot Illustrations
- Micro-illustrations (320-640px canvases)
- Page-specific decorative graphics
- Section header illustrations
- Expanded divider patterns

### Phase 4: Interactive Elements
- Hover states with GSAP
- Click/tap feedback animations
- Loading state variations
- Status indicator icons

---

## Contact & Support

For questions about ANACHRON Lite implementation:
- Review this style guide thoroughly
- Check Example Prompts for similar use cases
- Consult Ancient Icon Library for motif meanings
- Reference agent specification in `.claude/agents/anachron-art-director.md`

**Related Files:**
- `.claude/agents/anachron-art-director.md` - Agent specification with both Full and Lite workflows
- `docs/ANACHRON_STYLE_GUIDE.md` - Full painterly style documentation
- `generated/anachron/` - Generated asset library
- `docs/IMAGE_GENERATION_API_GUIDE.md` - API integration details

---

**End of ANACHRON Lite Style Guide v1.0**