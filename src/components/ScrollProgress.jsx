import { motion, useScroll, useSpring, useTransform } from 'motion/react'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const pct = useTransform(scrollYProgress, (v) => `${String(Math.round(v * 100)).padStart(3, '0')}%`)
  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-acid" />
      <motion.span className="fixed bottom-6 left-(--gx) z-50 hidden font-mono text-[11px] text-dim md:block">
        {pct}
      </motion.span>
    </>
  )
}
