import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  // GitHub Pages serves project repos under /<repo>/; the deploy workflow sets this
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    // `npm run analyze` → dist/stats.html treemap of every chunk
    process.env.ANALYZE && visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: true }),
  ],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 600, // three.js is intentionally one lazy chunk
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // vendor splitting: heavy libs get their own long-cacheable chunks
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/three/')) return 'three'
          if (id.includes('motion')) return 'motion'
          if (id.includes('react')) return 'react'
        },
      },
    },
  },
})
