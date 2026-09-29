import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const pad = (s, n) => (s + ' ').padEnd(n, '.')
const kb = (b) => (b >= 1024 ? `${(b / 1024).toFixed(1)}kB` : `${b}B`)

// Read what the browser actually transferred for this task (Resource Timing API).
function measure(match, fallbackMs) {
  const entries = performance.getEntriesByType('resource').filter((e) => match?.test(e.name))
  if (!entries.length) return { ms: fallbackMs, size: null }
  const start = Math.min(...entries.map((e) => e.startTime))
  const end = Math.max(...entries.map((e) => e.responseEnd))
  const bytes = entries.reduce((n, e) => n + (e.transferSize || 0), 0)
  return { ms: Math.round(end - start), size: bytes ? kb(bytes) : 'cache' }
}

const COLORS = {
  cmd: 'text-paper',
  info: 'text-mute',
  get: 'text-violet',
  ok: 'text-acid',
  warn: 'text-amber',
}

/**
 * Boot screen that doubles as a real preloader: every "fetch" line is an
 * actual dynamic import / asset request, and the timing shown is measured.
 */
export default function Loader({ tasks, onDone }) {
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const quick = sessionStorage.getItem('booted') === '1'
    const beat = (ms) => new Promise((r) => setTimeout(r, quick ? ms / 4 : ms))
    const push = (text, type = 'info') => setLines((l) => [...l, { text, type, id: l.length }])

    ;(async () => {
      const t0 = performance.now()
      push('$ npm run portfolio', 'cmd')
      await beat(260)
      push('> vite build --mode production', 'info')
      await beat(200)
      push(`> env: ${navigator.hardwareConcurrency || '?'} cores · ${window.devicePixelRatio}x dpr · ${navigator.connection?.effectiveType ?? 'net ok'}`, 'info')
      await beat(220)

      // fire every request in parallel, then report them in order
      const pending = tasks.map(({ run }) => {
        const s = performance.now()
        return run().then(
          () => ({ ok: true, ms: Math.round(performance.now() - s) }),
          () => ({ ok: false, ms: Math.round(performance.now() - s) }),
        )
      })
      for (let i = 0; i < tasks.length; i++) {
        const { label, match } = tasks[i]
        const r = await pending[i]
        const { ms, size } = measure(match, r.ms)
        const status = r.ok ? '200' : '404'
        push(
          `[fetch] GET ${pad(label, 28)} ${status} · ${String(ms).padStart(3)}ms${size ? ` · ${size}` : ''}`,
          r.ok ? 'get' : 'warn',
        )
        setProgress((i + 1) / (tasks.length + 1))
        await beat(140)
      }

      push('[ai]    initialising neural vibes ........ done', 'info')
      await beat(240)
      setProgress(1)
      push(`✔ hydrated in ${((performance.now() - t0) / 1000).toFixed(2)}s, welcome.`, 'ok')
      sessionStorage.setItem('booted', '1')
      setReady(true)
      await beat(650)
      onDone()
    })()
  }, [tasks, onDone])

  // let impatient visitors skip
  useEffect(() => {
    const skip = () => ready && onDone()
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [ready, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-ink font-mono text-[12px] sm:text-[13px]"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 border-b border-line px-(--gx) py-3 text-dim">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3">~/portfolio · zsh</span>
      </div>

      <div className="flex-1 overflow-hidden px-(--gx) py-6 sm:py-10">
        {lines.map((l) => (
          <motion.p
            key={l.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`whitespace-pre-wrap break-all leading-7 ${COLORS[l.type]}`}
          >
            {l.text}
          </motion.p>
        ))}
        {!ready && <span className="caret" />}
      </div>

      <div className="px-(--gx) pb-8">
        <div className="mb-2 flex justify-between text-dim">
          <span>{ready ? 'ready' : 'fetching modules'}</span>
          <span>{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
        </div>
        <div className="h-px w-full bg-line">
          <motion.div
            className="h-px bg-acid"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
