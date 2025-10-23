import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { VerificationCode } from './VerificationCode';
import { initiateGoogleSignIn } from '../lib/googleAuth';
// This component is deprecated - use SignIn/SignUp instead

export function AuthSystem() {
    const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'magic'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [sentEmail, setSentEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = () => {
        // Use custom Google OAuth
        initiateGoogleSignIn();
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                }
                // For InstantDB, we'll use magic link for signup and show success message
                await db.auth.sendMagicCode({ email });
                setSentEmail(email);
                setEmail('');
                setError('Account created! Check your email for verification.');
            } else if (mode === 'signin') {
                // For InstantDB, use magic link authentication
                await db.auth.sendMagicCode({ email });
                setSentEmail(email);
                setEmail('');
            } else if (mode === 'magic') {
                // Send magic link
                await db.auth.sendMagicCode({ email });
                setSentEmail(email);
                setEmail('');
            }
        } catch (error) {
            setError(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleMagicCodeVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const code = e.target.code.value;
            await db.auth.signInWithMagicCode({ email: sentEmail, code });
        } catch (error) {
            setError(error.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    // Magic code verification view
    if (sentEmail) {
        return (
            <VerificationCode
                email={sentEmail}
                onVerify={(code) => handleMagicCodeVerify({ preventDefault: () => {}, target: { code: { value: code } } })}
                onBack={() => setSentEmail('')}
                loading={loading}
                error={error}
                title="Check your email"
            />
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Magic Link'}
                    </CardTitle>
                    <CardDescription>
                        {mode === 'signin' 
                            ? 'Welcome back to yscrpt' 
                            : mode === 'signup' 
                            ? 'Create your yscrpt account'
                            : 'Get a magic link sent to your email'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Google Sign In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        
                        {mode !== 'magic' && (
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        )}

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                'Loading...'
                            ) : mode === 'signin' ? (
                                'Sign In'
                            ) : mode === 'signup' ? (
                                'Create Account'
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Magic Link
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Mode Switcher */}
                    <div className="space-y-2 text-center text-sm">
                        {mode === 'signin' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setMode('signup')}
                                    className="text-primary hover:underline"
                                >
                                    Don't have an account? Sign up
                                </button>
                                <br />
                                <button
                                    type="button"
                                    onClick={() => setMode('magic')}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Use magic link instead
                                </button>
                            </>
                        )}
                        
                        {mode === 'signup' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setMode('signin')}
                                    className="text-primary hover:underline"
                                >
                                    Already have an account? Sign in
                                </button>
                                <br />
                                <button
                                    type="button"
                                    onClick={() => setMode('magic')}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Use magic link instead
                                </button>
                            </>
                        )}
                        
                        {mode === 'magic' && (
                            <button
                                type="button"
                                onClick={() => setMode('signin')}
                                className="text-primary hover:underline"
                            >
                                Back to sign in
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}