import { Button } from './ui/button';
import { Video, FileText, Download, Sparkles, Zap, Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SharedFooter } from './SharedFooter';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopBar />

            {/* Add padding top to account for fixed header */}
            <div className="pt-20">

                {/* Hero Section */}
                <section className="text-center py-12 md:py-20 px-4 md:px-6">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        YouTube transcripts made <span className="text-primary">simple</span>
                    </h1>
                    <p className="text-base md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground">
                        Extract, analyze, and transform YouTube video transcripts with AI. Perfect for content creators, students, and researchers who want to work smarter.
                    </p>
                    <Button size="lg" onClick={() => navigate('/signup')} className="mb-3 md:mb-4 w-full md:w-auto">Get Started Free</Button>
                    <p className="text-sm md:text-base text-muted-foreground">No credit card required</p>
                </section>

                {/* Dashboard Preview Section */}
                <section className="py-12 md:py-20 px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-card rounded-lg p-4 md:p-8 border border-border">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-64 md:h-96 rounded-lg flex items-center justify-center">
                                <div className="text-center px-4">
                                    <Video className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 text-primary" />
                                    <p className="text-xl md:text-2xl font-semibold text-foreground">Your transcript workspace</p>
                                    <p className="text-sm md:text-base text-muted-foreground mt-2">Clean, organized, and powerful</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why yscrpt? */}
                <section className="py-12 md:py-20 px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                        Why yscrpt?
                    </h2>
                    <p className="text-base md:text-xl max-w-3xl mx-auto text-muted-foreground">
                        Stop copying and pasting from YouTube. yscrpt gives you instant access to any video transcript, with AI-powered tools to summarize, analyze, and transform content in seconds.
                    </p>
                </section>

                {/* Features */}
                <section className="py-12 md:py-20 px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
                        Everything you need. Nothing you don't
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center mb-4 md:mb-6">
                                <Video className="w-14 h-14 md:w-20 md:h-20 text-blue-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">Instant Transcript Fetch</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Paste any YouTube URL and get the full transcript in seconds. No more manual copying.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex items-center justify-center mb-4 md:mb-6">
                                <Sparkles className="w-14 h-14 md:w-20 md:h-20 text-purple-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">AI-Powered Analysis</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Summarize, extract key points, or transform content with advanced AI tools.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex items-center justify-center mb-4 md:mb-6">
                                <BookOpen className="w-14 h-14 md:w-20 md:h-20 text-green-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">Organized Library</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Save and organize all your transcripts in one place. Search and find anything instantly.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 flex items-center justify-center mb-4 md:mb-6">
                                <Download className="w-14 h-14 md:w-20 md:h-20 text-orange-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">Export Anywhere</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Download transcripts in multiple formats. Use them in your favorite tools.</p>
                        </div>
                    </div>
                </section>

                {/* AI Tools Section */}
                <section className="py-12 md:py-20 px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center">
                        Powered by AI
                    </h2>
                    <p className="text-base md:text-xl mb-8 md:mb-12 text-center max-w-3xl mx-auto text-muted-foreground">
                        Transform transcripts into actionable insights with our suite of AI-powered tools.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        <div className="bg-card rounded-lg p-5 md:p-6 border border-border">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-24 md:h-32 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                                <Zap className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Quick Summaries</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Get the key points from any video in seconds.</p>
                        </div>
                        <div className="bg-card rounded-lg p-5 md:p-6 border border-border">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-24 md:h-32 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                                <Search className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Smart Search</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Find specific topics across all your transcripts.</p>
                        </div>
                        <div className="bg-card rounded-lg p-5 md:p-6 border border-border">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-24 md:h-32 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                                <FileText className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Content Transform</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Convert transcripts into blog posts, notes, and more.</p>
                        </div>
                    </div>
                </section>

            </div>
            
            <SharedFooter />
        </div>
    );
}
