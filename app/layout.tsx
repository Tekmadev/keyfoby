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
  keywords: businessData.seo.keywords.join(", "),
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
        alt: "KeyFoby Keys - Professional Key Fob and Locksmith Services in Hamilton",
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
    creator: "@KeyFoby",
    site: "@KeyFoby",
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
        {/* DNS prefetch for external domains - non-blocking */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to CDN for faster asset loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

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
        {/* Structured Data for SEO - Moved to body to prevent render blocking */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessData.seo.schema),
          }}
        />
        <AnalyticsProvider>{children}</AnalyticsProvider>

        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17289404018"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17289404018');
            gtag('event', 'conversion', {'send_to': 'AW-17289404018/xI8ECM7q0ZEcEPK8nbRA'});
          `}
        </Script>
      </body>
    </html>
  );
}
