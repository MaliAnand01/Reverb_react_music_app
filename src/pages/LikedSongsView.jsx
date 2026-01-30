import { useMusic } from '../context/MusicContext';
import { Play, Heart } from 'lucide-react';

const LikedSongsView = () => {
    const { playlist, playSong, likedSongs } = useMusic();

    // Filter playlist to get song objects for liked IDs
    // We need original index to play correctly? 
    // playSong (index) expects index in the original playlist.
    // So we need to store { song, originalIndex }
    
    const likedPlaylistItems = playlist
        .map((song, index) => ({ song, originalIndex: index }))
        .filter(item => likedSongs.includes(item.song.id));

    if (likedPlaylistItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Heart size={40} className="text-zinc-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">No Liked Songs Yet</h2>
                <p className="text-zinc-400 max-w-xs">Tap the heart icon on any song to save it to your collection.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-end gap-6 mb-8 p-8 bg-gradient-to-r from-cyan-900/40 to-black/40 rounded-3xl border border-white/5">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
                    <Heart size={48} className="text-white fill-white" />
                </div>
                <div>
                    <span className="text-sm font-bold uppercase tracking-widest text-white/60">Playlist</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-2">Liked Songs</h1>
                    <p className="text-zinc-300 font-medium">{likedPlaylistItems.length} songs</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {likedPlaylistItems.map(({ song, originalIndex }) => (
                    <div 
                        key={song.id} 
                        onClick={() => playSong(originalIndex)}
                        className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 p-5 rounded-2xl transition-all cursor-pointer group hover:scale-[1.03] backdrop-blur-md shadow-lg flex flex-col"
                    >
                        <div className="relative mb-4 w-full aspect-square">
                            <img src={song.image} alt={song.name} className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:shadow-2xl transition-all duration-500" />
                            <div className="absolute bottom-2 right-2 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-cyan-400 rounded-full p-3.5 shadow-xl hover:scale-105 hover:bg-cyan-300 shadow-black/30">
                                    <Play size={22} fill="black" stroke="black" className="ml-0.5 text-black" />
                                </div>
                            </div>
                        </div>
                        <h3 className="font-bold truncate mb-1 text-white group-hover:text-cyan-400 transition-colors">{song.name}</h3>
                        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedSongsView;
