import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Library, Settings, LogOut, Plus, Brain, User, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar({ onSignOut, user }) {
    const navigate = useNavigate();
    const location = useLocation();

    // User profile is already in the user object from MongoDB
    const userProfile = {
        name: user?.name || localStorage.getItem('user_name'),
        photoURL: user?.photoURL || localStorage.getItem('user_photoURL')
    };

    const menuItems = [
        { id: 'fetch', path: '/fetch', label: 'Fetch Transcript', icon: Plus },
        { id: 'ai', path: '/ai-tools', label: 'AI Tools', icon: Brain },
        { id: 'memories', path: '/memories', label: 'Memories', icon: Sparkles },
        { id: 'library', path: '/library', label: 'My Library', icon: Library },
        { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="hidden md:flex w-80 bg-card border-r border-border h-screen flex-col">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-primary">yscrpt</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => navigate(item.path)}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <div className="flex-[3] flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {userProfile?.photoURL ? (
                                <img
                                    src={userProfile.photoURL}
                                    alt={userProfile.name || user.email}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {userProfile?.name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ThemeToggle className="w-full" />
                    </div>
                    <div className="flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-full"
                            onClick={onSignOut}
                            title="Sign Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
