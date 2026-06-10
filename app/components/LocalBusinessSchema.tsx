"use client";

import { businessData } from "@/lib/business-data";

export default function LocalBusinessSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["Locksmith", "LocalBusiness"],
    name: businessData.name,
    alternateName: businessData.legalName,
    description:
      "KeyFoby is a licensed and insured automotive locksmith based in Hamilton, Ontario, Canada. We specialize in car key replacement, key fob programming, transponder key cutting, smart key programming, and 24/7 emergency lockout services. Serving Hamilton, Burlington, Oakville, Mississauga, Brampton, Toronto, and surrounding areas.",
    url: "https://www.keyfoby.com",
    telephone: businessData.contact.phone,
    email: businessData.contact.email,
    foundingDate: "2022",
    priceRange: "$$",
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash, Credit Card, Debit Card, E-Transfer",

    address: {
      "@type": "PostalAddress",
      streetAddress: businessData.contact.address.street,
      addressLocality: businessData.contact.address.city,
      addressRegion: businessData.contact.address.state,
      postalCode: businessData.contact.address.zip,
      addressCountry: "CA",
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: businessData.seo.localSeo.coordinates.lat,
      longitude: businessData.seo.localSeo.coordinates.lng,
    },

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],

    areaServed: businessData.seo.localSeo.serviceArea.map((area) => ({
      "@type": "City",
      name: area,
    })),

    serviceType: [
      "Automotive Locksmith",
      "Car Key Programming",
      "Transponder Key Replacement",
      "Key Fob Programming",
      "Emergency Lockout Service",
      "Smart Key Programming",
      "Remote Key Replacement",
      "All Keys Lost Service",
      "Key Fob Shell Replacement",
      "Broken Key Extraction",
      "Proximity Key Programming",
    ],

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automotive Locksmith Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Car Key Replacement Hamilton",
            description:
              "Professional car key replacement for all makes and models including transponder keys, smart keys, and remote key fobs in Hamilton and surrounding areas",
            areaServed: "Hamilton, ON",
            provider: { "@type": "LocalBusiness", name: "KeyFoby" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "24/7 Emergency Car Lockout Service",
            description:
              "Around-the-clock emergency car lockout service in Hamilton, Burlington, Oakville, Mississauga, and the Greater Toronto Area",
            areaServed: businessData.seo.localSeo.serviceArea,
            provider: { "@type": "LocalBusiness", name: "KeyFoby" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Key Fob Programming",
            description:
              "Programming and reprogramming of keyless entry fobs and proximity smart keys for all vehicle brands and models",
            areaServed: businessData.seo.localSeo.serviceArea,
            provider: { "@type": "LocalBusiness", name: "KeyFoby" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Transponder Key Programming",
            description:
              "Cutting and programming of transponder chip keys for all makes including Ford, GM, Honda, Toyota, BMW, Mercedes, and more",
            areaServed: "Hamilton, ON",
            provider: { "@type": "LocalBusiness", name: "KeyFoby" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "All Keys Lost Service",
            description:
              "Complete key replacement service for vehicles with no working keys. New key cut and programmed from VIN with proof of ownership.",
            areaServed: businessData.seo.localSeo.serviceArea,
            provider: { "@type": "LocalBusiness", name: "KeyFoby" },
          },
        },
      ],
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },

    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah Johnson" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "KeyFoby saved the day! Lost my car keys and they had me back on the road in 30 minutes. Professional, fast, and reasonably priced. Highly recommend!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Mike Thompson" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excellent service for my BMW key programming. The technician was knowledgeable and the price was fair. Will definitely use KeyFoby again.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Amanda R." },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Got locked out of my car on a Sunday night and KeyFoby was there within 25 minutes. Super professional and the price was very reasonable. 5 stars!",
      },
    ],

    sameAs: [
      "https://www.facebook.com/keyfoby",
      "https://www.instagram.com/keyfoby",
      "https://twitter.com/keyfoby",
    ],
  };

  // FAQ Schema - 12 comprehensive questions for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: businessData.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // HowTo Schema for key replacement process - targets "how to replace car key" searches
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get a Car Key Replacement in Hamilton",
    description:
      "Step-by-step process for getting a replacement car key or key fob from KeyFoby in Hamilton, Ontario",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "CAD",
      minValue: "50",
      maxValue: "400",
    },
    totalTime: "PT45M",
    step: [
      {
        "@type": "HowToStep",
        name: "Contact KeyFoby",
        text: "Call or message KeyFoby at (438) 797-7776 or use the online contact form to describe your vehicle and the type of key service you need.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Provide Vehicle Information",
        text: "Share your vehicle year, make, model, and VIN number. Have your proof of vehicle ownership (registration or title) ready for all-keys-lost situations.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Get a Free Quote",
        text: "Receive an upfront price quote with no hidden fees. KeyFoby provides transparent pricing before any work begins.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Key Cutting and Programming",
        text: "A certified technician cuts and programs your new key or key fob using professional-grade equipment. Most services are completed in 15–45 minutes.",
        position: 4,
      },
      {
        "@type": "HowToStep",
        name: "Test and Verify",
        text: "Your new key is tested in your vehicle to confirm all functions work correctly, including remote unlock, trunk release, and engine start.",
        position: 5,
      },
    ],
  };

  // WebSite schema - helps search engines understand the site entity
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KeyFoby",
    url: "https://www.keyfoby.com",
    description:
      "Professional automotive locksmith and key fob services in Hamilton, Ontario. Car key replacement, transponder programming, and 24/7 emergency lockout.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.keyfoby.com/#contact?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "LocalBusiness",
      name: "KeyFoby",
      url: "https://www.keyfoby.com",
    },
  };

  // Organization schema - reinforces entity for AI/GEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KeyFoby",
    url: "https://www.keyfoby.com",
    logo: "https://www.keyfoby.com/images/keyfobykeys.png",
    description:
      "KeyFoby is Hamilton Ontario's trusted automotive locksmith providing car key replacement, key fob programming, and emergency lockout services.",
    telephone: "+1-438-797-7776",
    email: "keyfoby@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "40 Courtland Ave",
      addressLocality: "Hamilton",
      addressRegion: "ON",
      postalCode: "L9B 1X6",
      addressCountry: "CA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-438-797-7776",
      contactType: "customer service",
      areaServed: "CA-ON",
      availableLanguage: ["English", "French"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        description: "Emergency service available 24/7",
      },
    },
    sameAs: [
      "https://www.facebook.com/keyfoby",
      "https://www.instagram.com/keyfoby",
      "https://twitter.com/keyfoby",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}
