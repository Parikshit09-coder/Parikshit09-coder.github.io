import { motion } from 'motion/react'
import { Medal, Trophy } from 'lucide-react'
import { hackathons } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export default function Hackathons() {
  return (
    <Section id="hackathons">
      <SectionHeading index={4} kicker="Built under pressure" title="Hackathons" />

      <Reveal>
        <div className="overflow-hidden rounded-lg border border-line bg-ink-2/60 font-mono text-[12.5px]">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 text-dim sm:px-8">
            <span>
              <span className="text-acid">$</span> cat hackathons.log | sort -r
            </span>
            <span className="hidden sm:inline">podiums: {hackathons.length}</span>
          </div>

          {hackathons.map((h, i) => {
            const Icon = /winner/i.test(h.result) ? Trophy : Medal
            return (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i }}
                className="group grid gap-4 border-b border-line/60 px-5 py-8 transition-colors last:border-0 hover:bg-acid/[0.04] md:grid-cols-[70px_1fr_220px] md:items-baseline md:gap-8 sm:px-8"
              >
                <span className="text-dim">{h.year}</span>
                <div>
                  <h3 className="font-serif text-[26px] leading-tight text-paper transition-colors group-hover:text-acid sm:text-[32px]">
                    {h.name}
                  </h3>
                  <p className="mt-3 max-w-2xl font-serif text-[17px] leading-relaxed text-paper/90">{h.project}</p>
                </div>
                <span className="flex items-center gap-2 text-[13px] text-amber md:justify-end">
                  <Icon size={15} className="shrink-0" />
                  {h.result}
                </span>
              </motion.div>
            )
          })}
          <div className="px-5 py-3 text-dim sm:px-8">
            <span className="text-acid">✔</span> {hackathons.length} entries · exit 0
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
