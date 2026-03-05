"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SeeMoreTransitionOverlay from "@/app/components/SeeMoreTransitionOverlay"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

export default function Home() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSeeMoreTransitioning, setIsSeeMoreTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cubeRef = useRef<HTMLCanvasElement>(null)
  const cubeLayerRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const storySectionRef = useRef<HTMLElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const workplaceCopyRef = useRef<HTMLDivElement>(null)
  const chaosCopyRef = useRef<HTMLDivElement>(null)
  const diamondCopyRef = useRef<HTMLDivElement>(null)
  const logoCopyRef = useRef<HTMLDivElement>(null)
  const cubeMotionRef = useRef({
    pan: 0,
    chaos: 0,
    forward: 0,
    reform: 0,
    logo: 0,
    disperse: 0
  })
  const transitionFrameRef = useRef<number | null>(null)
  const transitionStartRef = useRef<number | null>(null)

  // Prevent scrolling when mobile menu or transition overlay is active.
  useEffect(() => {
    if (isMobileMenuOpen || isSeeMoreTransitioning) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, isSeeMoreTransitioning])

  // Story timeline: pinned cube + scrubbed text/motion states
  useEffect(() => {
    const story = storySectionRef.current
    const heroSection = heroSectionRef.current
    const cubeLayer = cubeLayerRef.current
    const heroCopy = heroCopyRef.current
    const workplaceCopy = workplaceCopyRef.current
    const chaosCopy = chaosCopyRef.current
    const diamondCopy = diamondCopyRef.current
    const logoCopy = logoCopyRef.current
    if (!story || !heroSection || !cubeLayer || !heroCopy || !workplaceCopy || !chaosCopy || !diamondCopy || !logoCopy) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const motion = cubeMotionRef.current
      motion.pan = 0
      motion.chaos = 0
      motion.forward = 0
      motion.reform = 0
      motion.logo = 0
      motion.disperse = 0

      gsap.set(heroCopy, { autoAlpha: 1, y: 0 })
      gsap.set(workplaceCopy, { autoAlpha: 0, y: 32 })
      gsap.set(chaosCopy, { autoAlpha: 0, y: 24, scale: 0.96 })
      gsap.set(diamondCopy, { autoAlpha: 0, y: 28 })
      gsap.set(logoCopy, { autoAlpha: 0, y: 28 })

      // Strict normalized phase map (0..1) so explosion completes at unpin.
      const phase = {
        heroStart: 0,
        heroEnd: 0.14,
        workplaceStart: 0.14,
        workplaceEnd: 0.34,
        chaosStart: 0.34,
        chaosEnd: 0.58,
        reformStart: 0.58,
        reformEnd: 0.74,
        logoStart: 0.74,
        logoEnd: 0.9,
        explodeStart: 0.9,
        explodeEnd: 1
      } as const

      gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          endTrigger: story,
          end: "bottom bottom",
          scrub: 1,
          pin: cubeLayer,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })
        .to(heroCopy, { autoAlpha: 0, y: -24, duration: phase.heroEnd - phase.heroStart, ease: "none" }, phase.heroStart)
        .to(motion, { pan: -42, duration: phase.heroEnd - phase.heroStart, ease: "none" }, phase.heroStart)
        .to(workplaceCopy, { autoAlpha: 1, y: 0, duration: 0.08, ease: "none" }, phase.workplaceStart)
        .to(workplaceCopy, { autoAlpha: 0, y: -24, duration: 0.1, ease: "none" }, phase.workplaceEnd - 0.1)
        .to(motion, { chaos: 1, forward: 1, duration: phase.chaosEnd - phase.chaosStart, ease: "none" }, phase.chaosStart)
        .to(chaosCopy, { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: "none" }, phase.chaosStart + 0.04)
        .to(chaosCopy, { autoAlpha: 0, y: -28, duration: 0.08, ease: "none" }, phase.chaosEnd - 0.08)
        .to(motion, { reform: 1, pan: 12, forward: 0.1, duration: phase.reformEnd - phase.reformStart, ease: "none" }, phase.reformStart)
        .to(diamondCopy, { autoAlpha: 1, y: 0, duration: 0.08, ease: "none" }, phase.reformStart + 0.02)
        .to(diamondCopy, { autoAlpha: 0, y: -18, duration: 0.08, ease: "none" }, phase.logoStart)
        .to(motion, { logo: 1, duration: phase.logoEnd - phase.logoStart, ease: "none" }, phase.logoStart)
        .to(logoCopy, { autoAlpha: 1, y: 0, duration: 0.08, ease: "none" }, phase.logoStart + 0.04)
        .to(
          logoCopy,
          { autoAlpha: 0, y: -20, duration: phase.explodeEnd - (phase.explodeStart + 0.03), ease: "none" },
          phase.explodeStart + 0.03
        )
        .to(motion, { disperse: 1, duration: phase.explodeEnd - phase.explodeStart, ease: "none" }, phase.explodeStart)
    })

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const count = window.innerWidth < 768 ? 72 : 132
    const particles: { x: number; y: number; vx: number; vy: number; vr: number; rot: number; size: number; opacity: number }[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        vr: (Math.random() - 0.5) * 0.0025,
        rot: Math.random() * Math.PI * 2,
        size: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.09 + 0.03
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const explodeVisibility = cubeMotionRef.current.disperse
      const alphaBoost = 0.45 + explodeVisibility * 0.75

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          const force = (180 - dist) / 180
          p.vx += (dx / (dist + 0.001)) * force * 0.0018
          p.vy += (dy / (dist + 0.001)) * force * 0.0018
        }

        p.vx += (Math.random() - 0.5) * 0.00008
        p.vy += (Math.random() - 0.5) * 0.00008

        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr

        // Wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const s = p.size * (0.9 + explodeVisibility * 0.35)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = `rgba(45, 212, 191, ${p.opacity * alphaBoost})`
        ctx.fillRect(-s * 0.5, -s * 0.5, s, s)
        ctx.strokeStyle = `rgba(193, 255, 246, ${p.opacity * alphaBoost * 0.42})`
        ctx.lineWidth = 0.6
        ctx.strokeRect(-s * 0.5, -s * 0.5, s, s)
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // 3D Glowing Cube inside Glass Frame with Neural Network
  useEffect(() => {
    const canvas = cubeRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bloomCanvasA = document.createElement('canvas')
    const bloomCanvasB = document.createElement('canvas')
    const bloomCtxA = bloomCanvasA.getContext('2d')
    const bloomCtxB = bloomCanvasB.getContext('2d')
    if (!bloomCtxA || !bloomCtxB) return

    let animationId: number
    let w = 0, h = 0
    let bloomScale = 0.52
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bloomScale = w < 768 ? 0.4 : (w < 1280 ? 0.48 : 0.54)
      bloomCanvasA.width = Math.max(1, Math.floor(w * bloomScale))
      bloomCanvasA.height = Math.max(1, Math.floor(h * bloomScale))
      bloomCanvasB.width = Math.max(1, Math.floor(w * bloomScale))
      bloomCanvasB.height = Math.max(1, Math.floor(h * bloomScale))
      bloomCtxA.setTransform(1, 0, 0, 1, 0, 0)
      bloomCtxB.setTransform(1, 0, 0, 1, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let rotX = -0.4
    let rotY = 0.6
    let velX = 0
    let velY = 0.0015
    let isDragging = false
    let lastMX = 0, lastMY = 0
    let mouseTargetX = 0, mouseTargetY = 0
    let mouseParallaxX = 0, mouseParallaxY = 0
    let isMouseInside = false
    let mouseCanvasX = -9999
    let mouseCanvasY = -9999

    const handleMouseDown = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        isDragging = true
        lastMX = e.clientX
        lastMY = e.clientY
        velY = 0
      }
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      isMouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      if (isMouseInside) {
        mouseTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        mouseTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        mouseCanvasX = e.clientX - rect.left
        mouseCanvasY = e.clientY - rect.top
      } else {
        mouseCanvasX = -9999
        mouseCanvasY = -9999
      }
      if (!isDragging) return
      velY = (e.clientX - lastMX) * 0.003
      velX = (e.clientY - lastMY) * 0.003
      lastMX = e.clientX
      lastMY = e.clientY
    }
    const handleMouseUp = () => { isDragging = false }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    // === INNER CUBE — 10k+ mini-cubes, FULL OPACITY ===
    const S = 1.0
    const ms = 0.019
    type MCube = { x: number; y: number; z: number; face: number }
    const cubes: MCube[] = []

    // Surface: 40×40 per face × 6 = 9,600
    const gN = 40
    const sp = (2 * S) / gN
    const jt = sp * 0.05
    for (let face = 0; face < 6; face++) {
      for (let i = 0; i < gN; i++) {
        for (let j = 0; j < gN; j++) {
          const u = -S + sp * (i + 0.5) + (Math.random() - 0.5) * jt
          const v = -S + sp * (j + 0.5) + (Math.random() - 0.5) * jt
          let x = 0, y = 0, z = 0
          if (face === 0) { x = u; y = v; z = S }
          else if (face === 1) { x = u; y = v; z = -S }
          else if (face === 2) { x = S; y = u; z = v }
          else if (face === 3) { x = -S; y = u; z = v }
          else if (face === 4) { x = u; y = S; z = v }
          else { x = u; y = -S; z = v }
          cubes.push({ x, y, z, face })
        }
      }
    }

    // Edges: 30 per edge × 12 = 372
    const eN = 30
    const ev: [number, number, number][] = [
      [-S,-S,-S],[S,-S,-S],[S,S,-S],[-S,S,-S],
      [-S,-S,S],[S,-S,S],[S,S,S],[-S,S,S]
    ]
    const edgePairs: [number, number][] = [
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ]
    for (const [a, b] of edgePairs) {
      const va = ev[a], vb = ev[b]
      for (let k = 0; k <= eN; k++) {
        cubes.push({
          x: va[0] + (vb[0] - va[0]) * (k / eN),
          y: va[1] + (vb[1] - va[1]) * (k / eN),
          z: va[2] + (vb[2] - va[2]) * (k / eN),
          face: 6
        })
      }
    }

    // Glass frame and network are shown for the cube phase only, then fade out before diamond reform.
    const fS = 1.5
    const frameV: [number, number, number][] = [
      [-fS,-fS,-fS],[fS,-fS,-fS],[fS,fS,-fS],[-fS,fS,-fS],
      [-fS,-fS,fS],[fS,-fS,fS],[fS,fS,fS],[-fS,fS,fS]
    ]
    const frameE: [number, number][] = [
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ]
    type NetNode = {
      x: number; y: number; z: number
      vx: number; vy: number; vz: number
      size: number; phase: number; speed: number
    }
    const nodes: NetNode[] = []
    const nodeCount = 140
    for (let i = 0; i < nodeCount; i++) {
      const r = 2.0 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        vz: (Math.random() - 0.5) * 0.002,
        size: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5
      })
    }
    const connectDist = 1.8

    // Face normals for back-face culling
    const fn: [number, number, number][] = [
      [0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]
    ]

    // Mini-cube 3D template
    const mv: [number, number, number][] = [
      [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
      [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
    ]
    const mf = [
      { vi: [4,5,6,7], nx: 0, ny: 0, nz: 1 },
      { vi: [0,3,2,1], nx: 0, ny: 0, nz: -1 },
      { vi: [1,2,6,5], nx: 1, ny: 0, nz: 0 },
      { vi: [0,4,7,3], nx: -1, ny: 0, nz: 0 },
      { vi: [2,3,7,6], nx: 0, ny: 1, nz: 0 },
      { vi: [0,1,5,4], nx: 0, ny: -1, nz: 0 },
    ]

    const ll = Math.sqrt(0.3 * 0.3 + 0.6 * 0.6 + 0.7 * 0.7)
    const light = { x: 0.3 / ll, y: -0.6 / ll, z: -0.7 / ll }
    const fov = 3.5
    const sortBuf = cubes.map((_, i) => ({ i, rx: 0, ry: 0, rz: 0 }))
    const scatterOffsets = cubes.map(() => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 4.5 + Math.random() * 7.5
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      }
    })
    const explodeOffsets = cubes.map(() => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 10 + Math.random() * 26
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      }
    })
    type DiamondImageData = {
      width: number
      height: number
      alphaMask: Uint8Array
      lumaMap: Float32Array
      edgeMap: Float32Array
      validCoords: Uint16Array
      rowMin: Int16Array
      rowMax: Int16Array
    }
    type DiamondParticle = {
      baseX: number
      baseY: number
      logoX: number
      logoY: number
      x: number
      y: number
      vx: number
      vy: number
      size: number
      tone: number
      logoTone: number
      phase: number
      localAlpha: number
      seedX: number
      seedY: number
      bgNX: number
      bgNY: number
      bgVX: number
      bgVY: number
    }
    const PARTICLE_COUNT_DESKTOP = 62000
    const PARTICLE_COUNT_MOBILE = 26000
    const REPEL_RADIUS = 135
    const REPEL_STRENGTH = 0.95
    const SNAP_STIFFNESS = 0.065
    const SNAP_DAMPING = 0.87
    const BLOOM_INTENSITY = 1.04
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cpuCores = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
    const smoothstep = (a: number, b: number, v: number) => {
      const t = clamp01((v - a) / (b - a))
      return t * t * (3 - 2 * t)
    }
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const buildDataFromMask = (
      width: number,
      height: number,
      alphaMask: Uint8Array,
      lumaMap: Float32Array
    ): DiamondImageData => {
      const edgeMap = new Float32Array(width * height)
      const rowMin = new Int16Array(height)
      const rowMax = new Int16Array(height)
      rowMin.fill(-1)
      rowMax.fill(-1)

      const coords: number[] = []
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x
          if (alphaMask[idx] === 0) continue
          const lx = lumaMap[idx - 1]
          const rx = lumaMap[idx + 1]
          const uy = lumaMap[idx - width]
          const dy = lumaMap[idx + width]
          const gx = Math.abs(rx - lx)
          const gy = Math.abs(dy - uy)
          edgeMap[idx] = Math.min(1, gx * 1.35 + gy * 1.35)

          if (rowMin[y] === -1 || x < rowMin[y]) rowMin[y] = x
          if (rowMax[y] === -1 || x > rowMax[y]) rowMax[y] = x
          coords.push(x, y)
        }
      }

      return {
        width,
        height,
        alphaMask,
        lumaMap,
        edgeMap,
        validCoords: Uint16Array.from(coords),
        rowMin,
        rowMax
      }
    }

    const buildFallbackDiamondData = (): DiamondImageData => {
      const width = 1060
      const height = 560
      const alphaMask = new Uint8Array(width * height)
      const lumaMap = new Float32Array(width * height)
      const halfWidthAt = (y: number) => {
        if (y < -0.86 || y > 0.84) return 0
        if (y < -0.48) return 0.16 + ((y + 0.86) / 0.38) * 0.86
        if (y < -0.12) return 1.02 - ((y + 0.48) / 0.36) * 0.08
        if (y < 0.24) return 0.94 - ((y + 0.12) / 0.36) * 0.34
        return 0.6 - ((y - 0.24) / 0.6) * 0.6
      }

      for (let y = 0; y < height; y++) {
        const ny = (y / (height - 1)) * 2 - 1
        const hw = halfWidthAt(ny)
        if (hw <= 0) continue
        for (let x = 0; x < width; x++) {
          const nx = (x / (width - 1)) * 2 - 1
          if (Math.abs(nx) > hw) continue
          const idx = y * width + x
          alphaMask[idx] = 255
          const edge = 1 - Math.min(1, Math.abs(nx) / Math.max(hw, 0.0001))
          const angle = Math.atan2(ny * 0.9, nx || 0.0001)
          const facet = 0.5 + 0.5 * Math.cos(angle * 10.5 + ny * 9.2 + nx * 3.3)
          const gleam = Math.exp(-((nx * 0.55) * (nx * 0.55) + (ny + 0.06) * (ny + 0.06)) * 4.5)
          lumaMap[idx] = clamp01(0.18 + edge * 0.3 + facet * 0.4 + gleam * 0.55)
        }
      }
      return buildDataFromMask(width, height, alphaMask, lumaMap)
    }

    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image ${src}`))
      img.src = src
    })

    const buildReferenceDiamondData = (img: HTMLImageElement): DiamondImageData => {
      const width = 860
      const height = Math.max(360, Math.round(width / (img.width / img.height)))
      const c = document.createElement('canvas')
      c.width = width
      c.height = height
      const cctx = c.getContext('2d')
      if (!cctx) return buildFallbackDiamondData()
      cctx.drawImage(img, 0, 0, width, height)
      const src = cctx.getImageData(0, 0, width, height).data

      const lumaRaw = new Float32Array(width * height)
      const satRaw = new Float32Array(width * height)
      let borderAccum = 0
      let borderSatAccum = 0
      let borderCount = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          const p = idx * 4
          const r = src[p] / 255
          const g = src[p + 1] / 255
          const b = src[p + 2] / 255
          const mx = Math.max(r, g, b)
          const mn = Math.min(r, g, b)
          const sat = mx - mn
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          lumaRaw[idx] = lum
          satRaw[idx] = sat
          if (x < 24 || y < 24 || x > width - 25 || y > height - 25) {
            borderAccum += lum
            borderSatAccum += sat
            borderCount++
          }
        }
      }

      const bgLuma = borderCount > 0 ? borderAccum / borderCount : 0.05
      const bgSat = borderCount > 0 ? borderSatAccum / borderCount : 0
      const satThreshold = Math.max(0.03, bgSat + 0.038)
      const darkThreshold = Math.max(0.06, Math.min(0.5, bgLuma - 0.28))
      const alphaMask = new Uint8Array(width * height)
      const lumaMap = new Float32Array(width * height)

      for (let y = 0; y < height; y++) {
        const yn = y / (height - 1)
        let first = -1
        let last = -1
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          const isInk = satRaw[idx] > satThreshold || lumaRaw[idx] < darkThreshold
          if (isInk) {
            if (first === -1) first = x
            last = x
          }
        }
        const minRowWidth = yn > 0.82 ? width * 0.006 : yn > 0.72 ? width * 0.02 : width * 0.06
        if (first === -1 || last - first < minRowWidth) continue
        const left = Math.max(0, first - 2)
        const right = Math.min(width - 1, last + 2)
        for (let x = left; x <= right; x++) {
          const idx = y * width + x
          const lum = lumaRaw[idx]
          const sat = satRaw[idx]
          alphaMask[idx] = 255
          const tintBoost = clamp01((sat - bgSat) * 3.6)
          const darkBoost = clamp01((darkThreshold - lum) * 2.4)
          lumaMap[idx] = clamp01(lum * 0.95 + tintBoost * 0.3 + darkBoost * 0.24)
        }
      }

      for (let pass = 0; pass < 1; pass++) {
        const next = new Uint8Array(alphaMask)
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x
            let n = 0
            for (let oy = -1; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                if (ox === 0 && oy === 0) continue
                if (alphaMask[idx + oy * width + ox] > 0) n++
              }
            }
            if (alphaMask[idx] === 0 && n >= 5) next[idx] = 255
            if (alphaMask[idx] > 0 && n <= 1 && y < height * 0.88) next[idx] = 0
            if (next[idx] > 0 && lumaMap[idx] === 0) lumaMap[idx] = clamp01(lumaRaw[idx] * 1.18)
          }
        }
        alphaMask.set(next)
      }

      let minX = width
      let maxX = 0
      let minY = height
      let maxY = 0
      let active = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          if (alphaMask[idx] === 0) continue
          active++
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }

      if (active < width * height * 0.015) return buildFallbackDiamondData()

      const m = 6
      minX = Math.max(0, minX - m)
      maxX = Math.min(width - 1, maxX + m)
      minY = Math.max(0, minY - m)
      maxY = Math.min(height - 1, maxY + m)
      const cw = maxX - minX + 1
      const ch = maxY - minY + 1
      const cropAlpha = new Uint8Array(cw * ch)
      const cropLuma = new Float32Array(cw * ch)
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const srcIdx = (y + minY) * width + (x + minX)
          const dstIdx = y * cw + x
          cropAlpha[dstIdx] = alphaMask[srcIdx]
          cropLuma[dstIdx] = lumaMap[srcIdx]
        }
      }
      return buildDataFromMask(cw, ch, cropAlpha, cropLuma)
    }

    const buildLogoData = (img: HTMLImageElement): DiamondImageData | null => {
      const width = 760
      const height = Math.max(220, Math.round(width / (img.width / img.height)))
      const c = document.createElement('canvas')
      c.width = width
      c.height = height
      const cctx = c.getContext('2d')
      if (!cctx) return null
      cctx.drawImage(img, 0, 0, width, height)
      const src = cctx.getImageData(0, 0, width, height).data

      const alphaMask = new Uint8Array(width * height)
      const lumaMap = new Float32Array(width * height)
      const rowActive = new Uint16Array(height)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          const p = idx * 4
          const a = src[p + 3] / 255
          if (a < 0.04) continue
          const r = src[p] / 255
          const g = src[p + 1] / 255
          const b = src[p + 2] / 255
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          alphaMask[idx] = 255
          lumaMap[idx] = clamp01(0.35 + lum * 0.65)
          rowActive[y]++
        }
      }

      const maxRow = rowActive.reduce((m, v) => (v > m ? v : m), 0)
      const gapThreshold = Math.max(2, Math.floor(maxRow * 0.015))
      let splitY = -1
      const searchStart = Math.floor(height * 0.42)
      for (let y = searchStart; y < height - 10; y++) {
        let isGap = true
        for (let g = 0; g < 8; g++) {
          if (rowActive[y + g] > gapThreshold) {
            isGap = false
            break
          }
        }
        if (!isGap) continue
        let below = 0
        for (let yy = y + 8; yy < height; yy++) below += rowActive[yy]
        if (below > maxRow * 6) {
          splitY = y
          break
        }
      }

      if (splitY > 0) {
        for (let y = splitY; y < height; y++) {
          const row = y * width
          for (let x = 0; x < width; x++) {
            const idx = row + x
            alphaMask[idx] = 0
            lumaMap[idx] = 0
          }
        }
      }

      let minX = width
      let maxX = 0
      let minY = height
      let maxY = 0
      let active = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          if (alphaMask[idx] === 0) continue
          active++
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }

      if (active < width * height * 0.002) return null
      const m = 4
      minX = Math.max(0, minX - m)
      maxX = Math.min(width - 1, maxX + m)
      minY = Math.max(0, minY - m)
      maxY = Math.min(height - 1, maxY + m)
      const cw = maxX - minX + 1
      const ch = maxY - minY + 1
      const cropAlpha = new Uint8Array(cw * ch)
      const cropLuma = new Float32Array(cw * ch)
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const srcIdx = (y + minY) * width + (x + minX)
          const dstIdx = y * cw + x
          cropAlpha[dstIdx] = alphaMask[srcIdx]
          cropLuma[dstIdx] = lumaMap[srcIdx]
        }
      }
      return buildDataFromMask(cw, ch, cropAlpha, cropLuma)
    }

    let diamondImageData: DiamondImageData | null = null
    let diamondParticles: DiamondParticle[] = []
    let diamondAspect = 1.9
    let logoImageData: DiamondImageData | null = null
    let logoAspect = 2.4
    let diamondLoaded = false
    let hoverMix = 0
    let particleBuildToken = 0

    const particleCount = () => {
      const base = w >= 1024 ? PARTICLE_COUNT_DESKTOP : PARTICLE_COUNT_MOBILE
      let perf = 1
      if (cpuCores <= 4) perf *= 0.8
      if (deviceMemory <= 4) perf *= 0.82
      if (prefersReducedMotion) perf *= 0.7
      return Math.max(18000, Math.floor(base * perf))
    }

    const sampleWeightedIndex = (cdf: Float32Array, total: number, rnd: number) => {
      let lo = 0
      let hi = cdf.length - 1
      const target = rnd * total
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (cdf[mid] < target) lo = mid + 1
        else hi = mid
      }
      return lo
    }

    const createWeightedSampler = (data: DiamondImageData, edgeWeight: number, lumaWeight: number) => {
      const points = data.validCoords.length / 2
      const cdf = new Float32Array(points)
      let sum = 0
      for (let i = 0; i < points; i++) {
        const x = data.validCoords[i * 2]
        const y = data.validCoords[i * 2 + 1]
        const idx = y * data.width + x
        const weight = 0.02 + data.edgeMap[idx] * edgeWeight + data.lumaMap[idx] * lumaWeight
        sum += weight
        cdf[i] = sum
      }
      return { cdf, sum }
    }

    const assignLogoTargets = (particles: DiamondParticle[], data: DiamondImageData) => {
      const pointCount = data.validCoords.length / 2
      const desired = Math.min(pointCount, Math.max(particles.length * 2, 10000))
      const step = pointCount / desired
      const pts: { x: number; y: number; tone: number }[] = new Array(desired)
      for (let i = 0; i < desired; i++) {
        const pi = Math.min(pointCount - 1, Math.floor(i * step))
        const x = data.validCoords[pi * 2]
        const y = data.validCoords[pi * 2 + 1]
        const idx = y * data.width + x
        pts[i] = {
          x: (x / (data.width - 1)) * 2 - 1,
          y: (y / (data.height - 1)) * 2 - 1,
          tone: data.lumaMap[idx]
        }
      }

      pts.sort((a, b) => (a.y - b.y) || (a.x - b.x))
      const particleOrder = Array.from({ length: particles.length }, (_, i) => i)
      particleOrder.sort((ia, ib) => (particles[ia].baseY - particles[ib].baseY) || (particles[ia].baseX - particles[ib].baseX))

      const maxP = Math.max(1, particles.length - 1)
      const maxT = Math.max(1, pts.length - 1)
      for (let rank = 0; rank < particleOrder.length; rank++) {
        const p = particles[particleOrder[rank]]
        const ti = Math.floor((rank / maxP) * maxT)
        const t = pts[ti]
        p.logoX = t.x
        p.logoY = t.y
        p.logoTone = t.tone
      }
    }

    const buildDiamondParticles = (data: DiamondImageData) => {
      const count = particleCount()
      const sampler = createWeightedSampler(data, 0.34, 0.66)

      const token = ++particleBuildToken
      const out: DiamondParticle[] = []
      const chunkSize = 1200
      let i = 0
      diamondLoaded = true
      diamondParticles = out

      const buildChunk = () => {
        if (isDisposed || token !== particleBuildToken) return
        const end = Math.min(count, i + chunkSize)
        for (; i < end; i++) {
          const pick = sampleWeightedIndex(sampler.cdf, sampler.sum, Math.random())
          const x = data.validCoords[pick * 2]
          const y = data.validCoords[pick * 2 + 1]
          const idx = y * data.width + x
          const baseX = (x / (data.width - 1)) * 2 - 1
          const baseY = (y / (data.height - 1)) * 2 - 1
          const tone = data.lumaMap[idx]
          const angle = Math.random() * Math.PI * 2
          const radius = Math.pow(Math.random(), 0.45) * 1.65 + 0.12
          out.push({
            baseX,
            baseY,
            logoX: baseX,
            logoY: baseY,
            x: Number.NaN,
            y: Number.NaN,
            vx: 0,
            vy: 0,
            size: 0.5 + tone * 1.05 + Math.random() * 0.35,
            tone,
            logoTone: tone,
            phase: Math.random() * Math.PI * 2,
            localAlpha: data.alphaMask[idx] / 255,
            seedX: Math.cos(angle) * radius,
            seedY: Math.sin(angle) * radius * 0.72,
            bgNX: Math.random(),
            bgNY: Math.random(),
            bgVX: (Math.random() - 0.5) * 0.00075,
            bgVY: (Math.random() - 0.5) * 0.00075
          })
        }
        if (i < count) {
          setTimeout(buildChunk, 0)
        } else if (logoImageData) {
          assignLogoTargets(out, logoImageData)
        }
      }
      setTimeout(buildChunk, 0)
    }

    const inMask = (nx: number, ny: number, data: DiamondImageData) => {
      const py = Math.round(((ny * 0.5) + 0.5) * (data.height - 1))
      if (py < 0 || py >= data.height) return false
      const min = data.rowMin[py]
      const max = data.rowMax[py]
      if (min < 0 || max < 0) return false
      const px = Math.round(((nx * 0.5) + 0.5) * (data.width - 1))
      return px >= min && px <= max
    }

    const clampToMask = (nx: number, ny: number, data: DiamondImageData) => {
      let py = Math.round(((ny * 0.5) + 0.5) * (data.height - 1))
      py = Math.max(0, Math.min(data.height - 1, py))
      let min = data.rowMin[py]
      let max = data.rowMax[py]

      if (min < 0 || max < 0) {
        let up = py - 1
        let down = py + 1
        while (up >= 0 || down < data.height) {
          if (up >= 0 && data.rowMin[up] >= 0) {
            py = up
            min = data.rowMin[up]
            max = data.rowMax[up]
            break
          }
          if (down < data.height && data.rowMin[down] >= 0) {
            py = down
            min = data.rowMin[down]
            max = data.rowMax[down]
            break
          }
          up--
          down++
        }
      }

      if (min < 0 || max < 0) return { nx, ny }
      let px = Math.round(((nx * 0.5) + 0.5) * (data.width - 1))
      if (px < min) px = min
      if (px > max) px = max
      return {
        nx: (px / (data.width - 1)) * 2 - 1,
        ny: (py / (data.height - 1)) * 2 - 1
      }
    }

    let isDisposed = false
    ;(async () => {
      const diamondSources = ['/diamond-reference.jpg', '/diamond-reference.png']
      let loadedDiamond: DiamondImageData | null = null
      for (const src of diamondSources) {
        try {
          const img = await loadImage(src)
          loadedDiamond = buildReferenceDiamondData(img)
          break
        } catch {}
      }
      if (!loadedDiamond) loadedDiamond = buildFallbackDiamondData()

      if (isDisposed) return
      diamondImageData = loadedDiamond
      diamondAspect = loadedDiamond.width / loadedDiamond.height
      buildDiamondParticles(loadedDiamond)
      diamondLoaded = true

      ;(async () => {
        const logoSources = ['/logo.png']
        let loadedLogo: DiamondImageData | null = null
        for (const src of logoSources) {
          try {
            const logoImg = await loadImage(src)
            if (isDisposed) return
            loadedLogo = buildLogoData(logoImg)
            if (loadedLogo) break
          } catch {}
        }
        if (!loadedLogo) return
        logoImageData = loadedLogo
        logoAspect = loadedLogo.width / loadedLogo.height
        if (diamondParticles.length > 0) assignLogoTargets(diamondParticles, loadedLogo)
      })()
    })()

    let time = 0
    const introStart = performance.now()
    const introDuration = 1700

    const animate = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      time += 0.016
      const introT = Math.min(1, Math.max(0, (now - introStart) / introDuration))
      const introEase = 1 - Math.pow(1 - introT, 3)
      const scatterMix = 1 - introEase
      const motion = cubeMotionRef.current
      const chaosT = Math.min(1, Math.max(0, motion.chaos))
      const chaosEase = chaosT * chaosT * (3 - 2 * chaosT)
      const reformT = Math.min(1, Math.max(0, motion.reform))
      const reformEase = reformT * reformT * (3 - 2 * reformT)
      const logoT = Math.min(1, Math.max(0, motion.logo))
      const logoEase = logoT * logoT * (3 - 2 * logoT)
      const disperseT = Math.min(1, Math.max(0, motion.disperse))
      const disperseEase = disperseT * disperseT * (3 - 2 * disperseT)
      const cameraZ = Math.max(0.45, 2.5 - motion.forward * 1.6)
      const panOffset = (motion.pan / 100) * w
      const mouseEase = reformEase * (isMouseInside ? 1 : 0.18)

      const targetPX = isMouseInside ? mouseTargetX : 0
      const targetPY = isMouseInside ? mouseTargetY : 0
      mouseParallaxX += (targetPX - mouseParallaxX) * 0.08
      mouseParallaxY += (targetPY - mouseParallaxY) * 0.08

      rotX += velX
      rotY += velY
      if (!isDragging) {
        velX *= 0.95
        velY += (0.0015 - velY) * 0.02
      }

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)

      const unitScale = Math.min(w, h) * 0.28
      const parallaxX = mouseParallaxX * unitScale * 0.22 * mouseEase
      const parallaxY = mouseParallaxY * unitScale * 0.12 * mouseEase
      const cxBase = (w < 768 ? w * 0.5 : w * 0.72) + panOffset + parallaxX
      const cyBase = h * 0.5 + parallaxY
      const glassPhase = Math.max(0, 1 - reformEase * 2.25)
      const diamondTargetCX = w < 768 ? w * 0.5 : w * 0.7
      const diamondTargetCY = h * 0.52
      const diamondMaxW = w < 768 ? w * 0.86 : w * 0.46
      const diamondByH = (w < 768 ? h * 0.7 : h * 0.56) * diamondAspect
      const diamondWidth = Math.max(180, Math.min(diamondMaxW, diamondByH))
      const diamondHeight = Math.max(110, diamondWidth / Math.max(0.001, diamondAspect))
      let cxDiamond = cxBase + (diamondTargetCX - cxBase) * reformEase
      let cyDiamond = cyBase + (diamondTargetCY - cyBase) * reformEase
      const safeMarginX = diamondWidth * 0.56 + 22
      const safeMarginY = diamondHeight * 0.56 + 22
      const minCX = safeMarginX
      const maxCX = Math.max(minCX, w - safeMarginX)
      const minCY = safeMarginY
      const maxCY = Math.max(minCY, h - safeMarginY)
      cxDiamond = Math.min(maxCX, Math.max(minCX, cxDiamond))
      cyDiamond = Math.min(maxCY, Math.max(minCY, cyDiamond))
      const sceneCX = lerp(cxBase, cxDiamond, reformEase)
      const sceneCY = lerp(cyBase, cyDiamond, reformEase)
      const logoTargetCX = w < 768 ? w * 0.5 : w * 0.26
      const logoTargetCY = cyDiamond
      const logoMaxW = w < 768 ? w * 0.82 : w * 0.64
      const logoByH = (w < 768 ? h * 0.42 : h * 0.58) * logoAspect
      const logoWidth = Math.max(240, Math.min(logoMaxW, logoByH))
      const logoHeight = Math.max(72, logoWidth / Math.max(0.001, logoAspect))
      let logoCX = lerp(cxDiamond, logoTargetCX, logoEase)
      let logoCY = logoTargetCY
      const logoSafeMarginX = logoWidth * 0.56 + 20
      const logoSafeMarginY = logoHeight * 0.56 + 20
      logoCX = Math.min(Math.max(logoSafeMarginX, logoCX), Math.max(logoSafeMarginX, w - logoSafeMarginX))
      logoCY = Math.min(Math.max(logoSafeMarginY, logoCY), Math.max(logoSafeMarginY, h - logoSafeMarginY))

      const proj = (px: number, py: number, pz: number) => {
        const x1 = px * cosY - pz * sinY
        const z1 = px * sinY + pz * cosY
        const y1 = py * cosX - z1 * sinX
        const z2 = py * sinX + z1 * cosX
        const d = z2 + cameraZ
        if (d < 0.1) return null
        const sc = fov / (fov + d)
        return { sx: cxBase + x1 * sc * unitScale, sy: cyBase + y1 * sc * unitScale, sc, z2 }
      }

      // ===== 1. AMBIENT GLOW (behind everything) =====
      const glowR = unitScale * 1.8
      const glow = ctx.createRadialGradient(sceneCX, sceneCY, 0, sceneCX, sceneCY, glowR)
      glow.addColorStop(0, 'rgba(210, 232, 255, 0.13)')
      glow.addColorStop(0.4, 'rgba(180, 214, 245, 0.055)')
      glow.addColorStop(0.78, 'rgba(120, 180, 220, 0.018)')
      glow.addColorStop(1, 'rgba(45, 212, 191, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(sceneCX, sceneCY, glowR, 0, Math.PI * 2)
      ctx.fill()

      if (reformEase > 0.04) {
        const fluidStrength = reformEase * (0.5 + 0.5 * mouseEase)
        for (let i = 0; i < 3; i++) {
          const phase = time * (0.35 + i * 0.16)
          const ox = Math.sin(phase + i * 1.8) * unitScale * (0.22 + i * 0.06) + mouseParallaxX * unitScale * 0.18
          const oy = Math.cos(phase * 1.2 + i * 1.3) * unitScale * (0.14 + i * 0.05) + mouseParallaxY * unitScale * 0.12
          const rr = unitScale * (0.6 + i * 0.28)
          const fluid = ctx.createRadialGradient(sceneCX + ox, sceneCY + oy, rr * 0.1, sceneCX + ox, sceneCY + oy, rr)
          fluid.addColorStop(0, `rgba(45, 212, 191, ${0.09 * fluidStrength})`)
          fluid.addColorStop(0.5, `rgba(120, 190, 220, ${0.04 * fluidStrength})`)
          fluid.addColorStop(1, 'rgba(10, 20, 30, 0)')
          ctx.fillStyle = fluid
          ctx.beginPath()
          ctx.arc(sceneCX + ox, sceneCY + oy, rr, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Extra bloom during reform for a luxe crystal finish.
      if (reformEase > 0.02) {
        const caustic = ctx.createRadialGradient(
          sceneCX + unitScale * 0.14,
          sceneCY - unitScale * 0.06,
          unitScale * 0.05,
          sceneCX + unitScale * 0.14,
          sceneCY - unitScale * 0.06,
          unitScale * 1.2
        )
        caustic.addColorStop(0, `rgba(255, 255, 255, ${0.22 * reformEase})`)
        caustic.addColorStop(0.35, `rgba(182, 228, 255, ${0.11 * reformEase})`)
        caustic.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = caustic
        ctx.beginPath()
        ctx.arc(sceneCX + unitScale * 0.1, sceneCY, unitScale * 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (glassPhase > 0.01) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy
          node.z += node.vz
          const dist = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z)
          if (dist > 5.5) {
            node.vx -= node.x * 0.0008
            node.vy -= node.y * 0.0008
            node.vz -= node.z * 0.0008
          }
          if (dist < 1.8) {
            node.vx += node.x * 0.001
            node.vy += node.y * 0.001
            node.vz += node.z * 0.001
          }
        }

        const pn: { sx: number; sy: number; sc: number; ok: boolean }[] = []
        for (let i = 0; i < nodes.length; i++) {
          const p = proj(nodes[i].x, nodes[i].y, nodes[i].z)
          if (p) pn.push({ sx: p.sx, sy: p.sy, sc: p.sc, ok: true })
          else pn.push({ sx: 0, sy: 0, sc: 0, ok: false })
        }

        const netAlpha = glassPhase * (1 - chaosEase * 0.5)
        ctx.lineWidth = 0.5
        for (let i = 0; i < nodes.length; i++) {
          if (!pn[i].ok) continue
          for (let j = i + 1; j < nodes.length; j++) {
            if (!pn[j].ok) continue
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const dz = nodes[i].z - nodes[j].z
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if (d < connectDist) {
              const alpha = (1 - d / connectDist) * 0.12 * netAlpha
              ctx.beginPath()
              ctx.moveTo(pn[i].sx, pn[i].sy)
              ctx.lineTo(pn[j].sx, pn[j].sy)
              ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`
              ctx.stroke()
            }
          }
        }

        const pfc: ({ sx: number; sy: number; sc: number; z2: number } | null)[] = frameV.map(v => proj(v[0], v[1], v[2]))
        for (let i = 0; i < nodes.length; i++) {
          if (!pn[i].ok) continue
          for (let f = 0; f < frameV.length; f++) {
            if (!pfc[f]) continue
            const dx = nodes[i].x - frameV[f][0]
            const dy = nodes[i].y - frameV[f][1]
            const dz = nodes[i].z - frameV[f][2]
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if (d < connectDist * 1.3) {
              const alpha = (1 - d / (connectDist * 1.3)) * 0.1 * netAlpha
              ctx.beginPath()
              ctx.moveTo(pn[i].sx, pn[i].sy)
              ctx.lineTo(pfc[f]!.sx, pfc[f]!.sy)
              ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`
              ctx.stroke()
            }
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          if (!pn[i].ok) continue
          const sparkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * nodes[i].speed + nodes[i].phase))
          const sz = Math.max(nodes[i].size * pn[i].sc, 0.5)
          ctx.beginPath()
          ctx.arc(pn[i].sx, pn[i].sy, sz, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(45, 212, 191, ${sparkle * 0.5 * netAlpha})`
          ctx.fill()
        }

        for (const [a, b] of frameE) {
          const pa = pfc[a], pb = pfc[b]
          if (!pa || !pb) continue
          const avgZ = (pa.z2 + pb.z2) * 0.5
          const depthAlpha = (0.25 + Math.max(0, (1 - (avgZ + 2) / 4)) * 0.45) * glassPhase
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.moveTo(pa.sx, pa.sy)
          ctx.lineTo(pb.sx, pb.sy)
          ctx.strokeStyle = `rgba(45, 212, 191, ${Math.max(0.15, depthAlpha)})`
          ctx.lineWidth = 2.4
          ctx.stroke()
        }

        for (let i = 0; i < frameV.length; i++) {
          const p = pfc[i]
          if (!p) continue
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, 3.2 * p.sc, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(45, 212, 191, ${0.55 * glassPhase})`
          ctx.fill()
        }
      }

      // ===== 2. INNER CUBE / CHAOS PARTICLES =====
      const faceVis: boolean[] = []
      const faceBr: number[] = []
      for (let i = 0; i < 6; i++) {
        const [nx, ny, nz] = fn[i]
        const nx1 = nx * cosY - nz * sinY
        const nz1 = nx * sinY + nz * cosY
        const ny1 = ny * cosX - nz1 * sinX
        const nz2 = ny * sinX + nz1 * cosX
        const vis = nz2 < 0
        faceVis.push(vis)
        if (vis) {
          const dot = nx1 * light.x + ny1 * light.y + nz2 * light.z
          faceBr.push(0.35 + Math.max(0, -dot) * 0.65)
        } else {
          faceBr.push(0)
        }
      }

      // Mini-cube shared rotation
      const rv = mv.map(([vx, vy, vz]) => {
        const x1 = vx * cosY - vz * sinY
        const z1 = vx * sinY + vz * cosY
        return [x1, vy * cosX - z1 * sinX] as [number, number]
      })
      const vf: { vi: number[]; br: number }[] = []
      for (const f of mf) {
        const nx1 = f.nx * cosY - f.nz * sinY
        const nz1 = f.nx * sinY + f.nz * cosY
        const ny1 = f.ny * cosX - nz1 * sinX
        const nz2 = f.ny * sinX + nz1 * cosX
        if (nz2 < 0) {
          const dot = nx1 * light.x + ny1 * light.y + nz2 * light.z
          vf.push({ vi: f.vi, br: 0.35 + Math.max(0, -dot) * 0.65 })
        }
      }

      // Rotate + depth-sort all mini-cubes
      for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i]
        const s = scatterOffsets[i]
        const e = explodeOffsets[i]
        const xChaos = c.x + s.x * scatterMix + e.x * chaosEase
        const yChaos = c.y + s.y * scatterMix + e.y * chaosEase
        const zChaos = c.z + s.z * scatterMix + e.z * chaosEase
        const x = xChaos
        const y = yChaos
        const z = zChaos
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        sortBuf[i].rx = x1
        sortBuf[i].ry = y * cosX - z1 * sinX
        sortBuf[i].rz = y * sinX + z1 * cosX
      }
      sortBuf.sort((a, b) => b.rz - a.rz)

      const cubeFade = Math.max(0, 1 - smoothstep(0.14, 0.78, reformEase)) * (1 - disperseEase * 0.7)
      if (cubeFade > 0.002) {
        for (const item of sortBuf) {
          const cube = cubes[item.i]
          if (chaosT < 0.2 && cube.face < 6 && !faceVis[cube.face]) continue

          const depth = item.rz + cameraZ
          if (depth < 0.1) continue
          const scale = fov / (fov + depth)
          const drawX = cxBase + item.rx * scale * unitScale
          const drawY = cyBase + item.ry * scale * unitScale
          const pms = ms * scale * unitScale
          if (drawX < -32 || drawX > w + 32 || drawY < -32 || drawY > h + 32) continue

          const baseBr = cube.face < 6 ? faceBr[cube.face] : 0.85
          const br = Math.min(1, baseBr + chaosEase * 0.24)
          ctx.globalAlpha = Math.min(1, br * cubeFade)

          if (chaosT > 0.18 || pms < 3.0 || vf.length === 0) {
            const sz = Math.max(pms * (1.58 + chaosEase * 1.3), 0.56)
            ctx.fillStyle = chaosT > 0.2 ? '#c8fff8' : '#2dd4bf'
            ctx.fillRect(drawX - sz * 0.5, drawY - sz * 0.5, sz, sz)
          } else {
            for (const face of vf) {
              ctx.globalAlpha = Math.min(1, face.br * cubeFade)
              ctx.fillStyle = '#2dd4bf'
              ctx.beginPath()
              for (let fi = 0; fi < 4; fi++) {
                const [ox, oy] = rv[face.vi[fi]]
                if (fi === 0) ctx.moveTo(drawX + ox * pms, drawY + oy * pms)
                else ctx.lineTo(drawX + ox * pms, drawY + oy * pms)
              }
              ctx.closePath()
              ctx.fill()
            }
          }
        }
      }

      // ===== 3. REFERENCE-DRIVEN 2D DIAMOND PARTICLES =====
      if (diamondLoaded && diamondImageData && reformEase > 0.02) {
        const data = diamondImageData
        const morph = smoothstep(0.08, 0.96, reformEase)
        const settle = smoothstep(0.28, 1, reformEase)
        const logoMix = smoothstep(0.08, 0.98, logoEase)
        const mergeSleek = smoothstep(0.12, 0.92, logoMix)
        const explodeMix = smoothstep(0.04, 1.0, disperseEase)
        const explodeRoamMix = smoothstep(0.72, 1, disperseEase)
        const postExplodePersist = smoothstep(0.88, 1, disperseEase)
        const alphaMix = smoothstep(0.06, 0.94, reformEase) * lerp(1 - explodeMix * 0.64, 0.56, postExplodePersist)
        const hoverTarget = isMouseInside ? 1 : 0
        hoverMix += (hoverTarget - hoverMix) * 0.08
        const driftAmp = prefersReducedMotion ? 0 : (w < 768 ? 0.004 : 0.006)
        const repelRadius = (w < 768 ? REPEL_RADIUS * 0.8 : REPEL_RADIUS) * (0.92 + hoverMix * 0.08)
        const halfW = diamondWidth * 0.5
        const halfH = diamondHeight * 0.5
        const logoHalfW = logoWidth * 0.5
        const logoHalfH = logoHeight * 0.5

        bloomCtxA.clearRect(0, 0, bloomCanvasA.width, bloomCanvasA.height)
        bloomCtxB.clearRect(0, 0, bloomCanvasB.width, bloomCanvasB.height)
        bloomCtxA.globalCompositeOperation = 'source-over'
        ctx.globalCompositeOperation = 'source-over'

        for (let i = 0; i < diamondParticles.length; i++) {
          const p = diamondParticles[i]
          const driftScale = 1 - mergeSleek * 0.95
          const driftX = Math.sin(time * 0.24 + p.phase) * driftAmp * driftScale
          const driftY = Math.cos(time * 0.31 + p.phase * 1.12) * driftAmp * 0.7 * driftScale

          let targetBaseX = cxDiamond + p.baseX * halfW + driftX
          let targetBaseY = cyDiamond + p.baseY * halfH + driftY
          if (logoMix > 0.001) {
            const logoX = logoCX + p.logoX * logoHalfW + driftX * 0.4
            const logoY = logoCY + p.logoY * logoHalfH + driftY * 0.4
            targetBaseX = lerp(targetBaseX, logoX, logoMix)
            targetBaseY = lerp(targetBaseY, logoY, logoMix)
          }
          const seedX = sceneCX + p.seedX * unitScale * (1.16 + chaosEase * 0.74)
          const seedY = sceneCY + p.seedY * unitScale * (0.9 + chaosEase * 0.66)
          let targetX = lerp(seedX, targetBaseX, morph)
          let targetY = lerp(seedY, targetBaseY, morph)

          if (explodeMix > 0.001) {
            const ox = p.baseX * 0.9 + p.seedX * 0.6
            const oy = p.baseY * 0.9 + p.seedY * 0.6
            const ol = Math.sqrt(ox * ox + oy * oy) || 1
            const outDist = unitScale * (1.05 + 2.4 * explodeMix)
            const explodeOriginX = lerp(lerp(cxDiamond, logoCX, logoMix), w * 0.5, 0.76)
            const explodeOriginY = lerp(lerp(cyDiamond, logoCY, logoMix), h * 0.52, 0.52)
            const explodeX = explodeOriginX + (ox / ol) * outDist
            const explodeY = explodeOriginY + (oy / ol) * outDist
            targetX = lerp(targetX, explodeX, explodeMix)
            targetY = lerp(targetY, explodeY, explodeMix)

            if (explodeRoamMix > 0.001) {
              const roamSpeed = 0.35 + explodeRoamMix * 0.55
              p.bgNX += p.bgVX * roamSpeed
              p.bgNY += p.bgVY * roamSpeed
              if (p.bgNX < 0) p.bgNX += 1
              else if (p.bgNX > 1) p.bgNX -= 1
              if (p.bgNY < 0) p.bgNY += 1
              else if (p.bgNY > 1) p.bgNY -= 1
              const roamX = p.bgNX * w
              const roamY = p.bgNY * h
              targetX = lerp(targetX, roamX, explodeRoamMix * 0.86)
              targetY = lerp(targetY, roamY, explodeRoamMix * 0.86)
            }
          }

          if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
            p.x = seedX
            p.y = seedY
          }

          const snapK = lerp(lerp(SNAP_STIFFNESS, 0.12, mergeSleek), 0.02, explodeRoamMix)
          const damp = lerp(lerp(SNAP_DAMPING, 0.93, mergeSleek), 0.96, explodeRoamMix)
          p.vx += (targetX - p.x) * snapK
          p.vy += (targetY - p.y) * snapK

          if (isMouseInside && hoverMix > 0.01) {
            const dx = p.x - mouseCanvasX
            const dy = p.y - mouseCanvasY
            const d2 = dx * dx + dy * dy
            const rr = repelRadius * repelRadius
            if (d2 < rr) {
              const dist = Math.sqrt(d2) + 0.001
              const force = Math.pow(1 - dist / repelRadius, 2) * REPEL_STRENGTH * (0.62 + 0.38 * settle)
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
            }
          }

          p.vx *= damp
          p.vy *= damp
          p.x += p.vx
          p.y += p.vy

          if (mergeSleek > 0.04 && explodeMix < 0.02) {
            const nudge = 0.1 + mergeSleek * 0.12
            p.x = lerp(p.x, targetBaseX, nudge)
            p.y = lerp(p.y, targetBaseY, nudge)
          }

          const shapeCX = logoMix > 0.52 ? logoCX : cxDiamond
          const shapeCY = logoMix > 0.52 ? logoCY : cyDiamond
          const shapeHalfW = logoMix > 0.52 ? logoHalfW : halfW
          const shapeHalfH = logoMix > 0.52 ? logoHalfH : halfH
          const shapeData = logoMix > 0.52 && logoImageData ? logoImageData : data
          const nx = (p.x - shapeCX) / shapeHalfW
          const ny = (p.y - shapeCY) / shapeHalfH
          if (settle > 0.14 && explodeMix < 0.08 && !inMask(nx, ny, shapeData)) {
            const clamped = clampToMask(nx, ny, shapeData)
            p.x = shapeCX + clamped.nx * shapeHalfW
            p.y = shapeCY + clamped.ny * shapeHalfH
            p.vx *= 0.42
            p.vy *= 0.42
          }

          if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) continue

          const tone = lerp(p.tone, p.logoTone, logoMix)
          const hue = 176
          const sat = 66
          const lightness = Math.min(80, 54 + tone * 18)
          const alpha = alphaMix * (0.36 + tone * 0.44) * p.localAlpha
          const size = p.size * (0.55 + tone * 0.44 + explodeMix * 0.34)
          const px = Math.round(p.x * 2) / 2
          const py = Math.round(p.y * 2) / 2

          ctx.globalAlpha = alpha
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lightness}%)`
          ctx.fillRect(px - size * 0.5, py - size * 0.5, size, size)

          if ((i % 7) === 0 && tone > 0.2) {
            bloomCtxA.globalAlpha = alphaMix * (0.08 + tone * 0.28) * (1 - explodeMix * 0.45)
            bloomCtxA.fillStyle = 'rgba(45,212,191,1)'
            const bs = size * (2.6 + tone * 1.3)
            const bx = px * bloomScale
            const by = py * bloomScale
            const bsz = bs * bloomScale
            bloomCtxA.fillRect(bx - bsz * 0.5, by - bsz * 0.5, bsz, bsz)
          }

          // Keep the reform shape crisp and definite; no RGB jitter pass.
        }

        const blurA = w < 768 ? 3 : 5
        const blurB = w < 768 ? 1.5 : 2.5
        bloomCtxB.clearRect(0, 0, bloomCanvasB.width, bloomCanvasB.height)
        bloomCtxB.filter = `blur(${blurA}px)`
        bloomCtxB.drawImage(bloomCanvasA, 0, 0)
        bloomCtxB.filter = 'none'
        bloomCtxA.clearRect(0, 0, bloomCanvasA.width, bloomCanvasA.height)
        bloomCtxA.filter = `blur(${blurB}px)`
        bloomCtxA.drawImage(bloomCanvasB, 0, 0)
        bloomCtxA.filter = 'none'

        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = Math.min(1, alphaMix * BLOOM_INTENSITY)
        ctx.drawImage(bloomCanvasA, 0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      isDisposed = true
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (transitionFrameRef.current) cancelAnimationFrame(transitionFrameRef.current)
    }
  }, [])

  const handleSeeMore = () => {
    if (isSeeMoreTransitioning) return

    const duration = 2200
    setIsMobileMenuOpen(false)
    setIsSeeMoreTransitioning(true)
    setTransitionProgress(0)
    transitionStartRef.current = null

    const step = (now: number) => {
      if (transitionStartRef.current === null) transitionStartRef.current = now
      const elapsed = now - transitionStartRef.current
      const t = Math.min(1, elapsed / duration)
      setTransitionProgress(t)
      if (t < 1) {
        transitionFrameRef.current = requestAnimationFrame(step)
        return
      }
      router.push('/more')
    }

    transitionFrameRef.current = requestAnimationFrame(step)
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-teal-400 selection:text-black font-sans relative">

      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
        <div className="absolute inset-0 max-w-7xl mx-auto flex justify-between px-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent" />
          ))}
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="relative z-50">
            <img src="/logo.png" alt="JP Automations - AI infrastructure for service businesses" className="h-11 md:h-16 w-auto hover:opacity-80 transition-opacity" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            <a href="/free-resources" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Free Resources</a>
            <AppsDropdown />
            <a href="/apply" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">
              Book a Call
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
          >
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* --- MOBILE FULLSCREEN MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/blog" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </a>
          <a href="/free-resources" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            Free Resources
          </a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          <a href="/apply" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            Book a Call
          </a>
        </div>
      </div>

      <div ref={cubeLayerRef} className="hero-cube-layer">
        <canvas ref={cubeRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>

      <div className="story-copy-overlay fixed inset-0 z-20 pointer-events-none">
        <div ref={heroCopyRef} className="absolute inset-0 flex items-center py-20 md:py-24 lg:py-20 translate-y-2 md:translate-y-3">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-8">
            <div className="w-full md:max-w-[52%] lg:max-w-[48%] text-center md:text-left flex flex-col items-center md:items-start pointer-events-auto gap-5 md:gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 21l-.406-1.423a2.25 2.25 0 00-1.545-1.545L14.885 17.625l1.423-.406a2.25 2.25 0 001.545-1.545L18.259 14.25l.406 1.423a2.25 2.25 0 001.545 1.545l1.423.406-1.423.406a2.25 2.25 0 00-1.545 1.545L18.259 21z" />
                </svg>
                <span className="text-xs md:text-sm font-medium text-gray-300 tracking-wide leading-tight">For service businesses doing £250+/year</span>
              </div>
              <h1 className="sr-only">AI Automation Agency for UK Service Businesses</h1>
              <p className="text-[clamp(2.15rem,6.5vw,5rem)] font-bold tracking-tight text-white leading-[1.04]">
                Build the Core.
                <br />
                <span className="text-teal-400">Simplify the Growth.</span>
              </p>
              <p className="text-base md:text-lg text-gray-400 max-w-[36rem] leading-relaxed">
              Your business has thousands of moving parts.
     Right now, you&apos;re the one holding them all together.
     We build the structure that does it instead.
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-1">
                <a
                  href="/apply"
                  className="group inline-flex items-center gap-2 px-8 md:px-9 py-4 md:py-[1.125rem] bg-teal-400 text-black rounded-xl font-bold text-base md:text-lg hover:bg-teal-300 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_40px_rgba(45,212,191,0.4)]"
                >
                  Book a Call
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <button
                  type="button"
                  onClick={handleSeeMore}
                  disabled={isSeeMoreTransitioning}
                  className="group inline-flex items-center gap-2 px-8 md:px-9 py-4 md:py-[1.125rem] border border-teal-400/45 text-teal-300 rounded-xl font-bold text-base md:text-lg hover:bg-teal-400/10 hover:text-teal-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(45,212,191,0.08)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Main Page
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={workplaceCopyRef} className="absolute inset-0 flex items-center justify-end px-6 md:pr-16">
          <div className="w-full md:w-[42%] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md p-5 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-xs md:text-sm uppercase tracking-[0.24em] text-teal-300/80 mb-4">The Asset</p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100">
            Right now your business looks solid from the outside.
            </p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100 mt-5">
            But look closer; thousands of individual parts across 
every corner of your operation, each one depending on 
you to hold it in place.
            </p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100 mt-5">
            A real asset doesn&apos;t need a hand to hold it together.
It&apos;s built to stay in formation with or without you.
            </p>
          </div>
        </div>

        <div ref={chaosCopyRef} className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <p className="text-base md:text-2xl uppercase tracking-[0.24em] text-teal-300/80 mb-4">The Chaos</p>
            <p className="text-base md:text-2xl lg:text-3xl font-semibold leading-relaxed text-white">
            The moment pressure hits, the pieces scatter.
            </p>
            <p className="text-base md:text-2xl lg:text-3xl font-semibold leading-relaxed text-white mt-5">
            Across operations. Across admin. Across every system 
            you&apos;ve been holding together through sheer presence.
            </p>
            <p className="text-base md:text-2xl lg:text-3xl font-semibold leading-relaxed text-white mt-5">
            This is what a business built on the owner looks like 
when the pressure gets too high. Not broken, just 
unstructured. One shift away from snapping into something 
far more powerful.
            </p>
          </div>
        </div>

        <div ref={diamondCopyRef} className="absolute inset-0 flex items-center justify-start px-6 md:pl-16">
          <div className="w-full md:w-[38%] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md p-5 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-xs md:text-sm tracking-[0.16em] text-teal-300/80 mb-4">Pressure creates Clarity</p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100">
            Fragments don&apos;t have to stay scattered.
            </p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100 mt-5">
            Under the right pressure, they compress. They align.
They form something harder, more precise, and more 
valuable than what existed before.
            </p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100 mt-5">
            We take every part of your business that&apos;s leaking time 
or money, and forge it into infrastructure that holds.
Permanently.
            </p>
          </div>
        </div>

        <div ref={logoCopyRef} className="absolute inset-0 flex items-center justify-end px-6 md:pr-16">
          <div className="w-full md:w-[40%] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md p-5 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] pointer-events-auto">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-teal-300/80 mb-4">Welcome to JP Automations.</p>
            <p className="text-sm md:text-lg leading-relaxed text-gray-100">
              <span className="block">
                Your partner in capitalizing and growing your business in the new age of Artificial Intelligence.
              </span>
              <span className="block mt-3">
                We don&apos;t just build systems; we architect the forever-improving infrastructure for your next level of growth.
              </span>
            </p>
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <a
                href="/apply"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-teal-400 text-black rounded-xl font-bold text-sm md:text-base hover:bg-teal-300 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_40px_rgba(45,212,191,0.4)]"
              >
                Book a Call
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <button
                type="button"
                onClick={handleSeeMore}
                disabled={isSeeMoreTransitioning}
                className="group inline-flex items-center gap-2 px-7 py-3.5 border border-teal-400/45 text-teal-300 rounded-xl font-bold text-sm md:text-base hover:bg-teal-400/10 hover:text-teal-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(45,212,191,0.08)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                See More
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- HERO SECTION --- */}
      <section id="hero" ref={heroSectionRef} className="relative min-h-screen z-10">
        <p className="sr-only">
          JP Automations builds bespoke AI automation infrastructure for service businesses doing £15k+ per month.
        </p>
      </section>

      <section id="story" ref={storySectionRef} className="relative z-10 h-[210vh]" />

      {/* --- FOOTER --- */}
      <footer className="relative z-10 px-6 pt-8 pb-10 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a href="https://www.instagram.com/jpautomations/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com/@jpautomations?si=HTkaJJYnbck-d7rQ" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/james-harvey-0583b2370/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com/JamesHarve24282" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
          <div className="text-center md:text-right">
            <a href="mailto:jp@jpautomations.com" className="block text-gray-400 hover:text-teal-400 transition-colors mb-2 text-sm">jp@jpautomations.com</a>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} JP Automations. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SeeMoreTransitionOverlay active={isSeeMoreTransitioning} progress={transitionProgress} />

      <style jsx>{`
  .hero-cube-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 8;
    opacity: 0.3;
    will-change: transform;
  }
  @media (min-width: 768px) {
    .hero-cube-layer {
      opacity: 1;
    }
  }

  .story-copy-overlay > div {
    will-change: transform, opacity;
  }
`}</style>

    </main>
  )
}
