"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PlannerRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/instagram")
  }, [router])
  return null
}
