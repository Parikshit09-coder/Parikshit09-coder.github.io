import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Loader from './components/Loader'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import { profile } from './data/portfolio'
import { useActiveSection } from './hooks/useActiveSection'
import { useLenis } from './hooks/useLenis'
import { useFinePointer, useReducedMotion } from './hooks/useMediaQuery'

// Each section is its own chunk. The same import() promise is shared by
// React.lazy and the boot loader, so the loader's log shows real fetches.
const chunks = {
  hero: () => import('./sections/Hero'),
  about: () => import('./sections/About'),
  experience: () => import('./sections/Experience'),
  projects: () => import('./sections/Projects'),
  hackathons: () => import('./sections/Hackathons'),
  skills: () => import('./sections/Skills'),
  education: () => import('./sections/Education'),
  contact: () => import('./sections/Contact'),
}
const View = Object.fromEntries(Object.entries(chunks).map(([k, fn]) => [k, lazy(fn)]))
const Cursor = lazy(() => import('./components/Cursor'))

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
const IDS = SECTIONS.map((s) => s.id)

function preloadImage(base) {
  const img = new Image()
  img.sizes = window.innerWidth >= 1024 ? '50vw' : '100vw'
  img.srcset = `${base}-640.avif 640w, ${base}-1080.avif 1080w, ${base}-1600.avif 1600w`
  img.src = `${base}-1080.jpg`
  return img.decode()
}

export default function App() {
  // `?boot=0` skips the boot screen (handy for Lighthouse / screenshots)
  const [booted, setBooted] = useState(() => new URLSearchParams(location.search).get('boot') === '0')
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = useActiveSection(IDS)
  useLenis(booted && !reduced)

  useEffect(() => {
    document.documentElement.style.overflow = booted ? '' : 'hidden'
  }, [booted])

  const tasks = useMemo(() => {
    const desktop = window.matchMedia('(min-width: 1024px)').matches
    return [
      { label: '/fonts', match: /fonts\.gstatic/, run: () => document.fonts.ready },
      { label: '/chunks/hero.js', match: /\/Hero-/, run: chunks.hero },
      { label: `${profile.photo}.avif`, match: /\/img\/me-/, run: () => preloadImage(profile.photo) },
      ...(desktop && !reduced
        ? [{ label: '/chunks/three.neural-net.js', match: /\/(three|NeuralField)-/, run: () => import('./components/NeuralField') }]
        : []),
      ...IDS.slice(1).map((id) => ({
        label: `/api/${id}`,
        match: new RegExp(`/${id[0].toUpperCase() + id.slice(1)}-`),
        run: chunks[id],
      })),
    ]
  }, [reduced])

  const done = useCallback(() => setBooted(true), [])

  return (
    <div className="grain relative">
      <AnimatePresence>{!booted && <Loader key="loader" tasks={tasks} onDone={done} />}</AnimatePresence>

      {booted && fine && !reduced && (
        <Suspense fallback={null}>
          <Cursor />
        </Suspense>
      )}
      <ScrollProgress />
      <Nav sections={SECTIONS} active={active} />

      <main>
        <Suspense fallback={<div className="h-svh" />}>
          <View.hero booted={booted} />
        </Suspense>
        {IDS.slice(1).map((id) => {
          const C = View[id]
          return (
            <Suspense
              key={id}
              fallback={<div className="px-10 py-40 font-mono text-xs text-dim">fetching {id}…</div>}
            >
              <C />
            </Suspense>
          )
        })}
      </main>
    </div>
  )
}
