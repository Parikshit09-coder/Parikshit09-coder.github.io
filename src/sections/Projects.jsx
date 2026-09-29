import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { GithubIcon } from '../components/Icons'
import { useFinePointer } from '../hooks/useMediaQuery'

function ProjectCard({ p, i }) {
  const fine = useFinePointer()
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const rx = useSpring(0, { stiffness: 150, damping: 18 })
  const ry = useSpring(0, { stiffness: 150, damping: 18 })
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(242,90,28,0.10), transparent 60%)`

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px * 100)
    my.set(py * 100)
    rx.set((0.5 - py) * 7)
    ry.set((px - 0.5) * 7)
  }
  const leave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <Reveal delay={(i % 2) * 0.12} className="[perspective:1200px]">
      <motion.article
        onMouseMove={fine ? move : undefined}
        onMouseLeave={leave}
        style={{ rotateX: rx, rotateY: ry }}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-ink-2/60 p-7 transition-colors hover:border-acid/40 sm:p-9"
      >
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
          <span>
            <span className="text-acid">{String(i + 1).padStart(2, '0')}</span> · {p.kind}
          </span>
          <span>{p.year}</span>
        </div>

        <h3 className="relative mt-10 font-display text-6xl uppercase leading-none transition-colors group-hover:text-acid sm:text-7xl">
          {p.title}
        </h3>
        {p.subtitle && <p className="relative mt-3 font-serif text-[22px] italic text-mute">{p.subtitle}</p>}
        <p className="relative mt-5 font-serif text-[18px] leading-relaxed text-paper/90">{p.description}</p>
        <ul className="relative mt-5 flex-1 space-y-3">
          {p.highlights?.map((h) => (
            <li key={h} className="flex gap-3 font-serif text-[16px] leading-relaxed text-paper/90">
              <span className="font-mono text-[12px] text-acid">▸</span>
              {h}
            </li>
          ))}
        </ul>

        <div className="relative mt-8 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full bg-ink-3 px-3 py-1 font-mono text-[11px] text-paper/90">
              {s}
            </span>
          ))}
        </div>

        <div className="relative mt-8 flex items-center gap-5 border-t border-line pt-5 font-mono text-[12px]">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-paper hover:text-acid">
              <GithubIcon className="size-4" /> source
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-paper hover:text-acid">
              live <ArrowUpRight size={14} />
            </a>
          )}
          <ArrowUpRight className="ml-auto text-dim transition-all duration-500 group-hover:rotate-45 group-hover:text-acid" size={22} />
        </div>
      </motion.article>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeading index={3} kicker="Selected work" title="Projects" file="ls ./projects" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </Section>
  )
}
