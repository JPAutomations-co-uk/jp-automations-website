import type { Metadata } from "next"
import { FormProvider } from "@/app/components/FormContext";

export const metadata: Metadata = {
  title: "Apply for a Free Systems Audit",
  description:
    "Apply for a free AI automation audit. We'll map where time and money are leaking in your service business and show you exactly what we'd build to fix it. No obligation.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apply",
  },
  openGraph: {
    title: "Apply for a Free Systems Audit | JP Automations",
    description:
      "Tell us about your business. We'll identify your highest-leverage automation opportunities and show you exactly what we'd build — free, no obligation.",
    url: "https://www.jpautomations.co.uk/apply",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Apply+for+a+Free+Systems+Audit&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "Apply for a Free Systems Audit — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for a Free Systems Audit",
    description:
      "Tell us about your business. We'll identify your highest-leverage automation opportunities — free, no obligation.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Apply+for+a+Free+Systems+Audit&subtitle=JP+Automations"],
  },
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormProvider>{children}</FormProvider>;
}
