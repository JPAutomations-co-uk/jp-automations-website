"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClient } from "@/app/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  tokenBalance: number
  loading: boolean
  refreshBalance: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tokenBalance: 0,
  loading: true,
  refreshBalance: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const refreshBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/tokens/balance")
      if (res.ok) {
        const data = await res.json()
        setTokenBalance(data.balance ?? 0)
      }
    } catch {
      // Silently fail — balance will show 0
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) refreshBalance()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    let subscription: { unsubscribe: () => void } | null = null
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) refreshBalance()
        else setTokenBalance(0)
      })
      subscription = data.subscription
    } catch {
      // Auth listener failed — non-critical on public pages
    }

    return () => subscription?.unsubscribe()
  }, [supabase.auth, refreshBalance])

  return (
    <AuthContext.Provider value={{ user, tokenBalance, loading, refreshBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
