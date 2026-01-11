# KeyFoby App Landing Page Migration Guide

## 📋 Overview

This guide explains how to separate the KeyFoby App landing page from the main locksmith website for better SEO. The app landing page will be hosted at `app.keyfoby.com` as a separate project.

---

## ✅ What Was Done in Current Project

### Removed:

- ❌ `/app/keyfoby-app` route directory (full landing page)
- ❌ `/app/keyfoby-app/page.tsx`
- ❌ `/app/keyfoby-app/KeyFobyAppClient.tsx`

### Kept:

- ✅ `AppPromo` component (homepage teaser section)
- ✅ Updated `AppPromo` to link to `https://app.keyfoby.com` instead of `/keyfoby-app`

### Current Project Status:

- **Domain**: `keyfoby.com` (main locksmith website)
- **Purpose**: Locksmith services, SEO focused on key fob services
- **App Reference**: Only a teaser section linking to external app site

---

## 🚀 New Project Setup Guide

### Step 1: Create New Next.js Project

```bash
# Create new project directory
cd /Users/shajeed/Coding/Projects/NextJS
npx create-next-app@latest keyfoby-app-landing

# Choose these options:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - App Router: Yes
# - src/ directory: No
# - Import alias: @/*
```

### Step 2: Copy Required Files

Copy these files from the old project to the new one:

#### Essential Files to Copy:

```
FROM: /Users/shajeed/Coding/Projects/NextJS/keyfoby/app/keyfoby-app/
TO:   /Users/shajeed/Coding/Projects/NextJS/keyfoby-app-landing/app/

Files:
- KeyFobyAppClient.tsx → app/page.tsx (or create new page.tsx that imports it)
- Any related components used by KeyFobyAppClient
```

#### Components to Copy (if needed):

- `app/components/NewsletterSignup.tsx` (if used in app landing page)
- Any other app-specific components

#### Configuration Files:

- `lib/supabase.ts` (if newsletter signup is used)
- `.env.local` (copy Supabase credentials)
- `package.json` dependencies (Supabase, React Query, etc.)

### Step 3: Install Dependencies

```bash
cd keyfoby-app-landing

# Install required packages
npm install @supabase/supabase-js @tanstack/react-query
npm install motion/react @tabler/icons-react
npm install --save-dev @types/node
```

### Step 4: Update Metadata & Configuration

#### Update `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://app.keyfoby.com"),
  title: "KeyFoby App - Business Management for Locksmiths",
  description: "The ultimate business management app for locksmiths...",
  // ... rest of metadata
};
```

#### Update `next.config.ts`:

```typescript
const nextConfig = {
  output: "export", // Static export for Firebase
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};
```

---

## 🔥 Firebase Hosting Setup for Subdomain

### Step 1: Create New Firebase Project (or use existing)

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in new project directory
cd keyfoby-app-landing
firebase init hosting
```

### Step 2: Firebase Init Configuration

When running `firebase init hosting`, choose:

```
? What do you want to use as your public directory? out
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? No (or Yes if you want)
? File out/index.html already exists. Overwrite? No
```

### Step 3: Create `firebase.json`

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

### Step 4: Add Subdomain Site in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new one)
3. Go to **Hosting** → **Add another site**
4. Enter site ID: `keyfoby-app` (or any name you prefer)
5. Click **Continue**

### Step 5: Configure Custom Domain

1. In Firebase Hosting, click on your new site
2. Go to **Custom domains** tab
3. Click **Add custom domain**
4. Enter: `app.keyfoby.com`
5. Click **Continue**
6. Firebase will provide DNS records to add

---

## 🌐 DNS Configuration (Namecheap)

### Step 1: Add DNS Record in Namecheap

1. Login to [Namecheap](https://www.namecheap.com/)
2. Go to **Domain List** → Select `keyfoby.com`
3. Click **Manage** → Go to **Advanced DNS** tab
4. Add new record:

```
Type: A Record
Host: app
Value: [Firebase provided IP address]
TTL: Automatic (or 300)
```

**OR** (if Firebase provides CNAME):

```
Type: CNAME Record
Host: app
Value: [Firebase provided CNAME target]
TTL: Automatic (or 300)
```

### Step 2: Verify Domain in Firebase

1. After adding DNS record, wait 5-10 minutes
2. Go back to Firebase Console → Hosting → Custom domains
3. Click **Verify** next to `app.keyfoby.com`
4. Once verified, Firebase will provision SSL certificate automatically

### Step 3: Deploy to Firebase

```bash
# Build the Next.js app
npm run build

# Deploy to Firebase
firebase deploy --only hosting:keyfoby-app
```

**Note**: Replace `keyfoby-app` with your actual Firebase site ID.

---

## 📁 Project Structure Comparison

### Current Project (keyfoby.com):

```
keyfoby/
├── app/
│   ├── page.tsx (homepage with AppPromo teaser)
│   ├── components/
│   │   ├── AppPromo.tsx (links to app.keyfoby.com)
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   └── ... (locksmith service components)
│   └── privacy-policy/
│   └── terms-of-service/
└── lib/
    └── business-data.ts
```

### New Project (app.keyfoby.com):

```
keyfoby-app-landing/
├── app/
│   ├── page.tsx (KeyFobyAppClient - full landing page)
│   ├── components/
│   │   ├── NewsletterSignup.tsx
│   │   └── ... (app-specific components)
│   └── layout.tsx
└── lib/
    └── supabase.ts
```

---

## 🔗 Cross-Reference Links

### From Main Site (keyfoby.com):

- `AppPromo` component links to: `https://app.keyfoby.com`

### From App Site (app.keyfoby.com):

- Can link back to main site: `https://keyfoby.com`
- Footer can include links to main site services

---

## ✅ Checklist for New Project

- [ ] Create new Next.js project
- [ ] Copy `KeyFobyAppClient.tsx` and related components
- [ ] Copy `lib/supabase.ts` and environment variables
- [ ] Install all required dependencies
- [ ] Update metadata to use `app.keyfoby.com`
- [ ] Configure `next.config.ts` for static export
- [ ] Initialize Firebase hosting
- [ ] Create Firebase site for subdomain
- [ ] Add DNS A/CNAME record in Namecheap
- [ ] Verify domain in Firebase
- [ ] Build and deploy to Firebase
- [ ] Test `app.keyfoby.com` in browser
- [ ] Verify SSL certificate is active
- [ ] Test newsletter signup functionality
- [ ] Update any hardcoded URLs in components

---

## 🎯 SEO Benefits

### Separation Benefits:

1. **Clear Focus**: Main site focuses on locksmith services
2. **App Site**: Dedicated to app marketing, different keywords
3. **No Confusion**: Google won't mix signals between services and app
4. **Better Rankings**: Each site can rank for its specific purpose
5. **Clean Analytics**: Separate tracking for each site

### SEO Strategy:

- **keyfoby.com**: Target "locksmith", "key fob", "car key" keywords
- **app.keyfoby.com**: Target "locksmith software", "business management app", "locksmith CRM" keywords

---

## 🐛 Troubleshooting

### DNS Not Resolving:

- Wait 24-48 hours for DNS propagation
- Use `dig app.keyfoby.com` or `nslookup app.keyfoby.com` to check
- Verify DNS record in Namecheap is correct

### Firebase Deployment Issues:

- Ensure `out` directory exists after `npm run build`
- Check `firebase.json` configuration
- Verify Firebase project and site ID are correct

### SSL Certificate Issues:

- Firebase automatically provisions SSL (can take up to 24 hours)
- Check Firebase Console → Hosting → Custom domains for status

### Build Errors:

- Ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Verify environment variables are set

---

## 📞 Support

If you encounter issues:

1. Check Firebase Console logs
2. Check Next.js build output
3. Verify DNS propagation: https://www.whatsmydns.net/
4. Review Firebase documentation: https://firebase.google.com/docs/hosting

---

## 📝 Notes

- **Environment Variables**: Copy `.env.local` from old project if using Supabase
- **Supabase Setup**: Ensure newsletter table exists in Supabase
- **Analytics**: Consider separate Google Analytics for app site
- **Performance**: Both sites use static export for optimal performance

---

**Last Updated**: December 5, 2025
**Status**: Ready for migration
