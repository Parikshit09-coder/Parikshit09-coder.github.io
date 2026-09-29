import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/portfolio'
import { scrollToId } from '../hooks/useLenis'

export default function Nav({ sections, active }) {
  const [open, setOpen] = useState(false)
  const go = (id) => {
    setOpen(false)
    scrollToId(id)
  }

  const external = [
    { label: 'GitHub', href: profile.links.github },
    { label: 'LinkedIn', href: profile.links.linkedin },
    { label: 'Mail', href: `mailto:${profile.email}` },
  ]

  return (
    <>
      {/* top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-ink via-ink/80 to-transparent px-(--gx) pb-8 pt-5 sm:pb-10 sm:pt-7">
        <button
          onClick={() => go('hero')}
          className="pointer-events-auto font-mono text-[13px] text-paper transition-colors hover:text-acid"
        >
          ~/{profile.handle}
          <span className="text-acid">_</span>
        </button>

        <nav className="pointer-events-auto hidden items-center gap-8 font-serif text-[17px] md:flex">
          {external.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="link-underline">
              {l.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto rounded-full border border-line bg-ink/60 p-2.5 backdrop-blur lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* right rail: mirrors the editorial template */}
      <nav
        aria-label="Sections"
        className="fixed right-(--gx) top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-5 font-serif text-[16px] lg:flex"
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={`group relative flex items-center gap-3 pb-1 transition-colors ${
              active === s.id ? 'text-paper' : 'text-mute hover:text-paper'
            }`}
          >
            <span
              className={`font-mono text-[10px] transition-opacity ${
                active === s.id ? 'text-acid opacity-100' : 'opacity-0 group-hover:opacity-60'
              }`}
            >
              {String(i).padStart(2, '0')}
            </span>
            {s.label}
            {active === s.id && (
              <motion.span
                layoutId="rail-underline"
                className="absolute -bottom-0.5 left-7 right-0 h-[1.5px] bg-acid"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink-2 px-(--gx) lg:hidden"
          >
            {sections.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                onClick={() => go(s.id)}
                className="flex items-baseline gap-4 text-left font-display text-5xl uppercase"
              >
                <span className="font-mono text-xs text-acid">{String(i).padStart(2, '0')}</span>
                <span className={active === s.id ? 'text-paper' : 'text-paper/50'}>{s.label}</span>
              </motion.button>
            ))}
            <div className="mt-8 flex gap-6 font-mono text-sm text-mute">
              {external.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
