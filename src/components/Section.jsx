export default function Section({ id, children, className = '' }) {
  return (
    <section
      id={id}
      className={`relative w-full px-(--gx) py-14 sm:py-20 lg:pr-60 ${className}`}
    >
      <div className="max-w-[1320px]">{children}</div>
    </section>
  )
}
