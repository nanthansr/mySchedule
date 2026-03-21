# HANDOFF — Portfolio Redesign (Superwhisper-Inspired)

> Load this file only. Everything a fresh agent needs is here.

---

## The Task

Redesign `/Users/nanthansr/Personal_Projects/mySchedule/portfolio.html` to match the visual language and interaction design of **superwhisper.com**.

The file is a **pure static single HTML file** — no framework, no bundler, no npm. All CSS and JS live inside `<style>` and `<script>` tags. This is a hard constraint from `CLAUDE.md`.

---

## What the User Actually Wants (from screenshots they shared)

The user shared 9 screenshots of superwhisper.com. The design is **NOT glassmorphism**. It is:

1. **Pure black (#000000) background** — literally black, not dark blue
2. **Scroll-driven hero collapse** — the hero (full-viewport atmospheric gradient with big text) fades + scales as you scroll. Simultaneously, a floating rounded card (their "demo video" card) rises up from below on the black background. The nav is invisible at first and materialises as a frosted pill only after scrolling.
3. **Mixed-weight typography** — the signature move. In the same headline, some words are bright white (`#fff`) and others are dim gray (`rgba(255,255,255,0.32)`). Example: "Works **anywhere** you can type" where "Works" and "you can type" are dim, "anywhere" is white.
4. **Horizontal scrolling feature cards** — large (360×440px), each with its own dark-gradient tinted background (dark blue, dark maroon, dark teal, etc.), scroll-snapped. A small top glow blob in each card's accent color.
5. **Split section with terminal mockup** — text on the left, a macOS-style terminal/code window on the right (like their "Faster agentic workflows" section showing Claude Code running). Has blinking cursor.
6. **Auto-cycling project tiles with progress bar dots** — horizontal pill dots at the bottom. Active dot is wider (~68px vs 28px). A white bar fills across the active dot over 5 seconds then jumps to the next. Title/subtitle above updates. User can click any dot to jump. This is the tutorial section pattern from superwhisper.
7. **Section labels** — small monospace uppercase text in cyan (`#4B9EFF`), e.g. "What I Build", "Projects", "Experience".
8. **No glassmorphism** — superwhisper does NOT use `backdrop-filter: blur()`. Cards have flat dark backgrounds with subtle colored gradients.

---

## What Has Been Done (Current State of the File)

The file `/Users/nanthansr/Personal_Projects/mySchedule/portfolio.html` has already been **fully rewritten** with this architecture. It is in a working state. From the screenshot the user shared, the hero looks correct — "I'm a / Builder." in huge Syne 800 typography on an indigo/purple atmospheric gradient.

### What Works ✅

- **Hero**: Full-viewport atmospheric gradient (dark indigo → midnight blue → near-black), huge mixed-weight typography, "SCROLL" hint with animated line, hero content animates in with blur-fade on load
- **Scroll collapse**: `scroll` event handler — hero fades + scales (`opacity: 1-p`, `scale(1-p*0.04)`) as you scroll, hero card rises with `.visible` class toggle
- **Nav**: Invisible pill (`opacity:0; pointer-events:none`) until scroll, then materialises with `backdrop-filter` and border
- **Horizontal skill cards**: 5 cards with `overflow-x: auto; scroll-snap-type: x mandatory` — Cloud (dark blue), ML (dark purple), Languages (dark green), Tools (dark amber), Certs (dark gold). Each has a top radial glow blob.
- **Split About section**: 2-column grid, left = text + bullet points, right = terminal mockup with macOS dots, yellow/green/blue coloured terminal lines, blinking cursor animation
- **Project carousel with progress dots**: 3 slides auto-cycle every 5s. `fillProg` keyframe fills white bar. Dot expands from 28px to 68px when active. Title + subtitle update on change. Click dot to jump.
- **Experience timeline**: 2-column grid on black, em-dash bullets, dot connector
- **Life grid**: 4-column grid, flat dark cards (`#111`), icon spins on hover
- **Contact**: Simple, clean on black
- **Theme toggle**: `localStorage` key `nanthan_theme_v1` preserved and working
- **Reveal animations**: IntersectionObserver with `translateY(30px)` → `0` + opacity
- **Custom cursor**: White dot + ring, expands on hover

### What Doesn't Look Right Yet ❌ (Next Agent's Job)

From the screenshot the user shared after the rewrite, these issues are visible:

1. **Hero background is too dark blue-purple** — it should feel more like the superwhisper dusk sky: warmer, more atmospheric, with a visible gradient from deep indigo at top to near-black at bottom. The current version is too uniformly dark and purple-heavy. Consider making it richer — more contrast between the top color and the black bottom.

2. **The hero card ("Featured Project") is not visible in the screenshot** — this is the floating card that should appear when you scroll past the hero. It may not be triggering at the right scroll position, or the `hero-card-wrap` / positioning isn't working correctly as a sticky element. The DOM structure is: `hero-wrap` (100vh), then `hero-card-wrap > hero-card`. The card uses `opacity:0` → `opacity:1` on `.visible` class. Check that the scroll threshold (currently `sy > 100`) is correct and that the card is actually visible in the viewport after scrolling.

3. **The nav is barely visible in the screenshot** — it shows as a small thin bar at top right. This might be a mobile/zoom issue, but verify the pill nav appears correctly and is centred.

4. **The horizontal skill cards section needs verification** — the screenshot cuts off before showing it. Check that the cards scroll horizontally and snap correctly.

5. **Visual polish still needed**: The superwhisper screenshots show much more dramatic section transitions. Currently sections just appear on scroll. Could add more "breathing room" between sections and make the mixed-weight headings more impactful.

---

## File Location

```
/Users/nanthansr/Personal_Projects/mySchedule/portfolio.html
```

All changes go here. Single file. No other files need editing.

---

## Hard Constraints (from CLAUDE.md)

- No framework, no bundler — pure HTML/CSS/JS only
- No external JS libraries (no jQuery, no GSAP, no lodash) — vanilla JS only
- No backend — client-side only
- No new files unless clearly required
- No TypeScript — plain JS inside `<script>` tags
- Design tokens for portfolio.html must NOT be mixed with other pages

---

## Current Design Tokens in the File

```css
--bg:       #000000;
--surface:  #111111;
--surface2: #1a1a1a;
--border:   rgba(255,255,255,0.1);
--accent:   #4B9EFF;       /* cyan — section labels */
--accent2:  #e8865a;       /* copper — personal brand */
--accent3:  #f0c040;       /* yellow — terminal code */
--text:     #ffffff;
--text-m:   rgba(255,255,255,0.55);
--text-d:   rgba(255,255,255,0.28);
--dim:      rgba(255,255,255,0.32);  /* for mixed-weight headings */
--font-disp:'Syne', sans-serif;
--font-body:'Space Grotesk', sans-serif;
--font-mono:'DM Mono', monospace;
--r:        16px;
--r-lg:     24px;
```

---

## Key JS Architecture

### Scroll Handler
```js
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const p = Math.min(sy / 380, 1);
  heroWrap.style.opacity   = String(1 - p);
  heroWrap.style.transform = `scale(${1 - p * 0.04})`;
  heroCard.classList.toggle('visible', sy > 100);
  nav.classList.toggle('scrolled', sy > 60);
}, { passive: true });
```

### Project Carousel
```js
// goTo(idx) — switches slide, resets and restarts fillProg animation on active dot
// setInterval(next, 5000) — auto-advances
// dots[i].addEventListener('click') — manual jump
```

### Theme Toggle
```js
// Key: 'nanthan_theme_v1' in localStorage
// Toggles data-theme="light" on <html>
// DO NOT break this — user relies on it
```

---

## The Superwhisper Design Language (Reference Summary)

**Background:** Pure `#000` black throughout the page body, except the hero section which has an atmospheric gradient.

**Hero gradient (reference):**
```css
background: linear-gradient(170deg, #0a0520 0%, #0d1a3a 28%, #1a0f2e 58%, #050505 100%);
/* + radial gradient blobs for atmospheric glow */
```

**Mixed-weight heading pattern:**
```html
<h2 class="mixed-heading">
  <span class="dim">Powerful skills,</span><br />
  seamlessly delivered.
</h2>
/* .dim = rgba(255,255,255,0.32) */
/* bright = #ffffff (default) */
```

**Feature card structure:** `flex: 0 0 340px; height: 420px` inside `overflow-x: auto; scroll-snap-type: x mandatory` container.

**Progress dots:**
- Inactive: `width: 28px; height: 4px; background: rgba(255,255,255,0.18)`
- Active: `width: 68px` + `.prog-fill` animates `width: 0% → 100%` over 5s via `@keyframes fillProg`

**Nav pill:** Only visible after scroll. `backdrop-filter: blur(20px)`. Centered with `left:50%; transform:translateX(-50%)`.

---

## Sections in Order (Current HTML)

1. `#home` — hero-wrap (100vh atmospheric gradient)
2. `.hero-card-wrap > .hero-card` — floating featured project card (scroll-activated)
3. `#skills` — horizontal scroll feat-track with 5 feat-cards
4. `.split-section#about` — grid: text left + terminal mockup right
5. `.section-projects#projects` — auto-cycling carousel + progress dots
6. `.wrap-sm#experience` — timeline + volunteering + education grid
7. `.wrap-sm#life` — life grid + journal moments grid
8. `#contact` — simple text + contact pills
9. `footer`

---

## Remaining Visual Work for Next Agent

Priority order:

1. **Fix hero card visibility** — open the file in a browser, scroll slowly. The `.hero-card` should smoothly rise up at ~100px scroll. If it doesn't appear, check: (a) `hero-card-wrap` has `background: var(--bg)` so it's visible, (b) the `.visible` class is being toggled, (c) the card's `transition` property is working.

2. **Hero background polish** — the current gradient works but could be richer. Superwhisper's hero felt like a real dusk sky photo — deepen the blues, add a subtle warm amber glow at the bottom (the copper accent), make the top-to-bottom gradient more dramatic.

3. **Add a "Works anywhere you build" section** — between skills and about, add a simple centred section with a large mixed-weight headline (like superwhisper's "Works anywhere you can type") and below it, a row of tech logos or tool icons (Docker, GCP, AWS, FastAPI, MLflow, etc.) displayed as simple icon+name pills. This section is missing and was in the original plan.

4. **Section spacing** — superwhisper has very generous vertical padding between sections (~180-200px). Currently sections may feel cramped. Increase `padding: 8rem 5vw` to `padding: 10rem 5vw` on major sections.

5. **The life grid journal section** — add a `section-label` for it (currently just has `.m-label` which is a different smaller style).

6. **Mobile check** — verify the hero collapse works on mobile (where scroll behaviour can differ), the horizontal skill cards scroll with touch, and the progress dots are large enough to tap.

---

## What NOT to Do

- Do NOT add glassmorphism (`backdrop-filter: blur()` on cards) — superwhisper doesn't use it
- Do NOT use any JS libraries (no GSAP, no ScrollReveal)
- Do NOT break the `nanthan_theme_v1` localStorage theme toggle
- Do NOT add new HTML files
- Do NOT touch `index.html`, `projects.html`, `mlops-career.html`, etc.

---

## How to Test

```bash
# Open directly in browser
open /Users/nanthansr/Personal_Projects/mySchedule/portfolio.html
```

1. Hero shows full-screen atmospheric gradient with huge "I'm a / Builder." text
2. Scroll slowly — hero fades + scales, floating project card rises, nav pill appears
3. Continue scrolling — horizontal skill cards section (can drag/swipe left)
4. About section — terminal mockup visible on right, cursor blinks
5. Projects — dots auto-advance every 5s, title changes, bar fills
6. Theme toggle button (top right in nav) switches light/dark mode
7. Mobile (resize to 375px) — nav collapses to "Menu" button, hero text resizes
