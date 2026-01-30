import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MoreHorizontal, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const RightSidePlayer = () => {
    const { 
        currentSong, 
        currentSongIndex,
        playlist,
        isRightSidebarOpen, 
        setIsRightSidebarOpen, 
        likedSongs, 
        toggleLike 
    } = useMusic();

    if (!currentSong) return null;

    const isLiked = likedSongs.includes(currentSong.id);
    const nextSong = playlist[(currentSongIndex + 1) % playlist.length];

    return (
        <AnimatePresence>
            {isRightSidebarOpen && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-4 right-4 bottom-24 w-80 lg:w-96 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl z-40 overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 z-10">
                        <span className="text-lg font-bold text-white">Now Playing</span>
                        <button 
                            onClick={() => setIsRightSidebarOpen(false)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center p-5 space-y-6 overflow-y-auto no-scrollbar z-10">
                        
                        {/* Large Album Art - Rounded Square */}
                        <div className="w-64 aspect-square relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group flex-shrink-0">
                            <img 
                                src={currentSong.image} 
                                alt={currentSong.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Song Info */}
                        <div className="text-center w-full">
                            <motion.h2 
                                key={currentSong.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-white mb-2 truncate"
                            >
                                {currentSong.name}
                            </motion.h2>
                            <motion.p 
                                key={currentSong.artist}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-zinc-400 truncate"
                            >
                                {currentSong.artist}
                            </motion.p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between w-full px-4">
                            <button 
                                onClick={() => toggleLike(currentSong.id)}
                                className={`p-3 rounded-full transition-all ${isLiked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                            >
                                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                            
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>

                        {/* Up Next - Real Data */}
                        <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                <ListMusic size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Up Next</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0">
                                    <img 
                                        src={nextSong.image} 
                                        alt={nextSong.name} 
                                        className="w-full h-full object-cover opacity-80" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-white truncate">{nextSong.name}</h4>
                                    <p className="text-xs text-zinc-400 truncate">{nextSong.artist}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RightSidePlayer;
