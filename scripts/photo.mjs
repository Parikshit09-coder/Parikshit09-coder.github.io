// Usage: npm run photo path/to/photo.(png|jpg)
// Produces AVIF / WebP / JPEG at 640, 1080 and 1600px in public/img/.
// Transparent cut-outs keep their alpha in AVIF/WebP; the JPEG fallback is
// flattened onto the page background. Transparent margins are trimmed.
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'

const src = process.argv[2]
if (!src) {
  console.error('usage: npm run photo <path-to-photo>')
  process.exit(1)
}
await rm('public/img', { recursive: true, force: true })
await mkdir('public/img', { recursive: true })

// trim empty edges, then leave a little headroom above the subject
const trimmed = await sharp(src).rotate().trim().png().toBuffer({ resolveWithObject: true })
const headroom = Math.round(trimmed.info.height * 0.06)
const base = await sharp(trimmed.data)
  .extend({ top: headroom, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

const widths = [640, 1080, 1600]
const formats = {
  avif: (s) => s.avif({ quality: 55, effort: 6 }),
  webp: (s) => s.webp({ quality: 78, alphaQuality: 90 }),
  jpg: (s) => s.flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true, progressive: true }),
}

for (const w of widths)
  for (const [ext, enc] of Object.entries(formats)) {
    const out = `public/img/me-${w}.${ext}`
    const info = await enc(sharp(base).resize({ width: w, withoutEnlargement: true })).toFile(out)
    console.log(`✔ ${out.padEnd(26)} ${(info.size / 1024).toFixed(0).padStart(5)} KB`)
  }
