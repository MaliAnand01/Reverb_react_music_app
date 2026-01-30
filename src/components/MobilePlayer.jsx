import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, MoreHorizontal, Repeat, Shuffle, SkipBack, SkipForward, Play, Pause, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useRef, useState } from 'react';

const MobilePlayer = () => {
    const { 
        currentSong, 
        isPlaying, 
        togglePlay, 
        handleNext, 
        handlePrev, 
        currentTime, 
        duration, 
        seek,
        isMobilePlayerOpen,
        setIsMobilePlayerOpen,
        likedSongs,
        toggleLike,
        togglePlaylist
    } = useMusic();

    const [dragValue, setDragValue] = useState(null);

    const progressBarRef = useRef(null);

    // Derived state for progress
    const currentProgress = dragValue !== null ? dragValue : ((currentTime / duration) * 100 || 0);

    const handleSeekStart = () => setDragValue((currentTime / duration) * 100);
    
    const handleSeek = (e) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const width = rect.width;
        let percent = ((x - rect.left) / width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        setDragValue(percent);
    };

    const handleSeekEnd = (e) => {
        setDragValue(null);
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        // If it was a click (not drag), we need the position. 
        // If it was a drag end, we can use the last dragValue or calculate from event if available.
        // Touch end might not have clientX.
        // Easier: use the dragged value.
        // But let's keep original logic slightly modified:
        
        let percent;
        if (e.changedTouches || e.clientX) { // Mouse or Touch end with coords
             const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
             const width = rect.width;
             percent = ((x - rect.left) / width) * 100;
             percent = Math.max(0, Math.min(100, percent));
        } else {
             percent = dragValue;
        }
        
        if (percent != null) {
            const newTime = (percent / 100) * duration;
            seek(newTime);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentSong) return null;

    const isLiked = likedSongs.includes(currentSong.id);

    return (
        <AnimatePresence>
            {isMobilePlayerOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex flex-col md:hidden"
                >
                    {/* Background Ambience */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                         <img src={currentSong.image} className="w-full h-full object-cover opacity-20 blur-3xl scale-150" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 relative z-10">
                        <button 
                            onClick={() => setIsMobilePlayerOpen(false)}
                            className="p-2 text-white/80 hover:text-white"
                        >
                            <ChevronDown size={28} />
                        </button>
                        <span className="text-xs font-bold tracking-widest uppercase text-white/60">Now Playing</span>
                        <button 
                            onClick={togglePlaylist}
                            className="p-2 text-white/80 hover:text-white"
                        >
                            <ListMusic size={24} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col px-8 pb-12 relative z-10 justify-evenly">
                        
                        {/* Artwork */}
                        <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 mx-auto max-w-[350px]">
                            <img src={currentSong.image} alt={currentSong.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Info & Actions */}
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white truncate mb-1">{currentSong.name}</h1>
                                <p className="text-lg text-zinc-400 truncate">{currentSong.artist}</p>
                            </div>
                            <button 
                                onClick={() => toggleLike(currentSong.id)}
                                className={`p-3 rounded-full transition-all ${isLiked ? 'text-cyan-400' : 'text-zinc-400'}`}
                            >
                                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2 mt-8">
                            <div 
                                className="h-1.5 bg-white/10 rounded-full relative group cursor-pointer"
                                ref={progressBarRef}
                                onMouseDown={handleSeekStart}
                                onMouseMove={dragValue !== null ? handleSeek : undefined}
                                onMouseUp={handleSeekEnd}
                                onMouseLeave={() => dragValue !== null && setDragValue(null)}
                                onTouchStart={handleSeekStart}
                                onTouchMove={dragValue !== null ? handleSeek : undefined}
                                onTouchEnd={handleSeekEnd}
                            >
                                <div 
                                    className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-100 ease-out"
                                    style={{ width: `${currentProgress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-zinc-500">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-6">
                            <button className="text-zinc-500 hover:text-white transition-colors">
                                <Shuffle size={24} />
                            </button>
                            
                            <div className="flex items-center gap-6">
                                <button onClick={handlePrev} className="text-zinc-300 hover:text-white transition-colors">
                                    <SkipBack size={32} fill="currentColor" />
                                </button>
                                
                                <button 
                                    onClick={togglePlay}
                                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? (
                                        <Pause size={32} fill="black" className="text-black" />
                                    ) : (
                                        <Play size={32} fill="black" className="text-black ml-1" />
                                    )}
                                </button>

                                <button onClick={handleNext} className="text-zinc-300 hover:text-white transition-colors">
                                    <SkipForward size={32} fill="currentColor" />
                                </button>
                            </div>

                            <button className="text-zinc-500 hover:text-white transition-colors">
                                <Repeat size={24} />
                            </button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobilePlayer;
