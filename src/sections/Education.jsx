import { education, exams } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export default function Education() {
  return (
    <Section id="education">
      <SectionHeading index={6} kicker="Background" title="Education" />
      <div className="border-t border-line">
        {education.map((e, i) => (
          <Reveal key={e.level} delay={i * 0.08}>
            <div className="group grid gap-4 border-b border-line py-10 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-10">
              <div className="font-mono text-[12px]">
                <div className="uppercase tracking-[0.25em] text-acid">{e.level}</div>
                {e.period && <div className="mt-2 text-mute">{e.period}</div>}
              </div>
              <div>
                <h3 className="font-serif text-[26px] leading-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-[34px]">
                  {e.degree}
                </h3>
                <p className="mt-2 font-serif text-[19px] italic text-mute">{e.school}</p>
              </div>
              <div className="flex items-baseline gap-2 md:justify-end">
                <span className="font-display text-6xl leading-none transition-colors group-hover:text-acid sm:text-7xl">
                  {e.score}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-dim">{e.scoreLabel}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {exams?.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-16">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
              <span className="text-acid">$</span> entrance --scores
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {exams.map((x) => (
                <div key={x.name} className="rounded-lg border border-line bg-ink-2/60 p-6 transition-colors hover:border-acid/40">
                  <div className="font-mono text-[12px] text-mute">{x.name}</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-6xl">{x.score}</span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-dim">{x.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
