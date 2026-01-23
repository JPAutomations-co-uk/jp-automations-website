"use client"

export default function LoadingOverlay({ show }: { show: boolean }) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/7da8dc45-9797-406e-b048-cefa5bdd204b", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "app/components/LoadingOverlay.tsx:3",
      message: "LoadingOverlay render",
      data: { show },
      timestamp: Date.now(),
    }),
  }).catch(() => {})
  // #endregion agent log

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1618] flex flex-col items-center justify-center">

      {/* Logo */}
      <div className="mb-10 animate-logo-in">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Loading bar */}
      <div className="w-56 h-1 bg-gray-700 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-white animate-progress-fill" />
      </div>

      {/* Google + stars */}
      <div className="text-center text-white animate-proof-in">
        <p className="mb-3 text-lg tracking-wide">Google</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="text-2xl text-yellow-400 opacity-0 animate-star-pop"
              style={{ animationDelay: `${1.4 + i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
