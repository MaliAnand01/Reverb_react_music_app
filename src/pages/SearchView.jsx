import { useState, useEffect, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';
import { Search as SearchIcon, Play, Loader2, ListPlus, Radio, Plus } from 'lucide-react';
import { searchSongs } from '../utils/musicApi';
import { motion } from 'framer-motion';
import Skeleton from '../components/Skeleton';

const SearchView = () => {
    const { 
        searchResults, 
        setSearchResults, 
        playSearchedSong, 
        addToQueue, 
        playNext,
        openPlaylistModal
    } = useMusic();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Global Search Logic with Debounce
    useEffect(() => {
        const controller = new AbortController();
        
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsSearching(true);
                setError(null);
                try {
                    const results = await searchSongs(query);
                    // Check if component still mounted/query hasn't changed
                    if (!controller.signal.aborted) {
                        setSearchResults(results);
                        if (results.length === 0) {
                            // Legitimate no results or API error
                        }
                    }
                } catch (err) {
                    if (!controller.signal.aborted) {
                        setError("Connection slowed down. Please try again in a moment.");
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        setIsSearching(false);
                    }
                }
            } else if (query.trim().length === 0) {
                setSearchResults([]);
                setError(null);
            }
        }, 300); // Faster debounce for local search

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [query, setSearchResults]);

    const genres = [
        { name: 'Pop', color: 'from-pink-500 to-rose-500' },
        { name: 'Hip-Hop', color: 'from-orange-500 to-amber-500' },
        { name: 'Indie', color: 'from-emerald-500 to-teal-500' },
        { name: 'Rock', color: 'from-red-600 to-red-800' },
        { name: 'Chill', color: 'from-blue-500 to-indigo-500' },
        { name: 'Workout', color: 'from-cyan-500 to-blue-600' },
        { name: 'Focus', color: 'from-violet-500 to-purple-600' },
        { name: 'Jazz', color: 'from-yellow-600 to-yellow-800' },
    ];

    return (
        <div className="pb-24 pt-2 md:pt-4 space-y-6 md:space-y-8 h-full overflow-y-auto no-scrollbar px-3 md:px-6">
            
            {/* Search Input Hero */}
            <div className="relative max-w-2xl mx-auto group">
                <div className="relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 md:px-6 md:py-4 transition-all group-focus-within:bg-white/10 group-focus-within:border-white/20 shadow-xl">
                    {isSearching ? (
                        <Loader2 className="text-cyan-400 mr-3 md:mr-4 animate-spin" size={20} />
                    ) : (
                        <SearchIcon className="text-zinc-500 mr-3 md:mr-4 group-focus-within:text-white transition-colors" size={20} />
                    )}
                    <input 
                        type="text" 
                        placeholder="Search for songs, artists, or albums..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-white text-base md:text-lg placeholder:text-zinc-500 focus:outline-none font-medium" 
                    />
                </div>
            </div>

            {query ? (
                <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Top Results</h2>
                        {isSearching && <span className="text-xs text-zinc-500 animate-pulse">Searching...</span>}
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {isSearching && query ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-square rounded-2xl" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))
                        ) : (
                            searchResults.map((song) => (
                                <motion.div 
                                    key={song.id} 
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => playSearchedSong(song)}
                                    className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 p-3 md:p-4 rounded-2xl transition-all cursor-pointer group backdrop-blur-md shadow-lg flex flex-col"
                                >
                                <div className="relative mb-3 md:mb-4 w-full aspect-square">
                                    <img src={song.image} alt={song.name} className="w-full h-full object-cover rounded-xl shadow-lg group-hover:shadow-cyan-500/20 transition-all" />
                                    <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); playNext(song); }}
                                            className="bg-zinc-800/80 backdrop-blur-md rounded-full p-2 shadow-xl hover:scale-110 hover:bg-white hover:text-black text-white transition-all"
                                            title="Play Next"
                                        >
                                            <Radio size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); addToQueue(song); }}
                                            className="bg-zinc-800/80 backdrop-blur-md rounded-full p-2 shadow-xl hover:scale-110 hover:bg-white hover:text-black text-white transition-all"
                                            title="Add to Queue"
                                        >
                                            <ListPlus size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openPlaylistModal(song.id); }}
                                            className="bg-zinc-800/80 backdrop-blur-md rounded-full p-2 shadow-xl hover:scale-110 hover:bg-white hover:text-black text-white transition-all"
                                            title="Add to Playlist"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); playSearchedSong(song); }}
                                            className="bg-cyan-400 rounded-full p-2 shadow-xl hover:scale-110 hover:bg-white text-black transition-all"
                                            title="Play Now"
                                        >
                                            <Play size={16} fill="currentColor" stroke="currentColor" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold truncate text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                    {song.name}
                                </h3>
                            </motion.div>
                        ))
                    )}
                        
                        {!isSearching && query && searchResults.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                                <SearchIcon size={48} className="mx-auto text-zinc-700 mb-4" />
                                <p className="text-zinc-500 text-lg">No results found for "{query}"</p>
                                <p className="text-zinc-600 text-sm mt-2">Try searching for something else</p>
                            </div>
                        )}
                     </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold px-2">Browse All</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {genres.map((genre, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.05, y: -5, rotateZ: 1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`aspect-[4/3] rounded-2xl p-4 md:p-6 font-bold text-lg md:text-xl relative overflow-hidden cursor-pointer bg-gradient-to-br ${genre.color} shadow-lg group`}
                            >
                                <span className="relative z-10 text-white drop-shadow-md">{genre.name}</span>
                                <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-24 md:h-24 bg-white/20 rotate-[25deg] rounded-2xl blur-sm group-hover:rotate-12 transition-transform duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchView;
