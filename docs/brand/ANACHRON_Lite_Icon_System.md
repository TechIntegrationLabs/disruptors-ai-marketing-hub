# ANACHRON Lite — Icon & Simple Graphics System
**Goal:** A lightweight visual system for site icons, spot illustrations, and UI graphics that **feel ancient** and harmonize with the ANACHRON fine‑art style—without requiring full paintings.

---

## 1) Visual DNA (at a glance)
- **Geometry:** sacred-geometry roots (circle, triangle, square), phi and 1:√2 ratios, 12/24 px grid.
- **Line:** rounded caps/joins, uniform **2px stroke** on a 24px grid (scale by factors of 2).
- **Fill:** minimal; rely on line + limited flat fills with subtle paper/fresco texture.
- **Palette:** ivory, terracotta, lapis/azure, verdigris bronze, muted gold leaf.
- **Motifs:** meander (Greek key), laurel, acanthus, columns/capitals, amphora, astrolabe, scroll, wave, sun ray, mosaic tesserae.
- **Texture:** tasteful paper/fresco grain and faint gold-leaf sheen via **SVG filters** (provided).

---

## 2) Color Tokens
| Token | Hex | Usage |
|---|---|---|
| `--ivory` | `#F3EFE6` | backgrounds / paper |
| `--ink` | `#1F1B17` | primary line work |
| `--terracotta` | `#C96F4C` | accents / fills |
| `--lapis` | `#2C6BAA` | highlights / links |
| `--verdigris` | `#3C7A6A` | secondary line/fill |
| `--gold` | `#C9A53B` | small gilded accents |
| `--shadow` | `#877F73` | soft shadow/aging |

> Keep AA contrast; for dark mode invert: ivory ↔ ink, keep terracotta/lapis/verdigris as accents at 80–90% opacity.

---

## 3) Grid & Stroke
- Base grid: **24×24 px** with 2px stroke (Round/round).  
- Corner radii: 2px increments.  
- Align endpoints to even pixels to avoid blur.  
- If using 48/64 px canvases, keep stroke = 2px (do not scale stroke) for crispness.

---

## 4) Icon Shapes (starter set)
- Laurel / Wreath  
- Meander (border or band)  
- Column (Doric/Ionic)  
- Amphora  
- Astrolabe (ring + pointer)  
- Scroll  
- Eye / Oracle  
- Wave / Sea line  
- Mosaic (3×3 tessera grid)  
- Handshake (human + automaton knuckle)  
- Obsidian slab (rounded rectangle w/ inlay)  
- Circuit meander (Greek key with node dots)

These are included in **ancient_icon_grid.svg** (symbols + sprites).

---

## 5) Ancient Surface FX (SVG)
Use the provided filters for a subtle fresco/paper effect and a gold-leaf sheen. Example usage:
```html
<svg width="64" height="64" viewBox="0 0 24 24">
  <use href="#icon-amphora" filter="url(#paper)" />
</svg>
```
Gold leaf accent:
```html
<svg width="64" height="64" viewBox="0 0 24 24">
  <g fill="url(#goldGrad)" stroke="var(--ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <use href="#icon-laurel" />
  </g>
</svg>
```

---

## 6) CSS Variables & Theme Snippet
```css
:root{
  --ivory:#F3EFE6; --ink:#1F1B17; --terracotta:#C96F4C;
  --lapis:#2C6BAA; --verdigris:#3C7A6A; --gold:#C9A53B; --shadow:#877F73;
}
.icon{ stroke:var(--ink); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; fill:none; }
.bg-paper{ background:var(--ivory); }
```
Add `filter="url(#paper)"` to apply fresco grain lightly (avoid on tiny sizes <20px).

---

## 7) Do / Don’t
**Do**
- Keep forms geometric and calm; use meander bands to frame sections.  
- Use 1–2 accents (terracotta or lapis) + tiny gold node(s).  
- Use negative space; avoid dense hatching.

**Don’t**
- No neon gradients, glossy plastic, or modern brand glyphs.  
- Don’t mix mismatched stroke weights.  
- Avoid complex storytelling in icons; keep them emblematic.

---

## 8) Micro-Illustrations (Spot Art) Rules
- Canvas 320–640 px; 2px stroke; very light flat fills.  
- Add vignette of mosaic tiles or a laurel sprig.  
- One light source; soft inner shadow (#877F73 @ 8–12% blur).  
- Optional caption in small caps with a meander divider.

---

## 9) Prompt Mini-Templates (for image models)
- **Sacred Icon:** “single emblem on ivory paper, {motif} drawn with 2px ink lines on a 24px grid, minimal terracotta fills, laurel or meander accents, subtle fresco paper texture, ancient academic engraving style, no text, centered, high contrast, clean edges, 1:1. Negative: neon, plastic, modern logos, 3D render.”
- **Badge:** “circular badge of {motif} with meander border, lapis + gold accents, flat illustration, fresco grain, 1:1.”
- **Divider:** “horizontal Greek key meander divider, consistent 2px stroke, ivory paper, slight aging, 8:1 aspect.”

---

## 10) Export Pipeline
- Source: SVG (icons) with CSS variables or fixed hex.  
- Export PNG @ 1x/2x/3x for raster needs.  
- Keep a **sprite sheet** (symbols) + `<use>` references for performance.  
- Test on dark/ivory backgrounds with the same stroke weight.

---

## 11) Accessibility
- Minimum size 16px; ideal 20–24px.  
- Maintain ≥ 3:1 contrast for strokes against backgrounds.  
- No crucial info conveyed only by color—shape should read solo.

---

## 12) Roadmap
- Phase 1: 16 core icons (included sample set).  
- Phase 2: 32 icon expansion + animated sacred-geometry loader.  
- Phase 3: Spot-art library for key pages (What We Do, Pricing, Contact).
