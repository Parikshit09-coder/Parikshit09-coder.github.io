# Performance & optimization notes

What this portfolio does to stay fast, and why. Each point names where it lives in the code.

## Loading & bundling

| Technique | What it does | Where |
|---|---|---|
| **Per-section code splitting** | Each section (`Hero`, `About`, …) is a separate chunk loaded with `React.lazy` + `Suspense`. The entry bundle is ~12.5 kB gzip. | `src/App.jsx` |
| **Vendor chunking** | `react`, `motion` and `three` get their own chunks. The hashed filenames stay the same across deploys, so returning visitors keep them cached. | `vite.config.js` → `manualChunks` |
| **Lazy 3D** | three.js is only requested on desktop, and only when reduced motion is off. Phones never download it. | `src/sections/Hero.jsx` |
| **Tree-shaken three.js** | Replaced React Three Fiber (which imports the whole `three` namespace) with named imports in plain three.js. The three chunk went from **240 kB → 130 kB gzip**. | `src/components/NeuralField.jsx` |
| **A loader that does real work** | The boot screen starts every chunk, font and image request in parallel. Each log line shows the real duration and transfer size, read from the browser's **Resource Timing API** (`performance.getEntriesByType('resource')`). | `src/components/Loader.jsx` |
| **Shorter loader on repeat visits** | `sessionStorage` flag makes the loader 4× faster within a session; any key skips it. `?boot=0` disables it for Lighthouse runs. | `Loader.jsx`, `App.jsx` |
| **Bundle analysis** | `npm run analyze` opens a treemap of every chunk with gzip and brotli sizes. | `rollup-plugin-visualizer` |
| **Immutable caching** | Hashed `/assets/*` are served with `Cache-Control: max-age=31536000, immutable`. | `vercel.json` |

## Images

| Technique | What it does | Where |
|---|---|---|
| **AVIF → WebP → JPEG** | A `<picture>` element offers each format so the browser picks the smallest one it supports. | `src/components/Portrait.jsx` |
| **Responsive `srcset`** | 640 / 1080 / 1600 px widths with `sizes`, so phones don't download desktop-sized images. | `Portrait.jsx` |
| **Build-time image pipeline** | The background was removed with an on-device ML model (`@imgly/background-removal-node`), which leaves a transparent cut-out. `npm run photo <file>` then uses **sharp** to trim empty edges, resize, and encode AVIF/WebP with transparency plus a flattened mozjpeg fallback. The 510 kB original becomes a **42 kB AVIF (−92%)**. | `scripts/photo.mjs` |
| **Grayscale in CSS, not in the file** | The photo is stored in colour and greyed out with a CSS `filter`, so hovering can fade it back to colour without a second image download. | `Hero.jsx` |
| **LCP preload** | `<link rel="preload" as="image" imagesrcset=… fetchpriority="high">` fetches the hero photo in parallel with the JS. | `index.html` |
| **Fonts** | `preconnect` to Google Fonts + `display=swap`, so text is never invisible while fonts load. | `index.html` |

## Runtime / rendering

| Technique | What it does | Where |
|---|---|---|
| **Viewport-gated animation loops** | WebGL and canvas loops stop completely when scrolled offscreen (`IntersectionObserver`) and when the tab is hidden (`document.hidden`). | `useInViewport.js`, `NeuralField.jsx`, `CodeRain.jsx` |
| **Device-pixel-ratio cap** | Canvases render at ≤1.5× device pixel ratio. On 3× phones that is roughly 4× fewer pixels. | `NeuralField.jsx`, `CodeRain.jsx` |
| **Frame throttling** | Code rain draws at ~30 fps. That's plenty for the effect and uses half the CPU. | `CodeRain.jsx` |
| **Build geometry once** | The neural-net points and edges are computed once. Each frame only updates a rotation. | `NeuralField.jsx` |
| **No re-renders on mousemove** | Cursor, parallax and card tilt use Motion's `useMotionValue`/`useSpring`, which write transforms directly and never trigger a React render. | `Cursor.jsx`, `Hero.jsx`, `Projects.jsx` |
| **Observers instead of scroll handlers** | The active nav item comes from one shared `IntersectionObserver`. No `scroll` listeners. | `useActiveSection.js` |
| **Passive listeners** | Pointer listeners are `{ passive: true }`. | `Cursor.jsx`, `NeuralField.jsx` |
| **GPU-friendly animation** | Only `transform`, `opacity` and `clip-path` are animated, so nothing triggers a layout. | throughout |
| **`useSyncExternalStore` for media queries** | Tear-free subscription to `matchMedia`. | `useMediaQuery.js` |
| **Resource cleanup** | WebGL geometries, materials and the renderer are disposed on unmount. | `NeuralField.jsx` |

## Accessibility

- `prefers-reduced-motion` turns off 3D, code rain, smooth scroll and the custom cursor, and collapses CSS animations.
- The custom cursor only appears on devices with a fine pointer that can hover (not on touch screens).
- The loader is a polite live region, and nav buttons have ARIA labels. Mask-reveal headings keep their full text in `aria-label`.
