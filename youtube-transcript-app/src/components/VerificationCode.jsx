import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

export function VerificationCode({ 
    email, 
    onVerify, 
    onBack, 
    loading = false, 
    error = '', 
    title = "Check your email",
    subtitle = null 
}) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newCode.every(digit => digit !== '') && value) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (codeString = null) => {
        const finalCode = codeString || code.join('');
        if (finalCode.length === 6) {
            onVerify(finalCode);
        }
    };

    const handleResend = () => {
        setCountdown(60);
        // Add resend logic here
    };

    const formatEmail = (email) => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (username.length <= 2) return email;
        const masked = username.slice(0, 2) + '*'.repeat(username.length - 2);
        return `${masked}@${domain}`;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Content */}
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            {title}
                        </h1>
                        <p className="text-muted-foreground">
                            {subtitle || `Enter the 6-digit verification code sent to`}
                        </p>
                        {email && (
                            <p className="font-medium text-foreground">
                                {formatEmail(email)}
                            </p>
                        )}
                    </div>

                    {/* Code Input */}
                    <div className="flex justify-center gap-3">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl font-semibold border-2 border-border rounded-lg bg-muted/30 focus:border-primary focus:bg-background focus:outline-none transition-all"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {/* Verify Button */}
                    <Button
                        onClick={() => handleSubmit()}
                        disabled={loading || code.some(digit => !digit)}
                        className="w-full h-12 text-lg font-medium"
                        size="lg"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>

                    {/* Resend Code */}
                    <div className="text-center">
                        {countdown > 0 ? (
                            <p className="text-muted-foreground">
                                Resend code in {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                                {String(countdown % 60).padStart(2, '0')}
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-primary hover:underline font-medium"
                            >
                                Resend code
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}