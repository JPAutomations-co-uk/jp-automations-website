import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/app/components/AuthProvider"
import NewsletterPopup from "@/app/components/NewsletterPopup"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "JP Automations | AI Automation Agency for UK Service Businesses",
    template: "%s | JP Automations",
  },
  description:
    "We build bespoke AI automation systems for UK service businesses doing £15k+/month. 25+ hours reclaimed per week. ROI within 90 days. Systems live in 30 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk",
    languages: {
      "en-GB": "https://www.jpautomations.co.uk",
    },
  },
  openGraph: {
    title: "JP Automations | AI Automation Agency for UK Service Businesses",
    description:
      "Custom AI automation systems for UK service businesses. One client recovered £10k in month one. 25+ hours reclaimed per week. Book a free audit.",
    url: "https://www.jpautomations.co.uk",
    siteName: "JP Automations",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Service+Businesses&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "JP Automations — AI Infrastructure for UK Service Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JP Automations | AI Automation Agency for UK Service Businesses",
    description:
      "Custom AI automation systems for UK service businesses. One client recovered £10k in month one.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Service+Businesses&subtitle=JP+Automations"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Automations",
  alternateName: "JP Automations AI Agency",
  description:
    "UK AI agency building bespoke automation systems for service businesses. We design and implement AI-powered lead generation, invoicing, CRM, and operations automation. 25+ hours reclaimed per week. ROI within 90 days.",
  url: "https://www.jpautomations.co.uk",
  logo: "https://www.jpautomations.co.uk/logo.png",
  image: "https://www.jpautomations.co.uk/og-image.png",
  email: "jp@jpautomations.com",
  telephone: "",
  founder: {
    "@type": "Person",
    name: "James Harvey",
    url: "https://www.linkedin.com/in/james-harvey-0583b2370/",
    jobTitle: "Founder",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
    addressRegion: "United Kingdom",
  },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "City", name: "London" },
    { "@type": "City", name: "Manchester" },
    { "@type": "City", name: "Birmingham" },
    { "@type": "City", name: "Leeds" },
  ],
  serviceType: [
    "AI Automation Agency",
    "Business Process Automation",
    "AI Consulting",
    "Lead Generation Automation",
    "CRM Automation",
    "Invoice Automation",
    "WhatsApp Automation",
    "AI Phone Answering",
  ],
  priceRange: "££",
  sameAs: [
    "https://www.instagram.com/jpautomations/",
    "https://youtube.com/@jpautomations",
    "https://www.linkedin.com/in/james-harvey-0583b2370/",
    "https://x.com/JamesHarve24282",
  ],
  knowsAbout: [
    "AI Automation",
    "AI Agency",
    "Business Process Automation",
    "Lead Generation Automation",
    "CRM Automation",
    "Invoice Automation",
    "WhatsApp Business Automation",
    "AI for Service Businesses",
    "AI for Tradespeople",
    "Workflow Automation UK",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Automation Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lead Generation & Enquiry Automation",
          description: "Automated lead capture, qualification, and follow-up for UK service businesses.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Invoice & Payment Automation",
          description: "Automated invoicing, payment reminders, and cash flow recovery systems.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "CRM & Operations Automation",
          description: "End-to-end job management, scheduling, and client communication automation.",
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-08MCS0VY3Z"
          strategy="afterInteractive"
        />
        <Script
          id="ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-08MCS0VY3Z');`,
          }}
        />
        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','844229000128283');fbq('track','PageView');`,
          }}
        />
        {/* Microsoft Clarity */}
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","vmw5xsb30i");`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AuthProvider>{children}</AuthProvider>
        <NewsletterPopup />
      </body>
    </html>
  )
}
