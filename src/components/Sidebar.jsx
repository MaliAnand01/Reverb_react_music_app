import { Home, Search, Library, Heart, PlusSquare, AudioLines } from 'lucide-react';
import UserBadge from './UserBadge';

const NavItem = ({ icon: Icon, label, view, currentView, setCurrentView, activeColor = "text-cyan-400" }) => (
    <button 
        onClick={() => setCurrentView(view)}
        className={`relative group flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${currentView === view ? 'bg-white/10 text-white shadow-lg shadow-black/20 scale-105' : 'text-zinc-500 hover:bg-white/5 hover:text-white hover:scale-105'}`}
    >
        <Icon size={24} className={currentView === view ? activeColor : ""} />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-black/80 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap backdrop-blur-md border border-white/10 z-50">
            {label}
        </div>

        {/* Active Indicator */}
        {currentView === view && (
            <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full" />
        )}
    </button>
);

const Sidebar = ({ currentView, setCurrentView }) => {
    return (
        <div className="h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] flex flex-col items-center py-8 shadow-2xl relative">
            
            {/* Brand Icon */}
            <div className="mb-10 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 animate-pulse">
                <AudioLines size={24} className="text-white" />
            </div>

            {/* Main Nav */}
            <div className="flex flex-col gap-4 w-full items-center">
                <NavItem icon={Home} label="Home" view="home" currentView={currentView} setCurrentView={setCurrentView} />
                <NavItem icon={Search} label="Search" view="search" activeColor="text-cyan-400" currentView={currentView} setCurrentView={setCurrentView} />
                <NavItem icon={Library} label="Library" view="library" activeColor="text-emerald-400" currentView={currentView} setCurrentView={setCurrentView} />
            </div>

            {/* Playlists / Likes */}
            <div className="mt-10 flex flex-col gap-4 w-full items-center pt-8 border-t border-white/5">
                <button className="relative group w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
                    <PlusSquare size={22} className="text-zinc-400 group-hover:text-white" />
                     {/* Tooltip */}
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-black/80 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap backdrop-blur-md border border-white/10 z-50">
                        Create Playlist
                    </div>
                </button>

                <NavItem icon={Heart} label="Liked Songs" view="liked" activeColor="text-pink-500" currentView={currentView} setCurrentView={setCurrentView} />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* User Profile (Collapsed) */}
            <div className="mb-4">
                <div className="w-12 h-12">
                     <UserBadge setCurrentView={setCurrentView} collapsed={true} />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
