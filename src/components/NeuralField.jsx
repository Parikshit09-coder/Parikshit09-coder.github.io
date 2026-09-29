import { useEffect, useRef } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'

const COUNT = 220
const RADIUS = 5.2
const LINK = 1.35

// Points on a noisy sphere + precomputed edges between close neighbours: reads
// as a neural network. Named three.js imports (no R3F / `import *`) let the
// bundler tree-shake everything we don't use. Geometry is built once; each
// frame only updates a rotation, and the loop stops entirely when `active` is false.
function buildNetwork() {
  const pts = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const theta = 2 * Math.PI * Math.random()
    const phi = Math.acos(2 * Math.random() - 1)
    const r = RADIUS * (0.75 + Math.random() * 0.35)
    pts.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)], i * 3)
  }
  const seg = []
  for (let i = 0; i < COUNT; i++)
    for (let j = i + 1; j < COUNT; j++) {
      const dx = pts[i * 3] - pts[j * 3], dy = pts[i * 3 + 1] - pts[j * 3 + 1], dz = pts[i * 3 + 2] - pts[j * 3 + 2]
      if (dx * dx + dy * dy + dz * dz < LINK * LINK) seg.push(...pts.subarray(i * 3, i * 3 + 3), ...pts.subarray(j * 3, j * 3 + 3))
    }
  return { pts, lines: new Float32Array(seg) }
}

export default function NeuralField({ active = true }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)

  // one-time setup
  useEffect(() => {
    const el = mountRef.current
    const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.z = 9

    const { pts, lines } = buildNetwork()
    const group = new Group()
    const pGeo = new BufferGeometry().setAttribute('position', new BufferAttribute(pts, 3))
    const lGeo = new BufferGeometry().setAttribute('position', new BufferAttribute(lines, 3))
    const pMat = new PointsMaterial({ size: 0.05, color: 0xf25a1c, transparent: true, opacity: 0.85, depthWrite: false })
    const lMat = new LineBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.1, depthWrite: false })
    group.add(new Points(pGeo, pMat), new LineSegments(lGeo, lMat))
    scene.add(group)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h, false)
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const pointer = { x: 0, y: 0 }
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    stateRef.current = { renderer, scene, camera, group, pointer }
    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      pGeo.dispose(); lGeo.dispose(); pMat.dispose(); lMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      stateRef.current = null
    }
  }, [])

  // render loop only while visible
  useEffect(() => {
    const s = stateRef.current
    if (!active || !s) return
    let raf, last = performance.now()
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (document.hidden) return
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const g = s.group
      g.rotation.y += dt * 0.06
      g.rotation.x += (s.pointer.y * 0.3 - g.rotation.x) * 0.04
      g.rotation.z += (s.pointer.x * 0.15 - g.rotation.z) * 0.04
      s.renderer.render(s.scene, s.camera)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />
}
