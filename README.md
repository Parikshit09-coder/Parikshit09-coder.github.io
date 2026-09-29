# Portfolio

React 19 · Vite · Tailwind v4 · Motion · three.js · Lenis

```bash
npm install
npm run dev              # http://localhost:5173
npm run build && npm run preview
npm run photo me.jpg     # generate optimized portrait into public/img/
npm run analyze          # bundle treemap
```

- **Content:** edit `src/data/portfolio.js`. All text, links, projects, etc. live there.
- **Resume:** drop `resume.pdf` into `public/`.
- **Deploy:** push to GitHub → import on Vercel (zero config; `vercel.json` sets cache headers).

See [OPTIMIZATIONS.md](OPTIMIZATIONS.md) for the performance write-up.
