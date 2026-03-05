import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      animation: {
        "logo-in": "logoIn 0.6s ease-out forwards",
        "progress-fill": "progressFill 2s ease-in-out forwards",
        "proof-in": "proofIn 0.4s ease-out forwards",
        "star-pop": "starPop 0.3s ease-out forwards",
      },
      keyframes: {
        logoIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        proofIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        starPop: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
}

export default config