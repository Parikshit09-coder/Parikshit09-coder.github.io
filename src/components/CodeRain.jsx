import { useEffect, useRef } from 'react'
import { useInViewport } from '../hooks/useInViewport'

const TOKENS = '01{}[]()<>=;:/*+-_$#&|!?constletfnasyncawaitreturnimportdefselfnullλ∑∂'.split('')

/**
 * Matrix-style rain made of code glyphs. Plain 2D canvas, capped at ~30fps,
 * DPR clamped, and fully paused when offscreen or the tab is hidden.
 */
export default function CodeRain({ className = '', color = '242,90,28', fontSize = 14 }) {
  const canvasRef = useRef(null)
  const visible = useInViewport(canvasRef)

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w, h, cols, drops, raf, last = 0

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / fontSize)
      drops = Array.from({ length: cols }, () => Math.random() * -h / fontSize)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (document.hidden || t - last < 33) return
      last = t
      // fade previous frame toward transparent (works on any background)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < cols; i++) {
        const ch = TOKENS[(Math.random() * TOKENS.length) | 0]
        const y = drops[i] * fontSize
        ctx.fillStyle = Math.random() > 0.975 ? 'rgba(10,10,10,0.8)' : `rgba(${color},${0.35 + Math.random() * 0.4})`
        ctx.fillText(ch, i * fontSize, y)
        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.55
      }
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [visible, color, fontSize])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />
}
