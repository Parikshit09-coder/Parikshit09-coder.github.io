import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'

export default function CountUp({ to, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (ref.current.textContent = v.toFixed(decimals) + suffix),
    })
    return () => c.stop()
  }, [inView, to, suffix, decimals])
  return <span ref={ref}>{(0).toFixed(decimals)}{suffix}</span>
}
