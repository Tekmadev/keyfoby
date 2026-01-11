// KeyFoby Business Data - Centralized configuration
export const businessData = {
  // Business Identity
  name: "KeyFoby",
  legalName: "KeyFoby",
  tagline: "Lost Keys? Need a Spare? We've Got You.",
  description:
    "Custom key fobs for cars and homes – built with speed and precision.",

  // Contact Information
  contact: {
    phone: "+1 (438) 797-7776",
    phoneDisplay: "+1 (438) 797-7776",
    email: "keyfoby@gmail.com",
    whatsapp: "+14387977776", // WhatsApp format (no spaces, + prefix)
    address: {
      street: "40 Courtland Ave",
      city: "Hamilton",
      state: "ON",
      zip: "L9B 1X6",
      full: "40 Courtland Ave, Hamilton, ON L9B 1X6",
    },
  },

  // Business Hours
  hours: {
    weekdays: "Mon-Fri: 8AM-6PM",
    weekend: "Sat: 9AM-4PM",
    sunday: "Sun: Closed",
    emergency: "24/7 Emergency Service Available",
  },

  // Brand Colors
  colors: {
    primary: "#3b82f6", // Blue
    secondary: "#06b6d4", // Cyan
    accent: "#0ea5e9", // Light Blue
    dark: "#1e293b", // Dark Gunmetal
    darker: "#0f172a", // Darker Gunmetal
    light: "#f8fafc", // Light gray
    white: "#ffffff",
    black: "#000000",
  },

  // Services
  services: {
    car: {
      title: "Car Key Fobs",
      description:
        "Professional automotive key solutions for all makes and models",
      features: [
        "Key duplication",
        "Shell replacement",
        "Remote programming",
        "Transponder keys",
        "Smart key programming",
        "All key(s) lost/stolen",
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
      title: "Fast Service",
      description:
        "Most key duplications completed within 15-30 minutes. No waiting around.",
    },
    {
      title: "Personalization",
      description:
        "Custom engraving, color options, and personalized key chains available.",
    },
    {
      title: "Mobile-Friendly",
      description:
        "Easy online quotes and communication. We come to you when possible.",
    },
    {
      title: "Secure Process",
      description:
        "Verified locksmith services with proper licensing and insurance coverage.",
    },
  ],

  // Trust Indicators
  stats: {
    keysMade: "100+",
    support: "24/7",
    satisfaction: "100%",
  },

  // Social Media
  social: {
    twitter: "#",
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },

  // Coming Soon Features
  comingSoon: [
    "Online Ordering",
    "Smart Key Programming",
    "Mobile App",
    "24/7 Service",
  ],

  // SEO & Meta - Advanced SEO Strategy
  seo: {
    title: "KeyFoby - Car Key Fob Services Hamilton | 24/7",
    description:
      "🔑 Hamilton's TOP-RATED key fob experts! Lost car keys? Need automotive key programming? ⚡ 15-min service ⚡ Licensed locksmith ⚡ 100% satisfaction. Call (438) 797-7776!",
    keywords: [
      // Primary Keywords (High Volume)
      "key fob Hamilton",
      "car key replacement Hamilton",
      "locksmith Hamilton",
      "key duplication Hamilton",
      "lost car keys Hamilton",

      // Long-tail Keywords (High Intent)
      "24 hour locksmith Hamilton Ontario",
      "emergency car key replacement Hamilton",

      "car key programming Hamilton",
      "automotive locksmith Hamilton",

      // Local SEO Keywords
      "locksmith near me Hamilton",
      "key fob services Hamilton ON",
      "Hamilton key cutting services",
      "Burlington key fob replacement",
      "Oakville car key duplication",

      // Service-specific Keywords
      "transponder key programming",
      "remote key fob replacement",
      "smart key programming Hamilton",
      "key fob shell replacement",
      "car key extraction Hamilton",

      // Brand & Competition
      "KeyFoby Hamilton",
      "best locksmith Hamilton",
      "professional key services Hamilton",
      "licensed locksmith Hamilton Ontario",
    ],

    // Local SEO Data
    localSeo: {
      businessType: "Locksmith",
      serviceArea: [
        "Hamilton, ON",
        "Burlington, ON",
        "Oakville, ON",
        "Mississauga, ON",
        "Brampton, ON",
        "Toronto, ON",
        "Ancaster, ON",
        "Dundas, ON",
        "Stoney Creek, ON",
        "Grimsby, ON",
      ],
      coordinates: {
        lat: 43.2557,
        lng: -79.8711,
      },
    },

    // Advanced Meta Tags
    openGraph: {
      title: "KeyFoby - Hamilton's #1 Key Fob & Locksmith Services",
      description:
        "🔑 EMERGENCY KEY SERVICES ⚡ Lost car keys? Need automotive key programming? ⚡ Hamilton's fastest locksmith! Licensed ✅ Insured ✅ 24/7 Emergency ✅ Call NOW!",
      image: "/images/keyfobykeys.png?v=2025",
      type: "business.business",
    },

    // Schema.org Structured Data
    schema: {
      "@context": "https://schema.org",
      "@type": "Locksmith",
      name: "KeyFoby",
      alternateName: "Key Fob Pro",
      description:
        "Professional locksmith and key fob services in Hamilton, Ontario. Specializing in automotive key programming, car key replacement, and emergency lockout services.",
      url: "https://www.keyfoby.com",
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
      geo: {
        "@type": "GeoCoordinates",
        latitude: 43.2557,
        longitude: -79.8711,
      },
      openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-16:00"],
      priceRange: "$$",
      areaServed: [
        "Hamilton, ON",
        "Burlington, ON",
        "Oakville, ON",
        "Mississauga, ON",
        "Brampton, ON",
        "Toronto, ON",
      ],
      serviceType: [
        "Key Duplication",
        "Car Key Replacement",
        "Locksmith Services",
        "Key Fob Programming",
        "Emergency Lockout Service",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Locksmith Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Car Key Replacement",
              description:
                "Professional automotive key replacement and programming services",
            },
          },
        ],
      },
    },
  },
};
