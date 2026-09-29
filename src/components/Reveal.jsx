import { motion } from 'motion/react'

export function Reveal({ children, delay = 0, y = 40, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

// Slides each word up from behind a mask: the editorial headline effect.
export function MaskText({ text, className = '', delay = 0, stagger = 0.06, animateNow = false }) {
  const words = text.split(' ')
  const trigger = animateNow
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } }
  return (
    <motion.span className={className} initial="hide" {...trigger} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            variants={{ hide: { y: '105%' }, show: { y: 0 } }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: [0.76, 0, 0.24, 1] }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
