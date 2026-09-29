import { about, experience, profile, skills } from '../data/portfolio'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import CountUp from '../components/CountUp'
import Marquee from '../components/Marquee'

export default function About() {
  const json = {
    name: `${profile.firstName} ${profile.lastName}`,
    education: 'B.Tech IT @ PICT',
    currently: `${experience[0].role} @ ${experience[0].company}`,
    based_in: profile.location,
    interests: ['AI agents', 'Cloud', 'DevOps'],
    open_to_work: true,
  }
  return (
    <>
      <Section id="about">
        <SectionHeading index={1} kicker="Introduction" title="About" file="about.md" />
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <p className="font-serif text-[28px] italic leading-[1.25] text-paper sm:text-[36px]">
                {about.lead}
              </p>
            </Reveal>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 * (i + 1)}>
                <p className="mt-7 max-w-2xl font-serif text-[19px] leading-[1.7] text-paper/90 sm:text-[21px]">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="self-start">
            <div className="rounded-lg border border-line bg-ink-2/70 font-mono text-[12.5px]">
              <div className="border-b border-line px-4 py-2.5 text-[11px] text-dim">profile.json</div>
              <pre className="overflow-x-auto px-5 py-4 leading-7">
                <span className="text-paper/90">{'{'}</span>
                {Object.entries(json).map(([k, v]) => (
                  <div key={k} className="pl-4">
                    <span className="text-violet">"{k}"</span>
                    <span className="text-paper/90">: </span>
                    <span className={typeof v === 'boolean' ? 'text-acid' : 'text-amber'}>{JSON.stringify(v)}</span>
                    <span className="text-paper/90">,</span>
                  </div>
                ))}
                <span className="text-paper/90">{'}'}</span>
              </pre>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 grid grid-cols-1 border-t border-line sm:grid-cols-3">
          {about.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-b border-line py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <div className="font-display text-7xl sm:text-8xl">
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Section>
      <Marquee items={skills.flatMap((g) => g.items).slice(0, 14)} />
    </>
  )
}
