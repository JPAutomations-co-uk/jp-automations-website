export default function BookCallPage() {
    return (
        <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center overflow-hidden px-6">
  <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"></section>
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]" />
      
        {/* Vertical line texture */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
        <section className="relative z-10 max-w-5xl text-center py-32">
      
          {/* Top label */}
          <p className="text-[18px] tracking-[0.35em] text--400 mb-10">
            JPAUTOMATIONS
          </p>
      
          {/* Headline */}
          <h1 className="text-[42px] md:text-[64px] font-extrabold text-white leading-[1.05] mb-10">
            FREE  <span className="text-teal-400">30-MINUTE</span> DISCOVERY <br />
            CALL
          </h1>
      
          {/* Description */}
          <p className="text-gray-400 max-w-3xl mx-auto text-[18px] leading-[1.7] mb-14">
          Claim your free, no-obligation Digital Growth Map discovery call. We’ll identify growth opportunities and build a clear plan to scale your business efficiently. If you’re serious about growth, book your call today.
          </p>
      
          {/* Button */}
            <a
              href="/apply"
              className="inline-flex items-center gap-1 mt-1 px-8 py-4 border border-teal-200 text-teal-100 rounded-xl hover:bg-teal-200 hover:text-black transition"
            >
              Book Your Call →
          </a>
        </section>
      </main>
    )
}      