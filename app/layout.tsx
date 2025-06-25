import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { businessData } from "@/lib/business-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://keyfoby.com"),
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
    canonical: "https://keyfoby.com",
  },
  icons: {
    icon: [
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
      { url: "/images/KeyFoby-logo/favicons/favicon.ico", sizes: "any" },
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
        rel: "android-chrome-192x192",
        url: "/images/KeyFoby-logo/favicons/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/images/KeyFoby-logo/favicons/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/images/KeyFoby-logo/favicons/site.webmanifest",
  openGraph: {
    title: businessData.seo.openGraph.title,
    description: businessData.seo.openGraph.description,
    url: "https://keyfoby.com",
    siteName: businessData.name,
    images: [
      {
        url: businessData.seo.openGraph.image,
        width: 1200,
        height: 630,
        alt: "KeyFoby - Hamilton Key Fob Services",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="/images/KeyFoby-logo/favicons/favicon.ico"
          sizes="any"
        />
        <link
          rel="icon"
          href="/images/KeyFoby-logo/favicons/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/images/KeyFoby-logo/favicons/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/images/KeyFoby-logo/favicons/apple-touch-icon.png"
        />
        <link
          rel="manifest"
          href="/images/KeyFoby-logo/favicons/site.webmanifest"
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessData.seo.schema),
          }}
        />

        {/* Google Analytics - Add your tracking ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script> */}

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
