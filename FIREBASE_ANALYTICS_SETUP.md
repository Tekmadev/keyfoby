# Firebase Analytics Setup Guide for KeyFoby

## 🚀 Quick Setup Overview

Firebase Analytics has been pre-configured for your KeyFoby project. You just need to add your environment variables and you're ready to track user interactions!

## 📋 Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project: **key-foby** (or create a new one)
3. Click on the gear icon ⚙️ → **Project Settings**
4. Scroll down to "Your apps" section
5. If you don't have a web app, click **Add app** → **Web** (</>)
6. Register your app with name: "KeyFoby Website"
7. Copy the configuration values

## 📝 Step 2: Add Environment Variables

Copy the template from `.env.example` to your `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual Firebase values:

```env
# EmailJS Configuration (keep existing values)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Firebase Analytics Configuration (ADD THESE)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=key-foby.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=key-foby
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=key-foby.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔧 Step 3: Enable Analytics in Firebase Console

1. In Firebase Console, go to **Analytics** → **Dashboard**
2. If not enabled, click **Enable Google Analytics**
3. Link to existing Google Analytics account or create new one
4. Choose your Google Analytics account
5. Select or create a Google Analytics 4 property
6. Complete the setup

## ✅ Step 4: Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`
3. Open browser developer tools (F12)
4. Check the Console tab for any Firebase errors
5. Go to **Network** tab and look for analytics requests to `google-analytics.com`

## 📊 What's Being Tracked

Your KeyFoby website will automatically track:

### 🎯 Business Events

- **Quote Requests**: When users submit the contact form
- **Phone Clicks**: When users click phone numbers
- **WhatsApp Clicks**: When users click WhatsApp buttons
- **Email Clicks**: When users click email addresses
- **Service Views**: When users view different service sections
- **Navigation Clicks**: When users click navigation links

### 📈 Page Analytics

- **Page Views**: Automatic page view tracking
- **User Engagement**: Time on page, scroll depth
- **Traffic Sources**: Where users come from
- **Device Information**: Mobile vs desktop usage

## 🔍 View Your Analytics

### Firebase Analytics Dashboard

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Analytics** → **Dashboard**
4. View real-time and historical data

### Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your KeyFoby property
3. View detailed reports and insights

## 🎯 Custom Events Reference

The following custom events are tracked:

```javascript
// Contact form submissions
trackContactFormSubmit(serviceType);

// Communication clicks
trackPhoneClick();
trackWhatsAppClick();
trackEmailClick();

// Navigation
trackNavigation(sectionName);
trackServiceView(serviceType);

// Page views
trackPageView(pageName);
```

## 🚨 Troubleshooting

### Common Issues:

1. **Analytics not working**

   - Check environment variables are correctly set
   - Ensure `NEXT_PUBLIC_` prefix is used
   - Restart development server after adding env vars

2. **Console errors about Firebase**

   - Verify all Firebase config values are correct
   - Check if Analytics is enabled in Firebase Console
   - Ensure you're using the web app configuration (not mobile)

3. **No data in Firebase Analytics**
   - Wait 24-48 hours for initial data
   - Use Firebase DebugView for real-time testing
   - Check if ad blockers are interfering

### Debug Mode Setup:

For real-time debugging, add this to your browser's developer console:

```javascript
gtag("config", "YOUR_MEASUREMENT_ID", {
  debug_mode: true,
});
```

## 🎉 Success!

Once setup is complete, you'll have:

- ✅ Automatic page view tracking
- ✅ Custom business event tracking
- ✅ Real-time analytics dashboard
- ✅ Integration with Google Analytics 4
- ✅ Mobile and desktop analytics
- ✅ Conversion tracking for leads

Your KeyFoby website is now equipped with professional analytics to help you understand your customers and grow your business!

## 📞 Need Help?

If you encounter any issues during setup, check:

1. Firebase Console for configuration errors
2. Browser developer tools for JavaScript errors
3. This guide for missed steps

The analytics setup is designed to work seamlessly with your existing Firebase hosting configuration.
