import type { Metadata } from "next"
import BristolClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Bristol",
  description:
    "AI automation for Bristol tradespeople. Live job costing, CIS automation, invoice systems. One Bristol builder's margins went from 8% to 16%.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-bristol",
  },
}

export default function Page() {
  return <BristolClient />
}
