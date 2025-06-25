"use client";

import { businessData } from "@/lib/business-data";

export default function LocalBusinessSchema() {
  // Enhanced local business schema with reviews and FAQ
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["Locksmith", "LocalBusiness"],
    name: businessData.name,
    alternateName: businessData.legalName,
    description:
      "Professional locksmith and key fob services in Hamilton, Ontario. Specializing in automotive key programming, house key duplication, emergency lockout services, and transponder key replacement.",
    url: "https://www.keyfoby.com",
    telephone: businessData.contact.phone,
    email: businessData.contact.email,
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
      "House Key Duplication",
      "Emergency Lockout Service",
      "Key Cutting",
      "Smart Key Programming",
      "Remote Key Replacement",
    ],

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Locksmith Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Car Key Programming",
            description:
              "Professional automotive key programming for all makes and models including transponder keys, smart keys, and remote key fobs",
            areaServed: businessData.seo.localSeo.serviceArea,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Emergency Lockout Service",
            description:
              "24/7 emergency car and house lockout services in Hamilton and surrounding areas",
            areaServed: businessData.seo.localSeo.serviceArea,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "House Key Duplication",
            description:
              "Residential key cutting and duplication services with custom engraving options",
            areaServed: businessData.seo.localSeo.serviceArea,
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
        author: {
          "@type": "Person",
          name: "Sarah Johnson",
        },
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
        author: {
          "@type": "Person",
          name: "Mike Thompson",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excellent service for my BMW key programming. The technician was knowledgeable and the price was fair. Will definitely use KeyFoby again.",
      },
    ],

    sameAs: [
      "https://www.facebook.com/keyfoby",
      "https://www.instagram.com/keyfoby",
      "https://twitter.com/keyfoby",
    ],
  };

  // FAQ Schema for common locksmith questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does car key replacement cost in Hamilton?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Car key replacement costs vary depending on the make, model, and type of key. Basic keys start around $50, while transponder and smart keys range from $150-$400. Contact KeyFoby for a free quote specific to your vehicle.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide emergency lockout services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! KeyFoby provides 24/7 emergency lockout services for cars and homes in Hamilton, Burlington, Oakville, and surrounding areas. Call (905) 467-6860 for immediate assistance.",
        },
      },
      {
        "@type": "Question",
        name: "Can you program keys for all car makes and models?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KeyFoby programs keys for most major automotive brands including Ford, GM, Honda, Toyota, BMW, Mercedes, Audi, and more. We use professional-grade equipment to ensure proper programming.",
        },
      },
      {
        "@type": "Question",
        name: "How long does key programming take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most key programming services are completed within 15-45 minutes depending on the vehicle type. Complex smart keys may take up to an hour. We provide same-day service for most requests.",
        },
      },
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
    </>
  );
}
