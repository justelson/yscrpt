import { Button } from './ui/button';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SharedFooter() {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 px-6 overflow-hidden bg-muted/30">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-5xl font-bold mb-6">Start your free trial today</h2>
                <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                    yscrpt is the fit-for-purpose tool for extracting and managing YouTube transcripts with AI.
                </p>
                <Button size="lg" onClick={() => navigate('/signup')} className="mb-12">
                    Get Started
                </Button>
                
                {/* Footer Navigation */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-6">
                    <button onClick={() => navigate('/features')} className="hover:text-primary transition-colors">
                        Features
                    </button>
                    <button onClick={() => navigate('/how-it-works')} className="hover:text-primary transition-colors">
                        How It Works
                    </button>
                    <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors">
                        About
                    </button>
                    <button onClick={() => navigate('/signin')} className="hover:text-primary transition-colors">
                        Sign In
                    </button>
                </div>
                
                <div className="text-sm text-muted-foreground mb-8">
                    <button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">
                        Privacy Policy
                    </button>
                </div>

                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Video className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">yscrpt</span>
                </div>
                <p className="text-muted-foreground">© 2025 yscrpt. All rights reserved.</p>
            </div>
            
            {/* Large Background Text */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none h-64">
                <div className="text-[32rem] font-bold text-muted/20 leading-none whitespace-nowrap select-none absolute -bottom-32">
                    yscrpt
                </div>
            </div>
        </section>
    );
}