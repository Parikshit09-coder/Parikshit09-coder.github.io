import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { experience } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <Section id="experience">
      <SectionHeading index={2} kicker="git log --career" title="Experience" />
      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-[5px] top-2 w-px bg-line" />
        <motion.div style={{ scaleY }} className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-acid" />

        {experience.map((job, i) => (
          <Reveal key={job.hash} delay={0.05 * i} className="relative pb-20 pl-10 last:pb-0 sm:pl-14">
            <span className="absolute left-0 top-2 size-[11px] rounded-full border border-acid bg-ink" />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[12px]">
              <span className="text-amber">commit {job.hash}</span>
              {i === 0 && <span className="text-acid">(HEAD -&gt; main)</span>}
              <span className="text-dim">{job.period}</span>
              {job.mode && <span className="text-dim">· {job.mode}</span>}
            </div>
            <h3 className="mt-4 font-serif text-[30px] leading-tight sm:text-[42px]">
              {job.role} <span className="italic text-mute">@ {job.company}</span>
            </h3>
            {job.note && <p className="mt-2 font-mono text-[12px] text-violet">// {job.note}</p>}
            <ul className="mt-6 max-w-4xl space-y-4">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 font-serif text-[17px] leading-relaxed text-paper/90 sm:text-[19px]">
                  <span className="mt-[2px] font-mono text-sm text-acid">+</span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {job.stack.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-mute">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
