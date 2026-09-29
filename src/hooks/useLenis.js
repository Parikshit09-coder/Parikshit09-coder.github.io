import { useEffect } from 'react'
import Lenis from 'lenis'

let lenis = null
export const getLenis = () => lenis

export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let id
    const raf = (t) => {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenis = null
    }
  }, [enabled])
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
