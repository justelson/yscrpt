import { Button } from './ui/button';
import { HyperText } from './ui/hyper-text';
import { Link2, FileText, Sparkles, Download, ArrowRight, CheckCircle2, MoveDown, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SharedFooter } from './SharedFooter';

export function HowItWorks() {
    const navigate = useNavigate();

    const steps = [
        {
            number: '01',
            icon: Link2,
            title: 'Paste YouTube URL',
            description: 'Copy any YouTube video URL and paste it into yscrpt. Works with any public video that has captions available.',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
        },
        {
            number: '02',
            icon: FileText,
            title: 'Get Transcript',
            description: 'Our system instantly fetches the complete transcript with timestamps. View it in a clean, readable format.',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
        },
        {
            number: '03',
            icon: Sparkles,
            title: 'Use AI Tools',
            description: 'Summarize the video, extract key points, generate study notes, or transform the content using our AI-powered tools.',
            color: 'green',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
        },
        {
            number: '04',
            icon: Download,
            title: 'Save & Export',
            description: 'Save transcripts to your library for later or download them in your preferred format (SRT, TXT, JSON).',
            color: 'orange',
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        },
    ];

    const benefits = [
        'No manual copying or typing',
        'Works with any YouTube video',
        'AI-powered content transformation',
        'Multiple export formats',
        'Organized library system',
        'Lightning-fast processing',
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopBar />
            <div className="pt-20">

                {/* Hero Section */}
                <section className="relative py-24 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20">
                            <span className="text-sm font-medium text-primary">Simple & Powerful</span>
                        </div>
                        <h1 className="text-6xl font-bold mb-6">
                            <HyperText className="text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                How It Works
                            </HyperText>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Transform any YouTube video into actionable text in just four simple steps. No technical knowledge required.
                        </p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="space-y-0">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <div key={index} className="relative">
                                        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center py-12`}>
                                            {/* Content Side */}
                                            <div className="flex-1 space-y-6">
                                                <div className="space-y-4">
                                                    <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${step.gradient} text-white text-sm font-bold`}>
                                                        Step {step.number}
                                                    </div>
                                                    <h3 className="text-4xl font-bold">{step.title}</h3>
                                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Visual Side */}
                                            <div className="flex-1 flex justify-center">
                                                <div className="relative group">
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
                                                    <div className="relative bg-card border border-border p-12 shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                                                        <div className={`w-32 h-32 bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                                                            <Icon className="w-16 h-16 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flow Arrow */}
                                        {index < steps.length - 1 && (
                                            <div className="relative h-24 flex items-center justify-center">
                                                {/* Desktop Arrow - Alternating directions */}
                                                <div className="hidden md:block">
                                                    {isEven ? (
                                                        // Arrow going from right to left and down
                                                        <svg className="w-full h-24 absolute inset-0" viewBox="0 0 800 100" preserveAspectRatio="none">
                                                            <path
                                                                d="M 600 10 L 600 50 L 200 50 L 200 90"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                className="text-primary/40"
                                                                strokeDasharray="8,8"
                                                            />
                                                            <polygon
                                                                points="200,90 195,80 205,80"
                                                                fill="currentColor"
                                                                className="text-primary/60"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        // Arrow going from left to right and down
                                                        <svg className="w-full h-24 absolute inset-0" viewBox="0 0 800 100" preserveAspectRatio="none">
                                                            <path
                                                                d="M 200 10 L 200 50 L 600 50 L 600 90"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                className="text-primary/40"
                                                                strokeDasharray="8,8"
                                                            />
                                                            <polygon
                                                                points="600,90 595,80 605,80"
                                                                fill="currentColor"
                                                                className="text-primary/60"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                {/* Mobile Arrow - Straight down */}
                                                <div className="md:hidden flex flex-col items-center">
                                                    <div className="h-16 w-0.5 bg-gradient-to-b from-primary/40 to-transparent" />
                                                    <MoveDown className="w-6 h-6 text-primary/60 -mt-2" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <HyperText>Why Choose yscrpt?</HyperText>
                            </h2>
                            <p className="text-lg text-muted-foreground">Everything you need to work smarter with video content</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-4 bg-card border border-border p-6 hover:border-primary/50 transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-lg font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-24 text-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already working smarter with YouTube transcripts
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/signup')}
                        className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-6 h-auto"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-white/80 mt-4 text-sm">No credit card required • Free forever</p>
                </div>
            </section>

            <SharedFooter />
        </div>
    );
}
