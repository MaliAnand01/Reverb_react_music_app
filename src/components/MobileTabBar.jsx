import { Home, Search, Library, Heart } from 'lucide-react';

const MobileTabBar = ({ currentView, setCurrentView }) => {
    
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'library', icon: Library, label: 'Library' },
        { id: 'liked', icon: Heart, label: 'Liked' }
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[96%] max-w-lg bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 z-50 md:hidden flex items-center px-4 h-20 overflow-hidden relative">
            
            {/* Glossy Reflection (Top) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-evenly w-full relative z-10">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`group flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 h-16 rounded-full relative`}
                        >
                            {/* Active Glow Background (Subtle) */}
                            {isActive && (
                                <div className="absolute inset-0 bg-white/5 rounded-full blur-md" />
                            )}

                            <div className={`p-1 transition-all z-10 ${isActive ? '-translate-y-1' : 'translate-y-0 group-hover:-translate-y-0.5'}`}>
                                <Icon 
                                    size={26} 
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                                    fill={isActive && item.id === 'liked' ? "currentColor" : "none"}
                                />
                            </div>
                            
                            {/* Active Dot - Floating below */}
                            {isActive && (
                                <div className="absolute bottom-3 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileTabBar;
