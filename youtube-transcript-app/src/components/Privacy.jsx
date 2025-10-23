import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SharedFooter } from './SharedFooter';

export function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopBar />
            <div className="pt-20">

            {/* Content */}
            <div className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: October 22, 2025</p>

                <div className="space-y-8 text-foreground">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Introduction</h2>
                        <p className="text-muted-foreground">
                            At yscrpt, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Information We Collect</h2>
                        <p className="text-muted-foreground">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Email address for authentication</li>
                            <li>YouTube video URLs you submit</li>
                            <li>Transcripts you save to your library</li>
                            <li>Usage data and analytics</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                        <p className="text-muted-foreground">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Provide and maintain our service</li>
                            <li>Process your transcript requests</li>
                            <li>Save your transcripts to your personal library</li>
                            <li>Improve and optimize our service</li>
                            <li>Communicate with you about updates and features</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Data Security</h2>
                        <p className="text-muted-foreground">
                            We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest. We use InstantDB for secure data storage and authentication.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Third-Party Services</h2>
                        <p className="text-muted-foreground">
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>InstantDB for authentication and data storage</li>
                            <li>YouTube API for fetching video transcripts</li>
                            <li>AI services for transcript analysis and transformation</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Your Rights</h2>
                        <p className="text-muted-foreground">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Access your personal data</li>
                            <li>Delete your account and data</li>
                            <li>Export your saved transcripts</li>
                            <li>Opt out of communications</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Data Retention</h2>
                        <p className="text-muted-foreground">
                            We retain your personal information for as long as your account is active or as needed to provide you services. You can delete your account and all associated data at any time from your settings.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us through the app settings.
                        </p>
                    </section>
                </div>
            </div>
            </div>
            
            <SharedFooter />
        </div>
    );
}
