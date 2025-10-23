import { Button } from './ui/button';
import { HyperText } from './ui/hyper-text';
import { Video, Sparkles, BookOpen, Download, Zap, Search, FileText, ArrowRight, Clock, Shield, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SharedFooter } from './SharedFooter';

export function Features() {
    const navigate = useNavigate();

    const mainFeatures = [
        {
            icon: Video,
            title: 'Instant Transcript Fetch',
            description: 'Simply paste any YouTube URL and get the complete transcript in seconds. No more manual copying or third-party tools.',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
        },
        {
            icon: Sparkles,
            title: 'AI-Powered Analysis',
            description: 'Leverage advanced AI to summarize videos, extract key points, generate study notes, and transform content into different formats.',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
        },
        {
            icon: BookOpen,
            title: 'Organized Library',
            description: 'Save all your transcripts in one place. Search, filter, and organize your content library with ease.',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
        },
        {
            icon: Download,
            title: 'Multiple Export Formats',
            description: 'Download transcripts in SRT, TXT, or JSON formats. Perfect for subtitles, documentation, or data analysis.',
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        },
    ];

    const additionalFeatures = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Get results in seconds, not minutes. Our optimized system ensures you spend less time waiting.',
        },
        {
            icon: Search,
            title: 'Smart Search',
            description: 'Find specific topics, quotes, or timestamps across all your saved transcripts instantly.',
        },
        {
            icon: Clock,
            title: 'Timestamp Support',
            description: 'Every transcript includes precise timestamps for easy navigation and reference.',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is encrypted and secure. We never share your information with third parties.',
        },
        {
            icon: Layers,
            title: 'Batch Processing',
            description: 'Process multiple videos at once and save time on large projects.',
        },
        {
            icon: FileText,
            title: 'Clean Formatting',
            description: 'Transcripts are formatted for readability with proper punctuation and structure.',
        },
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
                            <span className="text-sm font-medium text-primary">Powerful & Simple</span>
                        </div>
                        <h1 className="text-6xl font-bold mb-6">
                            <HyperText className="text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Powerful Features
                            </HyperText>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Everything you need to work with YouTube transcripts efficiently, all in one place
                        </p>
                    </div>
                </section>

                {/* Main Features */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            {mainFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
                                        <div className="relative bg-card border border-border p-10 hover:border-primary/50 transition-all duration-500 h-full">
                                            <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Additional Features */}
                <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                <HyperText>And There's More</HyperText>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Additional features designed to make your workflow seamless
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {additionalFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="bg-card border border-border p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                                        <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-5">
                                            <Icon className="w-7 h-7 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Feature Comparison */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-card border border-border p-10 shadow-xl">
                            <h2 className="text-3xl font-bold mb-8 text-center">
                                <HyperText>Why Choose yscrpt?</HyperText>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 flex items-center justify-center mt-1">
                                        <div className="w-3 h-3 bg-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1">No Browser Extensions Required</h4>
                                        <p className="text-muted-foreground">Works directly in your browser without installing anything</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 flex items-center justify-center mt-1">
                                        <div className="w-3 h-3 bg-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1">Always Up-to-Date</h4>
                                        <p className="text-muted-foreground">Automatic updates with new features and improvements</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 flex items-center justify-center mt-1">
                                        <div className="w-3 h-3 bg-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1">Free to Use</h4>
                                        <p className="text-muted-foreground">Core features are completely free with no hidden costs</p>
                                    </div>
                                </div>
                            </div>
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
                        Experience all these powerful features for free. No credit card required.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/signup')}
                        className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-6 h-auto"
                    >
                        Try yscrpt Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-white/80 mt-4 text-sm">Start working smarter today</p>
                </div>
            </section>

            <SharedFooter />
        </div>
    );
}
