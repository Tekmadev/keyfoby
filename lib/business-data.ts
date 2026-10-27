// KeyFoby Business Data - Centralized configuration
//
// Single source of truth for every fact the site states (hours, phone, area,
// rating, claims). Values here were confirmed by the client on 2026-10-26
// (Truth Table in docs/PHASE0_PLAN.md). Anything not confirmed is marked
// TODO(confirm) and must not be shown as a claim.

const SITE_URL = "https://www.keyfoby.com";

// Google Business Profile (Maps place 0x85d362d9688716f5:0xd2b2f9b7710cb4a0)
const GOOGLE_MAPS_URL = "https://www.google.com/maps?cid=15182471860090352800";

// Confirmed service area. Hamilton is the home base; all 10 are served.
const serviceArea = [
  "Hamilton",
  "Ancaster",
  "Dundas",
  "Stoney Creek",
  "Burlington",
  "Grimsby",
  "Oakville",
  "Mississauga",
  "Brampton",
  "Toronto",
];

export const businessData = {
  // Business Identity
  name: "KeyFoby",
  legalName: "KeyFoby",
  url: SITE_URL,
  tagline: "Car keys and key fobs, made and programmed at your car.",
  description:
    "Mobile automotive locksmith in Hamilton, Ontario. Car keys and key fobs only: replacement, programming, all keys lost and lockouts.",

  // Contact Information
  contact: {
    phone: "+1 (905) 467-6860",
    phoneDisplay: "(905) 467-6860",
    phoneHref: "tel:+19054676860",
    phoneSchema: "+1-905-467-6860",
    email: "keyfoby@gmail.com",
    whatsapp: "+19054676860",
    // Mobile service: the street address is not customer-facing, so it is not
    // published in page text or structured data. The legal pages still show it
    // as the privacy/legal contact address.
    address: {
      street: "40 Courtland Ave",
      city: "Hamilton",
      state: "ON",
      zip: "L9B 1X6",
      country: "CA",
      full: "40 Courtland Ave, Hamilton, ON L9B 1X6",
    },
  },

  // Business Hours (matches the Google Business Profile: open 24 hours)
  hours: {
    summary: "Open 24/7",
    detail: "Emergency calls 24/7. Most jobs are booked during the day.",
    afterHours:
      "After-hours emergency calls include a surcharge. We tell you the amount on the phone before we head out.",
  },

  // Reviews: summary of the Google Business Profile. Update when it changes.
  // Shown as text only; never as aggregateRating markup (self-serving
  // LocalBusiness ratings earn no stars and must not contradict GBP).
  reviews: {
    rating: "4.9",
    countLabel: "200+",
    source: "Google",
    url: GOOGLE_MAPS_URL,
  },

  // Brand Colors
  colors: {
    primary: "#3b82f6",
    secondary: "#06b6d4",
    accent: "#0ea5e9",
    dark: "#1e293b",
    darker: "#0f172a",
    light: "#f8fafc",
    white: "#ffffff",
    black: "#000000",
  },

  // Services (car keys only: no house, business or safe locks)
  services: {
    car: {
      title: "Car Keys & Key Fobs",
      description:
        "Mobile automotive key service for most makes and models. We come to your car.",
      features: [
        "Car key replacement and duplication",
        "Key fob programming",
        "All keys lost",
        "Transponder and smart key programming",
        "Key fob shell replacement",
        "Emergency car lockouts",
        "Broken key extraction",
      ],
    },
  },

  // Form Service Options
  serviceOptions: [
    "Car Key Replacement",
    "Car Key Duplication",
    "Key Fob Programming",
    "Emergency Lockout",
    "Transponder Keys",
    "Smart Key Programming",
    "All key(s) lost/stolen",
    "General Inquiry",
  ],

  // Features/Why Choose Us
  features: [
    {
      title: "We Come to You",
      description:
        "A mobile service: keys are cut and programmed at your car, at home, at work or wherever it's parked.",
    },
    {
      title: "Quoted on the Phone",
      description:
        "Every job is priced on the phone first, based on your car's year, make, model and key type.",
    },
    {
      title: "24/7 for Emergencies",
      description:
        "Locked out or lost every key? Call any time. After-hours calls include a surcharge, quoted upfront.",
    },
    {
      title: "Licensed & Insured",
      description:
        "Licence and insurance details are available on request. Every job carries a 3-month warranty.",
    },
  ],

  // Trust Indicators (confirmed by the client)
  stats: {
    keysMade: "1,500+",
    yearsInBusiness: "3",
    support: "24/7",
    satisfaction: "100%",
  },

  // Social Media. Empty until the real profile URLs are confirmed.
  // TODO(confirm): Facebook page URL (GBP links a Facebook profile).
  social: {
    facebook: "",
    instagram: "",
  },

  serviceArea,

  // FAQ Items - used in schema and visible FAQ section (answers must match).
  faqItems: [
    {
      question: "How much does car key replacement cost in Hamilton?",
      answer:
        "It depends on your car's year, make and model and the type of key: a basic cut key, a transponder key, a remote or a push-to-start smart key. Call (905) 467-6860 with your vehicle details and we'll quote the price on the phone before we book.",
    },
    {
      question: "Do you provide 24/7 emergency lockout services?",
      answer:
        "Yes. We take emergency calls 24/7 across Hamilton and nearby cities. Most jobs are booked during the day; after-hours emergency calls include a surcharge, and we tell you the amount on the phone before we head out.",
    },
    {
      question: "Do you charge extra after hours?",
      answer:
        "Yes. After-hours emergency calls include a surcharge. We tell you the amount on the phone before we head out, so you can decide before we come.",
    },
    {
      question: "What car makes and models can you program keys for?",
      answer:
        "Most makes sold in Canada, including Honda, Toyota, Hyundai, Kia, Ford, Chevrolet, GMC, Dodge, Ram, Jeep, Chrysler, Nissan, Mazda, Subaru and Volkswagen. Call with your year, make and model and we'll confirm before we book.",
    },
    {
      // TODO(confirm): typical job durations by key type before stating times.
      question: "How long does key programming take?",
      answer:
        "It depends on the car and the type of key. We give you a time estimate on the phone when we book, and the work is done at your car.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We're based in Hamilton and come to you across Hamilton, Ancaster, Dundas, Stoney Creek, Burlington, Grimsby, Oakville, Mississauga, Brampton and Toronto. It's a mobile service: we work at your car.",
    },
    {
      question: "Can you replace a car key when I have lost all my keys?",
      answer:
        "Yes. Even with no working key, we can cut and program a new key using your vehicle identification number (VIN) and proof of ownership. Have your registration and photo ID ready.",
    },
    {
      question: "What types of car keys do you replace and program?",
      answer:
        "Basic cut keys, transponder chip keys, remote head keys, key fobs (keyless entry remotes), flip keys and push-to-start smart (proximity) keys. We also replace worn or broken key fob shells.",
    },
    {
      question: "How do I know if my key fob needs replacement?",
      answer:
        "Common signs: buttons that don't respond, the car not unlocking from a normal distance, inconsistent remote start, a cracked or broken shell, or a fob that still fails after a new battery. We can check it and replace or reprogram it at your car.",
    },
    {
      question: "Is KeyFoby licensed and insured?",
      answer:
        "Yes. KeyFoby is licensed and insured, and we can share the details on request. Every job is backed by our 100% satisfaction guarantee and a 3-month warranty.",
    },
    {
      question: "How quickly can you get to me?",
      answer:
        "Call (905) 467-6860 and we'll give you an arrival time on the phone. Emergency calls are taken 24/7.",
    },
    {
      question: "Do you work on house or business locks?",
      answer:
        "No. KeyFoby works on cars only: car keys, key fobs, programming and car lockouts.",
    },
    {
      question: "Do you offer a warranty on key programming services?",
      answer:
        "Yes. Key programming and replacement come with a 3-month warranty covering defects in parts and workmanship. If your new key has an issue within 90 days, we repair or replace it at no charge.",
    },
  ],

  // SEO & Meta
  seo: {
    title: "Car Key Replacement & Key Fob Programming Hamilton | KeyFoby",
    description:
      "Mobile car key replacement, key fob programming and lockouts in Hamilton and nearby. We come to you, 24/7 for emergencies. Call (905) 467-6860.",

    openGraph: {
      title: "KeyFoby: Mobile Car Key & Key Fob Service in Hamilton",
      description:
        "Car key replacement, key fob programming, all keys lost and lockouts, done at your car across Hamilton and nearby. 24/7 for emergencies. (905) 467-6860.",
      image: "/images/og/keyfoby-og.png",
      imageAlt: "KeyFoby: mobile car key and key fob service in Hamilton, Ontario",
    },

    // Schema.org structured data: the one business entity, emitted on every
    // page by the root layout. Other blocks reference it by @id.
    schema: {
      "@context": "https://schema.org",
      "@type": "Locksmith",
      "@id": `${SITE_URL}/#business`,
      name: "KeyFoby",
      url: SITE_URL,
      logo: `${SITE_URL}/images/KeyFoby-logo/keyfobylogo-500.png`,
      image: `${SITE_URL}/images/og/keyfoby-og.png`,
      description:
        "KeyFoby is a mobile automotive locksmith based in Hamilton, Ontario. Car key replacement, key fob programming, transponder and smart keys, all keys lost and emergency car lockouts, done at your car.",
      telephone: "+1-905-467-6860",
      email: "keyfoby@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamilton",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      openingHoursSpecification: [
        {
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
          opens: "00:00",
          closes: "23:59",
        },
      ],
      areaServed: serviceArea.map((city) => ({
        "@type": "City",
        name: `${city}, ON`,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Automotive locksmith services",
        itemListElement: [
          "Car Key Replacement",
          "Key Fob Programming",
          "All Keys Lost",
          "Emergency Car Lockout",
          "Transponder Key Programming",
          "Smart Key Programming",
          "Key Fob Shell Replacement",
          "Car Key Cutting and Duplication",
          "Broken Key Extraction",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
      sameAs: [GOOGLE_MAPS_URL],
    },
  },
};
