import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

const Playlist = ({ playlist, currentSongIndex, onSelect, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end justify-center md:items-center md:justify-end md:pr-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md h-[80%] md:h-[600px] bg-black/80 backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col border border-white/10 overflow-hidden relative"
                    >
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-10">
                            <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-white/10 rounded-lg shadow-lg">
                                    <Music size={20} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Current Queue</h2>
                                    <span className="text-xs font-medium text-zinc-400">{playlist.length} tracks</span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden no-scrollbar relative z-10">
                            {playlist.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => onSelect(index)}
                                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group border ${
                                        index === currentSongIndex 
                                        ? 'bg-white/10 border-white/10 shadow-lg backdrop-blur-md' 
                                        : 'hover:bg-white/5 border-transparent hover:border-white/5'
                                    }`}
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <img 
                                            src={song.image} 
                                            alt={song.name} 
                                            className={`w-full h-full object-cover rounded-lg shadow-md ${index === currentSongIndex ? 'opacity-100 ring-2 ring-cyan-500/50' : 'opacity-70 group-hover:opacity-100'}`}
                                        />
                                        {index === currentSongIndex && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold truncate text-sm mb-0.5 ${index === currentSongIndex ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                            {song.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 truncate group-hover:text-zinc-400">
                                            {song.artist}
                                        </p>
                                    </div>

                                    {index === currentSongIndex && (
                                        <div className="mr-2">
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-cyan-400 animate-[bounce_1s_infinite] h-2"></div>
                                                <div className="w-0.5 bg-cyan-400 animate-[bounce_1.2s_infinite] h-3"></div>
                                                <div className="w-0.5 bg-cyan-400 animate-[bounce_0.8s_infinite] h-1.5"></div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Playlist;
