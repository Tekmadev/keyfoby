# EmailJS Setup Instructions for KeyFoby

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Copy and paste the beautiful email template from `email-template.html`
4. Set up the template variables:
   - `{{name}}` - Customer name
   - `{{email}}` - Customer email
   - `{{phone}}` - Customer phone
   - `{{phone_clean}}` - Phone number without formatting (for WhatsApp)
   - `{{service}}` - Service type selected
   - `{{message}}` - Customer message
   - `{{date}}` - Submission date
   - `{{time}}` - Submission time
5. Save the template and note down your **Template ID**

## Step 4: Get Public Key

1. Go to "Account" in EmailJS dashboard
2. Find your **Public Key** (also called User ID)

## Step 5: Update Your Code

In `app/components/ContactForm.tsx`, replace these placeholders:

```typescript
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your Public Key
```

## Step 6: Test the Form

1. Fill out the contact form on your website
2. Submit the form
3. Check your email to see if you received the beautiful formatted email

## Email Template Features

The custom email template includes:

- ✨ Beautiful KeyFoby branding with gradient header
- 📧 Professional layout with customer information cards
- 🚨 Urgent alert banner to grab attention
- 📱 Quick action buttons (Email, Call, WhatsApp)
- 🎨 Modern design with proper spacing and colors
- 📊 Organized customer details in an easy-to-read format

## Troubleshooting

- If emails aren't sending, check your EmailJS service configuration
- Make sure all template variables are properly set up
- Check the browser console for any JavaScript errors
- Verify your EmailJS account limits (free tier has monthly limits)

## Security Note

The EmailJS keys used in the frontend are safe to expose as they're designed for client-side use. EmailJS handles the security on their end.
