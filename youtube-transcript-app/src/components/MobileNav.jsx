import { useNavigate, useLocation } from 'react-router-dom';
import { Library, Settings, Plus, Brain, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function MobileNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'fetch', path: '/fetch', label: 'Fetch', icon: Plus },
        { id: 'ai', path: '/ai-tools', label: 'AI', icon: Brain },
        { id: 'memories', path: '/memories', label: 'Memories', icon: Sparkles },
        { id: 'library', path: '/library', label: 'Library', icon: Library },
        { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Icon className={`h-6 w-6 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    );
                })}
                {/* Theme Toggle */}
                <div className="flex flex-col items-center justify-center flex-1 h-full">
                    <ThemeToggle />
                    <span className="text-xs font-medium text-muted-foreground">Theme</span>
                </div>
            </div>
        </nav>
    );
}
