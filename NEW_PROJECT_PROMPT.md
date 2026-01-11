# 🚀 Complete Prompt for New Cursor Session

## Copy and paste this entire prompt into a NEW Cursor session:

---

# Create KeyFoby App Landing Page Project

I need you to create a complete Next.js project for the KeyFoby App landing page that will be hosted at `app.keyfoby.com` as a separate subdomain.

## Project Requirements

### 1. Project Setup

- Create a new Next.js 14+ project with TypeScript
- Use App Router (not Pages Router)
- Configure Tailwind CSS
- Set up for static export (Firebase hosting)
- Project name: `keyfoby-app-landing`

### 2. Domain & Metadata

- **Domain**: `app.keyfoby.com`
- **Purpose**: Marketing landing page for KeyFoby mobile business management app
- **Target Audience**: Locksmith businesses
- **App Type**: React Native mobile app (iOS and Android)

### 3. Landing Page Content

The landing page should include:

#### Hero Section

- Headline: "KeyFoby App - Business Management for Locksmiths"
- Subheadline: "The all-in-one business management app built exclusively for locksmiths"
- CTA: "Get Early Access" button
- Early access promotion: "50% OFF for 4 Months - Limited Time"
- Pricing: $25/month (regular $50/month)

#### Features Section

- Smart Analytics & Reporting
- AI-Powered Business Insights
- CRM & Customer Management
- Inventory Management
- Sales & Expense Tracking
- Booking System (coming soon)
- Mobile-first design (iOS & Android)

#### Pricing Section

- **Free Tier**: Data viewing, sales tracking, basic inventory
- **Paid Tier ($25/month early access, $50/month regular)**:
  - AI Business Insights
  - Sales Tips
  - Smart Data Analytics
  - Vehicle analytics (what cars are worked on)
  - Booking System
  - Advanced inventory management

#### FAQ Section

- Common questions about the app
- Pricing questions
- Early access questions
- Feature availability

#### Newsletter Signup

- Email collection for early access
- Integration with Supabase
- Success/error messaging

#### Footer

- Links to main site (keyfoby.com)
- Privacy Policy link
- Terms of Service link
- Contact information

### 4. Technical Requirements

#### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  output: "export", // Static export for Firebase
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};
```

#### Metadata Configuration

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://app.keyfoby.com"),
  title: "KeyFoby App - Business Management for Locksmiths | Coming Soon",
  description:
    "The ultimate business management app for locksmiths. AI-powered insights, smart analytics, CRM, inventory management, and booking system. Starting at $25/month.",
  keywords: [
    "locksmith app",
    "locksmith business management",
    "locksmith software",
    "automotive locksmith app",
    "key fob business",
    "locksmith CRM",
    "locksmith inventory",
    "locksmith booking system",
    "AI business insights",
  ].join(", "),
  openGraph: {
    title: "KeyFoby App - Business Management for Locksmiths",
    description:
      "The ultimate business management app for locksmiths. AI-powered insights, smart analytics, and more.",
    url: "https://app.keyfoby.com",
    siteName: "KeyFoby App",
    type: "website",
  },
};
```

#### Supabase Integration

- Set up Supabase client
- Newsletter subscription functionality
- Table: `newsletter_subscribers`
- Fields: `email`, `created_at`, `subscribed` (boolean)

#### Styling

- Use Tailwind CSS
- Match the color scheme from main site:
  - Primary: Blue (#3b82f6)
  - Secondary: Cyan (#06b6d4)
  - Dark: Slate (#1e293b)
- Modern, professional design
- Mobile-responsive
- Dark mode support

### 5. Components Needed

1. **Hero Section** - Eye-catching hero with CTA
2. **Features Grid** - Showcase app features with icons
3. **Pricing Cards** - Free vs Paid tiers
4. **FAQ Accordion** - Expandable FAQ section
5. **Newsletter Signup** - Email collection form
6. **Footer** - Links and contact info
7. **NavBar** - Simple navigation (can link to main site)

### 6. Firebase Hosting Setup

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    "errorDocument": "404.html",
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### 7. Environment Variables Needed

Create `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 8. Dependencies to Install

```bash
npm install @supabase/supabase-js @tanstack/react-query
npm install motion/react @tabler/icons-react
```

### 9. Design Requirements

- **Modern & Professional**: Clean, modern design that looks trustworthy
- **Mobile-First**: Responsive design that works on all devices
- **Fast Loading**: Optimize for performance
- **Accessible**: Follow WCAG guidelines
- **Brand Consistency**: Match the KeyFoby brand colors and style

### 10. Content Details

#### Early Access Promotion

- **Discount**: 50% off for first 4 months
- **Regular Price**: $50/month
- **Early Access Price**: $25/month
- **Limited Time**: Emphasize urgency

#### App Features to Highlight

1. **Smart Analytics**: Track sales, expenses, profits automatically
2. **AI Insights**: Get business recommendations based on your data
3. **Inventory Management**: Track stock, costs, vendors, reorder points
4. **CRM**: Manage customers, vehicles, service history
5. **Sales Tracking**: Record transactions, payment methods, notes
6. **Booking System**: Schedule appointments (coming soon)
7. **Mobile App**: Native iOS and Android apps

#### Target Keywords for SEO

- locksmith app
- locksmith business management
- locksmith software
- locksmith CRM
- locksmith inventory management
- business management app for locksmiths
- automotive locksmith app

### 11. Links to Include

- **Main Site**: Link to `https://keyfoby.com` (locksmith services)
- **Privacy Policy**: `/privacy-policy` (create this page)
- **Terms of Service**: `/terms-of-service` (create this page)
- **Contact**: `keyfoby@gmail.com`

### 12. Call-to-Actions

- Primary CTA: "Get Early Access" (newsletter signup)
- Secondary CTA: "Learn More" (scroll to features)
- Pricing CTA: "Start Free Trial" or "Get Started"

### 13. Social Proof (Optional)

- "Coming Soon" badge
- "Join X early access users"
- Testimonials (if available)
- Trust badges

### 14. Animation & Interactions

- Smooth scroll animations
- Hover effects on cards
- Loading states for forms
- Success/error messages
- Use `motion/react` for animations

### 15. Error Handling

- Form validation
- Error messages for newsletter signup
- 404 page
- Loading states

## Deliverables

Please create:

1. ✅ Complete Next.js project structure
2. ✅ All components mentioned above
3. ✅ Supabase integration for newsletter
4. ✅ Firebase hosting configuration
5. ✅ SEO-optimized metadata
6. ✅ Responsive design
7. ✅ Dark mode support
8. ✅ Privacy Policy page
9. ✅ Terms of Service page
10. ✅ README with setup instructions

## Important Notes

- This is a **separate project** from the main KeyFoby website
- It will be hosted at `app.keyfoby.com` (subdomain)
- Focus on app marketing, not locksmith services
- Keep SEO separate from main site
- Use static export for Firebase hosting

## Reference Information

**Business Contact**:

- Email: keyfoby@gmail.com
- Phone: +1 (438) 797-7776
- Address: 40 Courtland Ave, Hamilton, ON L9B 1X6, Canada
- Main Website: https://keyfoby.com

**App Details**:

- Name: KeyFoby App
- Type: Mobile Business Management App
- Target: Locksmith businesses
- Platform: iOS & Android (React Native)

---

## After Creating the Project

Once you've created the project, please provide:

1. Setup instructions
2. How to configure Supabase
3. How to deploy to Firebase
4. Any additional configuration needed

---

**Start by creating the project structure and then build out each component systematically.**
