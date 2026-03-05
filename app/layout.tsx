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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JP Automations",
  description:
    "We build bespoke AI automation systems for UK service businesses doing £15k+/month. 25+ hours reclaimed per week. ROI within 90 days.",
  url: "https://www.jpautomations.co.uk",
  logo: "https://www.jpautomations.co.uk/logo.png",
  image: "https://www.jpautomations.co.uk/og-image.png",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  priceRange: "££",
  knowsAbout: [
    "AI Automation",
    "Business Process Automation",
    "Lead Generation Automation",
    "CRM Automation",
    "Invoice Automation",
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AuthProvider>{children}</AuthProvider>
        <NewsletterPopup />
      </body>
    </html>
  )
}
