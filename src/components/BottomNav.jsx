import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LayoutGrid, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav({ onOpenAdd }) {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: PlusCircle, label: 'Add', action: onOpenAdd },

        { icon: Search, label: 'Search', path: '/search' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center max-w-md mx-auto h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path === location.pathname;

                    if (item.path) {
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative group",
                                    isActive ? "text-electric-blue-500" : "text-slate-400 hover:text-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-electric-blue-500 rounded-b-full transition-all duration-300",
                                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                )} />
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="flex flex-col items-center justify-center w-16 h-full text-slate-400 hover:text-white transition-colors group"
                        >
                            <div className="bg-gradient-to-tr from-deep-violet-500 to-electric-blue-500 p-3 rounded-full shadow-lg shadow-deep-violet-500/30 transform group-hover:scale-110 transition-transform -mt-6 border-4 border-slate-900">
                                <Icon size={24} strokeWidth={2.5} className="text-white" />
                            </div>
                            <span className="text-[10px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">Add</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
