import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { Search as SearchIcon, Play } from 'lucide-react';

const SearchView = () => {
    const { playlist, playSong } = useMusic();
    const [query, setQuery] = useState("");

    const filtered = playlist.filter(song => 
        song.name.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase())
    );

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
        <div className="pb-24 pt-4 space-y-8">
            
            {/* Search Input Hero */}
            <div className="relative max-w-2xl mx-auto group">
                <div className="relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 transition-all group-focus-within:bg-white/10 group-focus-within:border-white/20 shadow-xl">
                    <SearchIcon className="text-zinc-500 mr-4 group-focus-within:text-white transition-colors" size={24} />
                    <input 
                        type="text" 
                        placeholder="What do you want to listen to?" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-white text-lg placeholder:text-zinc-500 focus:outline-none font-medium" 
                    />
                </div>
            </div>

            {query ? (
                <div className="space-y-6">
                     <h2 className="text-2xl font-bold px-2">Top Results</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filtered.map((song) => {
                             // Find original index
                             const originalIndex = playlist.findIndex(p => p.id === song.id);
                             return (
                                <div 
                                    key={song.id} 
                                    onClick={() => playSong(originalIndex)}
                                    className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 p-4 rounded-2xl transition-all cursor-pointer group hover:scale-[1.02] backdrop-blur-md shadow-lg flex flex-col"
                                >
                                    <div className="relative mb-4 w-full aspect-square">
                                        <img src={song.image} alt={song.name} className="w-full h-full object-cover rounded-xl shadow-lg group-hover:shadow-cyan-500/20 transition-all" />
                                        <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="bg-cyan-400 rounded-full p-3 shadow-xl hover:scale-105 hover:bg-white text-black">
                                                <Play size={20} fill="currentColor" stroke="currentColor" className="ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate mb-1 text-white group-hover:text-cyan-400 transition-colors">{song.name}</h3>
                                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                </div>
                             );
                        })}
                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <SearchIcon size={48} className="mx-auto text-zinc-700 mb-4" />
                                <p className="text-zinc-500 text-lg">No results found for "{query}"</p>
                            </div>
                        )}
                     </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold px-2">Browse All</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {genres.map((genre, i) => (
                            <div 
                                key={i} 
                                className={`aspect-[3/2] rounded-2xl p-6 font-bold text-2xl relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br ${genre.color} shadow-lg group`}
                            >
                                <span className="relative z-10 text-white drop-shadow-md">{genre.name}</span>
                                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-white/20 rotate-[25deg] rounded-2xl blur-sm group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchView;
