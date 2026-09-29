import { useEffect, useState } from 'react'

const TINT = {
  k: 'text-violet', // keyword
  s: 'text-amber', // string
  c: 'text-dim', // comment
  f: 'text-acid', // function / accent
  p: 'text-paper/85', // plain
}

/**
 * Tiny terminal/editor window that types its code out.
 * `lines` is an array of token arrays: [[type, text], ...]
 */
export default function CodeWindow({ title, lines, start = true, speed = 22, className = '' }) {
  const total = lines.reduce((n, l) => n + l.reduce((m, [, t]) => m + t.length, 0) + 1, 0)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!start || shown >= total) return
    const t = setTimeout(() => setShown((s) => s + 1), speed)
    return () => clearTimeout(t)
  }, [start, shown, total, speed])

  let budget = shown
  return (
    <div
      className={`w-max max-w-[92vw] rounded-lg border border-line/80 bg-ink-2/75 font-mono text-[11px] leading-[1.7] shadow-xl shadow-black/[0.08] backdrop-blur-md sm:text-[12px] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line/80 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-dim">{title}</span>
      </div>
      <pre className="px-4 py-3">
        {lines.map((line, li) => {
          if (budget <= 0) return null
          const out = line.map(([type, txt], ti) => {
            const part = txt.slice(0, Math.max(0, budget))
            budget -= txt.length
            return (
              <span key={ti} className={TINT[type]}>
                {part}
              </span>
            )
          })
          budget -= 1
          return (
            <div key={li} className="flex">
              <span className="mr-4 w-3 select-none text-right text-dim/60">{li + 1}</span>
              <span>{out}</span>
            </div>
          )
        })}
        {shown < total && <span className="caret" />}
      </pre>
    </div>
  )
}
