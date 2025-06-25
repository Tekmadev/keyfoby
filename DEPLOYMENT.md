# KeyFoby Deployment Guide

## 🚀 Project Build Setup

This project is configured for **static export** which means it generates a fully static website that can be deployed to any static hosting service.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with your EmailJS credentials:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your actual EmailJS values:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### 2. EmailJS Setup

Ensure you have completed the EmailJS setup as described in `EMAILJS_SETUP.md`:

- ✅ Created EmailJS account
- ✅ Configured email service
- ✅ Created email template using `email-template.html`
- ✅ Updated environment variables

## 🔨 Build Commands

### Development

```bash
npm run dev
```

Starts development server with Turbopack for fast development.

### Production Build

```bash
npm run build
```

Creates optimized production build and exports static files to `/out` folder.

### Export Only

```bash
npm run export
```

Same as build - creates static export.

### Deploy (Build + Export)

```bash
npm run deploy
```

Runs complete build and export process.

## 📁 Output Structure

After building, your static files will be in the `/out` folder:

```
out/
├── index.html          # Main page
├── _next/             # Next.js assets
│   ├── static/        # Static assets
│   └── ...
├── images/            # Your images
└── ...                # Other static files
```

## 🌐 Deployment Options

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

**Firebase Configuration:**

- Public directory: `out`
- Single-page app: `Yes`
- Rewrite all URLs to index.html: `Yes`

### Option 2: Netlify

1. Build the project: `npm run build`
2. Upload the `/out` folder to Netlify
3. Or connect your GitHub repo to Netlify with these settings:
   - Build command: `npm run build`
   - Publish directory: `out`

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 4: GitHub Pages

1. Build: `npm run build`
2. Push the `/out` folder contents to your `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 5: Any Static Host

Upload the contents of the `/out` folder to any static hosting service:

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Surge.sh
- Netlify Drop

## ⚙️ Configuration Notes

### Image Optimization

- Images are set to `unoptimized: true` for static export compatibility
- All images work without Next.js image optimization server

### Routing

- `trailingSlash: true` ensures consistent URLs
- All routes are pre-rendered as static HTML files

### Environment Variables

- Only `NEXT_PUBLIC_*` variables are included in the build
- EmailJS credentials are safely embedded in the client bundle

## 🔧 Troubleshooting

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Restart development server after adding new variables
- Check that `.env.local` is in project root

### EmailJS Not Working

- Verify all three environment variables are set
- Check EmailJS dashboard for correct IDs
- Ensure email template uses correct variable names
- Test EmailJS configuration independently

## 📊 Performance Optimization

The build includes:

- ✅ Static HTML generation
- ✅ CSS optimization and minification
- ✅ JavaScript bundling and minification
- ✅ Image optimization (unoptimized for static export)
- ✅ Font optimization
- ✅ Code splitting

## 🚀 Quick Deploy Commands

```bash
# Complete deployment workflow
npm install                 # Install dependencies
npm run build              # Build static export
# Upload /out folder to your hosting service
```

## 📝 Custom Domain Setup

After deployment, you can set up a custom domain:

1. Point your domain to your hosting service
2. Update any necessary DNS records
3. Enable HTTPS (most hosts provide this automatically)

Your KeyFoby website will be ready for production! 🎉
