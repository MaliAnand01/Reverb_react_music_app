import { useMusic } from '../context/MusicContext';
import { Play } from 'lucide-react';

const LibraryView = () => {
    const { playlist, playSong } = useMusic();

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Your Library</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {playlist.map((song, i) => (
                    <div 
                        key={song.id} 
                        onClick={() => playSong(i)}
                        className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 p-3 md:p-5 rounded-2xl transition-all cursor-pointer group hover:scale-[1.03] backdrop-blur-md shadow-lg flex flex-col"
                    >
                        <div className="relative mb-3 md:mb-4 w-full aspect-square">
                            <img src={song.image} alt={song.name} className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:shadow-2xl transition-all duration-500" />
                            <div className="absolute bottom-2 right-2 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-cyan-400 rounded-full p-2.5 md:p-3.5 shadow-xl hover:scale-105 hover:bg-cyan-300 shadow-black/30">
                                    <Play size={18} md:size={22} fill="black" stroke="black" className="ml-0.5 text-black" />
                                </div>
                            </div>
                        </div>
                        <h3 className="font-bold truncate mb-1 text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors">{song.name}</h3>
                        <p className="text-xs md:text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryView;
