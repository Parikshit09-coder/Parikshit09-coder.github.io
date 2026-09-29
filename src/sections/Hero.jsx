import { lazy, Suspense, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowDownRight, Download } from 'lucide-react'
import { profile } from '../data/portfolio'
import { useInViewport } from '../hooks/useInViewport'
import { useReducedMotion, useMediaQuery } from '../hooks/useMediaQuery'
import { scrollToId } from '../hooks/useLenis'
import { MaskText } from '../components/Reveal'
import CodeRain from '../components/CodeRain'
import CodeWindow from '../components/CodeWindow'
import Portrait from '../components/Portrait'
import TypeCycle from '../components/TypeCycle'

// three.js is ~150kB gz, so it is split out and only fetched for capable screens
const NeuralField = lazy(() => import('../components/NeuralField'))

const DEV_CODE = [
  [['k', 'const '], ['f', 'dev'], ['p', ' = {']],
  [['p', '  name: '], ['s', `'${profile.firstName}'`], ['p', ',']],
  [['p', '  college: '], ['s', "'PICT · IT'"], ['p', ', cgpa: '], ['k', '9.65'], ['p', ',']],
  [['p', '  stack: ['], ['s', "'React'"], ['p', ', '], ['s', "'gRPC'"], ['p', ', '], ['s', "'K8s'"], ['p', '],']],
  [['p', '  status: '], ['s', "'shipping 🚀'"], ['p', ',']],
  [['p', '}']],
]

const PY_CODE = [
  [['c', '# scale0/heal.py']],
  [['k', 'if '], ['p', 'pod.status == '], ['s', '"OOMKilled"'], ['p', ':']],
  [['p', '    fix = agent.'], ['f', 'diagnose'], ['p', '(pod)']],
  [['p', '    argocd.'], ['f', 'sync'], ['p', '(fix)']],
  [['c', '# ✓ healed, no human paged']],
]

const GIT_CODE = [
  [['f', '$ '], ['p', 'kubectl get pods']],
  [['p', 'voice-agent-7f9c   '], ['f', 'Running']],
  [['p', 'medpass-api-2b1d   '], ['f', 'Running']],
]

function Float({ children, mx, my, depth, className, delay, start }) {
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth)
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={start ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ booted }) {
  const ref = useRef(null)
  const visible = useInViewport(ref)
  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')

  // mouse parallax via motion values (no re-renders)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 })
  const my = useSpring(rawY, { stiffness: 60, damping: 20 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }
  const photoX = useTransform(mx, (v) => v * -14)

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={desktop ? onMove : undefined}
      className="relative flex min-h-[100svh] w-full overflow-hidden"
    >
      {/* 3D neural net: full-bleed but faint */}
      {desktop && !reduced && (
        <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_right,transparent_5%,black_55%)]">
          <Suspense fallback={null}>
            <NeuralField active={visible} />
          </Suspense>
        </div>
      )}

      {/* right: portrait. Full, uncropped cut-out sized to the photo’s own aspect ratio, kept clear of the nav rail */}
      <motion.div
        style={desktop ? { x: photoX } : undefined}
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={booted ? { clipPath: 'inset(0% 0 0 0)' } : {}}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="absolute right-0 top-0 h-[62svh] w-full sm:h-[70svh] lg:bottom-0 lg:right-[calc(var(--gx)+8.5rem)] lg:top-auto lg:aspect-[801/1233] lg:h-[84svh] lg:w-auto"
      >
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
          {!reduced && <CodeRain />}
        </div>
        <Portrait
          base={profile.photo}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="relative h-full w-full object-cover object-top grayscale contrast-[1.1] transition-[filter] duration-700 hover:grayscale-0 [mask-image:linear-gradient(to_right,transparent_0%,black_12%),linear-gradient(to_top,transparent_0%,black_28%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
        />

      </motion.div>

      {/* floating code windows */}
      {desktop && (
        <>
          <Float mx={mx} my={my} depth={-30} className="left-[38%] top-[6%]" delay={1.8} start={booted}>
            <CodeWindow title="dev.ts" lines={DEV_CODE} start={booted} />
          </Float>
          <Float mx={mx} my={my} depth={24} className="bottom-[6%] left-[57%]" delay={2.3} start={booted}>
            <CodeWindow title="heal.py" lines={PY_CODE} start={booted} speed={28} />
          </Float>
          <Float mx={mx} my={my} depth={-16} className="left-[44%] top-[50%] hidden xl:block" delay={2.7} start={booted}>
            <CodeWindow title="kubectl" lines={GIT_CODE} start={booted} speed={30} />
          </Float>
        </>
      )}

      {/* left: headline */}
      <div className="relative z-10 flex w-full flex-col justify-end px-(--gx) pb-16 pt-[48svh] sm:pb-20 lg:w-[58%] lg:justify-center lg:pb-10 lg:pt-28">
        <motion.p
          initial={{ opacity: 0 }}
          animate={booted ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mb-6 font-mono text-[12px] text-mute"
        >
          <span className="text-acid">~</span> whoami <span className="text-dim">·</span> {profile.location}
        </motion.p>

        <h1 className="font-display uppercase leading-[0.86] tracking-[-0.01em] text-[clamp(4.2rem,15vw,12.5rem)] lg:text-[clamp(5rem,10.5vw,12.5rem)]">
          <span className="block">
            {booted && <MaskText text={profile.firstName} animateNow delay={0.35} />}
          </span>
          <span className="block">
            {booted && <MaskText text={profile.lastName} animateNow delay={0.5} />}
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={booted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <p className="mt-7 font-mono text-[14px] text-acid sm:text-base">
            <span className="text-dim">&gt; </span>
            <TypeCycle words={profile.roles} start={booted} />
          </p>
          <p className="mt-5 max-w-[34rem] font-serif text-[19px] leading-[1.55] text-paper sm:text-[21px]">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 font-mono text-[12px] uppercase tracking-widest">
            <button
              onClick={() => scrollToId('projects')}
              className="group flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-white transition-colors hover:bg-acid"
            >
              View work
              <ArrowDownRight size={15} className="transition-transform group-hover:rotate-[-45deg]" />
            </button>
            <a
              href={profile.resume}
              className="flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-paper backdrop-blur transition-colors hover:border-acid hover:text-acid"
            >
              Resume <Download size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : {}}
        transition={{ delay: 2.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-dim md:flex"
      >
        scroll
        <motion.span
          className="block h-10 w-px origin-top bg-mute"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
