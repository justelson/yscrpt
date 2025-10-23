import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

export function GoogleSuccess({ onSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Signing you in...');

    useEffect(() => {
        const completeGoogleSignIn = async () => {
            try {
                const userInfo = location.state?.userInfo || JSON.parse(sessionStorage.getItem('google_user') || '{}');

                if (!userInfo.email) {
                    setError('No user information found');
                    setTimeout(() => navigate('/signin'), 2000);
                    return;
                }

                setStatus('Creating or finding your account...');

                // Sign in with Google (creates user if doesn't exist)
                const { user } = await api.googleSignIn({
                    email: userInfo.email,
                    name: userInfo.name || '',
                    photoURL: userInfo.picture || '',
                    googleId: userInfo.id,
                });

                // Store user session
                localStorage.setItem('google_authenticated', 'true');
                localStorage.setItem('user_email', user.email);
                localStorage.setItem('user_name', user.name || '');
                localStorage.setItem('user_photoURL', user.photoURL || '');

                // Clean up session storage
                sessionStorage.removeItem('google_user');
                sessionStorage.removeItem('google_tokens');
                sessionStorage.removeItem('oauth_processed');

                setStatus('Success! Redirecting...');

                // Call onSuccess callback to update App state
                if (onSuccess) {
                    onSuccess(user);
                }

                // Redirect to app
                setTimeout(() => {
                    navigate('/fetch');
                }, 500);

            } catch (err) {
                console.error('Google sign-in completion error:', err);
                setError(err.message || 'Failed to complete sign-in');
                setTimeout(() => navigate('/signin'), 2000);
            }
        };

        completeGoogleSignIn();
    }, [navigate, location, onSuccess]);

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
                        <h2 className="text-2xl font-bold">Welcome!</h2>
                        <p className="text-muted-foreground">
                            {status}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
