import { OnboardingProvider } from "@/app/components/OnboardingFormContext"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}
