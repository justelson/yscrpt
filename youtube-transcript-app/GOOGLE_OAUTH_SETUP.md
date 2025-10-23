# Google OAuth Setup for yscrpt

## Credentials
- **Client ID**: `548181107797-q318cv5b7uanogifcsf5uqitke6v0sda.apps.googleusercontent.com`
- **Client Secret**: `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`

## Required Configuration in Google Cloud Console

### 1. Authorized JavaScript Origins
Add these to your Google OAuth client:
```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

### 2. Authorized Redirect URIs
Add these to your Google OAuth client:
```
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

## How It Works

1. **User clicks "Continue with Google"**
   - Redirects to Google OAuth consent screen
   - User authorizes the app

2. **Google redirects back to `/auth/callback`**
   - URL contains authorization code and state
   - `GoogleCallback` component handles the response

3. **Exchange code for tokens**
   - Backend exchanges authorization code for access token
   - Retrieves user info from Google

4. **Create/Sign in user**
   - Uses email from Google to create or sign in user
   - Sends magic link for verification
   - User completes sign-in

## Files

- `src/lib/googleAuth.js` - OAuth flow logic
- `src/components/GoogleCallback.jsx` - Callback handler
- `.env` - Environment variables (not committed to git)

## Security Notes

- State parameter prevents CSRF attacks
- Client secret should be kept secure
- In production, use environment variables
- Never expose client secret in frontend code

## Testing

1. Start dev server: `npm run dev`
2. Navigate to sign-in page
3. Click "Continue with Google"
4. Authorize the app
5. Should redirect back and complete sign-in

## Troubleshooting

### "redirect_uri_mismatch" error
- Check that redirect URI in code matches Google Console
- Ensure protocol (http/https) matches exactly
- Check for trailing slashes

### "invalid_client" error
- Verify client ID and secret are correct
- Check that OAuth client is enabled in Google Console

### "access_denied" error
- User cancelled authorization
- Check OAuth scopes are correct
