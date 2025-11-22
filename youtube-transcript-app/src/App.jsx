import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { GoogleCallback } from './components/GoogleCallback';
import { GoogleSuccess } from './components/GoogleSuccess';
import { About } from './components/About';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Privacy } from './components/Privacy';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { FetchView } from './components/FetchView';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { AIToolsRouter } from './components/AIToolsRouter';
import { MemoriesView } from './components/MemoriesView';
import { MemoryDetail } from './components/MemoryDetail';
import api from './lib/api';
import './index.css';

function AppContent() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { user: currentUser } = await api.getCurrentUser();
                setUser(currentUser);
            } catch {
                // Not authenticated
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        try {
            await api.signOut();
            setUser(null);
            localStorage.removeItem('google_authenticated');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_picture');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<SignIn onSuccess={setUser} />} />
                <Route path="/signup" element={<SignUp onSuccess={setUser} />} />
                <Route path="/auth/callback" element={<GoogleCallback />} />
                <Route path="/auth/google-success" element={<GoogleSuccess onSuccess={setUser} />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
        );
    }

    // If user is authenticated and tries to access landing/auth pages, redirect to app
    const publicPages = ['/', '/signin', '/signup', '/login', '/about', '/features', '/how-it-works', '/privacy'];
    if (publicPages.includes(location.pathname)) {
        return <Navigate to="/fetch" replace />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar onSignOut={handleSignOut} user={user} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/fetch" replace />} />
                    <Route path="/fetch" element={<FetchView user={user} />} />
                    <Route path="/ai-tools/*" element={<AIToolsRouter user={user} />} />
                    <Route path="/memories" element={<MemoriesView user={user} />} />
                    <Route path="/memories/:id" element={<MemoryDetail user={user} />} />
                    <Route path="/library" element={<LibraryView user={user} />} />
                    <Route path="/settings" element={<SettingsView user={user} onSignOut={handleSignOut} />} />
                    <Route path="*" element={<Navigate to="/fetch" replace />} />
                </Routes>
            </main>
            <MobileNav />
        </div>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
