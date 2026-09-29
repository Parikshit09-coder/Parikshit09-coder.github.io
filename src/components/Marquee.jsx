export default function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-display text-5xl uppercase sm:text-7xl">
        {row.map((t, i) => (
          <span key={i} className={i % 2 ? 'outline-text' : 'text-paper/90'}>
            {t} <span className="mx-6 font-mono text-2xl text-acid align-middle">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
