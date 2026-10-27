import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { businessData } from "@/lib/business-data";
import AnalyticsProvider from "@/app/components/AnalyticsProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent render blocking
  preload: false, // Don't preload to reduce initial load
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Prevent render blocking
  preload: false, // Don't preload to reduce initial load
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.keyfoby.com"),
  title: businessData.seo.title,
  description: businessData.seo.description,
  authors: [{ name: businessData.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.keyfoby.com",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/images/KeyFoby-logo/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/KeyFoby-logo/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/KeyFoby-logo/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/images/KeyFoby-logo/favicons/site.webmanifest",
      },
    ],
  },
  manifest: "/images/KeyFoby-logo/favicons/site.webmanifest",
  openGraph: {
    title: businessData.seo.openGraph.title,
    description: businessData.seo.openGraph.description,
    url: "https://www.keyfoby.com",
    siteName: businessData.name,
    images: [
      {
        url: businessData.seo.openGraph.image,
        width: 1200,
        height: 630,
        alt: businessData.seo.openGraph.imageAlt,
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: businessData.seo.openGraph.title,
    description: businessData.seo.openGraph.description,
    images: [businessData.seo.openGraph.image],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className="scroll-smooth">
      <head>
        {/* Fonts are self-hosted by next/font, so no Google Fonts preconnect */}
        {/* Preload critical hero image for faster LCP */}
        <link
          rel="preload"
          href="/images/herobannerKF.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* The one business entity (Locksmith, @id /#business) for every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessData.seo.schema),
          }}
        />
        <AnalyticsProvider>{children}</AnalyticsProvider>

        {/* Google tag (gtag.js) - loads the shared gtag library once for
            both Google Ads (AW-) and Google Analytics 4 (G-) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17289404018"
          strategy="afterInteractive"
        />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Google Ads conversion tracking
            gtag('config', 'AW-17289404018');
            gtag('event', 'conversion', {'send_to': 'AW-17289404018/xI8ECM7q0ZEcEPK8nbRA'});

            // Google Analytics 4 (GA4)
            gtag('config', 'G-BDZE2T9HR0');
          `}
        </Script>
      </body>
    </html>
  );
}
