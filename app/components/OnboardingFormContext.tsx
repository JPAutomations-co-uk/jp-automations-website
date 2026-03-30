"use client"

import { createContext, useContext, useState } from "react"

export type PlatformProfileData = {
  tone: string
  copyExamples: string[]
  exampleImageUrls: string[]
  cta: string
  goals: string
  frequency: number
}

export type OnboardingData = {
  // Step 1: Business Basics
  useCase: string
  businessName: string
  websiteUrl: string
  location: string
  // Step 2: Your Market
  industry: string
  targetAudience: string
  // Step 3: Your Offers & Goals
  offers: string
  usp: string
  primaryCta: string
  goals: string
  desiredOutcomes: string
  // Step 4: Your Voice
  tone: string
  voiceTraits: string[]
  voiceSample: string
  copyExample2: string
  copyExample3: string
  writingRhythm: string
  bannedWords: string
  // Step 5: Social & Proof
  instagramHandle: string
  xHandle: string
  linkedinHandle: string
  proofPoints: string
  contentPillars: string[]
  // Step 6: Platform Selection
  selectedPlatforms: string[]
  // Step 7: Per-Platform Profiles
  platformProfiles: Record<string, PlatformProfileData>
  // Step 8: X Content Preferences
  xWritingStyle: string
  xHookStyle: string
  xPostLengthPreference: string
  xHashtagPreference: boolean
  xBannedWords: string
  xCtaPreference: string
  xCurrentFollowers: string
  xGrowthGoal: string
  xSecondaryMetric: string
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
  useCase: "business",
  businessName: "JP Automations",
  websiteUrl: "https://jpautomations.co.uk",
  location: "Birmingham, UK",
  industry: "Tech & SaaS",
  targetAudience: "UK service businesses doing £15k+/month who want to scale without hiring. They're overwhelmed by manual processes, inconsistent lead flow, and spending too much time on admin instead of growth.",
  offers: "We build bespoke AI automation infrastructure for service businesses doing £15k+/month. Full audit of operations, then custom-built systems across lead gen, follow-up, admin, content, and client delivery. Not software subscriptions — engineered infrastructure that runs without the owner.",
  usp: "We don't sell software or templates. We architect connected systems across the entire business — lead gen, follow-up, admin, content, delivery — all engineered to run without the owner. Average client reclaims 25+ hours/week and recovers their investment within 90 days.",
  primaryCta: "Book a free systems audit call",
  goals: "Lead Generation",
  desiredOutcomes: "Book 10+ qualified discovery calls per month from content. Position as the go-to AI automation agency for UK service businesses.",
  tone: "Direct",
  voiceTraits: ["Contrarian", "Data-backed", "Blunt / no-sugarcoating", "Subtle wit / dry humour"],
  voiceSample: "Your business has thousands of moving parts. Right now, you're the one holding them all together. We build the structure that does it instead. Most service businesses don't have a growth problem. They have a systems problem disguised as a growth problem.",
  copyExample2: "",
  copyExample3: "",
  writingRhythm: "mixed",
  bannedWords: "",
  instagramHandle: "@jpautomations",
  xHandle: "@jpautomations",
  linkedinHandle: "jpautomations",
  proofPoints: "45+ hours reclaimed per week across clients. £10,000+ recovered in month one. From no pipeline to paid deal in 24 hours. 5x sales revenue increase. Systems live within 14 days. 100% client success rate.",
  contentPillars: ["Behind the scenes", "Tips & education", "Client results", "Industry trends"],
  selectedPlatforms: ["linkedin", "instagram", "x"],
  platformProfiles: {
    linkedin: {
      tone: "Bold",
      copyExamples: [
        "Your business has thousands of moving parts. Right now, you're the one holding them all together. We build the structure that does it instead. A real asset doesn't need a hand to hold it together. It's built to stay in formation with or without you.",
        "Everyone's talking about AI. Almost nobody's using it properly. The gap between AI as a toy and AI as infrastructure is massive. We build the infrastructure side.",
      ],
      exampleImageUrls: [],
      cta: "Book a free systems audit — link in bio",
      goals: "Lead Generation",
      frequency: 5,
    },
    instagram: {
      tone: "Direct",
      copyExamples: [
        "Still doing everything yourself? That's not a business. That's a job with extra steps. We build the systems that let you step back.",
      ],
      exampleImageUrls: [],
      cta: "Link in bio → free systems audit",
      goals: "Brand Awareness",
      frequency: 4,
    },
    x: {
      tone: "Witty",
      copyExamples: [
        "Service businesses don't have a growth problem. They have a 'the owner is the system' problem. Fix that and growth is inevitable.",
      ],
      exampleImageUrls: [],
      cta: "DM me \"audit\"",
      goals: "Thought Leadership",
      frequency: 7,
    },
  },
  xWritingStyle: "short punchy sentences",
  xHookStyle: "bold claim",
  xPostLengthPreference: "medium",
  xHashtagPreference: false,
  xBannedWords: "hustle, grind, 10x",
  xCtaPreference: "reply with your thoughts",
  xCurrentFollowers: "500",
  xGrowthGoal: "500 → 5000 followers in 6 months",
  xSecondaryMetric: "impressions, replies per post",
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
