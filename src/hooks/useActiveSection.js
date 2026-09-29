import { useEffect, useState } from 'react'

// One shared IntersectionObserver instead of scroll listeners:
// the browser tells us which section crosses the middle band of the viewport.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const seen = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)))
        const first = ids.find((id) => seen.has(id))
        if (first) setActive(first)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    // sections are lazy, so re-attach as they appear in the DOM
    const attach = () => ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el && !el.dataset.observed) {
        el.dataset.observed = '1'
        observer.observe(el)
      }
    })
    attach()
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
      ids.forEach((id) => document.getElementById(id)?.removeAttribute('data-observed'))
    }
  }, [ids])

  return active
}
