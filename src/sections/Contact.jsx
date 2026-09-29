import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../data/portfolio'
import Section from '../components/Section'
import { MaskText, Reveal } from '../components/Reveal'
import { GithubIcon, LinkedinIcon } from '../components/Icons'
import { scrollToId } from '../hooks/useLenis'

const open = (url) => window.open(url, '_blank', 'noopener')

const COMMANDS = {
  help: () => [
    'available commands:',
    '  whoami     about me',
    '  email      write to me',
    '  github     open GitHub',
    '  linkedin   open LinkedIn',
    '  resume     download résumé',
    '  ls         list sections',
    '  goto <s>   jump to a section',
    '  clear      clear the screen',
  ],
  whoami: () => [`${profile.firstName} ${profile.lastName} · ${profile.roles.slice(0, 2).join(' · ')}`],
  email: () => (location.href = `mailto:${profile.email}`, [`opening mail client → ${profile.email}`]),
  github: () => (open(profile.links.github), ['opening github…']),
  linkedin: () => (open(profile.links.linkedin), ['opening linkedin…']),
  resume: () => (open(profile.resume), ['fetching resume.pdf…']),
  ls: () => ['about/  experience/  projects/  hackathons/  skills/  education/  contact/'],
  goto: (arg) => (arg ? (scrollToId(arg.replace('/', '')), [`cd ./${arg}`]) : ['usage: goto <section>']),
  date: () => [new Date().toString()],
  sudo: () => ['[sudo] permission granted. You may now hire me. ✓'],
}

export default function Contact() {
  const [history, setHistory] = useState([{ out: ["type 'help' to see what I can do."] }])
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  const run = (e) => {
    e.preventDefault()
    const raw = value.trim()
    setValue('')
    if (!raw) return
    const [cmd, ...args] = raw.split(/\s+/)
    if (cmd === 'clear') return setHistory([])
    const fn = COMMANDS[cmd.toLowerCase()]
    const out = fn ? fn(args[0]) : [`zsh: command not found: ${cmd}`]
    setHistory((h) => [...h, { cmd: raw, out }])
    requestAnimationFrame(() => bodyRef.current?.scrollTo({ top: 1e6 }))
  }

  return (
    <Section id="contact" className="pb-16">
      {/* one headline instead of "Contact" + a second headline: even rhythm, no duplicate */}
      <Reveal y={16}>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-mute">
          <span className="text-acid">07</span>
          <span>Contact · say hello</span>
        </div>
        <div className="mt-4 h-px w-8 bg-mute/40" />
      </Reveal>
      <h2 className="mt-6 font-display text-[16vw] uppercase leading-[0.92] sm:text-[12vw] lg:text-[8.5rem]">
        <span className="block">
          <MaskText text="Let's build" />
        </span>
        <span className="block text-acid">
          <MaskText text="something." delay={0.15} />
        </span>
      </h2>

      <Reveal delay={0.2}>
        <a
          href={`mailto:${profile.email}`}
          className="group mt-12 inline-flex items-center gap-3 break-all font-serif text-[24px] text-paper/90 sm:text-[38px]"
        >
          <span className="link-underline">{profile.email}</span>
          <ArrowUpRight className="shrink-0 text-acid transition-transform group-hover:rotate-45" />
        </a>
      </Reveal>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
            className="overflow-hidden rounded-lg border border-line bg-ink-2/70 font-mono text-[13px]"
            data-cursor
          >
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11px] text-dim">guest@{profile.handle}: ~/contact</span>
            </div>
            <div ref={bodyRef} data-lenis-prevent className="h-72 overflow-y-auto px-5 py-4 leading-7">
              {history.map((h, i) => (
                <div key={i}>
                  {h.cmd && (
                    <p>
                      <span className="text-acid">➜</span> <span className="text-violet">~</span> {h.cmd}
                    </p>
                  )}
                  {h.out.map((l, j) => (
                    <p key={j} className="whitespace-pre-wrap text-paper/90">{l}</p>
                  ))}
                </div>
              ))}
              <form onSubmit={run} className="flex items-center gap-2">
                <span className="text-acid">➜</span>
                <span className="text-violet">~</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent text-paper caret-acid outline-none"
                />
              </form>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col justify-end gap-4">
          {[
            { label: 'GitHub', href: profile.links.github, Icon: GithubIcon },
            { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon },
          ].map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-line py-5 font-serif text-[26px] transition-colors hover:text-acid"
            >
              <span className="flex items-center gap-4">
                <Icon className="size-5" /> {label}
              </span>
              <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
            </a>
          ))}
        </Reveal>
      </div>

      <footer className="mt-32 flex flex-col gap-3 border-t border-line pt-8 font-mono text-[11px] text-dim sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</span>
        <span>built with react · vite · three.js · motion</span>
        <button onClick={() => scrollToId('hero')} className="text-left hover:text-acid sm:text-right">
          back to top ↑
        </button>
      </footer>
    </Section>
  )
}
