import "./globals.css"

import type { Metadata } from "next"
import { Barlow, Barlow_Condensed, DM_Mono } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/app/components/AuthProvider"
import NewsletterPopup from "@/app/components/NewsletterPopup"

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800"],
})

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: "AI Automation for UK Trades | JP Automations",
    template: "%s | JP Automations",
  },
  description:
    "AI automation systems for UK tradespeople. Invoice automation, AI call handling, compliance, lead generation — built bespoke, live in 14 days, 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk",
    languages: {
      "en-GB": "https://www.jpautomations.co.uk",
    },
  },
  openGraph: {
    title: "AI Automation for UK Trades | JP Automations",
    description:
      "Custom AI automation for UK tradespeople. One client recovered £10k in month one. 25+ hours reclaimed per week. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk",
    siteName: "JP Automations",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Trades&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "JP Automations — AI Automation for UK Trades",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for UK Trades | JP Automations",
    description:
      "Custom AI automation for UK tradespeople. One client recovered £10k in month one. 25+ hours reclaimed per week.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Trades&subtitle=JP+Automations"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JP Automations",
  url: "https://www.jpautomations.co.uk",
  description: "AI automation systems for UK tradespeople — roofers, plumbers, electricians, builders, and landscapers.",
  publisher: {
    "@type": "Organization",
    name: "JP Automations",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Automations",
  alternateName: "JP Automations AI Agency",
  description:
    "UK AI automation agency for tradespeople and service businesses. We build bespoke systems for roofers, plumbers, electricians, builders, and landscapers — automating invoicing, call handling, follow-ups, and compliance. 90-day ROI guarantee.",
  url: "https://www.jpautomations.co.uk",
  logo: "https://www.jpautomations.co.uk/logo.png",
  image: "https://www.jpautomations.co.uk/og-image.png",
  email: "jp@jpautomations.com",
  founder: {
    "@type": "Person",
    name: "JP",
    url: "https://www.linkedin.com/in/james-harvey-0583b2370/",
    jobTitle: "Founder & AI Architect",
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
    { "@type": "City", name: "Bristol" },
    { "@type": "City", name: "Sheffield" },
    { "@type": "City", name: "Liverpool" },
    { "@type": "City", name: "Newcastle" },
  ],
  serviceType: [
    "AI Automation for Tradespeople",
    "Invoice Automation for Trades",
    "AI Call Handling for Tradesmen",
    "Compliance Automation for Electricians",
    "CIS Automation for Builders",
    "Quote Follow-Up Automation",
    "Review Collection Automation",
    "Maintenance Plan Automation for Landscapers",
  ],
  priceRange: "££",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "4",
    reviewCount: "4",
  },
  sameAs: [
    "https://www.instagram.com/jpautomations/",
    "https://youtube.com/@jpautomations",
    "https://www.linkedin.com/in/james-harvey-0583b2370/",
    "https://x.com/JamesHarve24282",
  ],
  knowsAbout: [
    "AI Automation for Roofers",
    "AI Automation for Plumbers",
    "AI Automation for Electricians",
    "AI Automation for Builders",
    "AI Automation for Landscapers",
    "Invoice Automation UK Trades",
    "AI Call Handling Tradesmen",
    "CIS Automation Contractors",
    "NICEIC Compliance Automation",
    "Maintenance Contract Automation",
    "Business Process Automation UK",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Automation for UK Trades",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Invoice & Payment Automation",
          description: "Automated invoicing on job completion with payment reminders at 7, 14, and 21 days. One client reduced outstanding from £8,400 to £320.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Call Handling",
          description: "AI system that answers every call, qualifies the job, texts the customer, and logs details. Eliminated 60%+ missed calls for a heating engineer.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Compliance & Admin Automation",
          description: "Automated certificates, building control notifications, CIS returns, and VAT prep. Cut admin from 8 hours to 30 minutes per week.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Live Job Costing & CIS Management",
          description: "Real-time job cost tracking, subcontractor payment statements, and automated CIS monthly returns. Improved margins from 8% to 16%.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Maintenance Plan Engine",
          description: "Automated recurring maintenance offers, scheduling, and invoicing. Built £3,995/month in recurring revenue for a landscaping company.",
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
      <body className={`${barlow.variable} ${barlowCondensed.variable} ${dmMono.variable} antialiased`}>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
