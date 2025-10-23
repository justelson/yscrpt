// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '548181107797-q318cv5b7uanogifcsf5uqitke6v0sda.apps.googleusercontent.com';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPES = 'email profile openid';

/**
 * Initiates Google OAuth flow
 */
export function initiateGoogleSignIn() {
    const state = generateRandomState();
    sessionStorage.setItem('oauth_state', state);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', SCOPES);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    window.location.href = authUrl.toString();
}

/**
 * Handles OAuth callback
 */
export async function handleGoogleCallback(code, state) {
    // Verify state
    const savedState = sessionStorage.getItem('oauth_state');
    
    // Check if we've already processed this callback
    const processedCallback = sessionStorage.getItem('oauth_processed');
    if (processedCallback === code) {
        throw new Error('Callback already processed');
    }
    
    if (state !== savedState) {
        throw new Error('Invalid state parameter');
    }
    
    // Mark as processed before removing state
    sessionStorage.setItem('oauth_processed', code);
    sessionStorage.removeItem('oauth_state');

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: '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',
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    });

    if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info');
    }

    const userInfo = await userInfoResponse.json();

    return {
        tokens,
        userInfo,
    };
}

/**
 * Generate random state for CSRF protection
 */
function generateRandomState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if we're on the callback page
 */
export function isOAuthCallback() {
    return window.location.pathname === '/auth/callback';
}

/**
 * Get OAuth parameters from URL
 */
export function getOAuthParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        code: params.get('code'),
        state: params.get('state'),
        error: params.get('error'),
    };
}