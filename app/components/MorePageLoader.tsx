"use client"

type MorePageLoaderProps = {
  show: boolean
  durationMs?: number
}

export default function MorePageLoader({ show, durationMs = 800 }: MorePageLoaderProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-[90] bg-[#040809] flex items-center justify-center px-6" aria-live="polite">
      <div className="w-[min(86vw,520px)]">
        <p className="text-[11px] uppercase tracking-[0.24em] text-teal-300/80 mb-4 text-center">
          Loading
        </p>
        <div className="h-2 rounded-full border border-teal-400/35 bg-white/5 overflow-hidden">
          <div
            className="loader-fill h-full bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.65)]"
            style={{ animationDuration: `${durationMs}ms` }}
          />
        </div>
      </div>

      <style jsx>{`
        .loader-fill {
          width: 0%;
          animation-name: fill;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: forwards;
        }
        @keyframes fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
