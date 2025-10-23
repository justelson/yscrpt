# InstantDB Setup Guide

## Step 1: Create an InstantDB Account

1. Go to https://instantdb.com/
2. Sign up for a free account
3. Create a new app

## Step 2: Get Your App ID

1. In your InstantDB dashboard, you'll see your App ID
2. Copy the App ID (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 3: Update the Configuration

Open `src/lib/instantdb.js` and replace `YOUR_APP_ID_HERE` with your actual App ID:

```javascript
const APP_ID = 'your-actual-app-id-here';
```

## Step 4: Set Up the Schema (Optional)

InstantDB is schemaless by default, but you can define a schema in your dashboard for better type safety.

### Recommended Schema:

```javascript
{
  transcripts: {
    videoId: "string",
    title: "string",
    author: "string",
    url: "string",
    transcript: "json",
    videoInfo: "json",
    userId: "string",
    createdAt: "number"
  }
}
```

## Step 5: Configure Authentication

### Email Authentication
1. In your InstantDB dashboard, go to the Auth section
2. Enable Email authentication
3. Configure your email settings (or use the default)

### Google OAuth (Optional but Recommended)
1. In your InstantDB dashboard, go to the Auth section
2. Click on "Google" to enable Google OAuth
3. Follow the instructions to set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs (InstantDB will provide these)
   - Copy the Client ID and Client Secret
   - Paste them into your InstantDB dashboard
4. Save the configuration

## Step 6: Test the App

1. Start your backend server: `npm run server`
2. Start your frontend: `npm run dev`
3. Open http://localhost:5173
4. Click "Get Started Free"
5. Enter your email to receive a magic link
6. Sign in and start using the app!

## Features

- ✅ Magic link authentication (no passwords!)
- ✅ Save transcripts to your personal library
- ✅ Download transcripts in SRT, TXT, or JSON format
- ✅ Search and filter your saved transcripts
- ✅ Beautiful dashboard with dark mode
- ✅ Real-time sync across devices

## Troubleshooting

**"Invalid App ID" error:**
- Make sure you copied the correct App ID from your dashboard
- Check that there are no extra spaces or quotes

**Authentication not working:**
- Check your email spam folder
- Make sure email authentication is enabled in your InstantDB dashboard

**Data not saving:**
- Check the browser console for errors
- Make sure you're signed in
- Verify your App ID is correct
