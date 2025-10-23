import { Button } from './ui/button';
import { HyperText } from './ui/hyper-text';
import { Video, Heart, Users, Target, Shield, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SharedFooter } from './SharedFooter';

export function About() {
    const navigate = useNavigate();

    const values = [
        {
            icon: Target,
            title: 'Simplicity',
            description: 'No complicated workflows. Just paste, fetch, and use. We believe powerful tools should be easy to use.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Shield,
            title: 'Privacy',
            description: 'Your data is yours. We respect your privacy and security with industry-standard encryption.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'Constantly improving with AI and new features. We stay ahead so you can work smarter.',
            gradient: 'from-orange-500 to-amber-500',
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
                            <span className="text-sm font-medium text-primary">Our Story</span>
                        </div>
                        <h1 className="text-6xl font-bold mb-6">
                            <HyperText className="text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                About yscrpt
                            </HyperText>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Making YouTube transcripts accessible, searchable, and transformable for everyone
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Visual Side */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl" />
                                <div className="relative bg-card border border-border p-12 shadow-2xl">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto shadow-lg">
                                        <Video className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary animate-pulse" />
                                            <span className="text-sm text-muted-foreground">Instant Access</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-500 animate-pulse" />
                                            <span className="text-sm text-muted-foreground">AI-Powered</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-500 animate-pulse" />
                                            <span className="text-sm text-muted-foreground">Always Free</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary to-purple-500 text-white text-sm font-bold">
                                    Our Mission
                                </div>
                                <h2 className="text-4xl font-bold">Transforming How You Work With Video Content</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    We believe that video content should be accessible, searchable, and transformable. yscrpt was built to help content creators, students, researchers, and professionals extract maximum value from YouTube videos.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    No more pausing and rewinding. No more manual transcription. Just instant access to the content you need, in the format you want.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why We Built This */}
                <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-2xl" />
                                <div className="relative bg-card border border-border p-10 hover:border-blue-500/50 transition-all duration-500">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                                        <Heart className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Built with Care</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Every feature in yscrpt is designed with user experience in mind. We focus on simplicity, speed, and reliability to make your workflow seamless and enjoyable.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent blur-2xl" />
                                <div className="relative bg-card border border-border p-10 hover:border-purple-500/50 transition-all duration-500">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">For Everyone</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Whether you're a student taking notes, a content creator analyzing videos, or a researcher gathering data, yscrpt is built to empower your workflow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                <HyperText>What We Stand For</HyperText>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Our core values guide everything we build and every decision we make
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <div key={index} className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent blur-xl group-hover:blur-2xl transition-all duration-500" />
                                        <div className="relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-500 h-full">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-24 text-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative max-w-4xl mx-auto px-6">
                    <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
                    <h2 className="text-4xl font-bold mb-4 text-white">Join Us Today</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Be part of a community that's transforming how we work with video content
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
