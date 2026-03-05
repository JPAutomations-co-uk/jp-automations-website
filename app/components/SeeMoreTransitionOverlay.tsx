"use client"

type SeeMoreTransitionOverlayProps = {
  active: boolean
  progress: number
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export default function SeeMoreTransitionOverlay({ active, progress }: SeeMoreTransitionOverlayProps) {
  if (!active) return null

  const p = clamp01(progress)
  const logoIn = smoothstep(0.02, 0.2, p)
  const logoOut = 1 - smoothstep(0.82, 1, p)
  const logoOpacity = Math.max(0, Math.min(1, logoIn * logoOut))

  return (
    <div className="fixed inset-0 z-[120] bg-[#040809] pointer-events-auto flex items-center justify-center px-6">
      <div className="text-center">
        <img
          src="/Browser-logo.png"
          alt="JP Automations logo"
          className="w-[min(54vw,360px)] h-auto mx-auto"
          style={{
            opacity: logoOpacity,
            transform: `translateY(${(1 - logoIn) * 8}px) scale(${0.985 + logoIn * 0.015})`,
            filter: "brightness(1.14) contrast(1.06)"
          }}
        />

        <div className="mt-5 flex items-center justify-center gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => {
            const start = 0.2 + i * 0.08
            const end = start + 0.12
            const starIn = smoothstep(start, end, p)
            return (
              <span
                key={i}
                className="text-[34px] md:text-[42px] text-white"
                style={{
                  opacity: starIn,
                  transform: `translateY(${(1 - starIn) * 6}px) scale(${0.66 + starIn * 0.34})`,
                  filter: `drop-shadow(0 0 ${4 + starIn * 10}px rgba(255,255,255,0.7))`
                }}
              >
                ★
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
