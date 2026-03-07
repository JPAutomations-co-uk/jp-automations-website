"use client"

import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

type FormStepLayoutProps = {
  title: string
  subtitle?: string
  step: number
  totalSteps: number
  children: React.ReactNode
}

export default function FormStepLayout({
  title,
  subtitle,
  step,
  totalSteps,
  children,
}: FormStepLayoutProps) {
  const progress = (step / totalSteps) * 100

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.04),transparent_70%)]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)" }}
      />

      {/* Animated progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/[0.06]">
        <motion.div
          className="h-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease }}
        />
      </div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 w-full max-w-3xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease }}
          className="text-xs uppercase tracking-[0.2em] text-teal-400/60 font-semibold mb-4"
        >
          Step {step} of {totalSteps}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease }}
          className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
            className="text-gray-400 text-lg mb-12"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
        >
          {children}
        </motion.div>
      </motion.section>
    </main>
  )
}
