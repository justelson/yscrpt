import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback, getOAuthParams } from '../lib/googleAuth';

export function GoogleCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        let processed = false;

        const processCallback = async () => {
            // Prevent double execution in StrictMode
            if (processed) return;
            processed = true;

            try {
                const { code, state, error: oauthError } = getOAuthParams();

                if (oauthError) {
                    setError(`OAuth error: ${oauthError}`);
                    setTimeout(() => navigate('/signin'), 3000);
                    return;
                }

                if (!code || !state) {
                    setError('Missing OAuth parameters');
                    setTimeout(() => navigate('/signin'), 3000);
                    return;
                }

                // Check if already processed
                const alreadyProcessed = sessionStorage.getItem('oauth_processed');
                if (alreadyProcessed === code) {
                    // Already processed, just redirect
                    const pendingUser = sessionStorage.getItem('pending_google_user');
                    if (pendingUser) {
                        const userInfo = JSON.parse(pendingUser);
                        navigate('/signin', { 
                            state: { 
                                email: userInfo.email,
                                fromGoogle: true 
                            } 
                        });
                    } else {
                        navigate('/signin');
                    }
                    return;
                }

                // Handle the OAuth callback
                const { userInfo, tokens } = await handleGoogleCallback(code, state);

                // Store user info and tokens
                sessionStorage.setItem('google_user', JSON.stringify(userInfo));
                sessionStorage.setItem('google_tokens', JSON.stringify(tokens));

                // Redirect to success page to handle user creation/login
                navigate('/auth/google-success', { 
                    state: { 
                        userInfo,
                        tokens
                    } 
                });

            } catch (err) {
                console.error('OAuth callback error:', err);
                
                // Don't show error if it's just a duplicate processing attempt
                if (err.message !== 'Callback already processed') {
                    setError(err.message || 'Authentication failed');
                    setTimeout(() => navigate('/signin'), 3000);
                }
            }
        };

        processCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                {error ? (
                    <>
                        <div className="text-red-500 text-lg font-semibold">
                            {error}
                        </div>
                        <p className="text-muted-foreground">
                            Redirecting to sign in...
                        </p>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">
                            Completing sign in with Google...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}