import { MaskText, Reveal } from './Reveal'

export default function SectionHeading({ index, kicker, title, file }) {
  return (
    <div className="mb-10 sm:mb-14">
      <Reveal y={16}>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-mute">
          <span className="text-acid">{String(index).padStart(2, '0')}</span>
          <span>{kicker}</span>
          {file && <span className="hidden normal-case tracking-normal text-dim sm:inline">// {file}</span>}
        </div>
        <div className="mt-4 h-px w-8 bg-mute/40" />
      </Reveal>
      <h2 className="mt-6 font-display text-[18vw] uppercase leading-[0.9] sm:text-[12vw] lg:text-[8.5rem]">
        <MaskText text={title} />
      </h2>
    </div>
  )
}
