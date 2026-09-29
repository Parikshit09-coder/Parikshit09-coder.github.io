import { motion } from 'motion/react'
import { skills } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading index={5} kicker="Expertise" title="Skills" file="stack.config.js" />
      <div className="grid gap-x-16 md:grid-cols-2">
        {skills.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: (gi % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line py-8"
          >
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-acid">
              {g.group} <span className="text-dim">[{g.items.length}]</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="font-serif text-[26px] text-paper transition-all duration-300 hover:italic hover:text-acid sm:text-[32px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
