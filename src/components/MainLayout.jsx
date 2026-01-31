import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import Playlist from './Playlist'; // Reusing existing playlist for mobile/overlay
import AuthModal from './AuthModal';
import RightSidePlayer from './RightSidePlayer';
import MobileTabBar from './MobileTabBar';
import MobilePlayer from './MobilePlayer';
// import Player from './Player'; // Reusing for mobile view if needed? Or just use PlayerBar for both?
// Actually, for "Spotify Style", PlayerBar is the way. 
// But on Mobile, usually it gives a mini player + full screen modal.
// For now, let's make the "Desktop" layout primary, and on mobile maybe hide Sidebar and show simpler view.

const MainLayout = ({ children, currentView, setCurrentView }) => {
    const { playlist, currentSongIndex, playSong, isPlaylistOpen, setIsPlaylistOpen } = useMusic();
    const { isAuthModalOpen, closeAuthModal } = useAuth();

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-cyan-500/30">
            
            {/* Animated Mesh Background (Aurora Theme) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/30 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-900/20 rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
            </div>

            <div className="flex flex-1 overflow-hidden relative z-10 p-2 md:p-4 gap-4">
                
                {/* Sidebar (Desktop) - Slim Dock */}
                <div className="hidden md:block w-24 h-full transition-all duration-500 relative z-20"> 
                    <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                </div>

                {/* Main Content Area - Glass Panel */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-white/5 rounded-[2rem] border border-white/5 shadow-xl">
                    
                    {/* View Content */}
                    <main className="flex-1 overflow-y-auto z-10 p-4 pb-52 md:p-8 md:pb-28 [&::-webkit-scrollbar]:hidden no-scrollbar">
                        {children}
                    </main>
                </div>
            </div>

            {/* Bottom Section - Consolidated for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:static md:z-auto">
                {/* Floating Player Bar */}
                <div className="px-4 pb-2 md:px-0 md:pb-0 md:fixed md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-5xl md:z-40">
                    <PlayerBar />
                </div>

                {/* Mobile Tab Bar */}
                <div className="md:hidden">
                    <MobileTabBar currentView={currentView} setCurrentView={setCurrentView} />
                </div>
            </div>

             {/* Playlist Overlay (Mobile/Global) */}
             <Playlist 
                playlist={playlist}
                currentSongIndex={currentSongIndex}
                onSelect={(index) => {
                    playSong(index);
                    setIsPlaylistOpen(false);
                }}
                isOpen={isPlaylistOpen}
                onClose={() => setIsPlaylistOpen(false)}
             />

             {/* Global Auth Modal */}
             <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

             {/* Right Side Player (Now Playing) */}
             <RightSidePlayer />

             <MobilePlayer />
        </div>
    );
};

export default MainLayout;
