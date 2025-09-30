# Disruptors Media Old Website Analysis
## Complete Technical Breakdown for Recreation

**Site URL**: https://info.disruptorsmedia.com
**Analysis Date**: 2025-09-30
**Analysis Method**: Playwright automated browser analysis with JavaScript inspection

---

## Executive Summary

The old Disruptors Media website features a **minimalist, brutalist design** with heavy use of **custom CSS animations**, **infinite scrolling marquees**, and **fade-in-up effects** triggered on scroll. The site uses **NO major animation libraries** (no GSAP, no Framer Motion, no AOS) - all animations are implemented with **pure CSS** and **vanilla JavaScript**.

Key characteristics:
- Dark theme with light text (#F1EDE9 on dark backgrounds)
- Monospace font (PP Supply Mono) mixed with bold sans-serif (OT Neue Montreal)
- Uppercase text styling throughout
- Horizontal infinite scrolling carousels for services
- Minimal hover effects with translateY transforms
- Grid overlay aesthetic with technical/cyberpunk elements

---

## 1. HEADER ANALYSIS

### Layout & Structure
- **Tag**: `<header>` with class `"header"`
- **Height**: 96px
- **Position**: Static
- **Background**: Transparent (`rgba(0, 0, 0, 0)`)
- **Padding**: 23px all sides

### Logo
- **Source**: `https://admin.disruptorsmedia.com/header_logos/Disrupting.png`
- **Dimensions**: 203px × 46px
- **Position**: Left-aligned
- **Margin/Padding**: 0px
- **No animation** on logo

### Navigation
- **Item Count**: 5 navigation links
- **Display**: `inline-block`
- **Font**: PP Supply Mono, 16px, weight 400
- **Text Color**: `#F1EDE9` (rgb(241, 237, 233))
- **Padding per link**: 5px 3px 2px
- **Margin**: 0px (15px horizontal spacing likely from container)
- **Class**: Each link has class `"shuffle"`
- **Text Transform**: None (appears to be natural case in this section)

#### Navigation Items (in order):
1. **Work** - /Work
2. **Services** - /Services
3. **About** - /About
4. **Podcast** - /Podcast
5. **Gallery** - /Gallery

### Header Styling Details
```css
.header {
  position: static;
  background-color: transparent;
  padding: 23px;
  height: 96px;
}

.header .navigation li {
  display: inline-block;
  font-family: "PP Supply Mono";
  font-size: 16px;
  font-weight: 400;
  color: rgb(241, 237, 233);
  margin: 0 15px;
  padding: 5px 3px 2px;
}
```

### Interactive Elements
- **Hover Effect**: Likely a subtle color or underline animation (class `"shuffle"` suggests character scramble effect)
- **No sticky header** - remains static on scroll
- **Responsive**: Likely collapses to mobile menu at smaller breakpoints

---

## 2. FOOTER ANALYSIS

### Layout & Structure
- **Tag**: `<footer>` with class `"footer"`
- **Height**: 183px
- **Background**: Transparent
- **Padding**: 85px 30px 40px
- **Display**: Block (not grid)
- **Text Color**: `#333333` (rgb(51, 51, 51))
- **Font**: PP Supply Mono, 16px, weight 400, uppercase

### Footer Sections (3 columns)

#### Left Column (`.col-sm-4`)
**Copyright & Address**
```
©2024 Disruptors Media inc.
650 N Main St, North Salt Lake, UT 84054
```
- Font: PP Supply Mono, 16px, uppercase
- Color: rgb(43, 43, 43)
- Line height: 1.8

#### Center Column (`.col-sm-4 .text-center`)
**Social Media Icons**
- 4 social media links with SVG icons
- Platforms: Twitter/X, TikTok, YouTube, Instagram
- **Links**:
  - Twitter: https://twitter.com/DisruptorsMedia
  - TikTok: https://www.tiktok.com/@disruptorsmedia
  - YouTube: https://www.youtube.com/channel/UCIS7eKSZMJWnUT1dTLBjOWA
  - Instagram: https://www.instagram.com/disruptorsmedia_
- Styled as inline list items

#### Right Column (`.col-sm-4 .text-right`)
**Technical/Scrambled Text**
- GPS coordinates: `40.853400, -111.911790` (with scrambled effect `40.853400, -111.9$A&=£`)
- Load address text: `"Load Address: 034526-01, I