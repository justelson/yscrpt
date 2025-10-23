import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Video, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';

export function TopBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Auto scroll to top when route changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const handleSwipeClose = (e) => {
        if (e.type === 'touchstart') {
            const startY = e.touches[0].clientY;
            const handleTouchMove = (moveEvent) => {
                const currentY = moveEvent.touches[0].clientY;
                const diff = startY - currentY;
                if (diff > 50) { // Swipe up to close
                    setIsMobileMenuOpen(false);
                    document.removeEventListener('touchmove', handleTouchMove);
                }
            };
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', handleTouchMove);
            }, { once: true });
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg mx-4 mt-4 rounded-lg'
                    : 'bg-transparent'
                    }`}
            >
                <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'px-6 py-3' : 'px-6 py-6'
                    }`}>
                    {/* Logo - Left */}
                    <div
                        className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                        onClick={() => handleNavigation('/')}
                    >
                        <Video className="w-6 h-6 text-primary" />
                        <span className="text-xl font-bold text-primary">yscrpt</span>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={() => handleNavigation('/features')}
                            className="hover:text-primary transition-colors"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => handleNavigation('/how-it-works')}
                            className="hover:text-primary transition-colors"
                        >
                            How It Works
                        </button>
                        <button
                            onClick={() => handleNavigation('/about')}
                            className="hover:text-primary transition-colors"
                        >
                            About
                        </button>
                        <button
                            onClick={() => handleNavigation('/privacy')}
                            className="hover:text-primary transition-colors"
                        >
                            Privacy
                        </button>
                    </nav>

                    {/* Desktop Actions - Right */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <div className="flex items-center">
                            <ThemeToggle />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => handleNavigation('/signin')}
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => handleNavigation('/signup')}
                            size="sm"
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2 ml-auto">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onTouchStart={handleSwipeClose}
            >
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className={`absolute inset-0 bg-background transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center p-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Video className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold text-primary">yscrpt</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex flex-col p-6 space-y-6">
                        <nav className="space-y-4">
                            <button
                                onClick={() => handleNavigation('/features')}
                                className="block w-full text-left text-lg hover:text-primary transition-colors py-2"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => handleNavigation('/how-it-works')}
                                className="block w-full text-left text-lg hover:text-primary transition-colors py-2"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => handleNavigation('/about')}
                                className="block w-full text-left text-lg hover:text-primary transition-colors py-2"
                            >
                                About
                            </button>
                            <button
                                onClick={() => handleNavigation('/privacy')}
                                className="block w-full text-left text-lg hover:text-primary transition-colors py-2"
                            >
                                Privacy
                            </button>
                        </nav>

                        <div className="space-y-3 pt-6 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => handleNavigation('/signin')}
                                className="w-full"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => handleNavigation('/signup')}
                                className="w-full"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>

                    {/* Swipe indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                </div>
            </div>
        </>
    );
}