"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile && data.profile.onboarding_complete === false) {
          router.push("/onboarding")
        }
      })
      .catch(() => {
        // On network/auth error, don't block — let the page handle its own auth state
      })
  }, [router])

  return <>{children}</>
}
