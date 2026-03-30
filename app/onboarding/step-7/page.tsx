"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingStep7Redirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/onboarding/complete")
  }, [router])
  return null
}
