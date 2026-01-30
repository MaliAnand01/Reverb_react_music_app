import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, ListMusic, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlbumArt from './AlbumArt';

const Player = ({ 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong, 
    currentTime, 
    duration, 
    seek, 
    volume, 
    setVolume,
    togglePlaylist,
    theme,
    toggleTheme
}) => {
    const [dragValue, setDragValue] = useState(null);

    const handleSeekChange = (e) => {
        setDragValue(Number(e.target.value));
    };

    const handleSeekEnd = (e) => {
         // handleSeekChange already updated dragValue, 
         // but onMouseUp/TouchEnd we need to commit.
         // Wait, range input 'onChange' fires while dragging.
         // 'value' in render should use dragValue if present.
         const val = Number(e.target.value);
         seek(val);
         setDragValue(null);
    };
    
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 z-10 relative">
            
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center mb-6 text-zinc-600 dark:text-zinc-400 transition-colors">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-zinc-800/50 rounded-full backdrop-blur-md shadow-sm"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
                <span className="uppercase text-xs tracking-widest font-semibold">Now Playing</span>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlaylist}
                    className="p-2 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-zinc-800/50 rounded-full backdrop-blur-md shadow-sm"
                >
                    <ListMusic size={20} />
                </motion.button>
            </div>

            {/* Album Art */}
            <div className="mb-6">
                 <AlbumArt image={currentSong.image} isPlaying={isPlaying} />
            </div>

            {/* Song Info */}
            <div className="text-center mb-4 h-14 w-full relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSong.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight transition-colors line-clamp-1 px-4">{currentSong.name}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium transition-colors line-clamp-1 px-4">{currentSong.artist}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6 group">
                <input 
                    type="range" 
                    min="0" 
                    max={duration || 100} 
                    value={dragValue !== null ? dragValue : currentTime} 
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
                />
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-500 font-medium mt-2 font-mono">
                    <span>{formatTime(dragValue !== null ? dragValue : currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full max-w-[80%] mb-6">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSong} 
                    className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                >
                    <SkipBack size={32} fill="currentColor" className="opacity-50" />
                </motion.button>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </motion.button>
                
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSong} 
                    className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                >
                    <SkipForward size={32} fill="currentColor" className="opacity-50" />
                </motion.button>
            </div>

            {/* Volume Control */}
            <div className="w-full flex items-center gap-4 px-4 py-3 bg-white/40 dark:bg-zinc-800/40 rounded-2xl backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 transition-colors shadow-sm">
                <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-300 hover:accent-zinc-700 dark:hover:accent-white"
                />
            </div>

        </div>
    );
};

export default Player;
