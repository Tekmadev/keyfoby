# Firebase Subdomain Setup Guide - app.keyfoby.com

## 🎯 Quick Setup Steps

### 1. Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create new one)
3. **Navigate to**: Hosting → **Add another site**
4. **Enter Site ID**: `keyfoby-app` (or your preferred name)
5. **Click Continue**

### 2. Get DNS Records from Firebase

After creating the site:

1. Click on your new site in Firebase Hosting
2. Go to **Custom domains** tab
3. Click **Add custom domain**
4. Enter: `app.keyfoby.com`
5. Firebase will show you DNS records to add

**You'll see one of these:**

#### Option A: A Record (IPv4)

```
Type: A
Host: app
Value: [IP address from Firebase]
TTL: 300
```

#### Option B: CNAME Record

```
Type: CNAME
Host: app
Value: [CNAME target from Firebase, e.g., keyfoby-app.web.app]
TTL: 300
```

### 3. Add DNS Record in Namecheap

1. **Login**: https://www.namecheap.com/
2. **Go to**: Domain List → Select `keyfoby.com` → **Manage**
3. **Click**: **Advanced DNS** tab
4. **Add Record**:
   - Click **Add New Record**
   - Select Type (A or CNAME based on Firebase)
   - Host: `app`
   - Value: [From Firebase]
   - TTL: Automatic (or 300)
   - Click **Save**

### 4. Verify Domain in Firebase

1. **Wait 5-10 minutes** for DNS propagation
2. **Go back to Firebase**: Hosting → Custom domains
3. **Click Verify** next to `app.keyfoby.com`
4. **Wait for SSL**: Firebase automatically provisions SSL (can take up to 24 hours)

### 5. Deploy Your Site

```bash
# In your new project directory
cd keyfoby-app-landing

# Build Next.js app
npm run build

# Deploy to Firebase (replace 'keyfoby-app' with your site ID)
firebase deploy --only hosting:keyfoby-app
```

### 6. Verify Deployment

1. Visit `https://app.keyfoby.com` in browser
2. Check SSL certificate is active (green lock icon)
3. Test all functionality

---

## 🔍 Troubleshooting

### DNS Not Working?

- **Check propagation**: https://www.whatsmydns.net/#A/app.keyfoby.com
- **Wait longer**: DNS can take 24-48 hours to fully propagate
- **Verify record**: Double-check the record in Namecheap matches Firebase exactly

### SSL Certificate Issues?

- **Wait**: SSL provisioning can take up to 24 hours
- **Check status**: Firebase Console → Hosting → Custom domains
- **Status should show**: "Certificate active" (green checkmark)

### Deployment Fails?

- **Check build**: Ensure `npm run build` succeeds
- **Verify site ID**: Use correct Firebase site ID in deploy command
- **Check Firebase CLI**: Ensure you're logged in (`firebase login`)

### Site Not Loading?

- **Check Firebase Console**: Verify deployment was successful
- **Check DNS**: Ensure DNS record is correct
- **Clear cache**: Try incognito/private browsing mode

---

## 📋 Firebase Hosting Configuration

Your `firebase.json` should look like this:

```json
{
  "hosting": [
    {
      "target": "keyfoby-app",
      "public": "out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "cleanUrls": true,
      "trailingSlash": false
    }
  ]
}
```

**Note**: If you have multiple sites, use the array format above. If only one site, use the simpler format from the migration guide.

---

## ✅ Verification Checklist

- [ ] Firebase site created
- [ ] DNS record added in Namecheap
- [ ] DNS propagated (check with whatsmydns.net)
- [ ] Domain verified in Firebase
- [ ] SSL certificate active
- [ ] Site deployed successfully
- [ ] Site accessible at https://app.keyfoby.com
- [ ] All links and functionality working

---

## 🔗 Related Documentation

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-do-i-add-a-subdomain-for-my-domain/)

---

**Last Updated**: December 5, 2025
