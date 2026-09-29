import { useEffect, useState } from 'react'

// Tracks visibility so expensive loops (WebGL, canvas) can pause when offscreen.
export function useInViewport(ref, rootMargin = '0px') {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return visible
}
