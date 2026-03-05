"use client"

import { createContext, useContext, useState } from "react"

export type OnboardingData = {
  // Step 1: Business Basics
  businessName: string
  websiteUrl: string
  location: string
  // Step 2: Your Market
  industry: string
  targetAudience: string
  // Step 3: Your Offers
  offers: string
  usp: string
  primaryCta: string
  // Step 4: Your Voice
  tone: string
  voiceSample: string
  // Step 5: Social & Proof
  instagramHandle: string
  xHandle: string
  linkedinHandle: string
  proofPoints: string
  contentPillars: string[]
  // Stripe metadata (optional — only populated for paid users)
  stripeCustomerId: string
  tier: string
  billingCycle: string
  email: string
}

type OnboardingContextType = {
  data: OnboardingData
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void
  updateFields: (fields: Partial<OnboardingData>) => void
}

const defaultData: OnboardingData = {
  businessName: "",
  websiteUrl: "",
  location: "",
  industry: "",
  targetAudience: "",
  offers: "",
  usp: "",
  primaryCta: "",
  tone: "",
  voiceSample: "",
  instagramHandle: "",
  xHandle: "",
  linkedinHandle: "",
  proofPoints: "",
  contentPillars: [],
  stripeCustomerId: "",
  tier: "",
  billingCycle: "",
  email: "",
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData)

  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateFields = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }))
  }

  return (
    <OnboardingContext.Provider value={{ data, updateField, updateFields }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
