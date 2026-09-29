import { useEffect, useState } from 'react'

export default function TypeCycle({ words, start = true, className = '' }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!start) return
    const word = words[i % words.length]
    let t
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), 1800)
    else if (deleting && text === '') {
      setDeleting(false)
      setI((n) => n + 1)
    } else
      t = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 35 : 70 + Math.random() * 60,
      )
    return () => clearTimeout(t)
  }, [text, deleting, i, words, start])

  return <span className={`caret ${className}`}>{text}</span>
}
